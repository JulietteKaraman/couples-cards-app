import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Course-delivered decks that unlock via a gift code, never a purchase.
// Codes are case-insensitive. Override the default via the
// ONE_TOUCH_UNLOCK_CODE env var in Netlify without a code change.
function codeToDeck(code: string): string | null {
  const oneTouchCode = (process.env.ONE_TOUCH_UNLOCK_CODE || "ONETOUCH").trim().toUpperCase();
  const repairKitCode = (process.env.REPAIR_KIT_UNLOCK_CODE || "REPAIR2026").trim().toUpperCase();
  const map: Record<string, string> = {
    [oneTouchCode]: "one-touch",
    [repairKitCode]: "repair-kit",
  };
  return map[code.trim().toUpperCase()] || null;
}

export async function POST(req: Request) {
  try {
    const { userId, code } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Enter your code." }, { status: 400 });
    }

    const deckType = codeToDeck(code);
    if (!deckType) {
      return NextResponse.json({ error: "That code didn't work." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("user_decks")
      .upsert(
        {
          user_id: userId,
          deck_type: deckType,
          purchased_at: now,
          stripe_checkout_session_id: "one_touch_course",
        },
        { onConflict: "user_id,deck_type" }
      );

    if (error) {
      console.error("redeem-code grant error:", error);
      return NextResponse.json(
        { error: "Could not unlock. Please email support@feelfullyyou.com." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deck: deckType });
  } catch (e: any) {
    console.error("redeem-code error:", e?.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
