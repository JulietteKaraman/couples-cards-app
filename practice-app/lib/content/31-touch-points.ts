// 31 TOUCH POINTS
// ---------------------------------------------------------------------------
// Built 30 Sep 2026. This product RETIRES the £7 Ten Touch Rituals and the
// £27 31 Daily Touch Points PDF into one month that lives in this app.
//
// WHAT IT IS, in her words: "a 31-day exploration of what it is to bring touch
// points of feeling touched in your relationship again. It doesn't need to be
// intimate touch. It doesn't need to be physical touch. It could be fun."
//
// A TOUCH POINT IS ANY MOMENT THE BODY REGISTERS THAT IT WAS MET. That is the
// whole reframe and it is why this is not "31 touches". Roughly a third of the
// month asks for no physical contact at all.
//
// THE SHAPE OF A DAY, her words: "You have a timed container, you have the
// questions that you do every day, and then you do one little touch point
// every day." The CARDS (31 Days Closer, feelfullyyou.com/my-cards) carry the
// container and the question. THIS carries the touch point. Sold together they
// are the 31 Days Intimacy Kit.
//
// SEQUENTIAL ON PURPOSE. Three reasons, in order of importance: it protects the
// order, which is doing real work; it builds the return, so they come back 31
// times; and it stops overwhelm. Day 1 carries the whole date menu because that
// date has to be planned ahead.
//
// WHAT CAME OUT, and never put it back:
//   THE DYAD. It is the cards. Someone holding the kit runs it every day on the
//   other track. A cheap product must never teach what an expensive one sells.
//   THE TRACE. It is the £17 hero (Miles's bite 1). The jaw trace is also
//   therefore BANNED from the Playful Moments Menu, even though it and the neck
//   kiss are a pair in her videos.
//   EYES DOWN. "Good girl / good boy" has no day in this arc. Further up only.
//
// AUDIO. Every Drive id below is real, pulled from Drive, never guessed.
// Sharing CHECKED 30 Sep: all six return reader/anyone. The one exception is
// the welcome recording on Meet Juliette, which was still private when checked
// and needs setting to anyone-with-the-link before launch.
//
// Sources, all hers, all read directly:
//   reference_touch_base_full_spoken_script_verbatim_30sep2026.md
//   reference_three_date_ideas_before_the_touch_date_29sep2026.md
//   reference_31_daily_touch_points.md
//   project_ten_touch_rituals_rebuilt_28sep2026.md
//   project_31_days_intimacy_kit_30sep2026.md

import { ContentBlock } from "./blocks";
import { PracticeCollection } from "./ten-touch-rituals";

export const thirtyOneTouchPoints: PracticeCollection = {
  slug: "31-touch-points",
  title: "31 Touch Points",
  subtitle: "A month of feeling touched again. Not all of it is physical.",
  // Corrected 1 Oct 2026. Juliette: "it should say, creator of the Touch Reset,
  // instead of the Beginning". The Touch Reset is her METHOD, the whole of what
  // she teaches. The Beginning is one programme inside it, so naming that as the
  // thing she created was both stale and too small.
  byline: "By Juliette Karaman, creator of The Touch Reset",
  // TODO needs its own hero. Borrowing the rituals one for now, flagged to her.
  heroImage: "/31-touch-points/hero.jpg",
  // "sequential" is only a label: nothing in the app reads this field. The
  // real one-day-at-a-time gate lives in
  // app/practice/31-touch-points/[slug]/page.tsx. Do not assume this string
  // does anything on its own.
  unlockMode: "sequential",
  entries: [
    // ---------------------------------------------------------------- opening
    {
      // REWRITTEN 25 Oct 2026: the five reading pages became this one, in her words.
      imageAlt: "Juliette kissing Alex's cheek, Alex laughing",
      imageFocus: "center 35%",
      slug: "what-counts-as-a-touch-point",
      order: 0,
      title: "Alex and I don't act our age",
      image: "/31-touch-points/ja-cheek-kiss-laughing.jpg",
      eyebrow: "Start here",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/opener.m4a", label: "Listen: from me, 45 seconds" },
        {"kind": "p", "text": "That's the whole point.", "emphasis": "bold"},
        {"kind": "p", "text": "We make this playful all the time. We'll be walking to the gym and all of a sudden I say, “You may,” and offer him my neck."},
        {"kind": "p", "text": "He goes, “Oh man.”", "emphasis": "accent"},
        {"kind": "p", "text": "He doesn't always want to. When we do, even for thirty seconds, it's connection."},
        {"kind": "big", "text": "That's what we all crave so much. Touch and connection."},
        {"kind": "p", "text": "At some point both your bodies went: yeah, you've ticked all the boxes. You stopped playing. You started looking at the things that weren't going so well."},
        {"kind": "p", "text": "Touch points are how the play comes back. They don't have to be long. They don't have to be a date night for hours. Little points in the day."},
        {"kind": "p", "text": "Here are 31 of them. Have fun with them.", "emphasis": "bold"},
        {"kind": "link", "text": "Day 1 is waiting", "href": "/practice/31-touch-points/day-1-the-menu"},
      ],
    },
    {
      slug: "day-1-the-menu",
      order: 5,
      title: "Day 1. The Menu",
      image: "/31-touch-points/juliette-and-alex.jpg",
      eyebrow: "Ten minutes today, and a date booked for this week",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-1.m4a", label: "Listen first: 40 seconds" },
        { kind: "p", text: "The month opens with a date. Not with a hand, and not with breathing.", emphasis: "bold" },
        { kind: "p", text: "Nobody here needs more quality time. You have had years of being in the same room." },
        { kind: "p", text: "What you are doing today is collecting a story.", emphasis: "bold" },
        {
          kind: "why",
          lines: [
            { text: "Why a silly afternoon counts as a touch point", emphasis: "bold" },
            { text: "Do enough small ridiculous things together and you build up a stock of them." },
            { text: "Then, years later, one of you says remember when we randomly did that, and the other one is already laughing before the sentence finishes.", emphasis: "bold" },
            { text: "That is a touch point. It reaches into the body and lands, and nobody had to touch anybody to make it.", emphasis: "accent" },
          ],
        },
        { kind: "p", text: "A real one needs forty five minutes to an hour and a half, so the date itself is not today. Today you pick it, you put it in the diary, and then you do the ten minute thing at the bottom of this page." },
        {
          kind: "step",
          label: "The set-up",
          lines: [
            { text: "A morning, or the middle of a day. By the evening you have both got nothing left, and then you blame each other for the nothing." },
            { text: "Phones off and away. Not face down on the table." },
            { text: "Get ready separately, the way you would for anybody else. That part counts more than people think." },
          ],
        },
        { kind: "quote", text: "One date a week. Three to choose from. Pick one." },
        {
          kind: "step",
          label: "Your date this week. Week one.",
          highlight: true,
          lines: [
            { text: "Make each other a playlist. Ten songs each.", emphasis: "bold" },
            { text: "Then sit and listen to the whole of theirs, or pick one song out of it and only play that." },
            { text: "The dance.", emphasis: "bold" },
            { text: "One of you picks a song and makes up a little dance to it. The other one has to learn it and follow. Somewhere between the Macarena and a disaster." },
            { text: "Start a puzzle, and finish it.", emphasis: "bold" },
            { text: "Actually finish it. That is the date." },
          ],
        },
        { kind: "p", text: "Three more arrive at the start of next week, and the week after that. You are not meant to do them all." },
        { kind: "quote", text: "And here is what you actually do today, in ten minutes" },
        { kind: "p", text: "Booking something is not doing something. So before you close this, you are both writing a list.", emphasis: "bold" },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Set a timer for ten minutes", text: "Go to separate rooms, or just turn away from each other. Nobody reads anybody's list until the timer goes." },
            { heading: "Write down ten to twenty things you loved about them when you first got together", text: "Not what you appreciate now. What you loved then. The way they said your name. What they wore. Something they did that you have never told them you noticed." },
            { heading: "Then read them out loud to each other", text: "One at a time, taking turns. The listener says nothing at all until their partner has finished the whole list." },
            { heading: "And hold the look for a second afterwards", text: "That is all. Do not discuss it, do not rank them, do not explain any of them." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Ten minutes is deliberately not enough time to be careful.", emphasis: "bold" },
            { text: "A timer makes you write fast, and fast is where the real ones are. The list you would produce over an afternoon would be a much better list and a much less true one." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "This is the oldest thing I run with couples, and it is first for a reason.", emphasis: "bold" },
            { text: "Nothing in this month works on two people who cannot remember why they are standing next to each other. Ten minutes of remembering does more for the next thirty days than any instruction I could give you on day one.", emphasis: "accent" },
            { text: "And most people hear at least one thing tonight that they have been married to for years and never once been told." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Every one of those is a first.", emphasis: "bold" },
            { text: "That is the whole reason it works. Neither of you has done it before, so there is nothing to perform and no earlier version to live up to." },
          ],
        },
      ],
    },
    {
      slug: "day-2-you-may",
      order: 6,
      // Renamed 30 Sep 2026. Juliette: "I would call it YOU May". It was
      // "Your Choice", which hid her most commented mechanic behind a generic
      // title, so nobody scanning the Month screen knew it was in there.
      title: "Day 2. You May",
      imageFocus: "center 55%",
      image: "/31-touch-points/neck-kiss.jpg",
      eyebrow: "Open the Playful Moments Menu",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-2-you-may.m4a", label: "Listen: how Alex and I play it, 30 seconds" },
        { kind: "p", text: "No instruction today. You pick.", emphasis: "bold" },
        { kind: "p", text: "Choosing is the practice. A couple who can pick something playful for each other have got something back that nobody can teach them." },
        { kind: "quote", text: "The mechanic, and it is the one that makes all of this light" },
        { kind: "big", text: "“You may.”" },
        // HER ACTUAL VERSION, given direct 30 Sep 2026. What was here before was
        // the generic one-way consent check, "May I?" / "You may." Hers runs the
        // OTHER way: the person who wants to be touched does the offering, and the
        // live question stops being am I allowed and becomes will you actually
        // reach for me. See memory
        // reference_you_may_but_will_you_exact_mechanic_30sep2026.md. Three layers
        // and all three have to be said: play, consent, and the training.
        { kind: "p", text: "This is how Alex and I do it. I stop him, I offer him my neck or my cheek, and I say you may. He laughs and says I know I may. Then I say: but will you?" },
        // Her own clean cut, no overlays, uploaded 30 Sep 2026. She says you may,
        // he says may I, he touches her. The OVERLAY version of this stays on
        // Instagram and points at the product, because burnt in social text
        // inside a paid product reads as recycled. The page does the teaching,
        // the film only has to show it, and the laugh is the part prose cannot carry.
        { kind: "video", vimeoId: "1231833028" },
        {
          kind: "why",
          lines: [
            { text: "The laugh is doing the work.", emphasis: "bold" },
            { text: "Can we talk about our intimacy is a heavy sentence. You may is a game. Same permission, none of the weight." },
            { text: "Permission was never the thing that stopped.", emphasis: "bold" },
            { text: "He knows he may. He has always known. What went quiet between you is the reaching, and but will you says that out loud while keeping it light enough to survive being said." },
            { text: "Every yes teaches your body something.", emphasis: "bold" },
            { text: "Because you only offer a touch you actually want, your body learns that yes reliably means a touch it likes. Yes stops being compliance and starts being information." },
            { text: "A no has to be real, or none of this works.", emphasis: "bold" },
            { text: "If you may is a genuine answer, so is not now. A no that is allowed is what makes the yes worth having, and it gets no follow up question. You say thank you and carry on with your day.", emphasis: "accent" },
          ],
        },
        { kind: "p", text: "It runs both directions. You can offer, the way I do, or you can ask, which is the same words the other way round: may I? Either one announces the reach, so nobody is braced for a surprise." },
        // HER OWN OVERLAY LINES, read to me off her existing reel, 30 Sep 2026.
        // Verbatim. This is the physiological payload and it is what ties this
        // day to the thesis of the whole month: a braced body cannot feel.
        // NOTE: "Your yes is not a word. It's your whole body." trips the
        // "Not X. It's Y." voice-guard rule. It stays because it is her line,
        // not mine. Logged in memory.
        { kind: "quote", text: "Your yes is not a word. It\u2019s your whole body." },
        {
          kind: "why",
          lines: [
            { text: "When I say yes, my whole body says yes.", emphasis: "bold" },
            { text: "No brace before his hands land, so the touch lands." },
            { text: "That is the difference between being touched and feeling touch. A body braced for a hand absorbs it in the flinch, and almost nothing reaches you." },
            { text: "Your yes builds capacity for sensation.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Passing through",
          lines: [
            { text: "The hand on the small of the back as you pass behind them in the kitchen." },
            { text: "Fingers brushing theirs as you hand something over." },
            { text: "A flat, still palm between the shoulder blades. No rubbing, no pat." },
            { text: "A squeeze of the knee under the table, with other people at it." },
          ],
        },
        {
          kind: "step",
          label: "The bigger ones",
          highlight: true,
          lines: [
            { text: "The kitchen spin.", emphasis: "bold" },
            { text: "Come up behind them, take their waist, and turn them round to face you. Nothing after it." },
            { text: "The neck kiss.", emphasis: "bold" },
            { text: "Ask. Then one kiss, on the side of the neck, and stop there." },
            { text: "Fingers through the hair, along the scalp. Slower than feels natural." },
            { text: "A light hold at the nape of the neck. Held, not stroked." },
            { text: "Thumb tracing slow circles on the back of their hand, while you are both watching something else." },
          ],
        },
        {
          kind: "step",
          label: "The ones with no touch in them at all",
          lines: [
            { text: "Catching their eye across a room and holding it a second past comfortable." },
            { text: "Standing closer than the task needs." },
            { text: "Saying the thing you noticed, out loud, with nothing attached to it." },
          ],
        },
        { kind: "notice", lines: [{ text: "Ten seconds is a real touch point. There is no version of this that is too small." }] },
      ],
    },
    {
      slug: "day-3-touch-base",
      order: 7,
      title: "Day 3. Touch Base®",
      image: "/rituals/touch-base-anchor.png",
      eyebrow: "2 minutes, twice a day, from here on",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "p",
          text: "This is a short kinesthetic anchor that has you feel safe. It trains your nervous system to notice what is happening in your body, and to bring it down.",
        },
        { kind: "p", text: "It is the one practice everything else in this month sits on top of, which is why it arrives on day 3 and not later.", emphasis: "bold" },
        { kind: "video", vimeoId: "1223329859" },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1-7kHzl2T-kBXJIae6uk-3u_KMeDV9Mks/view?usp=sharing",
          label: "Listen: Touch Base®, guided",
        },
        {
          kind: "step",
          label: "First, put yourself somewhere physically safe",
          highlight: true,
          lines: [
            { text: "This sounds like an odd instruction and it is the reason the whole thing works." },
            { text: "Nobody behind you. No tiger waiting in the room.", emphasis: "bold" },
            { text: "I often tell people to do this in the car, or sitting with their back against a wall, so the body knows nothing can come at it from behind. No one can jump out and hurt you." },
            { text: "Your body will not let go while part of it is still watching the door.", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Give it a number",
          lines: [
            { text: "Breathe in through your nose and out through your mouth, and notice what is happening in your body." },
            { text: "Then rate it, one to ten. How present are you?", emphasis: "bold" },
            { text: "One is not very. Ten is hyper aware of everything happening in your body. Write the number down." },
          ],
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Look at the gap", text: "Thumb and pointer finger, held apart. Look at the distance between them, or close your eyes and just listen. Your breath will start to slow on its own as your attention narrows." },
            { heading: "Notice what arrives in the gap", text: "A slight buzzing. Heat. Something else somewhere else in your body. Bring it back to the fingers." },
            { heading: "Come to half a centimetre, then land", text: "Let that top finger land onto your thumb. Take a breath there, in through the nose, out through the mouth." },
            { heading: "Ask yourself the question", text: "What does it feel like in your thumb to receive the touch from your top finger?" },
            { heading: "Move, slower than you want to", text: "The top finger, left and right, slowly enough to feel every single finger ridge. This is the point where almost everyone speeds up. Slow down instead." },
            { heading: "Say it out loud", text: "I am safe. Keep the finger moving. I am safe." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "What your body may do, all of it fine", emphasis: "bold" },
            { text: "Your breath may slow. Your stomach may gurgle. You may yawn." },
            { text: "None of that is a distraction from the practice. It is the practice working." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Rate yourself again, one to ten. That is how you get proof rather than a feeling." },
            { text: "Two minutes, twice a day, is what rewires it. Not once. Not occasionally.", emphasis: "bold" },
            { text: "Do it enough and something useful happens. Just tapping your fingers together sends your body into that state, because it recognises the signal. It stops needing to be on the whole time." },
            { text: "I have used this with over a thousand people. When they are anxious. When they are up in their heads. Road rage. Somebody taking their parking space.", emphasis: "accent" },
          ],
        },
        { kind: "timer", minutes: [2], label: "Touch Base, 2 minutes" },
      ],
    },
    {
      // NEW 25 Oct 2026, from her own Playful Moments Menu. Juliette: "lots of play".
      slug: "day-4-the-kitchen-spin",
      order: 8,
      title: "Day 4. The Kitchen Spin",
      imageFocus: "center 22%",
      imageAlt: "Juliette and Alex laughing, dancing in the kitchen",
      image: "/31-touch-points/ja-kitchen-dance-laugh.jpg",
      eyebrow: "Two seconds, and nothing after it",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-4-kitchen-spin.m4a", label: "Listen: 20 seconds" },
        {"kind": "p", "text": "Two seconds. No planning.", "emphasis": "bold"},
        {"kind": "p", "text": "Come up behind them while they're doing something ordinary. Washing up, making coffee, reading the post. Take their waist. Turn them round to face you."},
        {"kind": "big", "text": "That's it. Nothing after it."},
        {"kind": "p", "text": "Walk off if you like. The surprise is the touch point. So is the laugh."},
        {"kind": "why", "lines": [{"text": "Why play comes first", "emphasis": "bold"}, {"text": "A body that has stopped receiving touch will very often receive play long before it receives a hand. Laughing together is a door into the same room, and it's one most people can still get through."}, {"text": "Great intimacy almost never starts in the bedroom. It starts hours earlier, in the kitchen, with a dare and a grin.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Three ways to play it", "highlight": true, "lines": [{"text": "The slow spin.", "emphasis": "bold"}, {"text": "Turn them so slowly that they have time to see it coming, and to smile before they arrive."}, {"text": "The spin with a song.", "emphasis": "bold"}, {"text": "Put something on in the kitchen first. Spin them once on the chorus, then go back to what you were doing."}, {"text": "The spin and stay.", "emphasis": "bold"}, {"text": "Once they're facing you, hold their waist for one breath. Look at them. Then let go."}]},
        {"kind": "notice", "lines": [{"text": "If they startle easily, say their name first.", "emphasis": "bold"}, {"text": "A surprise is fun when the body knows it's safe. If their shoulders shoot up, slow right down, or ask: may I spin you? The yes is still part of the game."}]},
        {"kind": "step", "label": "Afterwards, notice", "lines": [{"text": "Did they laugh, freeze, or lean in?"}, {"text": "Did you want to do it again straight away?"}, {"text": "What happened in your own body when you reached for them without a reason?"}]},
        {"kind": "p", "text": "Tomorrow, the other one spins.", "emphasis": "accent"},
      ],
    },
    {
      slug: "day-5-the-threshold",
      order: 9,
      title: "Day 5. The Threshold",
      imageFocus: "center 30%",
      imageAlt: "Juliette and Alex out and about with the dog",
      image: "/31-touch-points/ja-tube-selfie-dog.jpg",
      eyebrow: "90 seconds at the door, then six seconds in their arms",
      kind: "ritual",
      imageSide: "left",
      // Her four Unspoken Distance embodiment videos were tried here on 30 Sep
      // and PULLED. Two reasons: they are addressed to a man approaching a
      // woman ("Seeing Her Before You Speak"), which reads wrong to the woman
      // who bought this, and they are three of the four core videos of a
      // separate paid product. Her call: "not sure if they work here."
      // The reading-them half of the practice below is kept, it does not need
      // a video to land.
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-5-threshold.m4a", label: "Listen first: about a minute" },
        { kind: "p", text: "Whoever comes through the door carrying the day does this one. On another day it will be the other one of you." },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Stop before your hand touches the door", text: "Palm flat on your own chest, standing outside." },
            { heading: "Three slow breaths", text: "The out-breath longer than the in-breath, every time. On the third, let your shoulders drop." },
            { heading: "Walk in, and look at them before you say anything", text: "Not hello. Not what is for dinner. Look first, and read what you find. Have they just come off a full day with children, or work? Is their body turned away, occupied, somewhere else?" },
            { heading: "Then speak, or do not", text: "Waiting for the right moment is not passive. It is one of the most respectful things you can do." },
          ],
        },
        { kind: "quote", text: "And then the other half, which is the one couples lose first" },
        {
          kind: "step",
          label: "The six second kiss, on the way out",
          highlight: true,
          lines: [
            { text: "Not a peck aimed at the door. Find their mouth properly and stay there. Full mouth, not a graze on the cheek or a glance off the corner of the lips.", emphasis: "bold" },
            { text: "Then do not pull away the second it ends. Melt into their arms for a few seconds after, forehead to forehead, still close." },
            { text: "Count it in your head if you have to. Six seconds minimum, and there is no ceiling. The lingering is the point, rather than the kiss." },
          ],
        },
        {
          kind: "step",
          label: "The homecoming, the moment they are back",
          lines: [
            { text: "Not a shouted hello from another room. Go and find them.", emphasis: "bold" },
            { text: "Walk to where they are, the way you would if you had missed them, because you did. Same kiss, same melting into it." },
            { text: "Start at seven seconds and notice what that actually feels like. It will feel long before it feels good, and that is normal. Ten is where it starts to count." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Why this one is so early", emphasis: "bold" },
            { text: "You bring the whole day through that door with you, and whoever is on the other side gets all of it before you have said a word." },
            { text: "Ninety seconds is the difference between arriving home and turning up at the address.", emphasis: "accent" },
          ],
        },
        { kind: "notice", lines: [{ text: "Do not announce it. Nobody needs to know you are doing this." }] },
      ],
    },
    {
      slug: "day-6-the-heart-hug",
      order: 10,
      title: "Day 6. The Heart Hug",
      image: "/31-touch-points/heart-hug.jpg",
      eyebrow: "About 5 minutes. Two on yourself, then one of them is theirs",
      kind: "ritual",
      imageSide: "left",
      // Her instruction 30 Sep: "use the heart hug and the butterfly hug, they
      // are actually nervous system tools that I use with people, but how can
      // we do them as partnered or interesting touch. It is a touch sequence we
      // can do." So: solo first, so the body learns the shape, then the same
      // two delivered by somebody else, which is a completely different thing.
      // Replaces Feet on the Floor, the thinnest page in week one. Grounding
      // through the feet survives inside her Skin to Skin recording.
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-6-heart-hug.m4a", label: "Listen first: about a minute" },
        { kind: "p", text: "Two tools I use with clients when a body needs to come down. Today you learn them on yourself, then you hand them over." },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "The heart hug, on yourself", text: "Right hand under your left armpit. Left arm crossed over the top of the right. Then sit there. Notice what happens to your breath as you receive this hug from yourself." },
            { heading: "Now they do it for you", text: "They come in behind you and cross their arms over your chest, one hand tucked under each of your arms, holding you in the shape you were just holding yourself in. Nothing moves. Sixty seconds." },
            { heading: "Then swap", text: "All of it, the other way round." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Notice the difference between your own hold and theirs.", emphasis: "bold" },
            { text: "Your own arms are doing something useful and your body knows exactly what is coming. Theirs is the same shape and it arrives from outside you, which your system reads completely differently." },
          ],
        },
        { kind: "quote", text: "And the butterfly, which you do on yourself" },
        {
          kind: "step",
          label: "The butterfly hug",
          highlight: true,
          lines: [
            { text: "Interlock your thumbs.", emphasis: "bold" },
            { text: "Cross your hands over, palms facing towards you, so your hands sit on your own chest and your thumbs make the body of the butterfly." },
            { text: "Then pitter patter. Left hand, right hand, left hand, right hand, on your chest. Light and unhurried.", emphasis: "bold" },
            { text: "Keep going for a minute, and notice what your breath does without being told to." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Why the tapping works, and it is not mystical", emphasis: "bold" },
            { text: "Left, right, left, right, slowly, is bilateral. It gives the brain something rhythmic and harmless to track, and a body that is tracking a rhythm stops scanning the room." },
            { text: "You can use both of these on your own for the rest of your life, at a desk, in a car, waiting for news. The heart hug is the one you then hand over, because being held by somebody else is the part you cannot give yourself.", emphasis: "accent" },
          ],
        },
        { kind: "timer", minutes: [4, 2], label: "Long enough for both of you" },
      ],
    },
    {
      slug: "day-7-your-second-date",
      order: 11,
      image: "/31-touch-points/juliette-and-alex-garden.jpg",
      title: "Day 7. Your Second Date",
      eyebrow: "Pick one, book it, and learn the close",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-7-second-date.m4a", label: "Listen first: about a minute" },
        { kind: "p", text: "Your first one has happened by now, or it is in the diary. Here is the next one, and it is nothing like the first.", emphasis: "bold" },
        {
          kind: "step",
          label: "Pick one",
          highlight: true,
          lines: [
            { text: "Bake something sweet you have never made.", emphasis: "bold" },
            { text: "Open a baking book and pick something neither of you has attempted. For the harder version, read the recipe once, close the book, and see how much of it you can remember between you." },
            { text: "Open Google Maps, point, and drive there.", emphasis: "bold" },
            { text: "Wherever the finger lands. No looking it up first, no checking whether it is worth going to." },
            { text: "The things you used to love.", emphasis: "bold" },
            { text: "Ten things you each loved doing as a child. Written separately, not shown to each other. Then pick the one you could teach, and go somewhere out of the ordinary and teach it. A kite. A bag of marbles." },
          ],
        },
        { kind: "quote", text: "And this week you learn the close" },
        { kind: "p", text: "Three things at the end of any date. This is the part almost everybody skips, and it is the part that turns an afternoon into something you still have in ten years." },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Name the story out loud before you go home", text: "Not a verdict on the date. Not was that nice. The bit you will still be telling each other about in five years. Say it while you are both still in it." },
            { heading: "A twenty second hug", text: "Five seconds is barely contact. Twenty is where it lands in the body. It will feel far too long, and most couples have never once held on that long standing in their own kitchen." },
            { heading: "One appreciation each, out loud", text: "Before the day closes. One thing, said plainly, with nothing attached to it." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Do the close at the end of all four dates.", emphasis: "bold" },
            { text: "It is the same three things every time, and it is what makes four afternoons stack into a month instead of staying four nice afternoons you forget." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "You have just done a week.", emphasis: "bold" },
            { text: "Almost none of it asked anything of your body. That was on purpose. From here it starts to.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      // NEW 25 Oct 2026, from her own Playful Moments Menu. Juliette: "lots of play".
      slug: "day-8-the-neck-kiss",
      order: 12,
      title: "Day 8. The Neck Kiss",
      imageFocus: "center 5%",
      imageAlt: "Juliette and Alex holding each other on the terrace",
      image: "/31-touch-points/ja-terrace-hug-white-dress.jpg",
      eyebrow: "One kiss, then stop",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-8-neck-kiss.m4a", label: "Listen first: 2 minutes" },
        {"kind": "p", "text": "Today is one kiss. Or maybe it's much more.", "emphasis": "bold"},
        {"kind": "p", "text": "Somewhere ordinary. The kitchen, the hallway, on their way out to the gym. You ask, “May I?”, and you wait. A yes, a not right now, a laugh. All of them are good."},
        {"kind": "p", "text": "If it's a yes: one kiss on the side of the neck, just under the jaw. Let your lips linger. Count one, two. Then step back and carry on with your day."},
        {"kind": "step", "label": "Three ways to take it further", "highlight": true, "lines": [{"text": "Hover first.", "emphasis": "bold"}, {"text": "Before your lips land, let them hover just above the skin for one breath. Can they feel you before you touch? A touch the body can predict is a touch it can relax into."}, {"text": "The nape.", "emphasis": "bold"}, {"text": "Swap the kiss for a hand. A light hold at the back of their neck, under the hair. Held, not stroked. Two seconds, then let go."}, {"text": "Make it You May.", "emphasis": "bold"}, {"text": "Tomorrow the one who wants the kiss offers their neck and says, “You may.” When they laugh and say “I know I may”, you say, “But will you?”"}]},
        {"kind": "step", "label": "If you're the one being kissed, notice", "lines": [{"text": "Where did you feel it? Only on your neck, or somewhere else as well: your chest, your belly, the backs of your arms?"}, {"text": "Was it warm, tingly, a shiver, or nothing much? All of them count."}, {"text": "Afterwards, give it a colour, out loud. Green, I liked that. Orange, nearly. Red, not that one."}]},
        {"kind": "step", "label": "If you're the one kissing, notice", "lines": [{"text": "Could you stop at two? Or did your body want to stay, or rush on to the next thing?"}, {"text": "What did their body do in the second after you stepped back?"}]},
        {"kind": "why", "lines": [{"text": "Why it works", "emphasis": "bold"}, {"text": "Most of us learned that a kiss on the neck is the start of something else, so the body braces and starts doing the maths."}, {"text": "One kiss that goes nowhere sexual tells the body it can say yes without signing up for anything else. Do that enough times and the bracing stops.", "emphasis": "accent"}]},
        {"kind": "notice", "lines": [{"text": "If it doesn't land", "emphasis": "bold"}, {"text": "“Not right now” is a real answer. Say thank you and carry on with your day, with no follow-up question. Ask again tomorrow. A no that's allowed is what makes the yes worth having."}]},
        {"kind": "p", "text": "Later today or tomorrow, swap. The one who was kissed gets to ask: may I?", "emphasis": "accent"},
      ],
    },
    {
      slug: "day-9-the-staring-contest",
      order: 13,
      title: "Day 9. The Staring Contest",
      imageFocus: "center 20%",
      imageAlt: "Juliette and Alex standing face to face, looking at each other",
      image: "/31-touch-points/ja-look-face-to-face.jpg",
      eyebrow: "3 minutes, standing, no touch",
      kind: "ritual",
      imageSide: "left",
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1NBGgj5bJQeQMM_Gw6nA-dTlMd3UU2Snc/view?usp=sharing",
          label: "Listen first: I set this one up, 3 minutes",
        },
        { kind: "p", text: "Stand across from each other. About an arm's distance, so you can see the whole of their face." },
        { kind: "p", text: "Before you start, say this out loud. Both of you." },
        { kind: "big", text: "“Look at me as my own person with choice.”" },
        { kind: "p", text: "Say it, do not think it. It changes what you are doing. This is not a staring contest and it is not a love in. You are looking at an adult who has choice about being here, and is here anyway." },
        {
          kind: "step",
          label: "Then three minutes of looking, properly, in the eyes",
          highlight: true,
          lines: [
            { text: "Somewhere in those three minutes something will happen in one of you. A thought. A memory. You will go somewhere else entirely." },
            { text: "The other one will see it. Their eyes go dark, or something crosses the face. That is the part nobody expects." },
            { text: "When you see it, call it out. Three words.", emphasis: "bold" },
          ],
        },
        { kind: "big", text: "“Stop. What happened?”" },
        {
          kind: "notice",
          lines: [
            { text: "They tell you honestly, and briefly. It might be small. I went into my head. That is a real answer and a common one." },
            { text: "Or it might not be small. One of mine said: I looked at you, and a light came into your eyes, and I was back in the hospital the day you gave birth to our daughter." },
            { text: "Then you say thank you. Not I remember that too. Not that was an amazing moment. Thank you.", emphasis: "bold" },
            { text: "Then say let's restart, and look at each other again, until the timer ends." },
          ],
        },
        {
          kind: "step",
          label: "Two rules, and they matter",
          lines: [
            { text: "Either of you can stop the whole thing at any point. That means finished, not paused, and no explaining why." },
            { text: "Do not talk about it afterwards. Not that day. What was said was said. Going back over it is how you take it away from each other." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "And the everyday version, one tenth the size", emphasis: "bold" },
            { text: "On any ordinary day, when you drift off inside while they are right there, say it at the time. “I just left. Give me a second. I am coming back.”" },
            { text: "Leaving is not the injury. Leaving without saying so is. They feel the absence either way, and naming it turns it from a rejection into a weather report.", emphasis: "accent" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "If you both stay present for the whole three minutes, bravo. Most people go somewhere at least once.", emphasis: "bold" },
            { text: "Some people find it tips into something else entirely, almost another realm. Everybody has a different experience of it and there is no right one." },
            { text: "This is the one day in the month that shows you what you are actually dealing with. Most couples find out inside the first ninety seconds.", emphasis: "accent" },
          ],
        },
        { kind: "timer", minutes: [3], label: "Three minutes of looking" },
      ],
    },
    {
      // NEW 25 Oct 2026, from her own Playful Moments Menu. Juliette: "lots of play".
      slug: "day-10-telly-hands",
      order: 14,
      title: "Day 10. Telly Hands",
      imageFocus: "center 58%",
      imageAlt: "Juliette and Alex on the garden sofa with the dog",
      image: "/31-touch-points/ja-sofa-with-dog.jpg",
      eyebrow: "One episode",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-10-telly-hands.m4a", label: "Listen first: 1.5 minutes" },
        {"kind": "p", "text": "You're watching something together. If you don't watch telly, you're side by side with your laptops or your phones. Close enough that their hand is within reach.", "emphasis": "bold"},
        {"kind": "p", "text": "One of you reaches over and draws slow circles on the back of their hand with your thumb. Slower than you think. You both carry on with what you were doing. Nobody mentions it."},
        {"kind": "big", "text": "That is a touch point."},
        {"kind": "step", "label": "Then close your eyes", "highlight": true, "lines": [{"text": "Whoever is being touched, close your eyes for a slow count of ten."}, {"text": "Stay with the thumb on your skin. The pressure, the warmth, the speed."}, {"text": "Then open them and notice: did taking the screen away make it bigger? Was there more sensation?", "emphasis": "bold"}]},
        {"kind": "why", "lines": [{"text": "Why it works", "emphasis": "bold"}, {"text": "With your eyes open, the screen takes your attention. Close them and the skin gets all of it. Same thumb, same circles, a completely different touch."}, {"text": "There's no announcement and nothing to decide. Nobody has to respond, so the body can relax into it."}, {"text": "A thumb on the back of a hand, while you both carry on with your evening, is a very small way of saying: I'm still here.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Three ways to take it further", "lines": [{"text": "Change the place.", "emphasis": "bold"}, {"text": "Next episode, try fingers through the hair along the scalp, slower than feels natural. Or a light hold at the nape of the neck. Held, not stroked."}, {"text": "Change the speed.", "emphasis": "bold"}, {"text": "Halve it. Then halve it again. Notice when it stops feeling like a habit and starts feeling like a touch."}, {"text": "Give it a colour.", "emphasis": "bold"}, {"text": "At the end of the episode, the one who was touched says one word: green, orange or red. No discussion."}]},
        {"kind": "notice", "lines": [{"text": "If their hand turns over to meet yours, let it."}, {"text": "If it stays still, keep going anyway. It's still landing."}]},
        {"kind": "p", "text": "Tomorrow, the other one does it.", "emphasis": "accent"},
      ],
    },
    {
      slug: "day-11-the-fabric-tease",
      order: 15,
      title: "Day 11. The Fabric Tease",
      imageFocus: "center 25%",
      imageAlt: "Alex's hands on Juliette's shoulders, her silk wrap flowing",
      image: "/31-touch-points/ja-hands-on-shoulders-scarf.jpg",
      eyebrow: "About 2 minutes, and not skin on skin yet",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "Find a silk scarf, or anything soft. Bare arm, wrist, or collarbone. Yours or theirs." },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1i72EYk3Dig8CYg_qIE82ld_Q_vUeJfdA/view?usp=sharing",
          label: "Press play and follow along. The Fabric Tease, 2 minutes",
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Drape it, and leave it", text: "Can you feel the texture clearly? Goosebumps, pleasure, or something closer to irritation? All three are real answers." },
            { heading: "Then lift it off, slowly", text: "As though you were peeling the sensation off the skin. Notice what happens as it goes. Do you want it back?" },
            { heading: "Then somewhere new", text: "The back of the neck. The back of a thigh. The inside of an arm. The same fabric reads completely differently depending on where it lands." },
            { heading: "And try it both directions", text: "Move it up, then down. Most bodies have a strong preference and have never been asked." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "What happens when your skin is met with something unfamiliar?", emphasis: "bold" },
            { text: "Does the lightness make you feel more alive, or more on edge? Fabric is the easiest way in, because nobody has any history with a scarf.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-12-would-you-like",
      order: 16,
      title: "Day 12. Would You Like (a cup of tea, or a kiss)",
      imageFocus: "center 30%",
      imageAlt: "Juliette and Alex balancing on one leg in the kitchen",
      image: "/31-touch-points/ja-one-leg-kitchen.jpg",
      eyebrow: "Two rounds of 3 minutes, and a bonus third",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1PJUcTwFeBTU_SC3jBZD9zKeWfWgghlqy/view?usp=sharing",
          label: "Listen first: I set up all of it, 8 minutes",
        },
        { kind: "p", text: "You are not asking each other for things. One of you is offering.", emphasis: "bold" },
        {
          kind: "step",
          label: "Like this, and you can pull them out of thin air",
          highlight: true,
          lines: [
            { text: "“Would you like a cup of tea?”" },
            { text: "“Would you like me to massage your feet?”" },
            { text: "“Would you like to go out to dinner?”" },
            { text: "“Would you like me to take you to that show you have wanted to see?”" },
            { text: "“Would you like me to kiss you on your back?”" },
            { text: "Small, then some touch, then a whole evening. Work your way up." },
          ],
        },
        { kind: "quote", text: "First, find out where your own yes and no live" },
        {
          kind: "step",
          label: "Stand up. Eyes closed. Both of you.",
          highlight: true,
          lines: [
            { text: "I am going to assume neither of you is called Juliette. So ask yourself, with your eyes closed: is your name Juliette?", emphasis: "bold" },
            { text: "Your body will answer before you do. A sway, backwards or forwards, or to one side. Or a contraction. Or an expansion." },
            { text: "That is your body teaching you kinesiology. It is the same thing used to work out dosage, especially with homeopathic medicine, where you will see people test with their fingers or move an arm up and down." },
            { text: "Whatever yours does, that is your no. Now you have something to read for the rest of today.", emphasis: "accent" },
          ],
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Round one. Three minutes, every answer is no", text: "One of you offers, back and forth. It does not matter what is offered. Would you like a cup of tea? No. Would you like me to massage your feet? No. All of them, no." },
            { heading: "Round two. Three minutes, every answer is yes", text: "Same again, maybe different offers, and every answer is yes." },
            { heading: "Bonus round. Three more minutes, and now answer honestly", text: "Maybe it is a no. Maybe it is a yes. Whatever is actually true when the offer arrives." },
          ],
        },
        {
          kind: "p",
          text: "Nothing is ever followed through, in any round. Nobody makes the tea. Nobody expects to be taken to the theatre. We are teaching your body its own yes and its own no.",
          emphasis: "bold",
        },
        {
          kind: "notice",
          lines: [
            { text: "Why offers and not requests", emphasis: "bold" },
            { text: "Saying no to can you pass me the salt is easy. Saying no to would you like me to massage your feet is not, because you are turning down care." },
            { text: "Somebody who cannot decline kindness usually cannot receive it either. Same muscle, different direction.", emphasis: "accent" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "What to track, because it is not the asking", emphasis: "bold" },
            { text: "When you hear a no, or say one, what does your body do? Forward, or back?" },
            { text: "Where does the no land, and is it expansive or contractive? That is the felt sense." },
            { text: "What does a yes feel like? Most people assume they know and find out it is not what they expected." },
            { text: "And the real one. How hard is it to say no to something you actually want to say yes to?", emphasis: "bold" },
            { text: "Because if you cannot say no when you mean it, nobody can trust your yes. Not them, and not you.", emphasis: "accent" },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Today looks like the smallest day in the month and it is the one the rest of it turns on.", emphasis: "bold" },
            { text: "A no, a yes, and then a true knowing yes. On day 14 it is hands on skin, and you will already know which one you are in. Knowing what your own body wants is probably the biggest gift in here.", emphasis: "accent" },
          ],
        },
        { kind: "timer", minutes: [3, 2], label: "A few minutes a round. Start it again for each one." },
      ],
    },
    {
      // NEW 25 Oct 2026, from her own Playful Moments Menu. Juliette: "lots of play".
      slug: "day-13-across-the-room",
      order: 17,
      title: "Day 13. Across the Room",
      imageFocus: "center 22%",
      imageAlt: "Juliette laughing as Alex dances with her on the terrace",
      image: "/31-touch-points/ja-terrace-laugh-dance.jpg",
      eyebrow: "No touch at all",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-13-across-the-room.m4a", label: "Listen first: 2.5 minutes" },
        {"kind": "p", "text": "No touch at all today. This is energetic touch.", "emphasis": "bold"},
        {"kind": "p", "text": "Next time you're in the same room, catch their eye and hold it, one or two seconds longer than is comfortable. Somewhere public is even better."},
        {"kind": "why", "lines": [{"text": "Why a look counts as touch", "emphasis": "bold"}, {"text": "After years of living together, the novelty wears off. We stop looking at each other the way we did across a crowded room, full of longing."}, {"text": "Being seen is a touch point. The body registers that it was met, and nobody laid a finger on it.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Three ways to play it", "lines": [{"text": "The slow look away.", "emphasis": "bold"}, {"text": "Hold it, then look down, then look back at them. The look back is where the charge is."}, {"text": "The raised eyebrow.", "emphasis": "bold"}, {"text": "If they don't look up, clear your throat. When they do, raise one eyebrow. Command their attention, then smile."}, {"text": "The look in company.", "emphasis": "bold"}, {"text": "At dinner with friends, or across a room at a party. A private moment in a public place."}]},
        {"kind": "step", "label": "What to notice in your body", "lines": [{"text": "Is there heat anywhere? A flush in your face, your chest, your belly?"}, {"text": "Is there movement? A flutter, a little frisson, a smile you can't stop?"}, {"text": "Sometimes there isn't much yet. That's fine. We build on this every day."}]},
        {"kind": "notice", "lines": [{"text": "If they don't look back", "emphasis": "bold"}, {"text": "It doesn't mean anything. They might be miles away in their own head. Try again later today."}]},
        {"kind": "step", "label": "Afterwards, ask each other", "highlight": true, "lines": [{"text": "Tell me what you noticed when I held your eye."}, {"text": "Tell me when you last felt me look at you like that."}, {"text": "Whoever asked says only: thank you.", "emphasis": "accent"}]},
      ],
    },
    {
      slug: "day-14-traffic-lights",
      order: 18,
      title: "Day 14. Traffic Lights",
      imageFocus: "center 35%",
      imageAlt: "Juliette and Alex dancing in the kitchen, smiling",
      image: "/31-touch-points/ja-kitchen-dance-blazer.jpg",
      eyebrow: "About 8 minutes, and I hold the whole thing with you",
      kind: "ritual",
      imageSide: "left",
      // Written from her recording, 30 Sep, transcribed not paraphrased.
      // If the audio changes, change this. They must not drift.
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1AGKYoksO3qGYID0yMKbN-OSVzd4GnBRV/view?usp=sharing",
          label: "Press play and follow along. I take you both through it, 8 minutes",
        },
        { kind: "p", text: "Sit across from each other. On day 12 you did this in words, with nothing ever acted on. Today it is actual touch, and it is non sexual touch. We are not going there." },
        { kind: "p", text: "One of you offers. You say the touch out loud before you do it. The other answers out loud.", emphasis: "bold" },
        { kind: "quote", text: "Use the stoplight" },
        {
          kind: "step",
          label: "Green, orange, red",
          highlight: true,
          lines: [
            { text: "Yes is green. You like it. The touch happens.", emphasis: "bold" },
            { text: "Maybe is orange. Start it, and watch your partner. The second they say stop, you stop." },
            { text: "No is red. Hands come off immediately. No follow up question.", emphasis: "bold" },
            { text: "You can just say yes, no, maybe. The colours are there because they are quicker than words when something needs to stop." },
          ],
        },
        {
          kind: "p",
          text: "A no is not a rejection. You say thank you, and you move on to the next touch you wanted to give.",
        },
        {
          kind: "step",
          label: "The five, in this order",
          highlight: true,
          lines: [
            { text: "A hand stroking slowly from the inside of the wrist to the inner elbow." },
            { text: "Fingers stroking through the hair, along the scalp." },
            { text: "A flat, still palm between the shoulder blades." },
            { text: "A thumb tracing slow circles on the back of the hand." },
            { text: "A light hold, with the fingers, at the nape of the neck." },
          ],
        },
        { kind: "p", text: "Answer each one before it happens. Where it is a yes, let the touch happen. Take a breath in and out together between them." },
        {
          kind: "notice",
          lines: [
            { text: "Then swap, and run the same five backwards", emphasis: "bold" },
            { text: "The receiver becomes the giver, and you start at the nape of the neck and work back to the wrist." },
            { text: "You will want to speed up in the second round. I keep it slow on purpose." },
          ],
        },
        {
          kind: "step",
          label: "Two things to hold to",
          lines: [
            { text: "Keep the whole thing under eight or nine minutes. You can pause and take longer in one place, so long as the whole of it stays inside the container.", emphasis: "bold" },
            { text: "You will want to start adding touches of your own. Stay with these five today." },
          ],
        },
        { kind: "p", text: "Close it with a breath together, in through the nose and out through the mouth. Then thank each other." },
        {
          kind: "why",
          lines: [
            { text: "Nobody can want something they are not allowed to decline. Today is where the yes starts being worth having.", emphasis: "bold" },
            { text: "That was one way to touch each other for eight minutes, leading nowhere at all, purely for connection. Notice which one you said no to, and notice whether it was actually a no or whether it was a habit.", emphasis: "accent" },
          ],
        },
        {"kind": "notice", "lines": [{"text": "This is one small piece of a Touch Map.", "emphasis": "bold"}, {"text": "In a Touch Map I take your whole body through green, orange and red."}]},
      ],
    },
    {
      slug: "day-15-the-60-second-hug",
      order: 19,
      title: "Day 15. The 60-Second Hug",
      imageFocus: "center 28%",
      imageAlt: "Alex holding Juliette in a long hug on the terrace",
      image: "/31-touch-points/ja-terrace-hug.jpg",
      eyebrow: "1 minute, and I hold it for you",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "step",
          label: "Your date this week. Week three.",
          lines: [
            { text: "One of you plans the whole thing, and you are allowed to spend twenty pounds.", emphasis: "bold" },
            { text: "The other one finds out nothing until they arrive. Twenty pounds buys a lot when nobody is trying to impress anybody." },
            { text: "A sunset on the sea and a picnic blanket costs almost nothing and beats most restaurants." },
            { text: "Book it now. Then come back and do today's, which takes one minute." },
          ],
        },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/10JkmLg-WOZtQo86U9qtxjlO9yX-LS3_4/view?usp=sharing",
          label: "Press play and follow along, 2.5 minutes",
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Ask", text: "“Can I have a minute?” Then agree it out loud. Sixty seconds, and this hug is going nowhere." },
            { heading: "Two breaths together first", text: "In through the nose, out through the mouth. Twice, before anything settles." },
            { heading: "Then hold, and stay past the first exhale", text: "Most hugs end there, and that is the pat. Let go completely when you are ready, not before." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Even if you do want this to lead somewhere one day, not today.", emphasis: "bold" },
            { text: "We are teaching the body that it is safe to be held, and that being held is not a down payment on anything. It only learns that by being held and having nothing follow." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Five seconds is barely contact. Twenty is where the body starts to believe it.", emphasis: "bold" },
            { text: "Sixty is where the person who finds holding hardest stops managing it. Usually somewhere around the forty second mark, something drops." },
            { text: "When you come out of it, notice what has arrived in your body. Those are the connection chemicals, and you just made them out of nothing but time.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-16-the-small-bid",
      order: 20,
      title: "Day 16. The Small Bid",
      imageFocus: "center 40%",
      imageAlt: "Juliette kissing Alex's shoulder as she passes him in the kitchen",
      image: "/31-touch-points/ja-kiss-on-shoulder.jpg",
      eyebrow: "Two seconds at a time, all day",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-16-small-bid.m4a", label: "Listen first: 4 minutes" },
        {"kind": "p", "text": "Today isn't one practice. It's lots of tiny ones, all day.", "emphasis": "bold"},
        {"kind": "p", "text": "A small bid is a reach with nowhere to go. It isn't asking for anything. Try at least three before tonight."},
        {"kind": "step", "label": "The five, and how to stay in them", "highlight": true, "lines": [{"text": "A hand on the shoulder as you pass behind them.", "emphasis": "bold"}, {"text": "Leave it there for a breath. One, two, three. Then walk off."}, {"text": "A palm flat between the shoulder blades.", "emphasis": "bold"}, {"text": "While they're washing up, or cooking. Still. No rubbing, no pat. Notice if they lean back into you."}, {"text": "Fingers brushing theirs.", "emphasis": "bold"}, {"text": "When you hand them a cup of tea, the salt, the post."}, {"text": "Both hands on the small of their back, or their hips.", "emphasis": "bold"}, {"text": "Stay for a moment. A kiss on the shoulder, or whisper “I love you”, or whatever your endearment is."}, {"text": "A squeeze of the knee under the table.", "emphasis": "bold"}, {"text": "Look at them as you do it. Leave your hand there for a few breaths. Even better with other people there."}]},
        {"kind": "why", "lines": [{"text": "Why small bids matter more than big gestures", "emphasis": "bold"}, {"text": "Relationships rarely end in the big argument. They end in the pass in the kitchen that stopped happening."}, {"text": "A bid with no destination is the cheapest repair there is, and you can make four of them before breakfast.", "emphasis": "accent"}]},
        {"kind": "step", "label": "The part almost nobody does", "lines": [{"text": "If one doesn't land, reach again, gently, within the hour.", "emphasis": "bold"}, {"text": "It doesn't mean they didn't want it. It might not have been the right moment."}, {"text": "Within the hour matters. By tomorrow it has turned into a story about what the not-receiving meant."}]},
        {"kind": "notice", "lines": [{"text": "Say the spark out loud", "emphasis": "bold"}, {"text": "If you feel something, say it while it's happening. “Oof, I just felt that.” What gets witnessed, and what gets said, grows."}]},
        {"kind": "step", "label": "Afterwards, ask each other", "highlight": true, "lines": [{"text": "Tell me which one you noticed today."}, {"text": "Tell me which one you'd like more of."}, {"text": "Whoever asked says only: thank you.", "emphasis": "accent"}]},
      ],
    },
    {
      // NEW 25 Oct 2026, from her own Playful Moments Menu. Juliette: "lots of play".
      slug: "day-17-ten-things",
      order: 21,
      title: "Day 17. Ten Things",
      imageFocus: "center 45%",
      imageAlt: "Juliette and Alex out for the day",
      image: "/31-touch-points/ja-selfie-green-velvet.jpg",
      eyebrow: "Write it, swap it, read it out loud",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-17-ten-things.m4a", label: "Listen first: 1.5 minutes" },
        {"kind": "p", "text": "Two pieces of paper, two pens, and a cup of tea.", "emphasis": "bold"},
        {"kind": "p", "text": "Separately, write down ten things you loved about each other when you first got together. Don't peek. Not allowed."},
        {"kind": "step", "label": "It can be anything", "highlight": true, "lines": [{"text": "A memory. The time you went ice skating, fell on your bum, and they helped you up, and you felt so loved."}, {"text": "A mistake. The flowers they bought that you'd told them you hated, their face falling, and knowing they cared enough to get it right next time."}, {"text": "A quality. Their cheeky smile. The thing they said that first night that made you think: oh, this one."}]},
        {"kind": "p", "text": "The first five come easily. The last five are where the good ones are. Keep going."},
        {"kind": "step", "label": "Then swap", "lines": [{"text": "Swap papers, and read the other person's list out loud. Slowly."}, {"text": "Whoever's list it is just listens. No correcting, no “that's not how it happened”."}, {"text": "When it's finished, say only: thank you."}]},
        {"kind": "big", "text": "Expect at least one “I'd forgotten that.”"},
        {"kind": "why", "lines": [{"text": "Why it works", "emphasis": "bold"}, {"text": "Being seen is a touch point. Hearing someone read out what they noticed about you, years ago, lands in the body the way a hand does."}, {"text": "Most long relationships run on what's going wrong this week. This takes you back to what made you choose each other, and lets you feel it again in the room.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Take it further", "lines": [{"text": "Pick one thing from their list and do it again this week. On purpose.", "emphasis": "bold"}, {"text": "Keep the papers. On a hard day, read theirs again."}, {"text": "Next month, write ten things you love about each other now."}]},
        {"kind": "notice", "lines": [{"text": "Notice", "emphasis": "bold"}, {"text": "Which one made you laugh? Which one made your throat go tight? Where in your body did you feel it when they read it out?"}]},
      ],
    },
    {
      slug: "day-18-as-if-i-am-held",
      order: 22,
      title: "Day 18. As If I Am Held",
      imageFocus: "center 45%",
      imageAlt: "Juliette and Alex holding each other on the lawn, laughing",
      image: "/31-touch-points/ja-lawn-kiss-laugh.jpg",
      eyebrow: "Five ways, and the giver never gets to ask",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-18-as-if-held.m4a", label: "Listen first: 30 seconds" },
        {"kind": "p", "text": "One of you gives today, one receives. Decide who first.", "emphasis": "bold"},
        {"kind": "p", "text": "One instruction for the giver:"},
        {"kind": "big", "text": "“Touch me as if to make me feel really, really held.”"},
        {"kind": "p", "text": "Then find five different ways to do it. Five. Soft, playful, still, strong. You choose."},
        {"kind": "step", "label": "Why five", "highlight": true, "lines": [{"text": "The first two arrive straight away. A hug, a hand on the back."}, {"text": "By the fourth you've run out of the obvious, and that's where you start inventing instead of remembering."}, {"text": "The fifth is the interesting one.", "emphasis": "bold"}]},
        {"kind": "step", "label": "The rule that makes it work", "lines": [{"text": "Don't ask if they liked it.", "emphasis": "bold"}, {"text": "No “was that OK?” No checking their face between one and the next."}, {"text": "The moment you ask, they stop feeling their own body and start looking after your confidence."}, {"text": "The receiver says nothing either. You can talk at the end, or leave it alone."}]},
        {"kind": "timer", "minutes": [5, 3], "label": "Long enough for all five"},
        {"kind": "why", "lines": [{"text": "Why being held matters", "emphasis": "bold"}, {"text": "Being held is one of the first things our bodies ever learned to trust. In long relationships it often quietly turns into a quick hug on the way past."}, {"text": "Today you find out what your hands come up with when nobody is marking them, and what it feels like to receive without having to give anything back.", "emphasis": "accent"}]},
        {"kind": "step", "label": "If you're the one being held, notice", "lines": [{"text": "Which of the five did your body lean into? Which one did it brace against?"}, {"text": "Was it easier to receive the soft ones or the strong ones?"}, {"text": "What does it feel like, right now, to be held?"}]},
        {"kind": "p", "text": "Swap another day if you both want to. It's a completely different exercise from the other side. Have fun with this one.", "emphasis": "accent"},
      ],
    },
    {
      slug: "day-19-dont-use-your-hands",
      order: 23,
      title: "Day 19. Don't Use Your Hands",
      imageFocus: "center 30%",
      imageAlt: "Juliette and Alex forehead to forehead by the pool",
      image: "/31-touch-points/ja-pool-foreheads.jpg",
      eyebrow: "3 minutes, and your hands stay out of it",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-19-no-hands.m4a", label: "Listen first: 2.5 minutes" },
        {"kind": "p", "text": "Decide who gives and who receives.", "emphasis": "bold"},
        {"kind": "p", "text": "Receiver, sit or stand somewhere comfortable. You don't have to do anything except notice. Giver, one instruction: touch them, and don't use your hands."},
        {"kind": "step", "label": "What's left when the hands are out", "highlight": true, "lines": [{"text": "A forearm laid along their arm."}, {"text": "Your cheek resting on their shoulder."}, {"text": "The back of your head against their chest, or their back."}, {"text": "Long hair drawn slowly across their skin."}, {"text": "Standing behind them, breath close to the neck. Close enough to feel, not quite touching."}, {"text": "A knee against a knee. A little footsie, the top of your foot on theirs."}]},
        {"kind": "timer", "minutes": [3], "label": "Three minutes, no hands"},
        {"kind": "p", "text": "Then swap. Don't skip the swap. You both need to feel what it's like to receive this touch, and what it's like to give it.", "emphasis": "bold"},
        {"kind": "why", "lines": [{"text": "Why take the hands away", "emphasis": "bold"}, {"text": "Hands are where all the habits live. They know four moves and do them in the same order, and after years neither of you feels them any more."}, {"text": "Take the hands away and there's nothing to fall back on. You have to pay attention, and so does the body receiving you.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Take it further", "lines": [{"text": "Receiver, close your eyes this time. Notice how much bigger every touch becomes."}, {"text": "Giver, slow everything right down. Halve the speed, then halve it again."}, {"text": "Same rule as yesterday: don't ask if they liked it."}]},
        {"kind": "step", "label": "Afterwards, ask each other", "highlight": true, "lines": [{"text": "Tell me which half made you want to stop sooner."}, {"text": "Tell me what came up for you."}, {"text": "Whoever asked says only: thank you.", "emphasis": "accent"}]},
      ],
    },
    {
      slug: "day-20-greedy-hands",
      order: 24,
      title: "Day 20. Greedy Hands",
      imageFocus: "center 35%",
      imageAlt: "Juliette kissing Alex's cheek, Alex laughing",
      image: "/31-touch-points/ja-cheek-kiss-laughing.jpg",
      eyebrow: "3 minutes, and it is the hardest one in here",
      kind: "ritual",
      imageSide: "left",
      // Her own ritual, from feelfullyyou.com/touch-rituals, 30 Sep. Absorbs
      // The Hardest Question, which was one line and is far stronger asked
      // AFTER this than instead of it.
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-20-greedy-hands.m4a", label: "Listen first: 3 minutes" },
        {"kind": "p", "text": "This one comes from Betty Martin's Wheel of Consent. Most couples have never heard of it, let alone done it.", "emphasis": "bold"},
        {"kind": "p", "text": "One of you takes. The other allows. Decide now who is which."},
        {"kind": "step", "label": "Agree your colours first, out loud", "highlight": true, "lines": [{"text": "Green is yes."}, {"text": "Orange is only if I say so in the moment."}, {"text": "Red is an absolute no, and it stays no today.", "emphasis": "bold"}, {"text": "This matters. Agree that red means hands off, straight away, no questions."}]},
        {"kind": "step", "label": "Then three minutes", "lines": [{"text": "Taker, you touch them for your own pleasure.", "emphasis": "bold"}, {"text": "Their hands, forearms, hair, back, shoulders, maybe their feet. Never sexual. You're touching because you want to feel them."}, {"text": "Allower, your whole job is to allow.", "emphasis": "bold"}, {"text": "No arranging yourself, no making it easier, no performing that you're enjoying it."}]},
        {"kind": "timer", "minutes": [3], "label": "Three minutes. Not five."},
        {"kind": "why", "lines": [{"text": "Why taking is so hard", "emphasis": "bold"}, {"text": "Giving is familiar. We give touch, and we can hide behind it. Taking asks you to want something, out loud, and to let your partner see you want it."}, {"text": "Being allowed to want something for yourself is often the first thing to go quiet.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Take it further", "lines": [{"text": "Swap, three minutes the other way. Today or another day."}, {"text": "Only when three minutes has gone well a few times does it become five. That can take a month. Rushing teaches the body that touch is something to get through."}]},
        {"kind": "step", "label": "Afterwards, ask each other", "highlight": true, "lines": [{"text": "Tell me what that was like. One sentence."}, {"text": "Later today: Tell me, what do you want? Not about dinner."}, {"text": "Whoever asked says only: thank you.", "emphasis": "accent"}]},
        {"kind": "notice", "lines": [{"text": "“I don't know yet” is a real answer.", "emphasis": "bold"}, {"text": "Take it, say thank you, and don't help them find a better one."}]},
      ],
    },
    {
      slug: "day-21-my-body-is-an-instrument",
      order: 25,
      title: "Day 21. My Body Is An Instrument",
      image: "/31-touch-points/my-body-is-an-instrument.jpg",
      eyebrow: "3 minutes, and the only feedback is sound",
      kind: "ritual",
      imageFocus: "center 22%",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-21-instrument.m4a", label: "Listen first: 2.5 minutes" },
        {"kind": "p", "text": "Decide who receives first. Receiver, say this out loud:", "emphasis": "bold"},
        {"kind": "big", "text": "“My body is an instrument. Touch me like you're playing it.”"},
        {"kind": "p", "text": "From then on, no words and no adjusting. Only sound."},
        {"kind": "step", "label": "How it works", "highlight": true, "lines": [{"text": "Receiver: when it's right, let your voice go up.", "emphasis": "bold"}, {"text": "A hum, a sigh, a mm, a yes with no words in it."}, {"text": "When it's not quite right, let your voice go down.", "emphasis": "bold"}, {"text": "Giver: follow the sound.", "emphasis": "bold"}, {"text": "When it goes up, stay there. When it goes down, change something. The pressure, the speed, the place."}]},
        {"kind": "timer", "minutes": [3], "label": "Three minutes. Then swap if you want to."},
        {"kind": "why", "lines": [{"text": "Why sound works better than words", "emphasis": "bold"}, {"text": "Every other kind of feedback happens afterwards, in a conversation, when you're both discussing a memory. Sound arrives in the same second as the touch, so the hand can answer before either of you has thought about it."}, {"text": "Lots of women have spent years making no sound at all, in case it was the wrong one, or because someone once told them they were too loud. Today there is no wrong one.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Take it further", "lines": [{"text": "Receiver, close your eyes, so you're only listening to your own body."}, {"text": "Giver, choose one place, an arm or the back, and play only there."}, {"text": "Swap, or let it stay one direction today. Both are fine."}]},
        {"kind": "step", "label": "Afterwards, ask each other", "highlight": true, "lines": [{"text": "Tell me which sound surprised you."}, {"text": "Tell me what it was like to be heard without words."}, {"text": "Whoever asked says only: thank you.", "emphasis": "accent"}]},
      ],
    },
    {
      slug: "day-22-slow-it-by-half",
      order: 26,
      title: "Day 22. Slow It By Half",
      image: "/31-touch-points/slow-it-by-half.jpg",
      eyebrow: "About 4 minutes, and I hold it with you",
      kind: "ritual",
      imageFocus: "center 30%",
      imageSide: "left",
      body: [
        {
          kind: "step",
          label: "Your date this week. Week four.",
          lines: [
            { text: "The jar.", emphasis: "bold" },
            { text: "You each write five activities on five pieces of paper. Fold them, put them all in a jar." },
            { text: "Then you each pick one out, without looking, and that is what you do." },
            { text: "You will get one of theirs, which is the point. Book it now, then come back to today." },
          ],
        },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/12t1IVCP9J06lKlrcdI5dNmMLq9C4baYz/view?usp=sharing",
          label: "Press play and follow along. My voice does the slowing, 4 minutes",
        },
        { kind: "p", text: "One giver, one receiver. The giver picks the place.", emphasis: "bold" },
        {
          kind: "step",
          label: "Five that take the slowing well",
          lines: [
            { text: "A hand travelling slowly up the forearm." },
            { text: "One fingertip tracing the collarbone." },
            { text: "Stroking hair back from the face." },
            { text: "A palm gliding down the spine, one vertebra at a time." },
            { text: "Slow circles inside the wrist." },
          ],
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Ground first", text: "A breath in through the nose, out through the mouth. Both of you." },
            { heading: "Touch them the way you normally would", text: "Just start, at your usual speed." },
            { heading: "Then halve it, and halve it again", text: "My voice slows down as you do. This is where you will want to speed up, because it feels so slow. Stay there." },
            { heading: "And stop, hand still where it is", text: "Do not lift it off." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "Slowing down is genuinely uncomfortable. We are so used to going faster that slow can feel like less sensation, or like far more. Either one can be true for you.", emphasis: "bold" },
            { text: "Speed is how a body avoids sensation without anybody noticing. Halve it twice and there is nowhere left to hide.", emphasis: "accent" },
          ],
        },
        { kind: "notice", lines: [{ text: "Notice both sides. What it was like to receive slower touch, and what it was like to be the one slowing it down that much." }] },
        {
          kind: "notice",
          lines: [
            { text: "Then swap", emphasis: "bold" },
            { text: "The giver becomes the receiver. It is a different exercise from the other side, and most people find one half far harder than the other." },
            { text: "Was it easier to receive slow touch, or to be the one slowing it down?" },
            { text: "Where did you want to speed up, and what happened in you when you did not?", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-23-going-nowhere-on-purpose",
      order: 27,
      title: "Day 23. Going Nowhere, On Purpose",
      imageFocus: "center 65%",
      imageAlt: "Juliette and Alex on the garden sofa with an ice lolly",
      image: "/31-touch-points/ja-sofa-ice-lolly.jpg",
      eyebrow: "5 minutes, guided if you want it",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "Say it out loud before you start: this is going nowhere.", emphasis: "bold" },
        { kind: "p", text: "Five minutes. One gives, one receives." },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1WsROpJzedUlKTAwUzpQMDIFaaU-TSAFl/view?usp=sharing",
          label: "Listen: Melting Touch, guided",
        },
        {
          kind: "step",
          label: "Five shapes it can take",
          lines: [
            { text: "Slow shapes across the back." },
            { text: "Playing with hair, ears, the nape." },
            { text: "Exploring each finger, the palm, the wrist." },
            { text: "A hand resting on the chest, feeling it rise and fall." },
            { text: "Drifting wherever the hand wants to go." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Say one word as it lands. Soften, or tense. That is all the feedback needed and it is better than a conversation." },
          ],
        },
        { kind: "why", lines: [{ text: "Saying it out loud is not a formality. The body has spent years assuming every touch is a down payment. Naming that this one is not is what lets it stop calculating.", emphasis: "accent" }] },
        { kind: "timer", minutes: [5], label: "Five minutes, going nowhere" },
        {
          kind: "notice",
          lines: [
            { text: "Then swap", emphasis: "bold" },
            { text: "Five minutes the other way round, with the same thing said out loud before you start." },
            { text: "Was it easier to give touch that was going nowhere, or to receive it?" },
            { text: "Did either of you catch yourself trying to make it good, rather than simply doing it?", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-24-hover-before-you-land",
      order: 28,
      title: "Day 24. Hover Before You Land",
      imageFocus: "center 35%",
      imageAlt: "Alex's hand hovering just above Juliette's shoulder",
      image: "/31-touch-points/ja-hand-hovering.jpg",
      eyebrow: "5 minutes, guided",
      kind: "ritual",
      imageSide: "left",
      body: [
        { kind: "p", text: "This is the one with no contact in it at all, and it is the one that surprises people." },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1BcgMGBCB-fCKmOAfopwOMAxK1X7iDzgw/view?usp=sharing",
          label: "Listen: Energetic Non Touch, guided",
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Hold a hand five inches above their wrist", text: "About ten to twelve centimetres. No contact. Take a breath there." },
            { heading: "Ask what is there", text: "Heat. Tingling. Subtle pressure. Does the body want to lean in, or pull away?" },
            { heading: "Close the distance, millimetre by millimetre", text: "As the hand gets closer, is there more sensation or less? Anticipation, discomfort, curiosity?" },
            { heading: "Find the point where it wants to land", text: "Or find that it does not want to land at all. Both are real answers." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Then run it again with your eyes closed.", emphasis: "bold" },
            { text: "More sensation, or fewer? More thoughts? Which felt safer, open or closed?" },
            { text: "It works on your own wrist too, if the other person is not up for it today." },
          ],
        },
        { kind: "why", lines: [{ text: "A predicted touch is a safe touch. This is why hovering for a second before you land changes how the same hand is received.", emphasis: "accent" }] },
        {"kind": "notice", "lines": [{"text": "Every place you noticed today is a place I would put on your Touch Map.", "emphasis": "bold"}]},
      ],
    },
    {
      slug: "day-25-receive-and-adjust",
      order: 29,
      title: "Day 25. Receive and Adjust",
      imageFocus: "center 40%",
      imageAlt: "Alex fastening Juliette's necklace while she smiles",
      image: "/31-touch-points/ja-necklace.jpg",
      eyebrow: "3 minutes, out loud, and you run the timer",
      kind: "ritual",
      imageSide: "right",
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1PDQcsqa7RVUsV3Hfy48r5j0r1HxWJFDQ/view?usp=sharing",
          label: "Listen first, then set your own three minutes. 3 minutes",
        },
        { kind: "p", text: "Three minutes. One gives, one receives. Decide who is doing what." },
        { kind: "p", text: "Receiver, your job today is the hard one. You say out loud what you want, while it is happening.", emphasis: "bold" },
        { kind: "p", text: "Ask for the touch on one body part. An arm, a leg, your back. And be specific." },
        { kind: "big", text: "“I would like your hands on my shoulders, pushed down, with more grounding.”" },
        {
          kind: "step",
          label: "Then these, as it happens",
          highlight: true,
          lines: [
            { text: "“Slower.”" },
            { text: "“Firmer.”" },
            { text: "“A little higher.”" },
            { text: "“Stay there.”" },
            { text: "“Lighter.”" },
            { text: "“A bit to the left.”" },
            { text: "“Adjust the pressure a little.”" },
            { text: "And this one. “Yes, like that.”", emphasis: "bold" },
          ],
        },
        { kind: "p", text: "Say them when you mean them, not on a rhythm." },
        {
          kind: "notice",
          lines: [
            { text: "Giver, you just follow.", emphasis: "bold" },
            { text: "No options. No adjusting back. No is this better, no do you like this. You follow instructions." },
            { text: "The moment you ask, she stops feeling her own arm and goes back to managing you. It is harder than it sounds." },
            { text: "When the timer rings, you stop. The hands come off." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "This is usually the hardest thing in the whole month for women.", emphasis: "bold" },
            { text: "Asking for the exact thing you want, while somebody is already doing something for you, is not easy. If you can adjust it until it is genuinely scrumptious for you, and change your mind halfway, and know that all of that is allowed, you can do it anywhere." },
          ],
        },
        { kind: "timer", minutes: [3], label: "Three minutes. You run it." },
        {
          kind: "notice",
          lines: [
            { text: "Then swap, and this is the half that teaches the most", emphasis: "bold" },
            { text: "Three minutes the other way round. Whoever was following now asks." },
            { text: "What did it feel like to be adjusted?" },
            { text: "And what did it feel like to adjust your partner, knowing they would do exactly as asked?" },
            { text: "Was it easier to receive the touch, or to lead it?", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-26-the-sensual-dance",
      order: 30,
      title: "Day 26. The Sensual Dance",
      imageFocus: "center 30%",
      imageAlt: "Juliette and Alex dancing by the Thames, foreheads together",
      image: "/31-touch-points/ja-thames-dance.jpg",
      eyebrow: "About 6 minutes, and I take you through all of it",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "Put on a song that softens you. Then press play, and let me take it from there.", emphasis: "bold" },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1CkIXqU2NXmGQ95T8B90ctd1jse0JIeCB/view?usp=sharing",
          label: "Press play and follow along. Sensual Dance, about 6 minutes",
        },
        { kind: "p", text: "No choreography. Nobody is performing anything. Hips, shoulders, spine, slower than feels natural." },
        {
          kind: "step",
          label: "Where I take you, so you know what is coming",
          lines: [
            { text: "Moving on your own first, eyes closed, nobody watching." },
            { text: "Then facing each other, letting the movements mirror." },
            { text: "Then one of you behind the other. Breath on the neck, a hand asking before it lands on a waist." },
            { text: "Then hands on your own body, then their hands resting on your back or hips while you move." },
            { text: "Then stopping, holding eye contact, still touching. Then moving again." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "I ask you things along the way. Answer them out loud to each other.", emphasis: "bold" },
            { text: "Which of those dropped you in the most. Where self consciousness arrived. Which part of you felt most alive, and whether anywhere felt numb or hesitant to move." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "This is the longest unbroken stretch of touch in the month, and the only one that does not feel like an exercise.", emphasis: "bold" },
            { text: "The song holds the time, so nobody watches a clock and nobody decides what happens next. That is why it works on day 26 and would have been unbearable on day 3.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-27-the-landing-together",
      order: 31,
      title: "Day 27. The Landing, Together",
      imageFocus: "center 18%",
      imageAlt: "Juliette and Alex standing close at home",
      image: "/31-touch-points/ja-gold-jacket-dance.jpg",
      eyebrow: "2 minutes, together",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "audio", src: "/31-touch-points/audio/day-27-landing.m4a", label: "Listen first: 3 minutes" },
        {"kind": "p", "text": "This might be the smallest thing in the whole month, and the one you keep doing.", "emphasis": "bold"},
        {"kind": "p", "text": "When one of you comes in, or when you first find each other in the day. Before the phones, before anything else."},
        {"kind": "step", "label": "How it goes", "highlight": true, "lines": [{"text": "Stand close. Close enough to feel their warmth. Not touching."}, {"text": "Look each other in the eyes."}, {"text": "One of you says: I'm here.", "emphasis": "bold"}, {"text": "The other says: I feel you.", "emphasis": "bold"}, {"text": "Four words. Your attention on each other."}]},
        {"kind": "notice", "lines": [{"text": "It will feel awkward at first.", "emphasis": "bold"}, {"text": "You live together, you share a bed, and this feels slightly weird. You'll want to look past them, or rush it. It usually stops feeling strange somewhere around the fourth, fifth or sixth go."}]},
        {"kind": "step", "label": "Then one true sentence", "lines": [{"text": "Say out loud whatever is still in the way of being fully here."}, {"text": "“I'm already thinking about what to cook for dinner.” “I'm pretty spent today.”"}, {"text": "The other says only: thank you for telling me. No fixing. No questions.", "emphasis": "bold"}]},
        {"kind": "timer", "minutes": [2], "label": "Two minutes, together"},
        {"kind": "why", "lines": [{"text": "Why it works", "emphasis": "bold"}, {"text": "Most couples move through the day side by side without ever really arriving to each other. This is one tiny moment where you do."}, {"text": "Naming what you're carrying puts it down, so it stops standing between you without either of you knowing it's there.", "emphasis": "accent"}]},
        {"kind": "step", "label": "Afterwards, ask each other", "highlight": true, "lines": [{"text": "Tell me what you're carrying in today."}, {"text": "Tell me one thing you need from me this evening."}, {"text": "Whoever asked says only: thank you.", "emphasis": "accent"}]},
      ],
    },
    {
      slug: "day-28-skin-to-skin",
      order: 32,
      title: "Day 28. Skin to Skin",
      imageFocus: "center 25%",
      imageAlt: "Juliette leaning into Alex in the kitchen",
      image: "/31-touch-points/ja-kitchen-hug-dog.jpg",
      eyebrow: "About 5.5 minutes, back to back, and I hold all of it",
      kind: "ritual",
      imageSide: "left",
      // Written from her recording, 30 Sep, transcribed not paraphrased.
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1YcwwYfxhBYYPKGO6misNmXkSvjArD_Dg/view?usp=sharing",
          label: "Press play and follow along. Skin to Skin, 5.5 minutes",
        },
        { kind: "p", text: "Strip off down to your bra and your naked chest. Two naked chests is perfectly fine too.", emphasis: "bold" },
        { kind: "p", text: "Agree out loud that this is not going further than what the exercise asks of you." },
        { kind: "p", text: "Then either sit on the floor with your backs touching, or stand up, naked backs touching. Either works. Two breaths first, in through the nose and out through the mouth." },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "One of you leans back onto the other", text: "You are holding your partner up with your back. Whoever is holding, notice what it feels like to hold them. Whoever is leaning, can you lean a little more? Can you trust them with your weight?" },
            { heading: "Then change the pressure", text: "Lean less. Lean more. Lean into one side, more weight through one shoulder. Notice what it is like to move your body knowing you will be held, that you are not going to fall." },
            { heading: "Whoever is holding, find where you are gripping", text: "Then ground. Imagine your feet have zippers in them. Unzip them, breathe in through the nose, out through the mouth, and let the energy come down through your body and into the earth through your feet." },
            { heading: "Then swap", text: "The one who was leaning does the holding, and receives their partner's weight." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "The question in the swap, and it is the real one", emphasis: "bold" },
            { text: "How does it feel to receive their weight, especially if they are bigger than you?" },
            { text: "And if you are the bigger one, do you hold back because you do not trust that they can actually hold you?", emphasis: "accent" },
          ],
        },
        {
          kind: "step",
          label: "Then move, and stay connected",
          highlight: true,
          lines: [
            { text: "Come apart a little, until maybe only one shoulder is still touching." },
            { text: "Raise your right arm. Both of you. Can you stay connected from shoulder to elbow?" },
            { text: "Then hold hands. Can the hands and the forearms up to the elbows stay joined?" },
            { text: "Heads leaning on each other. Shoulders. Move fluidly, with fun, with a bit of sparkle.", emphasis: "bold" },
            { text: "There is always one point of naked skin on skin. It may be only your hands. It is never nothing." },
          ],
        },
        { kind: "p", text: "And none of it is done looking at each other. Your backs are turned the whole way through." },
        { kind: "p", text: "When the bell sounds, find each other again and let the full backs touch.", emphasis: "bold" },
        {
          kind: "why",
          lines: [
            { text: "A back is the one part of us nobody asks to see, and it is where being braced lives.", emphasis: "bold" },
            { text: "Letting somebody take your weight is trust with no words in it at all. And the two questions underneath this one, whether you can be held and whether you believe you can hold them, are the whole of a long relationship." },
          ],
        },
        { kind: "timer", minutes: [5], label: "Five minutes. The bell is the one in my recording." },
      ],
    },
    {
      slug: "day-29-elbow-to-armpit",
      order: 33,
      title: "Day 29. Elbow to Armpit",
      imageFocus: "center 30%",
      imageAlt: "Juliette and Alex kissing on the terrace",
      image: "/31-touch-points/ja-terrace-kiss.jpg",
      eyebrow: "About 4.5 minutes, one small zone, three touches",
      kind: "ritual",
      imageSide: "left",
      // Rewritten 30 Sep from the actual audio. The earlier version claimed
      // 10 minutes and a say-yes-out-loud mechanic. Neither is in the
      // recording. Do not reinstate them without listening first.
      body: [
        { kind: "p", text: "Open one arm and rest the elbow on something. A sofa arm, the back of a chair, a bed, a desk, a table." },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/13tKa_R4LyGEba1sJz08VV0fwL0d8lXZP/view?usp=sharing",
          label: "Press play and follow along. Elbow to Armpit, 4.5 minutes",
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Hover", text: "Fingertips above the soft part of the inner elbow, not landing. Temperature, tingling, small shifts. Say out loud what you can feel, one of you after the other. Does your body lean into that zone, or hold back?" },
            { heading: "Land", text: "Barely brushing. If there is hair there, your fingers stroke only the top of it, and the hair almost rises to meet them. Was there a change the moment contact happened, and did it increase or decrease the sensation?" },
            { heading: "Trace", text: "Fingertips slowly from the inner elbow towards the armpit. Did the sensation build, fade, or stay steady? Was there a moment where it was enough? Did you want to stop, or did you want it to go further?" },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "The question this day exists for", emphasis: "bold" },
            { text: "Can you tell where your body actually says yes, as opposed to where it says I will allow it?", emphasis: "accent" },
            { text: "There is no right and no wrong in any of it. All of it is information." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "What do you do when sensation builds? Do you stay, do you pause, or do you rush through it?", emphasis: "bold" },
            { text: "Both of you answer that out loud. Thirty days in, that answer is worth more than any technique in here." },
          ],
        },
        {
          kind: "step",
          label: "And if you want it once more, harder",
          lines: [
            { text: "Run it again with your non-dominant hand giving, and the non-dominant inner elbow receiving. The side you do not write with." },
            { text: "Notice whether the sensation is different, or whether something emotional arrives instead." },
          ],
        },
        {"kind": "notice", "lines": [{"text": "One zone, three touches.", "emphasis": "bold"}, {"text": "Imagine this for your whole body. That is what a Touch Map is."}]},
      ],
    },
    {
      slug: "day-30-the-receiving-ritual",
      order: 34,
      title: "Day 30. The Receiving Ritual",
      imageFocus: "center 30%",
      imageAlt: "Juliette held by Alex in the garden, eyes closed",
      image: "/31-touch-points/ja-garden-held.jpg",
      eyebrow: "About 4.5 minutes, one receives, and I run all of it",
      kind: "ritual",
      imageSide: "right",
      body: [
        { kind: "p", text: "One of you stands or sits and does nothing but receive. The other gives. Press play and I take you through every layer." },
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1uvg9gND_rhtsdB4ElqrCR1n8lhfY8K2a/view?usp=sharing",
          label: "Press play and follow along. The Receiving Ritual, 4.5 minutes",
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "No touch at all first", text: "Hands hovering over their arms and chest. Can you feel them before contact? Watch for the hairs rising. Notice whether you want to move towards their hands." },
            { heading: "Then soft", text: "Fingertips, and fabric if you want it, across the same arms and then the thighs. Slower than feels natural. Does soft touch open you, or does something else happen?" },
            { heading: "Then one firm hold", text: "Palms on the thighs, then the shoulders. No movement, only pressure. Breathe in and out together. Does the stillness bring safety or tension?" },
            { heading: "Then words, from behind", text: "Stand behind them and whisper one piece of appreciation in their ear." },
            { heading: "Then breathe in sync", text: "Still standing that close. In, out, and again." },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Answer in colours, out loud, the whole way through", emphasis: "bold" },
            { text: "Red, orange or green. Same stoplight you learned on day 14, and today it is how you answer every layer." },
            { text: "Does it increase, stay the same, or decrease. That is all the receiver has to say." },
          ],
        },
        {
          kind: "why",
          lines: [
            { text: "What shifts when touch is offered like a ceremony, layer by layer?", emphasis: "bold" },
            { text: "Every other day this month has been an exchange. This one is one sided on purpose. Receiving with nothing asked back is the hardest position in a relationship and it is the one nobody practises.", emphasis: "accent" },
          ],
        },
        {
          kind: "notice",
          lines: [
            { text: "Then swap, and give it the same care", emphasis: "bold" },
            { text: "The one who received becomes the one who gives. Every layer again, in the same order." },
            { text: "Was it easier to receive all of that, or to offer it with nothing coming back?" },
            { text: "This is the last practice of the month. Whichever half was harder is the one worth knowing about.", emphasis: "accent" },
          ],
        },
      ],
    },
    {
      slug: "day-31-the-next-reach",
      order: 35,
      title: "Day 31. The Next Reach",
      image: "/31-touch-points/juliette-alex-field.jpg",
      eyebrow: "The last one",
      kind: "closing",
      imageFocus: "center 5%",
      imageSide: "right",
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1KeZfIiJ_NV3idc8WTKL4f_6aecjTtgg_/view?usp=sharing",
          label: "Listen: The Handshake of Gratitude, and close the month with it",
        },
        {
          kind: "numberedSteps",
          steps: [
            { heading: "Hands held, a hand over each other's heart", text: "Both of you. Breathe there." },
            { heading: "One thing the body knows now that it did not on day 1", text: "Each of you, out loud." },
            { heading: "Name the next piece of closeness", text: "Then take one step towards it today. Not a plan. One step." },
          ],
        },
        { kind: "quote", text: "What you actually did" },
        {
          kind: "p",
          text: "Thirty one days ago, reaching for each other had quietly stopped and neither of you could point at when.",
        },
        {
          kind: "p",
          text: "You did not fix that with a conversation about your relationship. You did it with ninety seconds at a front door, a puzzle nobody expected to finish, two backs holding each other up, and a hand held above an inner elbow while somebody said out loud what they could feel.",
        },
        { kind: "big", text: "None of it was dramatic. That is exactly why it worked." },
        {
          kind: "step",
          label: "Now do them again, the other way round",
          highlight: true,
          lines: [
            { text: "Every single one of these can be redone, and most of them change completely when you swap.", emphasis: "bold" },
            { text: "Whoever led, receive. Whoever received, lead. The days where one of you gave and one of you took are a different day entirely from the other side, and the one you found hardest is usually the one worth running again." },
            { text: "Nothing is locked. Every day stays open in here, in any order you want it." },
          ],
        },
        { kind: "big", text: "You now have your own little smorgasbord of touch points to come back to." },
        {
          kind: "why",
          lines: [
            { text: "If you keep only three", emphasis: "bold" },
            { text: "Touch Base, twice a day, for you." },
            { text: "One small bid a day, for them." },
            { text: "A date in the diary, booked before the last one finishes." },
            { text: "Everything else you now know how to find when you need it.", emphasis: "accent" },
          ],
        },
        { kind: "p", text: "Connection is not something you tick off. When you notice you have slipped back into logistics, screens, work and coexisting, come back and pick one. Your answers will not be the same ones.", emphasis: "bold" },
        {
          kind: "p",
          text: "When you are ready, the page after this one is what comes next.",
          emphasis: "accent",
        },
      ],
    },
    {
      slug: "your-next-yes",
      order: 36,
      title: "Your Next Yes",
      eyebrow: "When you want the words back",
      kind: "closing",
      image: "/rituals/31-days-closer.jpg",
      imageAlt: "31 Days Closer open on a phone at day one, beside the printed deck",
      imageSide: "left",
      body: [
        {
          kind: "p",
          text: "This month brought touch back into the room. 31 Days Closer is the other half of it.",
        },
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
        { kind: "quote", text: "The order is doing something" },
        { kind: "p", text: "Seven days on what you notice, and what you have stopped noticing." },
        { kind: "p", text: "Seven on what is actually going on in the other one." },
        { kind: "p", text: "Seven on the part most couples have quietly taken off the list." },
        { kind: "p", text: "Seven on what has been left unsaid, once you have had three weeks of practice at being heard." },
        { kind: "p", text: "Three at the end, on what you are both saying yes to." },
        {
          kind: "bigLink",
          text: "31 Days Closer, \u00a317",
          subtext: "Thirty one prompts, one a day. It opens on any phone, no account and no password, and the first card is waiting when you open it.",
          href: "https://buy.stripe.com/6oUcN47m3gty71H1Yx0co1U",
        },
        {"kind": "quote", "text": "Your Touch Map"},
        {"kind": "p", "text": "You have mapped a few inches this month. If you want me to map all of you, your whole body, then your Touch Language and your Pleasure Language, that is a VIP day with me.", "emphasis": "bold"},
        {"kind": "bigLink", "text": "Map all of me", "subtext": "VIP days, in person or online", "href": "https://feelfullyyou.com/work-with-me"},
        { kind: "quote", text: "If you want to go further than a month can take you" },
        // The One Touch graphic moved OFF the hero and down here, where it
        // belongs, 30 Sep 2026. Juliette: "the next reach prob also needs a
        // photo on top". A product graphic was standing in for the day's own
        // photograph, and it is landscape, so the half-width hero cropped it
        // to a strip. The day now opens on her and Alex reaching across a
        // field, and the graphic sits with the offer it belongs to.
        { kind: "image", src: "/31-touch-points/one-touch.jpg", alt: "One Touch" },
        {
          kind: "p",
          text: "This month was the two of you. There is one thing a partnered month cannot give you, which is a week with nobody to attend to. Seven days of your own hands on your own body, with no one to read and nothing to give back.",
        },
        {
          kind: "bigLink",
          text: "One Touch, \u00a397",
          subtext: "Seven days, on your own. Your own hands, your own body, your own pace, finding out what you actually feel rather than what you have learned to say. One purchase, yours to keep.",
          href: "https://buy.stripe.com/8x2dR8bCj4KQ2Lr8mV0co0O",
        },
        {
          kind: "link",
          text: "Or talk to me first, and we will work out what you actually need",
          href: "https://tidycal.com/juliette2/the-touch-reset-call",
        },
      ],
    },
    {
      // Moved to the END and cut, 25 Oct 2026. Juliette: "put I'm Juliette, a
      // cut version, to the end of the app (if they want to read more)" and
      // "cut the reading, bottom line it, make it fun". Alex: do not mention
      // the divorce lawyer. This supersedes the 30 Sep "do not shorten" note.
      slug: "meet-juliette",
      order: 37,
      image: "/31-touch-points/ja-selfie-striped.jpg",
      imageAlt: "Juliette and Alex cheek to cheek in a field",
      title: "I'm Juliette",
      eyebrow: "If you want to know who I am",
      kind: "essay",
      imageSide: "left",
      imageFocus: "center 40%",
      body: [
        {
          kind: "driveAudio",
          url: "https://drive.google.com/file/d/1vOBlcZbFpt0XxO9MYuSzbxxaWvWWBzzu/view?usp=sharing",
          label: "A hello from me. 2 minutes",
        },
        { kind: "big", text: "I'm Juliette, intimacy and touch expert." },
        { kind: "p", text: "For fifteen years I've helped couples find their way back to each other." },
        { kind: "quote", text: "I was on the other side of it first" },
        { kind: "p", text: "I know what it is to stiffen when the man you love reaches for you, and have no words for why.", emphasis: "bold" },
        { kind: "p", text: "Today I live in England with my fiancé, Alex. Yes, the man in the photos, with the long classical guitar nails on one hand." },
        { kind: "p", text: "If you want me with you, here are the ways in.", emphasis: "accent" },
        { kind: "link", text: "Ways to work with me", href: "https://feelfullyyou.com/work-with-me" },
      ],
    },

  ],
};

// Old page addresses, kept so links and bookmarks from before the 25 Oct 2026
// reorder still land somewhere. null = that day was cut; send them to the month.
export const LEGACY_31TP_SLUGS: Record<string, string | null> = {
  "day-17-your-choice": "day-2-you-may",
  "day-2-the-threshold": "day-5-the-threshold",
  "day-4-the-heart-hug": "day-6-the-heart-hug",
  "day-8-look-at-me": "day-9-the-staring-contest",
  "day-10-would-you-like": "day-12-would-you-like",
  "day-14-yes-no-maybe": "day-14-traffic-lights",
  "day-20-taking-for-your-pleasure": "day-20-greedy-hands",
  "day-23-the-non-goal-touch": "day-23-going-nowhere-on-purpose",
  "day-13-hover-before-you-land": "day-24-hover-before-you-land",
  "day-27-the-sensual-dance": "day-26-the-sensual-dance",
  "day-5-the-landing": "day-27-the-landing-together",
  "why-this-matters": "what-counts-as-a-touch-point",
  "why-touch-matters": "what-counts-as-a-touch-point",
  "the-container": "what-counts-as-a-touch-point",
  "day-6-name-what-you-carried-in": null,
  "day-9-mirror-and-melt": null,
  "day-12-breathe-together": null,
  "day-24-map-one-inch": null,
  "day-26-the-3-minute-touch-reset": null
};
