// The Sacred No, £17. Moved into the app 17 Oct 2026 (specs/sacred-no-in-app.md).
//
// Source of truth for the videos: feelfullyyou-site/sacred-no-members.html,
// the old password page. Its nine Google Drive iframes were read in page
// order and each file id is mapped below to the title Juliette gave it in
// the spec (R2). No new hosting, no re-upload: these are the same files.
// The members page stays live as a quiet backup (R16) and nothing here
// links to it.
//
// Every entry is open the moment a buyer has access (R3). This is a
// free-browse collection, modelled on the non-drip guides, never on the
// 31 Touch Points one-day-at-a-time drip.
//
// The lesson descriptions are the members page's own lines, lightly
// corrected (the page said "seven lessons" and carried "sitting
// underneath"). The last day ends on One Touch as the single next step,
// with the Touch Reset call as a quieter line under it (R4). No price
// appears anywhere in this file, so nothing here needs an edit when a
// price changes.

import { PracticeCollection } from "./ten-touch-rituals";

const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const theSacredNo: PracticeCollection = {
  slug: "the-sacred-no",
  title: "The Sacred No",
  subtitle:
    "Nine short videos, a few minutes each. Watch them in any order, at any pace. There is no wrong way to move through this.",
  byline: "By Juliette Karaman",
  heroImage: "/sacred-no/hero.jpg",
  unlockMode: "free-browse",
  entries: [
    {
      slug: "welcome",
      order: 0,
      title: "Welcome",
      eyebrow: "Before you begin",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "How often do you say yes and mean no?", emphasis: "bold" },
        {
          kind: "p",
          text: "The challenge ahead of you: a week of short lessons to start noticing what happens in your body in the exact moment a yes and a no are both trying to speak at once.",
        },
        { kind: "driveVideo", url: drive("182L01c5FYbPJ8YBqSH48wQKAA-r2vaXJ"), label: "Welcome" },
      ],
    },
    {
      slug: "why-is-no-so-difficult",
      order: 1,
      title: "1 Why is no so difficult",
      eyebrow: "Lesson 1",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "Where this actually comes from: how we're conditioned from childhood to keep pushing until a no becomes a yes, and why that pattern followed you into every relationship since.",
        },
        { kind: "driveVideo", url: drive("14uK4B3K4-Hl44Rm4MlsLHTi1x1tud3YF"), label: "Lesson 1" },
      ],
    },
    {
      slug: "body-as-a-compass",
      order: 2,
      title: "2 Body as a compass",
      eyebrow: "Lesson 2",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "A simple kinesiology practice to feel your own body's real yes and real no, so you can recognise the difference before your mind talks you out of it.",
        },
        { kind: "driveVideo", url: drive("1Rvuo5_Ote8UbofjTLt7cMMGnJlxMI3SN"), label: "Lesson 2" },
      ],
    },
    {
      slug: "rrrr-process",
      order: 3,
      title: "3 RRRR process",
      eyebrow: "Lesson 3",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "The Rapid Release Rewire Restore® process. A full process for working through the emotion still living underneath a time you said yes when your body was already saying no.",
        },
        { kind: "driveVideo", url: drive("15cXfLYktIj09TNPwDWHLyDCPoeNdcZid"), label: "Lesson 3" },
      ],
    },
    {
      slug: "touch-base",
      order: 4,
      title: "Touch Base session 4",
      eyebrow: "Lesson 4",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "Two minutes, your own hands. The anchor that brings your body back to safe enough to actually feel what it wants, before you answer anyone.",
        },
        { kind: "driveVideo", url: drive("1hmSbssx6IV04FMkRGUzw_22AmAwsVqa_"), label: "Lesson 4" },
      ],
    },
    {
      slug: "standards-with-others",
      order: 5,
      title: "Standards with others",
      eyebrow: "Lesson 5",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "Where your boundaries are leaking with the people around you, friends, family, the ones who drain more than they give. A real look at your nos and your yeses with other people.",
        },
        { kind: "driveVideo", url: drive("1z6wmOgueesXQaxSTy3vvikyeP6eA02tt"), label: "Lesson 5" },
      ],
    },
    {
      slug: "standards-with-self",
      order: 6,
      title: "Standards with self",
      eyebrow: "Lesson 6",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "The standards you keep once no one else is watching, your phone in bed, how you talk to yourself, what your own routine says about what you believe you deserve.",
        },
        { kind: "driveVideo", url: drive("1NOtDXfaB3prEpybDSUTiSkAOQK-BWh2K"), label: "Lesson 6" },
      ],
    },
    {
      slug: "the-last-day",
      order: 7,
      title: "The last day",
      eyebrow: "Lesson 7",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "A closing reflection and a release practice, on everything you've noticed this week and what's already started to shift.",
        },
        { kind: "driveVideo", url: drive("1HosI7C7hX42wX19ieqylne-SOHTYZDue"), label: "Lesson 7" },
        { kind: "big", text: "You know your no now." },
        {
          kind: "p",
          text: "That alone changes what happens next. You've done real work this week, and you know more about your own yes and your own no than you did when you started.",
        },
        {
          kind: "p",
          text: "If you want to keep going on your own, One Touch is the next step: seven days, your own hands, no partner required.",
        },
        {
          kind: "bigLink",
          text: "Start One Touch",
          subtext: "Seven days, your own hands",
          href: "https://feelfullyyou.com/one-touch",
        },
        {
          kind: "p",
          text: "If you'd like to talk through where you are with your no, and what could come next, you can book a call with me.",
        },
        { kind: "link", text: "Book a Touch Reset call", href: "https://tidycal.com/juliette2/the-touch-reset-call" },
      ],
    },
    {
      slug: "bonus-meditation",
      order: 8,
      title: "Bonus meditation",
      eyebrow: "Bonus",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "A full guided meditation on saying no as an act of love for yourself. Come back to this any time you need it, long after the last lesson.",
        },
        { kind: "driveVideo", url: drive("1ky9FWoeBl0jsxm1-D_BRDOShH9clqGkS"), label: "Bonus meditation" },
      ],
    },
  ],
};
