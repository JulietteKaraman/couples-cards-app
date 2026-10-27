"use client";

import { useState } from "react";

// "Tell me how it went" (27 Oct): same card as the buyer pages. Instagram
// cannot pre-fill a DM, so the first line is copied for him to paste.
export function TellMe({ line }: { line: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-10 rounded-[22px] border border-[#DDC98E] bg-gradient-to-b from-[#0D3535]/50 to-[#211e19] px-5 py-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Tell me how it went</p>
      <h3 className="mt-2.5 font-display text-[26px] font-light leading-tight text-[#f1ece2]">I&rsquo;d love to hear what came up for you.</h3>
      <p className="mt-2.5 text-[#a79f90]">What did you notice? What surprised you? A line is plenty.</p>
      <a
        href="https://ig.me/m/juliettekaraman"
        target="_blank"
        rel="noopener"
        onClick={() => { try { navigator.clipboard.writeText(line).then(() => setCopied(true)); } catch {} }}
        className="mt-5 inline-block rounded-full bg-[#DDC98E] px-6 py-3.5 font-display text-[17px] font-medium text-[#1a1814]"
      >
        Message me on Instagram →
      </a>
      <p className="mt-3.5 text-[13px] italic text-[#a79f90]">
        {copied ? "Copied. Paste it in, then tell me what came up for you." : `Tap, and your first line is ready to paste: \u201c${line.trim()} \u2026\u201d`}
      </p>
    </div>
  );
}
