"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Juliette, 19 Nov 2026: "from the Quiet Isn't Yes guide, they can't go back to the app. We need to make
// sure that every time, they can go back to Scrumptious Confessions." Once someone has been in
// Scrumptious Confessions this visit, every other page in the app shows a small way back to it.
// Kept for the visit only (sessionStorage), so it never follows someone who didn't come from there.
const HOME = "/practice/scrumptious-confessions";
const KEY = "ffy.from.confessions";

export function BackToConfessions() {
  const path = usePathname() || "";
  const [show, setShow] = useState(false);
  useEffect(() => {
    let on = false;
    try {
      if (path.startsWith(HOME)) sessionStorage.setItem(KEY, "1");
      on = sessionStorage.getItem(KEY) === "1";
    } catch {}
    // Not on Confessions itself, not on the admin pages, not on sign-in.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the visit flag once per page, after it is in the browser
    setShow(on && !path.startsWith(HOME) && !path.startsWith("/admin") && !path.startsWith("/login"));
  }, [path]);
  if (!show) return null;
  return (
    <Link
      href={HOME}
      data-testid="back-to-confessions"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
      className="fixed right-3 z-50 inline-flex min-h-[40px] items-center rounded-full border border-[#DDC98E]/70 bg-[rgba(7,7,7,0.82)] px-4 text-[13px] font-medium text-[#DDC98E] shadow-[0_4px_18px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      &larr; Scrumptious Confessions
    </Link>
  );
}
