export type RepairKitSectionKey = "IO" | "DD" | "HE" | "RP" | "IN";
export type PromptLine = { text: string; bold?: boolean };
export type RepairKitCardPrompt = { id: number; section: RepairKitSectionKey; lines: PromptLine[] };

// The Romantic Relationship Repair Kit is a SEQUENTIAL journey: 31 cards worked
// in order, grouped into five named modules. Names, one-line descriptions and
// day ranges come from the sales page (romantic-relationship-repair-kit.html).
// Rendered by the sequential "journey" player, not the random-draw page.
export const REPAIR_KIT_SECTIONS: Record<
  RepairKitSectionKey,
  { title: string; coverImg: string; templateImg: string }
> = {
  IO: { title: "Internal orientation", coverImg: "/cards/repair-kit/cover.png", templateImg: "/cards/repair-kit/template.png" },
  DD: { title: "Defensiveness down", coverImg: "/cards/repair-kit/cover.png", templateImg: "/cards/repair-kit/template.png" },
  HE: { title: "Honest exchange", coverImg: "/cards/repair-kit/cover.png", templateImg: "/cards/repair-kit/template.png" },
  RP: { title: "Repair", coverImg: "/cards/repair-kit/cover.png", templateImg: "/cards/repair-kit/template.png" },
  IN: { title: "Integration", coverImg: "/cards/repair-kit/cover.png", templateImg: "/cards/repair-kit/template.png" },
};

// Modules as named and grouped on the sales page. `end` = last card id in the module.
export const REPAIR_KIT_PHASES: {
  key: RepairKitSectionKey;
  name: string;
  description: string;
  dayRange: string;
  end: number;
}[] = [
  { key: "IO", name: "Internal orientation", description: "Where each of you actually is, without performance or management.", dayRange: "Day 1–7", end: 7 },
  { key: "DD", name: "Defensiveness down", description: "The prompts that dissolve the guard before it forms.", dayRange: "Day 8–14", end: 14 },
  { key: "HE", name: "Honest exchange", description: "What's been waiting. Said without drama. Received without defence.", dayRange: "Day 15–21", end: 21 },
  { key: "RP", name: "Repair", description: "The conversations that close what's been open too long.", dayRange: "Day 22–28", end: 28 },
  { key: "IN", name: "Integration", description: "What you take forward. What you've built.", dayRange: "Day 29–31", end: 31 },
];

// Cards in fixed order. Module = sales-page day grouping (1–7, 8–14, 15–21, 22–28, 29–31).
export const REPAIR_KIT_CARDS: RepairKitCardPrompt[] = [
  { id: 1, section: "IO", lines: [{ text: "Tell me what you no longer say because it feels unsafe." }] },
  { id: 2, section: "IO", lines: [{ text: "Tell me what you're tired of carrying between us." }] },
  { id: 3, section: "IO", lines: [{ text: "Tell me why you feel alone even when we're together." }] },
  { id: 4, section: "IO", lines: [{ text: "Tell me what you miss most about us." }] },
  { id: 5, section: "IO", lines: [{ text: "Tell me when you first felt our relationship start to drift." }] },
  { id: 6, section: "IO", lines: [{ text: "Tell me what you think we keep avoiding." }] },
  { id: 7, section: "IO", lines: [{ text: "Tell me which part of this relationship feels heavy or unfair to you." }] },
  { id: 8, section: "DD", lines: [{ text: "Tell me what you're afraid will never change." }] },
  { id: 9, section: "DD", lines: [{ text: "Tell me what you've given up hoping for." }] },
  { id: 10, section: "DD", lines: [{ text: "Tell me what part of you feels unseen in this relationship." }] },
  { id: 11, section: "DD", lines: [{ text: "Tell me what you need from me that you're not receiving." }] },
  { id: 12, section: "DD", lines: [{ text: "Tell me what you need to hear from me, and haven't." }] },
  { id: 13, section: "DD", lines: [{ text: "Tell me where you feel I misunderstand you." }] },
  { id: 14, section: "DD", lines: [{ text: "Tell me how you experience me when I'm upset." }] },
  { id: 15, section: "HE", lines: [{ text: "Tell me what I do that hurts you the most." }] },
  { id: 16, section: "HE", lines: [{ text: "Tell me where you stopped trusting me or us." }] },
  { id: 17, section: "HE", lines: [{ text: "Tell me how that feels in your body." }] },
  { id: 18, section: "HE", lines: [{ text: "Tell me what happens inside of you when you protect yourself from me." }] },
  { id: 19, section: "HE", lines: [{ text: "Tell me what happens inside of you when you pull away." }] },
  { id: 20, section: "HE", lines: [{ text: "Tell me what happens inside of you when you feel I don't choose you." }] },
  { id: 21, section: "HE", lines: [{ text: "Tell me what you need from me to trust us again." }] },
  { id: 22, section: "RP", lines: [{ text: "Tell me what helps you feel safe enough to stay present with me." }] },
  { id: 23, section: "RP", lines: [{ text: "Tell me what repair would look like for you, specifically." }] },
  { id: 24, section: "RP", lines: [{ text: "Tell me what our relationship could look like if we both tried again." }] },
  { id: 25, section: "RP", lines: [{ text: "Tell me the truth you've been afraid to say out loud." }] },
  { id: 26, section: "RP", lines: [{ text: "Tell me what staying would require from both of us." }] },
  { id: 27, section: "RP", lines: [{ text: "Tell me what you need from me to feel chosen." }] },
  { id: 28, section: "RP", lines: [{ text: "Tell me what you're risking by staying silent." }] },
  { id: 29, section: "IN", lines: [{ text: "Tell me what you're risking by staying." }] },
  { id: 30, section: "IN", lines: [{ text: "Tell me what you're risking by leaving." }] },
  { id: 31, section: "IN", lines: [{ text: "Tell me, do you still want this relationship. Truly." }] },
];
