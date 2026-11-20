import { redirect } from "next/navigation";

// The old free-fortnight way in (16 Nov 2026) is gone: since 19 Nov the way in is 7 days free with a card.
// Anyone holding an old /free link goes straight to the join section of the sales page (20 Nov 2026).
export default function FreeFortnight() {
  redirect("https://feelfullyyou.com/scrumptious-confessions-membership#join");
}
