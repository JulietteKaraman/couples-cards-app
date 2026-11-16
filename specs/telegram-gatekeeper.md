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
