// This phone's record of which Communication Reboot Kit pieces have been
// opened (29 Oct 2026), so the hub's ring and ticks show where they are.
// Local only on purpose: no database change, nothing leaves the phone.
const KEY = "ffy.crk.done.v1";

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
