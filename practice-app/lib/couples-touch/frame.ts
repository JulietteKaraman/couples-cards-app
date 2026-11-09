// Juliette's frame recordings. null = not recorded yet, the app shows a marked box.
// When a recording lands, put its file path here. Nothing else changes.
// 5 Nov: her first six landed. palm uses the heart one; womb and elbow are cut too (palm-womb, palm-elbow).
export const FRAME: Record<string, { label: string; src: string | null }> = {
  when: { label: "When to do a touch date: morning, lunch or mid-afternoon, when you're both resourced", src: "/touch-map/couples/frame/when.m4a" },
  giver: { label: "To the giver: you are setting this up for your partner", src: "/touch-map/couples/frame/giver.m4a" },
  receiver: { label: "To the receiver: you just arrive", src: "/touch-map/couples/frame/receiver.m4a" },
  dyadIn: { label: "Into the warm-up Dyad", src: "/touch-map/couples/frame/dyad-in.m4a" },
  stoplight: { label: "The stoplight: green, orange, red", src: "/touch-map/couples/frame/stoplight.m4a" },
  join: { label: "A moving-on line", src: "/touch-map/couples/frame/move-let-go.m4a" },
  place: { label: "Move to the next place", src: "/touch-map/couples/frame/move-next-place.m4a" },
  space: { label: "Setting up your space: a minute to the giver", src: null },
  leave: { label: "To the receiver: hand over the phone and go. Your only job is to receive and notice what comes up", src: null },
  why: { label: "Why it's built this way: one small touch date at a time, never the whole menu", src: "/touch-map/couples/frame/why.m4a" },
  bike: { label: "Riding a bike: today is three minutes, and it grows each time", src: "/touch-map/couples/frame/bike.m4a" },
  palm: { label: "A grounding palm", src: "/touch-map/couples/frame/palm-heart.m4a" },
  ask_blindfold: { label: "Asking first: blindfold", src: "/touch-map/couples/frame/ask-blindfold.m4a" },
  ask_restraint: { label: "Asking first: tying", src: "/touch-map/couples/frame/ask-restraint.m4a" },
  ask_food: { label: "Asking first: food", src: "/touch-map/couples/frame/ask-food.m4a" },
  ask_undress: { label: "Asking first: undressing", src: "/touch-map/couples/frame/ask-undress.m4a" },
  "ask_direct-genital": { label: "Asking first: genitals", src: "/touch-map/couples/frame/ask-direct-genital.m4a" },
  ask_impact: { label: "Asking first: slaps", src: "/touch-map/couples/frame/ask-impact.m4a" },
  closing: { label: "Into the Integration Dyad: normally 15 minutes in total, so this is a taster", src: "/touch-map/couples/frame/closing.m4a" },
  grounding: { label: "Grounding", src: "/touch-map/couples/frame/grounding.m4a" },
};

// Her closing question for every sitting (canon, 24 Oct).
// Her moving-on and palm lines (5 Nov). Between languages the app takes turns through JOINS,
// after a hover through PALMS. The others are kept for later use.
const F = (n: string) => `/touch-map/couples/frame/${n}.m4a`;
export const JOINS = ["move-let-go", "move-breathe", "move-next-place"].map(F);
export const PALMS = ["palm-heart", "palm-womb", "palm-elbow"].map(F);
export const MORE_LINES = ["move-stay", "move-more-heat", "move-slow-down", "move-check-in", "move-stillness"].map(F);

export const WARM_UP_PROMPT = "Tell me what you love about me.";
export const INTEGRATION_PROMPT = "Tell me what landed for you today as we did this.";
export const DYAD_SECONDS = 300;

export const NOS = [
  { id: "blindfold", label: "Blindfold" }, { id: "restraint", label: "Tying" }, { id: "impact", label: "Slaps" },
  { id: "food", label: "Food" }, { id: "undress", label: "Undressing" }, { id: "direct-genital", label: "Genitals" },
];
export const HAVE = [
  { id: "scarf", label: "A scarf or soft fabric" }, { id: "temp", label: "A spoon or ice" },
  { id: "blindfold", label: "A blindfold" }, { id: "food", label: "Fruit or food" }, { id: "scent", label: "Oil or something scented" },
  { id: "mirror", label: "A mirror" },
  { id: "feather", label: "A feather" }, { id: "sponge", label: "A sponge and warm water" },
  { id: "scratchy-sponge", label: "A scratchy sponge" }, { id: "rope", label: "Rope" },
];

// Recordings made for the couples map live in /touch-map/couples; the Touch Menu ones in /touch-map/menu.
const COUPLES = /^(tug-of-silk|tool-|neck-|wrist-|spine-|lower-back-|thighs-|feet-)/;
export const audioFor = (slug: string) =>
  COUPLES.test(slug) ? `/touch-map/couples/${slug}.m4a` : `/touch-map/menu/${slug}.m4a`;
