export type TrustRepairSectionKey = "WWA" | "WH" | "TD" | "BR" | "RT";
export type PromptLine = { text: string; bold?: boolean };
export type TrustRepairCardPrompt = { id: number; section: TrustRepairSectionKey; lines: PromptLine[] };

export const TRUST_REPAIR_SECTIONS: Record<
  TrustRepairSectionKey,
  { title: string; coverImg: string; templateImg: string }
> = {
  WWA: {
    title: "What the World Is Asking",
    coverImg: "/cards/trust/sections/world.png",
    templateImg: "/cards/trust/templates/world.png",
  },
  WH: {
    title: "What I'm Holding",
    coverImg: "/cards/trust/sections/holding.png",
    templateImg: "/cards/trust/templates/holding.png",
  },
  TD: {
    title: "The Drift",
    coverImg: "/cards/trust/sections/drift.png",
    templateImg: "/cards/trust/templates/drift.png",
  },
  BR: {
    title: "The Body's Record",
    coverImg: "/cards/trust/sections/record.png",
    templateImg: "/cards/trust/templates/record.png",
  },
  RT: {
    title: "Return To Trust",
    coverImg: "/cards/trust/sections/return.png",
    templateImg: "/cards/trust/templates/return.png",
  },
};

export const TRUST_REPAIR_CARDS: TrustRepairCardPrompt[] = [
  // -------------------------
  // What the World Is Asking (1-10)
  // -------------------------
  { id: 1, section: "WWA", lines: [{ text: "Tell me what is happening for you when you look at what is happening for women worldwide." }] },
  { id: 2, section: "WWA", lines: [{ text: "Tell me what comes up for you as a woman when you hear all of this." }] },
  { id: 3, section: "WWA", lines: [{ text: "Tell me what this is bringing up for you." }] },
  { id: 4, section: "WWA", lines: [{ text: "Tell me what actually came up for you when that happened.", bold: true }, { text: "What do you want me to know?" }] },
  { id: 5, section: "WWA", lines: [{ text: "Tell me what the news has landed on in your body." }] },
  { id: 6, section: "WWA", lines: [{ text: "Tell me what rage you've been swallowing." }] },
  { id: 7, section: "WWA", lines: [{ text: "Tell me what you wish men understood right now." }] },
  { id: 8, section: "WWA", lines: [{ text: "Tell me what you've stopped expecting of the world." }] },
  { id: 9, section: "WWA", lines: [{ text: "Tell me what you wanted to shout today." }] },
  { id: 10, section: "WWA", lines: [{ text: "Tell me what feels unsafe in the world right now." }] },

  // -------------------------
  // What I'm Holding (11-20)
  // -------------------------
  { id: 11, section: "WH", lines: [{ text: "Tell me what happened for you this morning.", bold: true }, { text: "What do I need to know?" }] },
  { id: 12, section: "WH", lines: [{ text: "Tell me one thing that felt heavy today." }] },
  { id: 13, section: "WH", lines: [{ text: "Tell me something you've been carrying alone this week." }] },
  { id: 14, section: "WH", lines: [{ text: "Tell me what you've been afraid to say to me." }] },
  { id: 15, section: "WH", lines: [{ text: "Tell me what you've withheld from me." }] },
  { id: 16, section: "WH", lines: [{ text: "Tell me what you don't say out loud." }] },
  { id: 17, section: "WH", lines: [{ text: "Tell me what you long for but do not ask for." }] },
  { id: 18, section: "WH", lines: [{ text: "Tell me what you are holding right now.", bold: true }, { text: "What do I need to know?" }] },
  { id: 19, section: "WH", lines: [{ text: "Tell me something you have wanted to ask for but didn't." }] },
  { id: 20, section: "WH", lines: [{ text: "Tell me what you've been pretending is fine." }] },

  // -------------------------
  // The Drift (21-30)
  // -------------------------
  { id: 21, section: "TD", lines: [{ text: "Tell me when you first felt this drift." }] },
  { id: 22, section: "TD", lines: [{ text: "Tell me what stopped you." }] },
  { id: 23, section: "TD", lines: [{ text: "Tell me what feels unfinished." }] },
  { id: 24, section: "TD", lines: [{ text: "Tell me what happened for you when you saw how I responded." }] },
  { id: 25, section: "TD", lines: [{ text: "Tell me what happened inside you when I said that." }] },
  { id: 26, section: "TD", lines: [{ text: "Tell me the moment something shifted between us." }] },
  { id: 27, section: "TD", lines: [{ text: "Tell me what we have not talked about that needs to be said." }] },
  { id: 28, section: "TD", lines: [{ text: "Tell me what you wish I had done differently." }] },
  { id: 29, section: "TD", lines: [{ text: "Tell me what you are still not over." }] },
  { id: 30, section: "TD", lines: [{ text: "Tell me what you have been circling around." }] },

  // -------------------------
  // The Body's Record (31-40)
  // -------------------------
  { id: 31, section: "BR", lines: [{ text: "Tell me what today was like in your body." }] },
  { id: 32, section: "BR", lines: [{ text: "Tell me where that lands in the body." }] },
  { id: 33, section: "BR", lines: [{ text: "Tell me what happens in your body when you read that." }] },
  { id: 34, section: "BR", lines: [{ text: "Tell me what is happening in your body right now.", bold: true }, { text: "What do I need to know?" }] },
  { id: 35, section: "BR", lines: [{ text: "Tell me what your body needs right now." }] },
  { id: 36, section: "BR", lines: [{ text: "Tell me where in your body you are carrying this." }] },
  { id: 37, section: "BR", lines: [{ text: "Tell me what your body goes quiet about." }] },
  { id: 38, section: "BR", lines: [{ text: "Tell me what your body knows that your mind doesn't want to." }] },
  { id: 39, section: "BR", lines: [{ text: "Tell me where you hold the word no." }] },
  { id: 40, section: "BR", lines: [{ text: "Tell me where you feel safest in your body right now." }] },

  // -------------------------
  // Return To Trust (41-50)
  // -------------------------
  { id: 41, section: "RT", lines: [{ text: "Tell me what you want trust to feel like." }] },
  { id: 42, section: "RT", lines: [{ text: "Tell me what reassurance means to you.", bold: true }, { text: "What do I need to understand?" }] },
  { id: 43, section: "RT", lines: [{ text: "Tell me what you want to come back to." }] },
  { id: 44, section: "RT", lines: [{ text: "Tell me what you want more of right now." }] },
  { id: 45, section: "RT", lines: [{ text: "Tell me what tonight could feel like if we both tried." }] },
  { id: 46, section: "RT", lines: [{ text: "Tell me what you need right now, that isn't a solution." }] },
  { id: 47, section: "RT", lines: [{ text: "Tell me what you need me to understand about you right now." }] },
  { id: 48, section: "RT", lines: [{ text: "Tell me what would have you feel supported right now." }] },
  { id: 49, section: "RT", lines: [{ text: "Tell me what I can do to help you come back to yourself." }] },
  { id: 50, section: "RT", lines: [{ text: "Tell me how you create safety within yourself." }] },
];

export const TRUST_REPAIR_TOTAL_CARDS = 50;