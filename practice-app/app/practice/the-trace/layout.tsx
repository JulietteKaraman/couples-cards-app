import type { Metadata } from "next";

// Hidden: reached only from the funnel.
export const metadata: Metadata = {
  title: "The Trace",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this bite, not the library.
  manifest: "/bites/manifests/the-trace.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "The Trace" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
