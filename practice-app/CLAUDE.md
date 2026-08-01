# practice-app — content-import rules

This app ports Juliette's Gamma guides (10 Touch Rituals, The Unspoken
Distance, and more to come) into real, phone-first reading experiences.
When porting a new guide from Gamma, or auditing an existing one:

## Gamma diagrams are real content — never skip them

Gamma's `<diagram data-meta="...">` elements (numbered step-flow cards,
`template-key="accent_circle"` and similar) are **not decorative
AI-illustration filler**. Juliette places them deliberately. They must
be carried into the app every time, with no exceptions.

This was missed on both 10 Touch Rituals and the first pass of The
Unspoken Distance (31 Jul 2026) — both times they were judged
"decorative" and dropped, and both times that was wrong. Do not repeat
this. If a build or audit pass is tempted to call a Gamma diagram
"generic" or "AI filler" and skip it, stop — it is real content.

**How to handle them:** use the `diagram` ContentBlock kind
(`lib/content/blocks.ts`), which renders as a connected numbered step
flow (`components/Blocks.tsx`, case `"diagram"`). Extract every
`<diagram>` element's `data-meta` JSON (`step` array, each with an h4
heading and optional p text), and place one `{kind: "diagram", steps:
[...]}"` block at the point in the body where the diagram sits in the
original deck. If that same content is already fully captured as plain
prose or a `step` block elsewhere in the entry, still add the diagram
block near it (matching Gamma's own visual, not just the words) rather
than treating the two as redundant.

The only things safe to skip from a Gamma export: `pictographic.ai`
icon SVGs used purely as bullet decoration (not diagrams), and stock
image search placeholders. Real photos (`source="image.custom"`,
`image.pexels`, `image.web`) must always be downloaded and used —
verify every downloaded photo is actually referenced in the content
file, not just present in `public/`.

## Before shipping a new guide

1. Read the full Gamma export (it will exceed normal chunk sizes — read
   via `cut -c` in ~16000-char windows, not the Read tool's offset/limit).
2. Count every `<diagram>`, every real `<img>`, every `smart-layout`
   icon list in the raw export first, section by section, before
   transcribing — know the target count before you start.
3. After transcribing, verify the counts match: every downloaded photo
   referenced somewhere, every diagram present as a `diagram` block,
   every icon-list's real text (not the icon itself) captured.
4. Do not consider the build done until that verification pass has
   actually run, not just been assumed.
