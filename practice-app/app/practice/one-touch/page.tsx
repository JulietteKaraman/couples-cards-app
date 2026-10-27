"use client";

// One Touch, 27 Oct 2026: the Today screen. Seven circles, today's practice,
// and two tabs: Seven days and Your cards. See components/OneTouch.tsx.

import { useEffect, useState } from "react";
import { oneTouch, oneTouchPrompts } from "@/lib/content/one-touch";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCompletedWithTimes } from "@/lib/entitlements/progress";
import { whenItOpens } from "@/lib/content/31-touch-points-drip";
import { computeOneTouchDrip, otDayOf, otMovesClock, OT_DAY_LESSON } from "@/lib/content/one-touch-drip";
import { OneTouchToday } from "@/components/OneTouch";

export default function OneTouchIndex() {
  return (
    <CollectionGate collectionSlug={oneTouch.slug}>
      <OneTouchIndexContent />
    </CollectionGate>
  );
}

function OneTouchIndexContent() {
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
    getCompletedWithTimes(user.id, "one-touch").then((rows) => {
      setDoneSlugs(rows.map((r) => r.slug));
      const times = rows.filter((r) => otMovesClock(r.slug) && r.at).map((r) => r.at as number);
      setLastDone(times.length ? Math.max(...times) : null);
    });
  }, [user]);

  const { unlockedThrough, dueAt } = computeOneTouchDrip({ doneSlugs: doneSlugs ?? [], lastDone, now });

  return (
    <OneTouchToday
      entries={oneTouch.entries}
      doneSlugs={doneSlugs}
      dayOf={otDayOf}
      dayLesson={OT_DAY_LESSON}
      unlockedThrough={unlockedThrough}
      dueAt={dueAt}
      whenItOpens={whenItOpens}
      heroImage={oneTouch.heroImage}
      prompts={oneTouchPrompts}
    />
  );
}
