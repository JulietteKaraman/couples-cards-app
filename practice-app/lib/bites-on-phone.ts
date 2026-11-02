// Which funnel bites this phone has opened. Juliette, 2 Nov 2026: the bites are
// hidden from the library, so a buyer coming back had no way to find them. Kept on
// the phone only, so strangers still never see them.
const KEY = "ffy.bites.opened.v1";

export type PhoneBite = { slug: string; title: string; img: string };

export function readPhoneBites(): PhoneBite[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function rememberBite(b: PhoneBite) {
  try {
    localStorage.setItem(KEY, JSON.stringify([b, ...readPhoneBites().filter((x) => x.slug !== b.slug)]));
  } catch {
    /* storage blocked: the page still works */
  }
}
