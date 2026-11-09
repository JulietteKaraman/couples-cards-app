"use client";

import { CollectionGate } from "@/components/auth/CollectionGate";
import { CouplesTouchMap } from "@/components/CouplesTouchMap";

export default function Page() {
  return (
    <CollectionGate collectionSlug="couples-touch-map">
      <CouplesTouchMap />
    </CollectionGate>
  );
}
