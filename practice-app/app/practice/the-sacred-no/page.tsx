"use client";

import { theSacredNo } from "@/lib/content/the-sacred-no";
import { useEffect, useState } from "react";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedWithTimes } from "@/lib/entitlements/progress";
import { adminBypassActive, whenItOpens } from "@/lib/content/31-touch-points-drip";
import { SN_DAY_LESSON, computeSacredNoDrip, snDayOf, snMovesClock } from "@/lib/content/the-sacred-no-drip";
import { ADMIN_EMAIL } from "@/lib/entitlements/admin";
import { SacredNoToday } from "@/components/SacredNo";

// The Sacred No, 17 Oct 2026 (specs/sacred-no-in-app.md): seven days, one at a time.
// 20 Nov 2026: the Today screen works like One Touch (see components/SacredNo.tsx),
// with the library tile's own photo at the top so the tile and the page match.
const SN_TILE_IMAGE = "/offers/sales/the-sacred-no.jpg";

const snThumbOf = (slug: string): string | null => {
  const e = theSacredNo.entries.find((x) => x.slug === slug);
  const v = e?.body.find((b) => b.kind === "driveVideo") as { url: string } | undefined;
  const id = v?.url.match(/\/d\/([^/]+)\//)?.[1];
  return id ? `/sacred-no/video/${id}.jpg` : null;
};

export default function TheSacredNoIndex() {
  return (
    <CollectionGate collectionSlug={theSacredNo.slug}>
      <TheSacredNoIndexContent />
    </CollectionGate>
  );
}

function TheSacredNoIndexContent() {
  const { user } = useAuth();
  const [doneSlugs, setDoneSlugs] = useState<string[] | null>(null);
  const [lastDone, setLastDone] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    getCompletedWithTimes(user.id, "sacred-no").then((rows) => {
      setDoneSlugs(rows.map((r) => r.slug));
      const times = rows.filter((r) => snMovesClock(r.slug) && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user]);

  const { unlockedThrough, dueAt } = computeSacredNoDrip({ doneSlugs: doneSlugs ?? [], lastDone, now });

  return (
    <SacredNoToday
      entries={theSacredNo.entries}
      doneSlugs={doneSlugs}
      dayOf={snDayOf}
      dayLesson={SN_DAY_LESSON}
      unlockedThrough={unlockedThrough}
      dueAt={dueAt ?? 0}
      whenItOpens={whenItOpens}
      heroImage={SN_TILE_IMAGE}
      thumbOf={snThumbOf}
      isAdmin={adminBypassActive(user?.email, ADMIN_EMAIL)}
    />
  );
}
