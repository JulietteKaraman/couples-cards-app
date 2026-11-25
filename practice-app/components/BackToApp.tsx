"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Juliette, 25 Nov 2026: "I went into Quiet Isn't Yes and I can't get back to the Feel Fully You app. Check that every one
// of them has a way back." The safety net: on any programme page (and every screen inside it), if the page shows no
// "← FFY app" of its own, this small one appears top left. It watches the page, so it also covers screens that change
// without a new address (a cover, an evening, a gate).
export function BackToApp() {
  const path = usePathname() || "";
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onProgramme = path.startsWith("/practice/") || path.startsWith("/taste/");
    if (!onProgramme) { setShow(false); return; }
    const check = () => {
      const own = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href="/"]')).some(
        (a) => a.dataset.testid !== "back-to-app" && a.getClientRects().length > 0,
      );
      setShow(!own);
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [path]);
  if (!show) return null;
  return (
    <Link
      href="/"
      data-testid="back-to-app"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
      className="fixed left-3 z-50 inline-flex min-h-[40px] items-center rounded-full border border-[#DDC98E]/70 bg-[rgba(7,7,7,0.82)] px-4 text-[13px] font-medium text-[#DDC98E] shadow-[0_4px_18px_rgba(0,0,0,0.45)] backdrop-blur"
    >
      &larr; FFY app
    </Link>
  );
}
