import type { Metadata } from "next";

// Quiet Isn't Yes. specs/quiet-isnt-yes.md (APP builds/06 Operations & Pipelines/specs).
// Hidden until Juliette says it goes live: not in the library, noindex.
export const metadata: Metadata = {
  title: "Quiet Isn't Yes",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
