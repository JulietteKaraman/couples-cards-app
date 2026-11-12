// LET HER LAND. specs/let-her-land.md. Juliette's free offering in the Already Her Bundle.
// Her words are copied unchanged by script (the journal from specs/let-her-land-journal.md,
// the 21 prompts from the cards app data/decks/visibility-challenge.ts, the how-to text from
// The Visibility Practice, Touch Base from app/practice/touch-base/page.tsx). Do not retype them.
// Anything marked NEW COPY below is connecting copy written for the page and waits for her approval.

// ---------------------------------------------------------------------------
// AUDIO SLOTS (R9, R10). One place. To swap a recording, replace the file at that
// path or change the path here. An empty string, or a file that can't load, hides the
// player; the rest of the page still works.
// ---------------------------------------------------------------------------
export const AUDIO = {
  /** "A minute from me", on the hub. Empty until she records it, and hidden until then. */
  welcome: "",
  /** Part 2: Touch Base, guided. */
  touchBase: "/touch-base/touch-base-guided-music.m4a",
  /** Part 3: her voice for the grounding touch. */
  grounding: "/touch-map/audio/taste/sensual.m4a",
  /** Part 4: the hypnosis. */
  hypnosis: "/let-her-land/audio/hypnosis.m4a",
};

// The one door, 4 Nov 2026 (Juliette: "Yes, build it"). The waitlist comes later, by email.
export const DOOR_URL = "https://feelfullyyou.com/sacred-no";
export const DIR = "/let-her-land";

// ---------------------------------------------------------------------------
// PHOTOS. All hers, all solo. Swap a path here to change one.
// ---------------------------------------------------------------------------
export const PHOTOS = {
  cover: { src: `${DIR}/journal/cover-painting.jpg`, alt: "The painted cover of the Reinvention Journal", pos: "50% 40%" },
  thumb: { src: `${DIR}/photos/thumb.jpg` },
  me: { src: `${DIR}/photos/me.jpg`, alt: "Juliette" },
  meetHer: { src: `${DIR}/journal/pink-flowers.jpg`, alt: "Pink flowers in a vase, from the Reinvention Journal", pos: "50% 50%", ratio: "1 / 1" },
  anchorHer: { src: `${DIR}/journal/garden.jpg`, alt: "A garden in flower, from the Reinvention Journal", pos: "50% 50%", ratio: "1 / 1" },
  grounding: { src: `${DIR}/journal/red-bowl.jpg`, alt: "A red bowl of fruit, from the Reinvention Journal", pos: "50% 50%", ratio: "1 / 1" },
  beSeen: { src: `${DIR}/journal/purple-iris.jpg`, alt: "Purple irises, from the Reinvention Journal", pos: "50% 50%", ratio: "1 / 1" },
  door: { src: `${DIR}/photos/sacred-no.jpg`, alt: "The Sacred No", pos: "50% 30%", ratio: "4 / 5" },
  /** The Part 4 card: her printed Visibility Challenge card, 827 x 1181. Never redrawn. */
  card: { src: `${DIR}/card-template.png`, w: 827, h: 1181 },
  emblem: { src: `${DIR}/photos/emblem.png`, alt: "The Touch Base emblem: thumb pressed to forefinger" },
};

// ---------------------------------------------------------------------------
// NEW COPY. Connecting words written for this page. Needs Juliette's approval.
// ---------------------------------------------------------------------------
export const COPY = {
  coverKicker: "A free practice from Juliette",
  title: "Let Her Land",
  tagline: "Meet the woman you're becoming on the page. Then let her land in your body.",
  keepLine: "What you write stays on your phone. Not even I see it.",
  hello: (name: string) => (name ? `Hello, ${name}.` : "Hello."),
  ringOf: "of 4",
  resume: "Pick up where you left off",
  welcomeLabel: "A minute from me",
  storageBlocked: "Your phone isn't keeping what you write, so it will be gone when you close this page. Keep a copy as you go.",
  allParts: "← All four parts",
  newPhone: "If you get a new phone, this starts fresh. Keep a copy of what you've written.",
  keepCopy: "Keep a copy",
  copied: "Copied. Paste it into your notes or an email to yourself.",
  selectIt: "Your phone wouldn't copy it. Select this text and copy it yourself.",
  shareTitle: "My Let Her Land answers",
  writePlaceholder: "Write whatever comes.",
  savedLine: "Saved on this phone.",
  finishPart: "Back to the four parts",
  doorKicker: "Your next seven days",
  doorTitle: "The Sacred No",
  doorLine: "You've said yes when your body whispered no. You're no longer available for that.",
  doorAfterJournal: "You've just written what you're stopping. These seven days teach your body to hold that no.",
  doorButton: "See The Sacred No · £17 →",
  p3TouchHead: "Touch Base first",
  p3ListenHead: "Now my voice",
  p3ListenLine: "Keep the touch going and press play.",
  p4ListenHead: "Start with the hypnosis",
  p4HowHead: "How to work with them alone",
  p4HowNav: "Working alone",
  p4TodayHead: "Today's prompt",
  p4Done: "Mark today done ✓",
  p4AllDone: "All 21 done.",
  p4LookHead: "The ones you've done",
  p4LookEmpty: "Nothing here yet. Each day you finish will show up here.",
  // ---- Round 2 (12 Nov 2026) NEW COPY, waits for her approval ----
  begin: "Begin",
  start: "Start with Part 1",
  turnHint: "Tap to turn over",
  turnBack: "Turn back",
  desireWritten: "Desire written",
  desirePlaceholder: "What you want instead.",
  desireExtra: "Anything else you want.",
  desiresEmpty: "Your complaints turn into cards here. Add them on the screen before this one.",
  complaintPlaceholder: "One complaint at a time",
  complaintAdd: "Add",
  complaintRemove: "Remove this one",
  eyesStart: "Close your eyes",
  eyesSub: "2 minutes",
  eyesSkip: "Skip",
  eyesRunning: "Eyes closed. A soft chime tells you when it's time.",
  eyesOpen: "Open your eyes. Take your time.",
  sensesNext: "Next sense →",
  sensesBefore: "What you wrote before",
  tickDone: "Mark as done",
  letterTitle: "Her letter",
  letterLine: "Everything you wrote about her, in one place.",
  letterEmpty: "Her letter fills as you write. Go back and meet her first.",
  letterNext: "Her letter →",
  saveImage: "Save as image",
  imageSaved: "Saved. Look in your photos or downloads.",
  imageFail: "Your phone wouldn't save the image. Keep a copy instead.",
  p4Next: (n: number, when: string) => `Day ${n} opens ${when}.`,
};

export const PARTS = [
  { n: 1, name: "Meet her", line: "Write to the woman you are becoming.", photo: PHOTOS.meetHer.src, pos: "50% 25%" },
  { n: 2, name: "Anchor her", line: "Learn Touch Base, then try it for 7 days.", photo: PHOTOS.emblem.src, pos: "50% 50%" },
  { n: 3, name: "The grounding touch", line: "Do one grounding touch, led by my voice.", photo: PHOTOS.grounding.src, pos: "50% 62%" },
  { n: 4, name: "Be seen", line: "Listen, then answer one prompt a day for 21 days.", photo: PHOTOS.beSeen.src, pos: "70% 40%" },
] as const;


// ---------------------------------------------------------------------------
// ROUND 2: the six senses (her question, split into six prompts) and the labels on Her letter.
// Indexes are positions in JOURNAL. NEW COPY, waits for her approval (the six sense labels are in the spec).
// ---------------------------------------------------------------------------
export const SENSES = ["How she moves", "What she smells", "What she sees", "What she hears", "What she touches", "What she feels"];
export const EYES_SECONDS = 120;
export const LETTER: { group: string; rows: { q: number; label: string }[] }[] = [
  { group: "Meet her", rows: [{ q: 7, label: "What you notice about her" }, { q: 8, label: "Where she is" }, { q: 9, label: "How she feels" }, { q: 10, label: "Who is with her" }] },
  { group: "One year from now", rows: [{ q: 12, label: "Who is with her, a year on" }, { q: 13, label: "How she spends her time" }, { q: 14, label: "What she is most proud of" }, { q: 15, label: "Her advice to you" }, { q: 16, label: "What she says no to" }, { q: 17, label: "Her support" }, { q: 18, label: "How she thinks and feels" }] },
  { group: "Her senses", rows: [{ q: 19, label: "" }] },
  { group: "Today", rows: [{ q: 21, label: "3 ways to embody her" }, { q: 22, label: "3 actions to create her" }, { q: 24, label: "3 things to stop" }] },
];

// ---------------------------------------------------------------------------
// PART 1: The Reinvention Journal, her words, in her order. k: p = read, q = a question with
// a text box, tip = her tip. Screens group the lines (indexes into JOURNAL).
// ---------------------------------------------------------------------------
export type JLine = { k: "p" | "q" | "tip"; t: string };
export const JOURNAL: JLine[] = [
  {
    "k": "p",
    "t": "Reinventing ourselves is possible. Instead of memorising and replaying a NEGATIVE experience again and again from the past or creating a doomsday scenario in your head, you could choose to, in your mind, CREATE WHAT YOU would LIKE TO EXPERIENCE and HOW THAT WOULD FEEL if you got it."
  },
  {
    "k": "p",
    "t": "Picture yourself in it, smell the smells, feel the feels, see and hear what would drive you absolutely wild with joy!"
  },
  {
    "k": "p",
    "t": "The mind cannot distinguish between a \"made up reality\" and the real thing. It goes to work on the pictures that you are focusing on- Into your genius, when you feel Fully YOU!!"
  },
  {
    "k": "q",
    "t": "Make a list of your current complaints you are tolerating in your life?"
  },
  {
    "k": "q",
    "t": "Next list out the desires that you have for your future self:"
  },
  {
    "k": "tip",
    "t": "TIP: One way to access your desire is to take the list of your complaints and to reverse them, as all complaints are inverted desires."
  },
  {
    "k": "p",
    "t": "Close your eyes and bring your future reinvented self into your mind and heart. Let's get to fully know her since she has all the clues you will need to create your desired life."
  },
  {
    "k": "q",
    "t": "Write down what you notice about her. What can you see, hear or feel? What is happening to her?"
  },
  {
    "k": "q",
    "t": "What do you notice about the environment you are in?"
  },
  {
    "k": "q",
    "t": "What do you notice about how you feel?"
  },
  {
    "k": "q",
    "t": "Who are you with and what do you notice about your future desired relationships?"
  },
  {
    "k": "p",
    "t": "Now let's go into the future and meet the reinvented version of yourself and get to know her... Imagine that it is one year from now and you have been fully reinvented moving away from your complaints and living fully into your desires."
  },
  {
    "k": "q",
    "t": "Who are you with and what do you notice about your future desired relationships?"
  },
  {
    "k": "q",
    "t": "How do you spend your time?"
  },
  {
    "k": "q",
    "t": "What are you most proud of?"
  },
  {
    "k": "q",
    "t": "What advice does she have for you on how she created a life she fully loves?"
  },
  {
    "k": "q",
    "t": "What do you say NO to?"
  },
  {
    "k": "q",
    "t": "What support do you have?"
  },
  {
    "k": "q",
    "t": "What new ways of thinking and feeling do you embrace?"
  },
  {
    "k": "q",
    "t": "Let's use all your senses: How does she move, what does she smell, see, hear, touch, feel.?"
  },
  {
    "k": "p",
    "t": "Now let's come back into the NOW bringing with us all that wisdom. Go beyond feeling like your future self, actually take an action step that will anchor that into reality. Book a class she would want to go to. Start a writing project or business project. Dance! Follow your intuition and take the action step to live the life your reinvented self demands of you."
  },
  {
    "k": "q",
    "t": "What 3 ways can you embody your reinvented self today?"
  },
  {
    "k": "q",
    "t": "What are 3 actions that will create your reinvented self today"
  },
  {
    "k": "p",
    "t": "For your reinvented self to be fully created, you will need to make space for her and that means stopping doing things your old self would do. Saying no to one thing is a powerful opportunity to say yes to something new. list the behaviours and beliefs that you will say no to TODAY"
  },
  {
    "k": "q",
    "t": "What 3 things will I stop doing in my present life to ensure my future desires happen?"
  }
];
export const JOURNAL_SCREENS: number[][] = [[0, 1, 2], [3], [4, 5], [6, 7], [8], [9], [10], [11, 12], [13], [14], [15], [16], [17], [18], [19], [20, 21], [22], [23, 24]];

// ---------------------------------------------------------------------------
// PART 2 and 3: Touch Base, her words, from app/practice/touch-base/page.tsx.
// ---------------------------------------------------------------------------
export const TB_HEAD = "Touch Base®, the Anchor";
export const TB_LINE = "A tiny gesture. A massive shift. Two minutes, no equipment.";
export const TB_WITH_ME = ["Do it with me", "Press play, close your eyes, follow my voice."];
export const TB_AUDIO_LABEL = "Touch Base, guided by me · 5 min";
export const TB_STEPS: [string, string][] = [
  ["Press thumb to forefinger:", "begin with this simple, grounding gesture."],
  ["Move slowly, like honey:", "feel every ridge of your skin. Slower than you think slow is. Then slower still."],
  ["Notice and release:", "notice where you want to speed up, notice the thoughts that rise, and let them pass."],
  ["Remind yourself:", "there is no tiger in the room. I am safe."],
  ["Two minutes, twice a day:", "morning and evening. Before you begin, rate how you feel one to ten. After two minutes, rate again."],
];
export const TB_WHY = {
  eyebrow: "Why it works",
  small: "Paired with slowness, breath and attention, this gesture downregulates the stress response.",
  big: "You are gently teaching your system to associate this moment with safety.",
  marks: [
    ["31", "Thirty-one days,", "it becomes automatic."],
    ["90", "Ninety days,", "it is muscle memory, you will reach for it instinctively."],
  ] as [string, string, string][],
  close: "The body follows the focus. Give it something worth finding.",
};
/** The tracker runs 7 days, like the live Touch Base page (Juliette, 4 Nov 2026). */
export const TB_DAYS = 7;

// ---------------------------------------------------------------------------
// PART 4: The Visibility Practice. The 21 prompts verbatim; day 1 lines first (bold) then the rest.
// ---------------------------------------------------------------------------
export type VPrompt = { day: number; lines: { text: string; bold?: boolean }[] };
export const PROMPTS: VPrompt[] = [
  {
    "day": 1,
    "lines": [
      {
        "text": "Tell me what does “being seen” bring up for you.",
        "bold": true
      }
    ]
  },
  {
    "day": 2,
    "lines": [
      {
        "text": "Tell me where in your body do you feel resistance to being fully visible.",
        "bold": true
      }
    ]
  },
  {
    "day": 3,
    "lines": [
      {
        "text": "Tell me about a memory where you felt truly seen.",
        "bold": true
      },
      {
        "text": "What made it safe?",
        "bold": false
      }
    ]
  },
  {
    "day": 4,
    "lines": [
      {
        "text": "Tell me what part of you longs to be witnessed today.",
        "bold": true
      }
    ]
  },
  {
    "day": 5,
    "lines": [
      {
        "text": "Tell me how you would show up today if you knew you could not be rejected.",
        "bold": true
      }
    ]
  },
  {
    "day": 6,
    "lines": [
      {
        "text": "Tell me what masks you are ready to lay down.",
        "bold": true
      }
    ]
  },
  {
    "day": 7,
    "lines": [
      {
        "text": "Tell me what truth you’re scared to say out loud.",
        "bold": true
      }
    ]
  },
  {
    "day": 8,
    "lines": [
      {
        "text": "Tell me who benefits when you silence yourself.",
        "bold": true
      },
      {
        "text": "Who loses?",
        "bold": false
      }
    ]
  },
  {
    "day": 9,
    "lines": [
      {
        "text": "Tell me where in your life you are craving deeper intimacy or recognition.",
        "bold": true
      }
    ]
  },
  {
    "day": 10,
    "lines": [
      {
        "text": "Tell me what your body’s signs are that you’re expanding into more visibility.",
        "bold": true
      }
    ]
  },
  {
    "day": 11,
    "lines": [
      {
        "text": "Tell me, if your visibility was an energy, what characteristics would it have.",
        "bold": true
      },
      {
        "text": "Colour, shape, weight.",
        "bold": false
      }
    ]
  },
  {
    "day": 12,
    "lines": [
      {
        "text": "Tell me how you want people to feel when they experience your energy.",
        "bold": true
      }
    ]
  },
  {
    "day": 13,
    "lines": [
      {
        "text": "Tell me what you need to hear right now from the most loving version of yourself.",
        "bold": true
      }
    ]
  },
  {
    "day": 14,
    "lines": [
      {
        "text": "Tell me where you can be 5% more visible today, in a way that feels good.",
        "bold": true
      }
    ]
  },
  {
    "day": 15,
    "lines": [
      {
        "text": "Tell me what desire you’ve kept hidden that wants to be expressed.",
        "bold": true
      }
    ]
  },
  {
    "day": 16,
    "lines": [
      {
        "text": "Tell me what version of you people are already responding to, even when you hold back.",
        "bold": true
      }
    ]
  },
  {
    "day": 17,
    "lines": [
      {
        "text": "What limiting belief am I ready to rewrite around being seen?",
        "bold": true
      }
    ]
  },
  {
    "day": 18,
    "lines": [
      {
        "text": "Tell me one bold truth you’re claiming today.",
        "bold": true
      }
    ]
  },
  {
    "day": 19,
    "lines": [
      {
        "text": "Tell me what one touch you can give yourself that has you feel more alive.",
        "bold": true
      }
    ]
  },
  {
    "day": 20,
    "lines": [
      {
        "text": "Tell me what one action step you can take today so your presence is more felt today.",
        "bold": true
      }
    ]
  },
  {
    "day": 21,
    "lines": [
      {
        "text": "Tell me what has shifted for you in these 21 days.",
        "bold": true
      },
      {
        "text": "What is now possible?",
        "bold": false
      }
    ]
  }
];

/** "How to work with them alone", verbatim from The Visibility Practice. */
export const HOW_ALONE: string[] = [
  "Set a timer, five minutes is enough to start.",
  "Ask yourself the question, out loud. Then answer either out loud or write your answer down.",
  "Then ask it again, and again, for the whole five minutes, the same question, each time.",
  "The first answer is surface swimming.",
  "You may say it once and you'll believe you're done.",
  "Ask it again and something underneath it starts to shift.",
  "By the fifth or sixth answer, you're somewhere you didn't expect to be.",
  "I call it clearing the pipes!",
];
