# The Scrumptiousness Journal and the Poems in the App — Spec

Interviewed with Juliette 19 Nov 2026. Status: APPROVED TO BUILD, narrowed by Juliette on 19 Nov 2026: "put the Scrumptiousness journal on it completely, and then we'll see how we lock it afterwards." BUILD NOW: the journal only (R10 to R17, R23 to R28, E7 to E14, D6 to D9, D12 to D14), open to anyone for now with NO gating. Gating (R1 to R9, E1 to E6, D1 to D5), the poems (R18 to R22, D10, D11) and any Stripe or price work are NOT part of this build; they come later when she says. Confessions pricing and the 2 free weeks are already handled in another thread, so do not touch or mention them. The tile is a plain tile on the home page for now, with no lock wording. Never publish, deploy or push without her yes.

## Objective
Two things she already owns go inside the Feel Fully You App (app.feelfullyyou.com, repo `couples-cards-app/practice-app`): **The Scrumptiousness Journal** (her 2024 book, 104 pages, about 1,150 write-in boxes in the fillable PDF) and her book of poems, **The Art of Scrumptious Living, Touch Base: Poems of Strength, Resilience, and the Journey Home**. The journal becomes a real, writable journal on the phone: one prompt per screen, a text box that saves as she types, her answers kept only on her phone. The poems become a quiet reading experience, one poem per screen. Both are included extras, not products sold alone: they open for Scrumptious Confessions members (while they are members) and for Scrumptious Touch Reset students (for life). Everyone can see both tiles, and everyone can taste one free poem and one free journal prompt. This adds value to the two things Juliette is selling (Confessions at £111 a month with the first 2 weeks free, and the Reset) without a new price, a new Stripe product or a new page to sell.

## Requirements

### Access and gating
R1. Two new collections exist in the app: `scrumptiousness-journal` (title "The Scrumptiousness Journal") and `scrumptious-poems` (title "Touch Base: Poems"). Titles live in one config object so Juliette can rename them without a rebuild.
R2. Access is granted by EITHER entitlement: (a) `scrumptious-confessions`, active, using the existing recurring-subscription rule (access ends 48 hours after the paid period ends, `SUBSCRIPTION_DECK_TYPES`); (b) a new `deck_type` `scrumptious-touch-reset`, permanent, with no expiry. Both collections open with either one. Add the new value to the `user_decks` CHECK constraint with a new migration written in the same union-safe way as `20261104_scrumptious_confessions.sql`. Do not create a new entitlements table.
R3. `scrumptious-touch-reset` is granted by hand from `/admin` (same way How to Feel Like a Woman was). No Stripe price is mapped yet. The Reset price is undecided, so a `PRICE_ID_TO_DECK_TYPE` line is added later in one line with no rebuild. The admin screen shows this entitlement per buyer like the others.
R4. A Confessions member who cancels loses access to both collections when the existing grace period ends. A Reset student never loses it.
R5. One setting in config, `OPENS_WHEN` , controls when the locked tile's wording says it opens and what the unlock rule is. Supported values in this build: `"with-membership"` (default). The tile wording text is a string in the same config, so "Opens at month 3" or "Opens with the year-long membership" can be changed later by editing one line. Month counting and a yearly membership are NOT built here.
R6. Free taste, open to everyone with no sign-in: ONE poem and ONE journal prompt, each chosen by a config value (`FREE_POEM_ID`, `FREE_PROMPT_ID`). The free poem is readable in full. The free prompt is a real, working text box that saves on her phone. Below each sits a quiet line: "The rest opens with your membership." (wording marked for Juliette's approval, no price, no button to a sales page that does not exist).
R7. A signed-in person without access who opens a collection URL directly (typed or bookmarked) sees the locked page: the cover, how many poems or prompts are inside, the free taste, and one clear way in (Confessions page or Reset waitlist, link set in config). Never the full content.

### The tile
R8. Both tiles appear on the app home for everyone, in full colour, no padlock, no grayscale, matching R7 of `specs/feel-fully-you-app-home.md`. Owners see them under "Yours" with progress ("14 of 96 answered" for the journal, "6 of 60 read" for the poems). Non-owners see them under "More ways in" with a short teaser line and the opening line from R5, for example "Opens with your membership".
R9. Tile teaser content: the number of poems and prompts inside and one short quoted line from the book, chosen in config (never invented).

### The journal (write-in)
R10. All words of the journal come from the source PDF, verbatim, in the book's order: `THE SCRUMPTIOUSNESS JOURNAL FINAL INNER PAGES 3-106 - NO bleed.pdf` (text and order) cross-checked against `THE SCRUMPTIOUSNESS JOURNAL Filleable.pdf` (which shows exactly where the 1,150 write-in boxes sit). Both are in iCloud Drive root (`~/Library/Mobile Documents/com~apple~CloudDocs/`). Juliette also shared the fillable PDF as a Google Drive link (file id `1RqK19brHvC0_2yhF16NsAXW5UZHcm-r2`, 108 pages); it is the same file, with the cover and back pages included. The interior pages are the 104 pages of the other PDF, and the build counts the interior pages only. The pasted text may arrive out of reading order from the PDF; the build checks each page against a rendered image of that page. Typos and unusual spellings in her words are kept. Only spacing slips are fixed, and each one is listed in the build report.
R11. The journal shows one page of the book per screen (preface, how to use it, section pages, prompts, quotes). A page with write-in boxes shows each question with its own text box under it, saved as she types (debounced, no Save button). A page with no boxes is simply read.
R12. Each write-in box has a stable key (page number plus box order) that never depends on the prompt's wording, so later copy fixes do not orphan saved answers.
R13. A contents list opens from every screen and shows the journal sections in order, with a tick on any page she has answered. A "Pick up where you left off" button on the cover opens the last page she touched. She can open any page in any order, since the book itself says it can be used "from front to back or as an oracle" (page 5).
R14. Progress is "answered / total boxes" at box level, shown on the cover, on the tile and on the contents list. Not-answered is not an error.
R15. The three QR codes in the book (podcast, and two meditation or hypnosis links) become a button or audio player on the same page. Audio comes from slots in one config object at the top of the content file. A slot with no file hides its player instead of showing a broken one. Where the PDF QR code goes to an external address, the build reads the real address from the PDF and reports it. It does not guess.
R16. "Keep a copy" button on the cover and contents list: uses the phone's share sheet with all her answers as plain text with the prompt above each answer, falling back to copying to the clipboard, then to showing the text to select. Next to it: "A new phone starts fresh, so keep a copy."
R17. A small "Come back to this" mark on any prompt she wants to return to, stored on her phone, shown on the contents list.

### The poems (read only)
R18. All poems come from her own text, verbatim, in her own section order: `~/Library/Mobile Documents/com~apple~CloudDocs/Documents/sections and poems.txt` (sections and introductions) and `Poems numbered.txt` (numbered titles, in order), cross-checked against `Poems book .docx` in the same folder. The build lists any poem found in one source and missing from another and does not choose silently.
R19. One poem per screen, centred, quiet, large readable type. Swipe or Next and Back buttons move between poems. A contents list groups poems by her sections, with each section's introduction on its own screen before its first poem.
R20. A "Keep this poem" heart on each poem stores favourites on her phone only. A "My favourites" list shows them.
R21. Poem book front matter included: title page, dedication ("To my children, Zina, Noor, Hani, and Faisal..."), the epigraph and the Author's Note, verbatim. The placeholder text in the draft ("Copyright Page: A copyright statement...") is NOT shown. The build leaves the copyright page out and lists that in the report.
R22. Progress is "N of M read" (a poem counts as read once its screen has been open for it). Stored on her phone.

### Privacy
R23. Everything she writes in the journal, her "come back to this" marks, her favourite poems and her read progress is stored in localStorage on her phone only. Nothing she types is sent to Supabase, Kit, Telegram, Netlify logs, analytics or Juliette. The existing `practice_journal_entries` table is NOT used. The page says in plain words: "What you write stays on your phone. Not even I see it."
R24. The only thing that leaves her phone is anonymous counts through `lib/count` (for example "poem opened", "prompt answered") with no user id, email, typed words or prompt text.
R25. Her stored answers are never deleted by the app when access ends. If she loses access they are hidden and locked, and come back untouched when access returns.
R26. If localStorage is blocked, the page works and says plainly that answers will not be kept.

### Wording and look
R27. Dark look and Poppins/Inter type from the existing app kit (`specs/feel-fully-you-app-home.md` R1). Photos only from Juliette's own files already in `public/` or the Photo Library, never AI images. The book covers (`~/Downloads/poembookcover.png`, `The Scrumptiousness Journal Mockup.jpg` in iCloud `Desktop/SCRUMPTIOUS/`) may be used as tile covers.
R28. Any new connecting copy (tile lines, locked-page lines, button labels, the free-taste line) is short, in her voice, and listed in the build report for her approval. Voice rules apply to it: no em dashes, no sentences starting with "And", no "Not X, but Y", never "problem", "issue", "lovely", "broken", "here's the thing". Capital T on Touch always. British English. Her book words are left exactly as she wrote them, even where they would not pass these rules today.

## Out of scope
- Selling either one alone, a Stripe product or price for them, or a sales page.
- The Reset modules themselves (their own spec) and tying journal pages to Recognise, Discern, Discover, Ask & Receive.
- Month-of-membership counting and a year-long membership price.
- Audio of Juliette reading the poems (her poem videos in Drive and the chapter audio in iCloud can come later through a slot).
- Journal answers synced to an account or readable by Juliette.
- A daily "prompt of the day" on the home screen.
- Printing, PDF export of the journal, or selling the Amazon book from the app.
- Aligning the Confessions price and free trial in Stripe and the app (a separate job, see Constraints).
- Any git commit, push or deploy without Juliette's yes.

## Constraints
- Repo: `/Users/julietteckaraman/Desktop/Cards Project/couples-cards-app/practice-app` (Next.js 16, Supabase, Stripe, Netlify; deploys from GitHub main). The folder under `Documents/APP builds/02 Cards Project/couples-cards-app/practice-app` is a stub with only a build cache and is the wrong place.
- Reuse the Let Her Land pattern (`app/practice/let-her-land`, `lib/content/let-her-land.ts`) for the write-in journal and localStorage saving, `lib/count` for counts, `CollectionGate` for gating, `lib/entitlements/config.ts` for the deck types, and the existing admin screen for the Reset grant. Read all five before building.
- Other work is uncommitted in this repo. New files plus the minimum edits to `lib/entitlements/config.ts`, the gate, the home page and admin screen only. Do not touch, stage, revert or reformat anything else.
- Her words are never retyped from memory or rewritten.
- Never publish, deploy or push. Build locally, show screenshots at 375px, wait for her yes.
- Sequencing. Her rule is to ship the three money offers first. This build delays two things: (1) the Reset modules page in the app, and (2) aligning Confessions to £111 a month with a free 2 weeks in Stripe and the app. Checked in the Stripe dashboard 19 Nov 2026 (product `prod_Vbm7ukx8Blxpy2`): a £111 a month price already exists and is the default (created 16 Nov, 0 active subscriptions), the £97 price is archived with 1 active subscriber, and no trial is set. The app only recognises the £97 price (`price_1UaYZICCw18geY15j9xNbIhd` in `lib/entitlements/config.ts`), so a new £111 subscriber would pay and get nothing. The £111 price id needs adding to `PRICE_ID_TO_DECK_TYPE` (the £97 line stays so the existing subscriber keeps access), and the 2 free weeks needs setting as a trial in Stripe. Recommended order: (2) first, then this build, then the Reset modules. The size is roughly 2 to 3 build days for this spec.
- Open decisions for Juliette (the build uses the stated default, reversible in config): O1. Whether free-trial members can open the journal and poems. Default: yes, as soon as the Confessions entitlement exists. O2. The wording and rule of the tile when she is not a member (default "Opens with your membership"). O3. The FREE_POEM_ID and FREE_PROMPT_ID. O4. Titles for the two tiles.
- Facts to keep out of any copy the build writes: no prices on the tiles, no Reset price, no "12 weeks", no "founders". The Reset is 8 weeks, women only, price not set.

## Edge cases
E1. Signed out, no account: sees both tiles and the free poem and free prompt only. The rest shows the locked page (R7).
E2. Signed in, no access: same as E1 plus her email and Sign out at the bottom.
E3. Confessions member in the free 2 weeks: follows O1 (default open).
E4. Confessions lapses or cancels: after the grace period both collections lock, her answers stay on her phone, hidden (R25).
E5. Reset student with no Confessions: both collections open, forever.
E6. She holds both entitlements: no double tile, no error.
E7. She changes phone or clears site data: the journal starts empty (R16 told her). The app does not claim to restore it.
E8. localStorage blocked (private window): everything reads, boxes accept typing for the session, page states answers will not be kept (R26).
E9. Text is very long in a box: the box grows or scrolls, never clips her words.
E10. She opens a page from the contents list that she skipped: it opens with empty boxes, nothing forced.
E11. Share not supported: copy to clipboard and confirm on screen. Both blocked: show the text to select.
E12. A QR code's audio file is missing: player hidden, rest of the page works.
E13. The poem titles show "You Are Not Broken" and similar: kept verbatim in her book titles.
E14. Mobile first. Everything works at 375px with no horizontal scroll and tap targets of at least 44px, and also at 1280px.
E15. The Stripe webhook or Supabase fails: no effect on journal and poem content for anyone already entitled, since gating reads entitlements only.
E16. A poem is in the numbered list but missing from the sections file (or the reverse): the build stops and lists it before shipping.

## Definition of done
D1. On a 375px viewport signed out, the home shows both tiles in full colour, no padlock, each saying when it opens, with the poem and prompt counts and a short quoted line.
D2. Signed out, the free poem opens and reads in full, and the free prompt accepts typing, saves, and is still there after reload.
D3. Signed in with no access, opening `/practice/scrumptiousness-journal` and `/practice/scrumptious-poems` directly shows the locked page and none of the paid pages' content (checked against a real non-entitled test account).
D4. A test account with an active `scrumptious-confessions` entitlement opens both collections in full. After its grace period ends (or the entitlement is expired by hand), both lock again.
D5. A test account granted `scrumptious-touch-reset` by hand from `/admin` opens both with no Confessions entitlement, and the admin screen shows that entitlement against the email.
D6. Journal text matches the source PDF page by page: the build report states the page count (104), the number of write-in boxes found (1,150 in the fillable file) and shows a page-by-page check with every spacing fix listed. Zero retyped or reworded lines.
D7. In the journal, typing in a box, closing the browser and reopening shows the answer. Progress on cover, tile and contents list updates to match ("N of M answered").
D8. "Keep a copy" produces a text with each prompt and its answer, via share sheet or clipboard, with the "new phone starts fresh" line beside it.
D9. Network check: typing an answer sends no request containing the typed words, and the Supabase `practice_journal_entries` table gets no rows from the journal. Only anonymous counts are sent.
D10. The poems open one per screen with working Next, Back, contents grouped by her sections with each section introduction, favourites heart and "My favourites" list. The dedication, epigraph and Author's Note are present, and no template placeholder text appears.
D11. Poem count in the app equals the poem count in her source files, and the build report lists any difference (E16).
D12. The three QR code spots in the journal show a working player or button, or nothing at all if there is no file. No broken player is visible.
D13. All new connecting copy is listed in the build report and contains none of the banned words or constructions in R28, with Touch always capitalised.
D14. `npm run build` passes, nothing outside the files listed in Constraints changed, no commit, push or deploy happened, and screenshots at 375px and 1280px of the tile, locked page, journal page, contents list and a poem are shown to Juliette for approval.
