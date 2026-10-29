import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Anonymous counting (28 Oct 2026). Juliette: what people write stays on
// their phone; we only count what they DO. Stores the event, a day number
// and a feeling colour. Never a user id, email, IP address or any text they
// typed. Fire-and-forget: a failure here never affects the page.
const EVENTS = new Set(["taster_open", "taster_done", "taster_feel", "taster_buy_click", "day_done", "day_feel", "htflaw_solo", "htflaw_lab"]);
const FEELS = new Set(["laughed", "close", "awkward", "flat", "little", "bit", "range"]);

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const event = String(b?.e ?? "");
    if (!EVENTS.has(event)) return NextResponse.json({ ok: false }, { status: 400 });
    const day = Number.isInteger(b?.day) && b.day >= 0 && b.day <= 31 ? b.day : null;
    const feel = FEELS.has(b?.feel) ? b.feel : null;
    await supabaseAdmin.from("anon_counts").insert({ event, day, feel });
  } catch {
    // never surface
  }
  return NextResponse.json({ ok: true });
}
