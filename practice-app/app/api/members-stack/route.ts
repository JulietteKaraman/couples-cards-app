import { NextResponse } from "next/server";
import { getMemberStack } from "@/lib/kit/stack";

// Members App spec R1: reads the member's real Touch Reset Quiz result
// from Kit server-side (KIT_API_SECRET never reaches the browser). Same
// trust model as this app's other {email}-in-body routes (ensure-free-
// access, resolve-purchase) — the caller already has an authenticated
// session before this ever gets called from the membership page.
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }
    const stack = await getMemberStack(email);
    return NextResponse.json({ stack });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("members-stack error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
