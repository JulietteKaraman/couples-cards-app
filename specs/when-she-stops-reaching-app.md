# When She Stops Reaching, in the app — Spec

Agreed with Juliette in chat, 2 Nov 2026. Her words: "at the moment they feel a bit boring - it needs to be more like the scrumptious stroking app", "yes lets start with one of the funnels - to test it".

## Objective
Move When She Stops Reaching (£17, the first bite in the men's funnel) from its long hidden web page into the Feel Fully You app, so it feels like the Scrumptious Stroking app and gives him a reason to come back. It is the test for all the funnel bites: if it works, The Full Stop and the other bites follow the same pattern.

## Requirements
R1. New hidden app page at /practice/when-she-stops-reaching. Opens with no sign-in. Juliette, 2 Nov: "They don't need a login. They can send it to others, but I don't really care that much. They're cheap products." Not on the app home or library tiles, not in the sitemap, noindex.
R2. Same dark look as How to Feel Like a Woman: #070707 ground, gold #DDC98E, her photo as the hero, slim voice players, no boxy players.
R3. One step on the screen at a time, with next and back on every step, and "← Your library" at the top of every step.
R4. Order: hero and her minute of welcome > What is actually happening > What this is > Setting it up (She said yes / She said no) > Touch Base > The Approach Ritual > The Full Stop > check-in > What you might notice and If you lose the structure > the door.
R5. All wording is Juliette's existing wording from when-she-stops-reaching/index.html, unchanged. Long passages stay available but sit behind her existing fold-outs.
R6. Reuse her existing recordings, videos and photos: the welcome, Touch Base audio and video, the Approach demo video and 2-minute talk-through, and her voice leading into the Full Stop when the timer ends.
R7. Clock-based 5-minute timers using PracticeTimer, screen kept awake, chime on silent iPhones.
R8. "All three, one screen" stays as the do-it-now step: Touch Base, Approach, Full Stop, each with Done.
R9. A private box for the one true thing he said, saved on his phone only.
R10. Check-in after the sitting: "How much did you notice?" Very little (teal #2c7a72) / A bit (ochre #A88538) / A whole range (lemon #EEDE80), then "I did it".
R11. Each completed sitting adds a dot in the chosen colour, in a row that grows with no fixed target. Nothing records or scores the distance she chose.
R12. If she said no, Touch Base alone counts as a sitting and earns a dot with a gold ring.
R13. "Do it again" returns to the start of the practice and keeps his dots. Back and forward work across steps.
R14. One door at the end: 31 Touch Points, £27, to https://feelfullyyou.com/31-touch-points. The Approach Ritual is not offered anywhere.
R15. Notes, dots and progress stay on his phone. Anonymous counts only: opened, sitting done, feel. No name, email or text.
R16. Every new line of copy (check-in, buttons, dots label) is listed for Juliette's approval.
R17. Going live: feelfullyyou.com/when-she-stops-reaching 301s to the app page, so Stripe's after-payment address does not change and past buyers land in the new version.

## Out of scope
The Full Stop and the other bites (after this test). Sign-in or Stripe wiring. Weekly drops and tabs. New recordings. Any change to Stripe or Miles's funnel. New wording beyond R16.

## Constraints
Repo couples-cards-app/practice-app (Next.js), reusing SlimPlayer, PracticeTimer, the Interactive pieces and the How to Feel Like a Woman patterns. Leave other people's uncommitted work in that repo alone: only this page's files go in its commit. Nothing is pushed until Juliette has seen every screen, then one push per repo. Voice bans apply to new copy only; her own words stay.

## Edge cases
E1. She said no: no pressure copy, straight to Touch Base alone, per her existing words.
E2. Phone locks during a timer: time stays right, chime still sounds.
E3. Video can't load: the step still works from the audio and written steps.
E4. Audio file missing: the player does not show, the step still works.
E5. He changes phone or clears his browser: dots start again, the page still opens.
E6. Browser storage blocked: the page works, dots last for that visit only.
E7. He leaves midway: he returns to the step he was on.
E8. He taps "I did it" with no colour chosen: the dot fills plain gold.
E9. Tracking: the old page fires only a Meta PageView and Google Analytics, no purchase event. The app has no tracking or cookie banner at all, so this page has neither. Raised with Juliette 2 Nov.

## Definition of done
D1. At 375px wide, in a private window, the page opens with no sign-in on the hero photo.
D2. Every step shows one thing at a time, with next, back and "← Your library".
D3. A word-for-word check finds all the old page's practice wording present.
D4. Touch Base and the Approach timers run to the end and chime with the screen locked.
D5. Completing a sitting adds a dot in the chosen colour, and it is still there after a reload.
D6. "She said no" leads to Touch Base alone and earns a gold-ringed dot.
D7. "Do it again" restarts the practice and keeps the dots.
D8. The end shows one door, 31 Touch Points £27, and "Approach Ritual" appears nowhere on the page.
D9. The typed note is not sent anywhere: network requests show only anonymous counts.
D10. Juliette has seen every screen and said yes before anything is pushed.
D11. After go-live, the old address lands on the app page in a private window, and a real test purchase through the live checkout ends there.
