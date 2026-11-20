// Listening speed for Juliette's recordings, remembered on this phone.
// Stories, teachings and guides: up to 1.5x (Juliette, 2 Nov 2026).
// Touch Base: 1x, 1.1x or 1.2x only, everywhere it plays (Juliette, 12 Nov 2026:
// "we can speed it up to 1.1 or 1.2, it doesn't lose any of the potency").
// Touch Base keeps its own remembered speed, so a 1.5x story never speeds it up.
export const VOICE_SPEEDS = [1, 1.25, 1.5];
export const TOUCH_BASE_SPEEDS = [1, 1.1, 1.2];
// The Touch Map: 1x, 1.1x or 1.25x only (Juliette, 20 Nov 2026: "can we speed up to 1.1 and 1.25 only for touch map").
export const TOUCH_MAP_SPEEDS = [1, 1.1, 1.25];
const TM_KEY = "ffy.touchmap.rate";
const VOICE_KEY = "ffy.voice.rate";
const TB_KEY = "ffy.touchbase.rate";

export const isTouchBase = (src: string) => /\/touch-base\/touch-base-guided/.test(src || "");
export const isTouchMap = (src: string) => /\/touch-map\/(audio|menu)\//.test(src || "");
export const speedsFor = (src: string) => (isTouchBase(src) ? TOUCH_BASE_SPEEDS : isTouchMap(src) ? TOUCH_MAP_SPEEDS : VOICE_SPEEDS);
const keyFor = (src: string) => (isTouchBase(src) ? TB_KEY : isTouchMap(src) ? TM_KEY : VOICE_KEY);

export function readSpeed(src: string): number {
  try {
    const v = Number(localStorage.getItem(keyFor(src)));
    return speedsFor(src).includes(v) ? v : 1;
  } catch {
    return 1;
  }
}

export function saveSpeedFor(src: string, v: number) {
  try {
    localStorage.setItem(keyFor(src), String(v));
    window.dispatchEvent(new Event("ffy-voice-rate"));
  } catch {}
}

export const nextSpeed = (src: string, cur: number) => {
  const s = speedsFor(src);
  return s[(s.indexOf(cur) + 1) % s.length];
};
