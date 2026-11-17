# Scrumptious Confessions: Telegram gatekeeper (16 Nov 2026)

Juliette: "and how do we kick people out who dont pay after it goes paying?" ... "Yes, build it".

## Requirements
R1. Every person with Scrumptious Confessions access gets their OWN Telegram invite link in the app (one use, made by the bot). Nobody without access can get one.
R2. The app no longer shows the one shared group link.
R3. When someone joins through their link, the bot records which app account that Telegram account belongs to. Messages stay unlinked: the questions bank never stores who wrote what.
R4. Once a day, the bot removes every recorded member whose access has ended (free fortnight over and not paid, or stopped paying). Removal is not a permanent ban: if they pay again they get a new link and can rejoin.
R5. Juliette, Kiera and anyone who joined some other way are never removed by the bot (they are not recorded).
R6. The group's chat id is picked up by the bot itself from the group (or TELEGRAM_CHAT_ID on Netlify), no hunting for ids.
R7. Her steps are few and exact: run one SQL, make the bot an admin who can add and remove members, press Connect Telegram again, post one message in the group, switch off the old shared link.

## v2: full anonymity (17 Nov 2026, Juliette: "Build full anonymity")
Why: in a group every anonymous poster must be an admin, and admins are always visible to each other (Charlene's test, 17 Nov). Hide Members needs 100+ members and never hides admins.
R8. The space is a private Telegram CHANNEL. Subscribers cannot see each other; only Juliette (owner) can.
R9. Members post by messaging the bot privately. If the sender is a current member (joined through their personal link, access still live), the bot posts their text into the channel with no name, saves it to the questions bank (no name), and replies "Posted, with no name on it."
R10. Text only. Voice notes, photos and files are refused with a kind reply (a voice can identify someone).
R11. Anyone not a current member who messages the bot gets: join through the app.
R12. Juliette posts in the channel herself, with "Sign messages" on, so her answers show her name.
R13. Joining, recording and daily removal (R1-R4) carry over to the channel. No admin promotion any more.
R14. When the bot learns a new channel (first channel post), everyone recorded for the old place gets a fresh link automatically.
R15. The app's group button explains: you're invisible to other members; to post, message the bot.
