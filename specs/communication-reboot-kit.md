# Communication Reboot Kit (Practice App) — Spec

## Objective
The Communication Reboot Kit (£37) currently sells through a live, working sales page and Stripe Payment Link, but delivers access by handing the buyer a "make a copy of this Google Doc" link. This build retires that handoff and moves the kit into the Practice App (app.feelfullyyou.com), matching how The Unspoken Distance and 10 Touch Rituals already work there: a real purchase automatically unlocks a real in-app collection, no redemption code. The kit's welcome content, Touch Base™ explanation, Soft Start Conversation Kit scripts, the 46 prompt cards, and two videos are transcribed/embedded as real app content. Two genuinely new features are built for this: a persisted 31-day AM/PM practice tracker, and persisted journal/reflection answers.

## Requirements
R1. Buying via the existing live Stripe Payment Link (price `price_1TnwwmCCw18geY15egD5h7Fr`, £37) automatically grants access to the Communication Reboot Kit collection in the Practice App — same mechanism as The Unspoken Distance / 10 Touch Rituals (`PRICE_ID_TO_DECK_TYPE` + the Stripe webhook / `resolve-purchase`), no redemption code.
R2. A new collection slug `communication-reboot-kit` is added to `COLLECTION_DECK_TYPES`, `PRICE_ID_TO_DECK_TYPE`, and `PURCHASE_URLS` (pointing to `https://feelfullyyou.com/communication-reboot-kit`) in `lib/entitlements/config.ts`, following the existing pattern exactly.
R3. The collection appears in the Practice App library as a locked cross-sell tile (linking to the real sales page) for anyone who hasn't purchased, and as an unlocked, readable collection for anyone who has — same UI pattern as existing paid collections.
R4. The welcome/intro, "Start Here" overview, Touch Base™ explanation, the Soft Start Conversation Kit (SMS scripts by tone, in-person starters, before-you-invite-them-in checklist, how-to-set-the-mood tips), and the closing content are transcribed into the app's `ContentBlock` model, matching the same verbatim-transcription standard already used for The Unspoken Distance (nothing summarised, nothing dropped).
R5. The Touch Base™ Video and the Mini Dyad Instruction Video are embedded using the existing `{ kind: "driveVideo", url, label }` block (same pattern already used elsewhere in the app for Drive-hosted content), using the two Drive links from the source doc verbatim:
- Touch Base™ Video: `https://drive.google.com/file/d/1H9glMx7rnAkzwMFMxlBE9UDEvJH2bOu7/view?usp=sharing`
- Mini Dyad Instruction Video: `https://drive.google.com/file/d/1fs-hgIeJwX7NFsqxLvBYEi38i0oOhN0K/view?usp=sharing`
If Juliette later moves either to Vimeo, swapping the block kind is a small follow-up, not a blocker now.
R6. New tracker feature: a 31-day, twice-daily (AM/PM) practice tracker. Each entry captures date, AM or PM, a "before" number rating, and an "after" number rating — matching the source doc's structure exactly. Entries save to the signed-in user's account and persist across sessions and devices.
R7. New journal feature: the doc's 4 fixed reflection prompts ("What surprised you," "What felt good or hard," "What you want to remember," "What changed, even subtly") plus one open "additional reflections" free-text space. Answers save to the signed-in user's account and persist across sessions and devices.
R8. The Touch Reconnection Playlist ("Touch Reboot") is embedded as a real, clickable Tidal link: `https://tidal.com/playlist/a5040664-341e-4aac-9e24-099eb04dc2d2`. Directly below it, this confirmed line runs verbatim, first person, not a disclaimer: "I came off Spotify. It doesn't pay artists fairly, and its founder is funding a company that builds weapons for genocide. I won't be associated with that. This playlist lives on Tidal instead."
R9. `thankyou-communication-reboot-kit.html` is updated to remove the "Open your kit" Google Doc button and instead link to `app.feelfullyyou.com/login?email=...`, matching the canonical in-app delivery pattern (see When She Goes Quiet / Between Touches). `communication-reboot-kit.html`'s sales copy and the live Payment Link itself are untouched.
R10. Tracker and journal data belongs to the signed-in account (Supabase), not the browser/device — switching phones does not lose progress.
R11. The 46 prompt cards (see Appendix: Card Text below — transcribed verbatim from `Communication & Intimacy Reboot Kit (2).pdf`, pages 5-13) are rendered via the `{ kind: "promptGroup", ... }` block or an equivalent card-browsing view within the collection. Cards 16 and 46 are the couples/solo phrasing of the same closing integration prompt; both are included, not deduplicated.

## Out of scope
- Any redesign of `communication-reboot-kit.html`'s sales copy or price.
- A print/PDF export of the tracker.
- Reminders/notifications for the twice-daily tracker.
- Sharing tracker/journal entries between partners — each account's data is private to that account only, unless Juliette says otherwise later.

## Constraints
- Lives in `practice-app` (the `couples-cards-app/practice-app` subfolder). Does not touch the Cards app (`couples-cards-app` root).
- Reuses the existing entitlements pattern (`lib/entitlements/config.ts`) exactly, not a new mechanism.
- Reuses the existing `ContentBlock` model (`lib/content/blocks.ts`) for all static content. The tracker and journal are the only genuinely new data types/tables in this build.
- Video hosting is the existing `driveVideo` block kind (see R5), not a new embed pattern.
- Backend is Supabase, matching the rest of the app. New tables/columns needed for tracker entries and journal answers.
- Brand rules apply to any new copy written for this build: four colours only, no em dashes, no sentences starting "And".
- Does not change the live £37 price or the existing Stripe Payment Link.

## Edge cases
E1. Someone without a purchase opens the collection directly — shown the locked tile / redirected to the real sales page, same as other paid collections, content never exposed.
E2. A tracker day (AM or PM) is skipped — no penalty, no forced catch-up, the day just stays blank.
E3. Past day 31 — the tracker stays visible and usable, nothing breaks or auto-hides.
E4. Buyer's Practice App account email doesn't match their Stripe purchase email — same manual email-match fallback already used for other paid collections.
E5. Mobile viewport (the primary context for daily tracking) — tracker and journal entry forms are comfortable to fill in one-handed on a phone.
E6. Someone fills in a journal/tracker entry while logged out or mid-session-expiry — entry is not silently lost; either the save is blocked with a clear sign-in prompt, or the draft is preserved until they sign in.
E7. The "why Tidal, not Spotify" line (confirmed text in R8) should live in a single, easy-to-swap constant, not hardcoded in multiple places.
E8. Google Drive video permissions: both videos must stay set to "anyone with the link" (already the case, per the source doc's own share links) or the embeds break silently — worth a quick check before shipping.

## Definition of done
D1. Completing a real £37 purchase through the live Stripe Payment Link unlocks the `communication-reboot-kit` collection on that email's Practice App account.
D2. A signed-in account without a purchase sees a locked tile for the kit in the library; clicking it goes to the real sales page, not into the content.
D3. A signed-in, entitled account can open the collection and read the welcome, Start Here overview, Touch Base™ explanation, Soft Start Conversation Kit scripts, and closing content in full, matching the source doc.
D4. Both videos play in-app via the Drive embed.
D5. Filling in an AM tracker entry (before/after rating), closing the app, and returning later — on the same or a different device — shows that entry still saved.
D6. Answering a reflection journal prompt, closing the app, and returning later shows that answer still saved.
D7. `thankyou-communication-reboot-kit.html` no longer offers the Google Doc button; it links to `app.feelfullyyou.com/login` with the buyer's email.
D8. The playlist section shows a real, clickable Spotify link once supplied (or a clearly-marked placeholder if not supplied at build time).
D9. The tracker and journal entry screens render cleanly on a 375px mobile viewport.
D10. No files under the Cards app (`couples-cards-app` root, outside `practice-app/`) are changed by this build.
D11. All 46 cards from the Appendix are present and readable in the app, verbatim.

## Appendix: Card Text
Transcribed verbatim from `Communication & Intimacy Reboot Kit (2).pdf` (pages 5-13), a real PDF export of the source Google Doc, read directly by Claude on 10 Aug 2026. This is the authoritative source for R11 — do not re-derive from the Google Doc or guess at Canva files.

1. Tell me what intimacy feels like to you in your body.
2. Tell me about one moment with me that still has you smile. What do you feel in your body recalling this now?
3. Tell me what I can do that helps you soften into feeling safe.
4. Tell me what scares you about touch, and what excites you.
5. Tell me the kind of touch that lingers long after it's over.
6. Tell me about a time that touch didn't feel right for you, and why.
7. Tell me what you secretly wish more of between us.
8. Tell me the part of your body that most wants to be celebrated and why.
9. Tell me how your hands ache to explore me.
10. Tell me something playful you've secretly wanted to try with me, but haven't said out loud yet.
11. Tell me what you dream our intimacy could look like a year from now.
12. Tell me about a ritual, big or small, you wish was part of our relationship.
13. Tell me something you admire about how I love you or how we are together.
14. Tell me about a time you felt seen, understood, or cherished by me.
15. Tell me what you most love about yourself right now.
16. Tell me a win, insight or learning about doing this experience together. *(integration prompt, couples phrasing)*
17. Tell me what intimacy with yourself looks and feels like.
18. Tell me what touch means to you when no one else is involved.
19. Tell me a moment when someone's touch felt wrong, and how your body remembers it now. How can I best support you when this comes up?
20. Tell me what helps your body feel safe enough to open.
21. Tell me how your body longs to be touched today.
22. Tell me what you're hungry for having more of in your own life.
23. Tell me which part of your body surprises you with pleasure.
24. Tell me how you most want to touch yourself when you're not rushing.
25. Tell me one small way you could be gentler with yourself this week.
26. Tell me what a new self-care ritual could look like if it was all about pleasure and ease.
27. Tell me where in your body or in your life you feel lightest right now.
28. Tell me what you would say to your own body if you could write it a love letter today.
29. Tell me what you wish you could gift yourself, an experience, an insight, or simply a feeling.
30. Tell me how you most want to feel when you wake up tomorrow, and what might help.
31. Tell me something you've never said because you didn't want to change. How I / your partner sees you.
32. Tell me about a moment you wanted more closeness, but didn't know how to ask.
33. Tell me what your family still doesn't quite "get" about who you are now.
34. Tell me a part of you that feels most alive in this relationship, and one that feels a little forgotten.
35. Tell me about a tradition you secretly loved, or secretly loathed, growing up.
36. Tell me one story from your childhood that shaped how you see love.
37. Tell me one part of your body you're learning to love and what helps.
38. Tell me one part of your body you feel real pride in. How do you care for it?
39. Tell me something you used to chase that no longer feels important.
40. Tell me what makes a day feel meaningful to you now.
41. Tell me one way you protect your peace.
42. Tell me how your body lets you know it feels safe with someone.
43. Tell me something you used to hide because you thought it made you weak, but now see differently.
44. Tell me what belief about yourself is starting to soften.
45. Tell me what emotion you find hardest to witness in others, and how it lands in you.
46. Tell me what is a win, insight or learning you've had about this experience. *(integration prompt, solo phrasing — always asked last, per the source PDF's own "To integrate, ALWAYS ask this prompt" instruction page)*
