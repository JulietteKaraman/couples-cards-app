"use client";

// A POEM A WEEK, for Scrumptious Confessions members. Juliette, 19 Nov 2026: "I can add a poem each
// week to the membership instead of putting the whole book in." Her poems, in her words, from her
// book The Art of Scrumptious Living, Touch Base: Poems of Strength and Resilience, with her voice
// reading each one. Same lock as the confessions (CollectionGate + /api/poems checks it on the server).

import { useEffect, useState } from "react";
import VoicePlayer from "@/components/VoicePlayer";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { supabaseBrowser } from "@/lib/supabase/client";

const SLUG = "scrumptious-confessions";

type Poem = { id: string; publish_on: string; title: string; chapter: string; stanzas: string[][]; audio: string };
type Feed = { poems: Poem[]; next: string | null };

const dayName = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

function PoemBody({ p }: { p: Poem }) {
  return (
    <article data-testid="poem">
      {p.chapter && <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">{p.chapter}</p>}
      <h2 className="font-display mt-2 text-[28px] font-light leading-[1.15] text-[#f1ece2]">{p.title}</h2>
      {p.audio && (
        <div className="mt-4">
          <VoicePlayer src={p.audio} label={p.title} dark />
        </div>
      )}
      <div className="mt-6 space-y-6">
        {p.stanzas.map((lines, i) => (
          <p key={i} className="font-display text-[19px] font-light leading-[1.6] text-[#f1ece2]">
            {lines.map((l, j) => (
              <span key={j} className="block">{l}</span>
            ))}
          </p>
        ))}
      </div>
    </article>
  );
}

function Content() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabaseBrowser.auth.getSession();
        const token = data.session?.access_token;
        const res = await fetch("/api/poems", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) throw new Error(String(res.status));
        setFeed(await res.json());
      } catch {
        setFailed(true);
      }
    })();
  }, []);

  // A page of poems each Wednesday: everything with the newest date is "this week".
  const latestDate = feed?.poems[0]?.publish_on;
  const thisWeek = (feed?.poems ?? []).filter((p) => p.publish_on === latestDate);
  const earlier = (feed?.poems ?? []).filter((p) => p.publish_on !== latestDate);
  const latest = thisWeek[0];

  return (
    <main className="min-h-screen bg-[#070707] text-ffy-cream [background-image:radial-gradient(110%_55%_at_50%_0%,rgba(13,53,53,0.9)_0%,rgba(7,7,7,0)_70%)]">
      <div className="mx-auto max-w-xl px-5 pb-24 pt-6">
        <a href="/practice/scrumptious-confessions" className="inline-flex min-h-[44px] items-center text-[14px] text-[#DDC98E]">← Scrumptious Confessions</a>
        <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#DDC98E]">Poems every Wednesday</p>
        <h1 className="font-display mt-2 text-center text-[32px] font-light leading-[1.12]">From The Art of Scrumptious Living</h1>

        {!feed && !failed && <p className="mt-10 text-center text-[15px] text-[#a79f90]">One moment.</p>}
        {failed && <p className="mt-10 text-center text-[15px] text-[#a79f90]" data-testid="poems-failed">The poems could not load. Try again in a minute.</p>}

        {feed && !latest && <p className="mt-10 text-center text-[16px] text-[#cfc8bb]" data-testid="poems-none">{feed.next ? `The first poem opens on ${dayName(feed.next)}.` : "The first poem is on its way."}</p>}

        {latest && (
          <section className="mt-10" data-testid="latest">
            <p className="mb-4 text-center text-[12px] uppercase tracking-[0.16em] text-[#a79f90]">{dayName(latest.publish_on)}</p>
            <div className="space-y-6">
              {thisWeek.map((p) => (
                <div key={p.id} className="rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-[rgba(13,53,53,0.35)] p-6">
                  <PoemBody p={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {feed?.next && latest && <p className="mt-6 text-center text-[14px] text-[#a79f90]">The next poem opens {dayName(feed.next)}.</p>}

        {earlier.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-[22px] font-light">Earlier poems</h2>
            <ul className="mt-3">
              {earlier.map((p) => (
                <li key={p.id} className="border-b border-[rgba(221,201,142,0.18)]">
                  <button type="button" onClick={() => setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id} className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left">
                    <span>
                      <span className="block text-[16px] text-[#f1ece2]">{p.title}</span>
                      <span className="block text-[12px] text-[#a79f90]">{dayName(p.publish_on)}</span>
                    </span>
                    <span className="text-[#DDC98E]">{open === p.id ? "−" : "+"}</span>
                  </button>
                  {open === p.id && <div className="pb-8 pt-2"><PoemBody p={p} /></div>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

export default function ScrumptiousPoems() {
  return (
    <CollectionGate collectionSlug={SLUG}>
      <Content />
    </CollectionGate>
  );
}
