// Scrumptious Confessions membership (specs/scrumptious-confessions-membership.md).
// Server only: read by /api/confessions after it has checked access, so dates and
// audio paths never reach anyone who hasn't paid. One line per story or card.
// publish_on = the UK day it opens. Audio: AAC with faststart, unguessable file name.
export type ConfessionStory = { id: string; publish_on: string; title: string; line: string; audio: string };
export type ConfessionCard = { id: string; publish_on: string; prompt: string };

export const CONFESSION_STORIES: ConfessionStory[] = [
  // Her own recording, 2 Nov 2026. Moved to Mon 7 Dec as confession 3 (Juliette 17 Nov: "confession 3 should be tilt your beard").
  { id: "tilt-your-beard", publish_on: "2026-12-07", title: "Tilt your beard", line: "The one where I confess who's really in charge.", audio: "/how-to-feel-like-a-woman/audio/confession-2026-11-02-0944cc5b.m4a" },
];

export const CONFESSION_CARDS: ConfessionCard[] = [
  { id: "body-said-yes", publish_on: "2026-11-02", prompt: "Tell me the last time your body said yes before your head got involved." },
  // Juliette's new cards for the membership (17 Nov 2026), one each Monday, paired with that week's confession.
  { id: "touch-you-put-up-with", publish_on: "2026-11-23", prompt: "Tell me a kind of touch you put up with, and what you'd rather have instead." },
  { id: "no-never-said", publish_on: "2026-11-30", prompt: "Tell me about a no you never said out loud." },
  { id: "take-off-you", publish_on: "2026-12-07", prompt: "Tell me what you'd love someone to take off you, even for a minute." }, // her line from Tilt your beard
  // Thursday cards (Juliette 17 Nov: "maybe 2 different cards"): Monday's echoes the confession, Thursday's moves them on.
  { id: "safe-enough", publish_on: "2026-11-26", prompt: "Tell me what makes you feel safe enough to be touched." },
  { id: "need-to-hear", publish_on: "2026-12-03", prompt: "Tell me what you need to hear before you can say yes." },
  { id: "fifteen-perfect", publish_on: "2026-12-10", prompt: "Tell me what fifteen minutes of perfect touch would look like for you." },
];
