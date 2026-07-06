import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { addContactToKit, KIT_TAGS, KIT_SEQUENCES } from "@/lib/kit/api";

export async function POST(req: Request) {
  console.log("========== CREATE FREE USER START ==========");
  
  try {
    const { email, firstName, deck } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userId = crypto.randomUUID();

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    let finalUserId = existingUser?.id;

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          id: userId,
          email: email.toLowerCase(),
          name: firstName || null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
      }

      finalUserId = newUser?.id;
    }

    // Add to Kit email list — same tag + delivery sequence as the website taster opt-in
    try {
      await addContactToKit({
        email: email.toLowerCase(),
        firstName: firstName || undefined,
        tagIds: [KIT_TAGS.cardsFreeTaster],
        sequenceId: KIT_SEQUENCES.leadMagnetDelivery,
      });
    } catch (kitErr) {
      console.error("Failed to add to Kit:", kitErr);
    }

    // Grant free access to the deck (or both decks for free taster)
    const decksToGrant = deck === "friends" ? ["friends"] : ["couples"];
    
    if (finalUserId) {
      for (const deckType of decksToGrant) {
        await supabaseAdmin
          .from("user_decks")
          .upsert({
            user_id: finalUserId,
            deck_type: deckType,
            purchased_at: now,
            stripe_checkout_session_id: "free_taster",
          }, { onConflict: "user_id,deck_type" });
      }
    }

    // Log to ivorey_submissions table
    if (finalUserId) {
      await supabaseAdmin
        .from("ivorey_submissions")
        .insert({
          user_id: finalUserId,
          email: email.toLowerCase(),
          name: firstName || null,
          form_id: "free_email_capture",
          product_intent: deck || "couples",
          source: "free_taster",
          submitted_at: now,
        });
    }

    console.log("========== CREATE FREE USER END ==========");
    
    return NextResponse.json({ 
      success: true, 
      user_id: finalUserId 
    });

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}