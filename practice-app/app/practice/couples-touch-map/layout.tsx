import type { Metadata } from "next";

// Hidden preview. Linked from nowhere. Spec: APP builds/specs/couples-touch-map.md
export const metadata: Metadata = {
  title: "Couples Touch Map",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
