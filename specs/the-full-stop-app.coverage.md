# Build coverage: specs/the-full-stop-app.md (2 Nov 2026)
Files: practice-app/app/practice/the-full-stop/{page,layout}.tsx, lib/content/the-full-stop.ts, public/the-full-stop/, components/BiteKit.tsx (shared, When She Stops Reaching now uses it and was rechecked).
- R1, R2, R3, R4 covered: walked at 375px.
- R5 covered: 134 of 135 old lines found in the rendered page; the other only shows after day seven and was seen there. All 12 pairs present.
- R6 covered: F1 plays on Begin, F2 and F3 load.
- R7 covered: stepped all 12 and round to 1, tap switches each.
- R8, R9 covered: colour dot added, second tap blocked same day with "One a day is enough."
- R10 covered: day seven shows her line, new date starts a second row keeping the first.
- R11 covered by code path, same as When She Stops Reaching; not retyped here. R12 covered: door link verified. R13 by code; local /api/count has no key.
- R14 NOT DONE: go-live step.
- E1, E2 by design, not simulated. E3 covered. E4 by design. E5 reload returns to step. E6 by code.
- D1 to D7 covered. D8 waiting on Juliette.
- ASSUMPTIONS: 'Do it again' returns to What it is and keeps days. Door moved from How to practise it to the end of Your week. Pairs show one at a time, with all 12 kept for screen readers.
- NOT COVERED: real iPhone test, full production build, migration run, R14.
