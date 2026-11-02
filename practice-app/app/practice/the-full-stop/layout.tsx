import type { Metadata } from "next";

// Hidden: reached only from the funnel. Spec R1.
export const metadata: Metadata = {
  title: "The Full Stop",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this bite, not the library.
  manifest: "/bites/manifests/the-full-stop.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "The Full Stop" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
