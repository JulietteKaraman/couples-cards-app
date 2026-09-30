// Source of truth: Juliette's live Gamma deck "10 Touch Rituals"
// (g_ue6g0xx1slcn9ie), read in full and transcribed verbatim, including the
// intro pages, the "why it works" and "notice" call-outs on every ritual,
// and the closing pages. Do not paraphrase, shorten, or drop sections,
// per Juliette 31 Jul 2026, the app must carry the SAME depth as the deck.
// Never invent or alter a ritual's mechanics.
//
// Images are the real photography from the deck, downloaded into
// /public/rituals so the app doesn't depend on Gamma's CDN staying up.
//
// Video/audio: the deck itself points to real files, embedded directly.
// The Trace Ritual, Touch Base® Anchor, The Name, and The Handshake of
// Gratitude all carry real video/audio Juliette supplied. The Drive
// embeds are a known cleanup item (move onto Vimeo eventually), not a
// gap in this build.
//
// Spacing/emphasis (locked 31 Jul 2026, Juliette): step, notice, why, and
// standout paragraph blocks are never one dense run-on. Each sentence gets
// its own line, and short topic/closing statements get "bold" or "accent"
// per her examples, applied consistently across every ritual, not just the
// one she flagged each time.

//
// RESTRUCTURED 24 Aug 2026: the guide is now "The Touch Rituals" (the number
// is retired) and the entries are grouped into DAILY / WEEKLY / MONTHLY
// cadence tiers behind short divider entries, with an "Everything, at a
// glance" table up front and the book-a-call turn ("Where this stops") second
// to last. The slug, deck_type and every entitlement string are untouched.
// Every pre-existing body array is byte-for-byte what it was; only titles,
// eyebrows and order changed, plus the Dyad's listener step, where "Clarify
// that" and "Summarise that" now read as stepping stones to "Thank you"
// rather than three equal options.
//
// New entries (Date Morning, Yes Maybe No, Where this stops) take their copy
// from Juliette's approved touch-rituals.html. The prompt bank uses her real
// cards: the ten free taster cards from data/taster-cards.ts, then one or two
// per section pulled verbatim from data/decks/couples.ts and friends.ts.
//
// SECOND PASS 24 Aug 2026, on Juliette's review of the built guide:
//  1. The Dyad, Using the Prompts, The Intimacy & Communication Cards and
//     The prompts were four separate entries, with prompt material in two
//     places and the cards both early and last ("it's just really, really
//     messy"). They are now ONE entry, The Dyad, sitting in the weekly tier:
//     opening copy, how it works, how to run one, every prompt, then the
//     cards and the link. The other three entries are deleted, and every
//     prompt string appears exactly once in this file. The only copy dropped
//     in the merge is the cards entry's "Get the Cards →" link, which pointed
//     at the same URL as the "Get the full decks →" link that now closes the
//     entry. Every other sentence is byte-for-byte what it was.
//  2. "Why this is not optional" opens the guide, so the rituals read as
//     necessary rather than pleasant, and each tier divider now carries one
//     sentence on why that rhythm exists.
//  3. Date Morning now presents the real choice Juliette teaches: a touch
//     date (structured physical touch, agreed in advance, no sex in it) or
//     somewhere else entirely. The longer Touch Date arcs stay inside The
//     Beginning, as The 3-Minute Touch Reset already says.
//  4. The guide had practices but no REVIEW. The Monthly Check-In and a
//     fourth tier, Once a year, holding The Year in the Body, are new. The
//     cadence spine is now Daily / Weekly / Monthly / Once a year.
//
// THIRD PASS 24 Aug 2026, eight faults Juliette found reading the live guide:
//  1. A retired "ten rituals" survived in Why Touch Matters. Gone. The
//     remaining "ten"s all count other things (the taster cards, the two
//     lists, a 1–10 scale), never the rituals.
//  3. THE DYAD ENTRY WAS REMOVED ENTIRELY, 28 Sep 2026, Juliette's instruction:
//     "can we take the dyad out and put in another ritual?" Two reasons. It was
//     the only talking practice in a product of fourteen touch rituals, so it
//     never belonged. And it taught the whole method for GBP 7, which undercuts
//     The Three Answers at GBP 17, where the Dyad is the product. It also carried
//     "over a thousand couples", contradicting her confirmed 650.
//     Replaced by THE THINGS YOU USED TO LOVE, her own idea, given the same day:
//     write ten things you loved doing as a child, pick one you could teach, go
//     somewhere out of the ordinary on a MORNING with a picnic, and teach it to
//     each other. A kite, a bag of marbles. It competes with nothing she sells.
//     The prompt bank is down to ONE prompt from five, same reasoning: one prompt
//     is one sitting, so five was five weeks of product inside a GBP 7 item.
//     Three references to the removed entry were rewritten rather than left
//     dangling: the Approach's closing line, the prompt bank intro, and the cards
//     upsell, which now points AT the structure instead of teaching it.
//  2. The second pass over-merged: The Dyad stacked four prompt collections,
//     roughly 81 prompts on one page ("confusing"). The Dyad now holds only
//     the opening copy, the how-it-works diagram and the ten free taster
//     cards, then points forward. Everything else moved into a new LAST
//     entry, The prompt bank: the five Using the Prompts groups, the fifteen
//     TELL ME prompts, the fifteen deck-category groups and the cards
//     section. The duplicated framing line and the stray "One prompt,
//     fifteen minutes" sub-heading are deleted. Every prompt string still
//     appears exactly once in this file.
//  3. EVERYTHING leads to The Touch Reset. The "Get the full decks →" link is
//     gone, and The Beginning link in The 3-Minute Touch Reset is now plain
//     prose, same words, no href. Exactly one CTA remains in the whole guide,
//     the Book a call bigLink, plus the single small One Touch line under it.
//     The Spotify and Substack links inside her bio stay: they are follows,
//     not offers.
//  4. Cards app photography: cards-upsell.jpg (her own hands, the app open on
//     cards.netlify.app) plus a clean in-app screenshot, copied into
//     /public/rituals/cards-app-screenshot.png from the Unspoken Distance
//     assets so this guide owns its own file.
//  5. Date Morning's "Two lists" was vague. It is now three concrete steps:
//     written in advance and separately, what actually goes on each list,
//     and how they get read out. The rest of Date Morning is untouched.
//  6. The call came after her bio. New end order: Where this stops, then
//     Meet Juliette, then The prompt bank as reference material.
//  7. The Touch Reset Quiz is out. The "Your Next Yes" entry existed mainly
//     to carry it plus a One Touch push, and is deleted whole. Its two photos
//     (your-next-yes.png, one-touch-photo.jpg) go with it.
//  8. One Touch is one small plain link under the Book a call button, and
//     appears nowhere else.
//
// FOURTH PASS 27 Aug 2026: everything above this note describes when this
// file WAS "The Touch Rituals," the 20-item course guide. That guide split
// back into two separate products the same day (Juliette: "I do NOT want
// to give the touch rituals away for free anymore, the html is for the
// course"). This file kept powering the ten-touch-rituals collection the
// whole time, so it never reverted, and a buyer of the real £7 product was
// seeing the 20-item course guide's content instead (Juliette caught this
// directly: "you gave me 22," and separately, several entries had no
// photo because they were never part of the real deck to begin with).
// Corrected by re-reading the live Gamma deck "10 Touch Rituals"
// (g_ue6g0xx1slcn9ie, NOT "17 Touch Rituals," a separate, older, unrelated
// Gamma doc) directly and rebuilding this file to match it exactly: 11
// course-only entries removed (why-this-is-not-optional,
// everything-at-a-glance, the daily/weekly/monthly/once-a-year dividers,
// date-morning, the-monthly-check-in, the-touch-map, the-year-in-the-body,
// where-this-stops), the Trace Ritual moved back to its real position
// right after Why Touch Matters, the-prompt-bank trimmed from ~80 prompts
// back down to the real 15 (5 categories x 3) plus the real Cards upsell
// copy, and a real "your-next-yes" closing added back (One Touch pitch,
// matching Gamma's actual close, not the course's "book a call" pitch).
// Touch Base's video also moved off Google Drive onto Vimeo. Juliette
// supplied a BETTER Touch Base recording 30 Sep 2026, 1223329859, which
// replaces the earlier 1219027987 everywhere. The old id still resolves,
// it is simply the weaker take. (was 1219027987),
// matching the Trace Ritual's existing Vimeo embed (1213290844), both
// supplied by Juliette 27 Aug 2026. If this guide ever needs to grow past
// ten again, that is a new decision from her, not a default to restore
// from this file's git history.

import { ContentBlock } from "./blocks";

export type PracticeEntry = {
  slug: string;
  order: number;
  title: string;
  eyebrow?: string;
  kind: "essay" | "ritual" | "closing";
  body: ContentBlock[];
  // Optional: some Gamma sections genuinely have no real photo of their
  // own. Leave both unset rather than borrowing another entry's photo —
  // a missing image is honest, a reused one reads as a mistake.
  image?: string;
  imageAlt?: string;
  imageSide: "left" | "right";
  // Optional: the hero band crops to a wide, short strip (object-cover),
  // which centres by default. Fine for landscape mood photos, but a tall
  // portrait headshot (the "Meet Juliette" entries) gets its top, her
  // face, cropped off when centred. Set "top" for any close portrait so
  // the crop anchors to her face instead (Juliette, 3 Aug 2026: "my head
  // is cut off"). Omit for anything else — defaults to the existing
  // centred behaviour, unchanged.
  imageFocus?: "top" | "center";
};

export type PracticeCollection = {
  slug: string;
  title: string;
  subtitle: string;
  byline: string;
  heroImage: string;
  unlockMode: "free-browse" | "sequential";
  entries: PracticeEntry[];
  // "dark" matches a guide's own moody Gamma theme (black background,
  // cream text, gold accents — same 4 brand colours, just inverted).
  // Defaults to the app's usual light theme when omitted.
  theme?: "light" | "dark";
};

export const tenTouchRituals: PracticeCollection = {
  slug: "ten-touch-rituals",
  title: "10 Touch Rituals",
  subtitle: "For couples who love each other and want to feel it again.",
  byline: "By Juliette Karaman, creator of The Beginning: The Ultimate Touch Reset",
  heroImage: "/rituals/hero.png",
  unlockMode: "free-browse",
  entries: [
    // ------------------------------------------------------------ opening
    {
      slug: "a-note-before-you-begin",
      order: 0,
      title: "A Note Before You Begin",
      eyebrow: "The truth about couples",
      kind: "essay",
      image: "/rituals/note-before.jpeg",
      imageAlt: "Couple sitting together on a bed in warm morning light",
      imageSide: "left",
      body: [
        { kind: "p", text: "Most couples don't fall out of love.", emphasis: "bold" },
        { kind: "p", text: "They fall out of touch.", emphasis: "accent" },
        {
          kind: "p",
          text: "Not just physical touch, though that too. They lose the habit of landing in each other's presence. The body forgets what it felt like to be reached for, to be held without agenda, to feel genuinely met.",
        },
        { kind: "quote", text: "What These Rituals Are For" },
        {
          kind: "p",
          text: "These rituals are not about fixing anything. They are about remembering what's already there.",
        },
        {
          kind: "p",
          text: "Use them in order. Use them out of order. Use one for a week. Use all of them in a month.",
        },
        {
          kind: "p",
          text: "What matters is this: you show up, you slow down, and you let yourself be felt.",
          emphasis: "accent",
        },
      ],
    },
    {
      slug: "why-touch-matters",
      order: 3,
      title: "Why Touch Matters",
      kind: "essay",
      image: "/rituals/why-touch-matters.jpeg",
      imageAlt: "Warm, quiet closeness",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "The skin is the largest organ in your body. It contains more nerve endings than anything else. Before you had words, before you could recognise faces, touch was how you knew you were safe.",
        },
        { kind: "p", text: "It is the first language you ever learned.", emphasis: "bold" },
        {
          kind: "p",
          text: "When physical touch is absent, the nervous system registers it. Through the slow drift of busy lives, through bodies that forget to reach. The nervous system starts to call the distance normal.",
        },
        {
          kind: "p",
          text: "Gradually, the body stops expecting to be met. That is what I call going quiet.",
        },
        {
          kind: "p",
          text: "Touch regulates the nervous system. It releases oxytocin, serotonin, dopamine. It reduces cortisol.",
        },
        {
          kind: "p",
          text: "It tells your body: you are not alone. You are not a threat to each other. You can soften here.",
        },
        {
          kind: "p",
          text: "In 15 years working with over 650 couples, what I see most is this: their bodies have stopped speaking to each other.",
        },
        {
          kind: "p",
          text: "These rituals are a way back into that conversation.",
          emphasis: "accent",
        },
        {
          kind: "big",
          text: "Most people think that kind of touch is luck, or chemistry. It is not. We built it. What you are watching is the result. These rituals are where it gets built.",
        },
      ],
    },
    // -------------------------------------------------------------- daily
    {
      slug: "the-landing",
      order: 5,
      title: "The Landing",
      eyebrow: "Daily · 90 seconds",
      kind: "ritual",
      image: "/rituals/the-landing.jpeg",
      imageAlt: "Two people arriving into the same quiet room",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Most couples start the day already managing it. Phones, children, logistics, the mental list. The bodies in the same room never actually arrive into the same room.",
        },
        { kind: "big", text: "This takes 90 seconds." },
        { kind: "p", text: "Before phones. Before speaking. Before the day begins." },
        {
          kind: "step",
          label: "Find each other",
          lines: [{ text: "Stand or sit close enough to feel each other's warmth." }],
        },
        {
          kind: "step",
          label: "Breathe together",
          lines: [
            { text: "Look at each other, take a breath in through your nose and exhale through your mouth." },
            { text: "Do this 3 times together and watch what happens between you.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Say it",
          lines: [{ text: "One of you says: “I'm here.” The other one receives that and says: “I feel you.”" }],
        },
        {
          kind: "notice",
          lines: [
            { text: "Notice what happens in your bodies as you witness each other." },
            { text: "Nothing else is required." },
          ],
        },
        {
          kind: "p",
          text: "This is a practice of arrival, not performance.",
          emphasis: "accent",
        },
      ],
    },
    {
      slug: "touch-base-anchor",
      order: 6,
      title: "Touch Base® Anchor",
      eyebrow: "Daily · 2 minutes, twice a day",
      kind: "ritual",
      image: "/rituals/touch-base-anchor.png",
      imageAlt: "The Touch Base gesture, thumb to forefinger",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "I teach this to every single client. It is the foundation of everything else in this document.",
        },
        {
          kind: "p",
          text: "Your body is always scanning. All it takes is one loaded moment. A look. A brush. A hand that lingered where it shouldn't have. Your system registers it. You might not remember when. But your body does. It braces.",
        },
        {
          kind: "p",
          text: "Often, even in loving relationships, this is why touch doesn't land. Not because you don't want to receive it. Because your body is still armoured, just in case.",
        },
        {
          kind: "p",
          text: "Touch Base® interrupts that loop. Without drama. Without excavation.",
          emphasis: "accent",
        },
        {
          kind: "step",
          label: "The gesture",
          lines: [
            { text: "Press your thumb to your forefinger.", emphasis: "bold" },
            { text: "Slowly move your top finger so you can feel every single finger ridge." },
            { text: "Slower than you think slow is. Like honey. Even slower than that.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "The anchor line",
          lines: [
            { text: "Notice where you want to speed up. Notice what thoughts are coming up. Let them pass." },
            { text: "Remind yourself: there is no tiger in the room. I am safe.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "The dose",
          lines: [{ text: "Do this for 2 minutes. Twice a day. Morning and evening.", emphasis: "bold" }],
        },
        {
          kind: "notice",
          lines: [
            { text: "Before you begin, rate how you feel 1–10." },
            { text: "After 2 minutes, rate again. What shifted?" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "This gesture activates pressure points that, when paired with slowness, breath, and attention, down-regulate the stress response.", emphasis: "bold" },
            { text: "You are gently retraining your system to associate this moment with safety." },
            { text: "After 31 days it becomes automatic. After 90 it is muscle memory." },
            { text: "You will find yourself doing it when a car cuts in front of you, when the children are pushing every button, when you feel yourself drifting from the present moment.", emphasis: "bold" },
            { text: "So discreet your partner won't even notice. But your body will.", emphasis: "accent" },
          ],
        },
        { kind: "video", vimeoId: "1223329859" },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1-7kHzl2T-kBXJIae6uk-3u_KMeDV9Mks/view?usp=sharing",
          label: "Follow along, audio",
        },
      ],
    },
    {
      slug: "the-name",
      order: 7,
      title: "The Name",
      eyebrow: "Daily · 10 seconds",
      kind: "ritual",
      image: "/rituals/the-name.jpeg",
      imageAlt: "Full presence, saying the name slowly",
      imageSide: "right",
      body: [
        { kind: "p", text: "Say their name. The actual name they were given.", emphasis: "bold" },
        { kind: "p", text: "Not love, not babe, not darling. Their name, with your full attention behind it." },
        {
          kind: "step",
          label: "Turn to face them",
          lines: [{ text: "At any moment in the day, turn to face them." }],
        },
        {
          kind: "step",
          label: "Say it",
          lines: [
            { text: "Say their name. Once. Slowly. With presence.", emphasis: "bold" },
            { text: "Nothing else is required.", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "What changes in them when you do this?" },
            { text: "What changes in you?" },
          ],
        },
        {
          kind: "p",
          text: "When we say someone's name with presence, it lands differently. It says: I see you specifically. Not the role you are playing. Not the version of you I have grown used to. You, as you actually are, right now.",
        },
        { kind: "quote", text: "Extra Practice" },
        {
          kind: "p",
          text: "Play with how you say each other's names: surprised, angry, playful, longingly, hesitantly.",
        },
        {
          kind: "notice",
          lines: [
            { text: "Notice how it feels to receive this from your partner." },
            { text: "Notice how it felt to do this exercise in all its forms." },
            { text: "Which did you prefer?" },
            { text: "What didn't you like?" },
            { text: "Bringing awareness to these patterns is key.", emphasis: "accent" },
          ],
        },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/10cpRCfdR5AOlKQFVuBo5nnjf9PQj23ie/view?usp=sharing",
          label: "Listen along as I do this exercise",
        },
      ],
    },
    {
      slug: "the-handshake-of-gratitude",
      order: 8,
      title: "The Handshake of Gratitude",
      eyebrow: "Daily · 2 minutes, before sleep",
      kind: "ritual",
      image: "/rituals/the-handshake-of-gratitude.jpeg",
      imageAlt: "Before sleep, naming one moment of closeness from the day",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "Before sleep, each person names one physical moment from the day where they felt close.",
        },
        {
          kind: "p",
          text: "Not ‘you were kind.’ Something sensory, specific. The way they reached for your hand. The moment they turned toward you in the kitchen. The 30 seconds they stopped what they were doing and looked at you.",
        },
        {
          kind: "step",
          label: "Before sleep",
          lines: [{ text: "Lie or sit together before sleep." }],
        },
        {
          kind: "step",
          label: "Name it",
          lines: [{ text: "One of you names one physical moment from the day. Sensory. Specific.", emphasis: "bold" }],
        },
        {
          kind: "step",
          label: "Receive it",
          lines: [
            { text: "The other receives it. No response required." },
            { text: "Just: received. Switch.", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "What does it feel like to be named specifically?" },
            { text: "What does it feel like to search for that moment in your own memory?" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Specificity teaches the body what to reach for more of.", emphasis: "bold" },
            { text: "When you name a physical moment, you are training your nervous system to register closeness when it happens, not just in retrospect." },
            { text: "Over time, you stop missing each other while you are still in the room.", emphasis: "accent" },
          ],
        },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1KeZfIiJ_NV3idc8WTKL4f_6aecjTtgg_/view?usp=sharing",
          label: "Follow along, audio",
        },
      ],
    },
    {
      slug: "the-three-breath-hold",
      order: 9,
      title: "The Three Breath Hold",
      eyebrow: "Daily · 1 minute",
      kind: "ritual",
      image: "/rituals/the-three-breath-hold.jpeg",
      imageAlt: "Holding hands through three slow breaths",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "When one of you is overwhelmed, the most common response is to try to help. To fix. To say the right thing.",
        },
        { kind: "big", text: "Sometimes the body just needs to know it is not alone." },
        {
          kind: "step",
          label: "Reach",
          lines: [{ text: "When one of you is overwhelmed, reach for their hand. Don't speak.", emphasis: "bold" }],
        },
        {
          kind: "step",
          label: "Breathe",
          lines: [
            { text: "Take three slow breaths together. In through the nose, out through the mouth." },
            { text: "That is all.", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [{ text: "What does it feel like to be held in silence rather than solved?" }],
        },
        {
          kind: "p",
          text: "This is presence, not a solution. It says: I am staying.",
        },
        {
          kind: "p",
          text: "That is sometimes everything.",
          emphasis: "accent",
        },
      ],
    },
    // ------------------------------------------------------------- weekly
    {
      slug: "the-60-second-hug",
      order: 11,
      title: "The 60-Second Hug",
      eyebrow: "Weekly · 1 minute",
      kind: "ritual",
      image: "/rituals/the-60-second-hug.jpeg",
      imageAlt: "A held, unhurried 60-second hug",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "I teach structured touch. That means time. That means agreement. That means following through. All of it creates safety.",
        },
        {
          kind: "p",
          text: "Some people think it is crazy to start with a 60-second hug. Until they do it this way.",
        },
        {
          kind: "step",
          label: "Step 1, Ask first",
          lines: [{ text: "“Do you have the bandwidth for this?”" }],
        },
        {
          kind: "step",
          label: "Step 2, Agree the container",
          lines: [
            { text: "60 seconds.", emphasis: "bold" },
            { text: "No talking. No phones. No distractions." },
            { text: "This is not going to lead anywhere else." },
            { text: "That last part matters." },
            { text: "Safety means the body knows what it signed up for.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 3, Arrive",
          lines: [
            { text: "Look at each other's eyes as you reach for them." },
            { text: "Let your body guide how much you want to lean in. Take one breath together, in through the nose, out through the mouth." },
          ],
        },
        {
          kind: "step",
          label: "Step 4, Hold",
          lines: [
            { text: "Allow yourself to be held." },
            { text: "Allow yourself to hold." },
            { text: "No agenda.", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Is your breath starting to synchronise with theirs? Can you feel their heartbeat?" },
            { text: "Afterwards: rate on a scale of 1–10 how connected you feel." },
            { text: "1 is completely disconnected. 10 is fully met." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "At 20 seconds oxytocin begins to release. Cortisol drops.", emphasis: "bold" },
            { text: "The nervous system stops scanning and starts to settle." },
            { text: "Your body registers what your mind already knows: you are safe here." },
            { text: "The agreed time is not a limit. It is a container.", emphasis: "bold" },
            { text: "When both bodies know when it will end, they can fully arrive into it.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "the-3-minute-touch-reset",
      order: 13,
      title: "The 3-Minute Touch Reset",
      eyebrow: "Weekly · 3 minutes",
      kind: "ritual",
      image: "/rituals/the-3-minute-touch-reset.jpeg",
      imageAlt: "A palm resting on a hand, no movement, just presence",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Most people wait until they feel ready for a Touch Date. The body doesn't work that way.",
        },
        { kind: "quote", text: "You touch, and readiness arrives." },
        {
          kind: "p",
          text: "A Touch Date does not need to be an hour. It needs to be present. Three minutes, structured, with agreement.",
        },
        {
          kind: "step",
          label: "Step 1, Ask first",
          lines: [{ text: "“Do you have three minutes? No agenda. Nothing needs to happen after this.”" }],
        },
        {
          kind: "step",
          label: "Step 2, Arrive",
          lines: [
            { text: "Sit facing each other. Both press thumb to forefinger, Touch Base®." },
            { text: "Close your eyes. One breath together, in through the nose, out through the mouth." },
            { text: "Let the day fall away.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 3, One Touch",
          lines: [
            { text: "Partner A places their palm gently on Partner B's hand." },
            { text: "No movement. No agenda.", emphasis: "bold" },
            { text: "The weight of a hand that says: I'm here.", emphasis: "accent" },
            { text: "Partner B receives it. Eyes can stay closed." },
          ],
        },
        {
          kind: "step",
          label: "Step 4, One word",
          lines: [
            { text: "When the minute ends, Partner B says one word for what they felt. Not an explanation. A word." },
            { text: "Partner A receives it by saying ‘thank you’. Switch." },
            { text: "Partner B places their palm, Partner A receives. Close together with Touch Base®." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "What was present in your body at the start that is different now?" },
            { text: "Where did you feel the contact land?" },
          ],
        },
        {
          kind: "p",
          text: "The full Touch Date sequence, the structured arcs from 3 to 20 minutes, is inside The Beginning, the Ultimate Touch Reset.",
        },
      ],
    },
    {
      slug: "the-things-you-used-to-love",
      order: 14,
      title: "The Things You Used to Love",
      eyebrow: "Once a month \u00b7 a morning out",
      kind: "ritual",
      image: "/rituals/the-things-you-used-to-love.jpeg",
      imageAlt: "A picnic blanket on the grass with a kite and a spilled bag of marbles",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "This one is not touch, and it is not a conversation either. It is the third thing closeness is made of, and it is usually the first to go.",
        },
        {
          kind: "p",
          text: "You know how your partner takes their coffee. You may not know what they did for hours at a time when they were seven, with nobody watching and nobody making them.",
        },
        {
          kind: "p",
          text: "Play is the fastest way back to someone's aliveness, and none of it asks either of you to talk about the relationship.",
          emphasis: "accent",
        },
        {
          kind: "step",
          label: "Step 1, Write your ten, on your own",
          lines: [
            { text: "Ten things you loved doing as a child." },
            { text: "Not what you were good at. What you did because you wanted to." },
            { text: "Climbing things. Making dens. Marbles. Kites. Roller skates. Collecting something nobody else thought was worth anything." },
            { text: "Do not show each other yet.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 2, Choose the one you could teach",
          lines: [
            { text: "Pick one off your list that you could actually show somebody how to do." },
            { text: "It has to be something you can carry, or something you can do outdoors." },
          ],
        },
        {
          kind: "step",
          label: "Step 3, Go somewhere out of the ordinary",
          lines: [
            { text: "A park, a beach, a field. Not the kitchen and not the sofa." },
            { text: "Take a picnic. Take the thing." },
            { text: "A morning, deliberately. This one asks for energy, and the end of a long day has none left.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 4, Teach each other",
          lines: [
            { text: "One of you is the expert. The other one is genuinely learning." },
            { text: "Show them the grip on the marble. How to run backwards to get a kite up. Where to put their feet." },
            { text: "Take it seriously enough to actually teach it." },
            { text: "Being a beginner in front of each other is the part that does the work.", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [{ text: "There is nothing to say afterwards. You will have laughed, or you will have been useless at it in front of each other, or both. That is the whole of it. Do not turn it into a conversation about the relationship." }],
        },
      ],
    },
    // ------------------------------------------------------------ monthly
    {
      slug: "the-breath-bridge",
      order: 18,
      title: "The Breath Bridge",
      eyebrow: "Monthly · 3 minutes, no touch required",
      kind: "ritual",
      image: "/rituals/the-breath-bridge.jpeg",
      imageAlt: "Sitting facing each other, no touch, just breath",
      imageSide: "left",
      body: [
        { kind: "p", text: "Once a month. No touch required. Just presence and breath.", emphasis: "bold" },
        {
          kind: "p",
          text: "Most couples underestimate how much the body communicates before any touch begins. This practice teaches you to feel each other's nervous system and let yours respond.",
        },
        {
          kind: "step",
          label: "Step 1, Ask first",
          lines: [{ text: "“Can we do 3 minutes together? Just breathing. Nothing else.”" }],
        },
        {
          kind: "step",
          label: "Step 2, Sit facing each other",
          lines: [{ text: "Close enough to feel each other's warmth. Knees touching or not, let your body choose." }],
        },
        {
          kind: "step",
          label: "Step 3, Breathe together",
          lines: [
            { text: "Inhale through the nose, 4 counts. Hold, 2 counts. Exhale through the mouth, 6 counts.", emphasis: "bold" },
            { text: "Let it become rhythmic. 3 minutes." },
          ],
        },
        {
          kind: "step",
          label: "Step 4, Notice",
          lines: [
            { text: "Is your breath starting to sync with theirs? Does anything soften in your chest, your jaw, your hands?" },
            { text: "What is the quality of the space between you now compared to when you started?", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Afterwards: each of you shares one word for what you felt." },
            { text: "No discussion. Just receive it.", emphasis: "accent" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Synchronised breath co-regulates two nervous systems.", emphasis: "bold" },
            { text: "You are not just relaxing individually." },
            { text: "You are coming into the same frequency." },
            { text: "The body reads that as: we are safe together.", emphasis: "bold" },
            { text: "You have done something intimate without a single touch.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "elbow-to-armpit",
      order: 20,
      title: "Elbow to Armpit",
      eyebrow: "Weekly \u00b7 10 minutes, one gives and one receives",
      kind: "ritual",
      image: "/rituals/elbow-to-armpit.jpeg",
      imageAlt: "One hand resting along the inside of another person\u2019s forearm",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "The soft inside of the elbow is somewhere almost nobody has paid attention to. That is exactly why it is useful. There is no script for it, no habit attached, and nothing either of you is expecting.",
        },
        {
          kind: "p",
          text: "Three touches, in order. Each one asks a different question. Then you change places and do it again.",
        },
        {
          kind: "p",
          text: "What you are learning is the difference between where a body says yes, and where it says I will allow it.",
          emphasis: "accent",
        },
        {
          kind: "step",
          label: "Set up",
          lines: [
            { text: "Decide who gives first and who receives first." },
            { text: "The receiver opens their arm and lets the elbow rest on something. A sofa, the back of an armchair, a bed, a desk, a table." },
            { text: "The giver sits or kneels where they can reach it without leaning across." },
            { text: "Both of you speak during this, one after the other. The giver has sensation in their fingertips too.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Touch one, hover",
          lines: [
            { text: "Giver: bring your fingertips just above the soft part of their elbow. Do not land yet." },
            { text: "Can you sense temperature, tingling, or a subtle shift?" },
            { text: "Both of you say out loud where you can feel it. Receiver first, then giver." },
            { text: "Receiver: does your body lean into this zone, or does it hold back?" },
            { text: "What did this zone communicate to you?", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Touch two, land",
          lines: [
            { text: "Giver: now gently land the touch. Landing means barely brushing the skin." },
            { text: "If there is hair there, your fingers stroke the very top of it, and the hair almost rises to meet them." },
            { text: "Receiver: was there a noticeable change the moment their fingers made contact? Did it increase the sensation, or decrease it?" },
            { text: "Did your body open, or tense slightly?" },
            { text: "There is no wrong here and there is no right. All of it is beautiful information.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Touch three, trace",
          lines: [
            { text: "Giver: trace your fingertips slowly from the inner elbow up towards the armpit." },
            { text: "Receiver: every time you feel the stroke, say yes out loud. Yes. Yes. Yes." },
            { text: "Every time you do not feel it, say nothing." },
            { text: "That is not politeness and it is not encouragement. You are training your body to notice, and the silences tell you as much as the yeses do." },
            { text: "Your yes IS the practice.", emphasis: "accent" },
            { text: "Giver: do not chase the yeses and do not slow down to fish for one. Keep your pace. The map you are being handed is worth more than a good score." },
            { text: "Receiver: did the sensation build, fade, or stay steady? Was there a moment where it felt like enough? Did you want it to stop, or to go further?" },
            { text: "What do you tend to do when sensation builds? Do you stay, do you pause, or do you rush through it?", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Then change places",
          lines: [
            { text: "Run all three touches again the other way round." },
            { text: "Do not compare the two halves out loud. They were never going to match, and saying so turns it into a score." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Another time, run it with your non-dominant sides. The giver gives with the hand they do not write with. The receiver offers the elbow on their non-dominant arm." },
            { text: "Was the sensation different? Was there an emotional response neither of you expected?" },
          ],
        },
      ],
    },
    // ------------------------------------------------------- once a year
    // ------------------------------------------------------------- the turn
    // ------------------------------------------------------------ closing
    {
      slug: "31-days-closer",
      order: 25,
      title: "31 Days Closer",
      eyebrow: "When you want the words back",
      kind: "closing",
      image: "/rituals/31-days-closer.jpg",
      imageAlt: "31 Days Closer open on a phone at day one, beside the printed deck",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "The rituals in here bring touch back into the room. This is the other half of it.",
        },
        { kind: "image", src: "/rituals/31-days-closer.jpg", alt: "31 Days Closer open on a phone at day one, beside the printed deck" },
        {
          kind: "p",
          text: "Touch reaches what words cannot. It also has a limit, and most couples meet it: you can be close in the body and still not have said the thing.",
        },
        {
          kind: "p",
          text: "One prompt a day, for thirty one days. Fifteen minutes each.",
          emphasis: "accent",
        },
        {
          kind: "p",
          text: "The single reason a practice like this dies is that on day two nobody knows which question to pick. One of you wants the easy one, the other wants the real one, and the fifteen minutes goes on choosing instead of talking. This takes the choosing away. You open it, today's prompt is there, and that is the only decision made for you.",
        },
        {
          kind: "p",
          text: "It cannot be raced through either. The next one opens the following morning whatever you do, so a keen week cannot empty it and a quiet week cannot put you behind.",
        },
        { kind: "quote", text: "The order is doing something" },
        { kind: "p", text: "Seven days on what you notice, and what you have stopped noticing." },
        { kind: "p", text: "Seven on what is actually going on in the other one." },
        { kind: "p", text: "Seven on the part most couples have quietly taken off the list." },
        { kind: "p", text: "Seven on what has been left unsaid, once you have had three weeks of practice at being heard." },
        { kind: "p", text: "Three at the end, on what you are both saying yes to." },
        {
          kind: "p",
          text: "Nobody could do week four on day one. By the time you arrive there you have had three weeks of being received without being answered, and that is what makes the harder ones answerable.",
        },
        {
          kind: "p",
          text: "\u00a317. It opens on any phone, no account and no password, and the first card is waiting when you open it.",
          emphasis: "accent",
        },
        { kind: "p", text: "feelfullyyou.com/31-days-closer" },
      ],
    },
    // ---------------------------------------------------------- reference
    {
      slug: "meet-juliette",
      order: 24,
      title: "Meet Juliette",
      eyebrow: "27 years of helping people feel, relate, and connect",
      kind: "closing",
      image: "/rituals/meet-juliette.jpeg",
      imageAlt: "Juliette Karaman",
      imageSide: "right",
      imageFocus: "top",
      body: [
        {
          kind: "p",
          text: "I create experiences, for the moment you understand exactly what's happening in your body, and still something tightens or fades the second closeness begins.",
        },
        {
          kind: "p",
          text: "For over 27 years I've worked with how people feel, relate, and connect, across mind, nervous system, body, and relationship.",
        },
        {
          kind: "p",
          text: "It began with children on the autism spectrum, helping them trust sensation before they had words for it. For the last fifteen, I've worked with thousands of individuals and couples who love each other, live full lives, and still lose connection the moment touch begins.",
        },
        {
          kind: "p",
          text: "Insight alone doesn't change intimacy. Touch alone doesn't either.",
          emphasis: "bold",
        },
        {
          kind: "p",
          text: "Change happens through experiences the body can stay present with.",
          emphasis: "accent",
        },
        {
          kind: "p",
          text: "The couples I work with don't just understand themselves better, they feel different, they touch differently, they stay in connection.",
        },
        { kind: "image", src: "/rituals/podcast-cover.jpg", alt: "The Scrumptious Woman podcast" },
        { kind: "quote", text: "The Scrumptious Woman podcast, top 2.5% worldwide" },
        {
          kind: "link",
          text: "Listen here",
          href: "https://open.spotify.com/show/50jFN83FxoNm0UXiryqkJW",
        },
        { kind: "p", text: "Every moment of presence is a new chance to come In Touch.", emphasis: "accent" },
        { kind: "image", src: "/rituals/substack-cta.png", alt: "What The Body Knows, Juliette's Substack" },
        { kind: "quote", text: "SUBSTACK" },
        {
          kind: "p",
          text: "I write more deeply on Substack. Why these processes work, what I have seen and what the journey has been.",
        },
        { kind: "p", text: "If you are interested in this, follow me there." },
        {
          kind: "link",
          text: "Follow here",
          href: "https://substack.com/@juliettekaraman",
        },
      ],
    },
  ],
};