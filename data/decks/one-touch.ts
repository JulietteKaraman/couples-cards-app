export type OneTouchSectionKey = "OT";
export type PromptLine = { text: string; bold?: boolean };
export type OneTouchCardPrompt = { id: number; section: OneTouchSectionKey; lines: PromptLine[] };

export const ONE_TOUCH_SECTIONS: Record<
  OneTouchSectionKey,
  { title: string; coverImg: string; templateImg: string }
> = {
  OT: {
    title: "One Touch",
    coverImg: "/cards/one-touch/cover.png",
    templateImg: "/cards/one-touch/template.png",
  },
};

export const ONE_TOUCH_CARDS: OneTouchCardPrompt[] = [
  { id: 1, section: "OT", lines: [{ text: "Tell me what is available to you now that you didn't have access to before these 7 days." }] },
  { id: 2, section: "OT", lines: [{ text: "Tell me, where does suspicion land first in your body?", bold: true }, { text: "What does it feel like?" }] },
  { id: 3, section: "OT", lines: [{ text: "Tell me when you've said yes although your body said no.", bold: true }, { text: "How does it feel to voice that now?" }] },
  { id: 4, section: "OT", lines: [{ text: "Tell me what you have not voiced yet still influences the way you receive touch.", bold: true }, { text: "What do you need in order to feel safe and secure to receive touch now?" }] },
  { id: 5, section: "OT", lines: [{ text: "Tell me about a time you did something because of how someone else labelled the experience.", bold: true }, { text: "What would you do differently now?" }] },
  { id: 6, section: "OT", lines: [{ text: "Tell me about the last time your body tightened but you didn't speak up.", bold: true }, { text: "What would you do differently now?" }] },
  { id: 7, section: "OT", lines: [{ text: "Tell me, when was the last time you looked in the mirror and fully saw yourself without judgement?" }] },
  { id: 8, section: "OT", lines: [{ text: "Tell me one way someone tried to touch you (physically or emotionally) and it did not land for you.", bold: true }, { text: "What would you ask for now?" }] },
  { id: 9, section: "OT", lines: [{ text: "Tell me what one touch are you hoping that lands?", bold: true }, { text: "How would that feel?" }] },
  { id: 10, section: "OT", lines: [{ text: "Tell me what you can access after the last video that may have been absent before." }] },
  { id: 11, section: "OT", lines: [{ text: "Tell me what surprises you about your own touch.", bold: true }, { text: "What have you been told about touching your own skin?" }] },
  { id: 12, section: "OT", lines: [{ text: "Tell me about your relationship to sensuality.", bold: true }, { text: "Is it easy for you to access it?" }] },
  { id: 13, section: "OT", lines: [{ text: "Tell me one thing you've never dared ask for, because you were afraid of the answer." }] },
  { id: 14, section: "OT", lines: [{ text: "Tell me about the story your mind writes in the silence before you know the facts." }] },
  { id: 15, section: "OT", lines: [{ text: "Tell me what it means to feel safe." }] },
  { id: 16, section: "OT", lines: [{ text: "Tell me what happens when you do not have any time for yourself." }] },
  { id: 17, section: "OT", lines: [{ text: "Tell me how you take care of yourself when things get a bit much." }] },
  { id: 18, section: "OT", lines: [{ text: "Tell me one way you judge yourself or your body." }] },
  { id: 19, section: "OT", lines: [{ text: "Tell me, if you'd feel safe in yourself, what would you have access to?", bold: true }, { text: "How would that feel? Describe a body sensation." }] },
  { id: 20, section: "OT", lines: [{ text: "Tell me what you would like to get out of this time together?", bold: true }, { text: "Describe how that would feel in your being." }] },
  { id: 21, section: "OT", lines: [{ text: "Tell me about a time you felt free to express yourself." }] },
  { id: 22, section: "OT", lines: [{ text: "Tell me how you relate to other women / men." }] },
  { id: 23, section: "OT", lines: [{ text: "Tell me what does safety feel like in your body." }] },
];
