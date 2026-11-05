# Scrumptious Confessions membership — Spec

Agreed with Juliette in chat, 4 Nov 2026. Her words: "the scrumptious confessions part of this app I want to duplicate and make a membership", "I will put a teaching in every one of them", "I think we do Stripe anyway", "I will put the touch base in there so that they can do that, practise that every day, and then have a tracker in there for 31 days or so", "£97 for 3 months", "renews every 3 months", "tell me how did that land. Tell me where you felt that. Tell me what you'd love next- and that one gets emailed to me", "they also get a weekly prompt (card) and wonder how I can collect some data from it".

## Objective
Scrumptious Confessions becomes its own paid product in the practice app: one story a week in Juliette's voice with a teaching inside, Touch Base every day with a 31-day tracker, and a weekly prompt card. After each story the woman answers three "Tell me" prompts, which prime her for the cards. Juliette sees anonymous totals and receives what women choose to send her.

## Requirements
R1. New collection and deck type `scrumptious-confessions`, its own page at /practice/scrumptious-confessions, behind the same sign-in gate as the other paid products.
R2. Treated as a renewing subscription using the existing Members App mechanism: access runs to the end of the paid period plus 48 hours. It can also be granted by hand from /admin.
R3. Stories and cards live in code in `lib/content/scrumptious-confessions.ts`, each with a publish date. Only items dated today or earlier (UK) reach a member, and the list is served by a server route that checks she has access.
R4. A Stories tab: her cover art, newest story open at the top, older ones listed and openable, and a locked "Coming [day]" tile when the next one is dated.
R5. After each story, three prompts in this order: "Tell me how that landed." (ick, nothing, nice, mmm, goosebumps, toes curl), "Tell me where you felt that." (chest, belly, genitals, somewhere else, nowhere yet), "Tell me what you'd love next." (a writing box).
R6. The first two answers are saved on her phone and counted anonymously per story, with no name, email or typed words attached. Changing her answer does not count her twice from that phone.
R7. "Tell me what you'd love next" says on screen, before she sends, that it comes to Juliette with no name on it. No name or email is ever stored with it (changed 5 Nov 2026, Juliette: anonymous, Telegram group for sharing).
R8. A sent answer is saved to a private table that only Juliette can read, on /admin/confessions. A "Share it in our group" button opens her private Telegram group.
R9. A Today tab: Touch Base in Juliette's voice, with her emblem as the play button, then how much she felt, "I did it", and 31 coloured dots. Back and forward a day. "I missed this day" on past days. "Do it again" on a done day. A way to start a new 31 days when these are finished. Kept on her phone.
R10. A Card tab: the week's prompt card, black back first, tap to turn, a writing box, and an optional "Send it to me" with no name, as in R7. Answering counts anonymously per card. Older cards are listed.
R11. "← Your library" at the top of the page.
R12. /admin/confessions, for Juliette only: totals per story and per card, plus every sent answer, newest first.
R13. Owners see a tile on the app home.

## Out of scope
The Stripe price and payment link, public sales page, cancel-and-manage link, Kit tag and welcome email, public home tile, and any change to How to Feel Like a Woman. These are the next step before anything can be sold. Stories are not moved out of How to Feel Like a Woman.

## Constraints
Practice app, same look as How to Feel Like a Woman. Never commit components/auth/CollectionGate.tsx or another session's uncommitted files. Push only with her yes, and only named files. No new Stripe keys in this build. Audio is AAC with faststart, stored under an unguessable file name. Her voice is never processed.

## Edge cases
E1. No story has opened yet: a warm line, and no prompts.
E2. Empty answer: the Send button stays off.
E3. Answer over 2,000 characters: the box stops at 2,000 and the server refuses more.
E4. Member's access has ended: the same gate as other products, and the server refuses both list and send.
E5. Anonymous count fails: nothing shows to her and the page carries on.
E6. Send fails because of the connection: she sees "That didn't send. Try again." and her words stay in the box.
E7. Day 31 passed: she can start a new 31 days, and earlier days stay on her phone.

## Definition of done
D1. /practice/scrumptious-confessions on a 375px screen shows ← Your library and the Stories, Today and Card tabs.
D2. A story shows a player and all three prompts in order, with the wording in R5.
D3. Choosing a landed and a where option stays selected after a reload, and sends only item, kind and value.
D4. The "love next" box shows the no-name notice before sending, Send is off when empty, and the group button shows.
D5. Today tab: Touch Base play button, feel options, I did it, 31 dots, day back and forward, Do it again, I missed this day.
D6. Card tab: card turns from black back to prompt, with writing box and optional send.
D7. /api/confessions refuses a request with no sign-in, and returns 403 to someone without access.
D8. /admin/confessions refuses anyone but Juliette, and shows totals and sent answers.
D9. A send stores no name or email.
D10. The project type-checks and the migration file adds the deck type and two tables with row security on.
