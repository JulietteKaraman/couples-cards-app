// Shared content-block model so every entry (ritual, essay page, closing
// page) can carry the full real depth of Juliette's Gamma deck: steps,
// "why it works" call-outs, reflection prompts, quotes, standout big
// statements, inline photos, and real links, not just flat paragraphs.

export type WhyLine = {
  text: string;
  // "bold" for a topic/pivot sentence, "accent" for the closing punchline
  // (gold, its own colour), unset for a plain supporting line.
  emphasis?: "bold" | "accent";
};

// Five distinct treatments, one per Dyad prompt category, all built from
// Juliette's existing approved palette (core + supporting), never an
// invented colour. Each is a full card, background and text together, so
// the five categories read as visibly different at a glance.
// "blush" added 12 Aug 2026 for the Communication Reboot Kit's swipe-file
// cards, checked directly against the real PDF: soft cream/rose card, dark
// text, brown label, not a saturated solid-colour fill like the other five.
export type PromptGroupColor = "teal" | "gold" | "brown" | "blueGrey" | "black" | "blush";

// Gamma's own "step diagram" cards (a numbered flow, each step a short
// heading plus an optional line under it) — Juliette places these
// deliberately in her decks; they are real content, never decorative
// filler to skip. Every Gamma-sourced guide must carry these through.
export type DiagramStep = { heading: string; text?: string };

// A different real numbered-step design, first used on the Communication
// Reboot Kit's "Start Here" page (checked directly against Juliette's own
// PDF, 12 Aug 2026): a plain numeral in a soft circle, heading and body
// text beside it, stacked straight down the page, no dark box. NOT the
// same component as `diagram` (Gamma's staggered gold-cards-on-black
// treatment) — reusing that here was wrong, this is its own real layout.
export type NumberedStep = { heading: string; text: string };

// A row of big standout numbers with labels underneath (Gamma's own
// "27 / 650+ / 980" stat-card layout) — real proof, not decorative,
// same never-skip rule as diagram.
export type StatItem = { number: string; label: string; caption?: string };

export type ContentBlock =
  | { kind: "p"; text: string; emphasis?: "bold" | "accent" }
  | { kind: "quote"; text: string }
  | { kind: "big"; text: string }
  // `highlight` is a bolder, gold-tinted card instead of the plain white
  // one — for a step that matters but reads as skippable next to louder
  // neighbours (a "why" box, a photo). Juliette, 12 Aug 2026, on "Before
  // you invite them in": "it is just really bland and easy to skip over."
  | { kind: "step"; label: string; lines: WhyLine[]; highlight?: boolean }
  | { kind: "notice"; lines: WhyLine[] }
  | { kind: "why"; lines: WhyLine[] }
  | { kind: "link"; text: string; href: string }
  // A full-width, high-weight CTA for the one link on a page that must
  // never be missed (e.g. the 46 cards themselves). The plain `link` pill
  // reads as a footnote inside a page of paragraphs — Juliette, 12 Aug
  // 2026: "the button to get to them is impossible to see." This is
  // deliberately the loudest thing on the page.
  | { kind: "bigLink"; text: string; subtext?: string; href: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; vimeoId: string }
  | { kind: "youtube"; videoId: string; label: string }
  // A small, transparent, non-full-width sign-off graphic (e.g. Juliette's
  // real gold cursive signature) — distinct from `image`, which renders
  // full-width with a background fill, wrong for a small inline flourish.
  | { kind: "signature"; src: string; alt: string }
  | { kind: "driveVideo"; url: string; label: string }
  | { kind: "driveAudio"; url: string; label: string }
  | { kind: "audio"; src: string; label: string }
  | { kind: "instagram"; url: string }
  | { kind: "promptGroup"; category: string; color: PromptGroupColor; prompts: string[] }
  | { kind: "diagram"; steps: DiagramStep[] }
  | { kind: "numberedSteps"; steps: NumberedStep[] }
  | { kind: "stats"; items: StatItem[] }
  // Juliette's recurring "What She Says / What She Really Means"
  // translation tables (When She Goes Quiet, Between Touches, and likely
  // future guides). Real content, same never-skip rule as diagram/stats.
  // Rendered as stacked labelled cards, not an HTML table, phone-first.
  | { kind: "table"; headers: string[]; rows: string[][] };
