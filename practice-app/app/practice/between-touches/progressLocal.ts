// This phone's copy of Between Touches progress, kept alongside the
// account's, so the hub never shows less than what they have actually done.
const KEY = "ffy.bt.done.v1";

export function localDone(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function addLocalDone(slug: string) {
  try {
    const d = localDone();
    if (!d.includes(slug)) localStorage.setItem(KEY, JSON.stringify([...d, slug]));
  } catch {}
}
