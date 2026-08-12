// Source of truth: the Google Doc "Communication & Intimacy Reboot Kit"
// (id 1-BlkZq0vsCDPGOgDutt5h_a2Bar201dVkpI9jFtkFdw), read in full, and the
// PDF export "Communication & Intimacy Reboot Kit (2).pdf" (pages 5-13),
// which held the 46 card prompts as designed images the Doc export can't
// carry as text. Both read directly by Claude, 10 Aug 2026. Transcribed
// verbatim per spec R4 (nothing summarised, nothing dropped). Em dashes in
// the source are broken into separate sentences here, a punctuation
// normalisation only, per the house style, never a wording change.
//
// This kit replaces its old delivery (a "make a copy of this Google Doc"
// link on the thank-you page) with a real in-app collection, same pattern
// as The Unspoken Distance / 10 Touch Rituals. See specs/communication-reboot-kit.md.
//
// Two pieces of this kit are NOT static content and do not live in this
// file: the 31-day AM/PM tracker and the reflection journal. Both are
// real, persisted, interactive features — see
// app/practice/communication-reboot-kit/tracker/page.tsx and
// .../journal/page.tsx, and lib/entitlements/tracker.ts / journal.ts.

import { ContentBlock } from "./blocks";
import { PracticeEntry, PracticeCollection } from "./ten-touch-rituals";

// Spec R8 / E7: single constant, not hardcoded in more than one place.
export const REBOOT_PLAYLIST_URL =
  "https://tidal.com/playlist/a5040664-341e-4aac-9e24-099eb04dc2d2";
export const REBOOT_PLAYLIST_STATEMENT =
  "I came off Spotify. It doesn't pay artists fairly, and its founder is funding a company that builds weapons for genocide. I won't be associated with that. This playlist lives on Tidal instead.";

// The Drive copy this used to point at (1H9glMx7rnAkzwMFMxlBE9UDEvJH2bOu7) is
// dead, confirmed 11 Aug 2026 (Drive returns "the file you have requested
// does not exist"). Touch Base already has a real, working, canonical video
// live elsewhere in this app on YouTube — app/practice/touch-base/page.tsx,
// sourced from feelfullyyou.com/touch-base-anchor — so this points at that
// same video instead of a second, separately-uploaded Drive copy.
const TOUCH_BASE_YOUTUBE_ID = "qWaZ3rk0His";
const MINI_DYAD_VIDEO_URL =
  "https://drive.google.com/file/d/1fs-hgIeJwX7NFsqxLvBYEi38i0oOhN0K/view?usp=sharing";

// Spec R11 Appendix, verbatim. Cards 16 and 46 are the couples/solo
// phrasing of the same closing integration prompt, both included.
export const REBOOT_KIT_CARDS: string[] = [
  "Tell me what intimacy feels like to you in your body.",
  "Tell me about one moment with me that still has you smile. What do you feel in your body recalling this now?",
  "Tell me what I can do that helps you soften into feeling safe.",
  "Tell me what scares you about touch, and what excites you.",
  "Tell me the kind of touch that lingers long after it's over.",
  "Tell me about a time that touch didn't feel right for you, and why.",
  "Tell me what you secretly wish more of between us.",
  "Tell me the part of your body that most wants to be celebrated and why.",
  "Tell me how your hands ache to explore me.",
  "Tell me something playful you've secretly wanted to try with me, but haven't said out loud yet.",
  "Tell me what you dream our intimacy could look like a year from now.",
  "Tell me about a ritual, big or small, you wish was part of our relationship.",
  "Tell me something you admire about how I love you or how we are together.",
  "Tell me about a time you felt seen, understood, or cherished by me.",
  "Tell me what you most love about yourself right now.",
  "Tell me a win, insight or learning about doing this experience together.",
  "Tell me what intimacy with yourself looks and feels like.",
  "Tell me what touch means to you when no one else is involved.",
  "Tell me a moment when someone's touch felt wrong, and how your body remembers it now. How can I best support you when this comes up?",
  "Tell me what helps your body feel safe enough to open.",
  "Tell me how your body longs to be touched today.",
  "Tell me what you're hungry for having more of in your own life.",
  "Tell me which part of your body surprises you with pleasure.",
  "Tell me how you most want to touch yourself when you're not rushing.",
  "Tell me one small way you could be gentler with yourself this week.",
  "Tell me what a new self-care ritual could look like if it was all about pleasure and ease.",
  "Tell me where in your body or in your life you feel lightest right now.",
  "Tell me what you would say to your own body if you could write it a love letter today.",
  "Tell me what you wish you could gift yourself, an experience, an insight, or simply a feeling.",
  "Tell me how you most want to feel when you wake up tomorrow, and what might help.",
  "Tell me something you've never said because you didn't want to change. How I, or your partner, sees you.",
  "Tell me about a moment you wanted more closeness, but didn't know how to ask.",
  "Tell me what your family still doesn't quite \"get\" about who you are now.",
  "Tell me a part of you that feels most alive in this relationship, and one that feels a little forgotten.",
  "Tell me about a tradition you secretly loved, or secretly loathed, growing up.",
  "Tell me one story from your childhood that shaped how you see love.",
  "Tell me one part of your body you're learning to love and what helps.",
  "Tell me one part of your body you feel real pride in. How do you care for it?",
  "Tell me something you used to chase that no longer feels important.",
  "Tell me what makes a day feel meaningful to you now.",
  "Tell me one way you protect your peace.",
  "Tell me how your body lets you know it feels safe with someone.",
  "Tell me something you used to hide because you thought it made you weak, but now see differently.",
  "Tell me what belief about yourself is starting to soften.",
  "Tell me what emotion you find hardest to witness in others, and how it lands in you.",
  "Tell me what is a win, insight or learning you've had about this experience.",
];

const welcome: PracticeEntry = {
  slug: "welcome",
  order: 0,
  title: "Welcome to The Communication Reboot Kit",
  eyebrow: "For couples ready to gently open the conversation around intimacy",
  kind: "essay",
  image: "/reboot-kit/hero.png",
  imageAlt: "Communication & Intimacy Reboot, the real cover from the kit",
  imageSide: "left",
  body: [
    { kind: "p", text: "For couples ready to gently open the conversation around intimacy. Without drama, awkwardness, or therapy." },
    { kind: "big", text: "If you're here, you've already taken the bravest step. Admitting something's quietly missing and that your connection could feel more alive." },
    { kind: "quote", text: "That's not a crisis. It's the start of real change." },
    { kind: "p", text: "Maybe life together is \"fine,\" but intimacy, affection, or easy closeness feels flat or rare. Maybe it's hard to talk about, or nothing you've tried has really solved it." },
    { kind: "p", text: "You aren't broken. Neither is your relationship.", emphasis: "bold" },
    { kind: "p", text: "This kit isn't about \"fixing.\" It's about making space for something you quietly want more of." },
    { kind: "p", text: "This is your go-to. A pressure-free, achievable beginning for couples who want to say, \"Let's talk about what could feel better for both of us.\"" },
    {
      kind: "step",
      label: "What's inside",
      lines: [
        { text: "Bite-sized scripts and invitations for starting an honest, positive conversation about intimacy. No blame, no awkwardness." },
        { text: "The Soft Start toolkit: support for re-entering togetherness gently, so both partners feel safe, not put on the spot." },
        { text: "The simple Touch Base™ anchor, a body-based reset move so anyone can feel comfortable and present. Making every conversation easier." },
      ],
    },
    {
      kind: "why",
      lines: [
        { text: "You don't need a big reinvention: **just curiosity and a safe place to start.**" },
        { text: "Each prompt, script, and tool is designed for couples who want to move past feeling distant or stuck, and **try a new, honest way of reconnecting.**" },
        { text: "**Take it one step at a time.** Pick a single prompt or script when you're ready, or just listen together." },
        { text: "Every \"yes\" here is an invitation, never a requirement.", emphasis: "accent" },
        { text: "This kit is your gentle launchpad: no performance, but **a safe return to what makes relationships feel real and nourishing.**" },
      ],
    },
    {
      kind: "step",
      label: "Outcomes",
      lines: [
        { text: "Discover a safe, simple way to start talking about what's missing: **without drama or difficult \"talks.\"**" },
        { text: "Begin rebuilding closeness and desire gently, with actionable prompts and quick wins." },
        { text: "Experience how even one open moment can make it easier to reconnect: without needing therapy or a huge transformation." },
      ],
    },
    { kind: "quote", text: "Pick one tool at a time. Take it slow." },
    { kind: "p", text: "This isn't about fixing anything. It's about making space for what really matters, one small **\"yes\"** at a time." },
    { kind: "quote", text: "Welcome inside. This is your first, doable step into a new kind of intimacy and real communication." },
    { kind: "p", text: "The journey doesn't begin in your head. It begins with simple communication into intimacy." },
    { kind: "signature", src: "/reboot-kit/signature.png", alt: "Love Always, Juliette (signature)" },
    { kind: "p", text: "Host of The Scrumptious Woman® Podcast." },
    { kind: "p", text: "Featured in Forbes, Cosmopolitan, The Telegraph, The Times, FOX, CBS and more." },
  ],
};

const startHere: PracticeEntry = {
  slug: "start-here",
  order: 1,
  title: "Start Here",
  eyebrow: "Your starting pieces",
  kind: "essay",
  image: "/reboot-kit/start-here.png",
  imageAlt: "Start Here: Your Communication & Intimacy Reboot Pathway, the real page from the kit",
  imageSide: "left",
  body: [
    { kind: "p", text: "These are your starting pieces. Specially designed to make opening up and reconnecting feel safe, grounded, and truly doable." },
    { kind: "p", text: "Move through them in order, or just choose the first step that feels easiest for you right now." },
    {
      // Real design (checked directly against Juliette's own per-tab PDF
      // export, 12 Aug 2026): this is a numbered circle-icon step flow,
      // 1 through 6, not a flat card list. Matches the `diagram` block's
      // never-skip rule in this app's own CLAUDE.md, missed on the first
      // pass here the same way it was missed on 10 Touch Rituals and The
      // Unspoken Distance before it.
      kind: "diagram",
      steps: [
        {
          heading: "Touch Base™ Video",
          text: "Begin with a simple, powerful kinesthetic gesture to ground your body in safety and presence, before any conversation or touch. This transforms nerves into calm and sets the foundation for true connection.",
        },
        {
          heading: "The Soft Start Conversation Kit",
          text: "Use gentle, swipe-and-go scripts to invite your partner in, without turning it into \"a thing.\" These make it safe and easy to say, \"Can we talk?\" or \"Let's reconnect,\" no matter how long it's been.",
        },
        {
          heading: "Open the Conversation",
          text: "Move beyond surface talk into deeper emotional intimacy, safety, and honesty. These conversation openers are built to gently reveal what's quietly missing or deeply wanted, without pressure or overthinking.",
        },
        {
          heading: "The Connection and Intimacy Cards",
          text: "Forty-six communication and intimacy prompts to help you speak from the heart, not just the head. Let these cues guide you to the words you didn't know how to say, or to questions that create understanding in minutes.",
        },
        {
          heading: "Mini Dyad Instruction Video",
          text: "A quick, supportive guide so you can feel confident using the cards and prompts, even if this is all new. No stress, just small wins.",
        },
        {
          heading: "The Touch Reconnection Playlist",
          text: "Curated music to support presence, play, and connection.",
        },
      ],
    },
    { kind: "quote", text: "Leading toward intimacy." },
    { kind: "p", text: "Everything in this kit is about curiosity, honest conversation, and bringing warmth back to your connection. One gentle, meaningful step at a time." },
  ],
};

const touchBase: PracticeEntry = {
  slug: "touch-base",
  order: 2,
  title: "The Touch Base™ Video",
  eyebrow: "A tiny gesture. A massive shift.",
  kind: "essay",
  image: "/reboot-kit/touch-base.jpg",
  imageAlt: "Touch Base, the real branded banner from the kit",
  imageSide: "left",
  body: [
    { kind: "p", text: "This short video introduces you to the Touch Base™ cue. A discreet, powerful physical anchor that signals to your body: \"I'm here. I'm safe. I can stay.\"" },
    { kind: "p", text: "It's the foundational cue I teach all my private clients, including those navigating phobias, trauma, sudden shutdowns, or a tendency to leave their body the moment touch feels like too much." },
    { kind: "p", text: "Because this isn't just about touch. It's about helping your system feel safe enough to receive it." },
    {
      kind: "step",
      label: "What it does",
      lines: [
        { text: "A simple technique to practise before offering or receiving touch, especially when things feel rushed, disconnected, or performative." },
        { text: "Anchors your breath, your body, and your attention, without needing to say a word." },
        { text: "Creates a full-body \"pause\" moment, where safety can override survival." },
        { text: "So discreet you can use it in bed, at dinner, mid-argument, or before intimacy." },
      ],
    },
    { kind: "youtube", videoId: TOUCH_BASE_YOUTUBE_ID, label: "Watch the Touch Base™ video" },
    {
      kind: "why",
      lines: [
        { text: "Touch Base activates pressure points that, when paired with **slowness, breath, and focus**, downregulate the stress response." },
        { text: "You're gently retraining your system to signal: \"There's no tiger. I don't have to brace. I'm safe to feel this.\"" },
        { text: "It might feel silly at first. That's totally normal. This soft, slow gesture becomes a kind of invisible safety blanket. Your partner won't even notice. But your body will.", emphasis: "accent" },
      ],
    },
    { kind: "p", text: "Your body is always scanning. Especially if you're a woman, or were socialised as one, your subconscious is constantly asking: \"Is it safe to soften here? Is it safe to let go?\"" },
    { kind: "p", text: "All it takes is one loaded moment. A look. A brush. A hand that lingered where it shouldn't have. And your body registers it. You might not even remember when. But your system does. It braces." },
    { kind: "p", text: "And often, even in loving relationships, this is why touch doesn't land. Not because you don't want to receive it. Because your body's still armoured, just in case." },
    { kind: "p", text: "This gesture interrupts that loop without drama. No need for emotional excavation. No need to explain yourself mid-connection.", emphasis: "bold" },
    { kind: "quote", text: "Touch Base™, the cue that brings your body back to yes." },
    {
      kind: "step",
      label: "How",
      lines: [
        { text: "Just your thumb and forefinger." },
        { text: "Soft like melted chocolate." },
        { text: "Slow, like honey. Slower than that. Even slower than you think slow is." },
        { text: "This is where the shift begins. It rewires the moment. Interrupts the bracing. Reminds your body that it's safe to stay, to feel, and to receive.", emphasis: "bold" },
      ],
    },
    { kind: "p", text: "Clients use this everywhere. At work. On planes. In bed. Before difficult conversations." },
    { kind: "p", text: "One woman who had a lifelong fear of flying used this gesture mid-takeoff. It was the first time she stayed present in her body, rather than dissociating." },
    { kind: "p", text: "Another used it to anchor herself during touch with her partner, after years of feeling like she \"left\" her body the moment things became intimate." },
    { kind: "p", text: "This is the cue that quietly tells your body: \"You're here. You're safe. You don't have to run.\"", emphasis: "accent" },
    { kind: "p", text: "Once you feel what it does, you'll return to it again and again. Not because it's flashy. Because it works." },
    {
      kind: "why",
      lines: [
        { text: "Make it stick. The 31-day Touch Base™ practice.", emphasis: "bold" },
        { text: "Watching the video is a beautiful start. Repetition is what rewires." },
        { text: "When you practise the Touch Base™ cue consistently, even just a few minutes a day, you create a new default in your body. Presence becomes easier. Safety becomes familiar. Connection stops feeling like work." },
        { text: "Science shows that repetition forms new neural pathways. When you pair breath, attention, and a physical anchor, you train your system to associate the gesture with safety, stillness, and connection. Ninety days for it to become embodied, real mastery, muscle memory." },
        { text: "You only need six minutes a day. That's it. Everyone has six minutes. Split it up into three minutes, twice a day." },
      ],
    },
    {
      kind: "step",
      label: "How to practise",
      lines: [
        { text: "Set an alarm twice a day, morning and afternoon or evening." },
        { text: "When it goes off, pause." },
        { text: "Do the kinesthetic Touch Base™ gesture slowly, with breath, for two minutes or a bit longer." },
        { text: "Before: rate how you feel, one to ten." },
        { text: "After: rate again. What shifted? What did you notice?" },
      ],
    },
    { kind: "p", text: "This isn't about doing it perfectly. It's about meeting yourself gently, consistently, in the moments that matter most." },
    { kind: "p", text: "Soon you will be \"just tapping\" your fingers together when a car cuts in front of you, when your children are getting to you, or when you are noticing yourself drifting from the present moment." },
    { kind: "quote", text: "Your 31-day tracker is ready and waiting below." },
    { kind: "link", text: "Open your tracker →", href: "/practice/communication-reboot-kit/tracker" },
  ],
};

const playlist: PracticeEntry = {
  slug: "touch-playlist",
  order: 3,
  title: "The Touch Reconnection Playlist",
  eyebrow: "Music as a bridge to presence",
  kind: "essay",
  image: "/reboot-kit/touch-playlist.png",
  imageAlt: "The Touch Reconnection Playlist, the real banner from the kit",
  imageSide: "left",
  body: [
    { kind: "p", text: "**Music is a bridge to presence**, and this curated playlist supports you in softening into sensation." },
    {
      kind: "step",
      label: "How to use it",
      lines: [
        { text: "Designed for intimate communication, touch sessions, connection rituals, or slow solo exploration." },
        { text: "Tracks that soothe the nervous system, invite breath, and melt tension. Use during a dyad, while setting the space, or when cuddling up close." },
        { text: "You don't need words. Let the music carry you into your body." },
      ],
    },
    // The real screenshot of the actual Tidal playlist, plus a QR code
    // generated fresh against REBOOT_PLAYLIST_URL (not a reused image of
    // the doc's own QR, so it can never point at a stale link).
    { kind: "image", src: "/reboot-kit/playlist-mockup.png", alt: "The real Touch Reboot Kit playlist on Tidal, 44 tracks" },
    { kind: "link", text: "Open the Touch Reboot playlist on Tidal →", href: REBOOT_PLAYLIST_URL },
    { kind: "image", src: "/reboot-kit/playlist-qr.png", alt: "QR code to open the Touch Reconnection Playlist" },
    { kind: "notice", lines: [{ text: REBOOT_PLAYLIST_STATEMENT }] },
  ],
};

const softStart: PracticeEntry = {
  slug: "soft-start-conversation-kit",
  order: 4,
  title: "The Soft Start Conversation Kit",
  eyebrow: "For when you want to invite your partner in",
  kind: "essay",
  image: "/reboot-kit/soft-start.jpg",
  imageAlt: "The Soft Start Conversation Kit, the real banner from the kit",
  imageSide: "left",
  body: [
    { kind: "p", text: "For when you want to invite your partner in, without pressure, performance, or a \"talk.\"" },
    { kind: "p", text: "You've found something beautiful. A gentle way to open up conversations that matter. The hardest part is often just inviting your partner in, without making it feel like something's wrong or uncomfortable." },
    { kind: "p", text: "This is your Soft Start Conversation Kit. Gentle scripts, swipe copy, and suggested phrases to help you invite your partner into a new dialogue without turning it into \"a big thing,\" express what you're quietly longing for with no blame or pressure, and set the tone for emotional intimacy that feels open, supportive, and warm." },
    { kind: "p", text: "Use these as inspiration. Make them sound like you. The power is in being kind, honest, and clear about what you'd love to experience together." },
    { kind: "image", src: "/reboot-kit/soft-start-shelf.jpg", alt: "A quiet bookshelf, the section break from the real kit" },
    { kind: "quote", text: "Text message swipe files. For when you want to open the door." },
    {
      kind: "promptGroup",
      category: "Soft and curious",
      color: "blush",
      prompts: [
        "Hi love, I got us this Communication & Intimacy toolkit. Would you try a few gentle prompts with me? No pressure, just a chance for us both to check in and maybe feel closer.",
        "I found something that's all about easy, honest conversations and it made me think about us. Want to try it together, just one quick card prompt?",
        "Can we try a little \"us\" time this week with a few simple questions from a kit I bought? I think it could be warm and easy.",
      ],
    },
    {
      kind: "promptGroup",
      category: "Cheeky and playful",
      color: "blush",
      prompts: [
        "Guess what, I bought us a \"mini game\" for relationship reconnection. Let's play a few card prompts and see what happens!",
        "I picked up something fun, think curiosity, not awkwardness. Want to test out a couple of conversation starters with me tonight?",
        "You up for a connection mini-challenge? I got a kit of prompts and I bet we'll laugh and learn something sweet.",
      ],
    },
    {
      kind: "promptGroup",
      category: "Tender and grounded",
      color: "blush",
      prompts: [
        "I want us to feel emotionally close again. I found a gentle kit that helps with conversation. Would you be open to trying it together?",
        "Miss our heart-to-heart talks. I got a guide that eases us into honest, safe conversation. Maybe we could try one tonight?",
        "There's so much I appreciate about us, and I think this toolkit could help us share even more. Can we explore it together, one prompt at a time?",
      ],
    },
    { kind: "notice", lines: [{ text: "Pro tip: keep the tone light. Let your partner feel like this is something for your connection, not a fix." }] },
    { kind: "quote", text: "In-person starters. For when you're face to face, and want to bring it up with heart." },
    {
      kind: "promptGroup",
      category: "Face to face",
      color: "blush",
      prompts: [
        "Would you try a couple of these toolkit prompts with me? I think they're designed to help us talk, no pressure, just a gentle check-in.",
        "Found a resource that makes it easy for couples to talk about what matters, in a light way. Want to give it a try when we have a moment?",
        "Can we pick a card or prompt from the kit tonight? I'd love to know what you're feeling and share what's been on my mind in a gentle way.",
      ],
    },
    {
      kind: "step",
      label: "Before you invite them in",
      lines: [
        { text: "Have I tried one or two prompts myself, to feel confident?" },
        { text: "Am I regulated and calm? A breath or Touch Base™ always helps." },
        { text: "Is my tone open and curious, not critical?" },
        { text: "Is the timing right, not rushed or stressed?" },
      ],
    },
    {
      kind: "step",
      label: "How to set the mood",
      lines: [
        { text: "Light a candle or set the scene, then ask: \"Want to try something gentle together?\"" },
        { text: "Leave the printed cards visible with a casual note: \"This looked fun, should we try one?\"" },
        { text: "Relax together with music from the playlist, then simply start with a kind question." },
      ],
    },
    {
      kind: "why",
      lines: [
        { text: "Reminders for yourself.", emphasis: "bold" },
        { text: "You're allowed to invite, not demand." },
        { text: "This isn't about fixing, just about being together." },
        { text: "One real moment of openness can shift everything.", emphasis: "accent" },
      ],
    },
    { kind: "p", text: "You don't need a perfect moment. Just a simple, honest invitation. Send the message, share the prompt, and let connection unfold gently." },
    { kind: "quote", text: "Just the invitation itself is intimacy." },
    { kind: "p", text: "Ready to invite them in? Pick your favorite phrase and start the conversation. The toolkit will guide the rest." },
  ],
};

const cards: PracticeEntry = {
  slug: "communication-and-intimacy-cards",
  order: 5,
  title: "The Communication and Intimacy Cards",
  eyebrow: "Authentic cards and prompts for deeper intimacy",
  kind: "essay",
  image: "/reboot-kit/hero.png",
  imageAlt: "Communication & Intimacy Reboot",
  imageSide: "left",
  body: [
    { kind: "p", text: "Solo or shared. In a world of constant distraction, real connection, both with ourselves and with those we love, has become rare. We talk. We text. We share memes. But how often do we truly feel each other?" },
    { kind: "p", text: "Deep down, most of us are longing for something simple. **To be seen. To be heard. To feel understood.**" },
    { kind: "p", text: "These cards and prompts invite you back into what's real, for honest intimacy with your partner, or deeper reflection with yourself." },
    { kind: "p", text: "Rooted in the powerful Dyad Technique, this is more than just conversation. **It's an experience.** A way to drop the walls, strip back the performance, and meet what's really there." },
    { kind: "p", text: "Not the polished version. Not the overthinking. Just what's true.", emphasis: "bold" },
    { kind: "quote", text: "This isn't therapy. It's not a \"fix.\" It's presence. Precision. And a whole lot of tenderness." },
    {
      kind: "step",
      label: "Solo use",
      lines: [
        { text: "Choose a card." },
        { text: "Set a ten-minute timer." },
        { text: "Respond, either by writing it down or speaking aloud." },
        { text: "You don't need to \"get it right.\" Just show up honestly, no need for it to be polished or beautiful, only true." },
      ],
    },
    {
      kind: "step",
      label: "Couple / shared use",
      lines: [
        { text: "Choose a card below." },
        { text: "Partner A asks. Partner B answers honestly, without interruption or fixing." },
        { text: "When the answer lands, Partner A simply says: \"Thank you.\" If something isn't clear: \"Can you clarify that?\" is all you need." },
        { text: "Switch roles. Now Partner B asks, Partner A responds." },
      ],
    },
    { kind: "notice", lines: [{ text: "No obligation to keep discussing. Check in: \"Would you be open to sharing more about that?\" Let every invitation be optional." }] },
    { kind: "image", src: "/reboot-kit/juliette-video.png", alt: "Juliette introducing the Mini Dyad Instruction video" },
    { kind: "driveVideo", url: MINI_DYAD_VIDEO_URL, label: "Watch the Mini Dyad Instruction video" },
    { kind: "big", text: "The 46 prompts" },
    { kind: "p", text: "Choose one at a time, the way you would with the real deck. Not a list to scroll through, a card to sit with." },
    { kind: "link", text: "Open the cards →", href: "/practice/communication-reboot-kit/cards" },
    {
      kind: "why",
      lines: [
        { text: "What this unlocks.", emphasis: "bold" },
        { text: "Deeper presence and trust." },
        { text: "Emotional safety, without oversharing." },
        { text: "The ability to be honest, even when it's hard." },
        { text: "A shared practice that builds connection, intimacy, and truth." },
      ],
    },
    { kind: "p", text: "Whether you're using this with a partner, or with the only person you're guaranteed to spend your whole life with, you, these prompts are here to guide you home." },
    { kind: "p", text: "So often, we rush through powerful moments without pausing to capture what they gave us. But when we slow down to reflect, to notice the words that landed, the feelings that moved through, the truth that surfaced, we integrate on a deeper level." },
    { kind: "p", text: "This isn't just about connection in the moment. It's about anchoring what you're learning so it becomes part of how you live, relate, and receive." },
    { kind: "notice", lines: [{ text: "To integrate, always ask this prompt: \"Tell me what is a win, insight or learning you've had about this experience.\"", emphasis: "bold" }] },
    { kind: "link", text: "Answer it in your journal →", href: "/practice/communication-reboot-kit/journal" },
    {
      kind: "why",
      lines: [
        { text: "Want more?", emphasis: "bold" },
        { text: "Love this practice? There's an entire collection waiting for you." },
        { text: "The Communication & Intimacy Prompt Card Collection is a beautifully designed bundle of five themed decks created to deepen connection across every part of your life. Romantic Relationships. Beliefs & Emotions. Sex. Family. Life." },
        { text: "These aren't just conversation starters. They're connection catalysts. Perfect for couples, friends, family, or as a solo reflection tool when you want to meet yourself more deeply." },
      ],
    },
    { kind: "image", src: "/reboot-kit/card-fan.png", alt: "The full Communication & Intimacy Prompt Card Collection, five themed decks" },
    { kind: "link", text: "See the full card collection →", href: "https://feelfullyyou.com/cards" },
  ],
};

const finalWords: PracticeEntry = {
  slug: "final-words",
  order: 6,
  title: "The Final Words, for Now",
  eyebrow: "You're in the perfect place for your next step",
  kind: "closing",
  image: "/reboot-kit/final-words.png",
  imageAlt: "In Touch Taster Audit, the real closing banner from the kit",
  imageSide: "left",
  body: [
    { kind: "p", text: "Something in you knew. There has to be more than this: **more warmth, presence, and honest connection.**" },
    { kind: "p", text: "You listened to that quiet instinct." },
    { kind: "p", text: "What you've discovered here isn't just a spark to reignite: **it's the foundation for recognising intimacy in everyday moments.**" },
    { kind: "p", text: "You've got the tools now, inside this kit, and already within yourself." },
    { kind: "p", text: "Curiosity, courage, and even the willingness to wonder \"what else is possible?\"", emphasis: "bold" },
    { kind: "p", text: "That alone changes everything." },
    { kind: "p", text: "If you're feeling the gentle hum, that \"yes\" to more, **you're in the perfect place for your next step.**" },
    { kind: "p", text: "It's about learning to recognise the spark in everyday moments: a lingering touch.", emphasis: "accent" },
    {
      kind: "why",
      lines: [
        { text: "Your next invitation: the In Touch Taster Audit.", emphasis: "bold" },
        { text: "Connection builds slowly. Not through pushing, not through performance, but through presence meeting presence." },
        { text: "These prompts are designed to invite you back into yourself, one breath, one truth, one felt moment at a time." },
        { text: "When something stirs, a tightness in your throat, a subtle ache under your ribs, a recognition that your body trusts this work enough to soften, you do not need to walk it alone." },
      ],
    },
    { kind: "p", text: "The In Touch Taster Audit is a 25 minute private space to pause, breathe, let what is rising have space to be named, practise truth in connection rather than isolation, and feel the difference between performing intimacy and receiving it." },
    { kind: "p", text: "We will Touch Base, sit in presence, and follow sensation rather than strategy. You leave with clarity, softness, and your feet back inside your life, not outside watching yourself live it." },
    { kind: "p", text: "If your body exhales at the idea of that, follow it." },
    { kind: "link", text: "Book your In Touch Taster Audit →", href: "https://tidycal.com/juliette2/in-touch-audit" },
    { kind: "p", text: "If you prefer to listen, to stay in this yes frequency, tune into The Scrumptious Woman® Podcast. Stories. Secrets. Sensual truths that bring you closer to yourself." },
    { kind: "quote", text: "Your journey is just beginning. I'm excited for you." },
    { kind: "signature", src: "/reboot-kit/signature.png", alt: "Love Always, Juliette (signature)" },
  ],
};

export const communicationRebootKit: PracticeCollection = {
  slug: "communication-reboot-kit",
  title: "The Communication Reboot Kit",
  subtitle: "Words that open what has been quietly waiting to be said.",
  byline: "By Juliette Karaman",
  heroImage: "/reboot-kit/hero.png",
  unlockMode: "free-browse",
  entries: [welcome, startHere, touchBase, playlist, softStart, cards, finalWords],
};
