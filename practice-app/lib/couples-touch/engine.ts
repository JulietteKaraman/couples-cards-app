// Couples Touch Map: if this, then that. The same rules as
// APP builds/specs/touch-map-engine/matcher.py, checked against it across every
// quiz result in steps of ten (parity.ts). Change one, change the other.

export type Lang = "energetic" | "sensual" | "kinky" | "sexual" | "shapeshifter";
export type Mix = Record<string, number>;
export type Piece = {
  language: string; who: string; stage: string; start: number; end: number; spans: number[][]; length: number;
  contains: string[]; gentleness?: string | null; needs: string[]; areas: string[]; text: string; marks?: number[];
};
export type Block = { id: string; slug: string; lang: string; pieces: Piece[] };
export type Wording = "one-way" | "adapted";
export type PlayStep = {
  kind: "play"; lang: string; slug: string; start: number; end: number; spans: number[][]; seconds: number;
  stage: string; contains: string[]; needs: string[]; areas: string[]; text: string;
};
export type LineStep = { kind: "line"; line: "join" | "palm" | "ask" | "place"; asks?: string[] };
export type Step = PlayStep | LineStep;

const ORDER: Record<string, number> = { energetic: 0, sensual: 1, shapeshifter: 2, kinky: 3, sexual: 4 };
export const TOUCH_SECONDS = 600;
const MIN_SHARE = 0.08, MAIN_SHARE = 0.3, MIN_BUDGET = 90, MIN_BLOCK = 30;
const LADDER = ["no-contact", "hover", "anchor-palm", "light", "texture-temperature", "food", "friction-restraint-command", "open-play"];
const ASK_FIRST = new Set(["blindfold", "restraint", "food", "impact", "undress", "direct-genital"]);
const STRONG = new Set(["direct-genital", "undress", "restraint", "bite", "hair-pull", "impact", "explicit-talk"]);

function fits(p: Piece, wording: Wording) {
  if (p.who === "giver-receiver") return true;
  if (p.who === "together" && p.language === "energetic" && p.stage === "no-contact") return true;
  return wording === "adapted" && p.who === "alone-or-together";
}

function trim(b: Block, budget: number, wording: Wording, no: Set<string>, share: number, have: Set<string> | null): [Piece[], number] {
  const kept: Piece[] = [];
  let total = 0;
  for (const p of b.pieces) {
    if (!fits(p, wording)) break;
    if (p.contains.some((c) => no.has(c))) break;
    if (have && p.needs.some((n) => !have.has(n))) break;
    if (share <= MAIN_SHARE && p.contains.some((c) => STRONG.has(c))) break;
    if (p.language === "kinky" && share <= MAIN_SHARE && p.gentleness === "firmer") break;
    if (total + p.length > budget * 1.25) break;
    kept.push(p);
    total += p.length;
  }
  return [kept, total];
}

const rung = (stage: string) => (stage === "setup" ? -1 : LADDER.includes(stage) ? LADDER.indexOf(stage) : 3);
function blockRung(kept: Piece[]) {
  for (const p of kept) if (p.stage !== "setup") return rung(p.stage);
  return -1;
}

function slots(mix: Mix, seconds: number): [string, number, number][] {
  const total = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  const share = Object.entries(mix).map(([k, v]) => [k, v / total] as [string, number]).filter(([, v]) => v >= MIN_SHARE);
  const top = [...share].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const norm = top.reduce((a, [, v]) => a + v, 0);
  const out = top.map(([k, v]) => [k, Math.max(MIN_BUDGET, (seconds * v) / norm), v] as [string, number, number]);
  return out.sort((a, b) => ORDER[a[0]] - ORDER[b[0]]);
}

const shareOfMix = (m: Mix, k: string) => (m[k] ?? 0) / (Object.values(m).reduce((a, b) => a + b, 0) || 1);
const topOf = (m: Mix) => Object.entries(m).reduce((best, e) => (e[1] > best[1] ? e : best))[0];

type Chosen = { lang: string; slug: string; pieces: Piece[] };

export function build(
  mix: Mix, pool: Block[], used: Set<string>,
  opts: { wording?: Wording; no?: Iterable<string>; giver?: Mix | null; have?: Iterable<string> | null; seconds?: number; original?: Mix } = {},
): { steps: Step[] | null; stuck: string | null } {
  const wording = opts.wording ?? "one-way";
  const no = new Set(opts.no ?? []);
  const have = opts.have ? new Set(opts.have) : null;
  if (opts.giver && Object.keys(mix).length && topOf(opts.giver) === "sexual" && topOf(mix) !== "sexual") no.add("direct-genital");
  const line: Chosen[] = [];
  for (const [lang, budget, share] of slots(mix, opts.seconds ?? TOUCH_SECONDS)) {
    let got = 0;
    // Someone else sitting out never makes a small share strong: gentleness goes by their real result.
    const gentleShare = opts.original ? Math.min(share, shareOfMix(opts.original, lang)) : share;
    const here: Chosen[] = [];
    const cands = pool.filter((b) => b.lang === lang && !used.has(b.id));
    while (got < budget * 0.7) {
      let best: { key: [number, number]; b: Block; kept: Piece[]; total: number } | null = null;
      for (const b of cands) {
        const [kept, total] = trim(b, budget - got, wording, no, gentleShare, have);
        if (!kept.length || total < MIN_BLOCK) continue;
        const key: [number, number] = [blockRung(kept), -total];
        if (!best || key[0] < best.key[0] || (key[0] === best.key[0] && key[1] < best.key[1])) best = { key, b, kept, total };
      }
      if (!best) break;
      used.add(best.b.id);
      cands.splice(cands.indexOf(best.b), 1);
      here.push({ lang, slug: best.b.slug, pieces: best.kept });
      got += best.total;
    }
    if (got < budget * 0.7) return { steps: null, stuck: lang };
    const first: Record<string, number> = {};
    for (const x of here) first[x.slug] = Math.min(first[x.slug] ?? 99, blockRung(x.pieces));
    here.sort((a, b) => first[a.slug] - first[b.slug] || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0) || a.pieces[0].start - b.pieces[0].start);
    line.push(...here);
  }
  return { steps: withMarkers(line), stuck: null };
}

function withMarkers(line: Chosen[]): Step[] {
  const steps: Step[] = [];
  const asked = new Set<string>();
  const lastEnd: Record<string, number> = {};
  const flat = line.flatMap((x) => x.pieces.map((p) => [x, p] as [Chosen, Piece]));
  let prev: string | null = null;
  flat.forEach(([x, orig], i) => {
    let p = orig;
    if (p.start < (lastEnd[x.slug] ?? 0)) { // a join must never replay a word
      const cut = lastEnd[x.slug];
      const sp = p.spans.filter(([, b]) => b > cut).map(([a, b]) => [Math.max(a, cut), b]);
      const w = p.text.split(" "), m = p.marks ?? []; // the words on tap follow the cut
      const text = m.length === w.length ? w.filter((_, k) => m[k] >= cut - 0.05).join(" ") : p.text;
      p = { ...p, start: cut, spans: sp, length: sp.reduce((n, [a, b]) => n + b - a, 0), text };
    }
    lastEnd[x.slug] = p.end;
    if (prev && prev !== x.lang) steps.push({ kind: "line", line: "join" });
    prev = x.lang;
    const need = p.contains.filter((c) => ASK_FIRST.has(c) && !asked.has(c)).sort();
    if (need.length) {
      need.forEach((n) => asked.add(n));
      steps.push({ kind: "line", line: "ask", asks: need });
    }
    steps.push({
      kind: "play", lang: x.lang, slug: x.slug, start: p.start, end: p.end, spans: p.spans, seconds: Math.round(p.length),
      stage: p.stage, contains: p.contains, needs: p.needs, areas: p.areas, text: p.text,
    });
    const nx = flat[i + 1];
    const carriesOn = nx && nx[0].lang === x.lang && (nx[1].stage === "hover" || nx[1].stage === "anchor-palm")
      && !nx[1].contains.some((c) => ASK_FIRST.has(c) && !asked.has(c));
    if (p.stage === "hover" && !carriesOn) steps.push({ kind: "line", line: "palm" });
  });
  return steps;
}

// What the app actually uses: giver-and-receiver wording first, then the rest.
// Her rule, 4 Nov: a language under 30% is not in the first touch date. After that it plays
// when there are enough recordings and sits out when there aren't.
export type TouchDate = { steps: Step[]; wording: Wording; repeated: boolean; used: string[] };
const SIT_OUT_UNDER = 0.3;
const shareOf = shareOfMix;
function withoutSmall(mix: Mix): Mix {
  const top = topOf(mix);
  return Object.fromEntries(Object.entries(mix).map(([k, v]) => [k, k !== top && shareOf(mix, k) < SIT_OUT_UNDER ? 0 : v]));
}
export function buildTouchDate(
  mix: Mix, pool: Block[], usedBefore: string[],
  opts: { no?: string[]; giver?: Mix | null; have?: string[] },
): TouchDate | { stuck: string } {
  let stuck = "";
  const first = usedBefore.length === 0;
  for (const fresh of [false, true]) {
    let m = first || fresh ? withoutSmall(mix) : { ...mix };
    if (first && fresh) break; // nothing has been used yet, so repeating can't help
    for (;;) {
      let here = "";
      for (const wording of ["one-way", "adapted"] as Wording[]) {
        const used = new Set(fresh ? [] : usedBefore);
        const r = build(m, pool, used, { ...opts, wording, original: mix });
        if (r.steps && r.steps.length) return { steps: r.steps, wording, repeated: fresh, used: [...used] };
        here = r.stuck ?? here;
      }
      stuck = here || stuck;
      if (!here || here === topOf(m) || shareOf(m, here) >= SIT_OUT_UNDER) break;
      m = { ...m, [here]: 0 };
    }
  }
  return { stuck };
}

// ---------------------------------------------------------------------------
// Touch dates, place by place (agreed with Juliette 9 Nov 2026, spec v2).
// A touch date is one to three places. At each place the giver goes through the
// receiver's languages in her order, Touch A and Touch B, from her place recordings.
// From touch date 4 one ticked tool comes in, and from 11 minutes one longer ritual
// from her Touch Menu. Same safety rules as build(): nos, props, a small share gets
// the gentle part only, the Sexual giver rule, under 30% out on the first touch date.
export const PLACES = ["neck", "wrist", "spine", "lower-back", "thighs", "feet"];
const placeOf = (slug: string) => PLACES.find((pl) => slug.startsWith(pl + "-")) ?? null;
export const MINUTES = [3, 5, 7, 9, 11, 15];
// Her capacity ladder: 3, then 5, then 7, and only after three touch dates the choice up to 15.
export const minutesFor = (datesDone: number) => (datesDone === 0 ? [3] : datesDone === 1 ? [5] : datesDone === 2 ? [7] : MINUTES);

export type DatePlan = { steps: Step[]; used: string[]; places: string[]; seconds: number };
export function buildPlaceDate(
  mix: Mix, pool: Block[],
  opts: { minutes: number; datesDone: number; lastPlaces?: string[]; usedTools?: string[]; usedMenu?: string[];
    no?: string[]; have?: string[]; giver?: Mix | null; tryLang?: string | null },
): DatePlan | { stuck: string } {
  const no = new Set(opts.no ?? []);
  const have = new Set(opts.have ?? []);
  if (opts.giver && topOf(opts.giver) === "sexual" && topOf(mix) !== "sexual") no.add("direct-genital");
  let m: Mix = opts.datesDone === 0 ? withoutSmall(mix) : { ...mix };
  const original: Mix = { ...mix };
  if (opts.tryLang && opts.datesDone >= 3 && shareOfMix(mix, opts.tryLang) < SIT_OUT_UNDER) { // a taste of another language, under her small-share rule
    const total = Object.values(m).reduce((a, b) => a + b, 0) || 1;
    if (shareOfMix(m, opts.tryLang) < 0.15) m = { ...m, [opts.tryLang]: (total * 0.15) / 0.85 };
    original[opts.tryLang] = Math.min(original[opts.tryLang] ?? 0, 0); // always treated as small
  }
  const langs = slots(m, 60).map(([l]) => l);
  const gentle = (lang: string) => Math.min(shareOfMix(m, lang), shareOfMix(original, lang));
  const ok = (p: Piece, lang: string) => {
    if (p.contains.some((c) => no.has(c))) return false;
    if (p.needs.some((n) => !have.has(n))) return false;
    const g = gentle(lang);
    if (g <= MAIN_SHARE && p.contains.some((c) => STRONG.has(c))) return false;
    if (lang === "kinky" && g <= MAIN_SHARE && p.gentleness === "firmer") return false;
    return true;
  };
  const budget = opts.minutes * 60;
  const nPlaces = opts.minutes <= 5 ? 1 : opts.minutes <= 9 ? 2 : 3;
  const last = new Set(opts.lastPlaces ?? []);
  const order = [...PLACES].sort((a, b) => Number(last.has(a)) - Number(last.has(b))); // not the places from last time
  const rot = (opts.datesDone * 2) % order.filter((p) => !last.has(p)).length || 0;
  const fresh = order.filter((p) => !last.has(p));
  const places = [...fresh.slice(rot), ...fresh.slice(0, rot), ...order.filter((p) => last.has(p))];
  const line: Chosen[] = [];
  const used: string[] = [];
  const chosenPlaces: string[] = [];
  let total = 0;
  const addPlace = (place: string) => {
    let added = false;
    for (const lang of langs) {
      const b = pool.find((x) => x.slug === `${place}-${lang}`);
      if (!b) continue;
      const kept: Piece[] = [];
      for (const p of b.pieces) { if (!ok(p, lang)) break; kept.push(p); }
      const len = kept.reduce((n, p) => n + p.length, 0);
      if (!kept.length || total + len > budget * 1.2) continue;
      line.push({ lang, slug: b.slug, pieces: kept }); used.push(b.id); total += len; added = true;
    }
    if (added) chosenPlaces.push(place);
  };
  for (const place of places) {
    if (chosenPlaces.length >= nPlaces || total >= budget * 0.8) break;
    addPlace(place);
  }
  for (const place of places) { // much too short: one more place, never more
    if (total >= budget * 0.5 || chosenPlaces.length > nPlaces || chosenPlaces.includes(place)) continue;
    addPlace(place);
    break;
  }
  if (!line.length) return { stuck: langs[0] ?? topOf(mix) };
  // One tool they have, from touch date 4, on the first place
  if (opts.datesDone >= 3) {
    const usedTools = new Set(opts.usedTools ?? []);
    const tools = pool.filter((b) => b.slug.startsWith("tool-") && (langs.includes(b.lang) || ["energetic", "sensual"].includes(b.lang)))
      .sort((a, b) => Number(usedTools.has(a.slug)) - Number(usedTools.has(b.slug)));
    for (const t of tools) {
      const p = t.pieces[0];
      if (!t.pieces.every((x) => ok(x, t.lang)) || total + p.length > budget * 1.25) continue;
      const firstPlaceEnd = line.findIndex((x, i) => i > 0 && placeOf(x.slug) !== placeOf(line[0].slug));
      line.splice(firstPlaceEnd < 0 ? line.length : firstPlaceEnd, 0, { lang: t.lang, slug: t.slug, pieces: t.pieces });
      used.push(t.id); total += p.length;
      break;
    }
  }
  // From 11 minutes, one longer ritual from her Touch Menu in their main language
  if (opts.minutes >= 11 && total < budget * 0.85) {
    const usedMenu = new Set(opts.usedMenu ?? []);
    let best: { b: Block; kept: Piece[]; t: number } | null = null;
    for (const lang of langs) {
      for (const b of pool) {
        if (b.lang !== lang || placeOf(b.slug) || b.slug.startsWith("tool-") || usedMenu.has(b.id)) continue;
        const [kept, t] = trim(b, budget - total, "one-way", no, gentle(lang), have);
        if (kept.length && t >= MIN_BLOCK && (!best || t > best.t)) best = { b, kept, t };
      }
      if (best) break;
    }
    if (best) { line.push({ lang: best.b.lang, slug: best.b.slug, pieces: best.kept }); used.push(best.b.id); total += best.t; }
  }
  return { steps: placeMarkers(line), used, places: chosenPlaces, seconds: Math.round(total) };
}

// Lines between pieces: a moving-on line between places, asking first before what needs it.
function placeMarkers(line: Chosen[]): Step[] {
  const steps: Step[] = [];
  const asked = new Set<string>();
  let prevPlace: string | null = null;
  line.forEach((x) => {
    const pl = placeOf(x.slug);
    if (prevPlace && pl && pl !== prevPlace) steps.push({ kind: "line", line: "place" });
    if (pl) prevPlace = pl;
    for (const p of x.pieces) {
      const need = p.contains.filter((c) => ASK_FIRST.has(c) && !asked.has(c)).sort();
      if (need.length) { need.forEach((n) => asked.add(n)); steps.push({ kind: "line", line: "ask", asks: need }); }
      steps.push({ kind: "play", lang: x.lang, slug: x.slug, start: p.start, end: p.end, spans: p.spans, seconds: Math.round(p.length),
        stage: p.stage, contains: p.contains, needs: p.needs, areas: p.areas, text: p.text });
      if (p.stage === "hover") steps.push({ kind: "line", line: "palm" });
    }
  });
  return steps;
}
