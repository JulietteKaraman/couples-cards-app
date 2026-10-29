// Juliette's own Pleasure Language quiz, word for word from her Google Form
// "Welcome to the Unlock Your Pleasure Language Quiz!" (Whats Your Pleasure
// Language - Beginning NEW), used in The Beginning. Pulled 29 Oct 2026.
// In every question her five answers come in the same order: kinky, sensual,
// sexual, energetic, shapeshifter. Two tiny edits for her voice rules: one em
// dash became a comma, "I assume I'm the problem" became "I assume it's me".
import type { LanguageId } from "./touch-map";

export type QuizQuestion = { q: string; answers: { text: string; lang: LanguageId }[] };

export const PLEASURE_QUIZ: QuizQuestion[] = [
  {
    "q": "The kind of presence that opens me is...",
    "answers": [
      {
        "text": "Edgy or commanding, when someone leads with intensity or play.",
        "lang": "kinky"
      },
      {
        "text": "Sensory-rich and slow, like soft touch and warm light.",
        "lang": "sensual"
      },
      {
        "text": "Direct, bold, and unapologetic.",
        "lang": "sexual"
      },
      {
        "text": "Grounded, steady, and attuned to my rhythm.",
        "lang": "energetic"
      },
      {
        "text": "A blend of presence, depth, and curiosity. If it's only one-note, I drift.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "I disconnect when...",
    "answers": [
      {
        "text": "There's no contrast, risk, or dynamic. I feel flat without it.",
        "lang": "kinky"
      },
      {
        "text": "The mood is wrong, harsh light, cluttered space, no touch.",
        "lang": "sensual"
      },
      {
        "text": "There's no spark. If desire isn't felt clearly, I zone out.",
        "lang": "sexual"
      },
      {
        "text": "Someone skips emotional or energetic alignment and moves straight to touch. My body shuts down before it begins.",
        "lang": "energetic"
      },
      {
        "text": "The experience stays in one gear. I show up, but not fully.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "I feel most alive when...",
    "answers": [
      {
        "text": "They look at me and say, \"Don't move.\" That's where the thrill lives.",
        "lang": "kinky"
      },
      {
        "text": "My body is slowly invited in with texture, scent, and soothing tone.",
        "lang": "sensual"
      },
      {
        "text": "They kiss me without hesitation. I want action, not warm-up.",
        "lang": "sexual"
      },
      {
        "text": "I can feel the space between us like a current, each breath, pause, glance.",
        "lang": "energetic"
      },
      {
        "text": "It begins in one way and unfolds into something else entirely. That shift wakes me up.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "When I feel fully at ease in intimacy, it's usually because...",
    "answers": [
      {
        "text": "The power dynamic shifts, and something unsaid comes into play.",
        "lang": "kinky"
      },
      {
        "text": "The room feels soft. The textures, the scent, the music, they help me melt.",
        "lang": "sensual"
      },
      {
        "text": "They want me. Now. And I feel it in how they move.",
        "lang": "sexual"
      },
      {
        "text": "Their presence is clean and still. They meet me with attention, not pressure.",
        "lang": "energetic"
      },
      {
        "text": "The atmosphere is alive, changing, layered, sensual, playful.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "I struggle to stay present when...",
    "answers": [
      {
        "text": "It's too safe or neutral. I need a challenge to engage.",
        "lang": "kinky"
      },
      {
        "text": "The space feels rushed or chaotic. I freeze and go into my head.",
        "lang": "sensual"
      },
      {
        "text": "It becomes about performance instead of real desire.",
        "lang": "sexual"
      },
      {
        "text": "They rush in without attunement. I disconnect even if I say yes.",
        "lang": "energetic"
      },
      {
        "text": "I'm only met in one part of me. I start performing instead of feeling.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "What draws me in and keeps me open is...",
    "answers": [
      {
        "text": "The unexpected. When I can't predict what comes next.",
        "lang": "kinky"
      },
      {
        "text": "Texture. Scent. Sound. When the details are right, my whole body says yes.",
        "lang": "sensual"
      },
      {
        "text": "A bold move. Clear want. No fluff.",
        "lang": "sexual"
      },
      {
        "text": "A pause before contact. That space lights up everything.",
        "lang": "energetic"
      },
      {
        "text": "Freedom to move between it all, without being boxed.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "I feel most satisfied when...",
    "answers": [
      {
        "text": "They take control, tease, or give me instructions.",
        "lang": "kinky"
      },
      {
        "text": "I'm courted through touch, scent, and softness.",
        "lang": "sensual"
      },
      {
        "text": "There's clear, embodied desire. We don't overthink it when we go there.",
        "lang": "sexual"
      },
      {
        "text": "The tension builds slowly, through breath and gaze.",
        "lang": "energetic"
      },
      {
        "text": "We flow between desire, play, intensity, and presence.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "I start checking out when...",
    "answers": [
      {
        "text": "It stays too soft. I want to be pushed or led.",
        "lang": "kinky"
      },
      {
        "text": "The environment is off, no rhythm, no warmth, no attention to detail.",
        "lang": "sensual"
      },
      {
        "text": "There's too much build-up and no follow-through. I lose the heat.",
        "lang": "sexual"
      },
      {
        "text": "I'm not emotionally seen before touch begins. I collapse into shutdown.",
        "lang": "energetic"
      },
      {
        "text": "The moment feels like a script. I say yes, but I'm not really there.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "Physical intimacy lands most when...",
    "answers": [
      {
        "text": "They create a spark of resistance or tension, then lead me through it.",
        "lang": "kinky"
      },
      {
        "text": "The space is beautiful and held. My senses are alive.",
        "lang": "sensual"
      },
      {
        "text": "They don't hesitate. I feel wanted, and they act on it.",
        "lang": "sexual"
      },
      {
        "text": "The energy is slow and intentional, I soften before I'm touched.",
        "lang": "energetic"
      },
      {
        "text": "Each moment brings something new. No two encounters feel the same.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "The moment I feel most turned on is...",
    "answers": [
      {
        "text": "When they say, \"Look at me. Keep still.\" My whole body wakes up.",
        "lang": "kinky"
      },
      {
        "text": "When the lights are low, music is soft, and I feel held.",
        "lang": "sensual"
      },
      {
        "text": "When they undress slowly and let me feel their full want.",
        "lang": "sexual"
      },
      {
        "text": "When the gaze softens and they breathe with me.",
        "lang": "energetic"
      },
      {
        "text": "When the moment shifts unexpected, layered, and alive.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "I've learned to hide parts of my desire because...",
    "answers": [
      {
        "text": "People misread my need for play or edge. So I keep it to myself.",
        "lang": "kinky"
      },
      {
        "text": "I've been told my pace or slowness is too much.",
        "lang": "sensual"
      },
      {
        "text": "If it isn't bold, clear, or hot, I assume it's me.",
        "lang": "sexual"
      },
      {
        "text": "My turn-on doesn't look like what others expect, so I stay quiet.",
        "lang": "energetic"
      },
      {
        "text": "I adapt to what they want instead of asking for what I need.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "What excites me most is...",
    "answers": [
      {
        "text": "Being taken somewhere new, through edge, tease, command, or roleplay.",
        "lang": "kinky"
      },
      {
        "text": "A warm atmosphere, soft textures, and attuned presence.",
        "lang": "sensual"
      },
      {
        "text": "Touch that shows real want, without needing a reason.",
        "lang": "sexual"
      },
      {
        "text": "Eye contact that lingers. Energy that builds without words.",
        "lang": "energetic"
      },
      {
        "text": "When it's not just one tone, when everything I crave gets to land.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "The thing that frustrates me most in intimacy is...",
    "answers": [
      {
        "text": "When there's no risk, surprise, or power play. It starts to feel flat.",
        "lang": "kinky"
      },
      {
        "text": "Feeling rushed or unheld. I need time to soften.",
        "lang": "sensual"
      },
      {
        "text": "Losing the physical spark. If desire fades, I struggle to stay engaged.",
        "lang": "sexual"
      },
      {
        "text": "When the moment is all intensity and no pacing. I short-circuit.",
        "lang": "energetic"
      },
      {
        "text": "Being met in only one part of me. I'm there, but not fully felt.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "My deepest pleasure comes when...",
    "answers": [
      {
        "text": "I feel owned, seen, and met in the dark corners too.",
        "lang": "kinky"
      },
      {
        "text": "I'm led into sensation with slowness and care.",
        "lang": "sensual"
      },
      {
        "text": "We act on desire like it matters now. Not later.",
        "lang": "sexual"
      },
      {
        "text": "My partner reads my energy like a language.",
        "lang": "energetic"
      },
      {
        "text": "I don't have to choose. I get to move through softness, depth, heat, and play.",
        "lang": "shapeshifter"
      }
    ]
  },
  {
    "q": "My body opens most when...",
    "answers": [
      {
        "text": "There's real trust, playful edge, and surprise.",
        "lang": "kinky"
      },
      {
        "text": "The lights dim, the scent lands, and they begin with a touch that lingers.",
        "lang": "sensual"
      },
      {
        "text": "There's no hesitation. They lead, and I follow.",
        "lang": "sexual"
      },
      {
        "text": "The connection is layered, emotional, energetic, erotic.",
        "lang": "energetic"
      },
      {
        "text": "Nothing is off-limits. I feel free to bring every part of me.",
        "lang": "shapeshifter"
      }
    ]
  }
];

// THE QUICK QUIZ (29 Oct 2026, v4). Built from taking the competitors'
// quizzes ourselves: the Libido Fairy (Juliet Allen, 10 Qs), Practical
// Intimacy (5 types, question 1 on the landing page) and Mel Wells (2 min).
// All three are plain tap lists. What makes them work: every answer is a
// sentence she has already said to herself, and it starts at once. So: one
// photo pick to start, then eight of Juliette's OWN questions with
// her FULL answers (never cut to fragments, that killed recognition in v3),
// plus one Slow / Now breather. 10 taps, about 2 minutes.
export type QuickStep =
  | { kind: "pick"; q: string; answers: { text: string; lang: LanguageId }[]; photos?: boolean }
  | { kind: "pair"; q: string; a: { text: string; langs: LanguageId[] }; b: { text: string; langs: LanguageId[] } };

const hers = (n: number): QuickStep => ({ kind: "pick", q: PLEASURE_QUIZ[n].q, answers: PLEASURE_QUIZ[n].answers });

export const QUICK_QUIZ: QuickStep[] = [
  { kind: "pick", photos: true, q: "Which one pulls you in first?", answers: [
    { text: "Nearly touching", lang: "energetic" },
    { text: "Slow and lingering", lang: "sensual" },
    { text: "Direct and wanting", lang: "sexual" },
    { text: "A little power in it", lang: "kinky" },
    { text: "All of it", lang: "shapeshifter" },
  ] },
  hers(2),  // I feel most alive when...
  hers(1),  // I disconnect when...
  { kind: "pair", q: "Right now, I want it...", a: { text: "Slow", langs: ["sensual", "energetic"] }, b: { text: "Now", langs: ["sexual", "kinky"] } },
  hers(9),  // The moment I feel most turned on is...
  hers(10), // I've learned to hide parts of my desire because...
  hers(5),  // What draws me in and keeps me open is...
  hers(12), // The thing that frustrates me most in intimacy is...
  hers(13), // My deepest pleasure comes when...
];
