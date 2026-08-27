"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tenTouchRituals } from "@/lib/content/ten-touch-rituals";
import { CollectionGate } from "@/components/auth/CollectionGate";

// 10 Touch Rituals is a real £7 purchase again (27 Aug 2026), delivered
// natively in the app so the real Vimeo embeds (Trace Ritual, Touch Base)
// actually play, a flat PDF cannot do that.
//
// No separate index/cover page (Juliette, 27 Aug 2026: "dont need to
// index page") — the real Gamma deck is one continuous document, not a
// menu of tiles, so tapping the library tile goes straight into the
// first real page. Prev/next navigation between entries already lives on
// each [slug] page.
export default function TenTouchRitualsEntry() {
  return (
    <CollectionGate collectionSlug={tenTouchRituals.slug}>
      <Redirector />
    </CollectionGate>
  );
}

function Redirector() {
  const router = useRouter();
  const firstSlug = tenTouchRituals.entries[0].slug;

  useEffect(() => {
    router.replace(`/practice/ten-touch-rituals/${firstSlug}`);
  }, [router, firstSlug]);

  return null;
}
