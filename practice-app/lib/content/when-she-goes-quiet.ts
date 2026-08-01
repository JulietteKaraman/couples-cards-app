// Source of truth: the real 15-page PDF "When She Goes Quiet" — a men's
// guide by Juliette Karaman, transcribed verbatim page by page. Page 1 is
// the cover only (used as heroImage, not a separate entry). Pages 2-15
// become the 14 entries below. Nothing summarised, nothing dropped.
//
// Obvious PDF-text-extraction artifacts (broken mid-word wraps, stray
// spaces before punctuation) were silently cleaned up as part of
// transcription; no wording, claim, or mechanic was changed or added.
// Several ALL-CAPS emphasis headings in the source PDF are rendered here
// in normal sentence case with bold/accent emphasis instead, matching the
// house style already used in the-unspoken-distance.ts.
//
// No price appears anywhere in this file, per Juliette's explicit rule
// that guide content should never need an edit when an offer price
// changes. The source PDF's closing page named a price for the Trust and
// Repair card set (fifty cards, priced) — that number is intentionally
// dropped here; only the set's name and a link remain.
//
// This guide has no per-entry interior photography, only the cover
// (public/when-she-goes-quiet/hero.jpg, used as heroImage). Per the
// convention already established in the-unspoken-distance.ts: a missing
// image is honest, a reused one reads as a mistake — so no entry below
// sets `image`/`imageAlt`, including the first.
//
// "Meet Juliette" (the final entry) mirrors the structure/blocks of
// the-unspoken-distance.ts's own "Meet Juliette" closing entry (stats
// block, modality line, links), populated with the bio content and
// figures actually given on this guide's page 15 (27 years of learning,
// fifteen years with couples, Top 2.5% podcast) rather than reusing that
// file's own stats.

import { ContentBlock } from "./blocks";
import { PracticeEntry, PracticeCollection } from "./ten-touch-rituals";

export const whenSheGoesQuiet: PracticeCollection = {
  slug: "when-she-goes-quiet",
  title: "When She Goes Quiet",
  subtitle: "For men who love women they can no longer reach.",
  byline: "By Juliette Karaman",
  heroImage: "/when-she-goes-quiet/hero.jpg",
  unlockMode: "free-browse",
  theme: "dark",
  entries: [
    // ------------------------------------------------------------- intro
    {
      slug: "before-we-begin",
      order: 0,
      title: "Her Withdrawal Is Not a Verdict on You.",
      eyebrow: "Before We Begin",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "Read that again if you need to.", emphasis: "bold" },
        { kind: "p", text: "You are not reading this because you stopped caring. You are reading this because she has gone somewhere you cannot follow, and everything you have tried to bring her back has made the gap wider." },
        { kind: "p", text: "That is one of the most disorienting things a man can experience." },
        {
          kind: "table",
          headers: ["What You Do", "What Happens"],
          rows: [
            ["You reach for her.", "She stiffens. You give her space and she seems to go further."],
            ["You ask what's wrong.", "She says nothing. You stop asking and she says you don't care."],
            ["You try to be close.", "She goes quiet. You leave her alone and nothing changes."],
          ],
        },
        { kind: "p", text: "You did not come here for someone to tell you she is wrong, or that you are." },
        { kind: "p", text: "You came here because you want to understand what is actually happening, and what you can do about it.", emphasis: "accent" },
        { kind: "p", text: "This guide is for that." },
      ],
    },
    {
      slug: "what-shes-not-saying",
      order: 1,
      title: "What She's Not Saying",
      kind: "essay",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most women did not wake up one day and decide to leave.", emphasis: "bold" },
        { kind: "p", text: "The withdrawal happened slowly. In small moments that felt ordinary at the time." },
        { kind: "p", text: "A touch that came at the wrong moment. A conversation that went sideways. An evening she reached for connection and found the TV instead. A year of being heard but not understood." },
        { kind: "p", text: "She learned to stop expecting to be met." },
        { kind: "p", text: "Not because she stopped wanting you. Because the wanting became painful. Easier to dim than to keep reaching for something that kept missing.", emphasis: "bold" },
        { kind: "p", text: "By the time you noticed the distance, she had already been managing it alone for a long time. That is not an accusation. You did not do this with intention. Neither did she." },
        { kind: "p", text: "It is what happens when two people who love each other stop being able to hear what the other one is actually saying.", emphasis: "accent" },
        {
          kind: "diagram",
          steps: [
            { heading: "Small Moments", text: "Ordinary at the time, a missed touch, a sideways conversation." },
            { heading: "Repeated Misses", text: "She reached for connection and found absence instead." },
            { heading: "Quiet Management", text: "She began carrying the distance alone, long before you noticed." },
            { heading: "The Gap Widens", text: "By the time it's visible, it has been growing for a long time." },
          ],
        },
      ],
    },
    {
      slug: "the-translation",
      order: 2,
      title: "The Translation",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "Here is what she has been saying, and what she has meant. Read this slowly." },
        { kind: "p", text: "Not to defend yourself. Not to feel guilty." },
        { kind: "p", text: "To understand something you were never taught to see.", emphasis: "accent" },
        {
          kind: "table",
          headers: ["What She Said", "What She Actually Meant", "What You Probably Did"],
          rows: [
            ["“I'm fine.”", "I'm not. But I don't feel safe enough to say it.", "Believed her. Or pushed. Neither helped."],
            ["“Can we slow down?”", "I'm about to shut down. I need presence, not pressure.", "Slowed down physically but not emotionally."],
            ["“I don't know what I want.”", "I haven't had enough space to feel what I want yet.", "Tried to figure it out for her."],
            ["“I'm tired.”", "I want closeness. Not sexual expectation.", "Heard rejection. Pulled back."],
            ["“It's not a big deal.”", "It is. But I've learned to dim it.", "Moved on. She filed it away."],
            ["“Whatever you want.”", "I have a preference. I don't trust it's safe to say it.", "Made the decision. She felt unseen."],
            ["“Maybe later.”", "Right now isn't a yes. I'd like to be asked again.", "Didn't ask again."],
            ["“Don't worry about it.”", "It matters. But I've stopped expecting to be heard.", "Didn't worry about it."],
            ["“We should go away sometime.”", "I am craving time that is just ours. Please plan it.", "Said yes, sometime. It never happened."],
            ["“Nothing's wrong.”", "Something is wrong. But I don't have the words yet.", "Felt relieved. She felt more alone."],
          ],
        },
        { kind: "p", text: "Stay with the one that lands most. Not to apologise. Just to notice." },
        { kind: "p", text: "That gap between what she said and what she meant is where connection has been going quiet, for longer than either of you knew.", emphasis: "accent" },
      ],
    },
    {
      slug: "reading-her-body",
      order: 3,
      title: "Reading Her Body",
      kind: "essay",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most men are never taught this." },
        { kind: "p", text: "Her body was telling you before she had the words. It has been telling you all along.", emphasis: "bold" },
        {
          kind: "diagram",
          steps: [
            { heading: "The Jaw", text: "A slight tightening mid-conversation. She is holding something back that she has decided is not safe to say." },
            { heading: "The Shoulders", text: "They lift and draw forward. She is making herself smaller, the body creates a barrier before the mind has made any decision." },
            { heading: "The Back", text: "Rigidity where softness used to be. She used to settle into a room. Now she holds herself upright, alert, ready to manage whatever comes." },
            { heading: "The Breath", text: "Shallow and high, staying in the chest. When the body feels safe, the breath drops. When it does not, it stays up." },
            { heading: "The Gaze", text: "She looks slightly past you, or at a fixed point. She is present in the room. She is somewhere else entirely." },
            { heading: "The Stillness", text: "When something misses, she goes very still. You think she is listening. She has already left. That stillness is not calm, it is the body going somewhere safer than here." },
          ],
        },
      ],
    },
    {
      slug: "you-only-notice-now-that-shes-gone",
      order: 4,
      title: "You Only Notice Now That She Is Gone",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "The body speaks before words do. It speaks even when the person does not know what they are saying." },
        { kind: "p", text: "Many men come to me after the fact. She has left the relationship. Or left the room. Or left her own body. And only now, reading this, do you see the signals you missed." },
        { kind: "p", text: "What I am giving you is not a reason to blame yourself for missing them. It is a way to start reading the room differently from here.", emphasis: "bold" },
        { kind: "p", text: "Because she is still speaking. Even now.", emphasis: "accent" },
        {
          kind: "step",
          label: "The Signals Were Always There",
          lines: [
            { text: "The jaw. You put it down to stress." },
            { text: "The turning. You explained it away as tiredness." },
            { text: "The stillness. You mistook it for peace." },
          ],
        },
      ],
    },
    {
      slug: "what-you-can-do",
      order: 5,
      title: "What You Can Do",
      kind: "essay",
      imageSide: "right",
      body: [
        { kind: "p", text: "The men who reach her again are not the ones who explain themselves better.", emphasis: "bold" },
        { kind: "p", text: "They are the ones who stop trying to fix it and start learning to be with it differently.", emphasis: "bold" },
        {
          kind: "diagram",
          steps: [
            { heading: "Stop Fixing", text: "Release the need to solve." },
            { heading: "Be Present", text: "Hold silence without filling." },
            { heading: "Start Listening", text: "Hear what the body says." },
          ],
        },
        { kind: "p", text: "The following five practices are not techniques to deploy." },
        { kind: "p", text: "They are ways of being that, over time, change what it feels like to be near you." },
        { kind: "p", text: "Each one asks something of you before it asks anything of her.", emphasis: "accent" },
      ],
    },
    // --------------------------------------------------------- practices
    {
      slug: "one-what-not-to-do-in-a-text",
      order: 6,
      title: "One: What Not to Do in a Text",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "When she goes quiet, the impulse is to fill the silence.", emphasis: "bold" },
        { kind: "p", text: "To reach through it. To send the message that says: I'm here. I'm trying. Please respond." },
        {
          kind: "step",
          label: "What Most Men Send",
          lines: [
            { text: "“Are you okay?”" },
            { text: "“Just checking in.”" },
            { text: "“I just want you to know I love you.”" },
            { text: "“Can we talk?”" },
            { text: "“I've been trying so hard.”" },
            { text: "“Please say something.”" },
          ],
        },
        { kind: "p", text: "Each one sends the same signal." },
        { kind: "p", text: "I cannot hold this silence. I need you to respond so that I can feel better.", emphasis: "accent" },
        { kind: "p", text: "She reads the signal before she reads the words.", emphasis: "bold" },
        {
          kind: "diagram",
          steps: [
            { heading: "Feel the Ground", text: "Put both feet flat on the floor. Feel the weight underneath you." },
            { heading: "Take One Full Breath", text: "In through the nose, slow out through the mouth. An actual breath." },
            { heading: "Name What You Feel", text: "Scared. Lonely. Helpless. Let it be there without doing something with it." },
            { heading: "Ask What You Need", text: "Can you give that to yourself? A walk. Water. Five minutes outside." },
          ],
        },
        {
          kind: "step",
          label: "What a Grounded Text Actually Looks Like",
          lines: [
            { text: "“I've been thinking about you. No need to respond.”" },
            { text: "“I'm here when you're ready. Take your time.”" },
            { text: "“I got it wrong. I see that now. I'm not going anywhere.”" },
          ],
        },
        { kind: "p", text: "Then put the phone down. Wait. Let the space be space.", emphasis: "bold" },
        { kind: "p", text: "That waiting, the clean, undemanding holding of the silence, is more intimate than most things a man can do." },
        { kind: "p", text: "It tells her: I can be with this without needing you to fix it for me.", emphasis: "accent" },
      ],
    },
    {
      slug: "two-get-curious-not-strategic",
      order: 7,
      title: "Two: Get Curious, Not Strategic",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most men come to me trying to find the right move. The thing to say. The gesture that will work." },
        { kind: "p", text: "She can feel that. The body reads intention before words arrive.", emphasis: "bold" },
        { kind: "p", text: "What she needs is not a better strategy." },
        { kind: "p", text: "She needs to feel that you are genuinely curious about her, not to get things back to where they were, but because she is interesting to you and you want to understand her. Full stop.", emphasis: "accent" },
        {
          kind: "diagram",
          steps: [
            { heading: "Ask", text: "Not to get a response. To genuinely want to know." },
            { heading: "Listen", text: "Not to respond. Not to fix. Just to receive." },
            { heading: "Stay", text: "With whatever she says. Without defending." },
            { heading: "Wait", text: "Let the silence be part of the answer." },
          ],
        },
        { kind: "p", text: "Notice: does your body relax when you let go of the outcome? Or does it tighten?" },
        { kind: "p", text: "That tightening is information about how much you have been carrying.", emphasis: "bold" },
        {
          kind: "step",
          label: "Example Lines",
          lines: [
            { text: "“I've been thinking about what you said the other night. I don't think I understood it properly. Can you help me understand?”" },
            { text: "“I realise I haven't asked you this in a long time, what has been the hardest thing lately?”" },
            { text: "“What would a good evening look like for you tonight? Not for us. For you.”" },
          ],
        },
      ],
    },
    {
      slug: "three-touch-as-a-question",
      order: 8,
      title: "Three: Touch as a Question",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "Most men have been taught, without knowing it, that touch is something you do to someone." },
        { kind: "p", text: "She experiences touch as something that happens to her." },
        { kind: "p", text: "If it arrives with expectation, her body reads that expectation before your hand has even landed. It braces.", emphasis: "bold" },
        { kind: "p", text: "Touch becomes safe when it arrives as a question.", emphasis: "accent" },
        { kind: "p", text: "Ask before you reach. “Can I hold your hand?” Not as a test. As a genuine question." },
        {
          kind: "step",
          label: "If She Says Yes",
          lines: [
            { text: "Let her hand sit in yours with no agenda." },
            { text: "No movement. No leading anywhere. Just warmth." },
          ],
        },
        {
          kind: "step",
          label: "If She Says Not Right Now",
          lines: [
            { text: "Say “okay” and mean it." },
            { text: "That okay is more intimate than most touch. It tells her body: I can be told no and not disappear." },
          ],
        },
        { kind: "p", text: "Over time, that is what makes it safe to say yes.", emphasis: "bold" },
        { kind: "p", text: "She did not have to manage you. That is the gift.", emphasis: "accent" },
      ],
    },
    {
      slug: "four-the-3-minute-hold",
      order: 9,
      title: "Four: The 3-Minute Hold",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "If she is willing, try this once.", emphasis: "bold" },
        { kind: "quote", text: "“I want to try something. Three minutes. No talking. No phones. This is not going to lead anywhere else. Just holding. Can we?”" },
        { kind: "p", text: "That last part matters. Her body needs to know what it signed up for." },
        {
          kind: "diagram",
          steps: [
            { heading: "Look at Each Other", text: "As you reach. One breath together before you begin." },
            { heading: "Hold", text: "No agenda. No movement toward anything else. Simply be there." },
            { heading: "Stay Still", text: "When three minutes ends, stay still for one more breath before you move." },
            { heading: "Let It Settle", text: "Do not immediately ask how she felt. Give the moment room to land." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Why it works.", emphasis: "bold" },
            { text: "At around 20 seconds, oxytocin begins to release." },
            { text: "Cortisol drops." },
            { text: "Her nervous system stops scanning and starts to settle." },
            { text: "The time limit is not a restriction, it is what allows her body to fully arrive, because it knows when it ends.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "five-the-one-conversation",
      order: 10,
      title: "Five: The One Conversation",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "Not a big conversation.", emphasis: "bold" },
        { kind: "p", text: "Not the one where you lay everything out and ask her to respond. This one." },
        { kind: "quote", text: "“I've realised there are things you've been trying to tell me that I haven't heard properly. I'm not going to explain myself or fix anything. I just want to understand you. Are you open to doing this with me for 15 minutes?”" },
        { kind: "p", text: "Why structured communication works.", emphasis: "bold" },
        { kind: "p", text: "Most conversations between people who love each other are not conversations. They are two people waiting to speak." },
        { kind: "p", text: "One talks; the other is already forming the response, the defence, the explanation. Nothing lands. Both walk away more alone than before." },
        { kind: "p", text: "Structure removes the threat.", emphasis: "bold" },
        { kind: "p", text: "When she knows you will only respond in three ways, her body stops bracing for the impact of your reaction. She can say the real thing." },
        {
          kind: "step",
          label: "When She Speaks: Only These Three Responses",
          lines: [
            { text: "“Thank you.” Cannot be argued with. Simply acknowledges." },
            { text: "“Clarify that.” If something was unclear, ask gently." },
            { text: "“Summarise that.” If it went long, one thought per answer." },
          ],
        },
        { kind: "p", text: "Set a timer for 15 minutes. No defending. No explaining your intentions. No preparing a response while she is still talking." },
        { kind: "p", text: "Then switch. She asks you the same prompt. You answer from the heart. Not to be liked, but to be understood.", emphasis: "bold" },
        { kind: "p", text: "You go back and forth like this for 15 minutes. The difference in having a timed, structured communication is that both of you know how long it will take, and with each turn you can go deeper." },
        { kind: "p", text: "Some of my couples who were on the brink of divorce say this is one of the main things that brought them back together." },
        { kind: "p", text: "We all want to be heard, seen and understood.", emphasis: "accent" },
        {
          kind: "promptGroup",
          category: "Six Prompts To Start With",
          color: "gold",
          prompts: [
            "Tell me about a time you felt truly seen by me.",
            "Tell me what you needed in a certain moment that I didn't give.",
            "Tell me what would help you feel safe with me right now.",
            "Tell me what you have stopped asking for.",
            "Tell me what kind of presence you need from me this week.",
            "Tell me one thing that would help me understand what's been hard for you.",
          ],
        },
        { kind: "p", text: "One prompt. One conversation. Fifteen minutes.", emphasis: "bold" },
        { kind: "p", text: "You do not need to fix the answer. Just receive it.", emphasis: "accent" },
      ],
    },
    {
      slug: "a-note-on-getting-her-back",
      order: 11,
      title: "A Note on Getting Her Back",
      kind: "essay",
      imageSide: "right",
      body: [
        { kind: "quote", text: "“I just want things to go back to how they were.”" },
        { kind: "p", text: "The version you are reaching for, the early ease, the closeness, the way she used to reach for you, that version was built before the record of misses existed." },
        { kind: "p", text: "You cannot go back to it. That is not the goal.", emphasis: "bold" },
        {
          kind: "table",
          headers: ["Not This", "The Real Goal"],
          rows: [
            [
              "Returning to the early ease, a version built before the distance existed. That chapter is closed.",
              "A version of closeness built on something real. Where she does not have to manage what she says. Where touch is something she moves toward, not something she braces against.",
            ],
          ],
        },
        { kind: "p", text: "That version is possible. It requires a different kind of patience: learning how to make it safe for her to want to come back.", emphasis: "accent" },
      ],
    },
    // ----------------------------------------------------------- closing
    {
      slug: "what-comes-next",
      order: 12,
      title: "What Comes Next",
      kind: "closing",
      imageSide: "left",
      body: [
        { kind: "p", text: "If this landed, you are already more present than you were when you started reading. She will feel that before you say a word." },
        { kind: "quote", text: "The Unspoken Distance" },
        { kind: "p", text: "The full paid guide: 86 pages into her body, her withdrawal, her nervous system, and what she actually needs from you to feel safe enough to open again." },
        { kind: "p", text: "If this free guide opened something, that one takes you all the way in." },
        { kind: "link", text: "Explore The Unspoken Distance →", href: "https://feelfullyyou.com/the-unspoken-distance" },
        { kind: "quote", text: "The Touch Reset Quiz" },
        { kind: "p", text: "Five minutes, not a score. Meet the pattern your body runs to keep touch safe, and the one it has been quietly starving for." },
        { kind: "link", text: "Take the Free Touch Reset Quiz →", href: "https://feelfullyyou.com/touch-reset-quiz" },
        { kind: "p", text: "Tell me what is actually happening for you. What she said. What shifted. Where you are right now.", emphasis: "bold" },
        { kind: "p", text: "My DMs are open. I read them. Send me a message, @juliettekaraman.", emphasis: "accent" },
      ],
    },
    {
      slug: "meet-juliette",
      order: 13,
      title: "Meet Juliette",
      eyebrow: "Intimacy and touch expert",
      kind: "closing",
      imageSide: "right",
      body: [
        { kind: "p", text: "Intimacy and touch expert." },
        { kind: "p", text: "Touch Base® · The Touch Languages™ · Rapid Release Rewire and Restore®" },
        { kind: "p", text: "I create experiences: for the moment you understand exactly what's happening in your body, and still something tightens or fades the second closeness begins." },
        { kind: "p", text: "I didn't learn this in a classroom. My body handed me the truth years before my mind would say it out loud." },
        { kind: "quote", text: "Where It Began" },
        { kind: "p", text: "I started by teaching children on the autism spectrum to feel safe in their own skin, before they had words for any of it. Learning that the body speaks first, always." },
        { kind: "p", text: "Then my own life cracked open, and I went looking for everything that could help me work with what I found.", emphasis: "bold" },
        { kind: "p", text: "I know what it feels like to lie next to someone who loves you and feel completely unreachable. To go through the motions and be very good at it. To have your body start saying no before your mind catches up. Mine did. For years." },
        { kind: "quote", text: "Fifteen Years With Couples" },
        { kind: "p", text: "Thousands of individuals and couples who love each other, live full lives, and still lose connection the moment touch begins. That is the work." },
        { kind: "quote", text: "Trauma-Informed Practice" },
        { kind: "p", text: "Trauma doesn't stay in the past. It shows up decades later, as touch that triggers protection instead of landing. Insight alone doesn't change intimacy." },
        { kind: "quote", text: "The Scrumptious Woman® Podcast" },
        { kind: "p", text: "Top 2.5% worldwide. Conversations about feeling, relating, and connecting, for the people who are ready to go all the way in." },
        {
          kind: "stats",
          items: [
            { number: "27", label: "Years", caption: "Learned over the last 27 years, working with how people feel, relate, and connect." },
            { number: "15", label: "Years With Couples", caption: "Thousands of individuals and couples who lose connection the moment touch begins." },
            { number: "Top 2.5%", label: "Podcast Worldwide", caption: "The Scrumptious Woman® Podcast." },
          ],
        },
        { kind: "p", text: "The couples I work with don't just understand themselves better: they feel different, they touch differently, they stay in connection.", emphasis: "bold" },
        { kind: "link", text: "Listen to the Podcast", href: "https://feelfullyyou.com/podcast" },
        { kind: "link", text: "Read on Substack, What the Body Knows", href: "https://juliettekaraman.substack.com" },
      ],
    },
  ],
};
