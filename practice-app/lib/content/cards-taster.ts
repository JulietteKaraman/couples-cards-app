// The 5 free "Couples Edition" taster cards, copied from the couplecards
// app's own proven taster (data/taster-cards.ts + data/decks/couples.ts in
// the repo root) rather than reimplemented from scratch. Same cards, same
// template art. This is the "Intimacy and Communication Cards" deck (the
// full paid deck lives at cards.feelfullyyou.com); this taster is free,
// no purchase, same free-guide philosophy as When She Goes Quiet and
// Between Touches.
//
// Deliberately NOT a PracticeCollection (lib/content/blocks.ts / linear
// reading entries) — a card taster is draw-one-at-a-time, not read-in-
// order, so it gets its own small data shape and its own route
// (app/practice/cards-taster) instead of being forced into that model.

export type TasterCard = {
  id: number;
  section: string;
  lines: { text: string; bold?: boolean }[];
  templateImage: string;
};

export const CARDS_TASTER_COVER = "/cards/couples/cover.png";

export const CARDS_TASTER_CARDS: TasterCard[] = [
  {
    id: 1,
    section: "RR",
    lines: [{ text: "Tell me your biggest fear and biggest desire for our relationship", bold: true }],
    templateImage: "/cards/couples/sections/RR_template.png",
  },
  {
    id: 2,
    section: "IR",
    lines: [
      { text: "Tell me about an honest conversation you wish we'd have, but haven't yet.", bold: true },
      { text: "What might make it easier?" },
    ],
    templateImage: "/cards/couples/sections/IR_template.png",
  },
  {
    id: 3,
    section: "TD",
    lines: [{ text: "Tell me a fantasy you've had, but never voiced", bold: true }],
    templateImage: "/cards/couples/sections/TD_template.png",
  },
  {
    id: 4,
    section: "HG",
    lines: [{ text: "Tell me something you're still healing from sexually.", bold: true }],
    templateImage: "/cards/couples/sections/HG_template.png",
  },
  {
    id: 5,
    section: "PD",
    lines: [{ text: "Tell me your favorite flirty memory with me.", bold: true }],
    templateImage: "/cards/couples/sections/PD_template.png",
  },
];
