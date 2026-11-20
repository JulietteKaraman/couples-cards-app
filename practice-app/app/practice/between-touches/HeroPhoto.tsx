// The top photo on every Between Touches page (20 Nov 2026).
//
// Juliette's photos are mostly tall phone portraits. Dropped into a wide,
// short banner with object-cover they get zoomed to the middle of the frame,
// which on a laptop is chests and shoulders: heads cut off. So:
// - On a phone the photo fills the banner, pinned at `focus` (a CSS
//   object-position, set per photo so faces sit in frame).
// - From the sm breakpoint up the whole photo is shown (object-contain),
//   sitting on a soft blurred copy of itself so the banner still feels full.

import Image from "next/image";

export function HeroPhoto({
  src,
  alt,
  focus = "50% 30%",
}: {
  src: string;
  alt: string;
  focus?: string;
}) {
  // Fills its parent, which must be `relative` with a height.
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a1814]">
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="hidden scale-110 object-cover opacity-60 blur-2xl sm:block"
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover sm:object-contain"
        style={{ objectPosition: focus }}
      />
    </div>
  );
}
