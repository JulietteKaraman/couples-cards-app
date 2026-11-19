import type { Metadata } from "next";

// A poem a week for Scrumptious Confessions members. Not indexed.
export const metadata: Metadata = {
  title: "Poems every Wednesday",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
