import Image from "next/image";
import Script from "next/script";
import type { ReactNode } from "react";
import { ContentBlock } from "@/lib/content/blocks";

function driveIdFromUrl(url: string): string | null {
  const m = url.match(/\/file\/d\/([^/]+)/);
  return m ? m[1] : null;
}

function instagramEmbedUrl(url: string): string | null {
  const m = url.match(/instagram\.com\/(reel|p|tv)\/([^/?]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null;
}

// Lines like "Emotional: touch that carries feeling..." are a term being
// defined, not a plain sentence. Gamma always gave the term its own bold,
// larger, coloured treatment so it reads as a label, not flat prose. Split
// on the first ": " when what comes before it looks like a short label
// (not a full clause) and render it that way; otherwise leave the line as
// plain text.
function splitTermLine(text: string): { term: string; rest: string } | null {
  const idx = text.indexOf(": ");
  if (idx === -1) return null;
  const term = text.slice(0, idx);
  const rest = text.slice(idx + 2).trim();
  if (!rest) return null;
  if (term.length > 40) return null;
  if (/[.?!]/.test(term)) return null;
  return { term, rest };
}

// Real source pages (checked directly against Juliette's own per-tab PDF
// exports, 12 Aug 2026) colour specific phrases inside a paragraph, not the
// whole line, e.g. "just curiosity and a safe place to start." landing in
// the warm brown/rose accent while the rest of the sentence stays black.
// Content files mark that with **double asterisks**; this renders the
// marked span as a coloured, semibold inline run and leaves everything
// else untouched. No existing content file uses "**" today, so this is
// purely additive — nothing already shipped changes appearance.
function renderInline(text: string, dark: boolean): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <span key={idx} className={`font-semibold ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

function TermLine({
  text,
  dark,
  bodyClassName,
}: {
  text: string;
  dark: boolean;
  bodyClassName?: string;
}) {
  const split = splitTermLine(text);
  if (!split) return <p className={bodyClassName}>{renderInline(text, dark)}</p>;
  return (
    <p className={bodyClassName}>
      <span
        className={`font-display text-lg font-bold sm:text-xl ${
          dark ? "text-ffy-gold" : "text-ffy-gold-deep"
        }`}
      >
        {split.term}:
      </span>{" "}
      <span>{renderInline(split.rest, dark)}</span>
    </p>
  );
}

export function Blocks({ blocks, dark = false }: { blocks: ContentBlock[]; dark?: boolean }) {
  return (
    <div
      className={`mt-6 flex flex-col gap-5 text-[1.05rem] leading-relaxed ${
        dark ? "text-ffy-cream" : "text-ffy-black"
      }`}
    >
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return (
              <p
                key={i}
                className={
                  b.emphasis === "bold"
                    ? `font-display text-lg font-semibold leading-snug ${dark ? "text-ffy-cream" : "text-ffy-black"}`
                    : b.emphasis === "accent"
                      ? `font-display text-lg font-semibold leading-snug ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`
                      : undefined
                }
              >
                {renderInline(b.text, dark)}
              </p>
            );

          case "big":
            return (
              <p
                key={i}
                className={`font-display text-2xl font-semibold leading-snug sm:text-[1.75rem] ${
                  dark ? "text-ffy-gold-pale" : "text-ffy-teal"
                }`}
              >
                {renderInline(b.text, dark)}
              </p>
            );

          case "quote":
            return (
              <p
                key={i}
                className={`font-display text-2xl font-bold not-italic leading-snug sm:text-3xl ${dark ? "text-ffy-gold" : "text-ffy-teal"}`}
              >
                {renderInline(b.text, dark)}
              </p>
            );

          case "step":
            return (
              <div
                key={i}
                className={
                  b.highlight
                    ? "rounded-xl border-2 border-ffy-gold bg-ffy-gold/15 px-5 py-5 shadow-[0_20px_45px_-25px_rgba(168,133,56,0.6)]"
                    : dark
                      ? "rounded-xl border border-ffy-gold/50 bg-ffy-gold/[0.07] px-5 py-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]"
                      : "rounded-xl border border-ffy-border bg-white/70 px-5 py-4"
                }
              >
                <p
                  className={`font-display uppercase tracking-wide ${
                    b.highlight ? "text-base font-bold text-ffy-gold-deep" : "text-sm font-semibold text-ffy-gold-deep"
                  } ${dark && !b.highlight ? "text-ffy-gold-pale" : ""}`}
                >
                  {b.label}
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {b.lines.map((line, li) =>
                    line.emphasis === "bold" ? (
                      <p key={li} className={`font-semibold ${dark ? "text-ffy-cream" : "text-ffy-black"}`}>
                        {renderInline(line.text, dark)}
                      </p>
                    ) : line.emphasis === "accent" ? (
                      <p
                        key={li}
                        className={`font-display font-semibold ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}
                      >
                        {renderInline(line.text, dark)}
                      </p>
                    ) : (
                      <TermLine
                        key={li}
                        text={line.text}
                        dark={dark}
                        bodyClassName={dark ? "text-ffy-cream/85" : undefined}
                      />
                    )
                  )}
                </div>
              </div>
            );

          case "notice":
            return (
              <div
                key={i}
                className={`flex flex-col gap-2 border-l-2 pl-4 ${dark ? "border-ffy-gold-pale" : "border-ffy-gold"}`}
              >
                {b.lines.map((line, li) =>
                  line.emphasis === "bold" ? (
                    <p
                      key={li}
                      className={`font-display text-base font-semibold not-italic ${dark ? "text-ffy-cream" : "text-ffy-black"}`}
                    >
                      {renderInline(line.text, dark)}
                    </p>
                  ) : line.emphasis === "accent" ? (
                    <p
                      key={li}
                      className={`font-display text-base font-semibold not-italic ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}
                    >
                      {renderInline(line.text, dark)}
                    </p>
                  ) : (
                    <TermLine
                      key={li}
                      text={line.text}
                      dark={dark}
                      bodyClassName={dark ? "text-sm italic text-ffy-cream/70" : "text-sm italic text-ffy-brown"}
                    />
                  )
                )}
              </div>
            );

          case "why":
            // This box is ALWAYS a dark surface (solid teal in light page
            // mode, dark gold-tinted in dark page mode) — never cream or
            // white, regardless of the page's own light/dark setting. Text
            // inside it must always use the light gold-pale treatment, not
            // whatever the page-level `dark` flag says. Juliette, 12 Aug
            // 2026, seeing the actual live result: "NEVER USE DARK OCHRE ON
            // GREEN." That happened here — inline **bold** spans were
            // using light-mode's darker gold on this always-teal box.
            return (
              <div
                key={i}
                className={`rounded-xl px-5 py-5 ${dark ? "bg-ffy-gold/[0.08] border border-ffy-gold/50" : "bg-ffy-teal"} text-ffy-cream`}
              >
                <p className="font-display text-xs font-semibold uppercase tracking-wide text-ffy-gold-pale">
                  Why it works
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {b.lines.map((line, li) =>
                    line.emphasis === "bold" || line.emphasis === "accent" ? (
                      <p
                        key={li}
                        className={
                          line.emphasis === "bold"
                            ? "font-display text-lg font-semibold leading-snug text-ffy-cream"
                            : "font-display text-lg font-semibold leading-snug text-ffy-gold-pale"
                        }
                      >
                        {renderInline(line.text, true)}
                      </p>
                    ) : (
                      <TermLine key={li} text={line.text} dark={true} bodyClassName="text-[0.98rem] leading-relaxed text-ffy-cream/90" />
                    )
                  )}
                </div>
              </div>
            );
          case "link":
            return (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className={
                  dark
                    ? "inline-flex w-fit items-center gap-2 rounded-full border border-ffy-gold bg-transparent px-5 py-2.5 font-display text-sm font-medium text-ffy-gold-pale transition hover:bg-ffy-gold hover:text-ffy-black"
                    : "inline-flex w-fit items-center gap-2 rounded-full border border-ffy-gold bg-ffy-cream-2 px-5 py-2.5 font-display text-sm font-medium text-ffy-teal transition hover:bg-ffy-gold hover:text-ffy-cream"
                }
              >
                {b.text}
              </a>
            );

          case "bigLink":
            return (
              <a
                key={i}
                href={b.href}
                className={`flex flex-col items-center gap-1 rounded-2xl px-6 py-8 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] transition hover:opacity-90 ${
                  dark ? "bg-ffy-gold text-ffy-black" : "bg-ffy-black text-ffy-gold-pale"
                }`}
              >
                <p className="font-display text-2xl font-bold">{b.text}</p>
                {b.subtext && <p className={`text-sm ${dark ? "text-ffy-black/70" : "text-ffy-gold-pale/70"}`}>{b.subtext}</p>}
              </a>
            );

          case "image":
            return (
              <div
                key={i}
                className={`relative w-full overflow-hidden rounded-2xl ${dark ? "bg-white/5" : "bg-ffy-cream-2"}`}
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  width={900}
                  height={900}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            );

          case "video":
            // Matches Juliette's real Vimeo embed code exactly: 9:16
            // portrait wrapper (177.78% padding trick), same query params,
            // same allow list, player.js loaded once via next/script.
            return (
              <div key={i}>
                <div style={{ padding: "177.78% 0 0 0", position: "relative" }} className="overflow-hidden rounded-2xl bg-ffy-black">
                  <iframe
                    src={`https://player.vimeo.com/video/${b.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    frameBorder={0}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    title="Ritual video"
                  />
                </div>
                <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />
              </div>
            );

          case "youtube": {
            // For real videos that already live on YouTube elsewhere in the
            // app (e.g. Touch Base® — see app/practice/touch-base/page.tsx),
            // rather than re-hosting a second copy on Drive. 16:9, matches
            // the source embed exactly.
            return (
              <div key={i} className="flex flex-col gap-2">
                <p className={`text-xs uppercase tracking-wide ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>{b.label}</p>
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ffy-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${b.videoId}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={b.label}
                  />
                </div>
              </div>
            );
          }

          case "signature":
            // Small, transparent, left-aligned — never the full-width
            // rounded-bg treatment `image` uses, wrong for a flourish.
            return (
              <div key={i} className="relative h-24 w-48">
                <Image src={b.src} alt={b.alt} fill sizes="192px" className="object-contain object-left" />
              </div>
            );

          case "driveVideo": {
            const id = driveIdFromUrl(b.url);
            return (
              <div key={i} className="flex flex-col gap-2">
                <p className={`text-xs uppercase tracking-wide ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>{b.label}</p>
                {id ? (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ffy-black">
                    <iframe
                      src={`https://drive.google.com/file/d/${id}/preview`}
                      className="h-full w-full"
                      allow="autoplay"
                      title={b.label}
                    />
                  </div>
                ) : (
                  <a href={b.url} target="_blank" rel="noreferrer" className={dark ? "text-ffy-gold-pale underline" : "text-ffy-gold-deep underline"}>
                    {b.label}
                  </a>
                )}
              </div>
            );
          }

          case "driveAudio": {
            const id = driveIdFromUrl(b.url);
            return (
              <div key={i} className="flex flex-col gap-2">
                <p className={`text-xs uppercase tracking-wide ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>{b.label}</p>
                {id ? (
                  <div className={`h-16 w-full overflow-hidden rounded-xl border ${dark ? "border-ffy-gold/40 bg-white/5" : "border-ffy-gold/60 bg-ffy-cream-2"}`}>
                    <iframe
                      src={`https://drive.google.com/file/d/${id}/preview`}
                      className="h-full w-full"
                      allow="autoplay"
                      title={b.label}
                    />
                  </div>
                ) : (
                  <a href={b.url} target="_blank" rel="noreferrer" className={dark ? "text-ffy-gold-pale underline" : "text-ffy-gold-deep underline"}>
                    {b.label}
                  </a>
                )}
              </div>
            );
          }

          case "audio":
            return (
              <div
                key={i}
                className={`flex flex-col gap-2 rounded-xl border px-5 py-4 ${
                  dark ? "border-ffy-gold/40 bg-white/5" : "border-ffy-gold/60 bg-ffy-cream-2"
                }`}
              >
                <p className={`text-xs uppercase tracking-wide ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>{b.label}</p>
                <audio controls className="w-full" src={b.src} />
              </div>
            );

          case "instagram": {
            const embedUrl = instagramEmbedUrl(b.url);
            return (
              <div key={i} className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-ffy-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="aspect-[9/16] w-full border-0"
                    allow="autoplay; encrypted-media"
                    title="Instagram reel"
                  />
                ) : (
                  <a href={b.url} target="_blank" rel="noreferrer" className="block p-4 text-ffy-gold-pale underline">
                    Watch the reel →
                  </a>
                )}
              </div>
            );
          }

          case "promptGroup": {
            // All five built from the existing approved palette (core +
            // supporting), never an invented colour.
            const theme: Record<string, string> = {
              teal: "bg-ffy-teal text-ffy-cream",
              gold: "bg-ffy-gold text-ffy-black",
              brown: "bg-ffy-brown text-ffy-cream",
              blueGrey: "bg-[#d8dfe1] text-ffy-black",
              black: "bg-ffy-black text-ffy-gold-pale",
              blush: "bg-ffy-cream-2 border border-[#e3c9b6] text-ffy-black",
            };
            const darkTheme: Record<string, string> = {
              teal: "bg-white/5 border border-ffy-teal text-ffy-cream",
              gold: "bg-ffy-gold text-ffy-black",
              brown: "bg-white/5 border border-ffy-gold/40 text-ffy-cream",
              blueGrey: "bg-white/10 text-ffy-cream",
              black: "bg-black/40 border border-ffy-gold-pale/40 text-ffy-gold-pale",
              blush: "bg-white/5 border border-ffy-gold/30 text-ffy-cream",
            };
            // blush's label reads as a small brown caption, not a bold
            // white-on-colour headline — matches the real swipe-file cards
            // (checked directly, 12 Aug 2026), the other five stay as-is.
            const categoryClass =
              b.color === "blush"
                ? `font-display text-sm font-bold uppercase tracking-wide ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`
                : "font-display text-lg font-bold uppercase tracking-wide";
            // teal/brown/black are always a saturated dark fill with cream
            // text regardless of page mode — any inline **bold** span in
            // those needs the light gold-pale treatment, same fix and same
            // reason as the "why" block above (never dark ochre on green).
            // gold/blueGrey/blush are light fills with dark text; those
            // stay on the page's own mode.
            const alwaysDarkText = b.color === "teal" || b.color === "brown" || b.color === "black";
            const promptDark = alwaysDarkText ? true : dark;
            // Juliette, 12 Aug 2026: "all the sentences have quote marks
            // and maybe 1,2,3 before them" — these are literal scripts to
            // read aloud or send, a number + real quote marks makes that
            // unmistakable instead of reading as plain body copy.
            return (
              <div key={i} className={`rounded-2xl px-6 py-6 ${dark ? darkTheme[b.color] : theme[b.color]}`}>
                <p className={categoryClass}>{b.category}</p>
                <div className="mt-4 flex flex-col gap-4">
                  {b.prompts.map((prompt, pi) => (
                    <div key={pi} className="flex items-start gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${
                          promptDark ? "bg-ffy-gold-pale/20 text-ffy-gold-pale" : "bg-black/10 text-current"
                        }`}
                      >
                        {pi + 1}
                      </span>
                      <p className="text-[1.02rem] italic leading-relaxed">
                        &ldquo;{renderInline(prompt, promptDark)}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case "diagram":
            // Matches Gamma's own "accent circle" step-diagram treatment:
            // soft overlapping circles behind a staggered row of gold
            // cards, on a dark stage — not a flat row. Real content,
            // never dropped as decorative. Editable text, not an image.
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-3xl bg-ffy-black px-6 py-10 sm:px-10 sm:py-14"
              >
                <div className="pointer-events-none absolute -left-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-white/10 sm:h-72 sm:w-72" />
                <div className="pointer-events-none absolute -right-6 bottom-0 h-40 w-40 translate-y-1/3 rounded-full bg-ffy-gold/25 sm:h-52 sm:w-52" />
                <div className="relative flex flex-wrap justify-center gap-5 sm:gap-6">
                  {b.steps.map((step, si) => (
                    <div
                      key={si}
                      style={{ marginTop: si % 2 === 1 ? "2.5rem" : 0 }}
                      className="w-full max-w-[220px] rounded-2xl bg-ffy-gold px-5 py-4 text-ffy-black shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] sm:w-[220px]"
                    >
                      <p className="font-display text-base font-bold leading-snug">
                        {step.heading}
                      </p>
                      {step.text && (
                        <p className="mt-1 text-sm leading-snug text-ffy-black/80">{step.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );

          case "numberedSteps":
            // Real layout, checked directly against Juliette's own PDF
            // (12 Aug 2026): a numeral in a soft circle, heading and text
            // beside it, plain page background, stacked straight down.
            // Not the "diagram" treatment — that's a different real
            // component for a different real source design.
            return (
              <div key={i} className="flex flex-col gap-8">
                {b.steps.map((step, si) => (
                  <div key={si} className="flex items-start gap-5">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-display text-xl ${
                        dark ? "border-ffy-gold-pale/50 bg-ffy-gold-pale/10 text-ffy-gold-pale" : "border-[#e3c9b6] bg-[#f3ddc9] text-ffy-brown"
                      }`}
                    >
                      {si + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-display text-lg font-bold ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}>
                        {step.heading}
                      </p>
                      <p className={`mt-1.5 leading-relaxed ${dark ? "text-ffy-cream/85" : "text-ffy-black"}`}>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            );

          case "table":
            // "What She Says / What She Really Means" style translation
            // tables. Stacked labelled cards, not a scrolling HTML table,
            // so it stays readable on a phone. Real content, never
            // thinned into plain prose.
            return (
              <div key={i} className="flex flex-col gap-3">
                {b.rows.map((row, ri) => (
                  <div
                    key={ri}
                    className={
                      dark
                        ? "rounded-xl border border-ffy-gold/40 bg-white/5 px-5 py-4"
                        : "rounded-xl border border-ffy-border bg-white/70 px-5 py-4"
                    }
                  >
                    <div className="flex flex-col gap-2.5">
                      {row.map((cell, ci) => (
                        <div key={ci}>
                          <p
                            className={`font-display text-[11px] font-semibold uppercase tracking-wide ${
                              dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"
                            }`}
                          >
                            {b.headers[ci]}
                          </p>
                          <p
                            className={`mt-0.5 text-[0.98rem] leading-snug ${
                              dark ? "text-ffy-cream/90" : "text-ffy-black"
                            }`}
                          >
                            {cell}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );

          case "stats":
            // Gamma's own big-number stat row ("27 / 650+ / 980"). Real
            // proof, always carried through, never thinned to plain text.
            return (
              <div key={i} className="grid grid-cols-1 gap-8 py-2 sm:grid-cols-3">
                {b.items.map((item, si) => (
                  <div key={si} className="flex flex-col gap-1">
                    <p
                      className={`font-display text-5xl font-bold leading-none ${
                        dark ? "text-ffy-cream" : "text-ffy-teal"
                      }`}
                    >
                      {item.number}
                    </p>
                    <p
                      className={`font-display text-xs font-semibold uppercase tracking-[0.15em] ${
                        dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.caption && (
                      <p className={`text-sm ${dark ? "text-ffy-cream/70" : "text-ffy-brown"}`}>
                        {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
