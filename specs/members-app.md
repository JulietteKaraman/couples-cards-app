# Members App — Spec

## Objective
A unisex, monthly-subscription membership tier inside the existing Feel Fully You App, taking over Touch Point's old slot in the offer ladder (Touch Point retired 1 Aug 2026, was £197/mo, men-only, 2 members). It gives someone who has done the free Touch Reset Quiz an easy next yes, before One Touch or The Room, not another menu to browse. It opens with the person's own real result (their Touch Pattern, Pleasure Language and Touch Language, already sitting in Kit from the quiz) and hands them one specific next video, line or practice at a time. It doubles as the app companion to Juliette's book, "The Touch Languages™: How You Are Touched By Life" (27 chapters, publish-ready since 18 Jul 2026, awaiting only her cover) — same five Touch States, same diagrams, same language, so a reader of the book and a member of the app are living inside one system, not two. Built entirely from material Juliette already has: her Touch Menu and its recordings, her weekly teaching, her Yes/No Quiz and Sacred No course, a lightweight self-guided version of her Touch Map exercise, and the book's own already-designed diagrams and the state-ladder practice. It must run with no ongoing manual content work from Juliette after initial setup.

## Requirements

**Personalisation (the new spine)**
R1. On first entering the membership, a member sees their own stack, meaning their Touch Pattern, Pleasure Language and Touch Language, pulled in from Kit's existing custom fields (touch_pleasure/pattern/language, IDs 1308776–79) already captured by the Touch Reset Quiz. This is not a re-ask and not a blank menu, it is what they already told the quiz, reflected back.
R2. A "Where are you right now" check-in lets a member name their current Touch State from the book's own five states (Braced, Withheld, Performing, Present, Melted), reusing the book's existing state-ladder framing and its four-part "move one rung" practice (braced moves by exhaling, withheld moves by naming a need, performing moves by dropping the show for 10 seconds, present moves by letting one thing in). This is a live, in-the-moment check-in, not a quiz result, the book itself is explicit that Touch State is read live, not derived from quiz answers.
R3. Each check-in is saved with a timestamp against the member's account, so they can see their own movement between states over time. A simple list (date plus state named) is enough at launch, a visual trend is a nice-to-have, not required for launch.
R4. The app reuses the book's own diagrams as real images inside the member experience rather than new graphics being designed for the app: `state-ladder.svg`, the five individual state icons (`diagrams/states/state-{braced,withheld,performing,present,melted}.svg`), and `the-stack.svg`. Same house style the book already established (cream ground, gold frame, deep-green line-art), so the app visually reads as the same world as the book.
R5. Based on a member's stack, the app surfaces one specific next Touch Menu item or practice at a time, "you're a [Pattern] who's turned on by [Pleasure Language], start here", rather than presenting the full Touch Menu library to browse from day one. The full library stays reachable underneath, it's just not the first thing shown.

**Existing content, still included**
R6. Touch Menu library: each Touch Menu item (from Juliette's existing Google Drive material) gets its own entry with the written instructions and, where a recording exists, her audio walking through it. Ships with whatever recordings exist at launch, more are added over time without a new release being required.
R7. Self-guided Touch Map: a couple can work through a lightweight version of the "same touch, two ways" exercise together inside the app, guided by in-app instructions, not the full live depth-read Juliette does in The Room. Framed explicitly as a starting point, with a clear next step pointing to The Room for the real version.
R8. Yes/No Quiz → Sacred No: the existing quiz and the existing 7-day Sacred No video course become one complete module inside the membership.
R9. Weekly teaching feed: an automation pulls from Juliette's most recent Substack essay and/or podcast episode each week and publishes an adapted teaching post into the membership feed. No manual weekly input required from Juliette. This is now a supporting, ongoing feed underneath the personalised spine (R1 to R5), not the membership's main draw.

**Infrastructure**
R10. A recurring Stripe subscription product for the membership, billed monthly at **£77/month** (locked, Juliette, 4 Aug 2026), on the existing Stripe account.
R11. A successful subscription grants ongoing access to the membership's collections inside the practice app, same magic-link sign-in as every other collection, for as long as the subscription stays active.
R12. A member's progress (Touch Menu items opened/completed, Touch Map self-report result, and the state check-in history from R3) is saved to their account and still there next time they sign in, using the same progress-tracking pattern already built for other collections in the app.
R13. Cancellation or a failed renewal payment both trigger the same rule: access continues for 48 hours, then is removed if not resolved.
R14. Someone who already has an account from any existing free door (the quiz, Between Touches, etc.) and later subscribes sees the membership appear as a new, unlocked section in the same library they're already signed into. No new signup, no separate app.
R15. The membership is unisex, open to anyone, unlike Touch Point.

## Out of scope
- Scrumptious Bodies material as its own module (may be pulled in later as bonus depth, not required to launch).
- Scrumptious Dates (cut entirely, not part of this build).
- A partner-guided, fully app-facilitated version of the real Touch Map mechanic (day one is self-guided/lightweight only, see R7).
- "The Stages of Touch" (The Quiet, The Brace, The Gone), this is a separate, relationship-distance routing framework from the book, not the individual Touch State ladder. Not part of this build, do not conflate the two.
- Deciding what happens for the 2 existing grandfathered Touch Point members (not addressed by this spec, flag to Juliette before launch if it needs a decision).
- Any change to The Room's or The Beginning's price, content, or delivery.
- A full visual chart or graph of state movement over time (R3's history view is a simple list at launch, charting is a future enhancement).

## Constraints
- Builds inside the existing Feel Fully You App (practice-app), reusing its current stack: Next.js, Supabase (auth + Postgres), Netlify hosting, Stripe, and the Resend-backed transactional email set up 3 Aug 2026.
- Reuses the existing content-block system (text, audio, video, image blocks) already built for other collections, no new content format needed for R6 to R9.
- Reuses the existing entitlement pattern (the user_decks-style table) but needs one new capability nothing in the app currently has: an entitlement that can expire or be revoked. Everything today is a one-time, permanent grant.
- Needs a new, small integration nothing in the app currently has: reading a member's Kit custom fields (touch_pleasure/pattern/language) at sign-in time to power R1 and R5. This is a read from Kit, not a write, the quiz keeps writing to Kit exactly as it does today.
- Diagram and icon assets for R4 already exist and should be pulled directly from `touch-languages-book/diagrams/` (state-ladder.svg, the-stack.svg, diagrams/states/*.svg), do not redesign or recreate these.
- No new ongoing manual work for Juliette after initial setup, the weekly teaching mechanic (R9) must run on its own from her existing Substack/podcast output.
- **Price: £77/month, locked 4 Aug 2026.** Reasoning: mapped against the real customer journey, free quiz → 10 Touch Rituals £7 → One Touch (possibly repriced to £197, see note below) leaves nothing between a £7 tripwire and a ~£197 commitment. This membership is that missing rung, priced at the midpoint of the £57 to £97 range Juliette was weighing, one simple price rather than tiers, "so it becomes really easy" to say yes.
- **Related, not part of this build:** Juliette is considering repricing One Touch from its current £97 to £197, to sit where Touch Point used to (retired 1 Aug 2026). That's a separate live-product price change, not something this membership build touches, flagged here only because it's the other end of the same ladder gap. See [8. Offer Ladder & Pricing](https://app.notion.com/p/3a1c7588d9ea8129aac7dcdd87a84bb1).

## Edge cases
E1. Someone cancels voluntarily → access continues for 48 hours from cancellation, then is removed.
E2. A renewal payment fails → access continues for 48 hours, then is removed if the payment still hasn't gone through.
E3. Someone resubscribes after a lapse → their prior progress (completed Touch Menu items, Touch Map result, state check-in history) is still there, not reset.
E4. A given week has no new Substack essay or podcast episode to pull from → falls back to a recent evergreen piece rather than skipping the week, so members always get something (default assumption, confirm with Juliette).
E5. Someone subscribes directly with no prior account → same account-creation flow as every other paid item in the app today.
E6. Someone already owns other one-time collections (Rituals, Distance) and also subscribes → both simply appear in their one library, no conflict.
E7. Someone subscribes who never did the Touch Reset Quiz, so Kit has no Pattern, Pleasure Language or Touch Language on file for them → R1's "here's your stack" has nothing to show. Falls back to offering the quiz itself as their first step inside the membership, rather than a blank or broken screen.
E8. Someone's Kit record has a Pattern but not a Pleasure Language, or the reverse, from an older or partial quiz completion → R1 shows whatever is on file and doesn't block on the missing piece, R5's "start here" recommendation uses whichever layers are actually present.

## Definition of done
D1. A working Stripe subscription checkout for the membership (£77/month) exists and, on successful payment, grants the membership's collections to that member inside the practice app via the normal magic-link sign-in.
D2. A subscribed member with a real quiz result on file sees their actual stack (Pattern, Pleasure Language, Touch Language) reflected back on first entry, pulled from Kit, not re-asked.
D3. A subscribed member can log a Touch State check-in and see at least their two most recent check-ins listed with dates, proving movement over time is genuinely visible, not just captured.
D4. At least one live, working example each of the Touch Menu library, the self-guided Touch Map, and the Yes/No Quiz → Sacred No module is visible inside the practice app for a subscribed member.
D5. The state-ladder diagram and at least one state icon render correctly inside the app, pulled from the book's real asset files.
D6. A subscribed member's progress (completed items, Touch Map result, check-in history) is still visible after signing out and back in.
D7. Cancelling a real test subscription in Stripe results in access continuing for 48 hours, then being removed.
D8. A real test failed renewal payment results in access continuing for 48 hours, then being removed.
D9. The weekly teaching post appears in the membership feed on its own, without Juliette manually writing or triggering it that week.
