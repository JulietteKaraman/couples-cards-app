import type { Metadata } from "next";

// Hidden: reached only from the funnel.
export const metadata: Metadata = {
  title: "31 Days Closer",
  robots: { index: false, follow: false },
  // Its own home-screen icon opens this bite, not the library.
  manifest: "/bites/manifests/the-31-days-closer.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "31 Days Closer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
