import { NextResponse } from "next/server";
import { userFromRequest } from "@/lib/drops-server";
import { syncFromStripe } from "@/lib/confessions-access";

// "Can't get in?" (Juliette 20 Nov 2026): checks Stripe right now for the signed-in email and lets a paying
// member straight back in, before anyone has to email support.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const results = await syncFromStripe(user.email);
    const live = results.some((r) => ["active", "trialing", "past_due"].includes(r.status));
    return NextResponse.json({ ok: true, member: live, fixed: results.some((r) => r.fixed) });
  } catch (e) {
    console.error("confessions restore:", (e as Error).message);
    return NextResponse.json({ error: "Could not check right now" }, { status: 500 });
  }
}
