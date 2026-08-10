"use client";

// Members App home — specs/members-app.md. Personalisation is the spine
// (R1-R5): this page opens with the member's own real quiz stack pulled
// from Kit, then a live Touch State check-in reusing the book's own
// state-ladder diagram and practice, with a real, queryable history so
// movement between states is actually visible (R2/R3), not just a
// "current state" field.
//
// Touch Menu / Touch Map / Yes-No Quiz+Sacred No (R6-R8) are NOT built out
// with real content here — that content lives in Juliette's Google Drive
// and hasn't been pulled into this session. Per the standing rule against
// inventing session mechanics or content, this page marks that section as
// "coming next" rather than fabricating Touch Menu items or a Sacred No
// script. The plumbing (this page, the entitlement, the collection slug)
// is ready for it the moment the real content is supplied.

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getRecentCheckins, logCheckin, type StateCheckin, type TouchState } from "@/lib/entitlements/checkins";
import type { MemberStack } from "@/lib/kit/stack";

const STATES: { key: TouchState; label: string; move: string }[] = [
  { key: "braced", label: "Braced", move: "Move one rung: exhale." },
  { key: "withheld", label: "Withheld", move: "Move one rung: name a need." },
  { key: "performing", label: "Performing", move: "Move one rung: drop the show for 10 seconds." },
  { key: "present", label: "Present", move: "Move one rung: let one thing in." },
  { key: "melted", label: "Melted", move: "Home." },
];

function formatCheckinDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function MembersAppPage() {
  return (
    <CollectionGate collectionSlug="members-app">
      <MembersAppContent />
    </CollectionGate>
  );
}

function MembersAppContent() {
  const { user } = useAuth();
  const [stack, setStack] = useState<MemberStack | null>(null);
  const [stackLoading, setStackLoading] = useState(true);
  const [checkins, setCheckins] = useState<StateCheckin[]>([]);
  const [loggingState, setLoggingState] = useState<TouchState | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    fetch("/api/members-stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then((r) => r.json())
      .then((data) => setStack(data.stack ?? null))
      .catch(() => setStack(null))
      .finally(() => setStackLoading(false));
  }, [user?.email]);

  useEffect(() => {
    if (!user?.id) return;
    getRecentCheckins(user.id, 10).then(setCheckins);
  }, [user?.id]);

  async function handleCheckin(state: TouchState) {
    if (!user?.id) return;
    setLoggingState(state);
    await logCheckin(user.id, state);
    const fresh = await getRecentCheckins(user.id, 10);
    setCheckins(fresh);
    setLoggingState(null);
  }

  const hasStack = !!stack && (stack.pattern || stack.pleasureLanguage || stack.touchLanguage);

  return (
    <main className="min-h-screen bg-ffy-cream">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← Your library
        </Link>

        <p className="mt-6 text-xs uppercase tracking-[0.15em] text-ffy-gold-deep">Members App</p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ffy-teal sm:text-4xl">
          Your stack
        </h1>

        {/* R1: the member's real quiz result, reflected back, not re-asked. */}
        {stackLoading ? (
          <p className="mt-4 text-ffy-brown">Loading your stack…</p>
        ) : hasStack ? (
          <div className="mt-6 rounded-2xl border border-ffy-border bg-white/70 p-6">
            {stack?.pattern && (
              <p className="text-lg text-ffy-black">
                You&rsquo;re a <span className="font-semibold text-ffy-teal">{stack.pattern}</span>
                {stack?.pleasureLanguage && (
                  <>
                    {" "}who&rsquo;s turned on by <span className="font-semibold text-ffy-teal">{stack.pleasureLanguage}</span>
                  </>
                )}
                .
              </p>
            )}
            {stack?.touchLanguage && (
              <p className="mt-1 text-sm text-ffy-brown">Your Touch Language: {stack.touchLanguage}</p>
            )}
          </div>
        ) : (
          // E7: no quiz result on file for this email — offer the quiz
          // itself as the first step, not a blank or broken screen.
          <div className="mt-6 rounded-2xl border border-ffy-border bg-white/70 p-6">
            <p className="text-ffy-black">You haven&rsquo;t taken the Touch Reset Quiz yet.</p>
            <p className="mt-2 text-sm text-ffy-brown">
              Five minutes, not a score. This is where your stack comes from, take it now and this
              page will open with your real result next time.
            </p>
            <a
              href="https://feelfullyyou.com/touch-reset-quiz"
              className="mt-4 inline-block rounded-full bg-ffy-teal px-5 py-3 font-display text-sm font-medium text-ffy-cream"
            >
              Take the Touch Reset Quiz →
            </a>
          </div>
        )}

        {/* R2/R3: a live check-in, not a quiz result — logged with history. */}
        <h2 className="mt-12 font-display text-2xl font-semibold text-ffy-teal">Where are you right now?</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-ffy-border">
          <Image
            src="/members/diagrams/state-ladder.svg"
            alt="The state ladder: Braced, Withheld, Performing, Present, Melted"
            width={640}
            height={520}
            className="w-full bg-white"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {STATES.map((s) => (
            <button
              key={s.key}
              onClick={() => handleCheckin(s.key)}
              disabled={loggingState !== null}
              title={s.move}
              className="rounded-full border border-ffy-gold-deep/40 px-4 py-2.5 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5 disabled:opacity-60"
            >
              {loggingState === s.key ? "Logging…" : s.label}
            </button>
          ))}
        </div>

        {checkins.length > 0 && (
          <div className="mt-6 rounded-2xl border border-ffy-border bg-white/60 p-5">
            <p className="text-xs uppercase tracking-[0.1em] text-ffy-brown">Your recent check-ins</p>
            <ul className="mt-3 space-y-1.5 text-sm text-ffy-black">
              {checkins.map((c, i) => (
                <li key={i}>
                  {formatCheckinDate(c.createdAt)} — {STATES.find((s) => s.key === c.state)?.label ?? c.state}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* R6-R8: real content pending — see the file header comment. */}
        <h2 className="mt-12 font-display text-2xl font-semibold text-ffy-teal">Your practice, coming next</h2>
        <div className="mt-4 rounded-2xl border border-dashed border-ffy-border bg-white/40 p-6 text-sm text-ffy-brown">
          The Touch Menu, the self-guided Touch Map, and the Yes/No Quiz into Sacred No live here next,
          built from Juliette&rsquo;s real Google Drive material once it&rsquo;s pulled in. Nothing invented
          in the meantime.
        </div>
      </div>
    </main>
  );
}
