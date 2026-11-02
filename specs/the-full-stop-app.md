# The Full Stop, in the app — Spec

Juliette, 2 Nov 2026, after seeing When She Stops Reaching in the app: "I actually really like what you did, so I'm wondering if we can do that whole funnel." Then: "Yes, build it." Same decisions as specs/when-she-stops-reaching-app.md unless written here.

## Objective
Move The Full Stop (£9, order bump 1 in the men's funnel) from its hidden web page into the app in the same style, so it feels like a week he comes back to.

## Requirements
R1. Hidden app page at /practice/the-full-stop. No sign-in, noindex, no library tile.
R2. Same look as /practice/when-she-stops-reaching.
R3. One step on screen at a time, with next, back, "← Your library" and "Do it again" (returns to the first reading step, keeps his days).
R4. Order: hero > What it is > Why it is called a Full Stop > What the question actually does > The three ways it leaks > Twelve worked pairs > When she says nothing > How to practise it > Your week and the door.
R5. All wording is hers, taken unchanged by script from the-full-stop/index.html.
R6. Her three voice notes in their places. The first plays on Begin.
R7. Twelve worked pairs, one on screen at a time, "x of 12", next and back. Tap the card or the switch to change between Full stop and With something attached.
R8. Your week: today's check-in "How much did you notice?" with the same three colours, then "I did it ✓". Each day fills a dot, in rows of seven labelled Day one to Day seven for the current week.
R9. One a day: after he taps I did it, today shows done with her line "One a day is enough." until the next calendar day.
R10. After day seven, her line "A week of Full Stops. That is enough." shows. The next day starts a new row and keeps the old one.
R11. Her journal "Write down today's one true thing", saved on his phone only.
R12. One door: 31 Touch Points, £27, https://feelfullyyou.com/31-touch-points.
R13. Anonymous counts only: opened, day done with day number and feel.
R14. Going live: feelfullyyou.com/the-full-stop 301s to the app page.

R15. Both bites, Juliette 2 Nov: voice notes have speed up to 1.5x. More interactive and poppy without changing her words: tap moments, progress bar, gentle motion, always ending fully readable. New hint lines are listed for her approval.

## Out of scope
New recordings. Any change to Stripe or Miles's funnel. Sign-in.

## Constraints
Shared pieces and styles live in components/BiteKit.tsx, also used by When She Stops Reaching. Nothing pushed until Juliette has seen every screen.

## Edge cases
E1. Browser storage blocked: page works, days last for that visit.
E2. A recording can't load: the player does not show.
E3. He tries a second day on the same date: blocked by R9, with no scolding copy.
E4. He misses days: nothing marks them. The next tap is the next day.
E5. He returns: back on the step he left.
E6. No colour chosen: the dot is plain gold.

## Definition of done
D1. At 375px the page opens with no sign-in on the hero.
D2. Every step has next, back, library, Do it again.
D3. Every old line of wording is present.
D4. All twelve pairs step through and switch.
D5. I did it adds a coloured dot, survives reload, and blocks a second on the same day.
D6. A week of seven fills one row, shows her line, and day eight starts a new row.
D7. One door, 31 Touch Points; The Approach Ritual appears nowhere.
D8. Juliette has seen every screen and said yes.
