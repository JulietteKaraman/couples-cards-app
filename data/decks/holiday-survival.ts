export type HolidaySurvivalSectionKey = "LIFE" | "FAM" | "BEL" | "REL" | "INT";
export type PromptLine = { text: string; bold?: boolean };
export type HolidaySurvivalCardPrompt = { id: number; section: HolidaySurvivalSectionKey; lines: PromptLine[] };

export const HOLIDAY_SURVIVAL_SECTIONS: Record<
  HolidaySurvivalSectionKey,
  { title: string; coverImg: string; templateImg: string }
> = {
  LIFE: {
    title: "Life",
    coverImg: "/cards/holiday/sections/life.png",
    templateImg: "/cards/holiday/templates/life.png",
  },
  FAM: {
    title: "Family",
    coverImg: "/cards/holiday/sections/family.png",
    templateImg: "/cards/holiday/templates/family.png",
  },
  BEL: {
    title: "Beliefs & Emotions",
    coverImg: "/cards/holiday/sections/beliefs.png",
    templateImg: "/cards/holiday/templates/beliefs.png",
  },
  REL: {
    title: "Relationships",
    coverImg: "/cards/holiday/sections/relationships.png",
    templateImg: "/cards/holiday/templates/relationships.png",
  },
  INT: {
    title: "Intimacy",
    coverImg: "/cards/holiday/sections/intimacy.png",
    templateImg: "/cards/holiday/templates/intimacy.png",
  },
};

export const HOLIDAY_SURVIVAL_CARDS: HolidaySurvivalCardPrompt[] = [
  // -------------------------
  // Life (1-5)
  // -------------------------
  { id: 1, section: "LIFE", lines: [{ text: "Tell me what the word holiday stirs in you, before your mind has time to explain.", bold: true }, { text: "Notice the sensations, or the absence of them: tightness, expansion, joy, resistance. What's moving through you?" }] },
  { id: 2, section: "LIFE", lines: [{ text: "Tell me what you most need this holiday season, beyond gifts, beyond plans." }] },
  { id: 3, section: "LIFE", lines: [{ text: "Tell me what brings you back to yourself when everything around you feels loud." }] },
  { id: 4, section: "LIFE", lines: [{ text: "Tell me how you really feel about giving and receiving this time of year." }] },
  { id: 5, section: "LIFE", lines: [{ text: "Tell me what you long for most in the pause after the celebrations are over." }] },

  // -------------------------
  // Family (6-10)
  // -------------------------
  { id: 6, section: "FAM", lines: [{ text: "Tell me how being with your family really affects you." }] },
  { id: 7, section: "FAM", lines: [{ text: "Tell me what you most need me to know about you, so we can be together in harmony this season." }] },
  { id: 8, section: "FAM", lines: [{ text: "Tell me what helps you feel safe and seen when the house is full and the energy is high." }] },
  { id: 9, section: "FAM", lines: [{ text: "Tell me what old stories or roles you're ready to leave behind when we gather." }] },
  { id: 10, section: "FAM", lines: [{ text: "Tell me what you secretly love, and don't love, about family time." }] },

  // -------------------------
  // Beliefs & Emotions (11-15)
  // -------------------------
  { id: 11, section: "BEL", lines: [{ text: "Tell me what being with family during the holidays has taught you.", bold: true }, { text: "For example, about love, about yourself, about belonging." }] },
  { id: 12, section: "BEL", lines: [{ text: "Tell me one belief you hold about the holidays.", bold: true }, { text: "Where did it come from, and does it still feel true?" }] },
  { id: 13, section: "BEL", lines: [{ text: "Tell me how you most like to receive: gifts, words, presence, touch." }] },
  { id: 14, section: "BEL", lines: [{ text: "Tell me how you most love to give.", bold: true }, { text: "What feels natural, what feels heavy, what feels joyful?" }] },
  { id: 15, section: "BEL", lines: [{ text: "Tell me what a perfect holiday morning would be for you." }] },

  // -------------------------
  // Relationships (16-20)
  // -------------------------
  { id: 16, section: "REL", lines: [{ text: "Tell me how to best create space for you this season." }] },
  { id: 17, section: "REL", lines: [{ text: "Tell me how you most want to be loved at this time of year.", bold: true }, { text: "Words, time, touch, shared silence: what feeds you?" }] },
  { id: 18, section: "REL", lines: [{ text: "Tell me a small signal we can use when things get too much, so we can come back to us.", bold: true }, { text: "A word, a hand squeeze, a five-minute walk." }] },
  { id: 19, section: "REL", lines: [{ text: "Tell me one boundary that would make the holidays easier for you." }] },
  { id: 20, section: "REL", lines: [{ text: "Tell me what romance in the holidays means to you." }] },

  // -------------------------
  // Intimacy (21-25)
  // -------------------------
  { id: 21, section: "INT", lines: [{ text: "Tell me how you feel about your body right now." }] },
  { id: 22, section: "INT", lines: [{ text: "Tell me what you'd love to experience when the house quiets after family time." }] },
  { id: 23, section: "INT", lines: [{ text: "Tell me how you most want to touch me tonight, this holiday." }] },
  { id: 24, section: "INT", lines: [{ text: "Tell me how often you think about a desire during the day." }] },
  { id: 25, section: "INT", lines: [{ text: "Tell me one fantasy you'd love to unwrap with me this season." }] },
];

export const HOLIDAY_SURVIVAL_TOTAL_CARDS = 25;
