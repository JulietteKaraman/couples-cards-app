// Members App spec R1/E7/E8: reads a member's real Touch Reset Quiz result
// straight from Kit — their existing touch_pattern/touch_pleasure/
// touch_language custom fields — so the membership can open with "here's
// your stack" instead of a re-ask or a blank menu. This is a READ only;
// the quiz keeps writing to Kit exactly as it does today (see
// reference_touch_reset_quiz.md), this file never creates or updates a
// Kit subscriber.
//
// Uses Kit's v4 API directly (X-Kit-Api-Key header) since the app's own
// server has no other reason to depend on an MCP connection at runtime —
// same "call the real API directly" pattern as this app's Stripe calls.

export type MemberStack = {
  pattern: string | null; // e.g. "Flame"
  pleasureLanguage: string | null; // e.g. "Sensual"
  touchLanguage: string | null; // e.g. "Erotic"
};

const KIT_CUSTOM_FIELD_KEYS = {
  pattern: "touch_pattern",
  pleasureLanguage: "touch_pleasure",
  touchLanguage: "touch_language",
} as const;

export async function getMemberStack(email: string): Promise<MemberStack | null> {
  const apiKey = process.env.KIT_API_SECRET;
  if (!apiKey) {
    console.error("getMemberStack: KIT_API_SECRET is not configured");
    return null;
  }

  const url = new URL("https://api.kit.com/v4/subscribers");
  url.searchParams.set("email_address", email.toLowerCase().trim());

  const res = await fetch(url, {
    headers: { "X-Kit-Api-Key": apiKey },
    // Real quiz results change rarely; a short cache keeps repeat visits
    // to the membership home from hitting Kit on every load.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error("getMemberStack: Kit API error", res.status, await res.text().catch(() => ""));
    return null;
  }

  const data = await res.json();
  const subscriber = data?.subscribers?.[0];
  if (!subscriber) return null; // E7: no Kit record at all for this email

  const fields: Record<string, unknown> = subscriber.fields ?? {};

  // E8: any of the three can be missing on an older/partial quiz
  // completion — return whatever is actually on file rather than
  // requiring all three.
  return {
    pattern: typeof fields[KIT_CUSTOM_FIELD_KEYS.pattern] === "string" ? (fields[KIT_CUSTOM_FIELD_KEYS.pattern] as string) : null,
    pleasureLanguage: typeof fields[KIT_CUSTOM_FIELD_KEYS.pleasureLanguage] === "string" ? (fields[KIT_CUSTOM_FIELD_KEYS.pleasureLanguage] as string) : null,
    touchLanguage: typeof fields[KIT_CUSTOM_FIELD_KEYS.touchLanguage] === "string" ? (fields[KIT_CUSTOM_FIELD_KEYS.touchLanguage] as string) : null,
  };
}

export function hasAnyStackData(stack: MemberStack | null): boolean {
  return !!stack && (stack.pattern !== null || stack.pleasureLanguage !== null || stack.touchLanguage !== null);
}
