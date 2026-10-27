"use client";

import { useEffect, useRef, useState } from "react";

// Juliette's recordings, played from the app itself (24 Oct 2026). Replaces
// the Google Drive boxes: a gold play button, her label, a progress line you
// can tap to move through it, and the time. Started by a tap, so it keeps
// playing with the phone locked.

// Listening speed, shared by every player and remembered on this phone.
const RATES = [1, 1.25, 1.5];
const RATE_KEY = "ffy.voice.rate";
const readRate = () => {
  try { const r = Number(localStorage.getItem(RATE_KEY)); return RATES.includes(r) ? r : 1; } catch { return 1; }
};

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};

export default function VoicePlayer({
  src,
  label,
  dark = false,
}: {
  src: string;
  label: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    setRate(readRate());
    const onRate = () => setRate(readRate());
    window.addEventListener("ffy-voice-rate", onRate);
    return () => window.removeEventListener("ffy-voice-rate", onRate);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = rate;
  }, [rate]);

  const nextRate = () => {
    const n = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    try { localStorage.setItem(RATE_KEY, String(n)); } catch {}
    setRate(n);
    window.dispatchEvent(new Event("ffy-voice-rate"));
  };

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onMeta = () => setDur(a.duration);
    const onPlay = () => { a.playbackRate = readRate(); setPlaying(true); setLoading(false); };
    const onPause = () => setPlaying(false);
    const onWait = () => setLoading(true);
    const onCan = () => setLoading(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    a.addEventListener("waiting", onWait);
    a.addEventListener("canplay", onCan);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
      a.removeEventListener("waiting", onWait);
      a.removeEventListener("canplay", onCan);
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      // Only one of her recordings plays at a time on a page.
      document.querySelectorAll("audio").forEach((x) => { if (x !== a) x.pause(); });
      setLoading(true);
      a.play().catch(() => setLoading(false));
    } else a.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = ref.current;
    if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur));
  };

  const pct = dur ? (t / dur) * 100 : 0;

  return (
    <div
      className={`my-2 rounded-3xl border-[1.5px] p-5 sm:p-6 ${
        dark
          ? "border-[rgba(221,201,142,0.6)] bg-[rgba(13,53,53,0.6)] shadow-[0_0_50px_-20px_rgba(221,201,142,0.55)]"
          : "border-ffy-gold bg-gradient-to-br from-ffy-cream-2 to-ffy-gold-soft/25"
      }`}
    >
      <audio ref={ref} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : `Play: ${label}`}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition ${
            dark ? "bg-[#DDC98E] text-[#070707] hover:bg-[#EEDE80]" : "bg-ffy-gold text-white"
          } ${playing ? "shadow-[0_0_24px_rgba(221,201,142,0.7)]" : ""}`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[1px]" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] uppercase tracking-[0.18em] ${dark ? "text-[#DDC98E]" : "text-ffy-gold-deep"}`}>
            In Juliette&rsquo;s voice
          </p>
          <p className={`mt-1 font-display text-lg leading-snug ${dark ? "font-light text-ffy-cream" : "font-semibold text-ffy-teal"}`}>
            {label}
          </p>
        </div>
      </div>
      <div
        role="slider"
        aria-label="Position in the recording"
        aria-valuemin={0}
        aria-valuemax={Math.round(dur)}
        aria-valuenow={Math.round(t)}
        tabIndex={0}
        onClick={seek}
        className="mt-5 cursor-pointer py-2"
      >
        <div className={`h-1.5 overflow-hidden rounded-full ${dark ? "bg-[rgba(221,201,142,0.18)]" : "bg-ffy-gold/20"}`}>
          <div className={`h-full rounded-full ${dark ? "bg-[#DDC98E]" : "bg-ffy-gold"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className={`flex items-center justify-between text-xs tabular-nums ${dark ? "text-[rgba(254,252,250,0.7)]" : "text-ffy-black/55"}`}>
        <span>{loading ? "Loading" : fmt(t)}</span>
        <button
          type="button"
          onClick={nextRate}
          aria-label="Listening speed"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            dark ? "border-[rgba(221,201,142,0.5)] text-[#DDC98E]" : "border-ffy-gold/60 text-ffy-gold-deep"
          }`}
        >
          {rate === 1 ? "1" : rate}&times;
        </button>
        <span>{dur ? `-${fmt(dur - t)}` : ""}</span>
      </div>
    </div>
  );
}
