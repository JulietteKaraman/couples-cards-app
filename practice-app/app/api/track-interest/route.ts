import { NextResponse } from "next/server";

// Fires when a signed-in user clicks a locked, not-yet-owned offer tile in
// the library (One Touch, the Repair Kit) — a real signal of warmth that,
// before 9 Aug 2026, went nowhere: someone could browse every paid offer
// in the app and Kit would never know. Juliette, 9 Aug 2026: "they look at
// other things and are like, oh I might want to purchase that... I do
// want somehow for them to then go into a sequence."
//
// This route only ever ADDS a Kit tag. It never creates/updates the
// subscriber's core record, never touches Lead Stage (that's handled by
// the marketing site's own opt-in flow, see netlify/functions/subscribe.js
// in the feelfullyyou-site repo), and a failure here must NEVER block the
// actual navigation to the sales page — this is a fire-and-forget signal,
// not a gate. Called client-side from LockedOfferTile's onClick, not
// awaited before the link navigates.

const KIT_BASE = "https://api.kit.com/v4";

// Kit tag IDs, created 9 Aug 2026 specifically for this. If a new locked
// offer is ever added to EXTERNAL_OFFERS in app/page.tsx, add its slug +
// a matching tag here (create the tag in Kit first, it's idempotent to
// create a tag with a name that already exists).
const INTEREST_TAGS: Record<string, number> = {
  "one-touch": 22350001, // "interested - one touch (app browse)"
  "repair-kit": 22350002, // "interested - repair kit (app browse)"
};

export async function POST(req: Request) {
  try {
    const { email, offerSlug } = await req.json();
    if (!email || !offerSlug) {
      return NextResponse.json({ error: "email and offerSlug are required" }, { status: 400 });
    }

    const tagId = INTEREST_TAGS[offerSlug];
    if (!tagId) {
      // Not an error — just an offer we haven't wired a tag for yet.
      // Don't fail the request over it, this must never block navigation.
      return NextResponse.json({ ok: true, tagged: false, reason: "no tag mapped for this offer" });
    }

    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
      // Deliberately not a 500 — see note above, this must stay silent to
      // the caller so it never blocks the click-through. Logged so it's
      // diagnosable, not silently invisible.
      console.error("track-interest: KIT_API_KEY not configured on this Netlify site");
      return NextResponse.json({ ok: true, tagged: false, reason: "not configured" });
    }

    const tagRes = await fetch(`${KIT_BASE}/tags/${tagId}/subscribers`, {
      method: "POST",
      headers: {
        "X-Kit-Api-Key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email_address: email.toLowerCase().trim() }),
    });

    if (!tagRes.ok) {
      console.error("track-interest: Kit tag apply failed", offerSlug, email, tagRes.status);
      return NextResponse.json({ ok: true, tagged: false, reason: "kit error" });
    }

    return NextResponse.json({ ok: true, tagged: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("track-interest error:", message);
    // Still 200 — a tracking hiccup is never worth surfacing to the user.
    return NextResponse.json({ ok: true, tagged: false, reason: "server error" });
  }
}
