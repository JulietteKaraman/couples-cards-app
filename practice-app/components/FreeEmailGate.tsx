"use client";

// The details step on the free practices (Juliette, 1 Nov 2026: "it shows
// those 2 without asking for their details"). First name and email, no
// password, then the practice opens on the spot.
//
// - Signed-in people never see it: the app already has their email.
// - Someone who filled it in once on this phone is not asked again, even for
//   the other free practice. They still get that practice's tag and emails.
// - It never blocks anyone. The details go to Kit in the background, so a Kit
//   hiccup cannot stop a woman reaching her practice.

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export type Freebie = "between-touches" | "touch-base";

const KEY = "ffy.freebie.contact.v1";
type Contact = { email: string; firstName: string; freebies: Freebie[] };

function readContact(): Contact | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    return v && typeof v.email === "string" && Array.isArray(v.freebies) ? v : null;
  } catch {
    return null;
  }
}

function saveContact(c: Contact) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
}

function sendToKit(c: { email: string; firstName: string }, freebie: Freebie, website = "") {
  fetch("/api/kit-signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: c.email, firstName: c.firstName, freebie, website }),
    keepalive: true,
  }).catch(() => {});
}

export function FreeEmailGate({
  freebie,
  fullPage = false,
  children,
}: {
  freebie: Freebie;
  fullPage?: boolean;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (user) {
      setOpen(true);
      return;
    }
    const known = readContact();
    if (!known) {
      setOpen(false);
      return;
    }
    if (!known.freebies.includes(freebie)) {
      sendToKit(known, freebie);
      saveContact({ ...known, freebies: [...known.freebies, freebie] });
    }
    setOpen(true);
  }, [loading, user, freebie]);

  if (open === true) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = firstName.trim();
    const address = email.trim().toLowerCase();
    if (!name) {
      setError("Tell me your first name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError("That email doesn't look right. Have another look?");
      return;
    }
    sendToKit({ email: address, firstName: name }, freebie, website);
    saveContact({ email: address, firstName: name, freebies: [freebie] });
    setOpen(true);
  };

  const field =
    "w-full rounded-full border border-[#DDC98E]/40 bg-[#1a1814] px-5 py-3.5 text-base text-[#f1ece2] placeholder:text-[#a79f90] focus:border-[#DDC98E] focus:outline-none";

  const form =
    open === null ? (
      <div className="min-h-[320px]" aria-busy="true" />
    ) : (
      <form onSubmit={submit} noValidate className="mt-8 rounded-[22px] border border-[#DDC98E]/25 bg-[#211e19] p-6">
        <h2 className="font-display text-[28px] font-light leading-tight text-[#f1ece2]">Tell me where to find you</h2>
        <p className="mt-2 leading-relaxed text-[#a79f90]">It opens straight away. No password.</p>
        <div className="mt-5 grid gap-3">
          <input
            type="text"
            name="firstName"
            autoComplete="given-name"
            aria-label="Your first name"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={field}
          />
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            aria-label="Your email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
          {/* Hidden from people, filled in by bots. Same trap as the website forms. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
        </div>
        {error ? <p role="alert" className="mt-3 text-sm text-[#EEDE80]">{error}</p> : null}
        <button type="submit" className="mt-5 w-full rounded-full bg-[#DDC98E] px-7 py-4 font-display text-lg font-medium text-[#1a1814]">
          Open it →
        </button>
        <p className="mt-4 text-center text-[13px] leading-relaxed text-[#a79f90]">
          I&rsquo;ll email you about this and my other work. Unsubscribe any time.
        </p>
      </form>
    );

  if (!fullPage) return form;

  return (
    <main className="min-h-screen bg-[#1a1814] px-6 pb-16 pt-4 text-[#f1ece2]">
      <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-[#DDC98E]/40 px-4 py-2 text-sm font-medium text-[#DDC98E]">
        ← Your library
      </Link>
      <div className="mx-auto mt-10 max-w-xl">{form}</div>
    </main>
  );
}
