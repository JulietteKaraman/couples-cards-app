// Scrumptious Confessions membership (specs/scrumptious-confessions-membership.md).
// Server only: read by /api/confessions after it has checked access, so dates and
// audio paths never reach anyone who hasn't paid. One line per story or card.
// publish_on = the UK day it opens. Audio: AAC with faststart, unguessable file name.
export type ConfessionStory = { id: string; publish_on: string; title: string; line: string; audio: string };
export type ConfessionCard = { id: string; publish_on: string; prompt: string };

export const CONFESSION_STORIES: ConfessionStory[] = [
  // Her own recording, 2 Nov 2026, the same file How to Feel Like a Woman plays.
  { id: "tilt-your-beard", publish_on: "2026-11-02", title: "Tilt your beard", line: "The one where I confess who's really in charge.", audio: "/how-to-feel-like-a-woman/audio/confession-2026-11-02-0944cc5b.m4a" },
];

export const CONFESSION_CARDS: ConfessionCard[] = [
  { id: "body-said-yes", publish_on: "2026-11-02", prompt: "Tell me the last time your body said yes before your head got involved." },
];
