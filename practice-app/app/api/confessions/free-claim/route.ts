import { NextResponse } from "next/server";
import { canSee, userFromRequest } from "@/lib/drops-server";
import { grantEntitlement } from "@/lib/entitlements/grant";
import { FREE_FORTNIGHT } from "@/lib/entitlements/config";

// The way in for the free fortnight (Juliette 16 Nov 2026: "Way in, 23 Nov").
// A signed-in person claims two free weeks of Scrumptious Confessions with
// just their email. Never shortens anyone's paid access.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (await canSee(user.id, user.email, "scrumptious-confessions")) {
    return NextResponse.json({ ok: true, already: true });
  }
  const now = new Date();
  const tester = FREE_FORTNIGHT.earlyTesters.includes(user.email.toLowerCase());
  if (now < new Date(FREE_FORTNIGHT.opens) && !tester) return NextResponse.json({ state: "not-yet" }, { status: 409 });
  if (now >= new Date(FREE_FORTNIGHT.closes) && !tester) return NextResponse.json({ state: "closed" }, { status: 409 });

  await grantEntitlement(user.email, "scrumptious-confessions", FREE_FORTNIGHT.marker, user.id, FREE_FORTNIGHT.until);

  // Tag them in Kit for the closing emails. Never blocks the way in.
  const apiKey = process.env.KIT_API_KEY;
  if (apiKey) {
    const headers = { "X-Kit-Api-Key": apiKey, "Content-Type": "application/json", Accept: "application/json" };
    try {
      await fetch("https://api.kit.com/v4/subscribers", { method: "POST", headers, body: JSON.stringify({ email_address: user.email }) });
      await fetch(`https://api.kit.com/v4/tags/${FREE_FORTNIGHT.kitTag}/subscribers`, { method: "POST", headers, body: JSON.stringify({ email_address: user.email }) });
    } catch (e) {
      console.error("free-claim: kit tag failed", e instanceof Error ? e.message : e);
    }
  }
  return NextResponse.json({ ok: true });
}
