"use client";

import { useState } from "react";
import Link from "next/link";
import { Jost } from "next/font/google";
import { CollectionGate } from "@/components/auth/CollectionGate";
import { REBOOT_KIT_CARDS, RebootCard } from "@/lib/content/communication-reboot-kit";

const DECK_TYPE = "communication-reboot-kit";

// The real cards app sets its whole face in Jost. The practice app runs on
// Poppins and Inter, so the card brings its own, otherwise the lettering is
// visibly a different deck.
const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "700"] });

// REBUILT 1 Oct 2026. Juliette: "it doesn't look like it has the full cards
// like we do on all the other apps."
//
// She was right. This page was a flat PNG with text sat on top of it, while
// every real deck DRAWS its card: a back you turn over, gold chevrons, the
// black band, type that scales with the card. So it had no back, no band, no
// flip, and lettering that could not grow or shrink with the card.
//
// It is now the same construction as card-engine/app/index.html, measurement
// for measurement: a container-query box at the real 1226/1758 aspect, the
// gold gradient chevrons, the band at top 30.6cqw height 17.6cqw, the prompt
// block inset 14cqw, the url line at 106cqw, all in cqw exactly as the real
// deck has them. The BACK is the real one, the same artwork lifted out of the
// cards app (it was inlined there as base64) and saved to
// public/reboot-kit/card-back.jpg, with the deck name dropped into the gold
// box the artwork already leaves empty.
//
// TWO THINGS FOR JULIETTE TO SETTLE, both flagged to her:
//  1. SETTLED 1 Oct 2026. Juliette: "it is communication reboot". The band
//     and the back box carry the kit's real name, over the two lines her own
//     deck's band is already built for (the real card has a brand span and a
//     category span). My placeholder word REBOOT is gone.
//  2. SETTLED 1 Oct 2026. Juliette: "the prompt stays bold because if there's
//     a second line under it, it's not bold." So: .ffy-prompt is 700 on every
//     card, .ffy-sub is 400. That is what this does, and it matches the real
//     deck. Her 12 Aug note ("ONLY the cards that have 2 questions are in
//     bold") was about the old PNG version and is superseded.
const BAND_TOP = "COMMUNICATION";
const BAND_BOTTOM = "REBOOT";

function CardFace({
  card,
  revealed,
  flipping,
}: {
  card: RebootCard;
  revealed: boolean;
  flipping: boolean;
}) {
  const isSplit = typeof card !== "string";
  const main = isSplit ? card.main : card;
  const sub = isSplit ? card.secondary : null;

  return (
    <div
      className={`${jost.className} ffy-card${flipping ? " ffy-flip" : ""}`}
      style={{ containerType: "inline-size" }}
    >
      <svg className="ffy-chev ffy-chev-top" viewBox="0 0 120 106" aria-hidden="true">
        <defs>
          <linearGradient id="rebootGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8c6a2b" />
            <stop offset=".5" stopColor="#d9c389" />
            <stop offset="1" stopColor="#8c6a2b" />
          </linearGradient>
        </defs>
        <polyline points="0,0 60,104 120,0" fill="none" stroke="url(#rebootGold)" strokeWidth="2.4" />
        <polyline points="40,0 60,34 80,0" fill="none" stroke="url(#rebootGold)" strokeWidth="1.6" />
      </svg>

      <div className="ffy-band">
        <span>{BAND_TOP}</span>
        <span>{BAND_BOTTOM}</span>
      </div>

      <div className="ffy-body">
        <div className="ffy-prompt">{main}</div>
        {sub && <div className="ffy-sub">{sub}</div>}
      </div>

      <div className="ffy-url">FEELFULLYYOU.COM</div>

      <svg className="ffy-chev ffy-chev-bottom" viewBox="0 0 120 106" aria-hidden="true">
        <polyline points="0,106 60,2 120,106" fill="none" stroke="url(#rebootGold)" strokeWidth="2.4" />
        <polyline points="40,106 60,72 80,106" fill="none" stroke="url(#rebootGold)" strokeWidth="1.6" />
      </svg>

      {/* The back. Hidden once turned over, exactly as the real deck does it. */}
      {!revealed && (
        <div className="ffy-front">
          <div className="ffy-fbox">
            <span className="ffy-fdeck">{BAND_TOP} {BAND_BOTTOM}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CardsPage() {
  return (
    <CollectionGate collectionSlug={DECK_TYPE}>
      <CardsPageContent />
    </CollectionGate>
  );
}

function CardsPageContent() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const total = REBOOT_KIT_CARDS.length;

  // The real deck turns over on tap, and the change happens halfway through
  // the turn so the card hides it, the way a hand does.
  function turn(after: () => void) {
    setFlipping(true);
    window.setTimeout(after, 250);
    window.setTimeout(() => setFlipping(false), 520);
  }

  function tapCard() {
    if (!revealed) turn(() => setRevealed(true));
    else
      turn(() => {
        setIndex((i) => (i + 1) % total);
        setRevealed(false);
      });
  }
  function prev() {
    turn(() => {
      setIndex((i) => (i - 1 + total) % total);
      setRevealed(false);
    });
  }
  function next() {
    turn(() => {
      setIndex((i) => (i + 1) % total);
      setRevealed(false);
    });
  }
  function draw() {
    turn(() => {
      setIndex((i) => {
        if (total < 2) return i;
        let n = i;
        while (n === i) n = Math.floor(Math.random() * total);
        return n;
      });
      setRevealed(false);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-ffy-cream px-6 py-10">
      <style>{`
        .ffy-card{
          position:relative; width:100%; aspect-ratio:1226/1758; background:#fff; color:#000;
          box-shadow:0 18px 40px -22px rgba(60,45,20,.45), 0 0 0 1px rgba(0,0,0,.05);
          overflow:hidden; cursor:pointer;
        }
        .ffy-flip{ animation:ffyflip .5s ease; }
        @keyframes ffyflip{ 0%{transform:rotateY(0)} 50%{transform:rotateY(90deg)} 100%{transform:rotateY(0)} }
        @media (prefers-reduced-motion:reduce){ .ffy-flip{ animation:none; } }
        .ffy-chev{ position:absolute; left:50%; transform:translateX(-50%); width:31cqw; height:auto; }
        .ffy-chev-top{ top:0; }
        .ffy-chev-bottom{ bottom:0; }
        .ffy-band{
          position:absolute; left:0; right:0; top:30.6cqw; height:17.6cqw; background:#000;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          color:#a8843f; font-weight:400; line-height:1.08; padding:0 5cqw; overflow:hidden;
        }
        .ffy-band span{ display:block; white-space:nowrap; text-transform:uppercase; font-size:6.2cqw; }
        .ffy-body{
          position:absolute; left:14cqw; right:14cqw; top:58cqw; height:44cqw; overflow:hidden;
          display:flex; flex-direction:column; align-items:center;
        }
        .ffy-prompt{ text-align:center; text-transform:uppercase; font-weight:700; letter-spacing:.14em; line-height:1.35; font-size:3.9cqw; }
        .ffy-sub{ margin-top:2.6cqw; text-align:center; font-size:3.55cqw; letter-spacing:.08em; color:#333; font-weight:400; text-transform:uppercase; }
        .ffy-url{ position:absolute; left:0; right:0; top:106cqw; text-align:center; font-size:3.2cqw; letter-spacing:.3em; }
        .ffy-front{
          position:absolute; inset:0; z-index:2;
          background:#000 url("/reboot-kit/card-back.jpg") center / cover no-repeat;
        }
        .ffy-fbox{
          position:absolute; left:18.9%; width:62.1%; top:64.3%; height:12.1%;
          display:flex; align-items:center; justify-content:center; text-align:center;
        }
        .ffy-fdeck{
          display:block; max-width:88%; white-space:normal; color:#fff; font-weight:400;
          font-size:5.4cqw; letter-spacing:.2em; padding-left:.2em; line-height:1.35;
          text-transform:uppercase;
        }
      `}</style>

      <div className="w-full max-w-xs">
        <Link
          href="/practice/communication-reboot-kit/communication-and-intimacy-cards"
          className="inline-flex items-center gap-1.5 rounded-full border border-ffy-gold-deep/40 px-4 py-2 text-sm font-medium text-ffy-gold-deep transition hover:bg-ffy-gold-deep/5"
        >
          ← Back
        </Link>
      </div>

      <div className="mt-8 flex w-full flex-1 flex-col items-center justify-center">
        <div
          className="w-full max-w-xs"
          role="button"
          tabIndex={0}
          aria-label={revealed ? "Next card" : "Turn the card over"}
          onClick={tapCard}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              tapCard();
            }
          }}
        >
          <CardFace card={REBOOT_KIT_CARDS[index]} revealed={revealed} flipping={flipping} />
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ffy-black/40">
          {revealed ? `${index + 1} of ${total}` : "Tap to turn it over"}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous card"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ffy-gold-deep/40 text-ffy-gold-deep transition hover:bg-ffy-gold-deep/10"
          >
            ←
          </button>
          <button
            type="button"
            onClick={draw}
            className="rounded-full bg-ffy-teal px-6 py-3 font-display text-sm font-medium text-ffy-cream transition hover:bg-ffy-black"
          >
            Draw a card
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next card"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ffy-gold-deep/40 text-ffy-gold-deep transition hover:bg-ffy-gold-deep/10"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}
