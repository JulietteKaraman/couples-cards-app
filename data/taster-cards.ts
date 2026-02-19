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
        { text: "Tell me your biggest fear and biggest desire for our relationship.", bold: true }
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
      section: "IR",
      lines: [
        { text: "Tell me about a way you've learned to receive love that once felt difficult or unlikely for you", bold: true }
      ],
      templateImage: DECKS.couples.sections.IR.templateImg,
    },
    {
      id: 4,
      deck: "couples" as const,
      section: "TD",
      lines: [
        { text: "Tell me a fantasy you've had, but never voiced.", bold: true }
      ],
      templateImage: DECKS.couples.sections.TD.templateImg,
    },
    {
      id: 5,
      deck: "couples" as const,
      section: "TD",
      lines: [
        { text: "Tell me something you're still healing from sexually.", bold: true }
      ],
      templateImage: DECKS.couples.sections.TD.templateImg,
    },
  ],
  friends: [
    {
      id: 1,
      deck: "friends" as const,
      section: "BE",
      lines: [
        { text: "Tell me about an honest conversation you wish we'd have, but haven't yet.", bold: true }
      ],
      templateImage: DECKS.friends.sections.BE.templateImg,
    },
    {
      id: 2,
      deck: "friends" as const,
      section: "LF",
      lines: [
        { text: "Tell me about something you've done for another person that you're proud of.", bold: true }
      ],
      templateImage: DECKS.friends.sections.LF.templateImg,
    },
    {
      id: 3,
      deck: "friends" as const,
      section: "FM",
      lines: [
        { text: "Tell me about a toxic relationship or pattern from your family or childhood.", bold: true },
        { text: "How has it shaped you, and what are you changing?" }
      ],
      templateImage: DECKS.friends.sections.FM.templateImg,
    },
    {
      id: 4,
      deck: "friends" as const,
      section: "FB",
      lines: [
        { text: "Tell me about a vulnerability you hide.", bold: true },
        { text: "What would help you share it safely?" }
      ],
      templateImage: DECKS.friends.sections.FB.templateImg,
    },
    {
      id: 5,
      deck: "friends" as const,
      section: "FB",
      lines: [
        { text: "Tell me what you first thought about me when we met.", bold: true },
        { text: "How has that first impression changed?" }
      ],
      templateImage: DECKS.friends.sections.FB.templateImg,
    },
  ],
};

export function getTasterCards(deckType: "couples" | "friends") {
  return TASTER_CARDS[deckType];
}