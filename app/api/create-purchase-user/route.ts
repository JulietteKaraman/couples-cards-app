import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { addContactToIvorey } from "@/lib/ivorey/api";

export async function POST(req: Request) {
  console.log("========== CREATE PURCHASE USER START ==========");
  
  try {
    const { email, firstName, product } = await req.json();

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

    // Add to Ivorey email list
    try {
      await addContactToIvorey({
        email: email.toLowerCase(),
        firstName: firstName || undefined,
        tags: [`purchase-intent-${product || "unknown"}`],
      });
    } catch (ivoreyErr) {
      console.error("Failed to add to Ivorey:", ivoreyErr);
    }

    // Pre-grant access to the deck they want to buy
    if (finalUserId) {
      if (product === "all-three") {
        const decksToGrant = ["couples", "friends", "touch-languages"];
        for (const deckType of decksToGrant) {
          await supabaseAdmin
            .from("user_decks")
            .upsert({
              user_id: finalUserId,
              deck_type: deckType,
              purchased_at: now,
              stripe_checkout_session_id: "pending_purchase",
            }, { onConflict: "user_id,deck_type" });
        }
      } else if (product) {
        await supabaseAdmin
          .from("user_decks")
          .upsert({
            user_id: finalUserId,
            deck_type: product,
            purchased_at: now,
            stripe_checkout_session_id: "pending_purchase",
          }, { onConflict: "user_id,deck_type" });
      }

      // Log to ivorey_submissions table
      await supabaseAdmin
        .from("ivorey_submissions")
        .insert({
          user_id: finalUserId,
          email: email.toLowerCase(),
          name: firstName || null,
          form_id: "purchase_email_capture",
          product_intent: product,
          source: "purchase_intent",
          submitted_at: now,
        });
    }

    console.log("========== CREATE PURCHASE USER END ==========");
    
    return NextResponse.json({ 
      success: true, 
      user_id: finalUserId 
    });

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}