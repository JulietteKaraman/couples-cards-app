import type { Metadata } from "next";

// Hidden: reached only from the bundle. Spec R1. Not in the library, noindex.
export const metadata: Metadata = {
  title: "Let Her Land",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this page, not the library.
  manifest: "/bites/manifests/let-her-land.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Let Her Land" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
