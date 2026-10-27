// Between Touches, the FREE guide, cut down 27 Oct 2026 (Juliette: "we need
// to cut LOADS out"). The full 13-part guide is kept word for word in
// between-touches-parked.ts. Out for good: Touch Base (has its own page) and
// the Tea Adjustment Exercise (retreat only, never free).
//
// Rules from her, same day:
// - It is for BOTH men and women. The flip cards go both ways: said, heard,
//   meant, what could be better.
// - Her voice notes BT1 (welcome, on the hub) and BT2 (part 4) are never
//   repeated on the page. The text around them goes deeper or stays out.
// - One prompt, not four, plus a link to her free cards.
// - The one paid door is Trust & Repair (£15), at the end.
// - Every word below is hers (from the guide, her approved lunch story, her
//   recorded scripts) except short labels, which are marked // MINE.
//
// Photos: real ones only, none used on another page (27 Oct check).

import { PracticeCollection } from "./ten-touch-rituals";

export const betweenTouches: PracticeCollection = {
  slug: "between-touches",
  title: "Between Touches",
  subtitle: "A guide to decoding unspoken needs, in life, in love, and in how we're being touched by life.",
  byline: "By Juliette Karaman, feelfullyyou.com",
  heroImage: "/between-touches/real/hero-night.jpg",
  theme: "dark",
  unlockMode: "free-browse",
  entries: [
    // ---------------------------------------------------------------- 1
    {
      slug: "what-happens-between-touches",
      order: 0,
      title: "What Happens Between Touches",
      eyebrow: "Where love can be lost, or found again",
      kind: "essay",
      image: "/between-touches/real/p1.jpg",
      imageAlt: "Juliette laughing on her sofa",
      imageSide: "left",
      body: [
        { kind: "p", text: "Connection isn't built in the big moments.", emphasis: "bold" },
        { kind: "p", text: "It's shaped in the spaces between touches, in how we reach, respond, repair, and return.", emphasis: "accent" },
        {
          kind: "p",
          text: "Most of us were never taught to listen through the body. We reach from habit, speak from protection, then wonder why the other person doesn't feel us.",
        },
        {
          kind: "p",
          text: "Mistouch is when your words or actions carry a hidden charge the other person's system picks up before their mind can explain it.",
        },
        { kind: "p", text: "It can be repaired instantly, with awareness and structure.", emphasis: "accent" },
        { kind: "p", text: "Between Touches is where you learn to meet each other through presence, rather than performance." },
        { kind: "quote", text: "When you reach from safety, your touch becomes truth." },
      ],
    },
    // ---------------------------------------------------------------- 2
    // CUT TO A TASTER 27 Oct (Juliette: "we take some of this from the freebie
    // off"). Full 5-page version: between-touches-5page-27oct.ts. The rest of
    // the misunderstandings go into 31 Touch Points, one a week.
    {
      slug: "what-we-say-what-we-mean",
      order: 1,
      title: "What She Says. What He Says.",
      eyebrow: "What's said. What's felt. What almost lands.",
      kind: "ritual",
      image: "/between-touches/real/p2-birchwood.jpg",
      imageAlt: "Juliette laughing in the sun, Alex's hand on her shoulder",
      imageSide: "right",
      body: [
        { kind: "p", text: "This morning, my partner Alex said: \u201cI'm coming home at lunchtime. Simon is coming too.\u201d" },
        { kind: "p", text: "Simple. Neutral. Just\u2026 information." },
        { kind: "p", text: "But here's what happened in my body:", emphasis: "bold" },
        { kind: "translateCards", prompt: "Tap the card.", cards: [{"label": "He Says", "says": "I'm coming home at lunchtime. Simon is coming too.", "layers": [{"label": "She Hears", "text": "I am coming home for lunch. There better be something ready. Feed us. Make it beautiful. Love us through food."}, {"label": "What She Does", "text": "Wakes up early. Cooks naked. Boils eggs, roasts chicken, fries bacon. Builds a layered salad that's basically a love letter. Leaves it on the table, even though she won't be home to eat it."}]}] },
        { kind: "p", text: "Did he ask for that? NO\u2026", emphasis: "bold" },
        { kind: "p", text: "But my love language is acts of service. Food is one of the ways I love, and sometimes I offer more than was asked\u2026 because it's easier than asking to receive." },
        { kind: "p", text: "We hear what wasn't said. We offer what wasn't asked for, and we hope they notice.", emphasis: "accent" },
        { kind: "p", text: "It's not just lunch.", emphasis: "bold" },
        { kind: "translateCards", prompt: "What he says. What she hears. Tap each one.", cards: [{"label": "He Says", "says": "You look nice.", "layers": [{"label": "She Hears", "text": "That's it? After all this effort? I wanted to feel seen."}]}, {"label": "He Says", "says": "Do I need to dress up?", "layers": [{"label": "She Hears", "text": "Can you not see the effort I've made? Yes, you in a tux is delicious. Make the effort."}]}] },
        { kind: "p", text: "These aren't just communication gaps. They're Touch Gaps.", emphasis: "bold" },
        { kind: "translateCards", prompt: "What she says. What you hear. What she actually means.", cards: [{"label": "She Says", "says": "You never hold me anymore.", "layers": [{"label": "What he hears", "text": "She's criticising me again."}, {"label": "What she actually means", "text": "I miss feeling chosen."}]}] },
        { kind: "quote", text: "The body hears tone before it hears words." },
        { kind: "audio", src: "/between-touches/voice/BT2.m4a", label: "When touch misses \u00b7 1 min" },
        { kind: "p", text: "What to do instead? One misunderstanding a week, inside 31 Touch Points.", emphasis: "bold" }, // MINE
      ],
    },
    // ---------------------------------------------------------------- 3
    // Dyad TASTER back in 27 Oct (Juliette: "put the dyad taster back in"),
    // because her BT1 welcome promises "one simple way to talk where nobody
    // has to defend themselves". Her guide words, her Dyad voice note, one
    // FREE taster card, the timer. The guide ends on the two doors.
    {
      slug: "the-structured-conversation",
      order: 2,
      title: "The Structured Conversation",
      eyebrow: "One prompt. Fifteen minutes.",
      kind: "closing",
      image: "/between-touches/real/p3-lateoct.jpg",
      imageAlt: "Juliette and Alex holding each other outside their home",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most conversations between people who love each other are not really conversations." },
        { kind: "p", text: "They are two people waiting to defend themselves. One speaks. The other is already explaining, fixing, or bracing for impact." },
        { kind: "p", text: "Nothing lands.", emphasis: "bold" },
        { kind: "p", text: "Both walk away a little more alone.", emphasis: "accent" },
        { kind: "audio", src: "/between-touches/voice/dyad-explained.m4a", label: "I'll explain the Dyad \u00b7 1 min" },
        { kind: "promptCard", deck: "Couples", prompt: "Tell me how our relationship has changed you." },
        { kind: "timer", minutes: [15], label: "Your fifteen minutes" },
        { kind: "quote", text: "Three responses. Fifteen minutes. One prompt. That is all it takes for two people to find each other again." },
        { kind: "link", text: "Want another prompt? Try my free cards \u2192", href: "https://feelfullyyou.com/cards-free-taster" },
        {
          kind: "nextCard",
          image: "/31-touch-points/hero.jpg",
          title: "31 Touch Points",
          line: "A whole month of small, playful touch, one a day, in the app.",
          href: "https://feelfullyyou.com/31-touch-points",
          cta: "Have a look \u2192",
        },
        {
          kind: "nextCard",
          image: "/offers/31-days-closer-cover.jpg",
          title: "31 Days Closer",
          line: "Thirty-one days. One prompt a morning. Fifteen minutes.",
          href: "https://feelfullyyou.com/31-days-closer",
          cta: "Have a look \u2192",
        },
      ],
    },
  ],
};
