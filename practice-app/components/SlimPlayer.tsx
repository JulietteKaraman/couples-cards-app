"use client";

// Her slim voice player (no boxes): gold round button, one line, thin bar.
// Same look as How to Feel Like a Woman and the approved Touch Map touch page.

import { useEffect, useRef, useState } from "react";

// Speed, up to 1.5x and never above (Juliette, 2 Nov 2026). Remembered on this phone
// for every player in the app.
const SPEEDS = [1, 1.25, 1.5];
const SPEED_KEY = "ffy.voice.rate"; // the same key as VoicePlayer, so one choice works everywhere
export function savedSpeed() {
  try { const v = Number(localStorage.getItem(SPEED_KEY)); return SPEEDS.includes(v) ? v : 1; } catch { return 1; }
}
export function saveSpeed(v: number) { try { localStorage.setItem(SPEED_KEY, String(v)); window.dispatchEvent(new Event("ffy-voice-rate")); } catch {} }

export function SlimPlayer({ src, label, big }: { src: string; label: string; big?: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  useEffect(() => { setRate(savedSpeed()); }, []); // eslint-disable-line react-hooks/set-state-in-effect
  const apply = (r: number) => { const a = ref.current; if (a) { a.defaultPlaybackRate = r; a.playbackRate = r; } };
  const cycle = () => { const r = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length]; setRate(r); saveSpeed(r); apply(r); };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label={playing ? "Pause" : label}
        onClick={() => { const a = ref.current; if (!a) return; if (a.paused) a.play(); else a.pause(); }}
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#DDC98E] text-[#070707] shadow-[0_0_30px_-6px_rgba(221,201,142,0.8)] ${big ? "h-16 w-16 text-[18px]" : "h-12 w-12"}`}>
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={big ? "text-[17px]" : "text-[15px]"}>{label}</p>
          <button type="button" onClick={cycle} aria-label={`Speed ${rate}x, tap to change`}
            className="shrink-0 rounded-full border border-[#DDC98E]/50 px-2.5 py-1 text-[12px] text-[#DDC98E]">{rate}x</button>
        </div>
        <div onClick={(e) => { const a = ref.current; if (!a || !dur) return; const r = e.currentTarget.getBoundingClientRect(); a.currentTime = ((e.clientX - r.left) / r.width) * dur; }}
          className="mt-2 h-[3px] cursor-pointer overflow-hidden rounded-full bg-[#DDC98E]/20">
          <div className="h-full bg-[#DDC98E]" style={{ width: dur ? `${(cur / dur) * 100}%` : "0%" }} />
        </div>
        <p className="mt-1.5 text-[12px] text-[#8f877a]">{playing || cur ? `${fmt(cur)} · ${fmt(Math.max(0, dur - cur))} left` : "In Juliette’s voice"}</p>
      </div>
      <audio ref={ref} src={src} preload="metadata" onPlay={() => { apply(rate); setPlaying(true); }} onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} />
    </div>
  );
}
