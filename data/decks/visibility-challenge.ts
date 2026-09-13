// The Visibility Challenge — free, 21 days, one prompt per day.
// Real prompts, verbatim from "The Visibility Practice" (the doc she gives out
// at summits and speaking engagements). Day 1 is granted at signup; each
// following day unlocks 24 hours after the previous one.

export type VisibilityPrompt = { day: number; lines: { text: string; bold?: boolean }[] };

export const VISIBILITY_TEMPLATE_IMG = "/cards/visibility-challenge/template.png";

export const VISIBILITY_CHALLENGE_PROMPTS: VisibilityPrompt[] = [
  { day: 1, lines: [{ text: "Tell me what does “being seen” bring up for you.", bold: true }] },
  { day: 2, lines: [{ text: "Tell me where in your body do you feel resistance to being fully visible.", bold: true }] },
  { day: 3, lines: [{ text: "Tell me about a memory where you felt truly seen.", bold: true }, { text: "What made it safe?" }] },
  { day: 4, lines: [{ text: "Tell me what part of you longs to be witnessed today.", bold: true }] },
  { day: 5, lines: [{ text: "Tell me how you would show up today if you knew you could not be rejected.", bold: true }] },
  { day: 6, lines: [{ text: "Tell me what masks you are ready to lay down.", bold: true }] },
  { day: 7, lines: [{ text: "Tell me what truth you’re scared to say out loud.", bold: true }] },
  { day: 8, lines: [{ text: "Tell me who benefits when you silence yourself.", bold: true }, { text: "Who loses?" }] },
  { day: 9, lines: [{ text: "Tell me where in your life you are craving deeper intimacy or recognition.", bold: true }] },
  { day: 10, lines: [{ text: "Tell me what your body’s signs are that you’re expanding into more visibility.", bold: true }] },
  { day: 11, lines: [{ text: "Tell me, if your visibility was an energy, what characteristics would it have.", bold: true }, { text: "Colour, shape, weight." }] },
  { day: 12, lines: [{ text: "Tell me how you want people to feel when they experience your energy.", bold: true }] },
  { day: 13, lines: [{ text: "Tell me what you need to hear right now from the most loving version of yourself.", bold: true }] },
  { day: 14, lines: [{ text: "Tell me where you can be 5% more visible today, in a way that feels good.", bold: true }] },
  { day: 15, lines: [{ text: "Tell me what desire you’ve kept hidden that wants to be expressed.", bold: true }] },
  { day: 16, lines: [{ text: "Tell me what version of you people are already responding to, even when you hold back.", bold: true }] },
  { day: 17, lines: [{ text: "What limiting belief am I ready to rewrite around being seen?", bold: true }] },
  { day: 18, lines: [{ text: "Tell me one bold truth you’re claiming today.", bold: true }] },
  { day: 19, lines: [{ text: "Tell me what one touch you can give yourself that has you feel more alive.", bold: true }] },
  { day: 20, lines: [{ text: "Tell me what one action step you can take today so your presence is more felt today.", bold: true }] },
  { day: 21, lines: [{ text: "Tell me what has shifted for you in these 21 days.", bold: true }, { text: "What is now possible?" }] },
];

export function getVisibilityPrompt(day: number): VisibilityPrompt | undefined {
  return VISIBILITY_CHALLENGE_PROMPTS.find((p) => p.day === day);
}

export const VISIBILITY_CHALLENGE_LENGTH = VISIBILITY_CHALLENGE_PROMPTS.length;
