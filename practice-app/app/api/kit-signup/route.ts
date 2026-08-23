import { NextResponse } from "next/server";

// Puts every app signup into Kit.
//
// Until 23 Aug 2026 this app could only READ from Kit (lib/kit/stack.ts) and
// apply interest tags to people who were already subscribers
// (app/api/track-interest). It never CREATED anyone. That meant someone could
// sign into the app with a magic link, unlock every free guide, read the lot,
// and never appear on Juliette's list at all — no tag, no sequence, no
// follow-up, nothing. The app was a delivery box that leaked.
//
// This route closes that. It runs on every established session (see
// AuthProvider), creates-or-finds the Kit subscriber by email, and applies the
// "app signup" tag so the app becomes a real front door: one email in, every
// free guide unlocked, and the person actually on the list.
//
// Design rules, all deliberate:
//  - IDEMPOTENT. Kit returns the existing subscriber rather than duplicating,
//    and re-applying a tag they already carry is a no-op. Safe to call on
//    every single session establish, which is exactly what it does.
//  - NEVER BLOCKS SIGN-IN. Every failure path returns 200. A Kit outage, a
//    missing key, a network blip: none of them are worth stopping someone
//    reaching the guide they just asked for. Failures are logged, never thrown.
//  - SERVER-SIDE KEY ONLY. KIT_API_KEY never reaches the browser.
const KIT_BASE = "https://api.kit.com/v4";

// "app signup" — created 23 Aug 2026 for exactly this. Everyone who has ever
// signed into the Practice App carries it, which makes "people who have the
// app but have bought nothing" a segment Juliette can actually mail.
const APP_SIGNUP_TAG_ID = 22701818;

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: true, synced: false, reason: "no email" });
    }

    const emailAddress = email.toLowerCase().trim();

    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
      // Same reasoning as track-interest: loud in the logs, silent to the
      // user. A missing env var must never surface as a broken sign-in.
      console.error("kit-signup: KIT_API_KEY not configured on this Netlify site");
      return NextResponse.json({ ok: true, synced: false, reason: "not configured" });
    }

    const headers = {
      "X-Kit-Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Create-or-find. Kit treats an existing email as a match rather than a
    // duplicate, so a returning visitor signing in for the hundredth time
    // costs one no-op call and changes nothing about their record.
    const createRes = await fetch(`${KIT_BASE}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify(
        firstName
          ? { email_address: emailAddress, first_name: firstName }
          : { email_address: emailAddress }
      ),
    });

    // 422 is the "already exists" shape and is a success for our purposes —
    // we want them tagged either way, so only a genuine transport/auth
    // failure should stop us short of the tag call below.
    if (!createRes.ok && createRes.status !== 422) {
      console.error("kit-signup: subscriber create failed", emailAddress, createRes.status);
    }

    const tagRes = await fetch(`${KIT_BASE}/tags/${APP_SIGNUP_TAG_ID}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: emailAddress }),
    });

    if (!tagRes.ok) {
      console.error("kit-signup: tag apply failed", emailAddress, tagRes.status);
      return NextResponse.json({ ok: true, synced: false, reason: "kit error" });
    }

    return NextResponse.json({ ok: true, synced: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("kit-signup error:", message);
    return NextResponse.json({ ok: true, synced: false, reason: "server error" });
  }
}
