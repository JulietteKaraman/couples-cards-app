// TEMPORARY, QA ONLY — not gated, not linked from anywhere, deleted before
// this session ends. Renders the real Blocks component against the real
// content so visual changes can actually be checked, not just typechecked.
import { Blocks } from "@/components/Blocks";
import { communicationRebootKit } from "@/lib/content/communication-reboot-kit";

export default function QaPreviewPage() {
  return (
    <main className="min-h-screen bg-ffy-cream px-6 py-10">
      <div className="mx-auto flex max-w-xl flex-col gap-16">
        {communicationRebootKit.entries.map((entry) => (
          <div key={entry.slug}>
            <h1 className="font-display text-2xl font-bold text-ffy-teal">{entry.title}</h1>
            <Blocks blocks={entry.body} />
          </div>
        ))}
      </div>
    </main>
  );
}
