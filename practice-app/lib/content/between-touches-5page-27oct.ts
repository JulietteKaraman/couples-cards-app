// PARKED 27 Oct 2026: the 5-page Between Touches exactly as built that day,
// before Juliette cut the freebie to a taster ("we take some of this from the
// freebie off"). Source for 31 Touch Points weekly cards + Communication
// Reboot Kit. Not imported anywhere.
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

export const betweenTouches5Page: PracticeCollection = {
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
    // Rebuilt 27 Oct from HER Google Doc "Between Touches" (tabs "When Love
    // Becomes a Lunch Salad", "And It's Not Just Lunch", "For both"). Her
    // examples, her words. Thomas is SIMON (her call). "Touch Base" removed
    // from one Try Instead (Touch Base is out of this guide).
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
        { kind: "translateCards", prompt: "What he says. What she hears. Tap each one.", cards: [{"label": "He Says", "says": "I'll be home around 8.", "layers": [{"label": "She Hears", "text": "Right. So don't wait. Don't expect connection. Stay self-contained."}]}, {"label": "He Says", "says": "Want me to grab anything on the way?", "layers": [{"label": "She Hears", "text": "Yes. That's why we have a shared shopping list. This isn't new."}]}, {"label": "He Says", "says": "You look nice.", "layers": [{"label": "She Hears", "text": "That's it? After all this effort? I wanted to feel seen."}]}, {"label": "He Says", "says": "Do I need to dress up?", "layers": [{"label": "She Hears", "text": "Can you not see the effort I've made? Yes, you in a tux is delicious. Make the effort."}]}, {"label": "He Says", "says": "I didn't mean it like that.", "layers": [{"label": "She Hears", "text": "Maybe not. But your energy did. Next time? I'll just keep it to myself."}]}] },
        { kind: "p", text: "These aren't just communication gaps. They're Touch Gaps.", emphasis: "bold" },
        { kind: "translateCards", prompt: "What she says. What you hear. What she actually means.", cards: [{"label": "She Says", "says": "Remind me to get the wash out and hang your shirts.", "layers": [{"label": "What she actually means", "text": "Please take care of the laundry and hang your shirts while I'm out."}]}, {"label": "She Says", "says": "You never hold me anymore.", "layers": [{"label": "What he hears", "text": "She's criticising me again."}, {"label": "What she actually means", "text": "I miss feeling chosen."}]}, {"label": "She Says", "says": "I'm fine.", "layers": [{"label": "What he hears", "text": "She's fine. Move on."}, {"label": "What she actually means", "text": "I don't feel safe enough to show you I'm hurt."}]}, {"label": "She Says", "says": "You don't listen.", "layers": [{"label": "What he hears", "text": "I'm failing again."}, {"label": "What she actually means", "text": "I feel invisible."}]}, {"label": "She Says", "says": "You work all the time.", "layers": [{"label": "What he hears", "text": "She wants to control me."}, {"label": "What she actually means", "text": "I feel alone and left out."}]}, {"label": "She Says", "says": "Nothing's wrong.", "layers": [{"label": "What he hears", "text": "Everything's okay."}, {"label": "What she actually means", "text": "Something's wrong, but I don't trust it's safe to say."}]}, {"label": "She Says", "says": "You always want sex.", "layers": [{"label": "What he hears", "text": "She's rejecting me."}, {"label": "What she actually means", "text": "I want closeness, but I need slowness first."}]}] },
        { kind: "quote", text: "The body hears tone before it hears words." },
      ],
    },
    // ---------------------------------------------------------------- 3
    // NEW 27 Oct (Juliette: "the next page can be what to do instead ... and
    // obviously it should lead to touch points and 31 days closer").
    // For him = her doc's "Try Instead" column. For her = her doc's "How to
    // Ask More Clearly (For Her)" table. Her words.
    {
      slug: "what-to-do-instead",
      order: 2,
      title: "What To Do Instead",
      kind: "ritual",
      image: "/between-touches/real/p3-lateoct.jpg",
      imageAlt: "Juliette and Alex holding each other outside their home",
      imageFocus: "50% 30%",
      imageSide: "left",
      body: [
        { kind: "quote", text: "For him" },
        { kind: "translateCards", prompt: "Tap each one.", cards: [{"label": "When she says", "says": "You never hold me anymore.", "layers": [{"label": "Try instead", "text": "Touch her arm, make eye contact, and say: “Tell me how you'd like to be held tonight.”"}]}, {"label": "When she says", "says": "I'm fine.", "layers": [{"label": "Try instead", "text": "Pause. Step closer. Ask softly: “If ‘fine’ wasn't a word, what would you say?”"}]}, {"label": "When she says", "says": "You don't listen.", "layers": [{"label": "Try instead", "text": "Turn towards her, slow your breath, and say: “Tell me what you need me to hear right now.”"}]}, {"label": "When she says", "says": "You work all the time.", "layers": [{"label": "Try instead", "text": "Place a hand on your heart. “I know I disappear into work. Tell me what presence would feel like this week.”"}]}, {"label": "When she says", "says": "Nothing's wrong.", "layers": [{"label": "Try instead", "text": "Sit nearby without forcing words. Let silence soften. Then ask: “Tell me what feels off.”"}]}, {"label": "When she says", "says": "You always want sex.", "layers": [{"label": "Try instead", "text": "Rest your palm on her belly. Breathe together. Ask: “Tell me what kind of touch would feel connecting right now.”"}]}] },
        { kind: "quote", text: "For her" },
        { kind: "p", text: "Once your body has remembered what it feels like to ask\u2026 here's how that might begin to sound:" },
        { kind: "translateCards", prompt: "Tap each one.", cards: [{"label": "What you say", "says": "Whatever you want.", "layers": [{"label": "How to say it more clearly", "text": "“Here's what I'd love. Are you open to that?”"}]}, {"label": "What you say", "says": "Maybe later.", "layers": [{"label": "How to say it more clearly", "text": "“Right now isn't a yes, but I'd love to check in again after dinner.”"}]}, {"label": "What you say", "says": "It's okay.", "layers": [{"label": "How to say it more clearly", "text": "“That didn't feel great, can we try this instead?”"}]}, {"label": "What you say", "says": "It's not a big deal.", "layers": [{"label": "How to say it more clearly", "text": "“It actually matters to me. Can I tell you why?”"}]}, {"label": "What you say", "says": "I don't know…", "layers": [{"label": "How to say it more clearly", "text": "“I'm still feeling into it. Will you stay close while I do?”"}]}] },
        { kind: "p", text: "You're not too much for wanting clarity. You're simply ready to be met, not managed.", emphasis: "accent" },
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
    // ---------------------------------------------------------------- 4
    {
      slug: "the-structured-conversation",
      order: 3,
      title: "The Structured Conversation",
      eyebrow: "One prompt. Fifteen minutes.", // MINE
      kind: "ritual",
      image: "/between-touches/real/p3.jpg",
      imageAlt: "Juliette's hands holding her Intimacy and Communication Cards",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most conversations between people who love each other are not really conversations." },
        {
          kind: "p",
          text: "They are two people waiting to defend themselves. One speaks. The other is already explaining, fixing, or bracing for impact.",
        },
        { kind: "p", text: "Nothing lands.", emphasis: "bold" },
        { kind: "p", text: "Both walk away a little more alone.", emphasis: "accent" },
        { kind: "audio", src: "/between-touches/voice/dyad-explained.m4a", label: "I'll explain the Dyad · 1 min" },
        {
          kind: "step",
          label: "How It Works",
          lines: [
            { text: "Set a timer for 15 minutes. The structure is the safety." },
            { text: "Partner A reads the prompt." },
            { text: "Partner B answers honestly: fully, one clear thought at a time. No performing. No tidying it up to be easy to hear." },
            { text: "Partner A uses only three responses: thank you, clarify that, summarise that. Nothing else is allowed." },
            { text: "Switch and repeat: same prompt, the other way round. Keep going for the full 15 minutes." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "The first time you answer, you give the easy answer, the safe one, the one you've said before." },
            { text: "The third time, something shifts. The fifth time, you reach something true." },
            {
              text: "By the tenth, you are somewhere neither of you has ever been, because you finally trusted you would only ever be met with thank you.",
              emphasis: "bold",
            },
          ],
        },
        // The real card from the cards app (her ask, 27 Oct). One of the FOUR
        // free taster cards, so the guide gives away nothing paid.
        { kind: "promptCard", deck: "Couples", prompt: "Tell me how our relationship has changed you." },
        { kind: "timer", minutes: [15], label: "Your fifteen minutes" },
        { kind: "quote", text: "Three responses. Fifteen minutes. One prompt. That is all it takes for two people to find each other again." },
        { kind: "link", text: "Want another prompt? Try my free cards →", href: "https://feelfullyyou.com/cards-free-taster" }, // MINE
      ],
    },
    // ---------------------------------------------------------------- 5
    {
      slug: "when-touch-misses",
      order: 4,
      title: "When Touch Misses, and How to Return",
      eyebrow: "Repair isn't about being perfect",
      kind: "closing",
      image: "/between-touches/real/p4.jpg",
      imageAlt: "Juliette smiling in her kitchen",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/between-touches/voice/BT2.m4a", label: "When touch misses · 1 min" },
        { kind: "p", text: "It's about staying present long enough for love to find its way back in.", emphasis: "bold" },
        {
          kind: "p",
          text: "You'll recognise mistouch by a pause before they respond, a sudden shift in breath or posture, eyes flicking away, the energy of closing.",
        },
        {
          kind: "table",
          headers: ["When You Notice", "What to Say or Do"],
          rows: [
            ["They go quiet after you speak", "“Tell me how that landed.” Then listen fully."],
            ["They stiffen when you reach out", "Step back, make eye contact: “Would you like touch right now, or space?”"],
            ["You realise you spoke sharply", "Own it: “That came out tense. Let me try again.” Then restate calmly."],
            ["You feel defensive", "Name it: “I notice my guard's up. Give me a breath to soften.”"],
          ],
        },
        { kind: "p", text: "Then close with one small Touch-In: a palm on the chest, a single breath together, a soft thank you." },
        { kind: "p", text: "That's when the system records a new pattern.", emphasis: "bold" },
        {
          kind: "nextCard",
          image: "/between-touches/real/next-trust-repair.jpg",
          title: "Trust & Repair",
          line: "These fifty prompts give you somewhere careful to start.", // her recorded TR-1 line
          href: "https://buy.stripe.com/00wdR849R5OUbhX6eN0co0P",
          cta: "Get the cards →", // MINE
        },
      ],
    },
  ],
};
