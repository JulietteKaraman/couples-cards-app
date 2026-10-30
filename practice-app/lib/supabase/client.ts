import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/environment";

// 30 Oct 2026, Juliette: "every time I flick it up, I have to sign in again".
// On an iPhone home-screen app the sign-in lived only in localStorage, which
// iOS can lose if the app is swiped away moments after it was written. The
// session is now kept in TWO places: localStorage (as before, so everyone
// already signed in stays signed in) and a first-party cookie, split into
// pieces because a single cookie holds about 4KB. Reading tries
// localStorage first, then the cookie, and puts it back if one was lost.

const PIECE = 3000;
const MAX_AGE = 60 * 60 * 24 * 400; // browsers cap this themselves; fine

function cookieGet(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
  return m ? m[1] : null;
}
function cookieSet(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
function cookieRead(key: string): string | null {
  const n = Number(cookieGet(`${key}.n`) || 0);
  if (!n) return null;
  let out = "";
  for (let i = 0; i < n; i++) {
    const p = cookieGet(`${key}.${i}`);
    if (p === null) return null;
    out += p;
  }
  try { return decodeURIComponent(out); } catch { return null; }
}
function cookieClear(key: string) {
  const n = Number(cookieGet(`${key}.n`) || 0);
  for (let i = 0; i < Math.max(n, 6); i++) cookieSet(`${key}.${i}`, "", 0);
  cookieSet(`${key}.n`, "", 0);
}
function cookieWrite(key: string, value: string) {
  cookieClear(key);
  const enc = encodeURIComponent(value);
  const n = Math.ceil(enc.length / PIECE);
  for (let i = 0; i < n; i++) cookieSet(`${key}.${i}`, enc.slice(i * PIECE, (i + 1) * PIECE), MAX_AGE);
  cookieSet(`${key}.n`, String(n), MAX_AGE);
}

export const twiceSaved = {
  getItem(key: string): string | null {
    let v: string | null = null;
    try { v = localStorage.getItem(key); } catch {}
    if (v) return v;
    const c = cookieRead(key);
    if (c) { try { localStorage.setItem(key, c); } catch {} }
    return c;
  },
  setItem(key: string, value: string) {
    try { localStorage.setItem(key, value); } catch {}
    cookieWrite(key, value);
  },
  removeItem(key: string) {
    try { localStorage.removeItem(key); } catch {}
    cookieClear(key);
  },
};

export const supabaseBrowser = createClient(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? twiceSaved : undefined,
  },
});
