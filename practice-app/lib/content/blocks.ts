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
export type PromptGroupColor = "teal" | "gold" | "brown" | "blueGrey" | "black";

// Gamma's own "step diagram" cards (a numbered flow, each step a short
// heading plus an optional line under it) — Juliette places these
// deliberately in her decks; they are real content, never decorative
// filler to skip. Every Gamma-sourced guide must carry these through.
export type DiagramStep = { heading: string; text?: string };

// A row of big standout numbers with labels underneath (Gamma's own
// "27 / 650+ / 980" stat-card layout) — real proof, not decorative,
// same never-skip rule as diagram.
export type StatItem = { number: string; label: string; caption?: string };

export type ContentBlock =
  | { kind: "p"; text: string; emphasis?: "bold" | "accent" }
  | { kind: "quote"; text: string }
  | { kind: "big"; text: string }
  | { kind: "step"; label: string; lines: WhyLine[] }
  | { kind: "notice"; lines: WhyLine[] }
  | { kind: "why"; lines: WhyLine[] }
  | { kind: "link"; text: string; href: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; vimeoId: string }
  | { kind: "driveVideo"; url: string; label: string }
  | { kind: "driveAudio"; url: string; label: string }
  | { kind: "promptGroup"; category: string; color: PromptGroupColor; prompts: string[] }
  | { kind: "diagram"; steps: DiagramStep[] }
  | { kind: "stats"; items: StatItem[] };
