"use client";

// Her slim voice player (no boxes): gold round button, one line, thin bar.
// Same look as How to Feel Like a Woman and the approved Touch Map touch page.

import { useRef, useState } from "react";

export function SlimPlayer({ src, label, big }: { src: string; label: string; big?: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label={playing ? "Pause" : label}
        onClick={() => { const a = ref.current; if (!a) return; if (a.paused) a.play(); else a.pause(); }}
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#DDC98E] text-[#070707] shadow-[0_0_30px_-6px_rgba(221,201,142,0.8)] ${big ? "h-16 w-16 text-[18px]" : "h-12 w-12"}`}>
        {playing ? "❚❚" : "▶"}
      </button>
      <div className="flex-1">
        <p className={big ? "text-[17px]" : "text-[15px]"}>{label}</p>
        <div onClick={(e) => { const a = ref.current; if (!a || !dur) return; const r = e.currentTarget.getBoundingClientRect(); a.currentTime = ((e.clientX - r.left) / r.width) * dur; }}
          className="mt-2 h-[3px] cursor-pointer overflow-hidden rounded-full bg-[#DDC98E]/20">
          <div className="h-full bg-[#DDC98E]" style={{ width: dur ? `${(cur / dur) * 100}%` : "0%" }} />
        </div>
        <p className="mt-1.5 text-[12px] text-[#8f877a]">{playing || cur ? `${fmt(cur)} · ${fmt(Math.max(0, dur - cur))} left` : "In Juliette’s voice"}</p>
      </div>
      <audio ref={ref} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} />
    </div>
  );
}
