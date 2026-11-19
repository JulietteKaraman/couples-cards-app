# The Living Library (Scrumptious Confessions)

Agreed with Juliette, 19 Nov 2026. Status: spec only, not built.

## The idea

People open the app with something on their mind, not wanting "an essay". So the library is sorted by **what's on their mind**, and every shelf mixes every kind of content. It grows every week without Juliette doing extra work.

## The app, in three sections

1. **This week.** What's new:
   - Monday: confession and card
   - Wednesday: a page of poems (owned by the journal-and-poems build)
   - Friday: one meditation
2. **Your path.** The monthly unlocks (MEMBERSHIP_UNLOCKS in lib/entitlements/config.ts, already live), plus what opens next month.
3. **The library.** The shelves below.

## Shelves (names locked by Juliette, "Yes, use them")

| id | Shelf |
|---|---|
| numb | Feeling nothing |
| touch | Touch and the body |
| desire | Desire and pleasure |
| us | Him, her, us |
| safe | Safety and trust |
| shame | Shame and the past |
| men | For men |
| calm | Calm, sleep and clarity |

A piece can sit on more than one shelf.

## Content types (all on the same shelves)

- **Answers.** public/scrumptious-confessions/answers.json, 71 of them.
- **Essays.** essays.json, 50 of them.
- **Podcast moments.** podcast.json has 136 episodes. Each one is transcribed, and every question she answers becomes a "moment" with a start time.
- **Meditations.** About 43 of her own. The list was confirmed 19 Nov; see the memory file project_scrumptious_confessions_membership_live_16nov2026.md.
- **Practices and programmes.** These link to their own pages, and only once unlocked for that member.
- **Confessions and poems,** as they are published.

## Every item carries

`{ id, type, title, shelves[], minutes, kind: "listen" | "read" | "do", added_on, member_only, unlock (optional: week or month) }`

## Filters and finding

- Listen / Read / Do
- 5 / 15 / 30+ minutes
- A search box, "What's on your mind?", that searches titles, questions and transcripts
- **Start here:** Juliette's 5 favourites (she picks them)
- **New this week:** anything added in the last 7 days
- **Saved** and **carry on where you left off:** kept on the phone (localStorage), like the Journal

## Meditations release

- 3 open on day one for members: Feeling Safe & Touch Base, Body Confidence and Peace, Sleep Tight.
- Then one more every Friday, counted from each member's first payment.
- Audio lives in a PRIVATE Supabase storage bucket and plays through short-lived signed links for members only, like the drops bucket. Never in public/.
- Juliette uploads the prepared files once through an admin upload page.

## Who sees what

- **Members** (a user_decks row with deck_type "scrumptious-confessions" whose checkout id does not start with "free-", or the admin email) get everything that is open to them.
- **Non-members** see shelf names, titles and the "Start here" five as a taster. Each item shows a lock and a link to the sales page.

## Living: how it keeps growing

- Every new confession, answered member question, poem and meditation gets tagged onto shelves when it is added.
- Tags are suggested automatically from the text or transcript. Juliette never has to tag by hand; she can change a tag.

## Out of scope for now

- The late night shelf (her erotic stories). Decided yes, but later.
- A "Start here" for each Touch Reset Quiz type. Later.
- The Journal and poems. Those belong to specs/scrumptiousness-journal-and-poems.md.

## Never

- Other people's recordings: Marisa Peer, LWL, Dr Joe Dispenza, Guided Visualization, Money Mountain, Chakra Wisdom, Future Self, REMAINS, RELEASE 2018.
- Client recordings: Rupertmeditation, "Juliette Session 29 Nov".
- Member names or identities, anywhere.
