export type TouchLanguagesSectionKey = "ER" | "PH" | "EM" | "SP" | "EN";
export type PromptLine = { text: string; bold?: boolean };
export type TouchLanguagesCardPrompt = { id: number; section: TouchLanguagesSectionKey; lines: PromptLine[] };

export const TOUCH_LANGUAGES_SECTIONS: Record<
  TouchLanguagesSectionKey,
  { title: string; coverImg: string; templateImg: string }
> = {
  ER: {
    title: "Erotic Touch",
    coverImg: "/cards/touch/sections/ER.png",
    templateImg: "/cards/touch/templates/ER.png",
  },
  PH: {
    title: "Physical Touch",
    coverImg: "/cards/touch/sections/PH.png",
    templateImg: "/cards/touch/templates/PH.png",
  },
  EM: {
    title: "Emotional Touch",
    coverImg: "/cards/touch/sections/EM.png",
    templateImg: "/cards/touch/templates/EM.png",
  },
  SP: {
    title: "Spiritual Touch",
    coverImg: "/cards/touch/sections/SP.png",
    templateImg: "/cards/touch/templates/SP.png",
  },
  EN: {
    title: "Energetic Touch",
    coverImg: "/cards/touch/sections/EN.png",
    templateImg: "/cards/touch/templates/EN.png",
  },
};

export const TOUCH_LANGUAGES_CARDS: TouchLanguagesCardPrompt[] = [
  // -------------------------
  // Erotic Touch (1-25)
  // -------------------------
  { id: 1, section: "ER", lines: [{ text: "Tell me how you most want my hands to meet you right now." }] },
  { id: 2, section: "ER", lines: [{ text: "Tell me what part of your body craves to be touched erotically." }] },
  { id: 3, section: "ER", lines: [{ text: "Tell me what erotic touch means to you.", bold: true }, { text: "How would it feel if it truly landed?" }] },
  { id: 4, section: "ER", lines: [{ text: "Tell me one fantasy you've never shared out loud." }] },
  { id: 5, section: "ER", lines: [{ text: "Tell me how you want me to undress you." }] },
  { id: 6, section: "ER", lines: [{ text: "Tell me what kind of kiss unravels you." }] },
  { id: 7, section: "ER", lines: [{ text: "Tell me what happens in you when my fingers trace your jaw." }] },
  { id: 8, section: "ER", lines: [{ text: "Tell me what you feel when you get kissed on the back of your neck." }] },
  { id: 9, section: "ER", lines: [{ text: "Tell me what kind of touch has you melt without words." }] },
  { id: 10, section: "ER", lines: [{ text: "Tell me how you want me to guide your body." }] },
  { id: 11, section: "ER", lines: [{ text: "Tell me what happens in you when I pull you closer by the hips." }] },
  { id: 12, section: "ER", lines: [{ text: "Tell me what kind of pressure your body is hungry for." }] },
  { id: 13, section: "ER", lines: [{ text: "Tell me what it does to you when I bite your shoulder softly and breathe near your ear." }] },
  { id: 14, section: "ER", lines: [{ text: "Tell me about a time when you were mis-touched: touched too fast, too soon, or without presence.", bold: true }, { text: "What happened for you?" }] },
  { id: 15, section: "ER", lines: [{ text: "Tell me about a time when you longed for slower touch." }] },
  { id: 16, section: "ER", lines: [{ text: "Tell me what keeps your desire alive when we're apart." }] },
  { id: 17, section: "ER", lines: [{ text: "Tell me what scent, taste, or sound awakens your erotic energy." }] },
  { id: 18, section: "ER", lines: [{ text: "Tell me how you'd love me to show you that I want touch when we're out together in a way that still feels safe." }] },
  { id: 19, section: "ER", lines: [{ text: "Tell me what draws you in more — being whispered to in the dark, or feeling my hands explore what words can't say." }] },
  { id: 20, section: "ER", lines: [{ text: "Tell me what part of your body feels deeply erogenous that I might not know." }] },
  { id: 21, section: "ER", lines: [{ text: "Tell me what surprises you most about your own desire." }] },
  { id: 22, section: "ER", lines: [{ text: "Tell me what playful, erotic touch means to you." }] },
  { id: 23, section: "ER", lines: [{ text: "Tell me how you want to be looked at when I touch you." }] },
  { id: 24, section: "ER", lines: [{ text: "Tell me how you'd like me to touch you if we had only five minutes." }] },
  { id: 25, section: "ER", lines: [{ text: "Tell me how you want to be held after erotic play." }] },

  // -------------------------
  // Physical Touch (26-50)
  // -------------------------
  { id: 26, section: "PH", lines: [{ text: "Tell me, what does physical touch mean to you?" }] },
  { id: 27, section: "PH", lines: [{ text: "Tell me what kind of non-erotic, physical touch you want more of in your life." }] },
  { id: 28, section: "PH", lines: [{ text: "Tell me how your body responds to a warm, lingering hug.", bold: true }, { text: "Is that different when it's from a friend versus a partner?" }] },
  { id: 29, section: "PH", lines: [{ text: "Tell me what happens in you when someone holds your hand.", bold: true }, { text: "Is it different depending on who it is?" }] },
  { id: 30, section: "PH", lines: [{ text: "Tell me about a time when a friend's touch brought you comfort." }] },
  { id: 31, section: "PH", lines: [{ text: "Tell me how you like to be comforted with physical touch when you're overwhelmed.", bold: true }, { text: "Does physical touch help, or do you prefer space?" }] },
  { id: 32, section: "PH", lines: [{ text: "Tell me what kind of touch brings you a sense of grounding." }] },
  { id: 33, section: "PH", lines: [{ text: "Tell me about a moment when someone's hand on your shoulder felt like an anchor." }] },
  { id: 34, section: "PH", lines: [{ text: "Tell me what it feels like when someone places their hand on the small of your back.", bold: true }, { text: "Does that area hold meaning or emotion for you?" }] },
  { id: 35, section: "PH", lines: [{ text: "Tell me how you feel when someone casually places an arm around your waist.", bold: true }, { text: "Does it feel different depending on the relationship?" }] },
  { id: 36, section: "PH", lines: [{ text: "Tell me what kind of touch helps you feel most safe." }] },
  { id: 37, section: "PH", lines: [{ text: "Tell me what kind of touch helps you soften into your body." }] },
  { id: 38, section: "PH", lines: [{ text: "Tell me how you feel about platonic cuddling." }] },
  { id: 39, section: "PH", lines: [{ text: "Tell me what happens in you when someone rubs your back slowly." }] },
  { id: 40, section: "PH", lines: [{ text: "Tell me what kind of physical affection you received growing up and what you missed." }] },
  { id: 41, section: "PH", lines: [{ text: "Tell me how your relationship with physical touch changes when you're under stress." }] },
  { id: 42, section: "PH", lines: [{ text: "Tell me one small gesture of physical care that means more to you than most people realise." }] },
  { id: 43, section: "PH", lines: [{ text: "Tell me about a time a simple touch changed your whole day." }] },
  { id: 44, section: "PH", lines: [{ text: "Tell me what part of your body longs to be held by someone else." }] },
  { id: 45, section: "PH", lines: [{ text: "Tell me what it feels like when someone brushes lint off your shoulder or tucks your hair behind your ear." }] },
  { id: 46, section: "PH", lines: [{ text: "Tell me if you ever feel touch-starved and how your body lets you know." }] },
  { id: 47, section: "PH", lines: [{ text: "Tell me what it feels like when someone links arms with you." }] },
  { id: 48, section: "PH", lines: [{ text: "Tell me about a memory where physical touch felt deeply healing." }] },
  { id: 49, section: "PH", lines: [{ text: "Tell me what kind of touch feels like presence, not performance." }] },
  { id: 50, section: "PH", lines: [{ text: "Tell me what it's like to touch your own hands with reverence.", bold: true }, { text: "Can you receive your own touch?" }] },

  // -------------------------
  // Emotional Touch (51-75)
  // -------------------------
  { id: 51, section: "EM", lines: [{ text: "Tell me what emotional touch means to you." }] },
  { id: 52, section: "EM", lines: [{ text: "Tell me the last words that truly landed for you.", bold: true }, { text: "How did they affect you?" }] },
  { id: 53, section: "EM", lines: [{ text: "Tell me a thank you you've secretly wanted to receive.", bold: true }, { text: "Who from, and what would it mean for you?" }] },
  { id: 54, section: "EM", lines: [{ text: "Tell me about a time when words felt like a hug around your heart." }] },
  { id: 55, section: "EM", lines: [{ text: "Tell me what kind of praise actually touches you." }] },
  { id: 56, section: "EM", lines: [{ text: "Tell me one truth you long to hear more often." }] },
  { id: 57, section: "EM", lines: [{ text: "Tell me what you most need when you're tired or upset." }] },
  { id: 58, section: "EM", lines: [{ text: "Tell me what silence between us feels like for you." }] },
  { id: 59, section: "EM", lines: [{ text: "Tell me one memory where you were hurt more emotionally than you let on." }] },
  { id: 60, section: "EM", lines: [{ text: "Tell me how you know when I really understand you.", bold: true }, { text: "How does it feel to be understood?" }] },
  { id: 61, section: "EM", lines: [{ text: "Tell me the phrase that softens you.", bold: true }, { text: "Where do you feel it in your body?" }] },
  { id: 62, section: "EM", lines: [{ text: "Tell me what being seen means to you." }] },
  { id: 63, section: "EM", lines: [{ text: "Tell me what tone of voice has you feel safe, and what tone of voice has you feel unsafe." }] },
  { id: 64, section: "EM", lines: [{ text: "Tell me when emotional honesty has brought you closer to someone." }] },
  { id: 65, section: "EM", lines: [{ text: "Tell me what you wish I would ask so you could open up about how you're feeling right now." }] },
  { id: 66, section: "EM", lines: [{ text: "Tell me how you feel when someone interrupts you." }] },
  { id: 67, section: "EM", lines: [{ text: "Tell me a word that lights you up instantly.", bold: true }, { text: "Why?" }] },
  { id: 68, section: "EM", lines: [{ text: "Tell me what has an apology land for you." }] },
  { id: 69, section: "EM", lines: [{ text: "Tell me, if I whispered how much you mean to me in the dark, how would that land for you — in your heart?" }] },
  { id: 70, section: "EM", lines: [{ text: "Tell me one compliment you've received that never felt true to you." }] },
  { id: 71, section: "EM", lines: [{ text: "Tell me what unspoken words you still carry, and who they're for." }] },
  { id: 72, section: "EM", lines: [{ text: "Tell me how you want me to respond when you're hurting." }] },
  { id: 73, section: "EM", lines: [{ text: "Tell me what \"I love you\" means in your body when you hear it." }] },
  { id: 74, section: "EM", lines: [{ text: "Tell me about a time when language felt like nourishment." }] },
  { id: 75, section: "EM", lines: [{ text: "Tell me what you most long to express, even if words don't always capture it." }] },

  // -------------------------
  // Spiritual Touch (76-100)
  // -------------------------
  { id: 76, section: "SP", lines: [{ text: "Tell me what spiritual touch means to you." }] },
  { id: 77, section: "SP", lines: [{ text: "Tell me when you last felt held by something greater than you." }] },
  { id: 78, section: "SP", lines: [{ text: "Tell me how you know when love feels sacred." }] },
  { id: 79, section: "SP", lines: [{ text: "Tell me a ritual that reconnects you to yourself or to something greater." }] },
  { id: 80, section: "SP", lines: [{ text: "Tell me what prayer your body whispers when you're alone and in touch with your essence." }] },
  { id: 81, section: "SP", lines: [{ text: "Tell me how you feel when our breath syncs in silence." }] },
  { id: 82, section: "SP", lines: [{ text: "Tell me about a time when music or art lifted you beyond yourself.", bold: true }, { text: "What did it touch in you?" }] },
  { id: 83, section: "SP", lines: [{ text: "Tell me about a moment in nature that felt supernatural or deeply alive.", bold: true }, { text: "How does it live in you now?" }] },
  { id: 84, section: "SP", lines: [{ text: "Tell me what surrender means to you — and how it feels in your body." }] },
  { id: 85, section: "SP", lines: [{ text: "Tell me one word or image that captures \"the sacred\" in you." }] },
  { id: 86, section: "SP", lines: [{ text: "Tell me how you experience awe.", bold: true }, { text: "What happens inside you?" }] },
  { id: 87, section: "SP", lines: [{ text: "Tell me when our love has felt like a ceremony.", bold: true }, { text: "What made it feel different?" }] },
  { id: 88, section: "SP", lines: [{ text: "Tell me when you felt small in the best possible way." }] },
  { id: 89, section: "SP", lines: [{ text: "Tell me a place or moment that has you feel \"close to something holy.\"" }] },
  { id: 90, section: "SP", lines: [{ text: "Tell me what you trust — even when you can't see it." }] },
  { id: 91, section: "SP", lines: [{ text: "Tell me what aliveness means to you." }] },
  { id: 92, section: "SP", lines: [{ text: "Tell me what you're in devotion to, consciously or not." }] },
  { id: 93, section: "SP", lines: [{ text: "Tell me how you know when you've come home to yourself." }] },
  { id: 94, section: "SP", lines: [{ text: "Tell me what presence feels like in your body." }] },
  { id: 95, section: "SP", lines: [{ text: "Tell me about a time when you felt guided by unseen hands.", bold: true }, { text: "What happened?" }] },
  { id: 96, section: "SP", lines: [{ text: "Tell me how prayer or sacred practice shapes your relationship — with life, love, or yourself." }] },
  { id: 97, section: "SP", lines: [{ text: "Tell me about a book, poem, piece of writing or music that touched something sacred in you.", bold: true }, { text: "What stayed with you?" }] },
  { id: 98, section: "SP", lines: [{ text: "Tell me what signs, symbols, or practices have been guiding you lately." }] },
  { id: 99, section: "SP", lines: [{ text: "Tell me how your body responds when you enter stillness.", bold: true }, { text: "What shifts or awakens inside you?" }] },
  { id: 100, section: "SP", lines: [{ text: "Tell me about a moment when everything felt quietly right and you felt at ease in yourself or with life.", bold: true }, { text: "What made that moment matter?" }] },

  // -------------------------
  // Energetic Touch (101-125)
  // -------------------------
  { id: 101, section: "EN", lines: [{ text: "Tell me what you feel when my eyes meet yours and nothing else moves." }] },
  { id: 102, section: "EN", lines: [{ text: "Tell me, does feeling my presence in the room before I physically touch you bring excitement?" }] },
  { id: 103, section: "EN", lines: [{ text: "Tell me if you can feel me when I stand behind you in silence." }] },
  { id: 104, section: "EN", lines: [{ text: "Tell me what happens in your body when I take a step closer to you." }] },
  { id: 105, section: "EN", lines: [{ text: "Tell me how you want to indicate when you're in the mood for energetic touch." }] },
  { id: 106, section: "EN", lines: [{ text: "Tell me what energetic touch means to you." }] },
  { id: 107, section: "EN", lines: [{ text: "Tell me whether touch off the body ever feels more electric than touch on it." }] },
  { id: 108, section: "EN", lines: [{ text: "Tell me how far away I can be before you stop feeling me." }] },
  { id: 109, section: "EN", lines: [{ text: "Tell me what part of you tingles most when I don't touch you at all." }] },
  { id: 110, section: "EN", lines: [{ text: "Tell me what happens in you when our eyes catch across the room and our breath starts to co-regulate." }] },
  { id: 111, section: "EN", lines: [{ text: "Tell me how you feel when my gaze doesn't let go of you." }] },
  { id: 112, section: "EN", lines: [{ text: "Tell me what changes when I close my eyes but keep my attention on you.", bold: true }, { text: "Can you still feel it?" }] },
  { id: 113, section: "EN", lines: [{ text: "Tell me if you can feel the difference when I leave the room." }] },
  { id: 114, section: "EN", lines: [{ text: "Tell me how your body responds when I exhale near your body and you can just sense it." }] },
  { id: 115, section: "EN", lines: [{ text: "Tell me what it feels like when energy pools between our hands." }] },
  { id: 116, section: "EN", lines: [{ text: "Tell me about a time you entered a room or a space, felt something was off but dismissed it.", bold: true }, { text: "What did it teach you?" }] },
  { id: 117, section: "EN", lines: [{ text: "Tell me what shifts when I whisper your name without speaking it out loud.", bold: true }, { text: "Can you sense that my attention is on you — even without words?" }] },
  { id: 118, section: "EN", lines: [{ text: "Tell me what distance between us ignites electricity in your body — further away or closer?" }] },
  { id: 119, section: "EN", lines: [{ text: "Tell me about a time the space between us felt most magnetic." }] },
  { id: 120, section: "EN", lines: [{ text: "Tell me what you notice when I walk away from you slowly.", bold: true }, { text: "What do you yearn for in that moment?" }] },
  { id: 121, section: "EN", lines: [{ text: "Tell me how your body feels when you imagine me touching you but I don't." }] },
  { id: 122, section: "EN", lines: [{ text: "Tell me what happens when we stand still, eyes locked, without moving." }] },
  { id: 123, section: "EN", lines: [{ text: "Tell me if stillness feels like intensity or like reset." }] },
  { id: 124, section: "EN", lines: [{ text: "Tell me when you felt most alive in the space between us." }] },
  { id: 125, section: "EN", lines: [{ text: "Tell me what you most long to feel — even if it lives only in the space between us." }] },
];

export const TOUCH_LANGUAGES_TOTAL_CARDS = 125;
