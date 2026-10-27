// One Touch, £97. Moved into the app 27 Oct 2026 (Juliette: "rebuild One Touch in
// the app like the others and show me before it goes live").
//
// Source of truth: feelfullyyou-site/one-touch-members.html, the old password
// page. Same videos (Vimeo), same words, same cards. The card pictures were
// downloaded from Drive into /public/one-touch/cards so they no longer depend
// on Drive. Day 6 never had its own card, it points at the full deck in the
// cards app, as before. The members page stays live as a quiet backup.
//
// One day at a time, same rule as The Sacred No and 31 Touch Points: Welcome
// and Day 1 open together, the next day opens once the day is marked done.
// Transcripts are kept but folded away under the video.

import { PracticeCollection, PracticeEntry } from "./ten-touch-rituals";

export type OneTouchEntry = PracticeEntry & { transcript?: string };

export const oneTouch: PracticeCollection & { entries: OneTouchEntry[] } = {
  slug: "one-touch",
  title: "One Touch",
  subtitle: "Seven days, a few minutes each. Start at your own pace. Each day opens once you've done the one before.",
  byline: "By Juliette Karaman",
  heroImage: "/one-touch/hero.jpg",
  unlockMode: "free-browse",
  theme: "dark",
  entries: [
    {
      slug: "welcome",
      order: 0,
      title: "Welcome to One Touch",
      eyebrow: "Day 1 · Before you begin",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "video", vimeoId: "1213912895", ratio: 56.25 },
        { kind: "p", text: "Hello, my loves, and welcome to One Touch. Over the next seven days we dig deeply, but softly, into the conditioning that may have kept you from touch that lands. So many of us live in our heads, disconnected from the body." },
        { kind: "p", text: "Each day is a short embodiment practice, and I'll teach you Touch Base, a simple anchor that quiets the fight, the flight and the fear, so your body can feel safe. It always brings people back to calm." },
        { kind: "p", text: "One thing: please don't skip ahead. These days are sequential, each one built on the one before, like a Lego tower. Without the foundation, you can't go higher. Start when you're ready." },
      ],
    },
    {
      slug: "the-one-touch-cards",
      order: 0.5,
      title: "Your One Touch cards",
      eyebrow: "All 23 · Open any time",
      kind: "essay",
      imageSide: "left",
      body: [
        { kind: "p", text: "Draw one, then answer it. Out loud, in writing, or to someone you trust." },
        { kind: "cardDeck", deck: "One Touch", prompts: ["Tell me what is available to you now that you didn't have access to before these 7 days.", "Tell me, where does suspicion land first in your body? What does it feel like?", "Tell me when you've said yes although your body said no. How does it feel to voice that now?", "Tell me what you have not voiced yet still influences the way you receive touch. What do you need in order to feel safe and secure to receive touch now?", "Tell me about a time you did something because of how someone else labelled the experience. What would you do differently now?", "Tell me about the last time your body tightened but you didn't speak up. What would you do differently now?", "Tell me, when was the last time you looked in the mirror and fully saw yourself without judgement?", "Tell me one way someone tried to touch you (physically or emotionally) and it did not land for you. What would you ask for now?", "Tell me what one touch are you hoping that lands? How would that feel?", "Tell me what you can access after the last video that may have been absent before.", "Tell me what surprises you about your own touch. What have you been told about touching your own skin?", "Tell me about your relationship to sensuality. Is it easy for you to access it?", "Tell me one thing you've never dared ask for, because you were afraid of the answer.", "Tell me about the story your mind writes in the silence before you know the facts.", "Tell me what it means to feel safe.", "Tell me what happens when you do not have any time for yourself.", "Tell me how you take care of yourself when things get a bit much.", "Tell me one way you judge yourself or your body.", "Tell me, if you'd feel safe in yourself, what would you have access to? How would that feel? Describe a body sensation.", "Tell me what you would like to get out of this time together? Describe how that would feel in your being.", "Tell me about a time you felt free to express yourself.", "Tell me how you relate to other women / men.", "Tell me what does safety feel like in your body."] },
      ],
    },
    {
      slug: "your-own-touch",
      order: 1,
      title: "Your own touch",
      eyebrow: "Day 1",
      kind: "ritual",
      imageSide: "left",
      transcript: "Hi, loves. Welcome to Day 1. Today we learn the anchor I call Touch Base, to land back into our bodies. So often we're so caught in emotion that we don't feel safe. The one thing that brings people back to their own touch is this simple thing, repeated, and breath.\n            Take a breath in through your nose, and exhale through your mouth. Notice what's happening in this body of yours. Can you feel anything past your throat? No judgment. We're reteaching you the felt sense of being in this body. Maybe energy is buzzing, or static. Maybe a little bracing. Maybe temperature, cold or warmth, buttery. Reach for those words.\n            Bring your thumb and forefinger about an inch apart. Watch the gap close ever so slightly. Feel the buzzing, the warmth of the fingers almost touching. Then let them land. Notice what it feels like to receive touch from your own fingers. Now ever so slowly move the top finger over the bottom one, so slowly you can feel every ridge. Go slower still, almost uncomfortably slow. Most of us want to speed up. Here I'm getting you to slow down.\n            As you touch base, say to yourself, \"I'm safe. There's no tiger behind me.\" Do this somewhere that genuinely feels safe. This anchors it into your subconscious, so any time you touch base, your body starts to feel safe and comes out of that heightened state.\n            Now some music, and gentle exploration. Cup your face, up the jawline to your earlobes. Softly play with the fleshy part of your earlobes. Hook two fingers under your ear and bring them down to your shoulder, varying the pressure. This is all vagus nerve, where yawning or emotion can come up. If you have cream, add a little so it glides. Then both hands to your heart. The gurgles, the yawns, the pooling saliva, all signs your nervous system is down-regulating.\n            To finish, today's card: what have you not voiced yet that still shapes how you receive touch? What do you need in order to feel safe to receive touch now? The first step of self-love is awareness. For you, maybe it's comfortable clothes, a bath, a walk, a nourishing meal. Whatever tells you that you can get back into your body. I'll see you tomorrow.\n          The practice, step by step\n            1. Sit somewhere safe. Breathe in through the nose, out through the mouth. Notice what you feel below the throat.\n            2. Touch Base: thumb and forefinger an inch apart, bring them together slowly, let them land, move the top finger over the ridges. Say out loud, I am safe.\n            3. Cup your face up to the earlobes and play. Two fingers under the ear, down to the shoulder, varying the pressure.\n            4. Both hands to your heart. Breathe. Let the yawns and gurgles come.",
      body: [
        { kind: "video", vimeoId: "1217025640", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "image", src: "/one-touch/cards/day-1.jpg", alt: "One Touch card: Tell me what surprises you about your own touch. What have you been told about touching your own skin?" },
        { kind: "journal", key: "one-touch-day-1", label: "Your answer. Only you see this.", placeholder: "Write it down, or say it out loud to someone you trust." },
      ],
    },
    {
      slug: "moving-the-energy",
      order: 2,
      title: "Moving the energy",
      eyebrow: "Day 2",
      kind: "ritual",
      imageSide: "left",
      transcript: "Hello, loves. Day 2. We start again with a breath. Notice what's going on in your body. Breath in, exhale. Where's the tightness? Where's the sensation?\n            Now some music, and we move the energy through the body. Feet hip distance apart. Start swaying, a figure eight, shoulders and hands, cross-body. Shoes off, to ground and feel the earth. Grip your toes into the ground, almost like a tiger. If you want, include Touch Base. You're safe.\n            Hips into a figure eight. Arms up and down, like wipers, wipe on, wipe off. Shoulders all the way up to your ears, and drop. Again, up onto your tippy toes, and drop. Notice what's happening in your body. Hands into the small of your back, your adrenals, swaying softly. That's where we carry a lot of tension.\n            Come to standing. Left hand, squeeze your shoulder. Breathe out. Right hand, drag it across your chest to your hip, squeeze, down the thigh, the kneecap, a rub, let it go. Then the left side the same. Come to sitting. Look up into your left eyebrow, breath, exhale, relax. Back to center. Up into your right eyebrow, breath, exhale, and drop your eyes all the way down, your jaw and cheeks letting go.\n            To integrate: fingertips, pitter-patter on your forehead, down to your temples. Now slow it, fingers like combs, from your forehead to your ears, into your hairline. Down to the nape of your neck, and cradle your neck. One hand on your forehead, one on your neck, and relax. If you had a mother who took your temperature like this, that's what we're doing.\n            Hands down, squeeze the tops of your thighs, grounding pressure. Imagine zippers in your hands and feet, unzip them onto the floor, and flush the excess energy down. You may start burping, that's energy moving. Then a card: what surprises you about your own touch? What have you been taught about touching your own skin? Recognising imprints that aren't even ours, that hold us back from touch that lands. I'll see you on Day 3.\n          The practice, step by step\n            1. Breathe, check in. Music on.\n            2. Sway in a figure eight through the hips and shoulders. Grip your toes.\n            3. Arms like wipers. Shoulders up to the ears and drop, onto tiptoes.\n            4. Hands to the small of your back, keep swaying.\n            5. Squeeze a shoulder, drag across the chest to the hip, down the thigh to the knee, let go. Both sides.\n            6. Eyes up to each eyebrow, a breath, then drop.\n            7. Pitter-patter the forehead and temples. Comb back into the hairline. Cradle the neck.\n            8. Squeeze the thighs. Unzip the hands and feet, flush the energy down.",
      body: [
        { kind: "video", vimeoId: "1217599510", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "image", src: "/one-touch/cards/day-2.jpg", alt: "One Touch card: Tell me what does safety feel like in your body." },
        { kind: "journal", key: "one-touch-day-2", label: "Your answer. Only you see this.", placeholder: "Write it down, or say it out loud to someone you trust." },
      ],
    },
    {
      slug: "saying-yes-when-your-body-said-no",
      order: 3,
      title: "Saying yes when your body said no",
      eyebrow: "Day 3",
      kind: "ritual",
      imageSide: "left",
      transcript: "We're moving on to the next day. Again, let's start with Touch Base. Feet hip-width apart. A breath in through your nose, exhale through your mouth. I'm already starting to sway a little, figure eights, we'll learn more about that through the course. Bring it back to Touch Base. Always two minutes, every time. Do a little check-in, notice what's happening in your body. Where are you bracing? We're bringing awareness to your touch state. Put your attention on the space between your fingers. Ever so slowly, let those fingers touch. Let the top finger land. What does it feel like to receive that touch from yourself? Then slowly let the top finger move. You can feel every single ridge.\n            You're doing this somewhere safe, because this is our vigilance centre. If we don't know what's behind us, it goes up. I know what's behind me, so I know I'm safe here. Say it out loud: \"I am safe.\" It sounds like repetition, but we're doing reps over perfection. It takes 21 to 31 days daily, and 90 days for it to become muscle memory, so when you tap your fingers on the Chinese meridians, your whole body relaxes. Sometimes you get pulled out of presence. The beauty is you can come back: \"Oh, awareness. Where did my attention go?\" If you're with a partner, you can say, \"Stop, I need to do this so I can be present with you.\" Naming what pulls you out of presence is one of the biggest things that shifts a relationship.\n            So, how many of us have said yes to touch, to an experience, when we were actually a maybe, or not a hell yes? I teach the kinesiology of this in my Sacred No course. A snippet: close your eyes, we take away some senses. Ask yourself a question you know is a yes, for me, \"Is your name Juliette?\" Notice, does your body lean forward, or back? For me it moves forward. Now ask a question the answer is no to. \"Is my name Alexander?\" For me, a slight tilt backwards. The body is the compass. Notice what it is for you.\n            Now a little touch, the inside of the arm and the wrist, where there's a lot of sensation. When I did this with my group of women, I said, \"Let's have a self-touch date,\" and there was clenching of bottoms. Notice, did your body go no? Any clenching? We're just aware of it. Put one hand forward, hover the other on top. Breathe in and out, then slowly let the hand land, like Touch Base. Bring the hand, fingers and a little nails, up your wrist to the inside of your elbow, move it to the right, cup it there, then scratch to the left. Bring it up, massage your shoulder, inhale, up on your tippy toes, exhale, let it come down. Now the left hand across your chest, down to your left hip, down to your knee, and let it go. Are you a yes or a no to that? Now down that same arm, slowly, slower still. Is that more sensationful? Now one hand on your heart, one on your sacral, connecting those two places. Thank yourself for taking ten minutes to connect with your body. Continue on, we've got a few more days of tapping into the fullness of you.\n          The practice, step by step\n            1. Touch Base, two minutes. Notice where you brace.\n            2. Ask a question you know is a yes, feel the body sway forward or back. Ask a no, feel the opposite. Your body is the compass.\n            3. Hover a hand over the wrist, let it land. Fingers and nails up to the inside of the elbow, cup, scratch. Massage the shoulder.\n            4. Left hand across the chest, to the hip, to the knee. Then the same arm slower. A yes, or a no?\n            5. Hand on the heart, hand on the sacral. Thank yourself.",
      body: [
        { kind: "video", vimeoId: "1217025637", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "driveVideo", url: "https://drive.google.com/file/d/1RVRhUZU8RTirAaNRQ0EN0xaKOpWdkA58/view", label: "Bonus: a little 3-minute follow-along embodiment" },
        { kind: "image", src: "/one-touch/cards/day-3.jpg", alt: "One Touch card: Tell me when you've said yes although your body said no. How does it feel to voice that now?" },
        { kind: "journal", key: "one-touch-day-3", label: "Your answer. Only you see this.", placeholder: "Write it down, or say it out loud to someone you trust." },
      ],
    },
    {
      slug: "what-youve-never-dared-ask-for",
      order: 4,
      title: "What you've never dared ask for",
      eyebrow: "Day 4",
      kind: "ritual",
      imageSide: "left",
      transcript: "Hello, my loves. Day 4, and today we get a little more delicious.\n            Grab a silk scarf, a slip, anything that glides like water. This is the day you give yourself the touch you've been waiting your whole life for someone else to give you.\n            Ground first, you know the way now. Breath in through the nose, out through the mouth, touch base, until your body knows it's safe. Take a few moments with your fingers, deeply imprinting that it's safe. Repetition over perfection. That's the practice here. Recognise where your heartbeat may have come down, your breathing stabilised. All of that is information.\n            Now let's add some sensation to it. Close your eyes, because by taking away one of the senses, we increase the pleasure. Take a breath in, and reach for the scarf.\n            Let the silk find your skin. Drag it, slow as honey, along the inside of your wrist, that thin skin that almost never gets touched. Up the forearm. Your shoulder. Pull it ever so slightly up, around the side of your throat.\n            Barely there at first, a whisper, so your body has to reach up to meet it. Feel your skin lift. Feel the goosebumps chase it. Then let it get greedy. More weight. A slow drag across your collarbone, the nape of your neck, wherever your breath catches. You may want to add some pressure there too.\n            When something makes you sigh, stay there. Do it again. Your body is telling you, in the plainest language it has, exactly how it wants to be wanted. Play with different speeds, up or down. What feels even better? Sometimes it takes a while for pleasure to come, so let yourself feel the sensations, however minute. It's all information.\n            While the silk moves, let the real question rise, the one you've buried. Tell me, what is the one thing you've never dared ask for, because you were terrified of the answer? The touch, the pleasure, the being wanted, that you decided long ago you weren't allowed to have. Feel it move through you as the fabric moves. Your body already knows what it is.\n            Wrap the silk around your bare shoulders now, and hold yourself like you're the most wanted woman or man in the room, because in this room, you are. Say it out loud. \"The one thing I've never dared ask for is…\" Then, my love, stop waiting. You are the one who gives it to you now. See you tomorrow.\n          The practice, step by step\n            1. Ground. Touch Base until the body knows it is safe.\n            2. Close your eyes. Take the silk.\n            3. Draw it along the wrist, forearm, shoulder, throat. Barely there, then heavier. Where you sigh, stay. Play with the speed.\n            4. Let the question rise, what is one thing I have never dared ask for?\n            5. Wrap the silk around your shoulders, hold yourself, name it out loud.",
      body: [
        { kind: "video", vimeoId: "1217026064", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "image", src: "/one-touch/cards/day-4.jpg", alt: "One Touch card: Tell me what one thing you've never dared ask for, because you were afraid of the answer." },
        { kind: "journal", key: "one-touch-day-4", label: "Your answer. Only you see this.", placeholder: "Write it down, or say it out loud to someone you trust." },
      ],
    },
    {
      slug: "a-time-you-felt-free",
      order: 5,
      title: "A time you felt free",
      eyebrow: "Day 5",
      kind: "ritual",
      imageSide: "left",
      transcript: "Hello, my loves. Day 5. Yesterday was slow and secret. Today we get loud. This is the day you let yourself take up space.\n            Ground first, breath in, out, touch base. Then feet hip-width, and unzip. Your hands. Your feet. The zippers in your hands and feet. Take a breath in, and shake it all down into the earth.\n            I'm putting on a song, one that makes most people want to move. Let it move something in you too, and let your body go, if you want to.\n            The figure eight through your hips, working both brain hemispheres. Now the shoulders, up to your ears, clench, and drop. Clench, and drop. While the hips keep their figure eight.\n            Now the shoulders rolling, and this time let it get bigger than feels comfortable. Bigger. Even bigger. The way you'd move if no one had ever once told you to sit still, be quiet, be smaller. Let your hips be shameless. Slow down. Speed up. Let your arms take up the whole room.\n            Now add your voice. A sigh first. An exhale, and let the jaw go. Again, in through the nose and out through the mouth, all the way out. Loosen your tongue and stick it out on the next exhale. Really let it go.\n            Now add a hum. Then the voo sound. Like a fog horn, deep in your belly. Voo, and out it goes. Again. Again. Again. Notice if that brings up any emotion. It's a deep practice, and it can unlock a lot. Your body may start belching, yawning, shaking. Let it come.\n            Let whatever wants to come, a moan, a laugh, a sound you'd normally swallow. Feel it vibrate in your chest, your throat, your belly. This is your expression, the thing you've been editing your whole life, off the leash.\n            As your body moves and your voice comes, let the question arise. Tell me, when was the last time you felt this free? When you danced, sang, loved, wanted, without shrinking first? Chase that feeling. Let the movement become it.\n            Then, slowly, bring it down. Both hands to your chest, feel your own heart pounding, your breath high and alive, the heat in your skin. This is you, the one who takes up space. You were never gone. You just let yourself out of the box.\n            Afterwards, drink water. Journal if anything came up. Electrolytes are even better, you moved a lot. Nature helps too. Go easy on stimulants. Your body just showed you what it's capable of, in a very short time. See you tomorrow.\n          The practice, step by step\n            1. Ground, Touch Base, unzip.\n            2. Music on. Move bigger: figure eight hips, shoulders up and drop, arms taking the room.\n            3. Add voice: a sigh, a hum, then the voo sound. Again and again.\n            4. Ask, when did I last feel this free? Chase it in the movement.\n            5. Bring it down, both hands on the chest.\n            6. After: water, journal, get outside.",
      body: [
        { kind: "video", vimeoId: "1217026730", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "image", src: "/one-touch/cards/day-5.jpg", alt: "One Touch card: Tell me about a time you felt free to express yourself." },
        { kind: "journal", key: "one-touch-day-5", label: "Your answer. Only you see this.", placeholder: "Write it down, or say it out loud to someone you trust." },
      ],
    },
    {
      slug: "layering-the-touch",
      order: 6,
      title: "Layering the touch",
      eyebrow: "Day 6",
      kind: "ritual",
      imageSide: "left",
      transcript: "Now, Day 6. Today we layer on some touch. There've been some intense days, and now we layer on sensation. Go to your kitchen and get a few things ready: a little washcloth, whatever sponges you have, a piece of fruit, something that smells good like a perfume, and a fork and a spoon. In the Touch Reset we start to layer in different sensations, and look at what implements we can use to bring in more sensation. Pause, get those things, and come back.\n            We've already started taking one sense away. What if we layer? Some of us like a blindfold. For some that feels scary, and if you'd rather watch, that's beautiful too. All of this is PG. Take a cleaning cloth, or a new one if that feels better. I layer it on my neck and pull it really, really slowly. You can do this with a silk scarf, a tie, ropes, all different sensations. That's one touch. We're doing a little touch map here. Now a cold metal fork. The tines. Take it to the edge of your jaw, just under your earlobe, and bring it down to your chin. Add a little breath. Bring Touch Base back in any time. Bring the tines down your throat and pause. Up to your chin, then the other side of the jaw, up into your hair. Now one side with the fork, the other with your fingernails. Into your hair an inch or two, then down to your neck. Notice the different sensations. Hand on your heart, on the sacral centre, and breathe. On a scale of one to ten, how pleasurable? Rate it immediately, without going into your head.\n            Now pick up a piece of fruit, a lemon, a tomato, anything. Put it close to your nose. Breathe in. This is a delicious nectarine. Let it touch the upper side of your lip, then under your nose. Feel the softness of the skin. Close your eyes, does that increase the smell? People ask how I did the thing with Fern McCann on ITV. I was feeding her a raspberry after her partner had shoved one in her face and missed the signals. This is where you slow it down to increase the pleasure. Pick up the spoon. Smell what you brought, it could be chocolate. Add the spoon to your neck, to that vagus nerve we massaged in one of the first videos. Now open your mouth, put your lips around the fruit, and if it's juicy, take a bite. Keep it in your mouth. Move your tongue up your palate, let the saliva pool, and swallow. Slow it down. Does that increase the pleasure, or get you into your head? All of it is beautiful awareness. If you have a perfume, smell just the tip, or an oil. Is that too much after the fruit, or just right? Now something scratchy, a metal scourer or a sponge. Bring it up the inside of your wrist to your elbow, and do the same on the other side with the other implement. Touch A, touch B. For me, up more than down. This is the beauty, we're starting to play with our touch map, bringing in implements that increase the sensation and the pleasure. Tomorrow we wrap it all up. Notice how you're more and more in your body as these days progress.\n          The practice, step by step\n            1. Gather a cloth, a fork, a spoon, a piece of fruit, something scented.\n            2. Ground, Touch Base.\n            3. Cloth on the neck. Cold fork tines down the jaw, throat, into the hair. Nails on the other side. Rate it one to ten.\n            4. Fruit to the lip and the nose. Spoon down the neck. A slow bite, tongue to the palate, eyes closed.\n            5. Scent, just the tip. Scratchy versus soft up the wrist. Touch A, touch B, which lands?\n            6. Hand on the heart, hand on the sacral.",
      body: [
        { kind: "video", vimeoId: "1217026849", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "p", text: "Day 6 doesn't have its own card. Draw one from the full One Touch deck instead." },
        { kind: "bigLink", text: "Draw from your One Touch cards", subtext: "All 23 cards. Draw one, answer it.", href: "/practice/one-touch/the-one-touch-cards" },
      ],
    },
    {
      slug: "the-body-youve-been-at-war-with",
      order: 7,
      title: "The body you've been at war with",
      eyebrow: "Day 7",
      kind: "ritual",
      imageSide: "left",
      transcript: "Hello, my loves. Day seven, our last one. Look how far you've come this week.\n            Ground again, the zippers, you know how now. Zippers in your feet, in your hands. Use the sofa, or whatever you can touch, and let that energy move through you and out. Touch base, thumb to forefinger, recognising that you are safe. There's no lion behind you. You are safe. Reps over perfection. Go even slower today. Come up onto your toes, up, up, up, and drop. Let it all settle.\n            Today we go somewhere you've probably spent a lifetime at war with. Gently ask the card: what is one way you judge your body? Your belly, your arms, your face, the part you've criticised in the mirror for years, the thing you'd never say to someone you love.\n            Stand in front of a mirror and really look at yourself. Set a timer for a minute and a half, and let every judgment come out, out loud, at yourself. The gremlins, the things you silently say. That time limit matters, so your body knows it will end and doesn't check out. A minute and a half, starting now. When it's done, let it shake through you, using cross-body shadow boxing, your arms punching across the midline: no, no, no, you do not get to touch me here. For all the moments someone touched you in a way that felt unsafe.\n            Take a breath, that may have been intense. Come back to your body. Hands on your tummy, or any part, and recognise you are safe. Touch Base for a moment, tap your fingers. Notice how you come back.\n            Now we wire in the other side. The gratitude. Find one of those spots you bitch about, and find it with your own hands. The one you've hated. Instead of giving it war, give it worship. Talk to it. For me, these hands have held my parents as they died, my babies, my clients. This belly held four healthy babies and four miscarriages. This mouth has kissed, screamed, laughed, roared. These legs have carried me everywhere.\n            Choose one place, and be slow, reverent. Be your own lover. Cup it the way a lover who adored you would, someone who found that exact place beautiful. Add the warmth of your palm, and circle it, both hands at once. Notice the moment your body flinches, expecting the old criticism, and instead receives warmth. Feel it soften under a touch that has stopped judging it. Say to it: you did nothing wrong. You were only ever keeping me safe. Feel what happens in a body that hears that, maybe for the very first time.\n            One hand to your heart, the other to your sacral centre. Rock yourself a little. Hold the whole of you. Now look up between your eyebrows, up, up, breath, let go. To the left, up toward your left eyebrow, breath, let go. To the right, breath, and on the exhale, drop your eyes. A little EMDR, to settle the change.\n            Now the heart hug. Right hand under your left armpit, left arm across, and hold yourself. Notice your breath. There may be discomfort, you went big these last two days. Let yourself receive the hug. Pat, pitter-patter on your arms.\n            Seven days ago, many of you barely knew this body. Now you have a map. You know what has you sigh, what has you soften, what it's been starving for, and how to give it to yourself. This is just the beginning, and it's yours forever. You are, at last, the one who touches yourself like you're precious, because you are.\n            If you want to go deeper, take the Touch Reset Quiz to notice your pattern and start building your own Touch Map, your yeses and your nos. All the prompts these seven days I made especially for One Touch, keep asking them of yourself, or with a partner. Much love.\n          The practice, step by step\n            1. Ground, Touch Base, unzip. Onto the toes, up, and drop.\n            2. Mirror, ninety seconds on a timer: say every judgment out loud. Let the timer end it.\n            3. Shake it out, cross-body, no, no, no.\n            4. Come back: hands on the tummy, I am safe.\n            5. Worship the place you hate, warm palm, slow circles. You did nothing wrong, you were keeping me safe.\n            6. Hands to the heart and the sacral, rock.\n            7. Eyes up between the eyebrows, left, right, drop. Then a heart hug.",
      body: [
        { kind: "video", vimeoId: "1217026911", ratio: 56.25 },
        { kind: "p", text: "Watch the video first. The card is the integration.", emphasis: "accent" },
        { kind: "image", src: "/one-touch/cards/day-7.jpg", alt: "One Touch card: Tell me one way you judge yourself or your body." },
        { kind: "journal", key: "one-touch-day-7", label: "Your answer. Only you see this.", placeholder: "Write it down, or say it out loud to someone you trust." },
      ],
    },
  ],
};

// All 23 One Touch cards, as one list (the deck and each day's draw use it).
export const oneTouchPrompts: string[] =
  (oneTouch.entries.find((e) => e.slug === "the-one-touch-cards")?.body.find((b) => b.kind === "cardDeck") as
    | { prompts: string[] }
    | undefined)?.prompts ?? [];
