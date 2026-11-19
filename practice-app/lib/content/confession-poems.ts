// A page of poems each Wednesday for Scrumptious Confessions members (Juliette, 19 Nov 2026). Server only, read
// by /api/poems after it has checked access, so dates and audio paths never reach anyone who has not opened them.
// publish_on = the UK day it opens (a Wednesday). added_on = when it joined the library, shelves = the library
// shelves it belongs on later (specs/living-library.md). Her words are copied from her book, never retyped.
export type ConfessionPoem = {
  id: string;
  publish_on: string;
  added_on: string;
  title: string;
  chapter: string;
  stanzas: string[][];
  audio: string;
  // Charlene's Instagram video of Juliette reading it (private "drops" store, played with a 2-hour link). Optional.
  video?: string;
  shelves: string[];
};

// Recorded poems with a good match between her book text and her recording (checked 19 Nov 2026).
// Order (Juliette 19 Nov 2026: "I much prefer the version Charlene did on Instagram... I don't mind that the videos are
// on Insta and TikTok already"): the eight with Charlene's video first, in her posting order; then the audio-only poems.
export const CONFESSION_POEMS: ConfessionPoem[] = [
 {
  "id": "the-gift-of-seeing",
  "publish_on": "2026-11-25",
  "added_on": "2026-11-25",
  "title": "The Gift of Seeing",
  "chapter": "Reflections in the Mirror",
  "stanzas": [
   [
    "The mirror doesn’t lie,",
    "but let’s be honest—it doesn’t tell the full story either.",
    "Sure, it shows the lines and shadows,",
    "the laugh tracks and stretch marks,",
    "the scars you’d almost forgotten about."
   ],
   [
    "But does it show the fire inside you?",
    "The moments you’ve laughed until your stomach hurt?",
    "The times you’ve picked yourself up when no one else could see?",
    "The love you’ve poured into people who maybe didn’t deserve it,",
    "and the light you’ve carried through it all?"
   ],
   [
    "Look closer.",
    "See the love you’ve given,",
    "the battles you’ve fought,",
    "the nights you’ve risen from,",
    "the light you’ve carried",
    "through every single moment."
   ],
   [
    "This reflection isn’t just you—",
    "it’s the legacy of every choice you’ve made,",
    "every late-night worry,",
    "every bold decision,",
    "every act of courage that whispered, “You’ve got this.”",
    "It’s all in there, shimmering beneath the surface."
   ],
   [
    "And what about this body?",
    "It’s been through things.",
    "It’s worn jeans that cut off circulation just to look good.",
    "It’s held in laughter at the worst moments",
    "and tears when you swore you wouldn’t cry.",
    "It’s been touched with tenderness by lovers"
   ],
   [
    "and held tiny hands that trusted you to keep them safe.",
    "It’s wrapped itself around you when no one else could,",
    "a quiet reminder that you’ve always been your own safe haven."
   ],
   [
    "And yes, there were times you said yes,",
    "when your body screamed no—",
    "when hands touched you without tenderness,",
    "when gazes lingered too long,",
    "when something inside you recoiled,",
    "and yet, you said nothing."
   ],
   [
    "You ignored its wisdom,",
    "its quiet resistance,",
    "its desperate whispers of “not this, not now.”",
    "You stayed silent,",
    "because you thought you had to,",
    "because the world taught you to endure."
   ],
   [
    "And you paid the price—",
    "in the ache you carried,",
    "in the shame that wasn’t yours to hold.",
    "But even then, this body forgave you.",
    "It held you,",
    "it carried you through,",
    "it stayed—waiting for the day",
    "you would hear its voice again."
   ],
   [
    "And you know what?",
    "That’s what makes you radiant.",
    "Because this reflection?",
    "It’s a celebration of every single moment",
    "you’ve dared to live fully."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-gift-of-seeing-be4f3555ae.m4a",
  "shelves": [],
  "video": "poems/the-gift-of-seeing.mp4"
 },
 {
  "id": "the-dress-the-memories-and-her",
  "publish_on": "2026-12-02",
  "added_on": "2026-12-02",
  "title": "The Dress, the Memories and Her",
  "chapter": "",
  "stanzas": [
   [
    "She runs her hands over the fabric,",
    "her fingers tracing stories that live in its seams.",
    "It slips over her skin, familiar and soft,",
    "like a conversation with an old friend."
   ],
   [
    "For a moment, she is transported—",
    "back to the girl who danced barefoot in the garden,",
    "her laughter rising into the night sky.",
    "Back to the woman who wore this dress",
    "when the world felt wide open,",
    "when love was a promise she dared to believe in,",
    "when the air smelled of forever."
   ],
   [
    "Her breath catches,",
    "not from regret or sadness,",
    "but from the weight of time—",
    "the beauty of it, the ache of it,",
    "how it stretches and bends in ways",
    "she’s still learning to understand."
   ],
   [
    "She opens her eyes and exhales.",
    "Her hands smooth the dress over her hips,",
    "not to cling to the past,",
    "but to anchor herself in the present."
   ],
   [
    "She isn’t returning to who she was.",
    "She’s embracing who she’s become.",
    "Layered with memories,",
    "lit by every moment she’s lived,",
    "she stands in her radiance—",
    "not dimmed, but deepened."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-dress-the-memories-and-her-0ade8cb788.m4a",
  "shelves": [],
  "video": "poems/the-dress-the-memories-and-her.mp4"
 },
 {
  "id": "the-freedom-in-no",
  "publish_on": "2026-12-09",
  "added_on": "2026-12-09",
  "title": "The Freedom in No",
  "chapter": "The Power of No",
  "stanzas": [
   [
    "No is an invitation—",
    "not a wall,",
    "but a boundary whispered with love.",
    "It’s the moment you trust your body’s knowing,",
    "when your skin says, “Not this, not now,”",
    "and you listen."
   ],
   [
    "No doesn’t have to be harsh.",
    "It can be soft, steady, clear—",
    "a quiet voice that says,",
    "“This is what I need instead.”"
   ],
   [
    "No is the freedom to pause,",
    "to feel into what you want,",
    "to adjust, to ask.",
    "It’s curiosity over obligation,",
    "clarity over compliance."
   ],
   [
    "And when you say it?",
    "It’s not just a refusal;",
    "it’s a choice—",
    "to trust yourself,",
    "to honour what feels right in this moment."
   ],
   [
    "No doesn’t close doors.",
    "It opens space.",
    "Space to feel, to explore, to breathe,",
    "to stand in the truth of your own desires."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-freedom-in-no-4e4d0b202f.m4a",
  "shelves": [],
  "video": "poems/the-freedom-in-no.mp4"
 },
 {
  "id": "her-strength-is-yours",
  "publish_on": "2026-12-16",
  "added_on": "2026-12-16",
  "title": "Her Strength Is Yours",
  "chapter": "Women Who Rise",
  "stanzas": [
   [
    "Strength isn’t a competition.",
    "It’s a shared rising.",
    "When she shines,",
    "you shine.",
    "When she stumbles,",
    "you reach out—",
    "because you know she’d do the same."
   ],
   [
    "Her strength doesn’t steal yours.",
    "It multiplies it.",
    "It’s in the way she listens,",
    "the way she holds space,",
    "the way she whispers,",
    "“You’ve got this,”",
    "and suddenly, you do."
   ],
   [
    "This isn’t about standing alone.",
    "It’s about linking arms,",
    "lifting each other,",
    "and reminding the world—",
    "we’re better together."
   ],
   [
    "So let them try to divide us.",
    "We’ll keep rising,",
    "shoulder to shoulder,",
    "a constellation of women",
    "burning brighter because we are one."
   ]
  ],
  "audio": "/scrumptious-poems/audio/her-strength-is-yours-e3633cde94.m4a",
  "shelves": [],
  "video": "poems/her-strength-is-yours.mp4"
 },
 {
  "id": "the-aligned-yes",
  "publish_on": "2026-12-23",
  "added_on": "2026-12-23",
  "title": "The Aligned Yes",
  "chapter": "",
  "stanzas": [
   [
    "Here’s the secret: no isn’t the villain.",
    "It’s the hero swooping in to save your yes."
   ],
   [
    "No clears the clutter.",
    "It makes room—",
    "not by slamming the door,",
    "but by gently shooing out what doesn’t belong."
   ],
   [
    "Because the right yes?",
    "Oh, you’ll feel it.",
    "It doesn’t sit heavy on your chest,",
    "or make your stomach do somersaults.",
    "The right yes feels like slipping into your favourite jeans—",
    "the ones that fit like they were made just for you."
   ],
   [
    "It’s the yes that feels like exhaling.",
    "Like trust.",
    "Like finally coming home."
   ],
   [
    "So let no do its thing.",
    "Let it say, “Not this, not now, not for me.”",
    "And watch as it carves out space",
    "for the yes that feels so good,",
    "you won’t have to second-guess it."
   ],
   [
    "That’s the magic of an aligned yes—",
    "it doesn’t demand.",
    "It just lights you up from the inside out."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-aligned-yes-9d77d34ad5.m4a",
  "shelves": [],
  "video": "poems/the-aligned-yes.mp4"
 },
 {
  "id": "the-woman-you-are-becoming",
  "publish_on": "2026-12-30",
  "added_on": "2026-12-30",
  "title": "The Woman You Are Becoming",
  "chapter": "",
  "stanzas": [
   [
    "Do you feel it?",
    "How much of them lives within you—",
    "their laughter, their grief,",
    "their unspoken courage."
   ],
   [
    "Each of them has left a mark,",
    "shaping the woman",
    "you are becoming."
   ],
   [
    "They didn’t always teach with words.",
    "They didn’t need to.",
    "You learned in their silences,",
    "in the way they stood tall,",
    "even when their hearts carried too much."
   ],
   [
    "Maybe you’ve been waiting—",
    "for someone to show you",
    "how to be soft, yet unbreakable.",
    "How to live authentically,",
    "without turning rigid."
   ],
   [
    "But they already did—",
    "in the way they held their ground,",
    "in the way they let go of what didn’t align,",
    "in the way they made space—true space—",
    "to live fully in who they were."
   ],
   [
    "And yet, somewhere along the way,",
    "you were taught to forget.",
    "Conditioned to criticise,",
    "to dim your light,",
    "to shrink when another woman rose."
   ],
   [
    "The sister wound, the mother wound—",
    "woven so tightly into your being,",
    "it felt like your own.",
    "You were taught to compare,",
    "as if her rise diminished yours,",
    "as if her beauty erased your worth."
   ],
   [
    "But comparison is the thief of sisterhood,",
    "the lie that keeps us apart.",
    "When she rises, she clears the path.",
    "Her light doesn’t steal—it amplifies.",
    "Together, you create a brilliance",
    "that no one can dim."
   ],
   [
    "And to the men—",
    "the ones who celebrate our light,",
    "who hold space for us to grow,",
    "who champion our rise",
    "without fear of their own dimming:"
   ],
   [
    "Thank you."
   ],
   [
    "We rise higher because of your strength,",
    "your support,",
    "your willingness to walk beside us",
    "as partners, not rivals."
   ],
   [
    "You are a mosaic—",
    "of the women who shaped you,",
    "and the men who saw you whole.",
    "Their resilience lives in your voice.",
    "Their love rests in your hands."
   ],
   [
    "Now, you are the woman",
    "they always knew you’d become.",
    "And together,",
    "we rise."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-woman-you-are-becoming-3a1f0b09f0.m4a",
  "shelves": [],
  "video": "poems/the-woman-you-are-becoming.mp4"
 },
 {
  "id": "the-beauty-of-her-joy",
  "publish_on": "2027-01-06",
  "added_on": "2027-01-06",
  "title": "The Beauty of Her Joy",
  "chapter": "Timeless Joy and Strength",
  "stanzas": [
   [
    "Her joy doesn’t whisper.",
    "It takes centre stage,",
    "unapologetically loud,",
    "turning heads like,",
    "“Yes, I’m here. You’re welcome.”"
   ],
   [
    "She moves like her body knows the music,",
    "like she wrote the rhythm herself.",
    "Her eyes sparkle with a mischief",
    "that says she’s seen it all",
    "and still chose to love life anyway."
   ],
   [
    "Her joy doesn’t dim—it dazzles.",
    "It’s the kind of glow",
    "that people chase",
    "when they’ve forgotten how to burn."
   ],
   [
    "She is a reminder,",
    "a beacon,",
    "a living invitation:",
    "This is what it looks like",
    "to live fully,",
    "to laugh freely,",
    "to burn brightly—",
    "and never apologise for it."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-beauty-of-her-joy-55cafbb8dd.m4a",
  "shelves": [],
  "video": "poems/the-beauty-of-her-joy.mp4"
 },
 {
  "id": "embodying-your-sensual-compass",
  "publish_on": "2027-01-13",
  "added_on": "2027-01-13",
  "title": "Embodying Your Sensual Compass",
  "chapter": "The Art of Scrumptious Living",
  "stanzas": [
   [
    "Your body is a guide—",
    "not a map to follow,",
    "but a compass to trust."
   ],
   [
    "It hums with truth",
    "when the wind brushes your skin.",
    "It quickens with knowing",
    "when you step into a space meant for you."
   ],
   [
    "Your sensuality is not something to hide;",
    "it is your essence, your guide,",
    "your quiet rebellion against a world",
    "that asks you to dim."
   ],
   [
    "Listen to the wisdom in your bones—",
    "the ache of longing,",
    "the certainty of a whispered yes."
   ],
   [
    "Even in your last breath,",
    "it will speak to you,",
    "a gentle rhythm in the stillness,",
    "reminding you of every moment",
    "you lived fully,",
    "every place your body led you home."
   ],
   [
    "It will always lead you—",
    "to connection,",
    "to freedom,",
    "to the aliveness",
    "that only comes from trusting yourself completely"
   ]
  ],
  "audio": "/scrumptious-poems/audio/embodying-your-sensual-compass-e0db2f281e.m4a",
  "shelves": [],
  "video": "poems/embodying-your-sensual-compass.mp4"
 },
 {
  "id": "a-love-affair-with-yourself",
  "publish_on": "2027-01-20",
  "added_on": "2027-01-20",
  "title": "A Love Affair with Yourself",
  "chapter": "The Touch of Life",
  "stanzas": [
   [
    "Lean in, my love,",
    "Not to pick yourself apart,",
    "but to marvel at the absolute masterpiece",
    "staring back at you."
   ],
   [
    "Run your fingers along the curve of your cheek,",
    "the shape of your mouth.",
    "Feel the strength in the body",
    "that’s carried you",
    "through every “I can’t”",
    "and turned it into “Oh yes, I can.”"
   ],
   [
    "This reflection?",
    "It’s not here to mess with you.",
    "It’s here to flirt with you,",
    "to remind you that you are worthy—",
    "not because of what you’ve done,",
    "but because of who you are."
   ],
   [
    "This isn’t just a love story.",
    "It’s a full-on, sweeping romance",
    "with the person who’s been there for you",
    "through it all:",
    "you."
   ],
   [
    "Lean closer.",
    "Not to spot flaws,",
    "but to fall head over heels in love",
    "with the one and only you."
   ]
  ],
  "audio": "/scrumptious-poems/audio/a-love-affair-with-yourself-9222a8ac1b.m4a",
  "shelves": []
 },
 {
  "id": "the-memory-of-touch",
  "publish_on": "2027-01-27",
  "added_on": "2027-01-27",
  "title": "The Memory of Touch",
  "chapter": "The Touch of Life",
  "stanzas": [
   [
    "Your skin keeps secrets—",
    "every embrace, every caress,",
    "every moment when touch",
    "spoke louder than words."
   ],
   [
    "Not every touch lingers,",
    "but some? Oh, they never leave.",
    "The way a lover’s hand",
    "rested on your hip,",
    "their warmth sinking into you",
    "like a quiet promise."
   ],
   [
    "The way your mother’s fingers",
    "brushed through your hair—",
    "a tenderness so simple,",
    "yet stitched into your very being."
   ],
   [
    "The way your own hands",
    "have traced your skin in the dark,",
    "pressed against your heart,",
    "wiped away tears",
    "you never let the world see,",
    "whispering, “I’ve got you.”"
   ],
   [
    "These touches are bookmarks,",
    "marking the chapters of love,",
    "loss, longing, and resilience.",
    "Some are sharp.",
    "Some are soft."
   ],
   [
    "All of them have shaped you",
    "in ways you’re still unfolding."
   ],
   [
    "Even when hands are absent,",
    "their memory lingers,",
    "like a ghost of comfort",
    "woven into your cells."
   ],
   [
    "And when no one else is there?",
    "Oh, love—your own touch",
    "has the power to rewrite it all.",
    "Every time your hands meet your skin,",
    "you tell a new story—",
    "one of belonging,",
    "of worthiness,",
    "of a love that begins and ends",
    "with you."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-memory-of-touch-e8a7f26b93.m4a",
  "shelves": []
 },
 {
  "id": "a-mirror-of-grace",
  "publish_on": "2027-02-03",
  "added_on": "2027-02-03",
  "title": "A Mirror of Grace",
  "chapter": "The Heart of Resilience",
  "stanzas": [
   [
    "Alright, here we go. Stand before the mirror.",
    "And before you start sighing or poking at things, hear me out."
   ],
   [
    "Yes, that belly might look like it’s auditioning for its own zip code.",
    "Yes, those lines on your forehead could double as a road map.",
    "And let’s not even get started on that one eyebrow hair",
    "that insists on growing in like a tree branch."
   ],
   [
    "Laugh. It’s okay. Have a good look at it all.",
    "Pull that belly out proudly. Give it a pat.",
    "Maybe it carried babies. Maybe it carried late-night snacks.",
    "Either way, it’s been carrying you for years."
   ],
   [
    "And those hands? Sure, they’re not as smooth as they used to be,",
    "but look at them. Really look.",
    "They’ve held love and loss. They’ve created, comforted, wiped tears,",
    "and carried the weight of so many untold moments."
   ],
   [
    "Then there are your eyes.",
    "Oh, don’t roll them at me.",
    "Do you see the sparkle in them?",
    "They’ve witnessed every heartbreak, every ridiculous mistake,",
    "every unexpected joy.",
    "And somehow, they still shine,",
    "like they’re in on some cosmic joke you haven’t quite caught onto yet."
   ],
   [
    "Now, pause. Breathe.",
    "Let it sink in."
   ],
   [
    "This body? This face? It’s not just something to scrutinise.",
    "It’s a collection of stories.",
    "A witness to a life fully lived—messy, flawed, beautiful."
   ],
   [
    "Feel that lump in your throat? Let it come.",
    "Tears are allowed here. Gratitude is allowed here."
   ],
   [
    "Because you’ve carried so much.",
    "You’ve broken and rebuilt yourself more times than you can count.",
    "And yet, here you are—still standing, still soft,",
    "still daring to look in the mirror and see."
   ],
   [
    "So laugh. Cry. Reflect.",
    "Then offer yourself the same grace you’ve poured out to others."
   ],
   [
    "You’re not just surviving. You’re thriving.",
    "And you my love?",
    "You’re extraordinary.  Own it. Stand proud. Let the world see it."
   ]
  ],
  "audio": "/scrumptious-poems/audio/a-mirror-of-grace-da35eb15ef.m4a",
  "shelves": []
 },
 {
  "id": "the-embodied-spark",
  "publish_on": "2027-02-10",
  "added_on": "2027-02-10",
  "title": "The Embodied Spark",
  "chapter": "Timeless Joy and Strength",
  "stanzas": [
   [
    "When she laughs,",
    "it’s not for the world.",
    "It’s for herself—",
    "a sound that bubbles up",
    "from the deepest parts of her,",
    "loud, real, and unapologetically hers."
   ],
   [
    "She moves like she owns the ground beneath her feet,",
    "like her body is a song she’s finally learned to sing.",
    "Every curve, every scar, every story etched into her skin",
    "is a testament to a life well lived."
   ],
   [
    "She doesn’t bother with pretense.",
    "Why should she?",
    "Time hasn’t quieted her.",
    "It’s made her bolder,",
    "like a fire that refuses to be tamed."
   ],
   [
    "She doesn’t burn out.",
    "She burns brighter—",
    "fuelled by every risk she’s taken,",
    "every truth she’s spoken,",
    "every moment she’s chosen herself."
   ],
   [
    "Her spark isn’t just a flicker.",
    "It’s a full-blown blaze.",
    "And if you’re lucky enough to catch it,",
    "it’ll light you up too."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-embodied-spark-f754ab8d8b.m4a",
  "shelves": []
 },
 {
  "id": "the-dance-of-pleasure",
  "publish_on": "2027-02-17",
  "added_on": "2027-02-17",
  "title": "The Dance of Pleasure",
  "chapter": "The Art of Scrumptious Living",
  "stanzas": [
   [
    "Pleasure doesn’t whisper;",
    "it calls boldly—",
    "\"I am your birthright.\""
   ],
   [
    "Let your body remember",
    "what it means to savour.",
    "The softness of a touch.",
    "The sweetness of a breath.",
    "The fullness of being",
    "here, now."
   ],
   [
    "This is the dance of presence,",
    "the rhythm of life moving through you."
   ],
   [
    "With every step,",
    "with every sigh,",
    "it reminds you:",
    "You are alive."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-dance-of-pleasure-56638a0240.m4a",
  "shelves": []
 },
 {
  "id": "awakening-you",
  "publish_on": "2027-02-24",
  "added_on": "2027-02-24",
  "title": "Awakening You",
  "chapter": "The Art of Scrumptious Living",
  "stanzas": [
   [
    "Wake up to the truth",
    "that has always been waiting—",
    "a wild, untamed beauty",
    "living in your chest."
   ],
   [
    "You were not made",
    "to walk paths that dull your spark,",
    "to shrink yourself",
    "into shapes that feel safe but lifeless."
   ],
   [
    "Feel the rhythm of your yes,",
    "the power of your no,",
    "the freedom of everything in between."
   ],
   [
    "This is your awakening.",
    "Not a moment of change,",
    "but a return—",
    "awake to the truth of the universe,",
    "of energy, of what has always been:",
    "the infinity and perfection of life."
   ],
   [
    "You are pure truth,",
    "radiant, shimmering,",
    "complete."
   ]
  ],
  "audio": "/scrumptious-poems/audio/awakening-you-908003e96e.m4a",
  "shelves": []
 },
 {
  "id": "the-tender-ache",
  "publish_on": "2027-03-03",
  "added_on": "2027-03-03",
  "title": "The Tender Ache",
  "chapter": "The Art of Scrumptious Living",
  "stanzas": [
   [
    "There is a longing inside you—",
    "not loud,",
    "not urgent,",
    "but steady."
   ],
   [
    "It lingers in the quiet moments,",
    "in the softness of your breath.",
    "It lives in the pauses,",
    "reminding you there is more—",
    "more to feel,",
    "more to love,",
    "more to become."
   ],
   [
    "Place your hands on your heart.",
    "Feel the ache—not to quiet it,",
    "but to let it lead you."
   ],
   [
    "This is not emptiness.",
    "This is expansion."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-tender-ache-c58bf72d82.m4a",
  "shelves": []
 },
 {
  "id": "your-journey-home",
  "publish_on": "2027-03-10",
  "added_on": "2027-03-10",
  "title": "Your Journey Home",
  "chapter": "The Art of Scrumptious Living",
  "stanzas": [
   [
    "Imagine waking to the quiet thrill of living in alignment with your heart—",
    "to love that wraps around you like the morning sun,",
    "to songs that swell in your chest,",
    "to the freedom of saying yes to all that you are."
   ],
   [
    "Picture this:",
    "Dancing in the rain,",
    "the drops kissing your skin like a long-lost friend.",
    "Your breath colliding with laughter,",
    "your body moving to the pulse of life itself."
   ],
   [
    "Feel the ache of dreams no longer hidden,",
    "desires no longer hushed,",
    "a truth rising within you,",
    "saying, this is where you belong."
   ],
   [
    "This is your time.",
    "No more tucking away pieces of yourself.",
    "No more quieting the vibrant, electric soul",
    "that longs to stretch its arms wide and claim the moment."
   ],
   [
    "You are worthy of a life",
    "that feels abundant, wild, and unapologetically alive.",
    "This is your homecoming—",
    "to the radiant, untamed version of you",
    "that has been waiting in the quiet all along."
   ]
  ],
  "audio": "/scrumptious-poems/audio/your-journey-home-96790f0555.m4a",
  "shelves": []
 },
 {
  "id": "your-eyes-hold-the-secret",
  "publish_on": "2027-03-17",
  "added_on": "2027-03-17",
  "title": "Your Eyes Hold the Secret",
  "chapter": "Reflections in the Mirror",
  "stanzas": [
   [
    "Look into your eyes.",
    "Don’t look away."
   ],
   [
    "Do you see her?",
    "The girl who dreamed without limits,",
    "who found wonder in the smallest moments,",
    "who believed in something greater waiting just ahead."
   ],
   [
    "And there she is—the woman.",
    "The one who carried battles no one else could see,",
    "who held heartbreak in one hand",
    "and hope in the other,",
    "and somehow found the strength to keep moving."
   ],
   [
    "Your eyes carry it all.",
    "Every story, every choice,",
    "every whisper of the past versions of you",
    "who stood at the edge of giving up",
    "and chose, again and again, to rise."
   ],
   [
    "This isn’t just a reflection.",
    "It’s a tribute.",
    "A quiet thank-you from the you who endured",
    "to the you who still stands here,",
    "steady, unyielding,",
    "alive with possibility."
   ],
   [
    "And oh, how she stands."
   ]
  ],
  "audio": "/scrumptious-poems/audio/your-eyes-hold-the-secret-0b7251e93a.m4a",
  "shelves": []
 },
 {
  "id": "a-woman-awake",
  "publish_on": "2027-03-24",
  "added_on": "2027-03-24",
  "title": "A Woman Awake",
  "chapter": "The Embodied Woman",
  "stanzas": [
   [
    "She walks into the room,",
    "and something shifts.",
    "It’s not just her presence—",
    "it’s the way she owns the space,",
    "like the air itself adjusts to make room for her."
   ],
   [
    "She doesn’t announce herself.",
    "She doesn’t need to.",
    "Her energy speaks first—",
    "rooted, magnetic, unapologetically alive."
   ],
   [
    "She doesn’t diminish herself",
    "to make others more comfortable—",
    "yet she isn’t hard.",
    "Her heart is open,",
    "her presence enticing,",
    "the kind of woman who will nod at you,",
    "or maybe throw in a cheeky wink—",
    "not to lure you,",
    "but to let you feel her approval",
    "for how you show up in the world."
   ],
   [
    "They feel her before they see her,",
    "their breath catching as if she carries",
    "the secret to something they can’t name.",
    "Her energy draws people in—",
    "not with force, but with quiet gravity.",
    "It’s not envy that pulls them closer,",
    "but the sense that being near her",
    "is an invitation to rise.",
    "To meet her in her radiance.",
    "To step into their own power."
   ],
   [
    "Her power isn’t loud;",
    "it doesn’t demand.",
    "It lingers in the way she moves,",
    "slow and deliberate,",
    "like she’s not in a rush for anything."
   ],
   [
    "Because she’s been through enough to know",
    "there’s no need to hurry.",
    "She’s walked through fire and come out gold,",
    "carrying with her the kind of wisdom",
    "you only earn by breaking open",
    "and finding yourself on the other side."
   ],
   [
    "She listens without needing to speak,",
    "holds her ground without needing to prove,",
    "and moves through the world",
    "like a woman who knows",
    "exactly who she is."
   ],
   [
    "Now, she is here.",
    "Unhidden.",
    "Unafraid.",
    "Unshaken."
   ],
   [
    "She’s not just awake—",
    "she’s alive."
   ]
  ],
  "audio": "/scrumptious-poems/audio/a-woman-awake-d06a9a90a2.m4a",
  "shelves": []
 },
 {
  "id": "the-art-of-returning",
  "publish_on": "2027-03-31",
  "added_on": "2027-03-31",
  "title": "The Art of Returning",
  "chapter": "",
  "stanzas": [
   [
    "When the world feels wobbly,",
    "and your mind’s doing cartwheels,",
    "it’s time to call in your body’s wisdom."
   ],
   [
    "Place your hands on your belly,",
    "your heart,",
    "your thighs.",
    "Feel that?",
    "That’s your body saying,",
    "“I’ve got you, babe.”"
   ],
   [
    "No need to explain, fix, or rush to action.",
    "This is your pause button,",
    "your deep exhale,",
    "your soft place to land."
   ],
   [
    "It’s not about solving life’s mysteries",
    "or becoming a Zen master overnight.",
    "It’s about this simple truth:",
    "You are here.",
    "You are whole.",
    "You’ve always had this sanctuary inside you—",
    "and it’s waiting for you to touch base."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-art-of-returning-5849767405.m4a",
  "shelves": []
 },
 {
  "id": "the-electrifying-yes",
  "publish_on": "2027-04-07",
  "added_on": "2027-04-07",
  "title": "The Electrifying Yes",
  "chapter": "",
  "stanzas": [
   [
    "Your yes is an invitation.",
    "It is the thrill of leaning into a touch",
    "that makes your skin hum,",
    "a delight that builds with each moment—",
    "better than the last."
   ],
   [
    "Say yes to what lights you up,",
    "to the sensation that feels like magic,",
    "to the connection that pulls you deeper",
    "into the joy of being alive."
   ],
   [
    "And when the spark fades,",
    "when a touch feels out of tune",
    "or no longer adds to the symphony,",
    "that is your not right now.",
    "That is your shift in direction,",
    "your chance to say, “Let’s try something else.”"
   ],
   [
    "Your yes isn’t just permission.",
    "It’s an ecstatic devotion to what feels good,",
    "what feels true,",
    "what feels like it was made just for you."
   ],
   [
    "Let your yes be electric,",
    "soft, intentional,",
    "never given out of habit or obligation.",
    "Because when you honour your no,",
    "your yes becomes a celebration—",
    "a touch, a moment, a connection",
    "that feels like pure wonder."
   ]
  ],
  "audio": "/scrumptious-poems/audio/the-electrifying-yes-fcd6ed2511.m4a",
  "shelves": []
 }
];
