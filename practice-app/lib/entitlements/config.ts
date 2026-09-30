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
  price_1U2uFbCCw18geY156WA0jb05: "members-app", // Members App, £77/month recurring — created 10 Aug 2026, spec R10
};

// Deck types that are RECURRING subscriptions rather than one-time
// purchases. resolve-purchase only ever grants these a real expires_at
// (see grantEntitlement) — everything else stays the permanent, one-time
// grant the app has always used. Members App spec R13/E1/E2: on
// cancellation or a failed renewal, access continues for 48 hours past
// the current period end, not indefinitely, which is what a bare
// "purchase found → grant forever" match would otherwise do.
export const SUBSCRIPTION_DECK_TYPES: string[] = ["members-app"];
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
export const FREE_DECK_TYPES: string[] = ["when-she-goes-quiet"];

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
  // This page doesn't exist yet — same as every other product here, the
  // checkout lives on a real marketing sales page, not inside the app.
  // Stripe side (Product prod_V30FzZV1Wv39XG, Price price_1U2uFbCCw18geY156WA0jb05,
  // £77/month, live) is ready; this URL needs the actual page built and a
  // checkout button wired to that price before it's real.
  "members-app": "https://feelfullyyou.com/members-app",
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
