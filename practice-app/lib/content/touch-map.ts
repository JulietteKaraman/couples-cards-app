// The Touch Map, version 1 (spec: APP builds/specs/touch-map.md, 29 Oct 2026).
//
// Every word here comes from Juliette's own material: her Touch Menu pages
// (How to Use This Menu, Energetic Non-Touch, Fabric Tease), her old Touch
// Map page (the areas and the one-line Pleasure Language descriptions), her
// wrist practice (12 Oct), and the recording scripts batch 1 (28 Oct).
// The app never writes a touch of its own.
//
// Version 1 = Level 1 only: the same two touches (Touch A the hover,
// Touch B the fabric) on a different area each day, never more than two
// touches a day (Juliette, 28 Oct).

export const TM_SLUG = "touch-map";

// Payment link not created yet (no £197 Touch Map price exists in Stripe on
// 29 Oct). Swap in the real link before the push.
export const TM_BUY_URL = "https://buy.stripe.com/aFaaEWfSz916eu9bz70co2e"; // The Touch Map £197, plink_1UL6EFCCw18geY15XlehyUTm
export const TM_APPLY_URL = "https://feelfullyyou.com/apply";
// VIP Touch Map: 30 minutes online, Juliette guiding both partners. Price and
// booking link are hers to set (spec O2); the card shows no price until then.
export const TM_VIP_BOOK_URL: string | null = null;

// Recordings arrive from her batch-1 session. Until a file exists the app
// shows the written version (spec E8). Paths are where they will live.
export const TM_AUDIO: Record<string, string | null> = {
  capacity: "/touch-map/audio/capacity.m4a", // Drive "1. Why 2 touches.m4a", 29 Oct
  welcome: "/touch-map/audio/welcome.m4a", // Drive "New welcome.m4a", 29 Oct
  taster: "/touch-map/audio/taster.m4a", // Drive "New free taster.m4a", 29 Oct
  steerIntro: "/touch-map/audio/steer-intro.m4a", // Drive "Steer intro.m4a", 29 Oct
  feeding: "/touch-map/audio/feeding.m4a", // Drive "6. The feeding.m4a", chapter 2 (later)
  touchA: null,
  touchB: null,
  fullStop: "/touch-map/audio/full-stop.m4a", // Drive "New Recording 277. The full stop.m4a"
  thatsToday: "/touch-map/audio/thats-today.m4a", // Drive "8. That's today.m4a"
};

export type Answer = "yes" | "maybe" | "no";

// Her own scale, word for word from her Touch Map page.
export const ANSWERS: { id: Answer; label: string; short: string; color: string }[] = [
  { id: "yes", label: "Yes, more of that", short: "Yes", color: "#3E9B5F" },
  { id: "maybe", label: "Maybe, depends", short: "Maybe", color: "#D9952B" },
  { id: "no", label: "No, not there", short: "No", color: "#B5443B" },
];

export type View = "front" | "back";
export type Area = { id: string; label: string; view: View };

// Her zone list, front and back (her Touch Map page).
export const AREAS: Area[] = [
  { id: "face-scalp", label: "Face and scalp", view: "front" },
  { id: "throat-neck", label: "Throat and neck", view: "front" },
  { id: "collarbone-shoulders", label: "Collarbone and shoulders", view: "front" },
  { id: "chest-heart", label: "Chest and heart", view: "front" },
  { id: "inner-arms", label: "Inner arms", view: "front" },
  { id: "outer-arms", label: "Outer arms", view: "front" },
  { id: "hands-wrists", label: "Hands and wrists", view: "front" },
  { id: "belly-ribs", label: "Belly and ribs", view: "front" },
  { id: "hips-lower-belly", label: "Hips and lower belly", view: "front" },
  { id: "thighs", label: "Thighs, inner and outer", view: "front" },
  { id: "back-of-head", label: "Scalp and back of head", view: "back" },
  { id: "nape", label: "Nape of the neck", view: "back" },
  { id: "shoulders-traps", label: "Shoulders and traps", view: "back" },
  { id: "shoulder-blades", label: "Shoulder blades", view: "back" },
  { id: "backs-of-arms", label: "Backs of the arms", view: "back" },
  { id: "elbows-forearms", label: "Elbows and forearms", view: "back" },
  { id: "spine-mid-back", label: "Spine, mid back", view: "back" },
  { id: "lower-back-sacrum", label: "Lower back and sacrum", view: "back" },
  { id: "backs-of-thighs", label: "Backs of the thighs", view: "back" },
  { id: "calves-soles", label: "Calves, ankles, soles", view: "back" },
];

// The gentle first area (spec O3 is hers; this is the area her own taster
// and Touch Menu start with).
export const FIRST_AREA = "hands-wrists";

// Level 1: the two touches. Instructions from her Touch Menu pages.
export const TOUCHES = {
  A: {
    name: "Touch A",
    language: "Energetic",
    // Her one-liner from her Touch Map page.
    describe: "Hovering, heat, nearly touching",
    title: "The hover",
    audio: "touchA",
    lines: [
      "Hold your hand about five inches above your skin. No contact. None.",
      "Stay there. Can you feel anything... heat, tingling, a little pressure? Maybe nothing yet. That's fine.",
      "Take a slow breath with your hand still hovering. Does your breath change? Deepen... pause... go shallow? Is it easy to stay this still, or is there an itch to DO something?",
      "Now bring your hand closer. Inch by inch. Slower than you think.",
      "Does the sensation grow as you come in, or fade? Does your body want to lean in to meet it... or pull away?",
      "Find the point where it feels just right to land... or not at all.",
      "Now close your eyes and do it once more. Was it different with your eyes closed?",
    ],
  },
  B: {
    name: "Touch B",
    language: "Sensual",
    describe: "Slow, lingering, whole palm",
    title: "Fabric",
    audio: "touchB",
    needs: "A silk scarf or any soft fabric",
    lines: [
      "Grab your fabric. A silk scarf, a soft cotton top, an old t-shirt- whatever's closest.",
      "Drape it over your skin. Let it just lie there. Feel the weight of it. Hardly anything, right?",
      "Now the texture... is it cool? Smooth? Does your skin prickle, goosebumps, or does it want to shrug it off? All of it counts. Irritation is information too!",
      "Take one corner and lift it off. Slowly. SLOWER than that. Like you're peeling the sensation off your skin...",
      "What happens as it leaves you? Is there a little ache for it to come back?",
      "Drape it again, just next to where it was. Does it feel different here? More alive... or more on edge?",
    ],
  },
} as const;

// "What happened?" (spec R9). Juliette records each note in her own words.
// The adjust line is what the app does next, from the spec.
export const WHAT_HAPPENED: { id: string; label: string; next: "slower" | "pause" | "on" | "again" }[] = [
  { id: "tickled", label: "It tickled", next: "slower" },
  { id: "numb", label: "I went numb", next: "pause" },
  { id: "wandered", label: "My mind wandered", next: "pause" },
  { id: "too-fast", label: "Too fast", next: "slower" },
  { id: "too-slow", label: "Too slow", next: "again" },
  { id: "laughed", label: "I laughed", next: "again" },
  { id: "teary", label: "I got teary", next: "pause" },
  { id: "more", label: "I wanted more", next: "again" },
  { id: "nothing", label: "Nothing at all", next: "on" },
];
export const WH_AUDIO: Record<string, string | null> = Object.fromEntries(WHAT_HAPPENED.map((w) => [w.id, null]));
export const NEXT_LINE: Record<string, string> = {
  slower: "Try it once more, slower and lighter.",
  pause: "Pause. Thumb to forefinger, slow, like honey. Then come back to it.",
  again: "Stay with it a little longer.",
  on: "That's information too. Move on to the next one.",
};

// Written versions of her recordings (shown behind "Can't use sound?", so the
// page never repeats the voice note word for word on screen).
export const SCRIPTS: Record<string, string[]> = {
  capacity: [
    "Two touches. That's it for today.",
    "I know... you want to do the whole body in one go. Most of us were never taught to stay with ONE touch. Not even for three minutes.",
    "Too much, too fast, too soon floods the system. Even a touch that feels gorgeous can become too much if your body isn't used to receiving it.",
    "So we build it. Like a muscle. A little today. A little more next week.",
    "So often the women I work with want the one big session. The long weekend away. The capacity just isn't there yet... so nothing lands.",
    "This way it lands. Two touches. Let them land. Then come back tomorrow.",
  ],
  welcome: [
    "Hi, I'm so glad you're here. This is your Touch Map.",
    "We start with you. Your own hand, your own skin, before anyone else has an opinion about it.",
    "Each day is one place on your body. Two touches. The first one, just as it comes. The second one, you steer... out loud, in tiny words, until it lands.",
    "Almost nobody was ever taught this.",
    "Green, yes. Orange, maybe. Red, not right now. All of it is information.",
    "Your map colours in as you go, and your recipe writes itself, in your own words. One day you might hand it to someone you love.",
    "Let's begin.",
  ],
  taster: [
    "You just watched me steer Alex. Now it's your turn, on your own wrist.",
    "Sleeves up. Phone where you can see it.",
    "First, just stroke your wrist. Up, then down, then lighter. Don't fix anything yet.",
    "Then do it again, and steer it. Out loud. \"Slower.\" \"Lighter.\" \"Stay there.\" It might feel silly. Say it anyway.",
    "Notice when it lands. A breath? Goosebumps? A little smile?",
    "Your wrist just showed you how.",
  ],
  steerIntro: [
    "Now do it again. This time, steer it.",
    "Say it out loud. Even if it feels silly, even if you're on your own. \"Further down.\" \"Slower.\" \"Stay there.\"",
    "Most of us were never taught to say it. We just lie there and hope.",
    "Keep steering until it lands. You'll know. A breath out. Goosebumps. A little laugh.",
    "Then tap the words you used.",
  ],
  fullStop: [
    "That's a no. Good. I really mean that.",
    "Take your hand away completely. Let it rest in your lap.",
    "Notice what happens when the touch stops... a breath out? A softening in your belly? Maybe nothing at all, and that's fine too.",
    "So many of us spent years saying yes when the body was quietly saying no. This is you building an embodied sense of your yes AND your no.",
    "A no tells us just as much as a yes. Next week it might be a maybe. Right now it's a no, and your body gets to have that.",
    "Breathe. When you're ready, we colour it in.",
  ],
  thatsToday: [
    "That's your two touches for today.",
    "Put a hand on your chest for a moment. Feel it rise and fall.",
    "Look at your map. There's colour on it that wasn't there this morning... that's YOUR body telling you something, in its own words.",
    "Don't go looking for more. Let it settle into you overnight.",
    "Come back tomorrow. I'll be here.",
  ],
};

// Her wrist practice, her words (12 Oct 2026): a 3-minute touch they can say
// yes to.
export const WRIST = [
  "Stroke up your wrist. Then down. Then lighter.",
  "Add your nails.",
  "Look down while you're stroking yourself up.",
  "Each time, one question: is that a yes? Did it increase sensation, or decrease it?",
];

// The recipe line for one area (spec R11).
export function recipeLine(areaLabel: string, preferred: "A" | "B", answer: Answer): string {
  const t = TOUCHES[preferred];
  const a = ANSWERS.find((x) => x.id === answer)!;
  return `${areaLabel}: ${t.language} (${t.title.toLowerCase()}), ${t.describe.toLowerCase()}. ${a.label}.`;
}


// ---------------------------------------------------------------------------
// THE STEER (spec section "Version 1 = THE STEER", decided 29 Oct 2026).
// Her best reels: the touch lands, she steers it in tiny words, it lands
// better, the body lets go. Each day = one place, in her order.
// Touch lines are from her Touch Menu pages (Elbow to Armpit, Energy Flow,
// Fabric Tease) and her wrist practice. Clips and voice notes are hers to film
// and record; until then the app shows a placeholder and the words.
export type Place = {
  id: string;
  label: string;
  area: string; // which part of the body map colours in
  clip: string | null; // her 20-30s steer clip with Alex
  audio: string | null;
  touch: string[];
};

export const PLACES: Place[] = [
  { id: "wrist", label: "Your wrist", area: "hands-wrists", clip: null, audio: "/touch-map/audio/wrist.m4a", // Drive "Day 1 the wrist.m4a"
    touch: ["Sleeves up. Rest your forearm somewhere comfy, palm up.", "Take the fingertips of your other hand and stroke up your wrist. Slowly. Now down. Now lighter... lighter than you think. Is that a yes?", "Add your nails. Just the tips, up the inside of your wrist. Did that increase the sensation... or decrease it?", "Now look down while you stroke yourself up. Watch your own hand. Does looking change it?", "It's harder than you'd think, isn't it... knowing what you actually like. That's okay. Just notice. We'll steer it next."] },
  { id: "inner-elbow", label: "Your inner elbow", area: "inner-arms", clip: null, audio: "/touch-map/audio/hover.m4a", // her hover recording
    touch: ["Hover your hand above the soft inner elbow. No contact. None.", "Stay there. Can you feel anything... heat, tingling, a little pressure? Maybe nothing yet. That's fine.", "Take a slow breath with your hand still hovering. Is it easy to stay this still, or is there an itch to DO something?", "Now bring your hand closer. Inch by inch. Slower than you think. Does your body want to lean in to meet it... or pull away?", "Find the point where it feels just right to land... or not at all. Then close your eyes and do it once more."] },
  { id: "elbow-armpit", label: "Elbow to armpit", area: "inner-arms", clip: null, audio: "/touch-map/audio/elbow-armpit.m4a", // Drive "Day 3 elbow to armpit.m4a"
    touch: ["Find the soft inner elbow. Rest your fingertips there, barely brushing the skin. Was there a change the moment you made contact?", "Now trace your fingertips slowly from the elbow up towards the armpit. Slowly. Slower than that.", "Does the sensation build... fade... or stay the same? Was there a moment it felt like enough? Did you want to stop, or keep going?", "Now try it with your other hand. Different? In the sensation, or in how you feel about it?", "Notice the difference between your body saying yes, and you just allowing it."] },
  { id: "heart", label: "Your heart", area: "chest-heart", clip: null, audio: "/touch-map/audio/heart.m4a", // Drive "Day 4 the heart.m4a"
    touch: ["Place your palm over your heart. Let it rest there. Still. Can you feel the warmth under your hand?", "Take a few slow breaths. Let the hand stay where it is. Does your breath sync with it... or does something resist?", "Is staying this still nourishing, or is it a challenge?", "Now imagine warmth, or light, moving from your hand into your body. You don't have to see it clearly. Just sense it.", "Does your body soften... or want more? You're not doing anything. Let the touch carry it."] },
  { id: "collarbone", label: "Your collarbone", area: "collarbone-shoulders", clip: null, audio: "/touch-map/audio/fabric.m4a", // her fabric recording
    touch: ["Grab your fabric. A silk scarf, a soft cotton top, an old t-shirt- whatever's closest.", "Drape it over your skin. Let it just lie there. Feel the weight of it. Hardly anything, right?", "Now the texture... is it cool? Smooth? Does your skin prickle, goosebumps, or does it want to shrug it off?", "Take one corner and lift it off. Slowly. SLOWER than that. Like you're peeling the sensation off your skin...", "Drape it again, just next to where it was. Does it feel different here? More alive... or more on edge?"] },
  { id: "back-of-neck", label: "The back of your neck", area: "nape", clip: null, audio: "/touch-map/audio/fabric.m4a", // her fabric recording
    touch: ["Grab your fabric. A silk scarf, a soft cotton top, an old t-shirt- whatever's closest.", "Drape it over your skin. Let it just lie there. Feel the weight of it. Hardly anything, right?", "Now the texture... is it cool? Smooth? Does your skin prickle, goosebumps, or does it want to shrug it off?", "Take one corner and lift it off. Slowly. SLOWER than that. Like you're peeling the sensation off your skin...", "Drape it again, just next to where it was. Does it feel different here? More alive... or more on edge?"] },
];

// Her own steering words, from her reels.
export const STEERS = ["Further down", "A tiny bit forward", "Slower", "Lighter", "Firmer", "Tilt", "Stay there", "More", "Too fast"];

// How it landed (spec S5).
export const LANDED = [
  { id: "sigh", label: "A sigh" },
  { id: "goosebumps", label: "Goosebumps" },
  { id: "laugh", label: "A laugh" },
  { id: "melt", label: "A melt" },
  { id: "nothing", label: "Nothing yet" },
];

export const STEER_LINES = [
  "Now do it again, and steer it.",
  "Say it out loud, even if it feels silly. Further down... slower... stay there.",
  "Keep steering until it lands.",
];

// Her neck-kiss reel (190K, 27 Oct) for the top of the free taste.
export const TASTER_CLIP: string | null = "/touch-map/taster-neck-kiss.mp4"; // her 22s neck-kiss steer reel ("22second shoulder.MP4", 29 Oct)

export function steerRecipeLine(placeLabel: string, steers: string[], answer: Answer): string {
  const a = ANSWERS.find((x) => x.id === answer)!;
  const how = steers.length ? steers.map((s, i) => (i === 0 ? s : s.toLowerCase())).join(", ") : "as it came";
  return `${placeLabel}: ${how}. ${a.short === "Yes" ? "Yes, more of that" : a.label}.`;
}

// For the app home tile (same shape the other collections use).
export const touchMap = {
  slug: TM_SLUG,
  title: "The Touch Map",
  subtitle: "Learn to steer touch until it lands. One place a day, two touches, my voice in your ear, and a map that colours itself in.",
  heroImage: "/touch-map/tile-shapeshifter.jpg",
  entries: AREAS,
};

// ---------------------------------------------------------------------------
// THE TOUCH MAP, full version (29 Oct 2026, Juliette: "build this from
// everything that we have... everything lives in the app"). Her whole Touch
// Menu (lib/content/touch-menu.ts), led by her Pleasure Language, then steer it.
export const LANGUAGES = [
  // One-liners are hers, from her Touch Map page.
  { id: "energetic", label: "Energetic", line: "Hovering, heat, nearly touching" },
  { id: "sensual", label: "Sensual", line: "Slow, lingering, whole palm" },
  { id: "sexual", label: "Sexual", line: "Direct, wanting, unmistakable" },
  { id: "kinky", label: "Kinky", line: "Firm, edged, a little power in it" },
  { id: "shapeshifter", label: "Shapeshifter", line: "Depends on the day, and that is real" },
] as const;
export type LanguageId = (typeof LANGUAGES)[number]["id"];

// Steer words. Shared ones are hers (her reels, 31 Touch Points Day 25).
// The extra line per language is a FIRST DRAFT for Juliette to confirm.
const SHARED_STEERS = ["Further down", "A tiny bit forward", "Slower", "Lighter", "Firmer", "Stay there", "More", "Too fast", "Yes, like that"];
export const STEERS_BY_LANGUAGE: Record<LanguageId, string[]> = {
  energetic: ["Closer", "Hover", ...SHARED_STEERS],
  sensual: ["Whole palm", "Linger", ...SHARED_STEERS],
  sexual: ["Say it to me", "Don't stop", ...SHARED_STEERS],
  kinky: ["Make me wait", "Not yet", "Hold me there", ...SHARED_STEERS],
  shapeshifter: ["Surprise me", "Change it", ...SHARED_STEERS],
};
export const TM_QUIZ_URL = "https://feelfullyyou.com/touch-reset-quiz";

// How each Pleasure Language looks in the app (29 Oct 2026, v3). Colours are
// ONLY her palette (no pink, no sage). Photos: Pexels, free for commercial use,
// no attribution needed (her own selfies were wrong for this, her call).
// 29 Oct, her call: sensual/sexual/kinky/shapeshifter now HER OWN photos (touch-scarf-silk, touch-lace-bw, touch-rope-feet, touch-embrace-bw); energetic = Pexels feather. Old Pexels: energetic 10638723 + 1781944, sensual 5525056 + 30224478, sexual 6559997 +
// 10074775, kinky 18788962 + 4964031, shapeshifter 14699922 + 13632062.
export const LANG_STYLE: Record<LanguageId, { color: string; ink: string; img: string; pos: string; img2?: string; pos2?: string }> = {
  energetic: { color: "#D8DFE1", ink: "#0D3535", img: "/touch-map/lang/own-energetic-bowl3.jpg", pos: "50% 50%" /* her call 29 Oct: singing bowl (feather too dark to see) */ }, // her pick 29 Oct: a feather, not fingers (Pexels 18732997 + 7057341)
  sensual: { color: "#DDC98E", ink: "#070707", img: "/touch-map/lang/own-sensual-greycloth.jpg", pos: "50% 45%" /* her pick 29 Oct: grey cloth + orange fringe */ },
  sexual: { color: "#A88538", ink: "#070707", img: "/touch-map/lang/own-sexual.jpg", pos: "50% 35%" },
  kinky: { color: "#2c7a72", ink: "#f1ece2", img: "/touch-map/lang/own-kinky-fringe.jpg", pos: "50% 45%" /* her pick 29 Oct: fringe + heel (Facetune_23-04-2023) */ },
  shapeshifter: { color: "#EEDE80", ink: "#070707", img: "/touch-map/lang/own-shapeshifter-grid7.jpg", pos: "50% 50%" /* her pick 29 Oct: all four languages in a square (feather, grey cloth, lace, fringe) */ },
};
