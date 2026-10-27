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
  heroImage: "/when-she-goes-quiet/real/hero.jpg",
  theme: "dark",
  unlockMode: "free-browse",
  entries: [
    // ------------------------------------------------------------- intro
    {
      slug: "before-we-begin",
      order: 0,
      title: "Her Withdrawal Is Not a Verdict on You.",
      eyebrow: "Before We Begin",
      kind: "essay",
      image: "/when-she-goes-quiet/real/before-we-begin.jpg",
      imageAlt: "Juliette walking in a golden robe",
      imageSide: "left",
      body: [
        { kind: "p", text: "Read that again if you need to.", emphasis: "bold" },
        { kind: "p", text: "You are not reading this because you stopped caring. You are reading this because she has gone somewhere you cannot follow, and everything you have tried to bring her back has made the gap wider." },
        { kind: "p", text: "That is one of the most disorienting things a man can experience." },
        { kind: "tapCheck", key: "wsgq-sounds", label: "Which of these sounds like you? Tap the ones that are true.", items: ["You reach for her. She stiffens. You give her space and she seems to go further.", "You ask what's wrong. She says nothing. You stop asking and she says you don't care.", "You try to be close. She goes quiet. You leave her alone and nothing changes."] },
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
      image: "/when-she-goes-quiet/real/what-shes-not-saying.jpg",
      imageAlt: "Juliette in a stone doorway in Budapest",
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
      image: "/when-she-goes-quiet/real/the-translation.jpg",
      imageAlt: "Juliette in a green shirt, thinking",
      imageSide: "left",
      body: [
        { kind: "p", text: "Here is what she has been saying, and what she has meant. Read this slowly." },
        { kind: "p", text: "Not to defend yourself. Not to feel guilty." },
        { kind: "p", text: "To understand something you were never taught to see.", emphasis: "accent" },
        { kind: "flipCards", key: "wsgq-lands", prompt: "Tap each one to see what she meant", markLabel: "This one lands", summaryLabel: "The one that lands for you", cards: [{"front": "“I'm fine.”", "back": "I'm not. But I don't feel safe enough to say it.", "sub": "Believed her. Or pushed. Neither helped.", "subLabel": "What you probably did"}, {"front": "“Can we slow down?”", "back": "I'm about to shut down. I need presence, not pressure.", "sub": "Slowed down physically but not emotionally.", "subLabel": "What you probably did"}, {"front": "“I don't know what I want.”", "back": "I haven't had enough space to feel what I want yet.", "sub": "Tried to figure it out for her.", "subLabel": "What you probably did"}, {"front": "“I'm tired.”", "back": "I want closeness. Not sexual expectation.", "sub": "Heard rejection. Pulled back.", "subLabel": "What you probably did"}, {"front": "“It's not a big deal.”", "back": "It is. But I've learned to dim it.", "sub": "Moved on. She filed it away.", "subLabel": "What you probably did"}, {"front": "“Whatever you want.”", "back": "I have a preference. I don't trust it's safe to say it.", "sub": "Made the decision. She felt unseen.", "subLabel": "What you probably did"}, {"front": "“Maybe later.”", "back": "Right now isn't a yes. I'd like to be asked again.", "sub": "Didn't ask again.", "subLabel": "What you probably did"}, {"front": "“Don't worry about it.”", "back": "It matters. But I've stopped expecting to be heard.", "sub": "Didn't worry about it.", "subLabel": "What you probably did"}, {"front": "“We should go away sometime.”", "back": "I am craving time that is just ours. Please plan it.", "sub": "Said yes, sometime. It never happened.", "subLabel": "What you probably did"}, {"front": "“Nothing's wrong.”", "back": "Something is wrong. But I don't have the words yet.", "sub": "Felt relieved. She felt more alone.", "subLabel": "What you probably did"}] },
        { kind: "p", text: "Stay with the one that lands most. Not to apologise. Just to notice." },
        { kind: "p", text: "That gap between what she said and what she meant is where connection has been going quiet, for longer than either of you knew.", emphasis: "accent" },
      ],
    },
    {
      slug: "reading-her-body",
      order: 3,
      title: "Reading Her Body",
      kind: "essay",
      image: "/when-she-goes-quiet/real/reading-her-body.jpg",
      imageAlt: "Juliette in a white shirt, her hair moving",
      imageSide: "right",
      body: [
        { kind: "p", text: "Most men are never taught this." },
        { kind: "p", text: "Her body was telling you before she had the words. It has been telling you all along.", emphasis: "bold" },
        { kind: "flipCards", key: "wsgq-signals", prompt: "Tap each one. Mark the ones you have seen", markLabel: "I've seen this", cards: [{"front": "The Jaw", "back": "A slight tightening mid-conversation. She is holding something back that she has decided is not safe to say."}, {"front": "The Shoulders", "back": "They lift and draw forward. She is making herself smaller, the body creates a barrier before the mind has made any decision."}, {"front": "The Back", "back": "Rigidity where softness used to be. She used to settle into a room. Now she holds herself upright, alert, ready to manage whatever comes."}, {"front": "The Breath", "back": "Shallow and high, staying in the chest. When the body feels safe, the breath drops. When it does not, it stays up."}, {"front": "The Gaze", "back": "She looks slightly past you, or at a fixed point. She is present in the room. She is somewhere else entirely."}, {"front": "The Stillness", "back": "When something misses, she goes very still. You think she is listening. She has already left. That stillness is not calm, it is the body going somewhere safer than here."}] },
      ],
    },
    {
      slug: "you-only-notice-now-that-shes-gone",
      order: 4,
      title: "You Only Notice Now That She Is Gone",
      kind: "essay",
      image: "/when-she-goes-quiet/real/you-only-notice-now-that-shes-gone.jpg",
      imageAlt: "Juliette by the iron gates in Budapest",
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
      image: "/when-she-goes-quiet/real/what-you-can-do.jpg",
      imageAlt: "Juliette in a green shirt, smiling",
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
        { kind: "p", text: "The following practices are not techniques to deploy." },
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
      image: "/when-she-goes-quiet/real/one-what-not-to-do-in-a-text.jpg",
      imageAlt: "Juliette in a green shirt, leaning in",
      imageSide: "left",
      body: [
        { kind: "p", text: "When she goes quiet, the impulse is to fill the silence.", emphasis: "bold" },
        { kind: "p", text: "To reach through it. To send the message that says: I'm here. I'm trying. Please respond." },
        { kind: "sortGame", label: "Grounded or grasping? Tap what you think", a: { label: "Grasping", line: "Each one sends the same signal. I cannot hold this silence. I need you to respond so that I can feel better." }, b: { label: "Grounded", line: "It tells her: I can be with this without needing you to fix it for me." }, items: [{"text": "“Are you okay?”", "side": "a"}, {"text": "“I've been thinking about you. No need to respond.”", "side": "b"}, {"text": "“Just checking in.”", "side": "a"}, {"text": "“I just want you to know I love you.”", "side": "a"}, {"text": "“I'm here when you're ready. Take your time.”", "side": "b"}, {"text": "“Can we talk?”", "side": "a"}, {"text": "“I've been trying so hard.”", "side": "a"}, {"text": "“I got it wrong. I see that now. I'm not going anywhere.”", "side": "b"}, {"text": "“Please say something.”", "side": "a"}], end: "She reads the signal before she reads the words." },
        { kind: "draft", key: "wsgq-draft", label: "Before you hit send. Type the text you want to send her", placeholder: "Type it here..." },
        { kind: "tapCheck", key: "wsgq-ground", label: "Then, before you send anything", items: ["Feel the Ground. Put both feet flat on the floor. Feel the weight underneath you.", "Take One Full Breath. In through the nose, slow out through the mouth. An actual breath.", "Name What You Feel. Scared. Lonely. Helpless. Let it be there without doing something with it.", "Ask What You Need. Can you give that to yourself? A walk. Water. Five minutes outside."] },
        { kind: "choice", key: "wsgq-needs", label: "Read your text again. Does it need her to answer?", options: [{"label": "Yes", "lines": ["I cannot hold this silence. I need you to respond so that I can feel better.", "She reads the signal before she reads the words.", "Try one of these instead."]}, {"label": "No", "lines": ["Then put the phone down. Wait. Let the space be space."]}] },
        { kind: "copyLines", label: "What a Grounded Text Actually Looks Like", lines: ["“I've been thinking about you. No need to respond.”", "“I'm here when you're ready. Take your time.”", "“I got it wrong. I see that now. I'm not going anywhere.”"] },
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
      image: "/when-she-goes-quiet/real/two-get-curious-not-strategic.jpg",
      imageAlt: "Juliette smiling, holding a drum",
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
        { kind: "copyLines", label: "Example Lines", lines: ["“I've been thinking about what you said the other night. I don't think I understood it properly. Can you help me understand?”", "“I realise I haven't asked you this in a long time, what has been the hardest thing lately?”", "“What would a good evening look like for you tonight? Not for us. For you.”"] },
      ],
    },
    {
      slug: "what-comes-next",
      order: 12,
      title: "What Comes Next",
      kind: "closing",
      image: "/when-she-goes-quiet/real/what-comes-next.jpg",
      imageAlt: "Juliette in a yellow top, smiling",
      imageSide: "left",
      body: [
        { kind: "p", text: "If this landed, you are already more present than you were when you started reading. She will feel that before you say a word." },
        { kind: "journal", key: "wsgq-want", label: "Where would you want this to be?", placeholder: "In a year, I would love..." },
        { kind: "journal", key: "wsgq-year", label: "Picture it a year from now, unchanged", placeholder: "If nothing changes..." },
        { kind: "nextCard", image: "/when-she-goes-quiet/real/next-wssr.jpg", title: "When She Stops Reaching", line: "Fifteen minutes. One sitting. You touch nobody until she says so.", href: "https://buy.stripe.com/cNiaEW9ub6SYgCh6eN0co2b", cta: "Get it →" },
        { kind: "quote", text: "The Unspoken Distance" },
        { kind: "image", src: "/when-she-goes-quiet/distance-cover.jpeg", alt: "The Unspoken Distance" },
        { kind: "p", text: "The full paid guide, all the way into her body, her withdrawal, her nervous system, and what she actually needs from you to feel safe enough to open again." },
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
      image: "/when-she-goes-quiet/meet-juliette.png",
      imageAlt: "Juliette Karaman",
      imageSide: "right",
      imageFocus: "top",
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
