"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The Practice App timer.
 *
 * Ported from the cards app (card-engine/app/index.html), which Juliette has
 * been using since 23 Sep 2026, so the behaviour and the chime are the ones
 * she already knows. Three things that matter and are easy to get wrong:
 *
 *  1. CLOCK BASED, not interval counting. A phone that locks or backgrounds
 *     throttles setInterval, so a counter drifts and a 3 minute container
 *     quietly becomes 5. This stores an end timestamp and reads the clock.
 *  2. SCREEN STAYS AWAKE. Both hands are busy. Nobody can tap to wake a phone
 *     in the middle of Skin to Skin.
 *  3. IT CHIMES. Her Skin to Skin recording literally says "when the bell
 *     sounds", so a silent countdown breaks the audio. Web Audio has to be
 *     unlocked inside the click that starts the timer or iOS stays mute.
 */

const LABELS: Record<string, string> = {};

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PracticeTimer({
  minutes,
  label,
  dark = false,
}: {
  minutes: number[];
  label?: string;
  dark?: boolean;
}) {
  const options = minutes.length ? minutes : [3];
  const [chosen, setChosen] = useState(options[0]);
  const [remaining, setRemaining] = useState(options[0] * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const endAt = useRef(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const lock = useRef<WakeLockSentinel | null>(null);
  const actx = useRef<AudioContext | null>(null);

  const sleep = useCallback(() => {
    try {
      lock.current?.release();
    } catch {
      /* not supported, or already gone */
    }
    lock.current = null;
  }, []);

  const wake = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        lock.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      /* Safari, or the user denied it. The timer still runs. */
    }
  }, []);

  // Her chime, five partials rung twice, exactly as the cards app makes it.
  const chime = useCallback(() => {
    const ctx = actx.current;
    if (!ctx) return;
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    const partials: [number, number, number][] = [
      [196, 1, 7],
      [392, 0.5, 5],
      [588, 0.28, 4],
      [784, 0.16, 3],
      [1176, 0.08, 2.2],
    ];
    partials.forEach(([f, v, d]) => {
      [0, 2.6].forEach((off) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f * (1 + Math.random() * 0.002);
        g.gain.setValueAtTime(0.0001, t + off);
        g.gain.exponentialRampToValueAtTime(v, t + off + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + off + d);
        o.connect(g).connect(master);
        o.start(t + off);
        o.stop(t + off + d + 0.1);
      });
    });
  }, []);

  const stopTick = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
  }, []);

  const finish = useCallback(() => {
    stopTick();
    setRunning(false);
    setDone(true);
    setRemaining(0);
    sleep();
    chime();
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {
      /* desktop */
    }
  }, [chime, sleep, stopTick]);

  const read = useCallback(() => {
    const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
    setRemaining(left);
    if (left <= 0) finish();
  }, [finish]);

  // Coming back from a locked screen: re-take the wake lock (it is dropped on
  // hide) and re-read the clock immediately rather than waiting for the tick.
  useEffect(() => {
    const onVis = () => {
      if (tick.current && document.visibilityState === "visible") {
        void wake();
        read();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [read, wake]);

  useEffect(() => {
    return () => {
      stopTick();
      sleep();
    };
  }, [sleep, stopTick]);

  function pick(m: number) {
    if (running) return;
    stopTick();
    setChosen(m);
    setRemaining(m * 60);
    setDone(false);
  }

  function toggle() {
    if (running) {
      stopTick();
      setRunning(false);
      sleep();
      return;
    }
    // Must happen inside the user gesture or iOS never makes a sound.
    try {
      actx.current =
        actx.current ||
        new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (actx.current.state === "suspended") void actx.current.resume();
      const o = actx.current.createOscillator();
      const g = actx.current.createGain();
      g.gain.value = 0;
      o.connect(g).connect(actx.current.destination);
      o.start();
      o.stop(actx.current.currentTime + 0.01);
    } catch {
      /* no audio available, the timer still counts */
    }
    void wake();
    const left = remaining > 0 ? remaining : chosen * 60;
    endAt.current = Date.now() + left * 1000;
    setDone(false);
    setRunning(true);
    tick.current = setInterval(read, 500);
    read();
  }

  function reset() {
    stopTick();
    setRunning(false);
    setDone(false);
    setRemaining(chosen * 60);
    sleep();
  }

  const paused = !running && remaining > 0 && remaining < chosen * 60;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border px-5 py-5 ${
        dark ? "border-ffy-gold/40 bg-white/5" : "border-ffy-gold/60 bg-ffy-cream-2"
      }`}
    >
      <p
        className={`text-xs uppercase tracking-wide ${
          dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"
        }`}
      >
        {label ?? "Your container"}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`font-mono text-4xl tabular-nums ${done ? "opacity-60" : ""} ${
            dark ? "text-white" : "text-ffy-black"
          }`}
          aria-live="off"
        >
          {done ? "Done" : fmt(remaining)}
        </span>

        {options.length > 1 && (
          <div className="flex gap-2" role="group" aria-label="How long">
            {options.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => pick(m)}
                disabled={running}
                aria-pressed={m === chosen}
                className={`rounded-full border px-3 py-1 text-sm transition disabled:opacity-40 ${
                  m === chosen
                    ? "border-ffy-gold bg-ffy-gold text-white"
                    : dark
                      ? "border-ffy-gold/40 text-ffy-gold-pale"
                      : "border-ffy-gold/60 text-ffy-gold-deep"
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-full bg-ffy-gold px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {running ? "Pause" : paused ? "Resume" : done ? "Again" : "Start"}
          </button>
          {(paused || done) && (
            <button
              type="button"
              onClick={reset}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                dark ? "border-ffy-gold/40 text-ffy-gold-pale" : "border-ffy-gold/60 text-ffy-gold-deep"
              }`}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className={`text-sm ${dark ? "text-white/70" : "text-ffy-black/70"}`}>
        {done
          ? "That is the container closed. Stop here, even if it was going beautifully."
          : "Your screen stays awake and it chimes softly at the end, so neither of you has to watch it."}
      </p>
    </div>
  );
}
