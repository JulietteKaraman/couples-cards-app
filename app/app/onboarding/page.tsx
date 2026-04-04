"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";

const slides = [
  { src: "/cards/couples/cover.png", alt: "Cover" },
  { src: "/cards/couples/instructions/Insructions1.svg", alt: "Instructions 1" },
  { src: "/cards/couples/instructions/Instructions2.svg", alt: "Instructions 2" },
];

function OnboardingContent() {
  const [i, setI] = useState(0);
  const router = useRouter();
  const { hasAccess, loading } = useAuth();
  const isLast = i === slides.length - 1;

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.push("/app/unlock");
    }
  }, [hasAccess, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <Image
            src={slides[i].src}
            alt={slides[i].alt}
            width={1200}
            height={1600}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 rounded-xl border border-white/15 py-2 text-sm disabled:opacity-40"
            disabled={i === 0}
            onClick={() => setI((v) => Math.max(0, v - 1))}
          >
            Back
          </button>

          <button
            className="flex-1 rounded-xl bg-white text-black py-2 text-sm font-medium"
            onClick={() => {
              if (isLast) router.push("/app/draw");
              else setI((v) => v + 1);
            }}
          >
            {isLast ? "Begin" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Onboarding() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
