export type SectionKey = "RR" | "IR" | "TD" | "HG" | "PD";
export type PromptLine = { text: string; bold?: boolean };
export type CardPrompt = { id: number; section: SectionKey; lines: PromptLine[] };

export const SECTIONS: Record<
  SectionKey,
  { title: string; coverImg: string; templateImg: string }
> = {
  RR: {
    title: "Romantic Relationships",
    coverImg: "/cards/couples/sections/RR_cover.png",
    templateImg: "/cards/couples/sections/RR_template.png",
  },
  IR: {
    title: "Intimacy & Repair",
    coverImg: "/cards/couples/sections/IR_cover.png",
    templateImg: "/cards/couples/sections/IR_template.png",
  },
  TD: {
    title: "Touch & Desire",
    coverImg: "/cards/couples/sections/TD_cover.png",
    templateImg: "/cards/couples/sections/TD_template.png",
  },
  HG: {
    title: "Healing & Growth",
    coverImg: "/cards/couples/sections/HG_cover.png",
    templateImg: "/cards/couples/sections/HG_template.png",
  },
  PD: {
    title: "Play & Discovery",
    coverImg: "/cards/couples/sections/PD_cover.png",
    templateImg: "/cards/couples/sections/PD_template.png",
  },
};

export const COUPLES_CARDS: CardPrompt[] = [
  // -------------------------
  // Romantic Relationships (1–30)
  // -------------------------
  { id: 1, section: "RR", lines: [{ text: "Tell me what triggers you during an argument." }] },
  { id: 2, section: "RR", lines: [{ text: "Tell me how you want to be loved." }] },
  { id: 3, section: "RR", lines: [{ text: "Tell me 3 things I can do to help you feel more supported." }] },
  { id: 4, section: "RR", lines: [{ text: "Tell me where you find it hard to open up in our relationship." }] },
  { id: 5, section: "RR", lines: [{ text: "Tell me when you last felt disappointed but said nothing." }] },
  { id: 6, section: "RR", lines: [{ text: "Tell me where you feel trust or truth is missing in our relationship." }] },
  { id: 7, section: "RR", lines: [{ text: "Tell me how our relationship has changed you." }] },
  { id: 8, section: "RR", lines: [{ text: "Tell me what your deal breakers are." }] },
  { id: 9, section: "RR", lines: [{ text: "Tell me a way you compare me/your partner to someone from your past." }] },
  { id: 10, section: "RR", lines: [{ text: "Tell me something you’ve been nervous to express." }] },
  { id: 11, section: "RR", lines: [{ text: "Tell me what you’d miss most if we ended." }] },
  { id: 12, section: "RR", lines: [{ text: "Tell me how you feel unappreciated or unsupported." }] },
  { id: 13, section: "RR", lines: [{ text: "Tell me 5 things you love about our relationship." }] },
  {
    id: 14,
    section: "RR",
    lines: [
      { text: "Tell me:", bold: true },
      { text: "3 qualities you love about me" },
      { text: "3 things we agree on" },
      { text: "3 things we don’t agree on" },
    ],
  },
  { id: 15, section: "RR", lines: [{ text: "Tell me a decision you made that hurt me." }] },
  { id: 16, section: "RR", lines: [{ text: "Tell me what part of yourself you quiet down when you and I/your partner are around others." }] },
  { id: 17, section: "RR", lines: [{ text: "Tell me how to best support you here." }] },
  {
    id: 18,
    section: "RR",
    lines: [
      { text: "Tell me something you’ve held back", bold: true },
      { text: "What do you want me to understand?" },
    ],
  },
  { id: 19, section: "RR", lines: [{ text: "Tell me how you want to love me—and how it feels to be loved by me." }] },
  { id: 20, section: "RR", lines: [{ text: "Tell me your goals for us." }] },
  { id: 21, section: "RR", lines: [{ text: "Tell me a way you’ve been critical of us." }] },
  { id: 22, section: "RR", lines: [{ text: "Tell me one of our most rewarding moments." }] },
  { id: 23, section: "RR", lines: [{ text: "Tell me how you’ve held back emotionally." }] },
  {
    id: 24,
    section: "RR",
    lines: [
      { text: "Tell me what the word “sexy” means to you now, versus what it meant five years ago.", bold: true },
      { text: "What has this changed?" },
    ],
  },
  { id: 25, section: "RR", lines: [{ text: "Tell me something I need to understand about what’s important to you." }] },
  { id: 26, section: "RR", lines: [{ text: "Tell me something you’d like to be forgiven for." }] },
  { id: 27, section: "RR", lines: [{ text: "Tell me the best way to surprise you." }] },
  { id: 28, section: "RR", lines: [{ text: "Tell me about a moment you felt proud of our relationship." }] },
  { id: 29, section: "RR", lines: [{ text: "Tell me a time you felt truly seen by me." }] },
  { id: 30, section: "RR", lines: [{ text: "Tell me when you feel most appreciated." }] },

  // -------------------------
  // Intimacy & Repair (31–60)
  // -------------------------
  {
    id: 31,
    section: "IR",
    lines: [
      { text: "Tell me a moment where something small felt like a rupture between you & I/your partner.", bold: true },
      { text: "What would have helped?" },
      { text: "What should I know to have that feel a bit lighter?" },
    ],
  },
  { id: 32, section: "IR", lines: [{ text: "Tell me your ideal day or date together." }] },
  { id: 33, section: "IR", lines: [{ text: "Tell me a time you felt uncomfortable but it brought us closer." }] },
  { id: 34, section: "IR", lines: [{ text: "Tell me a time you told a white lie to protect my feelings." }] },
  { id: 35, section: "IR", lines: [{ text: "Tell me what marriage/partnership means to you." }] },
  { id: 36, section: "IR", lines: [{ text: "Tell me a time you were infatuated with someone else." }] },
  { id: 37, section: "IR", lines: [{ text: "Tell me a time you felt taken advantage of in our relationship." }] },
  { id: 38, section: "IR", lines: [{ text: "Tell me a time you thought this was the end." }] },
  {
    id: 39,
    section: "IR",
    lines: [
      { text: "Tell me about an honest conversation you wish we’d have, but haven’t yet.", bold: true },
      { text: "What might make it easier?" },
    ],
  },
  {
    id: 40,
    section: "IR",
    lines: [
      { text: "Tell me about a time you chose not to express a desire or need.", bold: true },
      { text: "What stopped you?" },
      { text: "What do you wish had happened instead?" },
    ],
  },
  {
    id: 41,
    section: "IR",
    lines: [
      { text: "Tell me something you did that you wish you hadn’t.", bold: true },
      { text: "How did it impact us?" },
      { text: "What would you do differently now?" },
    ],
  },
  { id: 42, section: "IR", lines: [{ text: "Tell me what past relationships taught you about honesty." }] },
  { id: 43, section: "IR", lines: [{ text: "Tell me a pattern you’re afraid of repeating." }] },
  { id: 44, section: "IR", lines: [{ text: "Tell me what you were modelled about love growing up." }] },
  { id: 45, section: "IR", lines: [{ text: "Tell me a way you protect yourself emotionally, even from me." }] },
  {
    id: 46,
    section: "IR",
    lines: [
      { text: "Tell me about a way you’ve learned to receive love that once felt difficult or unlikely for you", bold: true },
    ],
  },
  { id: 47, section: "IR", lines: [{ text: "Tell me what’s changed about how you see me." }] },
  {
    id: 48,
    section: "IR",
    lines: [
      { text: "Tell me how you handle conflict", bold: true },
      { text: "What do you wish I knew about that?" },
    ],
  },
  { id: 49, section: "IR", lines: [{ text: "Tell me about a story you’ve made up about me that isn’t fully true." }] },
  { id: 50, section: "IR", lines: [{ text: "Tell me what support looks like for you in hard moments." }] },
  { id: 51, section: "IR", lines: [{ text: "Tell me about a time you felt misunderstood." }] },
  { id: 52, section: "IR", lines: [{ text: "Tell me what an apology means to you." }] },
  { id: 53, section: "IR", lines: [{ text: "Tell me how you’ve changed because of a challenge we faced." }] },
  {
    id: 54,
    section: "IR",
    lines: [
      { text: "Tell me how you’d like us to repair after disagreements.", bold: true },
      { text: "What makes it easier to stay present?" },
    ],
  },
  { id: 55, section: "IR", lines: [{ text: "Tell me when forgiveness felt hardest, and why." }] },
  { id: 56, section: "IR", lines: [{ text: "Tell me something from your past you want to heal together." }] },
  {
    id: 57,
    section: "IR",
    lines: [
      { text: "Tell me about a moment I surprised you in a good way", bold: true },
      { text: "How did it change your view of us?" },
    ],
  },
  { id: 58, section: "IR", lines: [{ text: "Tell me when you knew I was someone special to you." }] },
  { id: 59, section: "IR", lines: [{ text: "Tell me how you know we’re growing, even in hard seasons." }] },
  { id: 60, section: "IR", lines: [{ text: "Tell me how you’d like to handle stress differently, as a team." }] },

  // -------------------------
  // Touch & Desire (61–90)
  // -------------------------
  { id: 61, section: "TD", lines: [{ text: "Tell me something you love about intimacy." }] },
  { id: 62, section: "TD", lines: [{ text: "Tell me what you love about your own body." }] },
  { id: 63, section: "TD", lines: [{ text: "Tell me what you love about my body." }] },
  { id: 64, section: "TD", lines: [{ text: "Tell me something you want more of sexually." }] },
  { id: 65, section: "TD", lines: [{ text: "Tell me a desire you’ve never spoken out loud." }] },
  { id: 66, section: "TD", lines: [{ text: "Tell me a fantasy you’ve had—but never voiced." }] },
  { id: 67, section: "TD", lines: [{ text: "Tell me a moment you felt erotically free." }] },
  { id: 68, section: "TD", lines: [{ text: "Tell me how you want to be touched." }] },
  { id: 69, section: "TD", lines: [{ text: "Tell me how you want to touch me." }] },
  { id: 70, section: "TD", lines: [{ text: "Tell me what kind of touch makes you melt." }] },
  { id: 71, section: "TD", lines: [{ text: "Tell me what turns you on." }] },
  { id: 72, section: "TD", lines: [{ text: "Tell me what turns you off." }] },
  { id: 73, section: "TD", lines: [{ text: "Tell me something you wish would turn you on—but doesn’t." }] },
  { id: 74, section: "TD", lines: [{ text: "Tell me what body confidence looks like for you during intimacy." }] },
  { id: 75, section: "TD", lines: [{ text: "Tell me what safety in your body feels like." }] },
  { id: 76, section: "TD", lines: [{ text: "Tell me something you once believed about your body that you’ve since unlearned." }] },
  { id: 77, section: "TD", lines: [{ text: "Tell me something you say to yourself about your body when no one’s listening." }] },
  { id: 78, section: "TD", lines: [{ text: "Tell me a moment your body surprised you—by desire, resistance, or strength." }] },
  { id: 79, section: "TD", lines: [{ text: "Tell me a part of your body you used to hide but are learning to love." }] },
  { id: 80, section: "TD", lines: [{ text: "Tell me a part of your body you take real pride in & how you care for it." }] },
  { id: 81, section: "TD", lines: [{ text: "Tell me how you like to initiate physical intimacy—or wish you could." }] },
  { id: 82, section: "TD", lines: [{ text: "Tell me your favourite non-sexual way to feel close." }] },
  { id: 83, section: "TD", lines: [{ text: "Tell me one place you love being touched that isn’t typically erotic." }] },
  { id: 84, section: "TD", lines: [{ text: "Tell me how often you want physical intimacy." }] },
  {
    id: 85,
    section: "TD",
    lines: [
      { text: "Tell me what intimacy means to you.", bold: true },
      { text: "Is it different from Physical or Erotic Touch?" },
    ],
  },
  {
    id: 86,
    section: "TD",
    lines: [
      { text: "Tell me something that turns you on that has nothing to do with physical or erotic touch.", bold: true },
    ],
  },
  { id: 87, section: "TD", lines: [{ text: "Tell me how you feel about initiating vs receiving." }] },
  { id: 88, section: "TD", lines: [{ text: "Tell me a time intimacy brought you comfort after a hard day." }] },
  { id: 89, section: "TD", lines: [{ text: "Tell me something that has you feel most alive in your body." }] },
  {
    id: 90,
    section: "TD",
    lines: [
      { text: "Tell me what small act of Touch grounds you.", bold: true },
      { text: "This could be Emotional, Physical, Energetic, Spiritual or Erotic Touch" },
    ],
  },

  // -------------------------
  // Healing & Growth (91–120)
  // -------------------------
  { id: 91, section: "HG", lines: [{ text: "Tell me what you were taught about sexuality growing up." }] },
  { id: 92, section: "HG", lines: [{ text: "Tell me what you wish had been said about sex in your family." }] },
  { id: 93, section: "HG", lines: [{ text: "Tell me something you’re still healing from sexually." }] },
  { id: 94, section: "HG", lines: [{ text: "Tell me how you feel about your past lovers." }] },
  { id: 95, section: "HG", lines: [{ text: "Tell me what regret you carry around sex or intimacy." }] },
  { id: 96, section: "HG", lines: [{ text: "Tell me a sexual experience that felt sacred." }] },
  { id: 97, section: "HG", lines: [{ text: "Tell me a sexual experience that had you shrink." }] },
  { id: 98, section: "HG", lines: [{ text: "Tell me a boundary you’ve had to set sexually & how it helped." }] },
  { id: 99, section: "HG", lines: [{ text: "Tell me what you’ve learned about desire that surprised you." }] },
  { id: 100, section: "HG", lines: [{ text: "Tell me something you were ashamed of & what helped shift that." }] },
  { id: 101, section: "HG", lines: [{ text: "Tell me something you’ve endured sexually that didn’t feel good." }] },
  { id: 102, section: "HG", lines: [{ text: "Tell me something about sex you still find awkward." }] },
  { id: 103, section: "HG", lines: [{ text: "Tell me how you want to feel after sex." }] },
  { id: 104, section: "HG", lines: [{ text: "Tell me what emotional safety during sex looks like for you." }] },
  { id: 105, section: "HG", lines: [{ text: "Tell me what role humour plays in your intimate life." }] },
  { id: 106, section: "HG", lines: [{ text: "Tell me something that felt rebellious or freeing in your body." }] },
  { id: 107, section: "HG", lines: [{ text: "Tell me what you used to chase & no longer need." }] },
  { id: 108, section: "HG", lines: [{ text: "Tell me what unspoken rule you’re breaking by being with me." }] },
  { id: 109, section: "HG", lines: [{ text: "Tell me how your desire has changed over time." }] },
  { id: 110, section: "HG", lines: [{ text: "Tell me a moment you felt both scared and alive in our intimacy." }] },
  { id: 111, section: "HG", lines: [{ text: "Tell me something about your body you’re learning to forgive." }] },
  { id: 112, section: "HG", lines: [{ text: "Tell me about a time you felt healing through Physical or Erotic Touch." }] },
  {
    id: 113,
    section: "HG",
    lines: [
      { text: "Tell me a secret you’re ready to reveal—big or small", bold: true },
      { text: "What had you wait?" },
    ],
  },
  {
    id: 114,
    section: "HG",
    lines: [
      { text: "Tell me about something you feel guilty around in our relationship.", bold: true },
      { text: "How does it impact us?" },
    ],
  },
  { id: 115, section: "HG", lines: [{ text: "Tell me what old story about intimacy you’re rewriting." }] },
  { id: 116, section: "HG", lines: [{ text: "Tell me who taught you the most about love." }] },
  { id: 117, section: "HG", lines: [{ text: "Tell me something that had you laugh in an awkward moment together." }] },
  { id: 118, section: "HG", lines: [{ text: "Tell me a time your intuition around touch was right." }] },
  { id: 119, section: "HG", lines: [{ text: "Tell me what you wish your parents or caregivers knew about your needs." }] },
  { id: 120, section: "HG", lines: [{ text: "Tell me how you’d like to honor our growth together." }] },

  // -------------------------
  // Play & Discovery (121–150)
  // -------------------------
  { id: 121, section: "PD", lines: [{ text: "Tell me a sensual ritual you wish we did more often." }] },
  { id: 122, section: "PD", lines: [{ text: "Tell me something you dream of doing together—but haven’t said yet." }] },
  { id: 123, section: "PD", lines: [{ text: "Tell me your favourite time of day for sex & why." }] },
  { id: 124, section: "PD", lines: [{ text: "Tell me the wildest place you’ve thought about having sex." }] },
  { id: 125, section: "PD", lines: [{ text: "Tell me something playful you want to try in bed." }] },
  { id: 126, section: "PD", lines: [{ text: "Tell me what “being adored” feels like in your body." }] },
  { id: 127, section: "PD", lines: [{ text: "Tell me one thing you’d tell your 15-year-old self about sex and love." }] },
  { id: 128, section: "PD", lines: [{ text: "Tell me a time you felt fully chosen by me." }] },
  { id: 129, section: "PD", lines: [{ text: "Tell me one act of devotion you’d love to receive." }] },
  { id: 130, section: "PD", lines: [{ text: "Tell me how we can create more moments that feel like us." }] },
  { id: 131, section: "PD", lines: [{ text: "Tell me your favorite flirty memory with me." }] },
  { id: 132, section: "PD", lines: [{ text: "Tell me a game you want to invent together." }] },
  { id: 133, section: "PD", lines: [{ text: "Tell me a way you wish we played more as adults." }] },
  { id: 134, section: "PD", lines: [{ text: "Tell me a playful tradition we could start." }] },
  { id: 135, section: "PD", lines: [{ text: "Tell me a way you show devotion without saying a word." }] },
  { id: 136, section: "PD", lines: [{ text: "Tell me what “home” feels like in our connection." }] },
  { id: 137, section: "PD", lines: [{ text: "Tell me the most surprising ‘yes’ you’ve said to me." }] },
  { id: 138, section: "PD", lines: [{ text: "Tell me how you want us to commemorate a milestone together." }] },
  { id: 139, section: "PD", lines: [{ text: "Tell me a fantasy from romance stories that inspires you." }] },
  { id: 140, section: "PD", lines: [{ text: "Tell me about a place you want to travel as a couple and why." }] },
  { id: 141, section: "PD", lines: [{ text: "Tell me a way you’d like to mark a fresh start together." }] },
  { id: 142, section: "PD", lines: [{ text: "Tell me what everyday adventure you want to try with me." }] },
  { id: 143, section: "PD", lines: [{ text: "Tell me how you want us to plan fun together." }] },
  { id: 144, section: "PD", lines: [{ text: "Tell me a favorite date you’d want to repeat annually." }] },
  { id: 145, section: "PD", lines: [{ text: "Tell me one thing you want to celebrate about us right now." }] },
  { id: 146, section: "PD", lines: [{ text: "Tell me a song that captures our energy." }] },
  { id: 147, section: "PD", lines: [{ text: "Tell me about a time laughter strengthened our bond." }] },
  { id: 148, section: "PD", lines: [{ text: "Tell me a secret sign or code you want for us." }] },
  { id: 149, section: "PD", lines: [{ text: "Tell me about a simple kindness you want to exchange more." }] },
  { id: 150, section: "PD", lines: [{ text: "Tell me what small thing has you feel most In Touch with yourself in daily life." }] },
];
