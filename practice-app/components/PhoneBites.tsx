"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readPhoneBites, type PhoneBite } from "@/lib/bites-on-phone";

export function PhoneBites() {
  const [bites, setBites] = useState<PhoneBite[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- phone storage is only readable after mount
    setBites(readPhoneBites());
  }, []);
  if (bites.length === 0) return null;
  return (
    <section className="ffy-rise mt-4" data-testid="phone-bites">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#DDC98E]">Yours on this phone</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {bites.map((b) => (
          <Link key={b.slug} href={`/practice/${b.slug}`} className="flex items-center gap-4 overflow-hidden rounded-3xl border-[1.5px] border-[rgba(221,201,142,0.45)] bg-[rgba(13,53,53,0.35)] p-3">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl"><Image src={b.img} alt="" fill sizes="64px" className="object-cover" /></span>
            <span className="flex-1 font-display text-[18px] font-light leading-tight text-ffy-cream">{b.title}</span>
            <span className="pr-2 text-[#DDC98E]">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
