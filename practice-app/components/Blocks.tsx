import Image from "next/image";
import Script from "next/script";
import { ContentBlock } from "@/lib/content/blocks";

function driveIdFromUrl(url: string): string | null {
  const m = url.match(/\/file\/d\/([^/]+)/);
  return m ? m[1] : null;
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
  if (!split) return <p className={bodyClassName}>{text}</p>;
  return (
    <p className={bodyClassName}>
      <span
        className={`font-display text-lg font-bold sm:text-xl ${
          dark ? "text-ffy-gold" : "text-ffy-gold-deep"
        }`}
      >
        {split.term}:
      </span>{" "}
      <span>{split.rest}</span>
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
                {b.text}
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
                {b.text}
              </p>
            );

          case "quote":
            return (
              <p
                key={i}
                className={`font-display text-2xl font-bold not-italic leading-snug sm:text-3xl ${dark ? "text-ffy-gold" : "text-ffy-teal"}`}
              >
                {b.text}
              </p>
            );

          case "step":
            return (
              <div
                key={i}
                className={
                  dark
                    ? "rounded-xl border border-ffy-gold/50 bg-ffy-gold/[0.07] px-5 py-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]"
                    : "rounded-xl border border-ffy-border bg-white/70 px-5 py-4"
                }
              >
                <p
                  className={`font-display text-sm font-semibold uppercase tracking-wide ${
                    dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"
                  }`}
                >
                  {b.label}
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {b.lines.map((line, li) =>
                    line.emphasis === "bold" ? (
                      <p key={li} className={`font-semibold ${dark ? "text-ffy-cream" : "text-ffy-black"}`}>
                        {line.text}
                      </p>
                    ) : line.emphasis === "accent" ? (
                      <p
                        key={li}
                        className={`font-display font-semibold ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}
                      >
                        {line.text}
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
                      {line.text}
                    </p>
                  ) : line.emphasis === "accent" ? (
                    <p
                      key={li}
                      className={`font-display text-base font-semibold not-italic ${dark ? "text-ffy-gold-pale" : "text-ffy-gold-deep"}`}
                    >
                      {line.text}
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
                        {line.text}
                      </p>
                    ) : (
                      <TermLine key={li} text={line.text} dark={dark} bodyClassName="text-[0.98rem] leading-relaxed text-ffy-cream/90" />
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

          case "promptGroup": {
            // All five built from the existing approved palette (core +
            // supporting), never an invented colour.
            const theme: Record<string, string> = {
              teal: "bg-ffy-teal text-ffy-cream",
              gold: "bg-ffy-gold text-ffy-black",
              brown: "bg-ffy-brown text-ffy-cream",
              blueGrey: "bg-[#d8dfe1] text-ffy-black",
              black: "bg-ffy-black text-ffy-gold-pale",
            };
            const darkTheme: Record<string, string> = {
              teal: "bg-white/5 border border-ffy-teal text-ffy-cream",
              gold: "bg-ffy-gold text-ffy-black",
              brown: "bg-white/5 border border-ffy-gold/40 text-ffy-cream",
              blueGrey: "bg-white/10 text-ffy-cream",
              black: "bg-black/40 border border-ffy-gold-pale/40 text-ffy-gold-pale",
            };
            return (
              <div key={i} className={`rounded-2xl px-6 py-6 ${dark ? darkTheme[b.color] : theme[b.color]}`}>
                <p className="font-display text-lg font-bold uppercase tracking-wide">
                  {b.category}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {b.prompts.map((prompt, pi) => (
                    <p key={pi} className="text-[1.02rem] leading-relaxed">
                      {prompt}
                    </p>
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
