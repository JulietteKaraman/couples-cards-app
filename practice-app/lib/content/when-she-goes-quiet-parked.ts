// Parts taken OUT of the free When She Goes Quiet guide (27 Oct 2026),
// Juliette: "they just get way too much for free". Kept word for word so
// they can go into a paid product. Not imported anywhere.
import { PracticeEntry } from "./ten-touch-rituals";

export const whenSheGoesQuietParked: PracticeEntry[] = [
    {
      slug: "three-touch-as-a-question",
      order: 8,
      title: "Three: Touch as a Question",
      kind: "ritual",
      image: "/when-she-goes-quiet/real/three-touch-as-a-question.jpg",
      imageAlt: "Juliette laughing on her sofa",
      imageSide: "left",
      body: [
        { kind: "p", text: "Most men have been taught, without knowing it, that touch is something you do to someone." },
        { kind: "p", text: "She experiences touch as something that happens to her." },
        { kind: "p", text: "If it arrives with expectation, her body reads that expectation before your hand has even landed. It braces.", emphasis: "bold" },
        { kind: "p", text: "Touch becomes safe when it arrives as a question.", emphasis: "accent" },
        { kind: "p", text: "Ask before you reach. “Can I hold your hand?” Not as a test. As a genuine question." },
        { kind: "choice", key: "wsgq-touch", label: "You asked. What did she say?", options: [{"label": "Yes", "lines": ["Let her hand sit in yours with no agenda.", "No movement. No leading anywhere. Just warmth."]}, {"label": "Not right now", "lines": ["Say “okay” and mean it.", "That okay is more intimate than most touch. It tells her body: I can be told no and not disappear."]}] },
        { kind: "p", text: "Over time, that is what makes it safe to say yes.", emphasis: "bold" },
        { kind: "p", text: "She did not have to manage you. That is the gift.", emphasis: "accent" },
      ],
    },
    {
      slug: "four-the-3-minute-hold",
      order: 9,
      title: "Four: The 3-Minute Hold",
      kind: "ritual",
      image: "/when-she-goes-quiet/real/four-the-3-minute-hold.jpg",
      imageAlt: "Juliette sitting under the arches in Budapest",
      imageSide: "right",
      body: [
        { kind: "p", text: "If she is willing, try this once.", emphasis: "bold" },
        { kind: "quote", text: "“I want to try something. Three minutes. No talking. No phones. This is not going to lead anywhere else. Just holding. Can we?”" },
        { kind: "p", text: "That last part matters. Her body needs to know what it signed up for." },
        { kind: "timer", minutes: [3], label: "The 3-Minute Hold" },
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
      image: "/when-she-goes-quiet/the-one-conversation.png",
      imageAlt: "Close-up of hands holding a set of the Intimacy and Communication Cards",
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
        { kind: "timer", minutes: [15], label: "The One Conversation" },
        { kind: "p", text: "Then switch. She asks you the same prompt. You answer from the heart. Not to be liked, but to be understood.", emphasis: "bold" },
        { kind: "p", text: "You go back and forth like this for 15 minutes. The difference in having a timed, structured communication is that both of you know how long it will take, and with each turn you can go deeper." },
        { kind: "p", text: "Some of my couples who were on the brink of divorce say this is one of the main things that brought them back together." },
        { kind: "p", text: "We all want to be heard, seen and understood.", emphasis: "accent" },
        { kind: "p", text: "One prompt. One conversation. Fifteen minutes.", emphasis: "bold" },
        { kind: "p", text: "You do not need to fix the answer. Just receive it.", emphasis: "accent" },
        { kind: "journal", key: "wsgq-heard", label: "Write down one thing she said", placeholder: "She said..." },
      ],
    },
    {
      slug: "a-note-on-getting-her-back",
      order: 11,
      title: "A Note on Getting Her Back",
      kind: "essay",
      image: "/when-she-goes-quiet/real/a-note-on-getting-her-back.jpg",
      imageAlt: "Juliette under the arches above the river",
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
];
