import { DECKS } from "./decks";

export type TasterCard = {
  id: number;
  deck: "couples" | "friends";
  section: string;
  lines: { text: string; bold?: boolean }[];
  templateImage: string;
};

export const TASTER_CARDS = {
  couples: [
    {
      id: 1,
      deck: "couples" as const,
      section: "RR",
      lines: [
        { text: "Tell me your biggest fear and biggest desire for our relationship", bold: true }
      ],
      templateImage: DECKS.couples.sections.RR.templateImg,
    },
    {
      id: 2,
      deck: "couples" as const,
      section: "IR",
      lines: [
        { text: "Tell me about an honest conversation you wish we'd have, but haven't yet.", bold: true },
        { text: "What might make it easier?" }
      ],
      templateImage: DECKS.couples.sections.IR.templateImg,
    },
    {
      id: 3,
      deck: "couples" as const,
      section: "TD",
      lines: [
        { text: "Tell me a fantasy you've had, but never voiced", bold: true }
      ],
      templateImage: DECKS.couples.sections.TD.templateImg,
    },
    {
      id: 4,
      deck: "couples" as const,
      section: "HG",
      lines: [
        { text: "Tell me something you're still healing from sexually.", bold: true }
      ],
      templateImage: DECKS.couples.sections.HG.templateImg,
    },
    {
      id: 5,
      deck: "couples" as const,
      section: "PD",
      lines: [
        { text: "Tell me your favorite flirty memory with me.", bold: true }
      ],
      templateImage: DECKS.couples.sections.PD.templateImg,
    },
  ],
  friends: [
    {
      id: 1,
      deck: "friends" as const,
      section: "FM",
      lines: [
        { text: "Tell me a trait in your parents or siblings you dislike.", bold: true },
        { text: "Do you see it in yourself too?" }
      ],
      templateImage: DECKS.friends.sections.FM.templateImg,
    },
    {
      id: 2,
      deck: "friends" as const,
      section: "LF",
      lines: [
        { text: "Tell me about a risk you took that paid off or didn't.", bold: true },
        { text: "What did you learn from it?" }
      ],
      templateImage: DECKS.friends.sections.LF.templateImg,
    },
    {
      id: 3,
      deck: "friends" as const,
      section: "BE",
      lines: [
        { text: "Tell me a story that changed your perspective or deeply impacted you.", bold: true }
      ],
      templateImage: DECKS.friends.sections.BE.templateImg,
    },
    {
      id: 4,
      deck: "friends" as const,
      section: "FB",
      lines: [
        { text: "Tell me about a conversation you wish you could revisit.", bold: true },
        { text: "What would you say or do differently?" }
      ],
      templateImage: DECKS.friends.sections.FB.templateImg,
    },
    {
      id: 5,
      deck: "friends" as const,
      section: "SG",
      lines: [
        { text: "Tell me a challenge you faced that made you stronger.", bold: true },
        { text: "How did you grow because of it?" }
      ],
      templateImage: DECKS.friends.sections.SG.templateImg,
    },
  ],
};

export function getTasterCards(deckType: "couples" | "friends") {
  return TASTER_CARDS[deckType];
}