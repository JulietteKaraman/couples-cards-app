import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { addContactToKit, KIT_TAGS } from "@/lib/kit/api";

// The Visibility Challenge — free, 21 days, one prompt a day. Passwordless by
// design: email in, no account screen, straight into today's prompt. Returning
// on another day (or another device) just means entering the same email again,
// same pattern as the rest of this app's free flows, no password to remember.
//
// This is the pilot for the passwordless access pattern discussed for Cards'
// paid checkout — same shape (email → instant access, no forced account
// creation), proven here first on a free product before touching a paid one.

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    // Find or create the user by email — no password, ever, for this product.
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    let userId = existingUser?.id;

    if (!userId) {
      const newId = crypto.randomUUID();
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          id: newId,
          email: normalizedEmail,
          name: firstName || null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (createError) {
        console.error("create-visibility-user: failed to create user", createError);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
      }
      userId = newUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Failed to resolve user" }, { status: 500 });
    }

    // Grant access once, on first signup only — purchased_at is Day 1's start
    // timestamp. Re-signing in with the same email must NOT reset it, or a
    // returning person would lose their place in the 21 days.
    const { data: existingGrant } = await supabaseAdmin
      .from("user_decks")
      .select("purchased_at")
      .eq("user_id", userId)
      .eq("deck_type", "visibility-challenge")
      .single();

    let startedAt = existingGrant?.purchased_at;

    if (!startedAt) {
      startedAt = now;
      const { error: grantError } = await supabaseAdmin.from("user_decks").upsert(
        {
          user_id: userId,
          deck_type: "visibility-challenge",
          purchased_at: startedAt,
          stripe_checkout_session_id: "free_visibility_challenge",
        },
        { onConflict: "user_id,deck_type" }
      );
      if (grantError) {
        console.error("create-visibility-user: failed to grant access", grantError);
        return NextResponse.json({ error: "Failed to grant access" }, { status: 500 });
      }
    }

    // Kit sync — real tag exists (23354511), no dedicated nurture sequence yet.
    try {
      await addContactToKit({
        email: normalizedEmail,
        firstName: firstName || undefined,
        tagIds: [KIT_TAGS.visibilityChallenge],
      });
    } catch (kitErr) {
      console.error("create-visibility-user: Kit sync failed", kitErr);
    }

    return NextResponse.json({ success: true, userId, startedAt });
  } catch (error: any) {
    console.error("create-visibility-user: unexpected error", error?.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
