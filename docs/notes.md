# Kumquat — biostat / epi / appraisal trainer (formerly "Clementine"; renamed 02/11/2026 because the user wants to keep the name Clementine for something else)

Artifact: https://claude.ai/artifact/8dtp3bAxFPjGFkeAkty7uP (single-file HTML, `kumquat.html`). **5.0.0 on 02/11/2026**: Citrus hub + Google Drive, hand kit, feedback fixes; renamed to Kumquat in version 6. The claude.ai artifact stays local-storage only (Google can't sign in on that origin); the **phone-app copy** (`kumquat-pwa.zip`: index.html, sw.js, manifest, icons, README) is the Google-connected one and is waiting for a GitHub org/repo (suggested `Kumquat-Evidence/Kumquat`, Pages from main/root). When the repo exists: add it to the session, push the bundle, add `https://<org>.github.io` to the Citrus web client's JS origins.

Storage: `localStorage kumquat.v1` (reads the old `clementine.v1` if present); device keys `kumquat_google`, `kumquat_drive_ids`, `kumquat_synced_at`, `kumquat_before_drive`, `kumquat_renew`.

## Structure (hubs with bottom tabs on phones)
- **Today**: streak/level, due-review banner, today's missions (30-day plan) or next lesson, quick starts, hook, **Citrus line** (planned block from `scheduler/plan.json`), weak spot, continue.
- **Learn**: The Path (10 lessons, 31 SVG illustrations), Casebook (10 role-play cases), references (designs, bias bestiary with exam phrasing, twins, test picker, appraisal kit + GRADE card, formula vault with worked examples, blueprint).
- **Labs**: Tree drill, 2×2, Cut-off dial, Fagan, Risk Lab, Outbreak (SIR), Confounding (MH-adjusted), Power, CI dance, Funnel, Math gym.
- **Practice**: review deck (Leitner 1-3-7-14-30; guesses/hints still enter), daily drill, tree drill, blitz, twins (27 pairs), formula flash (swipe), Step 1 (52), Step 2CK/3 (31), marathon, mock (40 Q / 60 min / 85%), per-topic.
- **Progress**: Mastery month (30 days, auto-ticking), mastery board, traps (most-missed + retry), calibration, Settings link.
- **Settings**: Google & Citrus (client id, connect, sync, sign out, toggles), conflict card, text backup copy/paste.

## Citrus hub (per hub-contract.md + google-cloud-setup.md; vanilla port like Mephisto c_hub.js)
- GIS token client, scopes `openid email drive`; token ~1 h, quiet daily renewal; `hubCan()` = secure context and not claude.ai.
- Drive master copy: `My Apps/hub/kumquat/state.json` (whole `st` minus `google`; `savedAt`, `device`). Pull if Drive has a save this device hasn't synced and the device isn't dirty; otherwise push (8 s after changes, forced on hide/pagehide/after connect). Conflict → card: "Use Drive's save" / "Keep this device"; snapshot kept.
- Status written twice: contract shape at `My Apps/hub/kumquat/status.json` (summary, today items from `st.log`, Mon–Sun week, next, asks per remaining day, pending, extra {mastery, bestMock, streak, xp, level, planDay, cardsDue, lessons, cases, url}) **and** Citrus Maxima's current simple shape at `Citrus Maxima/Apps/Kumquat.status.json` (title, icon 🍊, color #FF6A13, summary, due, estimatedMinutes, streak, nextDue, url). Fingerprinted, ≤ every 5 min unless forced.
- Reads `My Apps/hub/scheduler/plan.json` defensively (array or {blocks|items|today}), picks today's entry whose app/title contains "kumquat".
- Tested with a fake Drive in Playwright: two devices, pull, push, plan, conflict (`hubtest.js`).

## Hand kit (ui-kit.md)
Hold ~0.45 s to explain (header chips, level, pips, combo, pace, mastery tiles, mastery score, plan days, metrics, tree boxes, blueprint ratings, guess/hint chips, legends, bias families, criteria); hold menus on mastery tiles, plan tasks, traps, case cards, vault rows (bottom sheet, Escape/scrim/drag-down close); swipe formula flash cards (→ Got it, ← Again). Every hold action also exists as a visible control.

## Feedback 27/10 applied
Type II = fail to reject; sample-size d defined; lesson 6 answer "Hawthorne effect (plus self-report bias)"; MERS vaccine line softened; blueprint gaps covered (PAR, secondary attack rate, epidemic-curve shapes, surveillance types, equivalence/factorial, surrogate endpoints, IRB/vulnerable, mediators) via vault rows, Path bullets and 14 new bank questions; 6 casebook calculations in the pool; exam phrasing on every bias card; 6 new twins; GRADE card; worked example on every vault formula (`VAULT_EX`, one source).

## Learning-science basis
Natural frequencies + trees (Hoffrage 2015), faded worked examples (hint = formula only, half XP), interleaving, spacing, calibration.

## Open ideas
Calendar-aware week slots (read shifts like Mephisto); tag questions to blueprint items; Yuzu export of misses.


## 6.0.0 (02/11/2026, artifact version 9) — the overhaul
- **Look**: family pixel look ported from Mephisto/Orange: "Orange Pixel" bitmap font (base64 woff, `--px`) for headings/numbers/eyebrows/nav, square notched cards (`clip-path`), 2 px borders with inset bevels (`--bev/--bevd`), bevelled buttons (`--hi/--deep`), hero card with 6 px block shadow, SVG bottom tabs. Themes: pith (cream) light, peel (ink) dark. Atkinson body, JetBrains mono. One stylesheet, every old class restyled.
- **The Round** (Today hero): one composed ~30-min session: due reviews (≤8) → concept of the day (web node) → 2 tree problems → 3 estimates → 8 mixed Qs → one Rounds scenario → teach-back. Round bar at the bottom with skip/stop; legs complete via `roundLegDone()` hooks in each module; +40 XP and streak on finish; `st.lastRound`.
- **Concept web** (`#web`): 55 nodes, 70 labelled edges, force layout, topic colours, mastery dots, tap → links + drill/lesson/teach-back. `conceptOfDay()`.
- **Rounds** (`#rounds`, `ROUNDS`): 6 present-day branching scenarios in the user's settings (OH screening day, ER D-dimer, FM statin talk, resin rash cluster, journal club, MERS triage). Wrong turns detour then rejoin; `st.rounds[id] = wrong turns`.
- **Teach it back** (`TEACH`, 10 prompts keyed to web nodes): write ≥20 chars, self-grade against a rubric; own spacing `st.teach[c] {box,due}`.
- **Estimate** (`#estimate`): slider guess for PPV / NNT / post-test / prevalence, then reveal with working; feeds `st.recent`.
- **Error autopsy**: after a miss, one tap (misread / slip / concept / mix-up) → `st.why`, `st.whyKey`; Progress shows the breakdown with advice.
- **Boss fights**: per Path unit, 12 Q in 8 min, ≥10/12 → badge `st.badges[topic]` (+120 XP first time); badge tiles on Progress.
- **Drive/Citrus simpler**: Today card has one-tap Connect; Settings is a status card (Connected · email) with Sync/Sign out, plumbing under "Advanced"; GIS preloaded at boot; clear errors for popup blocked / origin mismatch / wrong ID.
- Tests: `flow6.js` runs a full Round end-to-end and a boss fight; `hubtest.js` two-device Drive; `stub4.js` regression; screenshots at 400/1200 in both themes, no horizontal scroll.
- Not yet: baked-in default client ID (user to supply the shared Citrus web ID); hold menus on web nodes; Yuzu export.


## 6.1.0 (05/11/2026, artifact version 10, repo f5c0c5f) — beta test + houseclean
Beta harness in scratchpad `beta/` (Playwright, localhost so Google paths run against a fake Drive):
- `sweep.js`: 40 screens × 390 light/dark, 768 dark, 1280 light → page/console errors, horizontal scroll, off-screen elements, clipped text, unlabeled controls, touch targets < 32 px; then a monkey pass clicking every control (359 clicks).
- `audit.js`: content integrity (every pool item regenerated; options unique, answer index valid, explanation present, no NaN/undefined; duplicate prompts across pools; 12 generators × 800 runs; Rounds graph reachability/dead ends/feedback; web edges/orphans; teach concepts; 30 plan days; GEN specs; leftover old name; duplicate ids); every lesson, case, every branch of every Round, all quiz modes incl. timed 40-Q mock, topic + boss per topic, review/retry/empty deck, tree, estimate, teach, flash, lab sliders at extremes, test-picker leaves, plan days, two full Round sessions; state robustness (corrupt JSON, null/garbage fields, legacy clementine.v1, storage that throws, keys from removed questions).
- `pwatest2.js`: service worker control, offline load, update banner, cache swap.
Fixed: impossible distractors (uniq fallback added whole numbers to fractions → "204%"); `sanitize()` on load / Drive pull / take / paste (malformed `recent` crashed Practice/Progress/Plan); `keyValid()` filters stale srs/miss keys; `.pl-text` was a flex column so inline <b> broke lines; blueprint ratings ✗ ~ ✓ (were S O S); 36 px targets for `.seg`/`.presets`/brand; Round bar padding; web centred on phones; SMR edges; estimate NNT slider max fits answer; select styling. Removed dead code (`renderHome`, `todaysMinutes`, `DRAW.mastery_redirect`, `bySess`, `.tint`, `.tch-dot`); kit's explainer renamed `hintText` (was shadowing `hintFor`).
PWA: navigation network-first with offline fallback; update-on-tap bar ("New version ready · Update" → skipWaiting → reload), checks on foreground.


## 7.0.0 (05/11/2026) — multi-tester review + rebuild
Panel (agents, reports in scratchpad `review/out/`): pedagogy (20 ranked fixes), UX/IA (23 issues), accuracy + Step coverage (63 rows: 5 wrong, 14 ambiguous, 28 imprecise, 16 style; 15 top gaps), literature-reading, two 70-item question writers, 10 synthetic journal papers, 89-term glossary, 22 misconception probes, web additions, teach-back prompts; then a second-pass verifier on the new content (`verify7.md`: 28 issues incl. 2 wrong — IMR distractor, KM median — all fixed). Artifact version 11; repo cda20a3 (remote renamed Kumquat-Evidence/Kumquat).
- **Tabs**: Today · Study · Drill · Toolkit · Me; search + settings gear in the header; focus mode hides tabs in players/rounds on phones.
- **Today**: one daily object (Round). Budget in Settings (15/25/40/60 min) trims low-priority legs; one of concept/teach/estimate rotates in daily. Beginner first Round = Lesson 1 + 2 trees + 5 Qs + teach. Legs: review (confident misses first), lesson (plan-aware, one per day), concept, tree ×2 and estimate ×3 (auto-advance counters), drill (plan topic), paper (alternate days) or clinic call, teach. Pause / Next leg bar; completion summary card; welcome card under the hero on first run.
- **Study**: Path collapsed by unit (new order Math → Measuring → Dx → Designs → Risk → Inference → Bias → Tests → Appraisal → Trials; `st.lessons` migrated via `st.lord=7` in `sanitize`), Casebook, Clinic calls (renamed Rounds), Read the paper (10 papers: read → expert walk-through → questions), Concept web (mini 1-hop view on phones).
- **Toolkit**: one search over formulas, glossary, concepts, biases, designs, tests, twins, lessons, papers, tools; Paper decoder (paste any abstract: ratios+CI, differences, p, paired %, ARR/NNT, I², AUC, sens/spec→LR, NNT/NNH, subgroup warning; glossary links); appraisal jump bar.
- **Drill**: review first, quick / deeper (Myth-busters mode) / exam shelves, topic chips with accuracy; calculations ask you to type the number first (+4 XP; options on request); sticky Next before the autopsy chips; hold tip once; "⋯" on holdable cards.
- **Me**: 14-day strip, traps, 3 weakest topics (+ all), mocks, mastery criteria folded, calibration.
- **Content**: all accuracy fixes (screening-day round rewritten around PPV vs specificity and verification bias; NI sign convention; 46% multiplicity; WHI nominal vs adjusted CI; Semmelweis dates; HERS; PERC; etc.); bias distractors never the parent category; RTM / reverse causation → "Other threats". New lesson steps: SMR + direct standardisation + mortality definitions, LR from the tree, ROC/AUC, test/treatment thresholds, CER/EER + NNT time frame, rare-in-source, censoring, vaccine efficacy, "on average", ecological fallacy, chance→bias→confounding→reverse causation ladder, exam bias names, confounder/mediator/collider (new `third` viz), overdiagnosis/NNS, regression to the mean, Inference rebuilt concrete-first (SE → CI → p → p-vs-PPV tree → errors → power → multiplicity), correlation moved to Tests + regression output, RAMMbo text, efficacy vs effectiveness moved to Appraisal, abstract/drug-ad method, thinking errors, error disclosure, Donabedian + run/control charts, Helsinki/Nuremberg/assent/DSMB. Myth check opens 7 lessons; a "What if…" counterfactual closes every case; 10 new bestiary entries incl. 7 thinking errors; 140 + 29 new bank items, 22 myth probes, 9 figure-reading items (KM, forest, ROC, epi curves, funnel); vault synonyms + 11 rows; teach-back model explanations; "Your clinic's numbers" panel in the 2×2 Lab.
- Plan: days 5↔6 and 8–9↔10–11 swapped for the new order, day-14 mock moved to day 15, weakest topics labelled "(computed today)".
- Tests: `beta/v7test.js` (both Round types end-to-end, toolkit search, all 10 papers, decoder, myths, figures, type-first, migration, budget, layout ×4) + `audit.js`, `sweep.js`, `hubtest.js`, `pwatest2.js`.

## 8.0.0 (12/11/2026, artifact version 12, repo a11a163)
Built the items left over from the 7.0.0 panel plus one-tap Google. Code in scratchpad `v8.js` (injected before the TOOLKIT block) + patches `v10g.py` (Google), `v10p.py` (method step), `v10i.py` (wiring).
- **Google**: `DEF_CID` = shared Citrus web client built in; `gcid()` = override or default; `st.google.linked` set on first token (drives "Reconnect" wording and quiet renewal); client ID field only under Advanced. Prompt is `""` once linked.
- **Name the method** (`PT_M`, `PT_G`, `PT_RX`, `ptypeFor`, `PT_RATE=.34`): calc items in daily/topic/retry/review first ask which measure/formula the question needs (4 look-alikes from the same confusion group), table + options/typed box hidden until answered; +3 XP; `st.ptype {c,n,miss}`.
- **Fading hints** (`hintParts`, `fadeLv`, `hintShow`, `fadeNote`): per measure (hint name) level 1 full worked example (¼ XP), 2 first line done / rest blanked (½), 3 formula only (½); two right at a level → lighter; an error → fuller. `st.fade`.
- **Takeaways recall** (`#recall`, `RC`, `clozeOf`, `recallDue`): lesson `take` lines as cloze (after =/→/: else longest word), typed optional, self-tick; ≥80% → next stage at +3/+7/+21 days (≈ day 3, 10, 31 after the lesson), else tomorrow. `st.ldone[lesson]` (seeded today for lessons finished before 8.0), `st.recall[lesson]={s,due}`. Round leg when due (p7, 2 min).
- **Name the link** (`#links`, `LK`, `linkPick`): web edges, missed/unseen weighted up, distractor labels from edges sharing a node or topic. Round leg `links` n=4 (rotates with concept/teach/estimate).
- **Abstract X-ray** (`#xray`, `XR` 8 synthetic abstracts: HFNO-COPD, sleep-injury cohort, composite HFpEF, hs-troponin rule-out, solvent case-control, NI cellulitis, steroids meta-analysis, sepsis subgroup): steps design → primary result → significance → number for my patient → spin (multi, partial credit = Jaccard) → bottom line. `st.xray[id]=%`. Round: even days, once ≥5 lessons done, an unseen X-ray replaces the clinic call.
- Tests: `beta/v8test.js` (all features, perfect run on all 8 X-rays = 100%, Round legs, no h-scroll), v7test 0 fails, audit 0 flow issues, sweep monkey 0 errors, hubtest one-tap device B, pwatest2 pass. PWA sw `kumquat-b93074ca20`. Remote URL now `Kumquat-Evidence/Kumquat.git`.
- Still open: calendar-aware Round from Citrus shifts; Yuzu export of misses; blueprint tags per question; real-abstract stress test of the decoder.

## 9.0.0 brief (user's answers, 12/11/2026)
- Studies on phone (short gaps), Steam Deck at desk, Samsung tablet. Step 1 is secondary: main goal reading research like a pro.
- Vibe: mix by mood. Moods wanted: Tired 10-min light, Focused deep work, Playful arcade, Exam timed block.
- Shaky: formulas, designs + biases, stats tests + p/CI, reading real papers (all four).
- Papers to read: ER/acute trials, diagnostic accuracy, meta-analyses + guidelines.
- Real papers: both offline paste-in (decoder + X-ray steps) and Claude deep dive (no API key yet, interested).
- Formulas: derive-it drills, formula sprint, Yuzu flashcards, formula-of-the-day widget.
- Look: Arcade/Clean/Paper + text size switch. Deck: gamepad, two-column, keyboard shortcuts. Full soundscape.
- Campaign: full, time-travelling epidemiologist; strict mastery gates (85%+, spaced, can decay); decay → badge dims, 5-Q re-check.
- Hub: shift-aware Round, misses → Yuzu, richer Citrus card, cross-app ER cases.
- Bias tools: DAG builder, design picker game, bias spotter in stories, stats test chooser.
- Nothing to trim yet (hasn't used enough).

## 8.1.0 → 9.0.0 (12/11/2026; artifact v13–15; repo cf254b4, 785b5db, 7c67189)
Modules (scratchpad): `v9a.js` feel, `v9b.js` learning tools, `v9c.js` campaign + hub; patches `v11a.py`, `v11b.py`, `v11c.py`; tests `beta/v9test.js`, `v9btest.js`, `v9ctest.js` (+ v7/v8 suites, hubtest extended, sweep 53 views 0 errors). Build: `ship.py` (PWA body swap + sw hash).
- **Moods** (`MOODS`, `moodNow`, `roundPlanMood`; old planner renamed `roundPlanFocused`): Tired (≤10 min: due cards, recall, trees, concept), Focused (default planner), Playful (blitz, estimates, links, boss on weakest, trees), Exam (`startQuiz("step1")`, `Q.exam` hides hints + method step, 20 Q). `st.mood/moodDay/moodDefault`. Night/post-night from Citrus → Tired by default; day shift → 15-min cap.
- **Interfaces** device-only `localStorage kumquat.ui` {ui arcade|clean|paper, theme, size s|m|l|xl (CSS zoom), music, fx, vol}; head script applies before paint; Paper forces light, Clean defaults dark. Classes `kseg/ksegb` (`.seg` already existed!).
- **Deck**: keyboard (1–9 choices, Enter next, H hint, G guess, / search, Esc back, [ ] tabs, R round); gamepad spatial nav (A/B/Y, L1/R1, Start); `body.wide` two-column for xray/realpaper ≥1100 px.
- **SND**: WebAudio generated pads per style (focused/tired/playful/exam/history/modern), fx ok/bad/tick/up/done; music off by default; suspends when hidden. `CAMPAIGN_STYLE()` picks era music.
- **Strict mastery** (`mastNote`, `mastState`, `toolScore`): 85%+ of recent (≥30) on ≥3 distinct days (`st.tdays`), re-check gaps 7/14/30/60/120 d (`st.mast[t]={on,check,lv}` or `{lost}`); `startRecheck` = 5 Q no hints, ≥4 to keep. Fade card on Today, recheck Round leg, Citrus inbox proposal. Old 90%/30 holders grandfathered once.
- **Formulas**: formula of the day (`formulaOfDay`, Today card, status extra), Derive it (`DV` 18 items; 2×2 cell taps or tokens; OR as product), Formula sprint (`st.sprintBest`).
- **Thinking tools** (Study → Think like an epidemiologist): `#dag` (12 stories + sandbox, roles table `DAG_ROLE`), `#design` (12 scenarios, `DSG_NOTE` per design), `#spotter` (12 stories, `BS_NAMES` — note `BIASES` already existed), `#tchoose` (tree `TC`, 12 scenarios; view `tests` was already taken by the old Test picker). One rotating tool leg a day in Focused.
- **Read a real paper** (`#realpaper`, `RPS`, `st.myPapers` ≤40): decoder numbers, design guess, spin regex flags, NNT calc, six steps, save; Claude walk-through via device-only key `kumquat.claude` (`rpAsk`, model claude-sonnet-5-5, direct-browser header; HTML sanitised). May be blocked inside the claude.ai artifact; works on the phone copy.
- **Campaign** (`CAMP` 11 jumps; `#campaign`; `st.camp[id]={done,score}`): order Semmelweis 1847, Snow 1854, Tuskegee 1932, Strepto 1948, Doll&Hill 1950, Thalidomide 1961, Legionnaires 1976, HRT 2002, MERS 2014, RECOVERY 2020, Present 2026 (finale = save one real paper). Gates: previous jump + topic 85%/20 (jumps 2–5) or mastered (6–11). Case end → `campCaseFinished` returns to the Machine → debrief 6 Q no hints, 5 to pass → collectible.
- **Hub**: plan.json read from `hub/citrus/` (then `hub/scheduler/`) → `st.citrusDays`; `hubV2()` adds contract 2 fields (metrics, progress, inbox, actions) + extra.formulaOfDay/mood/shift/fading/campaign; deep links `?from=citrus&do=round|review|realpaper|campaign|recheck-<topic>|<view>` + ← Citrus chip. Yuzu packs to `My Apps/Yuzu/collection/inbox/`: `kumquat-misses-<isoweek>.json` (mcq, ids `kq-<key>`, skips svg/table items) and `kumquat-formulas.json` (basic); auto weekly toggle `st.yuzuAuto`.
- New clinic calls (`xapp:true`): er-trop, oh-drugscreen, fm-aspirin (illustrative figures).
- Bugs fixed on the way: method-step buttons rebinding Name-the-link options (selector scoped to `#q-pt`); hubtest now uses `#google-root .adv`; preview.html must be refreshed before hubtest.
- Not verified on real devices: gamepad on the Deck, music on phones, Claude call from the PWA origin.

## 10.0.0 (12/11/2026, artifact v16, repo 5f6e079): Dar al-Mizan
World bible: project doc `claude/kumquat-world.md`. Code `v10.js` + patch `v12.py`; test `beta/v10test.js` (v9ctest updated for the prologue at CAMP index 0).
- **Guild interface** `data-ui="guild"` = default (one-time device migration `kumquat.ui.v10`); parchment/candlelit tokens incl. `--gold`, `--fogc`; Cormorant Garamond + Amiri from Google Fonts for headings only (fall back to Georgia offline).
- **Shaykh** (`SHAYKH` line bank, `shaykhLine`, `shaykhSay` pop at top, `renderShaykh` card above the Round hero): greeting by time/away/shift/streak/fading; rank + next step under it. Fictional voice, no religion/origin/family jokes.
- **Dajij**: fog = body background gradients scaled by `--fog` (`dajijLevel`: days away, recent accuracy, early eras, Round done), so it never covers content; whispers `#dajij-w` (12 lines) on some wrong answers. Switches: Settings → Look and sound → Story & the Shaykh / Dajij fog & whispers (`uiGet().world`, `.noise`).
- **Ranks** `RANKS` Murid → Talib (oath) → Katib (2+2) → Mizani (5+5) → Hakim (8+8) → Shaykh al-Mizan (all); `rankCheck` celebrates promotions; `st.rank`.
- **Sealed omen** (`renderOmen`, `st.omen[day]`): one non-figure question from a weak topic, +15 XP, misses go to review.
- **Prologue** `CAMP[0]` id `oath` (c. 1025, Hamadan): 7 paraphrased Canon rules → modern concept (`OATH`, `renderOath`), 6/7 to pass; gates Semmelweis.
- **Duels**: avatars per jump (`AVATARS`), intro card + `duelBanner()` atop the quiz (HP pips); win/lose Shaykh lines.
- **Archive** `#lore` (`LORE` 10 folios, unlock by progress; bestiary of avatars; "What is real" entry).
- **Era sound**: `eraStyle(yr)` → oud (<1300, oud plucks + ney vibrato over a D drone), victorian (<1900), radio (<1990), modern; guild hall uses oud for the Focused mood.

## Source moved to GitHub (13/11/2026)
- Repo Kumquat-Evidence/Kumquat now holds everything: `src/kumquat.html` (source of truth, = the claude.ai artifact page), `src/pwa-head.html` + `src/pwa-tail.html` + `src/sw.template.js`, built `index.html` + `sw.js` (`node tools/build.js`; `--check` fails on stale), `tests/` (v7–v10, audit, hubtest, pwatest, sweep; `node tests/run.js [quick]`), `docs/` (notes, world bible, review reports).
- **Future chats: clone the repo, edit `src/kumquat.html`, `node tools/build.js`, `node tests/run.js quick`, commit src + build together, publish the artifact from `src/kumquat.html`.** The old scratchpad patch scripts are history only.
- CI `.github/workflows/tests.yml`: every push/PR → build check + all suites (~15 min on Actions), screenshots uploaded on failure. Deploy job publishes to Pages only after green tests, and only when Settings → Pages → Source = "GitHub Actions" (otherwise Pages keeps deploying `main` directly and the job leaves a notice).
- `gh run list/view -R Kumquat-Evidence/Kumquat` works through the session proxy (the Pages API path does not).

## 11.0.0 (16/11/2026): ten-tester review, twenty developer packages
- **Review.** 10 testers (`docs/review`-style briefs, reports t1–t10, ~300 findings, area scores 5–7.5) → 20 packages d01–d20. Each package lives in its own `/* ===== v11 dNN: … ===== */` block (JS before TOOLKIT, CSS before `v10 guild`).
- **Packages:** d01 Round engine (persist + resume, honest credit, end round, budget fit) · d02 Today, first run, moods · d03 one progression story (rank card/pill, adaptive mastery month, learning health) · d04 Deck/desktop layout, resume bar, shortcut help, double-tap guard · d05 quiz engine (confidence step "How sure are you?", NBME-style mock/exam blocks: `blockInit/blockPick/blockMove/blockReview/blockSubmit`) · d06 myth/pool length cue + errors · d07 generators, Name the method `pid`, NNT up/NNH down, sprint rows, Derive herd · d08 lessons 1–5 (ROC, KM, ladder, typed + estimate steps with "Show the options instead") · d09 lessons 6–10 diagrams · d10 web, links, teach-back, myths, recall · d11 decoder groups + real-paper tools (`tests/decoder.test.js`) · d12 papers: figures from each paper's numbers (`PAPERS[].figs`, 4 papers so far), predict-first walk-through (`#v11-skip` "Just show me"), XR spin keys (`tests/reading.test.js`) · d13 read like a reviewer (guideline appraisal, Methods, risk of bias, landmark shelf) · d14 labs · d15 thinking tools + clinic calls (shuffled options) · d16 campaign arc + duels (`campFire`, `duelStart`, duel items `Q.camp&&Q.items`) · d17 history and world text (Hamadan c. 1020, era music `CAMPAIGN_STYLE`, `STY.c19`, Shaykh bank, quiet Tuskegee) · d18 sync merge, backups, restore points, strict mastery (`mastGrace`: past gap + grace → expired, not fading forever) · d19 review load, catch-up (`V11_CATCHUP`), drill coverage, hub minutes, Yuzu packs · d20 tokens, type scale, contrast, focus, per-look fixes.
- **How it shipped.** All 20 agents hit the usage limit near the end; their working copies were saved as patches, merged in order with a 3-way merge (union for same-point inserts, character-level merge for shared long lines, 4 hunks resolved by hand), smoke-tested after each patch, then the full suite. Unfinished bits: d12's fifth figure; some dev reports missing (d01–d06, d08–d11, d13–d16, d18, d20).
- **Merge fixes worth remembering.** (1) Two packages both used `Q.items` (d05 blocks, d16 duels) → scoped duel path to `Q.camp`. (2) A regex `[₀-₉]` broke the page when served without a charset → use `₀-₉` escapes for non-ASCII ranges. (3) The double-tap guard (d04) now blocks only same-spot taps within 300/350 ms, and skips `navigator.webdriver` unless `window.KQ_GUARD=1`. (4) Sanitize key list must stay ONE line; merges duplicate it.
- **Tests updated for deliberate changes:** v8 answers the confidence prompt; v7 driver taps "Show the options instead" and "Just show me"; audit drives exam blocks; v9b recheck uses a date inside the fading window; hubtest closes a leftover hold sheet.

## 11.1.0 (17/11/2026): Drive folders by tag (claude/drive-layout.md)
- `byTag(id)`: folder with `appProperties.citrusApp=<id>`, oldest by createdTime, cached in `G.ids["tag:<id>"]`, checked once per session (`TAG_CHECKED`).
- `hubFolder()` uses the `kumquat` tag; no tag → old `My Apps/hub/kumquat`, then `tagFolder()` tags it. Kumquat never renames or moves its folder; Citrus does.
- `readCitrusDays` reads plan.json from the `citrus` tag first (old hub/citrus, hub/scheduler as fallback). `yuzuInbox` uses `yuzu-data` (old My Apps/Yuzu as fallback).
- `Kumquat.status.json` in the old "Citrus Maxima/Apps" is written only while that folder exists (never re-created once Citrus archives it).
- status.json carries `drive:{byTag:true}`, so Citrus can move Kumquat's folder to `Citrus/Learning/Science/Biostatistics - Kumquat`.
- hubtest: the fake Drive answers tag queries and metadata PATCH; a moved-folder scenario checks status, state, plan and Yuzu follow the tags and nothing is created by path.
