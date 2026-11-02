# Build coverage: specs/when-she-stops-reaching-app.md (2 Nov 2026)
Files: practice-app/app/practice/when-she-stops-reaching/{page,layout}.tsx, lib/content/when-she-stops-reaching.ts, public/when-she-stops-reaching/, supabase/migrations/20261102_wssr_counts.sql. Small edits: components/PracticeTimer.tsx (optional onDone), app/api/count/route.ts (3 event names).
- R1 covered: no gate, noindex in layout.tsx, no library tile. Seen at 375px.
- R2 covered: seen. R3 covered: walked; Next, back and Your library on every step.
- R4 covered: walked in order. Check-in sits inside Do it now, with the practice, per her rule.
- R5 covered: wording extracted by script; 190 of 193 old lines found in rendered page, other 3 are conditional and present in page.tsx.
- R6 covered: W1 plays on Begin, W2 plays after timer (tested by moving the clock). Vimeo iframes load at 456px high.
- R7 covered in code and on desktop. iPhone not tested.
- R8 covered: walked. R9 covered: note saved and listed, localStorage only.
- R10 to R13 covered: walked; dots persist; solo dot has gold ring; Do it again keeps dots.
- R14 covered: door link verified, "Approach Ritual, Both Ways" absent.
- R15 covered in code: count sends e, day, feel only. Local dev /api/count returns 500 because this computer has no service key; route not exercised against the real table.
- R16 covered: new copy listed to Juliette.
- R17 NOT DONE: go-live step, waits for her yes.
- E1 covered. E2 clock-based timer, iPhone not tested. E3 listen tab and steps remain; failure not simulated. E4 probe hides player; not simulated. E5, E6 by design. E7 covered, reload returns to step. E8 covered, plain gold dot seen. E9 raised with Juliette.
- D1 covered at 375px in the app browser (not a private window). D2, D3, D5, D6, D7, D8 covered. D4 partly: desktop only. D9 by code plus network list. D10 waiting on Juliette. D11 after go-live.
- ASSUMPTIONS: "Do it again" returns to Setting it up, because he has to ask her again. Timers added on Touch Base and Approach teaching steps as well as Do it now. Solo done card says "Touch Base, on your own."
- NOT COVERED: real iPhone test, production build (not run: another session's dev server shares the folder, and the repo holds its unpushed work), migration run, R17, D11.
