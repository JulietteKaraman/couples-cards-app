"use client";

import { useEffect, useState } from "react";

// 24 Nov 2026 (Juliette): the app's front page explains how to keep the app on your phone, like Confessions does.
// One line that opens into the steps. Hidden once the app is already on their home screen.
export function AppHomeScreen() {
  const [state, setState] = useState<"hidden" | "line" | "open">("hidden");
  useEffect(() => {
    let standalone = false;
    try {
      standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
    } catch { /* treat as a browser */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- only knowable after mount
    if (!standalone) setState("line");
  }, []);
  if (state === "hidden") return null;
  if (state === "line") return (
    <button type="button" onClick={() => setState("open")} className="mt-4 flex min-h-[48px] w-full items-center justify-between rounded-2xl border border-[#DDC98E]/40 px-4 text-left text-[14px] text-ffy-cream">
      <span><span className="text-[#DDC98E]">Keep the app on your phone</span>, one tap next time</span>
      <span className="shrink-0 text-[#DDC98E]">How &rarr;</span>
    </button>
  );
  return (
    <div className="mt-4 rounded-2xl border border-[#DDC98E]/40 p-4 text-[14px] leading-relaxed text-[rgba(254,252,250,0.8)]" data-testid="app-home-screen">
      <p className="text-ffy-cream"><span className="text-[#DDC98E]">Keep the app on your phone</span>, so it opens in one tap, like any other app.</p>
      <p className="mt-3"><b className="font-medium text-ffy-cream">iPhone</b></p>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li>Open this page in <b className="font-medium text-ffy-cream">Safari</b>. If you came from Instagram, Facebook or an email, tap the three dots or the compass and choose &ldquo;Open in Safari&rdquo; first.</li>
        <li>Tap the <b className="font-medium text-ffy-cream">Share</b> button: the square with the arrow pointing up. On newer iPhones, tap the three dots first, then Share.</li>
        <li>Scroll down and tap <b className="font-medium text-ffy-cream">Add to Home Screen</b>, then <b className="font-medium text-ffy-cream">Add</b>.</li>
      </ol>
      <p className="mt-3"><b className="font-medium text-ffy-cream">Android</b></p>
      <ol className="mt-1 list-decimal space-y-1 pl-5">
        <li>Open this page in <b className="font-medium text-ffy-cream">Chrome</b>.</li>
        <li>Tap the three dots at the top right, then <b className="font-medium text-ffy-cream">Add to Home screen</b> (or Install app).</li>
      </ol>
      <p className="mt-3">It appears on your phone as <b className="font-medium text-ffy-cream">FFY the App</b>.</p>
      <button type="button" onClick={() => setState("line")} className="mt-3 min-h-[40px] text-[13px] text-[#DDC98E] underline underline-offset-4">Close</button>
    </div>
  );
}
