import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { grantEntitlement } from "@/lib/entitlements/grant";
import { FREE_DECK_TYPES } from "@/lib/entitlements/config";

// Free collections (the-app's free guides — see FREE_DECK_TYPES) never go
// through Stripe: anyone with an account gets them, automatically, the
// moment they're signed in. This route grants whichever free deck_types a
// given account doesn't already have, using the same get-or-create-user +
// upsert mechanism as a real purchase (grantEntitlement), just with a
// synthetic "free-guide-auto-grant" marker instead of a real Stripe
// checkout session id.
//
// Called from AuthProvider right after a session is established, before
// entitlements are loaded, so a first-time visitor's free guides are
// already unlocked by the time the library page renders. Same trust model
// as resolve-purchase: takes {userId, email} from the client, no separate
// session verification, since the only thing this can ever do is grant a
// FREE deck_type — nothing paid, nothing another account doesn't already
// have available to it for free anyway.
export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();
    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: existingDecks, error: readError } = await supabaseAdmin
      .from("user_decks")
      .select("deck_type")
      .eq("user_id", userId)
      .in("deck_type", FREE_DECK_TYPES);

    if (readError) {
      console.error("ensure-free-access read error:", readError.message);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const alreadyGranted = new Set((existingDecks ?? []).map((d) => d.deck_type));
    const missing = FREE_DECK_TYPES.filter((dt) => !alreadyGranted.has(dt));

    for (const deckType of missing) {
      // Pass the real, already-authenticated userId straight through —
      // this route always has one, so there's no reason to make
      // grantEntitlement re-derive it via an email lookup (see grant.ts
      // for why that lookup alone was silently failing for real accounts).
      await grantEntitlement(normalizedEmail, deckType, "free-guide-auto-grant", userId);
    }

    return NextResponse.json({ granted: missing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("ensure-free-access error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
