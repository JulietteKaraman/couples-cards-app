import type { Metadata } from "next";

// The Scrumptiousness Journal, in the app (specs/scrumptiousness-journal-and-poems.md).
// Open for now, no gate. Not indexed.
export const metadata: Metadata = {
  title: "The Scrumptiousness Journal",
  robots: { index: false, follow: false },
};

// The four typefaces her printed journal is set in (Jost, Marcellus, Playfair Display, Bodoni Moda),
// so each page looks as it does in the book.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Marcellus&family=Playfair+Display:ital@0;1&family=Bodoni+Moda:ital,wght@1,700&display=swap";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS} />
      {children}
    </>
  );
}
