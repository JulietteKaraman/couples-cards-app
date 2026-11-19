// THE SCRUMPTIOUSNESS JOURNAL, her words. specs/scrumptiousness-journal-and-poems.md.
// Generated 19 Nov 2026 from her fillable PDF "THE SCRUMPTIOUSNESS JOURNAL Filleable.pdf" (interior
// pages 4 to 106 of the book), then proofread page by page against page images. Words are hers,
// verbatim, in her order. Spacing slips from the PDF text (letter-spaced headings, words split
// across lines) are fixed; nothing is reworded. A box is one writing area on the printed page
// (a block of ruled lines or a grey box). Do not retype or reword anything in this file.

export type JItem =
  | { t: "text"; k: "title" | "kicker" | "sub" | "p"; text: string }
  | { t: "box"; id: string; lines: number; label?: string };
export type JPage = { n: number; items: JItem[] };

export const COVER = {
  by: "By Juliette Karaman",
  title: "The Scrumptiousness Journal",
  line: "A journal filled with prompts, practices and meditations.",
  copyright: "Copyright © 2024. All rights reserved. No parts of the publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without prior written permission from the publisher.",
};

// The QR codes printed in the book, read from the PDF. Each one is a button under the words that
// introduce it. A page with no entry shows nothing. Add a page number and a link to add another.
export const JOURNAL_AUDIO: Record<number, { href?: string; src?: string; label: string; at?: { x: number; y: number; w: number } }> = {
  5: { href: "https://open.spotify.com/show/50jFN83FxoNm0UXiryqkJW?si=747b1c583ba54267", label: "Listen to The Scrumptious Woman Podcast" },
  10: { href: "https://open.spotify.com/playlist/3wbOkK1VuROI4lKrqTQwST?si=a9587235ca6d4ce1", label: "Listen to the self-care and self-love playlist" },
  // Page 16: the book's QR code pointed at feelfullyyou.com/r4hypnosis/, a 404 (checked 19 Nov 2026). The right recording is
  // the one that asks "What's that thought? What's the sensation?". "R4 for body wisdom part 1" was tried and is NOT it (a
  // different triangle exercise that stops mid-way at 10:24). The right one, listened to 19 Nov 2026 (image, thought, body
  // sensation, emotion; 5:39; ends "Your safe place."): "Time to come back to a safe place to feeling fully you" (Drive, Audios/Meditations).
  16: { src: "/scrumptiousness-journal/audio/time-to-come-back-to-a-safe-place.m4a", label: "Time to come back to a safe place", at: { x: 0.1, y: 0.2, w: 0.8 } },
  30: { href: "https://open.spotify.com/playlist/4Yswo5dbDUnNIfZfZC8vS5?si=74eb7dde41aa4edd", label: "Listen to the playlist" },
};

export const JOURNAL_BOX_TOTAL = 229;

export const JOURNAL_PAGES: JPage[] = [
 {
  "n": 4,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "PREFACE"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SCRUMPTIOUSNESS, SENSUALITY AND THE LIFE FORCE RUNNING THROUGH US HAVE ALWAYS BEEN VERY POTENT IN MY LIFE."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The sensation of feeling free, vibrant and alive with a keen connection to my body, emotions and nature. I lay on the damp grass, feeling the earth underneath me, supporting me. The scent of flowers wafted by as I enjoyed the summer sun on my shoulders, a slight breeze ruffling my hair. Moments of complete oneness, where thoughts and emotions would come in and out, and cherishing the moments of being alone with what is."
   },
   {
    "t": "text",
    "k": "p",
    "text": "I want you to know that even if this was not your experience growing up, and that you may not be able to concur up a memory like that, you are exactly at the place you are meant to be now!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "There is a reason you chose this book and this time—"
   },
   {
    "t": "text",
    "k": "p",
    "text": "A time to PAUSE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "A time to come back to yourself fully."
   },
   {
    "t": "text",
    "k": "p",
    "text": "A time to FEEL."
   },
   {
    "t": "text",
    "k": "p",
    "text": "A time to notice your energy."
   },
   {
    "t": "text",
    "k": "p",
    "text": "I would like you to imagine what it would feel like to be fully aware of your emotions, your senses, and what is happening in your body."
   },
   {
    "t": "text",
    "k": "p",
    "text": "This may be discombobulating at first, yet it is a practice of TRUST in YOURSELF! Believe that you are able to trust yourself to be in constant communication with your scrumptiousness and body, slowing down enough to hear the whispers... They do not have to become screams, and I learned the hard way..."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We often forget to tune into our own needs and continue on regardless of what is happening inside us. This is a journey of discovering what truly lights you up so that this becomes the compass by which you navigate your days. The feeling of being so utterly comfortable and confident in WHO you are and how this radiates out to those around you. This REMEMBERING of your TRUE SCRUMPTIOUSNESS!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "The Scrumptiousness Journal was created to encourage you to reflect on your life and use that awareness!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "By Scrumptiousness, I mean the life force, the chi, the prana that moves through us, having us feel fully alive. For some of you, this may feel like a distant memory; others may be more intimately connected to it. Become intimate with the most important person in your life: YOURSELF!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "This is your chance to (re) start the journey to be your most Scrumptious & Alive SELF!"
   }
  ]
 },
 {
  "n": 5,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "THE SCRUMPTIOUS WOMAN® with"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "JULIETTE KARAMAN"
   },
   {
    "t": "text",
    "k": "title",
    "text": "MEET THE AUTHOR"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scan the QR code below to listen to The Scrumptious Woman Podcast"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "JULIETTE KARAMAN-VAN SCHAARDENBURG IS A MENTOR, AUTHOR, AND GUIDE SPECIALISING IN EMPOWERING VISIONARIES AND LEADERS TO TRANSFORM THEIR LIVES."
   },
   {
    "t": "text",
    "k": "p",
    "text": "With a focus on relationships, sexual trauma, body shame, grief, healing, and spirituality, she focuses on reinventing the most important relationship of all—the one you have with yourself and the one you have with the world."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Her mission: a world where pleasure, scrumptiousness, spirituality, and sensuality reign. Through coaching, teaching the Rapid Release Rewire and Restore Method ®️, retreats, attunements and her podcast, The Scrumptious Woman®️, which is in the top 2.5% globally -she impacts hundreds of thousands of lives."
   },
   {
    "t": "text",
    "k": "p",
    "text": "With fierce love for her 4 young adult children, partner, dog & friends, she embraces life with joy and contagious laughter."
   }
  ]
 },
 {
  "n": 6,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "THE GREATEST THING IN THE WORLD IS TO KNOW HOW TO BELONG TO ONESELF."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- MICHEL DE MONTAIGNE"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "(Often attributed to Virginia Woolf)"
   }
  ]
 },
 {
  "n": 7,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "HOW TO USE THIS"
   },
   {
    "t": "text",
    "k": "title",
    "text": "Journal..."
   },
   {
    "t": "text",
    "k": "sub",
    "text": "The Scrumptiousness Journal is a journal filled with prompts, practices and meditations to bring AWARENESS of all the energetic, emotional and somatic interference that is still present in your life."
   },
   {
    "t": "text",
    "k": "p",
    "text": "It will give you the tools what to do with this awareness to explore and become intimate with ALL aspects of your SCRUMPTIOUS SELF!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "This journal will help you begin the ritual of embodied Scrumptious Self Love!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Each day you connect with this journal, you will begin to awaken new parts of yourself and explore new ways of seeing and experiencing your body."
   },
   {
    "t": "text",
    "k": "p",
    "text": "As you work through the Scrumptiousness Journal, you will be given prompts and exercises intended to have you become more aware of your senses, thoughts, emotions, and body sensations."
   },
   {
    "t": "text",
    "k": "p",
    "text": "It will have you examine anything that may be in the way of being fully present and feeling fully you."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scrumptiousness and Self-Love are central to this journey that you are embarking on by using this journal."
   },
   {
    "t": "text",
    "k": "p",
    "text": "While tapping into that, self-love becomes not only more manageable and fun but also an extension of who you are energetically."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scrumptiousness is deeply connected to many other things—how we see ourselves, the space we allow our bodies to occupy, and how safe we feel in expressing ourselves fully."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Being visible to the world in our SCRUMPTIOUSNESS and whole BEING can sometimes feel daunting."
   },
   {
    "t": "text",
    "k": "p",
    "text": "My wish for you is that after working your way through this journal, you will feel empowered and able to be your full self."
   },
   {
    "t": "text",
    "k": "p",
    "text": "To truly trust yourself implicitly—in public and in private!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "You will find prompts and exercises on many topics, from body acceptance to energetics to recognising your NOs and YESs."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Some prompts may be questions you answer journal-style, while others will invite you to complete an action, putting Scrumptiousness at the centre."
   },
   {
    "t": "text",
    "k": "p",
    "text": "When you see QR codes in the book, I will provide a meditation, hypnosis session, or a playlist to deepen your practice of becoming your most Scrumptious self!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "You can work through this journal from the front to the back or use it as an oracle, opening a page and trusting that you will receive the medicine you need."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scrumptiousness is not rigid but rather flowing, and so is this journal."
   },
   {
    "t": "text",
    "k": "p",
    "text": "You are implicitly building up your energetic capacity to trust yourself and the Scrumptiousness of your life."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Above all, respect the process!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "You may want to hurry through and tick it off your to-do list, but you may be avoiding feeling certain emotions or body sensations."
   },
   {
    "t": "text",
    "k": "p",
    "text": "If it feels too much for you to do that day, feel free to pause it and instead turn to the process I am teaching you to bring the experience down to 4 elements: a thought, an image, a body sensation and an emotion."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The more aware we become, the more we tap into what is happening!"
   }
  ]
 },
 {
  "n": 8,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "BE THE CHANGE YOU WISH TO SEE IN THE WORLD!"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- GANDHI"
   }
  ]
 },
 {
  "n": 9,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "SCRUMPTIOUSNESS"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "WHAT DOES THAT EVEN MEAN..."
   },
   {
    "t": "text",
    "k": "sub",
    "text": "As an intimacy and relationship coach, the use of words like pleasure, orgasm, sensuality and sexuality often got me banned on social media."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SO, I LOOKED AROUND FOR A WORD THAT FELT SENSUOUS AND PERHAPS A BIT RISQUÉ AND SENSUAL...."
   },
   {
    "t": "text",
    "k": "p",
    "text": "SCRUMPTIOUS to me, is an Onomatopoetic word, it so resembles the sound it makes as it is spoken out loud."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Think of Marilyn Monroe whispering “Scrumptious”.... and what does it evoke in you?"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scrumptiousness is the process of being utterly connected to your SELF, your body, your senses, your spirit."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Knowing exactly what HAS you feel good. (Nothing can MAKE you feel a certain way- but it can “Have” you feel something)"
   },
   {
    "t": "text",
    "k": "p",
    "text": "It is about this deep knowledge, the remembering of what brings you this scrumptiousness that courses through our veins."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The gurus may call it Chi, Prana, Orgasm, or Life Force."
   },
   {
    "t": "text",
    "k": "p",
    "text": "It is about being present and curious- with yourself and with life and how you interact with the energetic world."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Think of a moment you saw such a breath-taking view that it had you pause and take the time to take that in fully. Now, years later, you still remember the FEELING it evoked in you!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Perhaps a moment that you bit into a ripe peach and had the juices drip down your wrist with each bite. The sweet nectar hits your taste buds in a way that you can almost taste it now."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Perhaps it was a moment looking at the white cotton clouds which were moving by, feeling as if time has stopped..."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The smell of jasmine in the warm sun, takes you back to a summer love years ago, when you were care-free."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Your hips and shoulders start to sway automatically when you hear a certain song... muscle memory as your body starts to move and remember."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Coming into a room you have never been in and the feeling of Deja Vu strong upon you. Was it in a different life-time? Is this intuition real or imagined?"
   },
   {
    "t": "text",
    "k": "p",
    "text": "No one needs to teach you how to tap into SCRUMPTIOUSNESS, we all have it inherently in us and you can access it at any time..."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Yet it helps to RELEASE old habits, REWIRE new ones, RECLAIM your SCRUMPTIOUSNESS and RESTORE your ESSENCE to the FULL YOU!!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "I am excited for you to delve into this journal which takes you on this reclamation journey!"
   }
  ]
 },
 {
  "n": 10,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "SETTING YOURSELF UP FOR"
   },
   {
    "t": "text",
    "k": "title",
    "text": "Success:"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TO GET THE MOST OUT OF FEELING YOUR MOST SCRUMPTIOUS SELF, I SUGGEST USING THIS JOURNAL IF NOT DAILY, DEFINITELY A FEW TIMES A WEEK."
   },
   {
    "t": "text",
    "k": "p",
    "text": "There may be a specific time of the day that you can dedicate to this practice."
   },
   {
    "t": "text",
    "k": "p",
    "text": "You may want to create a little ritual for yourself."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Make your favourite hot drink, light a candle, and find a cosy place where you have the space to feel and move if your body wants to."
   },
   {
    "t": "text",
    "k": "p",
    "text": "You may want to put a playlist on to settle into the beingness of you."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scan the QR code below to listen to a self-care/self-love playlist that I created:"
   }
  ]
 },
 {
  "n": 11,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Your Intentions"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "FOR THIS JOURNAL"
   },
   {
    "t": "text",
    "k": "p",
    "text": "BEFORE YOU BEGIN, IT IS IMPORTANT TO BECOME AWARE OF how you would like to engage with the prompts, exercises and meditations."
   },
   {
    "t": "box",
    "id": "p11a1",
    "lines": 23
   }
  ]
 },
 {
  "n": 12,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What are you hoping to learn about yourself?"
   },
   {
    "t": "box",
    "id": "p12a1",
    "lines": 27
   }
  ]
 },
 {
  "n": 13,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What are you hoping to reclaim within yourself?"
   },
   {
    "t": "box",
    "id": "p13a1",
    "lines": 27
   }
  ]
 },
 {
  "n": 14,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "AND I WOULD FIND MYSELF AGAIN. NOT THE SAME VERSION OF ME THAT I WAS LOOKING FOR, BUT A STRONGER VERSION. A WISER VERSION. A WOMAN WHO KNEW THAT SHE WAS ENOUGH, JUST AS SHE WAS. A WOMAN WHO HAD BEEN TRIED IN THE FIRE BUT, INSTEAD OF BEING BURNED BY IT, CAME OUT GOLD. A WOMAN WHO FINALLY, AFTER DOUBTING AND QUESTIONING AND STRIVING AND HUSTLING FOR HER WORTH FOR YEARS . . . FINALLY, FINALLY CAME TO THE REALIZATION THAT SHE WAS AND IS AND HAS ALWAYS BEEN . . . ENOUGH."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- MANDY HALE"
   }
  ]
 },
 {
  "n": 15,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is your initial thought on Scrumptiousness? What does the word evoke in you?"
   },
   {
    "t": "box",
    "id": "p15a1",
    "lines": 27
   }
  ]
 },
 {
  "n": 16,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "NOW THAT YOU HAVE GONE THROUGH A FEW PROMPTS IN THIS JOURNAL, LISTEN TO THIS RECORDING"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "THIS IS A SPECIALLY RECORDED HYPNOSIS TO SET YOU UP FOR SUCCESS IN YOUR SCRUMPTIOUS WOMAN SELF-LOVE JOURNEY."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We often have good intentions, but life gets in the way."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Once we can get our subconscious to help, the Self- Love journey and the Journey back to Feeling Fully yourself become much easier."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Give yourself 20 minutes in a safe, quiet space where you can sit down alone, undisturbed, and have your neck and shoulders supported."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Put your headphones on and load the above relaxing hypnosis."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Please feel free to repeat this as many times as you want to."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Research has shown that for something to become a habit, it takes at least 21 days."
   },
   {
    "t": "text",
    "k": "p",
    "text": "How about you give yourself the gift of listening to this meditation every day for the next month?"
   }
  ]
 },
 {
  "n": 17,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "WHAT FILLS your cup"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SELF-CARE IS NOT SELFISH!"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "It is essential to your well-being. When you take care of yourself, you fill your own cup, and once we are filled up, only then does it feel truly Scrumptious to give to others- and for them to RECEIVE it!"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SELF-CARE IS MORE THAN FACE MASKS AND PEDICURES."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Although those things can be part of a self-care routine, they are not the only things that make up self-care."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Self-care is about taking care of your whole self –"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "BODY, MIND, AND SPIRIT- IN THE MOST SCRUMPTIOUS WAY!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "It is crucial to find a balance between taking care of yourself and taking care of others."
   },
   {
    "t": "text",
    "k": "p",
    "text": "You cannot pour from an empty cup!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "In order to be there for others, make sure that you are taking care of yourself first!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "The goal of this journal is to help you explore all aspects of this and find out what works best for YOU."
   },
   {
    "t": "text",
    "k": "p",
    "text": "What are the things that are a needle mover in your life?"
   },
   {
    "t": "text",
    "k": "p",
    "text": "The things that have you feel replenished and keep you going. We are so often focussed on what is NOT going well, that we forget to notice what does fill us up! You will see that I have you look at the sentence, “Makes me feel”- NOTHING and NO-ONE can MAKE you FEEL a certain way!!!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "The only one that can do that is YOU!!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "It is the meaning that you attribute to how something or someone HAS you FEEL! So, let’s take back that power and realise no one can MAKE you do or feel anything. You are your own creator!"
   }
  ]
 },
 {
  "n": 18,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "I AM NOT A VICTIM. NO MATTER WHAT I HAVE BEEN THROUGH, I’M STILL HERE. I HAVE A HISTORY OF VICTORY."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- STEVE MARABOLI"
   }
  ]
 },
 {
  "n": 19,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "Make a list of things that have you feel happy."
   },
   {
    "t": "box",
    "id": "p19a1",
    "lines": 11
   },
   {
    "t": "text",
    "k": "p",
    "text": "Make a list of people who have you feel good about yourself."
   },
   {
    "t": "box",
    "id": "p19a2",
    "lines": 11
   }
  ]
 },
 {
  "n": 20,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "Make a list of things you like to do for fun."
   },
   {
    "t": "box",
    "id": "p20a1",
    "lines": 11
   },
   {
    "t": "text",
    "k": "p",
    "text": "What are the qualities you love about yourself- Name at least 5!"
   },
   {
    "t": "box",
    "id": "p20a2",
    "lines": 11
   }
  ]
 },
 {
  "n": 21,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What are 3 things that had you smile today?"
   },
   {
    "t": "box",
    "id": "p21a1",
    "lines": 9
   },
   {
    "t": "text",
    "k": "p",
    "text": "Make a list of things that have you feel calm and relaxed."
   },
   {
    "t": "box",
    "id": "p21a2",
    "lines": 13
   }
  ]
 },
 {
  "n": 22,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "CREATE A ROUTINE THAT INCORPORATES SOME/ALL OF THE ITEMS FROM YOUR LISTS."
   },
   {
    "t": "text",
    "k": "p",
    "text": " Pick one or two items from each list and do them every day"
   },
   {
    "t": "text",
    "k": "p",
    "text": " Make a schedule that includes time for your self-care activities"
   },
   {
    "t": "text",
    "k": "p",
    "text": " Add new items to your lists as you think of them"
   },
   {
    "t": "text",
    "k": "p",
    "text": " Stick to your schedule as much as possible"
   },
   {
    "t": "text",
    "k": "p",
    "text": " Take a break when you need it – if you’re feeling overwhelmed, take a few days off from your schedule to relax and recharge"
   },
   {
    "t": "text",
    "k": "p",
    "text": " Be flexible – if something comes up that you can’t do, don’t stress about it, just try to do it another day."
   },
   {
    "t": "text",
    "k": "title",
    "text": "Celebrate"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "YOUR SUCCESSES"
   },
   {
    "t": "text",
    "k": "p",
    "text": "– each time you stick to your schedule, give yourself a pat on the back!"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "EVERY TIME WE CELEBRATE, WE ANCHOR IN THAT FEELING, CREATING A NEW NEURAL PATHWAY."
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is one thing can you do for yourself this week to celebrate?"
   },
   {
    "t": "box",
    "id": "p22a1",
    "lines": 9
   }
  ]
 },
 {
  "n": 23,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "WHEN YOU ADOPT THE VIEWPOINT THAT THERE IS NOTHING THAT EXISTS THAT IS NOT PART OF YOU, THAT THERE IS NO ONE WHO EXISTS WHO IS NOT PART OF YOU, THAT ANY JUDGMENT YOU MAKE IS SELF-JUDGMENT, THAT ANY CRITICISM YOU LEVEL IS SELF-CRITICISM, YOU WILL WISELY EXTEND TO YOURSELF AN UNCONDITIONAL LOVE THAT WILL BE THE LIGHT OF THE WORLD."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- HARRY PALMER"
   }
  ]
 },
 {
  "n": 24,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "BODY Awareness"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "DO YOU KNOW THAT YOUR BODY IS AMAZING?"
   },
   {
    "t": "text",
    "k": "p",
    "text": "It can move, jump, dance, and even talk to you! Yet we may not always be listening..."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Body awareness means paying attention to what your body is telling you."
   },
   {
    "t": "text",
    "k": "p",
    "text": "When you feel hot or cold, hungry or full, or tired or energized, that’s your body talking to you."
   },
   {
    "t": "text",
    "k": "p",
    "text": "By noticing these signals, you can start to communicate with your body better and feel your best."
   },
   {
    "t": "text",
    "k": "p",
    "text": "You can also learn to appreciate all the incredible things your body can do and be kinder to yourself."
   },
   {
    "t": "text",
    "k": "p",
    "text": "So, let’s learn how to listen to our amazing bodies!"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "FELT SENSE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "So often we do not exactly know what we are feeling in our bodies and we often confuse our emotions with sensations that are occurring or are absent in our bodies."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The lists below start to give you the vocabulary to express what you are feeling inside."
   },
   {
    "t": "text",
    "k": "p",
    "text": "For Example:"
   },
   {
    "t": "text",
    "k": "p",
    "text": "I feel a smooth, Icy cold pressure in my right eyelid. It is static, prickly, and metallic. It is grey in colour and feels really heavy."
   },
   {
    "t": "text",
    "k": "p",
    "text": "You can probably feel in your body what that example would feel like for you!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "This is what we are trying to achieve, to be able to communicate what we are feeling at each given moment!"
   }
  ]
 },
 {
  "n": 25,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "TEMPERATURE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Frozen Boiling Icy Steaming Cold Melting Cool Chilly Numb Glowing Warm Simmering Hot"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "MOTION"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Falling Swirling Rising Accelerating Opening Ascending Streaming Friction Steady Contracting Grinding Dragging Rotating Dripping Spiralling Effervescent Bursting Fizzy Gushing Constricting"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SHAPE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Deep Hollow Elevated Tubular Flat Cocooned Elongated Undulating Spherical Shallow Column Spikey Circle Zigzag Line Boundless"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "VIBRATION"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Vibrating Oscillating Pulsating Quivering Buzzing Shaking Jittery Shivering Fluttery Staccato Intermittent Throbbing Zinging Trembling"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TEXTURE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Smooth Metallic Velvety Rough Buttery Jagged Slippery Raw Raggedy Furry Sharp Crispy Wavy Spongy Fluffy Bumpy"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "PRESSURE/TENSION"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Loose Clamping Light Buoyant Opening Energised Feather-light Pinching Open Engorged Tight Full Implosive Heavy Explosive Limp Empty Charged"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "PLEASURE/PAIN"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Burning Tingling Irritating Itchy Electric Crampy Stinging Numb Intense Soothing Tickley Tender Electric Antsy Achy Growly Scratchy Prickly Queasy"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "COLOUR"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Black Bright Blue Glowing Maroon Radiating Red Luminescent Yellow Incandescent Green Obscure Purple Dark White Clear Pink Transparent"
   }
  ]
 },
 {
  "n": 26,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "TASTE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Tangy Honeyed Metallic Caramel Sweet Herbal Bitter Sour Dry Acidic Quenched Creamy Slimy Buttery Salty Tart Savoury Smoky Fruity Mild"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "WHOLE BODY SENSATIONS"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Light Heavy Calm Thick Fidgety Trembling Jumpy Vibrating Tingling Flaccid Faint Full Fuzzy Puffy Spinning Gurgling Buzzing Energised Twirling"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONSTRICTION SENSATIONS"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Stuck Tense Contracted Constricted Knotted Breathless Dwindling Suffocating Blocked Grinding Congested"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "MUSCLE SENSATIONS"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Trembly Pulsing Achy Fluttery Zinging Quivering Shuddering Shaky Crampy Tense Staccato Throbbing Shivery Spasming Twitchy Jittery"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "INTENSITY SENSATIONS"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Sharp Solid Dull Dense Clamping Limp Intense Tender Weak Smooth Crampy Bursting Hard Gushing Soft Sparkly"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "EXPANSION SENSATIONS"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Expansive Glowing Moving Waves Floating Streaming Fluid Charged Energised Relaxed Radiating"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SKIN SENSATIONS"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Itchy Flushed Prickly Goosebumps Burning Drenched Tingly Stingy Sweaty Damp Moist Sticky Clammy Dry"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "“Believe you can and you’re already halfway there. Doubt kills more dreams than failure ever will”"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- SUZY KASSEM"
   }
  ]
 },
 {
  "n": 27,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "THE MOST POWERFUL RELATIONSHIP YOU WILL EVER HAVE IS THE RELATIONSHIP WITH YOURSELF."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- DIANE VON FURSTENBERG"
   }
  ]
 },
 {
  "n": 28,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "HOW YOU SPEAK TO YOURSELF IS IMPORTANT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Our bodies do not forget, and all of what we have said about it and the feelings it evoked in us, are embedded into it!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Mirror work has been an incredible way to start to bring awareness to how you view yourself! Set a timer for 3 minutes and look at yourself in the mirror."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Take a deep breathe in through your nose and out through your mouth, let the exhale be longer than the inhale. Repeat this 3 times."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Scrunch your shoulders all the way up to your ears and then drop them. Do this 3 times."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "NOW IT IS YOUR TURN TO TRY AND USE THIS DESCRIPTIVE LANGUAGE TO TAP INTO WHAT SENSATIONS ARE COMING UP IN YOUR BODY."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Pick one body part and use different words from the lists to describe what is going on for you."
   },
   {
    "t": "text",
    "k": "p",
    "text": "How do you feel in your body now?"
   },
   {
    "t": "box",
    "id": "p28a1",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What are you more aware of now?"
   },
   {
    "t": "box",
    "id": "p28a2",
    "lines": 4
   },
   {
    "t": "text",
    "k": "sub",
    "text": "“Don’t wait until you’re perfect to love yourself. You are perfect now, as you are.”"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- ANONYMOUS"
   }
  ]
 },
 {
  "n": 29,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What happens when you use this descriptive language now?"
   },
   {
    "t": "box",
    "id": "p29a1",
    "lines": 25
   }
  ]
 },
 {
  "n": 30,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "I WOULD LOVE YOU TO DELVE DEEPER INTO THIS AND CREATE A PRACTICE FOR YOURSELF OF FEELING."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Find a comfortable place to lay down or sit down. Either set a timer for 10 minutes or allow yourself to complete the playlist."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Listen to the playlist I created for this exercise. Take a few deep breaths, in through your nose, out through the mouth."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Quiet the internal noise. Tune into yourself. FEEL!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Listen to the language your body speaks- it may be whispering at the moment…."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Move if you desire, and, go to that place…"
   },
   {
    "t": "text",
    "k": "p",
    "text": "The place that you feel most connected, most alive, most embodied, most scrumptious."
   },
   {
    "t": "text",
    "k": "p",
    "text": "When the time you have set yourself- or the playlist is over, grab your journal and brain dump, allow the words to pour out of you onto the page, no punctuation, not stopping for anything, just let it flow."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Some of you prefer to voice record or type; that is totally cool too. I like to go into nature immediately afterwards, put my headphones on and voice record."
   },
   {
    "t": "box",
    "id": "p30a1",
    "lines": 1
   },
   {
    "t": "box",
    "id": "p30a2",
    "lines": 1
   }
  ]
 },
 {
  "n": 31,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Brain"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "DUMP"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Use this to Brain dump all that came up:"
   },
   {
    "t": "box",
    "id": "p31a1",
    "lines": 26
   }
  ]
 },
 {
  "n": 32,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "ANSWER THIS QUESTION:"
   },
   {
    "t": "text",
    "k": "p",
    "text": "If my body could tell me anything right now … What does she have to say to me?"
   },
   {
    "t": "box",
    "id": "p32a1",
    "lines": 23
   },
   {
    "t": "text",
    "k": "sub",
    "text": "\"Your body hears everything your mind says.\""
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- NAOMI JUDD"
   }
  ]
 },
 {
  "n": 33,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "TO FALL IN LOVE WITH YOURSELF IS THE FIRST SECRET TO HAPPINESS."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- ROBERT MORELY"
   }
  ]
 },
 {
  "n": 34,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "I WILL TEACH YOU THE FIRST PART OF A TRINITY EXERCISE I LEARNED FROM MAMA GENA YEARS AGO AND ADAPTED TO HOW IT FEELS ALIGNED FOR MY CLIENTS AND MYSELF."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Bruce Lee’s philosophy, “Absorb what is useful, reject what is useless and add what is your own”, is how I lead a Scrumptious life."
   },
   {
    "t": "text",
    "k": "p",
    "text": "For this month, I would love you to do the following exercise EVERY DAY!!! (It becomes a habit after 21-28 days of doing something, and we no longer have to use our conscious brain to do this task.) Hello neural pathways!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Bragging is something that most of us have been taught is “not acceptable”. It is boastful to take pride in your qualities, possessions or accomplishments. Celebrating yourself also comes with quite a negative connotation."
   },
   {
    "t": "text",
    "k": "p",
    "text": "“You are too big for your own shoes” “Pompous”"
   },
   {
    "t": "text",
    "k": "p",
    "text": "“Be humble” “Stuck up”"
   },
   {
    "t": "text",
    "k": "p",
    "text": "“You are so into yourself!” “Pretentious”"
   },
   {
    "t": "text",
    "k": "p",
    "text": "“Children should be seen, not heard” “Self-important”"
   },
   {
    "t": "text",
    "k": "p",
    "text": "“You are so vain and uppity” “Egotistic”"
   },
   {
    "t": "text",
    "k": "p",
    "text": "I am sure you have quite a few of your own that you heard growing up or even have said a few to yourself or your kids, nephews, or co-workers!"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "SO, WE HAVE BEEN CONDITIONED NOT TO CELEBRATE OR BLOW OUR OWN HORN!!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Yet the more we are in a state of celebration, of recognising what we have accomplished, of taking pride in WHO we are BEING, the more we attract that too!"
   }
  ]
 },
 {
  "n": 35,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "STEP"
   },
   {
    "t": "text",
    "k": "title",
    "text": "1"
   },
   {
    "t": "text",
    "k": "p",
    "text": "First of all, I want you to write a list of beliefs you have or have heard about Bragging. Just Brain dump; it doesn’t have to make sense, but let your pen write/ fingers type for about 3-5 minutes nonstop. The only way out is through!!"
   },
   {
    "t": "box",
    "id": "p35a1",
    "lines": 24
   }
  ]
 },
 {
  "n": 36,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "STEP"
   },
   {
    "t": "text",
    "k": "title",
    "text": "2"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "NOW THE ACTUAL BRAGS/WINS/CELEBRATIONS PART…"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Write down 5 Brags/Wins or Celebrations you had today. I like doing this at dinner with my kids, so it becomes a family affair. We are training your brain to see the positive things that happen in your life, no matter what you have going on in your life. “What we focus our attention on grows”"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "EXAMPLES"
   },
   {
    "t": "text",
    "k": "p",
    "text": "1. A win today was that I went for a walk, felt the sun on my face, and felt at peace with the world."
   },
   {
    "t": "text",
    "k": "p",
    "text": "2. I brag/win/celebrate that an article I wrote a year ago has gotten published."
   },
   {
    "t": "text",
    "k": "p",
    "text": "3. I celebrate that 2 people signed up for my free masterclass"
   },
   {
    "t": "text",
    "k": "p",
    "text": "4. A win was that when my boss was being unreasonable, and normally I would have stormed off, I took a breath, grounded myself and let out a long exhale. After a few of these breaths, I was able to ask a clarifying question and understood what he was trying to tell me."
   },
   {
    "t": "text",
    "k": "p",
    "text": "5. I am celebrating taking myself out for a coffee in that new coffee shop I have always wanted to go to."
   },
   {
    "t": "box",
    "id": "p36a1",
    "lines": 5,
    "label": "1"
   },
   {
    "t": "box",
    "id": "p36a2",
    "lines": 5,
    "label": "2"
   }
  ]
 },
 {
  "n": 37,
  "items": [
   {
    "t": "box",
    "id": "p37a1",
    "lines": 5,
    "label": "3"
   },
   {
    "t": "box",
    "id": "p37a2",
    "lines": 4,
    "label": "4"
   },
   {
    "t": "box",
    "id": "p37a3",
    "lines": 4,
    "label": "5"
   },
   {
    "t": "text",
    "k": "p",
    "text": "NOW how does that FEEL? Can you make this a practice and celebrate yourself every day?"
   },
   {
    "t": "box",
    "id": "p37a4",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "Write down your commitment to yourself:"
   },
   {
    "t": "box",
    "id": "p37a5",
    "lines": 4
   }
  ]
 },
 {
  "n": 38,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "SELF-LOVE IS THE SOURCE OF ALL OUR OTHER LOVES."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- PIERRE CORNEILLE"
   }
  ]
 },
 {
  "n": 39,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "NOW THAT WE HAVE STARTED TO CELEBRATE WHAT IS GOING WELL, I WANT TO GIVE YOU A TOOL TO HELP WITH THINGS YOU WANT TO CHANGE IN YOUR LIFE"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Every experience we have experienced is in the past, yet how we FEEL about that instance, that EXPERIENCE, is what holds the emotional charge -"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "For example:"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "“I lost my job last week” is a statement about the experience that took place last week."
   },
   {
    "t": "text",
    "k": "p",
    "text": "This can mean something completely different to each person, it is all about the EMOTION that experience brings up for each person."
   },
   {
    "t": "text",
    "k": "p",
    "text": "For one person losing their job is a horrible experience, they are worried about finances and how to survive and pay the bills."
   },
   {
    "t": "text",
    "k": "p",
    "text": "For another person, it was the chance they had been waiting for, they can now pursue the career change they had always wanted to."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "IT IS THE EMOTIONAL COMPONENT THAT MEANS SOMETHING TO US AND OFTEN HAS US SPINNING OUT, CONSTANTLY THINKING ABOUT IT, HOPING FOR A SOLUTION."
   },
   {
    "t": "text",
    "k": "p",
    "text": "When we are in such an emotionally charged state, it is very difficult to get clarity and be able to take action."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We often WANT something s o badly and try to PULL it into our lives.... -or-"
   },
   {
    "t": "text",
    "k": "p",
    "text": "We DO NOT WANT something, and PUSH AGAINST it. The DUALITY of life!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Each experience can be broken up into 4 elements."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We SEE something."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We THINK something."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We have an EMOTION."
   },
   {
    "t": "text",
    "k": "p",
    "text": "We have a BODY SENSATION."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The thought that we think, produces a visual, an image. In turn, the Thought and Image create an Emotion and a Body Sensation."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way to MOVE THROUGH these is to duplicate them, to EXPERIENCE them, for only a few seconds."
   }
  ]
 },
 {
  "n": 40,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "As we move through this CONTENT by FEELING the 4 ELEMENTS, more CONTENT may come up. After a few rounds of clearing this content, there is more AWARENESS, less monkey-mind and more union between what is happening in your body and mind."
   },
   {
    "t": "text",
    "k": "p",
    "text": "By EXPERIENCING the 4 ELEMENTS, we are using the principle of DUPLICATION."
   },
   {
    "t": "text",
    "k": "p",
    "text": "By doing that, what happens is that the brain trains itself to FEEL everything and to know that it is SAFE; whatever happened is in the past. By Duplicating, we move through the 4 elements and remove any positive or negative charge."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Even duplicating and experiencing 2 out of the 4 elements creates a massive change!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "A little story-telling to explain how I first came across this"
   },
   {
    "t": "text",
    "k": "p",
    "text": "I was terrified of spiders as a little girl and used to scream for my mom to get rid of any spiders in my room. We moved to Texas from Holland when I was 12, and I went camping with my Biology teacher and a group in the Big Ben. There are a LOT of TARANTULAS in that National park and I was terrified."
   },
   {
    "t": "text",
    "k": "p",
    "text": "Now I trusted Mr Hoke, so when he told me he was going to do something to help me with the fear of spiders and to trust him, I did."
   },
   {
    "t": "text",
    "k": "p",
    "text": "He came and sat next to me and had a tarantula in his hand, while telling me to look at his face and to tell him what was going through my mind."
   },
   {
    "t": "text",
    "k": "p",
    "text": "I told him I was terrified of spiders, that they are creepy and crawly and my body shuddered. He told me to take a breath and look at the spider. I did, and I wasn’t that terrified. I took another breath and continued looking. I thought, “oh wow, it is big,” and took another breath. I noticed my heart rate had slowed down and said so. I said “I am not so afraid anymore.” I saw the little hairs on the legs of the Tarantula. I was feeling braver. My breath was much slower and I felt my shoulders soften. I looked at my teacher and grinned, “this is not so bad, although it is so much bigger than the spiders we have in Holland”."
   },
   {
    "t": "text",
    "k": "p",
    "text": "He asked if I wanted to hold it…. The first thought was, “Oh my god, how will it feel?” The Image was of the spider on my hand. The emotion that came up was curiousity. The body sensation was tingling in my fingers."
   },
   {
    "t": "text",
    "k": "p",
    "text": "I became more intrigued by how soft the tarantula felt. (Thought) I looked at its long legs and round body. (Image) I felt brave (Emotion) My chest expanded (Body Sensation)"
   },
   {
    "t": "text",
    "k": "sub",
    "text": "In a matter of 5 minutes, a fear that had held me hostage for many years lifted. I couldn’t believe how simple it was! This is a beautiful practice to be more in the here and now, and, is a great alternative for those who find guided meditations difficult to follow. Do this for 7-days and you will see a massive change!"
   }
  ]
 },
 {
  "n": 41,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "AWARENESS IS THE FIRST STEP TOWARDS self-love!"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "-JULIETTE KARAMAN-VAN SCHAARDENBURG"
   }
  ]
 },
 {
  "n": 42,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "IDENTIFY A BODY PART THAT YOU WANT TO LEARN MORE ABOUT."
   },
   {
    "t": "text",
    "k": "p",
    "text": "For example, it could be that you carry tension in your shoulders, or you notice that your belly is clenched a lot.."
   }
  ]
 },
 {
  "n": 43,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "BELIEVE! AND YOU ARE HALFWAY THERE. THE REST OF THE JOURNEY WILL FALL INTO PLACE."
   }
  ]
 },
 {
  "n": 44,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day One"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify a body part that you want to learn more about."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "THE BODY PART I WANT TO WORK WITH IS:"
   },
   {
    "t": "box",
    "id": "p44a1",
    "lines": 2
   },
   {
    "t": "text",
    "k": "p",
    "text": "Today, the way I view my body is:"
   },
   {
    "t": "box",
    "id": "p44a2",
    "lines": 20
   }
  ]
 },
 {
  "n": 45,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p45a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p45a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p45a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p45a5",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p45a6",
    "lines": 5
   }
  ]
 },
 {
  "n": 46,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p46a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p46a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p46a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p46a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p46a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 47,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p47a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p47a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p47a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p47a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p47a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 48,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p48a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p48a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p48a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p48a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p48a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 49,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p49a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p49a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p49a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p49a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p49a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 50,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "THE ESSENCE OF KNOWLEDGE IS,HAVING IT TO APPLY IT."
   }
  ]
 },
 {
  "n": 51,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p51a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p51a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p51a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p51a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p51a5",
    "lines": 5
   }
  ]
 },
 {
  "n": 52,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day Two"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify a PROBLEM you are experiencing in your life right now."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TODAY THE PROBLEM I WANT TO WORK ON IS:"
   },
   {
    "t": "box",
    "id": "p52a1",
    "lines": 2
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way I FEEL about this is:"
   },
   {
    "t": "box",
    "id": "p52a2",
    "lines": 20
   }
  ]
 },
 {
  "n": 53,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p53a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p53a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p53a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p53a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p53a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 54,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p54a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p54a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p54a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p54a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p54a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 55,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p55a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p55a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p55a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p55a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p55a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 56,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p56a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p56a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p56a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p56a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p56a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 57,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "YOU HAVE BEEN CRITICISING YOURSELF FOR YEARS, AND IT HASN’T WORKED. TRY APPROVING OF YOURSELF AND SEE WHAT HAPPENS."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- LOUISE HAY"
   }
  ]
 },
 {
  "n": 58,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day Three"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify another PROBLEM you are experiencing in your life right now."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TODAY THE PROBLEM I WANT TO WORK ON IS:"
   },
   {
    "t": "box",
    "id": "p58a1",
    "lines": 2
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way I FEEL about this is:"
   },
   {
    "t": "box",
    "id": "p58a2",
    "lines": 21
   }
  ]
 },
 {
  "n": 59,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p59a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p59a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p59a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p59a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p59a5",
    "lines": 5
   }
  ]
 },
 {
  "n": 60,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p60a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p60a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p60a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p60a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p60a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 61,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p61a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p61a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p61a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p61a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p61a5",
    "lines": 4
   }
  ]
 },
 {
  "n": 62,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p62a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p62a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p62a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p62a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p62a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 63,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p63a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p63a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p63a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p63a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p63a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 64,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "TO LOVE ONESELF IS THE BEGINNING OF A LIFELONG ROMANCE."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- OSCAR WILDE"
   }
  ]
 },
 {
  "n": 65,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p65a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p65a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p65a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p65a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p65a5",
    "lines": 5
   }
  ]
 },
 {
  "n": 66,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day Four"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify something that is going well that you are experiencing in your life right now."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TODAY WHAT I WANT TO WORK ON IS:"
   },
   {
    "t": "box",
    "id": "p66a1",
    "lines": 2
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way I FEEL about this is:"
   },
   {
    "t": "box",
    "id": "p66a2",
    "lines": 20
   }
  ]
 },
 {
  "n": 67,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p67a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p67a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p67a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p67a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p67a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 68,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p68a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p68a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p68a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p68a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p68a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 69,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p69a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p69a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p69a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p69a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p69a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 70,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p70a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p70a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p70a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p70a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p70a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 71,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "COMPASSION AND EMPATHY ARE NOT WEAKNESSES, BUT STRENGTHS THAT CAN TRANSFORM THE WORLD."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- BARACK OBAMA"
   }
  ]
 },
 {
  "n": 72,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day Five"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify something that you are experiencing in your life right now."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TODAY WHAT I WANT TO WORK ON IS:"
   },
   {
    "t": "box",
    "id": "p72a1",
    "lines": 2
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way I FEEL about this is:"
   },
   {
    "t": "box",
    "id": "p72a2",
    "lines": 20
   }
  ]
 },
 {
  "n": 73,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p73a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p73a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p73a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p73a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p73a5",
    "lines": 4
   }
  ]
 },
 {
  "n": 74,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p74a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p74a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p74a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p74a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p74a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 75,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p75a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p75a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p75a3",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p75a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p75a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 76,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p76a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p76a2",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p76a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p76a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p76a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 77,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p77a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p77a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p77a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p77a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p77a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 78,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "BELIEVE IN YOURSELF AND ALL THAT YOU ARE. BELIEVE THAT THERE IS SOMETHING INSIDE YOU THAT IS GREATER THAN ANY OBSTACLE."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- CHRISTIAN D. LARSON"
   }
  ]
 },
 {
  "n": 79,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p79a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p79a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p79a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p79a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p79a5",
    "lines": 5
   }
  ]
 },
 {
  "n": 80,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day Six"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify something that you are experiencing in your life right now."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TODAY WHAT I WANT TO WORK ON IS:"
   },
   {
    "t": "box",
    "id": "p80a1",
    "lines": 2
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way I FEEL about this is:"
   },
   {
    "t": "box",
    "id": "p80a2",
    "lines": 20
   }
  ]
 },
 {
  "n": 81,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p81a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p81a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p81a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p81a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p81a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 82,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p82a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p82a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p82a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p82a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p82a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 83,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p83a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p83a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p83a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p83a5",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p83a6",
    "lines": 3
   }
  ]
 },
 {
  "n": 84,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p84a1",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p84a2",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p84a3",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p84a4",
    "lines": 4
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p84a5",
    "lines": 4
   }
  ]
 },
 {
  "n": 85,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "THE MOST POWERFUL RELATIONSHIP YOU WILL EVER HAVE IS THE RELATIONSHIP WITH YOURSELF."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- DIANE VON FURSTENBERG"
   }
  ]
 },
 {
  "n": 86,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "Day Seven"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Identify something that you are experiencing in your life right now."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "TODAY WHAT I WANT TO WORK ON IS:"
   },
   {
    "t": "text",
    "k": "p",
    "text": "The way I FEEL about this is:"
   },
   {
    "t": "box",
    "id": "p86a1",
    "lines": 21
   }
  ]
 },
 {
  "n": 87,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p87a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p87a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p87a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p87a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the happening now as I EXPERIENCE ALL of this?"
   },
   {
    "t": "box",
    "id": "p87a5",
    "lines": 5
   }
  ]
 },
 {
  "n": 88,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p88a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p88a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p88a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p88a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p88a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 89,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p89a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p89a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p89a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p89a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p89a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 90,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p90a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p90a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p90a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p90a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p90a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 91,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "IF NEW CONTENT HAS COME UP, WRITE IT DOWN AND EXPERIENCE IT FOR 5 SECONDS, FULLY FEEL IT!"
   },
   {
    "t": "text",
    "k": "title",
    "text": "New"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "CONTENT"
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the THOUGHT?"
   },
   {
    "t": "box",
    "id": "p91a1",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the IMAGE?"
   },
   {
    "t": "box",
    "id": "p91a2",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the EMOTION"
   },
   {
    "t": "box",
    "id": "p91a3",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is the BODY SENSATION?"
   },
   {
    "t": "box",
    "id": "p91a4",
    "lines": 3
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is ARISING now?"
   },
   {
    "t": "box",
    "id": "p91a5",
    "lines": 3
   }
  ]
 },
 {
  "n": 92,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "Now that you have done this exercise to EXPERIENCE all the 4 ELEMENTS what are you more AWARE of now?"
   },
   {
    "t": "box",
    "id": "p92a1",
    "lines": 15
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "DO YOUR PROBLEMS AND EXPERIENCES FEEL A LITTLE BIT LIGHTER?"
   },
   {
    "t": "text",
    "k": "p",
    "text": "I have used the 4 elements in different ways with hundreds of clients to help them through trauma, problems, acquire their goals, and live a more Scrumptious life."
   },
   {
    "t": "text",
    "k": "p",
    "text": "It is truly one of the easiest ways to release the charge we may be feeling FOR or AGAINST something and come back to a place of peacefulness.From there on, it is much easier to take an action step towards the destination that you are wanting to go in."
   },
   {
    "t": "text",
    "k": "p",
    "text": "My hope for you is that you too find this tool useful and that you will implement it when you hit against something on your journey of self-discovery."
   }
  ]
 },
 {
  "n": 93,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "YOU ARE VALUABLE AND DESERVING OF LOVE AND RESPECT, SIMPLY BECAUSE YOU EXIST."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- KIMBERLEY BLAINE"
   }
  ]
 },
 {
  "n": 94,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "WHEN WE ARE EMBODIED IN OUR SCRUMPTIOUSNESS, WE ARE TOTALLY PRESENT TO OUR MIND, BODY AND SOUL."
   },
   {
    "t": "text",
    "k": "p",
    "text": "When was a time you were completely aware of and in your body and feeling utterly SCRUMPTIOUS? What were you doing? Who were you with? What are you Feeling, Seeing, what is coming up in your body? What thoughts are you having? What is happening to your senses, what can you smell, taste, hear?"
   },
   {
    "t": "box",
    "id": "p94a1",
    "lines": 21
   }
  ]
 },
 {
  "n": 95,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What are the things that are stopping you from feeling that way now?"
   },
   {
    "t": "box",
    "id": "p95a1",
    "lines": 5
   },
   {
    "t": "text",
    "k": "p",
    "text": "What would it be like to Feel this way every day? What would be possible for you?"
   },
   {
    "t": "box",
    "id": "p95a2",
    "lines": 5
   },
   {
    "t": "text",
    "k": "p",
    "text": "What can you do today to feel like that again? What is one action step you can take?"
   },
   {
    "t": "box",
    "id": "p95a3",
    "lines": 5
   },
   {
    "t": "text",
    "k": "p",
    "text": "What is good about putting yourself first? How does it affect those around you?"
   },
   {
    "t": "box",
    "id": "p95a4",
    "lines": 5
   }
  ]
 },
 {
  "n": 96,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "WHATEVER WE PLANT IN OUR SUBCONSCIOUS MIND AND NOURISH WITH REPETITION AND EMOTION WILL ONE DAY BECOME A REALITY"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- EARL NIGHTINGALE"
   }
  ]
 },
 {
  "n": 97,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "CREATING BUNDLES OF Joy"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "I LOVE CREATING LITTLE THINGS THAT BRING ME JOY."
   },
   {
    "t": "text",
    "k": "p",
    "text": "It can be a vase filled with herbs or flowers from the garden, a candle and photo placed lovingly on a side table, a cluster of rocks and crystals placed in a special place. A handwritten note that has me smile in delight when I read it."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The aim is to dot things around your house, car and office that bring you pleasure. That when you see them your body responds and is filled with joy."
   },
   {
    "t": "text",
    "k": "p",
    "text": "It could be putting on a red lipstick, wearing a certain perfume, or engulfing your shoulders in a luxurious cashmere wrap. A funky hat, getting out a brand new pencil and writing pad, a special cup to drink your coffee or favourite hot drink out of."
   },
   {
    "t": "text",
    "k": "p",
    "text": "By constantly creating all these little bundles of joy, the mind is creating a new way of thinking and being!"
   },
   {
    "t": "text",
    "k": "p",
    "text": "Pair that together with gratitude and brags and you are well on your way to living a boldly Scrumptious life!"
   }
  ]
 },
 {
  "n": 98,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "NOTHING COMES FROM WITHOUT; ALL THINGS COME FROM WITHIN - FROM THE SUBCONSCIOUS"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- NEVILLE GODDARD"
   }
  ]
 },
 {
  "n": 99,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "FOR WHEN YOU RUN OUT OF IDEAS:"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "A SCRUMPTIOUSNESS JAR IS SIMPLY A JAR FILLED WITH IDEAS FOR THINGS YOU CAN DO TO TAKE CARE OF YOURSELF."
   },
   {
    "t": "text",
    "k": "p",
    "text": "The idea is that when you’re feeling overwhelmed or stressed, you can reach into the jar and pull out an idea to help you relax and rejuvenate."
   },
   {
    "t": "text",
    "k": "p",
    "text": "1. Take a few deep breaths"
   },
   {
    "t": "text",
    "k": "p",
    "text": "2. Go for a walk in nature"
   },
   {
    "t": "text",
    "k": "p",
    "text": "3. Make a healthy meal"
   },
   {
    "t": "text",
    "k": "p",
    "text": "4. Do some yoga"
   },
   {
    "t": "text",
    "k": "p",
    "text": "5. Spend time with friends and family"
   },
   {
    "t": "text",
    "k": "p",
    "text": "6. Meditate"
   },
   {
    "t": "text",
    "k": "p",
    "text": "7. Read a good book"
   },
   {
    "t": "text",
    "k": "p",
    "text": "8. Take a relaxing bath"
   },
   {
    "t": "text",
    "k": "p",
    "text": "9. Write in this journal"
   },
   {
    "t": "text",
    "k": "p",
    "text": "10. Get a good night’s sleep"
   },
   {
    "t": "text",
    "k": "p",
    "text": "11. Take some time for yourself"
   },
   {
    "t": "text",
    "k": "p",
    "text": "12. Do something you enjoy"
   },
   {
    "t": "text",
    "k": "p",
    "text": "13. Give yourself a compliment"
   },
   {
    "t": "text",
    "k": "p",
    "text": "14. Listen to soothing music"
   },
   {
    "t": "text",
    "k": "p",
    "text": "15. Spend time in prayer or reflection"
   },
   {
    "t": "text",
    "k": "p",
    "text": "16. Connect with loved ones"
   },
   {
    "t": "text",
    "k": "p",
    "text": "17. Make a vision board"
   },
   {
    "t": "text",
    "k": "p",
    "text": "18. Exercise"
   },
   {
    "t": "text",
    "k": "p",
    "text": "19. Take a break from electronics"
   },
   {
    "t": "text",
    "k": "p",
    "text": "20. Drink lots of water"
   },
   {
    "t": "text",
    "k": "p",
    "text": "21. Plan a fun activity for the future"
   },
   {
    "t": "text",
    "k": "p",
    "text": "22. Do something nice for someone else"
   },
   {
    "t": "text",
    "k": "p",
    "text": "23. Visit a new place"
   },
   {
    "t": "text",
    "k": "p",
    "text": "24. Learn something new"
   },
   {
    "t": "text",
    "k": "p",
    "text": "25. Try out a new hobby"
   },
   {
    "t": "text",
    "k": "p",
    "text": "26. Volunteer your time"
   },
   {
    "t": "text",
    "k": "p",
    "text": "27. Spend time with a pet"
   },
   {
    "t": "text",
    "k": "p",
    "text": "28. Take care of your physical space"
   },
   {
    "t": "text",
    "k": "p",
    "text": "29. Connect with nature"
   },
   {
    "t": "text",
    "k": "p",
    "text": "30. Do some deep breathing exercises"
   },
   {
    "t": "text",
    "k": "p",
    "text": "31. Practice self-compassion"
   }
  ]
 },
 {
  "n": 100,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "FOR WHEN YOU RUN OUT OF IDEAS:"
   },
   {
    "t": "text",
    "k": "title",
    "text": "...continued"
   },
   {
    "t": "text",
    "k": "p",
    "text": "32. Make a list of things you’re proud of"
   },
   {
    "t": "text",
    "k": "p",
    "text": "33. Dance around like no one is watching"
   },
   {
    "t": "text",
    "k": "p",
    "text": "34. Play a game"
   },
   {
    "t": "text",
    "k": "p",
    "text": "35. Get outside in the sunshine"
   },
   {
    "t": "text",
    "k": "p",
    "text": "36. Stretch your body"
   },
   {
    "t": "text",
    "k": "p",
    "text": "37. Connect with your spirituality"
   },
   {
    "t": "text",
    "k": "p",
    "text": "38. Forgive yourself"
   },
   {
    "t": "text",
    "k": "p",
    "text": "39. Make a list of things you’re grateful for"
   },
   {
    "t": "text",
    "k": "p",
    "text": "40. Do something to make someone else’s day"
   },
   {
    "t": "text",
    "k": "p",
    "text": "41. Tell yourself a positive affirmation"
   },
   {
    "t": "text",
    "k": "p",
    "text": "42. Give yourself a heart hug and notice how it changes your state"
   },
   {
    "t": "text",
    "k": "p",
    "text": "43. Drink herbal tea"
   },
   {
    "t": "text",
    "k": "p",
    "text": "44. Spend time in silence"
   },
   {
    "t": "text",
    "k": "p",
    "text": "45. Wear deliciously scrumptious clothing- How does it feel on your skin?"
   },
   {
    "t": "text",
    "k": "p",
    "text": "46. Plan a trip"
   },
   {
    "t": "text",
    "k": "p",
    "text": "47. Do something creative"
   },
   {
    "t": "text",
    "k": "p",
    "text": "48. Cook your favourite meal"
   },
   {
    "t": "text",
    "k": "p",
    "text": "49. Journal about the things you used to love to do as a kid"
   },
   {
    "t": "text",
    "k": "p",
    "text": "50. Do something out of the ordinary, book a sky diving lesson"
   },
   {
    "t": "text",
    "k": "p",
    "text": "51. Take a feather and run it down your wrist"
   },
   {
    "t": "text",
    "k": "p",
    "text": "52. Do some emotional release: Pillow bashing, tantrum kicking and screaming on the floor, hit the earth."
   },
   {
    "t": "text",
    "k": "p",
    "text": "53. Mirror exercises. Look in the mirror and notice 3 things you love about yourself"
   },
   {
    "t": "text",
    "k": "p",
    "text": "54. Buy a stranger a coffee"
   },
   {
    "t": "text",
    "k": "p",
    "text": "55. Put out a blanket, go outside and look at the stars"
   }
  ]
 },
 {
  "n": 101,
  "items": [
   {
    "t": "text",
    "k": "title",
    "text": "BELIEVE IN YOUR HEART THAT YOU’RE MEANT TO LIVE A LIFE FULL OF PASSION, PURPOSE, MAGIC, AND MIRACLES."
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- ROY T. BENNETT"
   }
  ]
 },
 {
  "n": 102,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "NAME 5 THINGS THAT YOU WILL COMMIT TO DOING LONG TERM TO KEEP YOUR SCRUMPTIOUSNESS ACTIVATED, PRIORITISED, NOURISHED AND SACRED:"
   },
   {
    "t": "box",
    "id": "p102a1",
    "lines": 3,
    "label": "1"
   },
   {
    "t": "box",
    "id": "p102a2",
    "lines": 3,
    "label": "2"
   },
   {
    "t": "box",
    "id": "p102a3",
    "lines": 3,
    "label": "3"
   },
   {
    "t": "box",
    "id": "p102a4",
    "lines": 3,
    "label": "4"
   },
   {
    "t": "box",
    "id": "p102a5",
    "lines": 3,
    "label": "5"
   },
   {
    "t": "text",
    "k": "p",
    "text": "I feel most secure when:"
   },
   {
    "t": "box",
    "id": "p102a6",
    "lines": 3
   }
  ]
 },
 {
  "n": 103,
  "items": [
   {
    "t": "text",
    "k": "sub",
    "text": "I AM THRILLED THAT YOU HAVE MADE YOURSELF A PRIORITY AND HAVE STARTED TO TAP INTO YOUR..."
   },
   {
    "t": "text",
    "k": "title",
    "text": "SCRUMPTIOUSNESS"
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "PLEASE TAKE A MOMENT TO REFLECT ON YOUR JOURNEY AND GROWTH."
   },
   {
    "t": "text",
    "k": "sub",
    "text": "We can't be so desperate for love that we forget where we can always find it; within.\""
   },
   {
    "t": "text",
    "k": "kicker",
    "text": "- ALEXANDRA ELLE"
   }
  ]
 },
 {
  "n": 104,
  "items": [
   {
    "t": "text",
    "k": "kicker",
    "text": "LOOK BACK OVER THE PROMPTS YOU HAVE COMPLETED,THE QUALITIES THAT YOU ADMIRE ABOUT YOURSELF, THE WAY YOU HAVE CELEBRATED YOURSELF AND YOUR LIFE FORCE."
   },
   {
    "t": "text",
    "k": "p",
    "text": "How have you changed?"
   },
   {
    "t": "box",
    "id": "p104a1",
    "lines": 23
   }
  ]
 },
 {
  "n": 105,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "How do you relate differently to your FEELINGS?"
   },
   {
    "t": "box",
    "id": "p105a1",
    "lines": 26
   }
  ]
 },
 {
  "n": 106,
  "items": [
   {
    "t": "text",
    "k": "p",
    "text": "What have you learned?"
   },
   {
    "t": "box",
    "id": "p106a1",
    "lines": 27
   }
  ]
 }
];
