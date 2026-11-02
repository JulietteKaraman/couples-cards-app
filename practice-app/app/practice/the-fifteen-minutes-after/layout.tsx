import type { Metadata } from "next";

// Hidden: reached only from the funnel.
export const metadata: Metadata = {
  title: "The Fifteen Minutes After",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this bite, not the library.
  manifest: "/bites/manifests/the-fifteen-minutes-after.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "15 Minutes After" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
