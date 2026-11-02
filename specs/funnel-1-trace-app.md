# Funnel 1 (The Trace) in the app — Spec

Juliette, 2 Nov 2026: "now lets do the next funnel". Same decisions as specs/when-she-stops-reaching-app.md and specs/the-full-stop-app.md: no login, her wording unchanged, speed up to 1.5x, tap moments, whole photos with heads in.

## Objective
Move The Trace (£17), The Fifteen Minutes After (£12) and The 45-Minute Connection Ritual (£27) from hidden web pages into the app, on one shared engine that the next funnel can also use.

## Requirements
R1. Hidden pages at /practice/the-trace, /practice/the-fifteen-minutes-after, /practice/the-45-minute-ritual. No sign-in, noindex, no library tile.
R2. Same look, voice player, tap moments and progress bar as the men's bites.
R3. All wording taken unchanged by script from the site pages. Offers in "Keep going" are replaced by R9.
R4. All photos come from Photo Library originals where one exists, framed by hand so heads stay in.
R5. All her voice notes and videos in their places. Each page's first voice plays on Begin.
R6. Interactive pieces carried over: checklists, Giving/Receiving switch, "Which moment are you in?", Thank you/Clarify/Summarise, timers.
R7. The Ritual's two Dyads work as on the site: card back first, tap to turn, her voice on the start, Thank you the first time, Clarify and Summarise every time, bell at the end, her last word after the second Dyad's bell.
R8. Each page has the check-in "How much did you notice?", a sitting dot in that colour, and "Do it again".
R9. One door at the end: 31 Touch Points, £27.
R10. The Fifteen Minutes After still opens the cards app with the same unlock link.
R11. Anonymous counts: opened and sitting done, per bite.
R12. Going live: the three old addresses 301 to the app pages.

## Out of scope
Funnel 2. New recordings. Changing the cards app. Changes to Stripe.

## Edge cases
E1. Storage blocked: page works for that visit. E2. Recording can't load: player does not show. E3. Video can't load: "Video not playing? Open it here" link where the site had it. E4. He returns: back on the step he left. E5. No colour chosen: plain gold dot.

## Definition of done
D1. Each page opens at 375px with no sign-in. D2. Every step has next, back, library, Do it again. D3. Every old line of wording is present, except the offers. D4. Both Dyads flip, speak and count. D5. The check-in adds a dot that survives reload. D6. One door. D7. Juliette has seen the screens and said yes.
