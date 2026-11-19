// Maps each collection this app can show to the user_decks.deck_type value
// that grants it. Adding a new product later means adding one line here,
// not new sign-in/session code.
export const COLLECTION_DECK_TYPES: Record<string, string> = {
  "31-touch-points": "31-touch-points",
  "ten-touch-rituals": "ten-touch-rituals",
  "the-unspoken-distance": "unspoken-distance",
  "when-she-goes-quiet": "when-she-goes-quiet",
  "between-touches": "between-touches",
  "communication-reboot-kit": "communication-reboot-kit",
  "members-app": "members-app",
  // The Sacred No, £17, moved into the app 17 Oct 2026 (specs/sacred-no-in-app.md R6).
  "the-sacred-no": "sacred-no",
  // One Touch, £97, moved into the app 27 Oct 2026.
  "one-touch": "one-touch",
  // How to Feel Like a Woman, the course women, 29 Oct 2026. Granted by hand
  // from /admin for now (specs/how-to-feel-like-a-woman-app.md R1).
  "how-to-feel-like-a-woman": "how-to-feel-like-a-woman",
  // Scrumptious Confessions membership, £97 a month, women and men (11 Nov 2026,
  // specs/scrumptious-confessions-membership.md). Price mapped below.
  "scrumptious-confessions": "scrumptious-confessions",
  // The Touch Map, £197, version 1 (29 Oct 2026, specs/touch-map.md in APP
  // builds). Add its live Stripe price id to PRICE_ID_TO_DECK_TYPE once the
  // payment link exists.
  "touch-map": "touch-map",
  // The couples touch dates come with the same £197 Touch Map (Juliette, 8-9 Nov 2026).
  "couples-touch-map": "touch-map",
};

// Maps a real Stripe price ID to the deck_type it grants, so resolve-purchase
// and the Stripe webhook can both match against real purchases across every
// product this app sells, not just one hardcoded price (the-unspoken-distance
// spec R4/R5). Add one line here per new product's live price ID.
export const PRICE_ID_TO_DECK_TYPE: Record<string, string> = {
  // 31 Touch Points. The Stripe prices already existed from the old 41-page
  // PDF product, "31 Daily Touch Points", and all three are mapped in the
  // site webhook (tag 20794225, sequence 2817543). All three grant the app,
  // because anyone who ever bought that product bought this month, and
  // Juliette's instruction was to give existing buyers access rather than
  // make them pay twice. Price IDs copied from
  // 01 Site & Dev/feelfullyyou-site/netlify/functions/stripe-webhook.js.
  price_1TqqjCCCw18geY15dCXrlEjD: "31-touch-points", // £31 full price, "a pound a day". Payment link https://buy.stripe.com/00waEW0XFfpu85LfPn0co1w
  price_1TiBhLCCw18geY15dLECqNFr: "31-touch-points", // £27 standalone, earlier price
  price_1TlpvDCCw18geY15wlpzVg4f: "31-touch-points", // £19, Between Touches upsell only
  // 31 Day Connection Kit, £35, 30 Sep 2026. Both 31s together: the 31 Days
  // Closer cards AND 31 Touch Points. The cards half is granted by the cards
  // app; this line is the app half. Payment link
  // https://buy.stripe.com/fZu5kC0XFfpuadT32B0co2p, plink_1ULQHUCCw18geY15FZP1jMYR.
  // Matched by payment link in the site webhook, since the bundle price id
  // is not known here., never standalone
  price_1Tlpu0CCw18geY15b8J3jlBW: "ten-touch-rituals", // 10 Touch Rituals, £7
  price_1TzO4DCCw18geY15u7X9j7iw: "unspoken-distance", // The Unspoken Distance, £77 (old price, real buyers 31 Jul-1 Aug 2026)
  price_1TnxAqCCw18geY153w22a2Ye: "unspoken-distance", // The Unspoken Distance, £97 (current, back from £77 1 Aug 2026 — now includes free Couples Cards)
  price_1TnwwmCCw18geY15egD5h7Fr: "communication-reboot-kit", // Communication Reboot Kit, £37 (live Payment Link, communication-reboot-kit.html)
  price_1TqqcmCCw18geY15FjLGqM2q: "communication-reboot-kit", // Communication Reboot Kit, £17 (When She Goes Quiet offer). Was missing until 29 Oct 2026, so £17 buyers could not get in.
  price_1U2uFbCCw18geY156WA0jb05: "members-app", // Members App, £77/month recurring — created 10 Aug 2026, spec R10
  // The Sacred No, £17 (sacred-no-in-app spec R13). Same line as
  // PRACTICE_APP_DECK_TYPES in the site webhook. The live payment link,
  // plink_1UD0gtCCw18geY15E6gj9XGx, is matched by payment link there.
  price_1UD0f6CCw18geY15BCSTDIlW: "sacred-no",
  // One Touch (27 Oct 2026). Both prices grant it, so every past buyer gets in.
  price_1Tpr13CCw18geY15W6ooICYF: "one-touch", // £97
  price_1TzdQNCCw18geY15eh9S2uOe: "one-touch", // £197 (1 Aug 2026)
  // Scrumptious Confessions, £97 a month recurring (12 Nov 2026). Payment link
  // https://buy.stripe.com/6oU4gydKrgtybhXcDb0co2y, plink_1UavMcCCw18geY15Ook0CqRG,
  // product prod_Vbm7ukx8Blxpy2. Each paid invoice extends access (SUBSCRIPTION_DECK_TYPES).
  price_1UaYZICCw18geY15j9xNbIhd: "scrumptious-confessions",
};

// Deck types that are RECURRING subscriptions rather than one-time
// purchases. resolve-purchase only ever grants these a real expires_at
// (see grantEntitlement) — everything else stays the permanent, one-time
// grant the app has always used. Members App spec R13/E1/E2: on
// cancellation or a failed renewal, access continues for 48 hours past
// the current period end, not indefinitely, which is what a bare
// "purchase found → grant forever" match would otherwise do.
export const SUBSCRIPTION_DECK_TYPES: string[] = ["members-app", "scrumptious-confessions"];
export const SUBSCRIPTION_GRACE_PERIOD_HOURS = 48;

// Free collections: granted automatically the moment someone logs into the
// app, no Stripe purchase, no price ever shown (Juliette, 1 Aug 2026 — a
// price only makes an edit necessary later if it changes; these guides
// don't have a price to begin with). See app/api/ensure-free-access and
// AuthProvider, which call it right after establishing a session.
//
// ten-touch-rituals REMOVED 27 Aug 2026 (Juliette, direct: "I do NOT want
// to give the touch rituals away for free anymore"). It was free for one
// afternoon, 24-27 Aug 2026, then reverted. It is a real £7 purchase again,
// gated normally through PRICE_ID_TO_DECK_TYPE below. Do not re-add it here
// without her saying so explicitly, this has now flipped both ways once.
//
// between-touches REMOVED 28 Aug 2026. Pulled from the website's free-
// resources listing on 27 Aug ("giving away too much for free"), but left
// free in the app that day since she'd only said "off the website" for
// this one. She caught it live the next day, surprised it was still free
// in the app ("between touches is still on the app! I thought you took it
// off"), confirming she meant the app too, not just the site. Do not
// re-add without her explicit say, same as ten-touch-rituals above.
// between-touches BACK ON 27 Oct 2026, Juliette's explicit yes, cut down to
// a 5-page free guide ("Yes, publish Between Touches (switch it back on)").
export const FREE_DECK_TYPES: string[] = ["when-she-goes-quiet", "between-touches"];

// Where the "Get access" CTA on a locked (not-yet-owned) library tile sends
// someone — the collection's real marketing sales page, never an in-app
// checkout. Only paid collections need an entry here; free collections are
// always unlocked (see FREE_DECK_TYPES) so they never render a locked tile.
export const PURCHASE_URLS: Record<string, string> = {
  // The page FILE exists (feelfullyyou-site/31-daily-touch-points.html, £31,
  // correct Stripe link) but _redirects lines 38-39 currently 301 both
  // /31-daily-touch-points and the .html variant to /10-touch-rituals, so the
  // live URL serves the £7 page. Remove those two lines and rewrite the page
  // for the app version, then this URL is real.
  "31-touch-points": "https://feelfullyyou.com/31-daily-touch-points",
  "ten-touch-rituals": "https://feelfullyyou.com/10-touch-rituals",
  "the-unspoken-distance": "https://feelfullyyou.com/the-unspoken-distance",
  "communication-reboot-kit": "https://feelfullyyou.com/communication-reboot-kit",
  "one-touch": "https://feelfullyyou.com/one-touch",
  "touch-map": "/taste/touch-map",
  // This page doesn't exist yet — same as every other product here, the
  // checkout lives on a real marketing sales page, not inside the app.
  // Stripe side (Product prod_V30FzZV1Wv39XG, Price price_1U2uFbCCw18geY156WA0jb05,
  // £77/month, live) is ready; this URL needs the actual page built and a
  // checkout button wired to that price before it's real.
  "members-app": "https://feelfullyyou.com/members-app",
  "the-sacred-no": "https://feelfullyyou.com/sacred-no",
  "how-to-feel-like-a-woman": "https://feelfullyyou.com/how-to-feel-like-a-woman",
};

export function deckTypesForApp(): string[] {
  return Object.values(COLLECTION_DECK_TYPES);
}

export function collectionSlugForDeckType(deckType: string): string | null {
  const entry = Object.entries(COLLECTION_DECK_TYPES).find(
    ([, dt]) => dt === deckType
  );
  return entry ? entry[0] : null;
}

// Free fortnight for the How to Feel Like a Woman women (Juliette 16 Nov 2026: "add that it is free
// the first 2 weeks- and then paying starts"). Anyone who owns that course also sees Scrumptious
// Confessions from Friday 20 Nov (the finale) to the end of Monday 7 Dec, no card. Paying starts
// Mon 7 Dec, when the "stay in" button appears under the finale. Checked in AuthProvider and canSee.
export const HTFLAW_FREE_CONFESSIONS = {
  ownerDeck: "how-to-feel-like-a-woman",
  grantsDeck: "scrumptious-confessions",
  from: "2026-11-20T00:00:00Z",
  until: "2026-12-08T00:00:00Z",
  payFrom: "2026-12-07",
};
export function freeConfessionsActive(now: Date = new Date()) {
  return now >= new Date(HTFLAW_FREE_CONFESSIONS.from) && now < new Date(HTFLAW_FREE_CONFESSIONS.until);
}

// Scrumptious Confessions membership: what opens the longer someone stays
// (Juliette 16 Nov 2026: "they get access to most of my things, but open after
// ... months"; order hers, same day). Month 1 = from the first day. Counted from
// the membership's first payment (user_decks.purchased_at, kept across renewals
// in grant.ts). Product list from CANON only: never 10 Touch Rituals (retired).
// When She Goes Quiet lives on as Quiet Isn't Yes. The Touch Map stays its own £197 product.
export type MembershipUnlock = { month: number; title: string; line: string; deck?: string; href: string };
export const MEMBERSHIP_UNLOCKS: MembershipUnlock[] = [
  // Order re-set by Juliette 19 Nov 2026: the small, quick pieces first, the bigger programmes later
  // ("those are actually things that should go in the first few months... much more than the higher-price things").
  // The bites open from a plain link in the app, so the link only appearing in its month is the unlock.
  { month: 1, title: "Holiday Survival Kit", line: "Cards for the season: the drive there, the table, who isn't here.", href: "https://feelfullyyou.com/my-cards/?unlock=holiday" },
  // Juliette 16 Nov: "I reinstated when she goes quiet but it is called something else now- and they should get access to that immediately". Free guide for men.
  { month: 1, title: "Quiet Isn't Yes", line: "For men: when she goes quiet, and what it really means.", href: "/practice/quiet-isnt-yes" },
  { month: 1, title: "The Trace", line: "Fully clothed. Non-sexual. Touch that isn't going to lead anywhere.", href: "/practice/the-trace" },
  { month: 2, title: "When She Stops Reaching", line: "For men: Touch Base, the Approach Ritual, the Full Stop.", href: "/practice/when-she-stops-reaching" },
  { month: 2, title: "The Fifteen Minutes After", line: "One communication. Thank you. Swap.", href: "/practice/the-fifteen-minutes-after" },
  { month: 2, title: "Between Touches", line: "What happens in the moments between.", deck: "between-touches", href: "/practice/between-touches" },
  { month: 3, title: "31 Touch Points", line: "A touch a day for a month.", deck: "31-touch-points", href: "/practice/31-touch-points" },
  { month: 3, title: "The Full Stop", line: "One true thing. No question on the end.", href: "/practice/the-full-stop" },
  { month: 4, title: "The Three Answers", line: "One prompt. Fifteen minutes. Seven sittings.", href: "/practice/the-three-answers" },
  // 31 Days Closer lives in the cards app (my-cards), which opens a set from ?unlock=<set> in that browser.
  { month: 4, title: "31 Days Closer", line: "31 cards, one a day, to bring you closer.", href: "https://feelfullyyou.com/my-cards/?unlock=31-days-closer" },
  { month: 5, title: "The 45-Minute Connection Ritual", line: "From co-existing to connecting, in 45 minutes.", href: "/practice/the-45-minute-ritual" },
  { month: 5, title: "Trust & Repair", line: "Fifty prompts for when something happened between you.", href: "/practice/the-trust-and-repair" },
  { month: 6, title: "The Sacred No", line: "The no that lets your yes mean something.", deck: "sacred-no", href: "/practice/the-sacred-no" },
  { month: 7, title: "One Touch", line: "One touch, learned properly.", deck: "one-touch", href: "/practice/one-touch" },
  { month: 8, title: "The Unspoken Distance", line: "Written for men, worth reading for women.", deck: "unspoken-distance", href: "/practice/the-unspoken-distance" },
  { month: 9, title: "Communication Reboot Kit", line: "The talking side of being close.", deck: "communication-reboot-kit", href: "/practice/communication-reboot-kit" },
];
/** Which month of membership someone is in: 1 from the first day. */
export function membershipMonth(since: string | Date, now: Date = new Date()): number {
  const s = new Date(since);
  let m = (now.getUTCFullYear() - s.getUTCFullYear()) * 12 + (now.getUTCMonth() - s.getUTCMonth());
  if (now.getUTCDate() < s.getUTCDate()) m -= 1;
  return Math.max(1, m + 1);
}
/** The date a given month opens for someone who joined on `since`. */
export function monthOpensOn(since: string | Date, month: number): Date {
  const s = new Date(since);
  return new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() + month - 1, s.getUTCDate()));
}

// Product -> deck_type, for subscriptions whose newer prices aren't listed above.
// Scrumptious Confessions product (both the £97 and the £111 prices live on it).
export const PRODUCT_ID_TO_DECK_TYPE: Record<string, string> = {
  prod_Vbm7ukx8Blxpy2: "scrumptious-confessions",
};

// The public free fortnight (Juliette 16 Nov 2026: free Mon 23 Nov to Sun 6 Dec,
// email only, no card; free places close Sun 29 Nov). Claimed by signing in at
// /practice/scrumptious-confessions/free. Access runs to the end of Mon 7 Dec,
// the day paying starts, so nobody is cut off before they can press "stay".
export const FREE_FORTNIGHT = {
  opens: "2026-11-23T00:00:00Z",
  closes: "2026-11-30T00:00:00Z",
  until: "2026-12-08T00:00:00Z",
  marker: "free-fortnight",
  kitTag: 25487963, // "Scrumptious Confessions: Waitlist", the list the closing emails go to
  // Testers who may claim before 23 Nov, to try the way in and the Telegram group early.
  earlyTesters: ["charleneappleid1@gmail.com", "kiera@feelfullyyou.com"] as string[], // Charlene (16 Nov), Kiera (17 Nov), Juliette
};
