// Source of truth: Juliette's "Between Touches" guide (14-page PDF export,
// pages 2-14 ported here; page 1 is the cover, used as heroImage only).
// Transcribed following the same never-thin, never-skip standard as
// 10 Touch Rituals and The Unspoken Distance.
//
// Two fixes applied during transcription, per Juliette 1 Aug 2026:
// 1. The source PDF's text extraction mangled curly-quote punctuation into
//    stray "<" and "=" characters throughout (e.g. an opening curly quote
//    extracted as "<", a closing one as "="). Every instance is cleaned up
//    here to plain, unquoted text, matching how this guide's own
//    translation tables are styled elsewhere.
// 2. The closing "Your Next Step" page in the source PDF pitched two dead
//    offers: "Daily Touch Points" (deleted as a product 1 Aug 2026) and
//    "Touchpoint, for the men" (retired 1 Aug 2026, redirects to One
//    Touch). Neither appears anywhere in this file, in any form, with any
//    price. That closing page is replaced with two link blocks: The
//    Unspoken Distance and the free Touch Reset Quiz. No price (£ symbol
//    or number) appears anywhere in this file — general rule for all
//    guide content in this app, so nothing needs editing when prices move.
//
// No per-entry interior photography exists for this guide, only the cover
// (heroImage). Per the-unspoken-distance's own convention, a missing image
// is left unset rather than reusing another entry's photo — honest, not a
// mistake.

import { ContentBlock } from "./blocks";
import { PracticeEntry, PracticeCollection } from "./ten-touch-rituals";

export const betweenTouches: PracticeCollection = {
  slug: "between-touches",
  title: "Between Touches",
  subtitle:
    "A guide to decoding unspoken needs, in life, in love, and in how we're being touched by life.",
  byline: "By Juliette Karaman, feelfullyyou.com",
  heroImage: "/between-touches/hero.jpg",
  unlockMode: "free-browse",
  // theme left unset — this guide uses the app's normal light/cream
  // palette, matching 10 Touch Rituals, not The Unspoken Distance's dark
  // theme.
  entries: [
    // ---------------------------------------------------------------- 1
    {
      slug: "what-happens-between-touches",
      order: 0,
      title: "What Happens Between Touches",
      eyebrow: "Where love can be lost, or found again",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "Connection isn't built in the big moments.", emphasis: "bold" },
        {
          kind: "p",
          text: "It's shaped in the spaces between touches, in how we reach, respond, repair, and return.",
          emphasis: "accent",
        },
        { kind: "p", text: "You can love someone deeply and still miss them daily. You can touch often and still not land." },
        {
          kind: "p",
          text: "Why? Because most of us were never taught to listen through the body. We reach from habit, speak from protection, then wonder why the other person doesn't feel us.",
        },
        {
          kind: "p",
          text: "Sometimes the most loving gesture misses completely. You say something kind, and it lands as criticism. You reach for closeness, and their body stiffens.",
        },
        {
          kind: "p",
          text: "That's mistouch: when your words or actions carry a hidden charge the other person's system picks up before their mind can explain it.",
        },
        { kind: "p", text: "It isn't wrong. It's human.", emphasis: "bold" },
        { kind: "p", text: "It can be repaired instantly, with awareness and structure.", emphasis: "accent" },
        { kind: "quote", text: "Where It Begins to Change" },
        {
          kind: "p",
          text: "Between Touches is where you learn to meet each other through presence, rather than performance.",
        },
        { kind: "quote", text: "When you reach from safety, your touch becomes truth." },
      ],
    },
    // ---------------------------------------------------------------- 2
    {
      slug: "daily-life",
      order: 1,
      title: "Daily Life",
      eyebrow: "What's said. What's felt. What almost lands.",
      kind: "essay",
      imageSide: "right",
      body: [
        { kind: "p", text: "Decoding unspoken needs starts here, in the ordinary, everyday exchanges." },
        {
          kind: "table",
          headers: ["What She Says", "What She Really Means"],
          rows: [
            [
              "Remind me to get the wash out and hang your shirts.",
              "Please take care of the laundry and hang your shirts while I'm out.",
            ],
            ["We should go away sometime.", "I'm craving time just for us. Please plan something."],
            ["It's okay.", "It's not. But I don't want to make a fuss."],
            ["Don't worry about it.", "It actually matters, but I don't feel safe bringing it up."],
          ],
        },
        {
          kind: "p",
          text: "Touch doesn't land when signals are crossed, when the body isn't ready, the words don't match the need, or the silence holds more than it says.",
        },
        {
          kind: "p",
          text: "What if this page wasn't a code to crack? What if it was simply a map of the space between touches, a way to feel what's been reaching instead of rushing to fix or decode it.",
        },
        { kind: "p", text: "Some things don't need resolution.", emphasis: "bold" },
        { kind: "p", text: "They need translation that lands.", emphasis: "accent" },
      ],
    },
    // ---------------------------------------------------------------- 3
    {
      slug: "touch-base-anchor",
      order: 2,
      title: "Touch Base®, the 2-Minute Anchor",
      eyebrow: "Before connection can land",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "The body has to trust it's safe before connection can land.", emphasis: "bold" },
        {
          kind: "p",
          text: "This is the tool I teach every single client. It's discreet enough that no one around you will notice, but your body will.",
        },
        {
          kind: "step",
          label: "The Practice",
          lines: [
            { text: "Press thumb to forefinger: begin with this simple, grounding gesture." },
            { text: "Move slowly, like honey: feel every ridge of your skin. Slower than you think slow is. Then slower still." },
            { text: "Notice and release: notice where you want to speed up, notice the thoughts that rise, and let them pass." },
            { text: "Remind yourself: there is no tiger in the room. I am safe." },
            {
              text: "Two minutes, twice a day: morning and evening. Before you begin, rate how you feel one to ten. After two minutes, rate again.",
            },
          ],
        },
        {
          kind: "why",
          lines: [
            {
              text: "Paired with slowness, breath, and attention, this gesture downregulates the stress response.",
            },
            {
              text: "You're gently teaching your system to associate this moment with safety.",
              emphasis: "accent",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            { number: "31", label: "Days", caption: "Becomes automatic." },
            { number: "90", label: "Days", caption: "Muscle memory. You'll reach for it instinctively." },
          ],
        },
        { kind: "quote", text: "The body follows the focus. Give it something worth finding." },
      ],
    },
    // ---------------------------------------------------------------- 4
    {
      slug: "touch-and-intimacy",
      order: 3,
      title: "Touch and Intimacy",
      eyebrow: "What's said. What's needed. What isn't yet felt.",
      kind: "essay",
      imageSide: "right",
      body: [
        {
          kind: "table",
          headers: ["What She Says", "What She Really Means"],
          rows: [
            ["That's fine.", "It's not quite it, but I don't want to offend you."],
            ["Can we slow down?", "I'm on the edge of shutting down. I need presence, not pressure."],
            ["I don't know what I want.", "I haven't had space to feel what I want yet."],
            ["Do you like this?", "I need reassurance. I want to feel desired and safe."],
            ["I'm tired.", "I want closeness, but not sexual expectation."],
          ],
        },
        { kind: "p", text: "Sometimes what's spoken is a placeholder for what the body isn't ready to say." },
        { kind: "p", text: "Touch doesn't land when the state is braced, or the signal is unclear." },
        {
          kind: "p",
          text: "When presence enters, even without words, Touch That Lands™ becomes possible.",
          emphasis: "accent",
        },
      ],
    },
    // ---------------------------------------------------------------- 5
    {
      slug: "what-she-says-what-she-means",
      order: 4,
      title: "What She Says, What She Really Means",
      eyebrow: "What's said. What's felt. What almost lands.",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "We've all done it." },
        { kind: "p", text: "Hinted. Softened. Adjusted ourselves. Hoped the other would just get it." },
        {
          kind: "p",
          text: "We've all been on the receiving end too, left guessing, second-guessing, quietly wondering what went unsaid.",
        },
        {
          kind: "p",
          text: "This isn't about mind-reading. It's about recognising the space between touches, where the words said and the need underneath don't quite meet.",
        },
        { kind: "p", text: "Practise these, not just read them.", emphasis: "bold" },
        {
          kind: "table",
          headers: ["She Says", "What She Really Means"],
          rows: [
            ["It's okay.", "It's not, but I don't want to make a fuss."],
            ["We should go away sometime.", "I'm craving time just for us. Please plan something."],
            ["I'm fine.", "I'm not. But I don't feel safe enough to say it clearly."],
            ["Let's not talk about it right now.", "I need space. Not distance."],
            ["Maybe we can have sex later?", "I want connection, but I need to feel emotionally attuned first."],
            ["I'm tired.", "I want closeness, but not sexual expectation."],
            ["We should do something soon.", "Please make a plan. I want to feel chosen."],
            ["It's not a big deal.", "It is. But I've learned to dim."],
            ["We need to feed the dog before we go.", "Can you feed the dog while I finish getting ready?"],
            ["Remind me to hang the shirts.", "It would feel amazing if you just took care of it."],
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- 6
    {
      slug: "the-structured-conversation",
      order: 5,
      title: "The Structured Conversation",
      eyebrow: "The method behind my Intimacy & Communication Cards",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most conversations between people who love each other are not really conversations." },
        {
          kind: "p",
          text: "They are two people waiting to defend themselves. One speaks. The other is already explaining, fixing, or bracing for impact.",
        },
        { kind: "p", text: "Nothing lands.", emphasis: "bold" },
        { kind: "p", text: "Both walk away a little more alone.", emphasis: "accent" },
        {
          kind: "step",
          label: "How It Works",
          lines: [
            { text: "Choose one prompt: just one. Set a timer for 15 minutes. The structure is the safety." },
            { text: "Partner A reads the prompt." },
            {
              text: "Partner B answers honestly: fully, one clear thought at a time. No performing. No tidying it up to be easy to hear.",
            },
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
            {
              text: "The repetition isn't boring. It is what drops you both out of your heads and into your bodies.",
              emphasis: "accent",
            },
          ],
        },
        {
          kind: "promptGroup",
          category: "Prompts to Begin With",
          color: "gold",
          prompts: [
            "Tell me one thing you want me to understand about you.",
            "Tell me something you've been craving but haven't asked for.",
            "Tell me what helps you feel close to me.",
            "Tell me one thing you'd love us to do that feels like fun, but you've never dared suggest.",
          ],
        },
        {
          kind: "quote",
          text: "Three responses. Fifteen minutes. One prompt. That is all it takes for two people to find each other again.",
        },
      ],
    },
    // ---------------------------------------------------------------- 7
    {
      slug: "when-the-words-dont-match",
      order: 6,
      title: "When the Words Don't Match the Need",
      eyebrow: "The body hears tone before it hears words",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "Here's how to meet what's underneath, with a small, specific move instead of a defence." },
        {
          kind: "table",
          headers: ["She Says", "What She Feels", "He Hears", "Try Instead"],
          rows: [
            [
              "You never hold me anymore.",
              "I miss feeling chosen.",
              "She's criticising me again.",
              "Touch her arm, make eye contact: “Tell me how you'd like to be held tonight.”",
            ],
            [
              "I'm fine.",
              "I don't feel safe enough to show you I'm hurt.",
              "She's fine. Move on.",
              "Pause. Step closer. Ask softly: “Tell me what's under fine.”",
            ],
            [
              "You always want sex.",
              "I want closeness, but I need slowness first.",
              "She's rejecting me.",
              "Rest your palm on her shoulder or chest. Breathe together: “Tell me what kind of touch would feel connecting right now.”",
            ],
            [
              "Nothing's wrong.",
              "Something's wrong, but I don't trust it's safe to say.",
              "Everything's okay.",
              "Sit nearby without forcing words. Let silence soften. Then: “Tell me what feels off.”",
            ],
            [
              "You work all the time.",
              "I feel alone and left out.",
              "She wants to control me.",
              "Place a hand on your heart: “I know I disappear into work. Tell me what presence would feel like this week.”",
            ],
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Notice the pattern, not a fix, not a defence.", emphasis: "bold" },
            {
              text: "A turn towards, a breath, and one honest Communication and Intimacy Card, a “Tell me” prompt.",
            },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- 8
    {
      slug: "when-touch-misses",
      order: 7,
      title: "When Touch Misses, and How to Return",
      eyebrow: "Repair isn't about being perfect",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "It's about staying present long enough for love to find its way back in.",
          emphasis: "bold",
        },
        {
          kind: "p",
          text: "Even with love and safety, there are moments your touch doesn't land. You reach out, and they freeze. You say something kind, and they turn away.",
        },
        {
          kind: "p",
          text: "This isn't rejection. It's residue. The body remembers tension faster than tenderness.",
          emphasis: "bold",
        },
        {
          kind: "p",
          text: "You'll recognise mistouch by a pause before they respond, a sudden shift in breath or posture, eyes flicking away, the energy of closing.",
        },
        {
          kind: "notice",
          lines: [
            { text: "Don't explain. Don't chase. Don't withdraw." },
            { text: "Simply Touch Base® again: thumb and forefinger, one breath." },
            { text: "Then gently ask: “Tell me, did this land for you how I meant it?”" },
          ],
        },
        {
          kind: "table",
          headers: ["When You Notice", "What to Say or Do"],
          rows: [
            ["They go quiet after you speak", "“Tell me how that landed.” Then listen fully."],
            [
              "They stiffen when you reach out",
              "Step back, make eye contact: “Would you like touch right now, or space?”",
            ],
            [
              "You realise you spoke sharply",
              "Own it: “That came out tense. Let me try again.” Then restate calmly.",
            ],
            ["You feel defensive", "Name it: “I notice my guard's up. Give me a breath to soften.”"],
          ],
        },
        {
          kind: "p",
          text: "Then close with one small Touch-In: a palm on the chest, a single breath together, a soft thank you.",
        },
        { kind: "p", text: "That's when the system records a new pattern.", emphasis: "bold" },
        { kind: "p", text: "We can come back from disconnection.", emphasis: "accent" },
        { kind: "quote", text: "Connection isn't lost in the rupture. It's lost when we forget to return." },
      ],
    },
    // ---------------------------------------------------------------- 9
    {
      slug: "the-tea-adjustment-exercise",
      order: 8,
      title: "The Tea Adjustment Exercise",
      eyebrow: "What a cup of tea reveals about how you ask, receive, and adjust",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "This is one of the most playful, yet profound, exercises I teach. It's at the heart of what I use in my VIP immersions, my live work, and even on national television.",
        },
        { kind: "p", text: "Because how you ask for tea is exactly how you ask for touch.", emphasis: "bold" },
        {
          kind: "step",
          label: "Say Your Ideal Cup of Tea Out Loud",
          lines: [
            {
              text: "I'd love Bengal Spice in the red mug, the one with the thin rim. Just-off-the-boil water, a splash of oat milk, one teaspoon of honey. Stir twice. Keep the spoon in. And take the bag out at two minutes, it gets too strong after that.",
            },
          ],
        },
        { kind: "p", text: "Simple? Maybe. But notice what happens in your body." },
        {
          kind: "p",
          text: "Most people giggle. Then freeze. Then minimise: oh never mind, it's not a big deal. But it is.",
        },
        {
          kind: "p",
          text: "Because this is where the mind comes in first, before the bedroom, before the moment, before you're even touched.",
        },
        {
          kind: "step",
          label: "Ask",
          lines: [
            { text: "Be specific. Say exactly what you want. Let it matter." },
            {
              text: "Most people giggle, then freeze, then minimise: oh never mind, it's not a big deal.",
            },
          ],
        },
        {
          kind: "step",
          label: "Receive",
          lines: [
            { text: "Your partner repeats back what you want exactly, then makes the tea just as you asked." },
            { text: "Receive it fully. Don't shrink." },
          ],
        },
        {
          kind: "step",
          label: "Adjust",
          lines: [
            {
              text: "The shit sandwich: thank them, name what needs changing, thank them again. Repeat until it's just right.",
            },
            { text: "This is the cringe part. We so often just accept what we are given." },
          ],
        },
      ],
    },
    // ---------------------------------------------------------------- 10
    {
      slug: "one-real-moment-of-touch",
      order: 9,
      title: "One Real Moment of Touch",
      eyebrow: "Ask your partner to touch you exactly the way you desire",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "Be specific. Let it matter.", emphasis: "bold" },
        {
          kind: "step",
          label: "The Practice",
          lines: [
            { text: "Share your instruction clearly. Let them repeat it back." },
            { text: "If it's not right, adjust them." },
            { text: "Receive the touch." },
            { text: "Was it what you wanted? Did you adjust, or did you just accept what was given?" },
            { text: "What came up in you? In them?" },
          ],
        },
        {
          kind: "p",
          text: "Tea. Touch. Truth. This is where we begin again: one true request, one real yes, one moment of being fully met.",
          emphasis: "accent",
        },
        {
          kind: "p",
          text: "Once your body has remembered what it feels like to ask, here's how that might begin to sound.",
          emphasis: "bold",
        },
        {
          kind: "table",
          headers: ["What You Say", "How to Say It More Clearly"],
          rows: [
            ["Whatever you want.", "“Here's what I'd love. Are you open to that?”"],
            [
              "Maybe later.",
              "“Right now isn't a yes, but I'd love to check in again after dinner.”",
            ],
            ["It's okay.", "“That didn't feel great, can we try this instead?”"],
            ["It's not a big deal.", "“It actually matters to me. Can I tell you why?”"],
            ["I don't know…", "“I'm still feeling into it. Will you stay close while I do?”"],
          ],
        },
        {
          kind: "p",
          text: "You're not too much for wanting clarity. You're simply ready to be met, not managed.",
          emphasis: "accent",
        },
        {
          kind: "p",
          text: "This is where real connection begins, in the way life touches you and the way you let these touches land, through words that live in your body and touch theirs without distortion, not through scripts or performance.",
        },
      ],
    },
    // ---------------------------------------------------------------- 11
    {
      slug: "what-to-practise-this-week",
      order: 10,
      title: "What to Practise This Week",
      eyebrow: "Four small things. That's all.",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "step",
          label: "This Week",
          lines: [
            {
              text: "Touch Base® daily: one Touch Base® each morning and evening, thumb to forefinger, slow, safe, present.",
            },
            { text: "One Touch-In: before or after work, a slow gaze, a light touch, a breath together." },
            {
              text: "One repair: catch one repair in real time. Don't explain. Don't chase. Turn towards, breathe, and ask.",
            },
            {
              text: "One structured prompt: try, tell me what your body wants to feel more of today. Let the answer arrive without fixing it.",
            },
          ],
        },
        { kind: "p", text: "If you practise those four things, your system will begin to trust connection again." },
        { kind: "quote", text: "The body hears tone before it hears words. Give it something worth finding." },
      ],
    },
    // ---------------------------------------------------------------- 12
    {
      slug: "your-next-step",
      order: 11,
      title: "Your Next Step",
      kind: "closing",
      imageSide: "right",
      body: [
        { kind: "p", text: "This wasn't just a guide.", emphasis: "bold" },
        { kind: "p", text: "It was your first soft yes.", emphasis: "accent" },
        {
          kind: "p",
          text: "If this guide gave you language for what's been happening between you, here's where to go next.",
        },
        { kind: "quote", text: "10 Touch Rituals" },
        { kind: "image", src: "/rituals/hero.png", alt: "10 Touch Rituals" },
        {
          kind: "p",
          text: "Ten simple touch rituals, two minutes each, for couples who love each other and want to feel it again.",
        },
        {
          kind: "link",
          text: "Explore 10 Touch Rituals →",
          href: "https://feelfullyyou.com/10-touch-rituals",
        },
        { kind: "quote", text: "The Touch Reset Quiz" },
        {
          kind: "p",
          text: "Five minutes, not a score. Meet the pattern your body runs to keep touch safe, and the one it has been quietly starving for.",
        },
        {
          kind: "link",
          text: "Take the Free Touch Reset Quiz →",
          href: "https://feelfullyyou.com/touch-reset-quiz",
        },
        { kind: "quote", text: "The Unspoken Distance" },
        {
          kind: "p",
          text: "The full paid guide, all the way into her body, her withdrawal, and what she actually needs to feel safe enough to open again.",
        },
        {
          kind: "link",
          text: "Explore The Unspoken Distance →",
          href: "https://feelfullyyou.com/the-unspoken-distance",
        },
      ],
    },
    // ---------------------------------------------------------------- 13
    {
      slug: "meet-juliette",
      order: 12,
      title: "Meet Juliette",
      eyebrow: "Intimacy and touch expert",
      kind: "closing",
      // No portrait exists in this guide's own asset folder — left unset
      // rather than borrowing The Unspoken Distance's photo.
      imageSide: "left",
      body: [
        { kind: "p", text: "Intimacy and touch expert." },
        { kind: "p", text: "Touch Base® · The Touch Languages™ · Rapid Release Rewire and Restore®" },
        {
          kind: "p",
          text: "I create experiences, for the moment you understand exactly what's happening in your body, and still something tightens or fades the second closeness begins.",
        },
        {
          kind: "p",
          text: "For over 27 years I've worked with how people feel, relate, and connect, across mind, nervous system, body, and relationship.",
        },
        { kind: "p", text: "It began with children on the autism spectrum, helping them trust sensation before they had words for it." },
        {
          kind: "p",
          text: "For the last fifteen years, I've worked with thousands of individuals and couples who love each other, live full lives, and still lose connection the moment touch begins.",
        },
        { kind: "p", text: "I work extensively with trauma, from professional training and from lived experience." },
        {
          kind: "p",
          text: "Here's what most relationship advice misses: trauma, so often sexual trauma, doesn't stay in the past. It shows up decades later, as touch that triggers protection instead of landing.",
        },
        { kind: "p", text: "Insight alone doesn't change intimacy. Touch alone doesn't either." },
        { kind: "p", text: "Change happens through experiences the body can stay present with.", emphasis: "accent" },
        { kind: "p", text: "The couples I work with don't just understand themselves better." },
        {
          kind: "p",
          text: "They feel different. They touch differently. They stay in connection.",
          emphasis: "bold",
        },
        { kind: "p", text: "Host of The Scrumptious Woman® Podcast, top 2.5% worldwide." },
        { kind: "link", text: "feelfullyyou.com", href: "https://feelfullyyou.com" },
        {
          kind: "link",
          text: "What the Body Knows by Juliette Karaman, on Substack",
          href: "https://juliettekaraman.substack.com",
        },
        { kind: "quote", text: "Every moment of presence is a new chance to come in touch." },
      ],
    },
  ],
};
