import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  console.log("========== IVOREY WEBHOOK START ==========");
  console.log("Timestamp:", new Date().toISOString());

  try {
    const body = await req.json();
    
    console.log("Webhook payload received:", JSON.stringify(body, null, 2));

    const { 
      email, 
      name, 
      product, 
      source,
      form_id,
      submitted_at 
    } = body;

    if (!email) {
      console.error("ERROR: No email in webhook payload");
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("Processing email:", email);
    console.log("Product/Intent:", product || "free_taster");
    console.log("Source:", source || "ivorey_form");

    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Try to find existing user by email
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .single();

    let finalUserId = existingUser?.id;

    if (!existingUser) {
      console.log("Creating new user in Supabase...");
      
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          id: userId,
          email: email.toLowerCase(),
          name: name || null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (createError) {
        console.error("ERROR creating user:", createError);
      } else {
        console.log("New user created:", newUser);
        finalUserId = newUser?.id;
      }
    } else {
      console.log("Existing user found:", existingUser.id);
    }

    // Handle based on product type
    if (product === "all-three" && finalUserId) {
      console.log("Granting access to all three decks...");
      
      const decksToGrant = ["couples", "friends", "touch-languages"];
      
      for (const deckType of decksToGrant) {
        await supabaseAdmin
          .from("user_decks")
          .upsert({
            user_id: finalUserId,
            deck_type: deckType,
            purchased_at: now,
            stripe_checkout_session_id: "ivorey_promoted",
          }, { onConflict: "user_id,deck_type" });
      }
    } else if (product && product !== "free_taster" && finalUserId) {
      console.log("Granting access to deck:", product);
      
      await supabaseAdmin
        .from("user_decks")
        .upsert({
          user_id: finalUserId,
          deck_type: product,
          purchased_at: now,
          stripe_checkout_session_id: "ivorey_promoted",
        }, { onConflict: "user_id,deck_type" });
    }

    // Log the Ivorey interaction
    if (finalUserId) {
      await supabaseAdmin
        .from("ivorey_submissions")
        .insert({
          user_id: finalUserId,
          email: email.toLowerCase(),
          name: name || null,
          form_id: form_id || "TLzYfnzCX3pUjQd9FAK1",
          product_intent: product || null,
          source: source || "free_taster",
          submitted_at: submitted_at || now,
        });
    }

    console.log("Ivorey submission logged");

    console.log("========== IVOREY WEBHOOK END (SUCCESS) ==========");
    
    return NextResponse.json({ 
      success: true, 
      user_id: finalUserId,
      message: "User processed successfully"
    });

  } catch (error: any) {
    console.error("========== IVOREY WEBHOOK ERROR ==========");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.log("========== WEBHOOK END (ERROR) ==========");
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}