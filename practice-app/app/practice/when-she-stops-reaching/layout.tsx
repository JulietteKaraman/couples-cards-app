import type { Metadata } from "next";

// Hidden: reached only from the funnel. Spec R1.
export const metadata: Metadata = {
  title: "When She Stops Reaching",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this bite, not the library.
  manifest: "/bites/manifests/when-she-stops-reaching.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Stops Reaching" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
