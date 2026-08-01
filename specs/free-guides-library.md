# Free guides + locked/unlocked library — Spec

## Objective
The practice-app's library page only ever showed what an account already owned — no hint that anything else existed. Juliette wants the app to be the funnel itself: everyone who has an account sees every guide, the free ones open immediately, the paid ones show locked with a real path to buy. Two existing marketing-site lead magnets ("When She Goes Quiet", "Between Touches"), currently delivered as static Google Drive PDFs outside the app entirely, become the free entry point into that library.

## Requirements
R1. Every collection in `ALL_COLLECTIONS` (`app/page.tsx`) renders as a tile on the library page, always — never filtered down to only what's owned.
R2. A tile for a collection the account is entitled to opens the guide as normal (unchanged behaviour).
R3. A tile for a collection the account is NOT entitled to renders locked (dimmed photo, lock icon, "Not yet on your account · Get access") and links out to that collection's real marketing sales page (`PURCHASE_URLS` in `lib/entitlements/config.ts`), never into the app's own content.
R4. Two new free collections are added, ported in full Gamma-import-playbook depth (see `practice-app/CLAUDE.md`) from their source PDFs: "When She Goes Quiet" (slug `when-she-goes-quiet`, dark theme) and "Between Touches" (slug `between-touches`, light theme).
R5. Free collections (`FREE_DECK_TYPES` in config.ts) are granted automatically to every signed-in account, no Stripe purchase, no price ever shown anywhere in their content or on their tile — a new route (`app/api/ensure-free-access`) grants any missing free deck_type the moment a session is established, called from `AuthProvider` before entitlements load.
R6. No £ price appears anywhere in either new guide's content, matching the app's existing rule for all guide content (prices change; content shouldn't need an edit when they do).
R7. Both guides' real, live marketing-site thank-you pages (verified against the actual post-opt-in redirect target, not assumed from a filename) route into the paid ladder with no price text: "Explore The Unspoken Distance" and "Take the free Touch Reset Quiz", both feeding into One Touch from there.
R8. A new shared `table` ContentBlock kind renders Juliette's recurring "What She Says / What She Really Means" translation-table pattern as stacked labelled cards (phone-first, not an HTML table) — added to `lib/content/blocks.ts` / `components/Blocks.tsx` since it recurs across both new guides and has no existing primitive.

## Out of scope
- The Communication Reboot Kit (currently a Google Drive PDF tripwire off the When She Goes Quiet funnel) stays exactly as-is — existing buyers already have it delivered that way. Porting it into the app is a later, separate piece of work, not this one.
- The other free-resources page items (Touch Reset Quiz, Touch Base Anchor, Pick a Card taster, Body Confidence, Grief Duality Process) are not guide-shaped content and are not part of this build.
- Cleaning up the two orphaned Between Touches thank-you-page variants found during this work (`thankyou-between-touches.html`, `success-between-touches.html`, neither actually linked to) — flagged for later, not blocking.
- Per-section interior photography for the two new guides — only their cover image was available; entries render text/diagram/table/step content only, same honest-missing-image convention already used elsewhere in the app.

## Constraints
- Follow the existing per-collection route pattern exactly (`app/practice/<slug>/page.tsx` + `app/practice/<slug>/[slug]/page.tsx`, copied from `the-unspoken-distance`'s single-column editorial template) — no generic dynamic-collection route introduced.
- Entitlement/session model unchanged: `user_decks` table, `deck_type` → collection slug via `COLLECTION_DECK_TYPES`, no new auth mechanism.
- Never hardcode an offer price inside guide content, CTA button text, or a locked-tile description — link + destination only.
- Marketing-site edits must target the page actually reached by the live redirect, verified from the opt-in form's own JS, not from `page-index.html` (found stale/wrong during this build) or filename assumption.

## Edge cases
E1. An account with zero purchases and zero prior sessions: on first login, `ensure-free-access` grants both free deck_types, library shows both free guides unlocked and both paid collections locked with purchase links.
E2. `ensure-free-access` request fails (network/route issue): sign-in still succeeds, entitlements still load from whatever's already in `user_decks`; the free grant is retried on the next session refresh, not blocking.
E3. A locked tile's collection has no entry in `PURCHASE_URLS` (shouldn't happen for a paid collection, but if it does): the "Get access" link should not silently 404 — every paid collection added to `ALL_COLLECTIONS` must have a matching `PURCHASE_URLS` entry, checked at build time by the entry existing in this spec's D-list.
E4. Someone already entitled to a collection via a real purchase, and that collection is later also free: existing `user_decks` row wins, no duplicate grant (upsert on `user_id,deck_type` already handles this).

## Definition of done
D1. Visiting `/` as a signed-in account with no purchases shows 4 tiles: When She Goes Quiet (unlocked), Between Touches (unlocked), 10 Touch Rituals (locked, links to `/10-touch-rituals`), The Unspoken Distance (locked, links to `/the-unspoken-distance`).
D2. Opening either free guide's tile loads its full content, no gate, no price shown anywhere on the page.
D3. `npx tsc --noEmit` passes clean from `practice-app/`.
D4. Both new content files pass the same structural checks used for the earlier two guides: `order` sequential with no gaps/dupes, no duplicate slugs within the collection.
D5. `thankyou-when-she-goes-quiet.html` and `thankyou-between-touches-only.html` (the real, verified-live pages) each show a next-step block with no price text, linking to `/the-unspoken-distance` and `/touch-reset-quiz`.
D6. No £ symbol or number appears anywhere in `when-she-goes-quiet.ts` or `between-touches.ts`.
D7. The `between-touches.ts` closing entry contains no reference to "Daily Touch Points" or a £97/month "Touchpoint" membership (both retired 1 Aug 2026) in any form.
