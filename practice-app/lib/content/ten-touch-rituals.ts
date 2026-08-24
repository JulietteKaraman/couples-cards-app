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
  title: "The Touch Rituals",
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
      slug: "why-this-is-not-optional",
      order: 1,
      title: "Why this is not optional",
      eyebrow: "Read this first",
      kind: "essay",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Everyone sells you spontaneity. Wait for the mood, wait for the weekend, wait until the children are older.",
        },
        { kind: "p", text: "It does not arrive.", emphasis: "bold" },
        {
          kind: "p",
          text: "A body that has been braced for years does not soften because the diary cleared.",
        },
        {
          kind: "big",
          text: "Structure is not the opposite of romance. It is what makes romance survivable for a nervous system that learned to flinch.",
        },
        {
          kind: "why",
          lines: [
            { text: "Agreement, time, and a clear end point.", emphasis: "bold" },
            { text: "Your body stops scanning for what this is going to turn into, and only then can it feel what is actually happening.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "everything-at-a-glance",
      order: 2,
      title: "Everything, at a glance",
      eyebrow: "The whole guide on one page",
      kind: "essay",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Daily, weekly, monthly. Every one of them tested in a room with real couples, and every one of them yours to keep.",
        },
        {
          kind: "table",
          headers: ["Ritual", "Cadence", "How long"],
          rows: [
            ["The Landing", "Daily", "90 seconds"],
            ["Touch Base® Anchor", "Daily", "2 minutes, twice a day"],
            ["The Name", "Daily", "10 seconds"],
            ["The Handshake of Gratitude", "Daily", "2 minutes, before sleep"],
            ["The Three Breath Hold", "Daily", "1 minute"],
            ["The 60-Second Hug", "Weekly", "1 minute"],
            ["The Trace Ritual", "Weekly", "2 minutes"],
            ["The 3-Minute Touch Reset", "Weekly", "3 minutes"],
            ["The Dyad", "Weekly", "15 minutes"],
            ["Date Morning", "Weekly", "75 minutes"],
            ["The Monthly Check-In", "Monthly", "30 minutes"],
            ["The Breath Bridge", "Monthly", "3 minutes"],
            ["Yes, Maybe, No", "Monthly", "20 minutes"],
            ["The Approach", "Monthly", "10 minutes"],
            ["The Year in the Body", "Once a year", "1 hour"],
          ],
        },
        {
          kind: "p",
          text: "Start anywhere. The daily ones are small enough that a hard day cannot take them from you.",
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
          text: "Most people think that kind of touch is luck, or chemistry. It is not. We built it. What you are watching is the result. These ten rituals are where it gets built.",
        },
      ],
    },
    // -------------------------------------------------------------- daily
    {
      slug: "daily",
      order: 4,
      title: "Daily",
      eyebrow: "Tier one",
      kind: "essay",
      image: "/rituals/hero.png",
      imageAlt: "Two hands finding each other in warm light",
      imageSide: "left",
      body: [
        { kind: "big", text: "Small enough that a hard day cannot take them from you." },
        {
          kind: "p",
          text: "That is why these ones are daily: a rhythm your worst day cannot interrupt is the only one that holds.",
          emphasis: "accent",
        },
      ],
    },
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
        {
          kind: "driveVideo",
          url: "https://drive.google.com/file/d/1Rcta69BuEbPGS0zrwhkg2sLlayDnWrKT/view?usp=sharing",
          label: "Watch the video",
        },
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
      slug: "weekly",
      order: 10,
      title: "Weekly",
      eyebrow: "Tier two",
      kind: "essay",
      image: "/rituals/the-trace-ritual.jpeg",
      imageAlt: "A face held, unhurried",
      imageSide: "right",
      body: [
        { kind: "big", text: "Longer, agreed in advance, with a clear end." },
        {
          kind: "p",
          text: "That is why these ones are weekly: they are long enough to need agreement, and agreement needs a time you both chose.",
        },
        {
          kind: "p",
          text: "The agreement is what makes them work.",
          emphasis: "accent",
        },
      ],
    },
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
      slug: "the-trace-ritual",
      order: 12,
      title: "The Trace Ritual",
      eyebrow: "Weekly · 2 minutes, the one people find me through",
      kind: "ritual",
      image: "/rituals/the-trace-ritual-real.jpg",
      imageAlt: "Juliette, mid-trace, the frame the video is known by",
      imageSide: "left",
      body: [
        { kind: "video", vimeoId: "1213290844" },
        {
          kind: "p",
          text: "The video people find me through is one moment of this. He traces my jaw with his fingertips, slowly, and I receive it.",
        },
        { kind: "p", text: "What you cannot see is everything underneath." },
        { kind: "big", text: "No performance." },
        {
          kind: "p",
          text: "That kind of touch only lands because two things are true at once. One person knows how to receive without flinching, managing, or turning it into something that has to go somewhere. The other slows down enough to give it, fully present, wanting nothing back.",
        },
        {
          kind: "p",
          text: "Almost nobody is taught either one. This ritual teaches both.",
          emphasis: "accent",
        },
        {
          kind: "step",
          label: "Step 1, Ask first",
          lines: [{ text: "“Can I trace your face for two minutes? No agenda. Nothing needs to happen after this.”" }],
        },
        {
          kind: "step",
          label: "Step 2, Agree the container",
          lines: [
            { text: "Two minutes.", emphasis: "bold" },
            { text: "The receiver does nothing but feel. The giver does nothing but give." },
            { text: "This is not going toward anything else." },
            { text: "That is what makes it safe.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 3, Receive",
          lines: [
            { text: "Close your eyes. Soften your jaw. Let your hands rest.", emphasis: "bold" },
            { text: "Your only job is to feel the touch land, and to stay with it when the urge comes to smile it off or hurry it along." },
            { text: "Notice that urge. Let it pass.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 4, Give",
          lines: [
            { text: "Start at the temple or the edge of the jaw." },
            { text: "The lightest contact, fingertips or the edge of a nail, slower than you think slow is. Like honey.", emphasis: "bold" },
            { text: "Watch where the breath changes. Follow that.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 5, One word",
          lines: [
            { text: "When the two minutes end, the receiver says one word for what they felt." },
            { text: "Not an explanation. A word.", emphasis: "bold" },
            { text: "The giver receives it by saying thank you. Switch if you both want to." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Receiver, where did you want to speed it up or make it mean something?" },
            { text: "Giver, what happened in you when you slowed down and were not reaching for anything more?" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Receiving is a skill, and most bodies have lost it.", emphasis: "bold" },
            { text: "When you are touched with no demand attached, your nervous system gets to learn that closeness is not a transaction." },
            { text: "The giver learns the same thing from the other side." },
            { text: "This is touch that lands because nothing is being chased.", emphasis: "bold" },
            { text: "It is the whole method in two minutes.", emphasis: "accent" },
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
          kind: "link",
          text: "The full Touch Date sequence, the structured arcs from 3 to 20 minutes, is inside The Beginning, the Ultimate Touch Reset.",
          href: "https://feelfullyyou.com/the-beginning",
        },
      ],
    },
    {
      slug: "the-dyad",
      order: 14,
      title: "The Dyad",
      eyebrow: "Weekly · 15 minutes, one prompt, all the way down",
      kind: "essay",
      image: "/rituals/the-dyad.jpeg",
      imageAlt: "Two people mid-conversation, one listening closely",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "For couples who want to go beyond “I'm fine.”",
        },
        {
          kind: "p",
          text: "Most couples don't struggle to talk. They struggle to listen, really listen, without preparing their response, without defending, without the conversation becoming a negotiation. The Dyad method removes that pressure.",
        },
        {
          kind: "p",
          text: "After years working with couples in session, I noticed that the hardest thing was rarely the touching. It was finding the words. Not because people didn't have them. Because they didn't have a structure safe enough to say them in.",
        },
        {
          kind: "p",
          text: "I created the Intimacy and Communication Cards because couples needed something they could use without me in the room. A way to keep the conversation alive between sessions, between weeks, in the ordinary moments that matter.",
        },
        {
          kind: "quote",
          text: "15 minutes of being genuinely heard and understood does more for a relationship than three hours of debate. One question at a time.",
        },
        { kind: "quote", text: "How it works" },
        {
          kind: "diagram",
          steps: [
            { heading: "Ask" },
            { heading: "Answer" },
            { heading: "Listen" },
            { heading: "Thank" },
            { heading: "Switch" },
          ],
        },
        {
          kind: "step",
          label: "Ask",
          lines: [{ text: "One person reads the prompt." }],
        },
        {
          kind: "step",
          label: "Answer",
          lines: [{ text: "The other answers, honestly, without editing.", emphasis: "bold" }],
        },
        {
          kind: "step",
          label: "Listen",
          lines: [{ text: "The listener stays present. No fixing, no defending, no responding.", emphasis: "accent" }],
        },
        {
          kind: "step",
          label: "Thank",
          lines: [
            { text: "The listener may say only three things, and two of them are on the way to the third." },
            { text: "If you need clarity, say “Clarify that.”" },
            { text: "If too many thoughts or too long, say “Summarise that.”" },
            { text: "When the answer lands, say “Thank you.”", emphasis: "bold" },
            { text: "That is the destination, and the only thing that passes the turn.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Switch",
          lines: [{ text: "Switch roles and go again." }],
        },
        { kind: "quote", text: "Using the Prompts" },
        { kind: "image", src: "/rituals/using-the-prompts.jpeg", alt: "Two people mid-conversation, one listening closely" },
        {
          kind: "p",
          text: "For the Dyad, for Date Morning, for the drive home. One prompt, fifteen minutes, all the way down.",
        },
        {
          kind: "promptGroup",
          category: "Touch & Sensation",
          color: "teal",
          prompts: [
            "Tell me what kind of touch makes you feel most present.",
            "Tell me something about your body you wish I understood.",
            "Tell me what it feels like in your body when you reach for me first.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Presence & Distance",
          color: "gold",
          prompts: [
            "Tell me when you feel closest to me, without any effort.",
            "Tell me when you feel furthest from me, even when we're in the same room.",
            "Tell me what you need from me when you're pulling away.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Desire & Longing",
          color: "brown",
          prompts: [
            "Tell me something you love about me that you haven't said recently.",
            "Tell me something you've stopped asking for.",
            "Tell me what you long for that we haven't found a way to have yet.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Trust & Repair",
          color: "blueGrey",
          prompts: [
            "Tell me something that hasn't fully healed between us.",
            "Tell me when you feel most trusting of me.",
            "Tell me what repair feels like in your body when it actually happens.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Becoming",
          color: "black",
          prompts: [
            "Tell me who you are right now that I may not fully know yet.",
            "Tell me what kind of couple you want us to be.",
            "Tell me one thing you want us to do this year that you have not spoken out loud.",
          ],
        },
        { kind: "quote", text: "Start with these ten" },
        {
          kind: "p",
          text: "These are the ten free taster cards. Yours already, and enough to run every practice in this guide.",
        },
        {
          kind: "promptGroup",
          category: "The free taster cards",
          color: "gold",
          prompts: [
            "Tell me your biggest fear and biggest desire for our relationship",
            "Tell me about an honest conversation you wish we'd have, but haven't yet. What might make it easier?",
            "Tell me a fantasy you've had, but never voiced",
            "Tell me something you're still healing from sexually.",
            "Tell me your favorite flirty memory with me.",
            "Tell me a trait in your parents or siblings you dislike. Do you see it in yourself too?",
            "Tell me about a risk you took that paid off or didn't. What did you learn from it?",
            "Tell me a story that changed your perspective or deeply impacted you.",
            "Tell me about a conversation you wish you could revisit. What would you say or do differently?",
            "Tell me a challenge you faced that made you stronger. How did you grow because of it?",
          ],
        },
        { kind: "quote", text: "One prompt, fifteen minutes" },
        {
          kind: "promptGroup",
          category: "Touch",
          color: "teal",
          prompts: [
            "TELL ME WHERE YOU’VE WANTED TO BE TOUCHED AND HAVEN’T ASKED.",
            "TELL ME WHAT KIND OF TOUCH REACHES YOU LATELY.",
            "TELL ME WHEN MY HANDS FEEL LIKE THEY WANT SOMETHING.",
            "TELL ME WHAT MAKES YOU FEEL WANTED WITHOUT ANY PRESSURE IN IT.",
            "TELL ME ABOUT A TIME MY TOUCH LANDED PERFECTLY.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Being known",
          color: "brown",
          prompts: [
            "TELL ME WHICH FEELING YOU’D RATHER I NEVER SAW.",
            "TELL ME WHAT YOU FELT TODAY AND DIDN’T SAY.",
            "TELL ME WHAT YOU WISH I UNDERSTOOD WITHOUT YOU EXPLAINING IT.",
            "TELL ME WHEN YOU LAST FELT COMPLETELY MET BY ME.",
            "TELL ME WHAT YOU’VE LEARNED ABOUT YOURSELF SINCE BEING WITH ME.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Where it started",
          color: "black",
          prompts: [
            "TELL ME WHAT TOUCH LOOKED LIKE IN YOUR HOUSE GROWING UP.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Forward",
          color: "blueGrey",
          prompts: [
            "TELL ME WHAT YOU WANT MORE OF THAT WE ALREADY HAVE.",
            "TELL ME WHAT YOU’RE MOST LOOKING FORWARD TO BUILDING.",
            "TELL ME ONE THING YOU WANT ME TO KNOW RIGHT NOW.",
            "TELL ME WHAT WOULD MAKE THIS WEEK FEEL CLOSE.",
          ],
        },
        { kind: "quote", text: "From the Couples Edition" },
        {
          kind: "promptGroup",
          category: "Romantic Relationships",
          color: "blush",
          prompts: [
            "Tell me how you want to be loved.",
            "Tell me a time you felt truly seen by me.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Intimacy & Repair",
          color: "gold",
          prompts: [
            "Tell me a way you protect yourself emotionally, even from me.",
            "Tell me what support looks like for you in hard moments.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Touch & Desire",
          color: "teal",
          prompts: [
            "Tell me how you want to be touched.",
            "Tell me one place you love being touched that isn’t typically erotic.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Healing & Growth",
          color: "brown",
          prompts: [
            "Tell me what you were taught about sexuality growing up.",
            "Tell me what emotional safety during sex looks like for you.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Play & Discovery",
          color: "black",
          prompts: [
            "Tell me a sensual ritual you wish we did more often.",
            "Tell me what small thing has you feel most In Touch with yourself in daily life.",
          ],
        },
        { kind: "quote", text: "From the Friends & Family Edition" },
        {
          kind: "promptGroup",
          category: "Stories & Growth",
          color: "blueGrey",
          prompts: [
            "Tell me about a friendship or relationship that changed you for the better.",
            "Tell me something you used to be ashamed of that now feels like a strength.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Beliefs & Emotions",
          color: "blush",
          prompts: [
            "Tell me about a time you said yes but you actually wanted to say no.",
            "Tell me about a whisper or instinct that has changed your direction in life.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Friendship & Belonging",
          color: "gold",
          prompts: [
            "Tell me how you know when you're holding something in emotionally.",
            "Tell me what makes you feel deeply supported by friends or loved ones.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Life",
          color: "teal",
          prompts: [
            "Tell me when you last felt truly at ease or content in your own company.",
            "Tell me what helps you feel most grounded when life is hectic.",
          ],
        },
        {
          kind: "promptGroup",
          category: "Family",
          color: "brown",
          prompts: [
            "Tell me about how your family showed you love. Was it in the way you needed?",
            "Tell me one thing you loved about growing up in your family.",
          ],
        },
        { kind: "quote", text: "From Trust & Repair" },
        {
          kind: "promptGroup",
          category: "Return To Trust",
          color: "black",
          prompts: [
            "Tell me what you want trust to feel like.",
            "Tell me what you need right now, that isn't a solution.",
          ],
        },
        {
          kind: "promptGroup",
          category: "The Body's Record",
          color: "blueGrey",
          prompts: [
            "Tell me what your body knows that your mind doesn't want to.",
            "Tell me where you feel safest in your body right now.",
          ],
        },
        {
          kind: "promptGroup",
          category: "The Drift",
          color: "blush",
          prompts: [
            "Tell me when you first felt this drift.",
            "Tell me what we have not talked about that needs to be said.",
          ],
        },
        {
          kind: "promptGroup",
          category: "What I'm Holding",
          color: "gold",
          prompts: [
            "Tell me something you've been carrying alone this week.",
            "Tell me what you've been pretending is fine.",
          ],
        },
        {
          kind: "promptGroup",
          category: "What the World Is Asking",
          color: "teal",
          prompts: [
            "Tell me what you wish men understood right now.",
            "Tell me what feels unsafe in the world right now.",
          ],
        },
        { kind: "quote", text: "The Intimacy & Communication Cards" },
        { kind: "image", src: "/rituals/cards-upsell.jpg", alt: "The Intimacy and Communication Cards" },
        {
          kind: "p",
          text: "Four decks: The Couples Edition, The Family and Friends Edition, The Touch Languages, and Trust & Repair, a 50-card deck for couples navigating a rupture, a distance, or a moment they can't seem to move past.",
        },
        {
          kind: "p",
          text: "Available as an app, so it lives in your pocket, always ready for a quiet evening or moment of connection, and as a physical deck.",
        },
        { kind: "p", text: "Every prompt is designed to open something without forcing it.", emphasis: "accent" },
        {
          kind: "p",
          text: "The cards work in the same structure as The Dyad. One person picks a card and reads it out loud. The other person answers from the heart. One answer per turn. The listener responds with only three things: Thank you. Clarify that. Summarise that. Switch and go deeper with each turn.",
        },
        { kind: "quote", text: "What the Cards Cover" },
        { kind: "p", text: "Emotional Intimacy: questions that reach beneath the surface of daily life." },
        { kind: "p", text: "Physical Sensation: prompts that reconnect you to your body and your partner's." },
        { kind: "p", text: "Desire & Play: invitations to explore what you want and what delights you." },
        { kind: "p", text: "Trust & Repair: 50 dedicated prompts for navigating rupture and distance." },
        { kind: "p", text: "Family & Friends: 150 prompts to get to know your family and friends in a much deeper way, and to be understood." },
        {
          kind: "link",
          text: "Get the full decks →",
          href: "https://feelfullyyou.com/cards",
        },
      ],
    },
    {
      slug: "date-morning",
      order: 15,
      title: "Date Morning",
      eyebrow: "Weekly · 75 minutes",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Not date night, at the end of a day that already took everything. Morning, before the day gets to it.",
        },
        {
          kind: "numberedSteps",
          steps: [
            {
              heading: "Seventy-five minutes",
              text: "No phones, no children, no talking about work.",
            },
            {
              heading: "One of you sets it up",
              text: "That person chooses where it happens, and decides which of the two kinds of date it is this week. The other does not have to think about it at all. That is the gift.",
            },
            {
              heading: "Either a touch date",
              text: "Actual, structured physical touch, agreed in advance, with no sex in it. That is what takes the pressure off, and it is how the wanting comes back. Run it on The 3-Minute Touch Reset, or stay longer if you both want to.",
            },
            {
              heading: "Or somewhere else entirely",
              text: "A picnic somewhere. Something neither of you has done.",
            },
            {
              heading: "Fifteen minutes on one prompt",
              text: "Start with fifteen minutes on one prompt, run as a Dyad. Every prompt you need is in The Dyad.",
            },
            {
              heading: "Two lists",
              text: "Somewhere in it, exchange two lists: ten things you used to love doing as a child, and ten things you love about the other person.",
            },
          ],
        },
        {
          kind: "p",
          text: "Intimacy, and the way you are touched by life, is structured.",
          emphasis: "accent",
        },
      ],
    },
    // ------------------------------------------------------------ monthly
    {
      slug: "monthly",
      order: 16,
      title: "Monthly",
      eyebrow: "Tier three",
      kind: "essay",
      image: "/rituals/note-before.jpeg",
      imageAlt: "Quiet closeness, no hurry in it",
      imageSide: "left",
      body: [
        { kind: "big", text: "The bigger work, and the honest look at how you are doing." },
        {
          kind: "p",
          text: "That is why these ones are monthly: the bigger practices and the review both take real time, and time that is not diarised gets given away.",
        },
        {
          kind: "p",
          text: "Put it in the diary or it will not happen.",
          emphasis: "accent",
        },
      ],
    },
    {
      slug: "the-monthly-check-in",
      order: 17,
      title: "The Monthly Check-In",
      eyebrow: "Monthly · 30 minutes, sitting down",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Most couples only review the relationship when something has already gone wrong.",
        },
        {
          kind: "p",
          text: "This is the version you do while things are fine, which is the only time it is easy.",
          emphasis: "bold",
        },
        { kind: "big", text: "Seven questions, run as a Dyad, one at a time." },
        {
          kind: "p",
          text: "Nobody is arguing a case here. One of you reads a question, the other answers with one honest sentence and stops, and the listener has the same three responses as always: “Clarify that”, “Summarise that”, “Thank you”.",
        },
        {
          kind: "p",
          text: "The mechanic is in The Dyad. Use it exactly as it is written there.",
          emphasis: "accent",
        },
        {
          kind: "promptGroup",
          category: "The monthly seven",
          color: "gold",
          prompts: [
            "TELL ME WHAT’S GOING WELL BETWEEN US RIGHT NOW.",
            "TELL ME WHAT YOU WANT TO ACKNOWLEDGE ME FOR THIS MONTH.",
            "TELL ME WHAT YOU’RE PROUD OF YOURSELF FOR.",
            "TELL ME IF THERE IS ANYTHING UNSAID BETWEEN US.",
            "TELL ME A NEED THAT ISN’T GETTING MET THAT I COULD DO SOMETHING ABOUT.",
            "TELL ME WHAT I COULD DO THIS MONTH TO BE A BETTER PARTNER TO YOU.",
            "TELL ME HOW WE’LL MAKE TIME FOR TOUCH THIS MONTH.",
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Start with what is going well. The order matters more than people expect." },
            { text: "Put the same day of the month in the diary, so neither of you has to be the one who remembers.", emphasis: "accent" },
          ],
        },
      ],
    },
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
      slug: "yes-maybe-no",
      order: 19,
      title: "Yes, Maybe, No",
      eyebrow: "Monthly · 20 minutes",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "Run every kind of touch you can think of past yourself first, then each other.",
        },
        {
          kind: "table",
          headers: ["The light", "What it means"],
          rows: [
            ["Green", "Yes, more of that."],
            ["Amber", "Maybe, depends."],
            ["Red", "No, not there."],
          ],
        },
        { kind: "p", text: "Meh is data.", emphasis: "bold" },
        {
          kind: "p",
          text: "A maybe is not a failure. It is information neither of you had, and it is often the most useful square on the page.",
        },
        {
          kind: "p",
          text: "A no given freely is what makes a yes mean anything.",
          emphasis: "accent",
        },
      ],
    },
    {
      slug: "the-approach",
      order: 20,
      title: "The Approach",
      eyebrow: "Monthly · 10 minutes",
      kind: "ritual",
      image: "/rituals/the-approach.jpeg",
      imageAlt: "One partner walking slowly toward the other",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "Do this when the distance has grown without either of you naming it. Or once a year as a reset.",
        },
        {
          kind: "p",
          text: "This practice reveals something most couples have never consciously noticed: what happens in your body when the person you love actually moves toward you.",
        },
        {
          kind: "p",
          text: "Do you open? Do you brace? Do you lean in, or hold back without realising it?",
          emphasis: "accent",
        },
        {
          kind: "step",
          label: "Step 1, Agree the container",
          lines: [
            { text: "“I am going to walk toward you slowly." },
            { text: "You tell me when to stop, when the distance feels right to you." },
            { text: "There is no wrong answer.”", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 2, Partner A stands still",
          lines: [
            { text: "Feet grounded. Eyes open." },
            { text: "Notice what arises as they approach." },
            { text: "You do not need to do anything except feel.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 3, Partner B walks toward them",
          lines: [
            { text: "One slow step at a time. Pause between each step." },
            { text: "Let the space between you change gradually.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 4, Partner A signals stop",
          lines: [
            { text: "A raised hand. A word." },
            { text: "When the distance feels right, not too close, not too far, exactly as your body wants it.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Step 5, Both notice",
          lines: [
            { text: "What happened in your body as they approached?" },
            { text: "Was there a moment you wanted to open toward them? A moment you wanted them to pause?" },
            { text: "Where did you feel it? Switch roles. Repeat." },
          ],
        },
        {
          kind: "notice",
          lines: [{ text: "Afterwards, one prompt each using the Dyad: Tell me what happened in your body as I moved toward you." }],
        },
      ],
    },
    // ------------------------------------------------------- once a year
    {
      slug: "once-a-year",
      order: 21,
      title: "Once a year",
      eyebrow: "Tier four",
      kind: "essay",
      imageSide: "right",
      body: [
        { kind: "big", text: "Once a year, out loud." },
        {
          kind: "p",
          text: "A year is long enough that you stop noticing what changed, and naming it out loud is how you find out how far you actually came.",
          emphasis: "accent",
        },
      ],
    },
    {
      slug: "the-year-in-the-body",
      order: 22,
      title: "The Year in the Body",
      eyebrow: "Yearly · an hour, somewhere you both like",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "Once a year, an hour, somewhere you both like being. Somewhere that is not the kitchen table you argue logistics at.",
        },
        {
          kind: "p",
          text: "Same mechanic as The Dyad. One reads, the other answers, the listener says “Clarify that”, “Summarise that”, “Thank you”. Four questions is plenty for an hour.",
        },
        {
          kind: "promptGroup",
          category: "The yearly four",
          color: "black",
          prompts: [
            "TELL ME WHAT CHANGED IN US THIS YEAR.",
            "TELL ME WHAT YOUR BODY LEARNED THIS YEAR.",
            "TELL ME WHAT WE SHOULD STOP CARRYING INTO NEXT YEAR.",
            "TELL ME WHAT YOU WANT MORE OF, AND WHEN WE’LL START.",
          ],
        },
        {
          kind: "p",
          text: "Answer the last one with an actual date. A want with a date on it is the only kind that happens.",
          emphasis: "accent",
        },
      ],
    },
    // ------------------------------------------------------------ closing
    {
      slug: "meet-juliette",
      order: 23,
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
    {
      slug: "your-next-yes",
      order: 24,
      title: "Your Next Yes",
      kind: "closing",
      image: "/rituals/your-next-yes.png",
      imageAlt: "Your next yes",
      imageSide: "left",
      body: [
        {
          kind: "big",
          text: "This wasn't just a guide. It was your first soft yes: a yes to clarity, to being heard before you speak, to the kind of touch that doesn't perform, it lands.",
        },
        { kind: "quote", text: "Start with the free Touch Reset Quiz" },
        {
          kind: "p",
          text: "If you haven't taken it yet, five minutes maps your own four-layer stack: your Touch Pattern, your Pleasure Language, your Touch Language, and whether you lead or receive.",
        },
        { kind: "p", text: "It's free, and it's the fastest way to see what you're actually working with.", emphasis: "accent" },
        {
          kind: "link",
          text: "→ Take the Touch Reset Quiz",
          href: "https://feelfullyyou.com/touch-reset-quiz",
        },
        { kind: "image", src: "/rituals/one-touch-photo.jpg", alt: "One Touch" },
        { kind: "quote", text: "One Touch, 7 days, your own hands, entirely private" },
        {
          kind: "p",
          text: "You have the rituals now. They bring touch back into the room. One Touch is where you go underneath them.",
        },
        {
          kind: "p",
          text: "Seven days. Your own hands. Entirely private.",
          emphasis: "bold",
        },
        {
          kind: "p",
          text: "Where you learn to feel your own Touch Pattern in your body before you ask anyone else to meet it. If you cannot yet read your own body, you cannot read what is happening between you and someone else. This is where that literacy begins.",
        },
        { kind: "p", text: "You show up for yourself first. Everything else follows.", emphasis: "accent" },
        { kind: "link", text: "→ One Touch", href: "https://feelfullyyou.com/one-touch" },
      ],
    },
    // ------------------------------------------------------------- the turn
    {
      slug: "where-this-stops",
      order: 25,
      title: "Where this stops",
      eyebrow: "The turn",
      kind: "closing",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "You now have every ritual I use. Nothing held back, nothing behind a price.",
        },
        {
          kind: "p",
          text: "Here is the honest part. These practices work on what happens after you decide to reach. They cannot reach the thing that fires before you decide anything: the half-second where a hand arrives and something in you closes, and you were never consulted.",
        },
        {
          kind: "p",
          text: "If your body is still doing that, no amount of ritual will land, and you will conclude you tried and it did not work.",
        },
        { kind: "big", text: "That is not you failing. That is the wrong order." },
        {
          kind: "bigLink",
          text: "Book a call",
          subtext: "That reflex was learned in contact, and it changes in contact, in a room with someone who can see it happening while it happens. That is what The Touch Reset is. Twelve weeks, live, with me. It starts with a call, with me and not my team, and if it is not right for you I will say so.",
          href: "https://feelfullyyou.com/the-touch-reset",
        },
        {
          kind: "p",
          text: "If you would rather start on your own first, One Touch is seven days, your own hands, entirely private.",
        },
        {
          kind: "link",
          text: "Or start on your own with One Touch",
          href: "https://feelfullyyou.com/one-touch",
        },
      ],
    },
  ],
};
