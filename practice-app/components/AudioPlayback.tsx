"use client";

// iPhone, 30 Oct 2026: from the home-screen app with the silent switch on, iOS
// muted every voice in the app (Touch Base, Scrumptious Stroking, the wrist).
// Asking for a "playback" audio session makes her voice play like a podcast app,
// whatever the switch says. Safari 16.4+; older phones ignore it harmlessly.
import { useEffect } from "react";

export function AudioPlayback() {
  useEffect(() => {
    const set = () => {
      try {
        const n = navigator as unknown as { audioSession?: { type: string } };
        if (n.audioSession && n.audioSession.type !== "playback") n.audioSession.type = "playback";
      } catch {}
    };
    set();
    window.addEventListener("pointerdown", set, { capture: true });
    window.addEventListener("touchstart", set, { capture: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", set, { capture: true });
      window.removeEventListener("touchstart", set, { capture: true });
    };
  }, []);
  return null;
}
