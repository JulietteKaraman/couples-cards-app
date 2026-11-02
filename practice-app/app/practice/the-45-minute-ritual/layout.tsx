import type { Metadata } from "next";

// Hidden: reached only from the funnel.
export const metadata: Metadata = {
  title: "The 45-Minute Connection Ritual",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
