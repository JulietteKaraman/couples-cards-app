import type { Metadata } from "next";

// Hidden: reached only from the funnel.
export const metadata: Metadata = {
  title: "The 45-Minute Connection Ritual",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this bite, not the library.
  manifest: "/bites/manifests/the-45-minute-ritual.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "45-Min Ritual" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
