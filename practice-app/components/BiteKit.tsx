"use client";

// Shared by the funnel bites in the app (When She Stops Reaching, The Full Stop).
// 2 Nov 2026: the look Juliette approved.

import Image from "next/image";
import { useEffect, useState } from "react";
import { SlimPlayer } from "@/components/SlimPlayer";

// The same three colours as Scrumptious Stroking. About him, never about her distance.
export const FEELS = [
  { id: "little", label: "Very little", color: "#2c7a72" },
  { id: "bit", label: "A bit", color: "#A88538" },
  { id: "range", label: "A whole range", color: "#EEDE80" },
] as const;
export const PLAIN_GOLD = "#DDC98E";

// Browser storage can be blocked. The page must still work (E6).
export function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* this visit only */
  }
}

export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={`frag ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

// Her slim player. If a recording can't load, it doesn't show (E4).
export function Voice({ id, src, label }: { id?: string; src: string; label: string }) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.onerror = () => setOk(false);
    probe.src = src;
    return () => {
      probe.onerror = null;
      probe.removeAttribute("src");
    };
  }, [src]);
  if (!ok) return null;
  return (
    <div id={id} className="my-5">
      <SlimPlayer src={src} label={label} />
    </div>
  );
}

export function Photo({ src, alt, pos = "50% 30%" }: { src: string; alt: string; pos?: string }) {
  return (
    <div className="relative mb-7 h-56 overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] sm:h-72">
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" style={{ objectPosition: pos }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/70 to-transparent" />
    </div>
  );
}

export const BITE_CSS = `
        .wssr h2{font-family:var(--font-display);font-weight:300;font-size:32px;line-height:1.12;margin:6px 0 18px}
        .wssr h3{font-family:var(--font-display);font-weight:300;font-size:24px;margin:0 0 8px}
        .wssr .frag p,.wssr .dstep > p{font-size:17px;line-height:1.65;color:#cfc8bb;margin:0 0 14px}
        .wssr .kicker,.wssr .partno{font-size:11px!important;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#DDC98E!important;margin:0 0 6px}
        .wssr p.lead{font-family:var(--font-display);font-weight:300;font-size:22px;line-height:1.35;color:#f1ece2;margin:22px 0 14px}
        .wssr p.big{font-family:var(--font-display);font-weight:300;font-size:26px;line-height:1.28;color:#f1ece2;margin:30px 0}
        .wssr p.big em,.wssr .big em{font-style:normal;color:#EEDE80}
        .wssr p.quiet{color:#a79f90}
        .wssr .thoughts{margin:20px 0;padding-left:16px;border-left:1px solid rgba(221,201,142,.4)}
        .wssr .thoughts p{color:#a79f90;margin:0 0 8px}
        .wssr .say{margin:18px 0;padding:18px;border-left:2px solid #DDC98E;background:rgba(13,53,53,.45);border-radius:0 16px 16px 0;font-family:var(--font-display);font-weight:300;font-size:19px;line-height:1.4;color:#f1ece2}
        .wssr .say small{display:block;font-family:var(--font-body);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#a79f90;margin-bottom:8px}
        .wssr ol.parts,.wssr ol.steps{list-style:none;margin:14px 0;padding:0}
        .wssr ol.parts li,.wssr ol.steps li{display:grid;grid-template-columns:36px 1fr;gap:12px;padding:18px 0;border-bottom:1px solid rgba(221,201,142,.2)}
        .wssr ol.parts li:last-child,.wssr ol.steps li:last-child{border-bottom:0}
        .wssr .n{font-family:var(--font-display);font-weight:300;font-size:28px;line-height:1;color:#DDC98E}
        .wssr ol.parts b,.wssr ol.steps b{display:block;font-family:var(--font-display);font-weight:500;font-size:18px;color:#f1ece2;margin-bottom:6px}
        .wssr ol.parts p,.wssr ol.steps p{margin:0 0 8px;font-size:16px}
        .wssr img.hand{width:96px;height:auto;margin:6px 0 14px}
        .wssr .mantra{margin:14px 0 24px}
        .wssr .mantra div{font-family:var(--font-display);font-weight:300;font-size:21px;line-height:1.5;color:#f1ece2}
        .wssr .silence{margin:32px 0;padding:24px 20px;border:1.5px solid rgba(221,201,142,.55);border-radius:24px;background:rgba(13,53,53,.45)}
        .wssr .silence h2{font-size:26px}
        .wssr ul.no,.wssr ul.rules,.wssr ul.dots{list-style:none;margin:12px 0 18px;padding:0}
        .wssr ul.no li{padding:6px 0 6px 26px;position:relative;color:#a79f90;font-size:16px}
        .wssr ul.no li::before{content:"×";position:absolute;left:4px;color:#DDC98E}
        .wssr ul.rules li{padding:6px 0 6px 18px;position:relative;color:#cfc8bb;font-size:16px;border-left:1px solid rgba(221,201,142,.4)}
        .wssr ul.dots li{padding:6px 0 6px 18px;position:relative;color:#cfc8bb;font-size:16px}
        .wssr ul.dots li::before{content:"";position:absolute;left:2px;top:15px;width:6px;height:6px;border-radius:50%;background:#DDC98E}
        .wssr ol.qs{margin:14px 0 18px;padding-left:22px;color:#f1ece2;font-size:17px;line-height:1.5}
        .wssr ol.qs li{margin-bottom:10px}
        .wssr .shot img{width:100%;height:auto;border-radius:16px;margin-top:20px}
        .wssr p.shotcap{font-size:13px;color:#8f877a;margin-top:8px}
        .wssr details{border-top:1px solid rgba(221,201,142,.25);padding:4px 0}
        .wssr details:last-of-type{border-bottom:1px solid rgba(221,201,142,.25)}
        .wssr summary{display:flex;justify-content:space-between;gap:14px;align-items:center;min-height:52px;cursor:pointer;list-style:none;font-size:16px;color:#f1ece2}
        .wssr summary::-webkit-details-marker{display:none}
        .wssr summary small{display:block;font-size:13px;color:#a79f90;margin-top:2px}
        .wssr summary .pl{color:#DDC98E;font-size:20px;transition:transform .2s}
        .wssr details[open] .pl{transform:rotate(45deg)}
        .wssr .dbody{padding:4px 0 12px}
        .wssr .faq{margin-top:34px}
        .wssr .endcard{padding:24px 20px;border:1.5px solid rgba(221,201,142,.55);border-radius:24px;background:rgba(13,53,53,.45)}
        .wssr .dstep{margin-top:18px;padding:20px;border:1px solid rgba(221,201,142,.3);border-radius:24px;background:rgba(13,53,53,.28)}
        .wssr p.dn{display:grid;grid-template-columns:34px 1fr;margin:0 0 12px;line-height:1.3}
        .wssr p.dn span{grid-row:1/3;font-family:var(--font-display);font-weight:300;font-size:28px;line-height:1;color:#DDC98E}
        .wssr p.dn b{font-family:var(--font-display);font-weight:500;font-size:18px;color:#f1ece2}
        .wssr p.dn small{font-size:13px;color:#a79f90}
        @keyframes wssrDone{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
        .wssr-done{animation:wssrDone .6s cubic-bezier(.2,.8,.2,1) both}
        @media (prefers-reduced-motion:reduce){.wssr-done{animation:none}}
        .wssr .leak{margin:18px 0;padding:20px;border:1px solid rgba(221,201,142,.3);border-radius:24px;background:rgba(13,53,53,.28)}
        .wssr .leak .n{display:block}
        .wssr .leak h3{margin:8px 0 10px}
        .wssr .leak .ex{font-family:var(--font-display);font-weight:300;font-size:19px;color:#f1ece2;margin:12px 0}
        .wssr .leak .ex s{text-decoration:none;color:#EEDE80;font-style:italic}
        .wssr .examples{display:grid;gap:8px;margin:18px 0 26px}
        .wssr .examples div{padding:14px 18px;border-radius:16px;background:rgba(13,53,53,.6);font-family:var(--font-display);font-weight:300;font-size:18px;color:#f1ece2}
      `;
