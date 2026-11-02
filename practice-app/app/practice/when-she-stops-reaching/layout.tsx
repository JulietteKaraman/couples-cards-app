import type { Metadata } from "next";

// Hidden: reached only from the funnel. Spec R1.
export const metadata: Metadata = {
  title: "When She Stops Reaching",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
