"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

const slides = [
  { src: "/cards/couples/cover.png", alt: "Cover" },
  { src: "/cards/couples/instructions/1.png", alt: "Instructions 1" },
  { src: "/cards/couples/instructions/2.png", alt: "Instructions 2" },
  { src: "/cards/couples/instructions/3.png", alt: "Instructions 3" },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  // const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const isLast = i === slides.length - 1;

  // useEffect(() => {
  //   async function checkAuth() {
  //     const { data } = await supabaseBrowser.auth.getUser();
  //     if (!data.user) {
  //       router.push("/login");
  //       return;
  //     }
  //     setCheckingAuth(false);
  //   }
  //   checkAuth();
  // // }, [router]);

  // if (checkingAuth) {
  //   return (
  //     <main className="min-h-screen bg-black text-white flex items-center justify-center">
  //       <div className="text-white/50">Loading...</div>
  //     </main>
  //   );
  // }

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
