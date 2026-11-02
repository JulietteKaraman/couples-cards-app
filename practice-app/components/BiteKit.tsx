"use client";

// Shared by the funnel bites in the app (When She Stops Reaching, The Full Stop).
// 2 Nov 2026: the look Juliette approved.

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";

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

// A little buzz under the thumb, where the phone allows it.
const buzz = () => {
  try {
    navigator.vibrate?.(12);
  } catch {
    /* not every phone */
  }
};

function hint(before: Element, text: string) {
  const h = document.createElement("p");
  h.className = "taphint";
  h.textContent = text;
  before.parentElement?.insertBefore(h, before);
  return h;
}

// Her words stay exactly as written. This only makes some of them something to
// touch: 2 Nov 2026, Juliette wanted the bites "more interactive and poppy", like
// 31 Touch Points. Runs once per fragment after the page is on the phone.
function enhance(root: HTMLElement) {
  if (root.dataset.enhanced) return;
  root.dataset.enhanced = "1";

  // Thoughts arrive one tap at a time.
  root.querySelectorAll<HTMLElement>(".thoughts").forEach((box) => {
    const lines = Array.from(box.querySelectorAll("p"));
    if (lines.length < 2) return;
    box.classList.add("tap");
    lines[0].classList.add("on");
    const h = hint(box, "Tap for the next one");
    box.addEventListener("click", () => {
      const next = lines.find((l) => !l.classList.contains("on"));
      if (!next) return;
      next.classList.add("on");
      buzz();
      if (lines.every((l) => l.classList.contains("on"))) h.remove();
    });
  });

  // The stories he tells himself get crossed out.
  root.querySelectorAll<HTMLElement>("ul.no").forEach((list) => {
    const items = Array.from(list.querySelectorAll("li"));
    list.classList.add("tap");
    const h = hint(list, "Tap each one to cross it out");
    items.forEach((li) => li.addEventListener("click", () => {
      li.classList.toggle("gone");
      buzz();
      if (items.every((x) => x.classList.contains("gone"))) {
        h.remove();
        list.parentElement?.querySelector("p.last")?.classList.add("glow");
      }
    }));
  });

  // Steps tick off as he goes.
  root.querySelectorAll<HTMLElement>("ol.steps").forEach((list) => {
    list.classList.add("tap");
    hint(list, "Tap each one as you do it");
    list.querySelectorAll("li").forEach((li) => li.addEventListener("click", () => { li.classList.toggle("done"); buzz(); }));
  });

  // The mantra lights up line by line.
  root.querySelectorAll<HTMLElement>(".mantra").forEach((box) => {
    const lines = Array.from(box.querySelectorAll("div"));
    box.classList.add("tap");
    const h = hint(box, "Tap to light each one");
    lines.forEach((l) => l.addEventListener("click", () => {
      l.classList.add("on");
      buzz();
      if (lines.every((x) => x.classList.contains("on"))) h.remove();
    }));
  });

  // The question comes off the end of the sentence.
  root.querySelectorAll<HTMLElement>(".ex s").forEach((q) => {
    const ex = q.closest(".ex");
    if (!ex) return;
    ex.classList.add("tap");
    const h = hint(ex, "Tap the question to take it off");
    q.addEventListener("click", () => { q.classList.add("gone"); buzz(); h.remove(); });
  });

  // Plays when the step appears, and always ends fully visible. Never tied to
  // scrolling, so her words can't get stuck hidden on a slow phone.
  // The loop lights up one step at a time.
  root.querySelectorAll<HTMLElement>(".loop").forEach((box) => {
    const parts = Array.from(box.querySelectorAll<HTMLElement>(":scope > span:not(.ar)"));
    if (parts.length < 2) return;
    box.classList.add("tap");
    const h = hint(box, "Tap to go round it");
    box.addEventListener("click", () => {
      const next = parts.find((x) => !x.classList.contains("on"));
      if (next) next.classList.add("on");
      else parts.forEach((x) => x.classList.remove("on"));
      buzz();
      h.remove();
    });
  });

  // Seven days: the first is open, the rest arrive one morning at a time.
  root.querySelectorAll<HTMLElement>(".seven").forEach((box) => {
    const days = Array.from(box.querySelectorAll<HTMLElement>(":scope > div"));
    box.classList.add("tap");
    days.forEach((d, i) => { if (i > 0) d.classList.add("locked"); d.addEventListener("click", () => { d.classList.remove("wiggle"); void d.offsetWidth; d.classList.add("wiggle"); buzz(); }); });
  });

  root.querySelectorAll<HTMLElement>(":scope > *").forEach((el, i) => {
    el.style.setProperty("--i", String(Math.min(i, 7)));
    el.classList.add("pop");
  });
}

export function Html({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Same object every render, or React rewrites the text and undoes every tap.
  const inner = useMemo(() => ({ __html: html }), [html]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    enhance(el);
  }, []);
  return <div ref={ref} className={`frag ${className ?? ""}`} dangerouslySetInnerHTML={inner} />;
}

// Juliette, 2 Nov 2026, from her own iPhone: with the phone on mute nothing plays,
// voice or video, however high the volume is.
export function MuteNote() {
  return (
    <p className="mt-5 rounded-2xl border border-[#DDC98E]/40 bg-[rgba(13,53,53,0.45)] px-4 py-3 text-[14px] leading-relaxed text-[#f1ece2]">
      <span className="text-[#DDC98E]">Sound on.</span> Make sure your phone is off mute. Even if you turn the volume up, it won&rsquo;t play while your phone is on mute.
    </p>
  );
}

export function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-5 h-1 overflow-hidden rounded-full bg-[rgba(221,201,142,0.15)]" aria-hidden="true">
      <div className="h-full rounded-full bg-[#DDC98E] shadow-[0_0_12px_#DDC98E] transition-all duration-500" style={{ width: `${(step / total) * 100}%` }} />
    </div>
  );
}

// Her voice player, the 31 Touch Points one, with the speed button up to 1.5x. If a recording can't load, it doesn't show (E4).
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
      <VoicePlayer src={src} label={label} dark />
    </div>
  );
}

export function Photo({ src, alt, pos = "50% 30%", ratio = "4 / 5", maxW = 440, plain = false, eager = false }: { src: string; alt: string; pos?: string; ratio?: string; maxW?: number; plain?: boolean; eager?: boolean }) {
  // Whole photos, each framed by hand so every head stays in. Never zoomed.
  return (
    <div className={`relative mx-auto mb-7 w-full overflow-hidden ${plain ? "" : "rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)]"}`} style={{ aspectRatio: ratio, maxWidth: maxW }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 440px" className="object-cover" style={{ objectPosition: pos }} loading={eager ? "eager" : undefined} />
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
        .wssr > div > section:not(.hidden){animation:wssrIn .45s cubic-bezier(.2,.8,.2,1) both}
        @keyframes wssrIn{from{opacity:.25;transform:translateY(14px)}to{opacity:1;transform:none}}
        .wssr section:not(.hidden) .pop{animation:wssrUp .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0) * 70ms)}
        @keyframes wssrUp{from{opacity:.25;transform:translateY(14px)}to{opacity:1;transform:none}}
        .wssr p.big{font-size:29px}
        .wssr p.taphint{font-size:11px!important;letter-spacing:.16em;text-transform:uppercase;color:#DDC98E!important;margin:18px 0 6px!important;animation:wssrHint 2.2s ease-in-out infinite}
        @keyframes wssrHint{0%,100%{opacity:.55}50%{opacity:1}}
        .wssr button{transition:transform .12s ease}
        .wssr button:active{transform:scale(.96)}
        .wssr .thoughts.tap{cursor:pointer;margin-top:6px;padding:16px 18px;border:1px solid rgba(221,201,142,.4);border-left-width:1px;border-radius:20px;background:rgba(13,53,53,.4)}
        .wssr .thoughts.tap p{opacity:.1;filter:blur(4px);font-family:var(--font-display);font-weight:300;font-size:19px;line-height:1.4;color:#f1ece2;transition:opacity .35s ease,filter .35s ease,transform .35s ease;transform:translateY(6px)}
        .wssr .thoughts.tap p.on{opacity:1;filter:none;transform:none}
        .wssr ul.no.tap li{cursor:pointer;min-height:44px;font-size:17px;color:#f1ece2;transition:color .25s ease,opacity .25s ease}
        .wssr ul.no.tap li.gone{text-decoration:line-through;text-decoration-color:#DDC98E;opacity:.45}
        .wssr p.last{transition:color .4s ease}
        .wssr p.last.glow{font-family:var(--font-display);font-weight:300;font-size:22px;line-height:1.35;color:#EEDE80}
        .wssr ol.steps.tap li{cursor:pointer;transition:opacity .25s ease}
        .wssr ol.steps.tap .n{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1.5px solid rgba(221,201,142,.7);border-radius:50%;font-size:17px;transition:all .25s ease}
        .wssr ol.steps.tap li.done .n{background:#DDC98E;border-color:#DDC98E;color:transparent;box-shadow:0 0 18px -2px #DDC98E;position:relative}
        .wssr ol.steps.tap li.done .n::after{content:"\\2713";position:absolute;color:#070707;font-size:17px}
        .wssr ol.steps.tap li.done b{color:#DDC98E}
        .wssr .mantra.tap div{cursor:pointer;margin-bottom:8px;padding:12px 16px;border:1px solid rgba(221,201,142,.3);border-radius:16px;opacity:.7;transition:all .25s ease}
        .wssr .mantra.tap div.on{opacity:1;background:#DDC98E;color:#070707;border-color:#DDC98E;box-shadow:0 0 22px -6px #DDC98E}
        .wssr .ex.tap s{cursor:pointer;border-bottom:1px dashed #EEDE80;transition:all .3s ease}
        .wssr .ex.tap s.gone{text-decoration:line-through;border-bottom-color:transparent;opacity:.35}
        .wssr .say{box-shadow:0 0 40px -22px rgba(221,201,142,.7)}
        .wssr ol.parts li{margin-bottom:12px;padding:18px;border:1px solid rgba(221,201,142,.3)!important;border-radius:20px;background:rgba(13,53,53,.28)}
        .wssr details{margin:12px 0;padding:6px 18px;border:1px solid rgba(221,201,142,.4)!important;border-radius:20px;background:rgba(168,133,56,.09)}
        .wssr details[open]{box-shadow:0 0 40px -22px rgba(221,201,142,.7)}
        .wssr .dot-pop{animation:wssrDot .7s cubic-bezier(.2,1.6,.4,1) both}
        @keyframes wssrDot{0%{transform:scale(0)}60%{transform:scale(1.5);box-shadow:0 0 22px #EEDE80}100%{transform:scale(1)}}
        .wssr-done{position:relative}
        .wssr-done::before{content:"";position:absolute;inset:0;border-radius:inherit;border:2px solid #EEDE80;animation:wssrBurst 1s ease-out both;pointer-events:none}
        @keyframes wssrBurst{from{transform:scale(1);opacity:1}to{transform:scale(1.14);opacity:0}}
        .wssr-flip{animation:wssrFlip .32s cubic-bezier(.2,.8,.2,1) both}
        @keyframes wssrFlip{from{transform:rotateX(35deg) scale(.97);opacity:.3}to{transform:none;opacity:1}}
        @media (prefers-reduced-motion:reduce){.wssr *,.wssr *::before{animation:none!important;transition:none!important}}
        .wssr .bite-line em{font-style:normal;color:#EEDE80}
        .wssr blockquote{margin:22px 0;padding:18px;border-left:2px solid #DDC98E;background:rgba(13,53,53,.45);border-radius:0 16px 16px 0;font-family:var(--font-display);font-weight:300;font-size:19px;line-height:1.4;color:#f1ece2}
        .wssr blockquote cite{display:block;margin-top:8px;font-family:var(--font-body);font-style:normal;font-size:12px;color:#a79f90}
        .wssr h4{margin:18px 0 6px;font-family:var(--font-display);font-weight:500;font-size:16px;color:#DDC98E}
        .wssr .rolecard{margin:14px 0;padding:20px;border:1px solid rgba(221,201,142,.45);border-radius:22px;background:rgba(13,53,53,.4)}
        .wssr .rolecard .tag{display:inline-block;margin-bottom:10px;padding:4px 12px;border-radius:99px;background:#DDC98E;color:#070707;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
        .wssr .story{margin:28px 0;padding:22px 20px;border:1px solid rgba(221,201,142,.3);border-radius:24px;background:rgba(13,53,53,.28)}
        .wssr .story .reel{max-width:240px;margin:0 auto 22px;border-radius:20px;overflow:hidden}
        .wssr .story .reel img{display:block;width:100%;height:auto}
        .wssr ul.said{list-style:none;margin:12px 0 18px;padding:0}
        .wssr ul.said li{padding:6px 0;font-family:var(--font-display);font-weight:300;font-size:20px;color:#EEDE80}
        .wssr .loop{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin:28px 0;padding:22px 14px;border-radius:22px;background:rgba(13,53,53,.7);font-family:var(--font-display);font-weight:300;font-size:18px;color:#f1ece2}
        .wssr .loop .ar{color:#DDC98E}
        .wssr ol.three{list-style:none;margin:16px 0;padding:0}
        .wssr ol.three li{display:grid;grid-template-columns:36px 1fr;gap:12px;padding:14px 0;border-bottom:1px solid rgba(221,201,142,.2);font-size:17px;line-height:1.5;color:#cfc8bb}
        .wssr ol.three li:last-child{border-bottom:0}
        .wssr .quiet{color:#a79f90}
        .wssr .tap{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#DDC98E}
        .wssr .trio{display:grid;gap:8px;margin:16px 0}
        .wssr .trio div{padding:13px 16px;border:1px solid rgba(221,201,142,.3);border-radius:14px;background:rgba(13,53,53,.3);font-size:15px;color:#cfc8bb}
        .wssr .trio b{margin-right:8px;font-family:var(--font-display);font-weight:500;letter-spacing:.04em;color:#DDC98E}
        .wssr .ab{display:flex;gap:10px;margin:18px 0}
        .wssr .ab div{flex:1;padding:14px;border:1px solid rgba(221,201,142,.3);border-radius:16px;text-align:center}
        .wssr .ab b{display:block;font-family:var(--font-display);font-weight:300;font-size:28px;line-height:1.1;color:#DDC98E}
        .wssr .ab span{font-size:14px;color:#a79f90}
        .wssr .intent{margin:24px 0;padding:26px 20px;border-radius:22px;background:rgba(13,53,53,.7);font-family:var(--font-display);font-weight:300;font-size:24px;line-height:1.3;text-align:center;color:#f1ece2}
        .wssr .intent small{display:block;margin-bottom:8px;font-family:var(--font-body);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#DDC98E}
        .wssr h3{margin-top:22px}
        .wssr .more2 p{margin:0 0 8px}
        .wssr .seven{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:20px 0}
        .wssr .seven div{aspect-ratio:3/4;display:grid;place-items:center;border:1px solid rgba(221,201,142,.4);border-radius:8px;font-family:var(--font-display);color:#a79f90}
        .wssr .seven div:first-child{background:#DDC98E;border-color:#DDC98E;color:#070707}
        .wssr ol.watchfor{list-style:none;margin:14px 0 20px;padding:0;counter-reset:w}
        .wssr ol.watchfor li{counter-increment:w;position:relative;padding:14px 0 14px 44px;border-bottom:1px solid rgba(221,201,142,.2);font-size:16px;color:#cfc8bb}
        .wssr ol.watchfor li:last-child{border-bottom:0}
        .wssr ol.watchfor li::before{content:counter(w);position:absolute;left:0;top:14px;display:grid;place-items:center;width:28px;height:28px;border:1px solid #DDC98E;border-radius:50%;font-size:13px;color:#DDC98E}
        .wssr .stretches{margin:20px 0}
        .wssr .st{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;padding:16px 0;border-bottom:1px solid rgba(221,201,142,.2)}
        .wssr .st:last-child{border-bottom:0}
        .wssr .st .days{display:flex;flex-wrap:wrap;gap:3px;width:70px;padding-top:5px}
        .wssr .st .days i{width:9px;height:9px;border-radius:50%;background:#DDC98E}
        .wssr .st:nth-child(5) .days i{background:#EEDE80}
        .wssr .st b{display:block;font-family:var(--font-display);font-weight:500;font-size:17px;color:#DDC98E}
        .wssr .st small{display:block;margin:2px 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#a79f90}
        .wssr .st p{margin:0;font-size:15px}
        .wssr ul.order{list-style:none;margin:16px 0;padding:0}
        .wssr ul.order li{padding:7px 0 7px 22px;position:relative;font-family:var(--font-display);font-weight:300;font-size:19px;color:#f1ece2}
        .wssr ul.order li::before{content:"\\2192";position:absolute;left:0;color:#DDC98E}
        .wssr .loop.tap{cursor:pointer}
        .wssr .loop.tap>span:not(.ar){padding:4px 10px;border-radius:99px;transition:all .25s ease}
        .wssr .loop.tap>span.on{background:#DDC98E;color:#070707;box-shadow:0 0 18px -4px #DDC98E}
        .wssr .seven.tap div{cursor:pointer}
        .wssr .seven.tap div.locked{opacity:.55}
        .wssr .seven .wiggle{animation:wssrWiggle .35s ease}
        @keyframes wssrWiggle{0%,100%{transform:none}30%{transform:scale(1.14)}60%{transform:scale(.96)}}
      `;
