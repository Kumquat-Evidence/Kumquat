# Kumquat 6.1.0 — UX / design beta test

Tested in Chromium (Playwright) at 390×844 (touch) and 1280×900, light and dark. Three personas:
(1) a first-run GP with 25 min/day on a phone, (2) a Day-10 Mastery-month user (state built by playing 10 daily drills, then setting `plan.start = today−9`, streak 9, lessons 1–4, 3 cases, 3 Rounds, 56 cards due), (3) a doctor reading a paper tonight.

Scripts: `/tmp/claude-0/-home-claude/329054d1-f31a-5d3b-92ec-70df291dece5/scratchpad/review/ux/*.js` (shots.js, round.js, day10.js, probe1–7.js, contrast.js).
Screenshots: `/tmp/claude-0/-home-claude/329054d1-f31a-5d3b-92ec-70df291dece5/scratchpad/review/ux/shots/` (names below are relative to this folder).
Note: Google Fonts were stubbed by the harness, so Atkinson Hyperlegible rendered as the system fallback. The pixel font ("Orange Pixel") is embedded and rendered as it would in real use.

The good parts: the visual identity is strong and consistent. Lesson and case players (`lesson-1-390x844-light.png`, `case-snow-390x844-light.png`) are the best screens in the app. Answer feedback is clear (red/green, an explanation, then "Added to your review deck"). The 2×2 Lab on desktop (`dx-1280x900-dark.png`) is excellent. Dark theme contrast is good throughout.

---

## (a) Ranked issues

### 1. MAJOR (data bug visible to users): "[object Object]" in Most-missed items
- **Screen:** Progress › Your traps. **Shot:** `d10-traps.png`, `d10-progress-390x844-light.png`
- **Saw:** 2 of the 5 trap rows say `[object Object]`. These are the generated-question keys `g:genRROR` and `g:genHerd`. The vignette rows also run the label into the stem with no separator ("Step 1 vignette Of 100 wedding guests…").
- **Why:** The most personal screen in the app shows broken text. It looks unfinished and you can't tell what you got wrong.
- **Fix:** In `renderTraps()`, resolve the prompt for `g:` keys the same way the quiz does (call the generator, or store `prompt` in `st.miss` when the miss happens: `st.miss[k]={n, p:q.prompt.slice(0,120)}`). Fall back to the generator's topic name, e.g. "Risk calc (RR/OR)". Never fall back to `String(obj)`. For vignettes, render the label as a chip: `<span class="tag">Step 1</span> ` + stem.

### 2. MAJOR: Two daily plans compete on Today (Round vs Mastery-month missions) and the review count appears twice
- **Screen:** Today on Day 10. **Shot:** `d10-home-390x844-light.png`, `d10-home-1280x900-dark.png`
- **Saw:** Three things stack on Day 10. First, "Today's round: 7 legs, about 30 minutes", whose first leg is "Clear 8 due cards". Below it, a separate banner says "56 cards due for review · Review now". Below that, "Mastery month · Day 10 · 4 missions left today" (Lesson 7, Power lab, CI lab, Inference drill), each with its own Open/Start button. The Round's "Eight mixed questions" and the missions' "Drill: Inference & power · 10 Q" are two different drills for the same day. The plan page says "45–90 minutes a day" (`plan-390x844-light.png`). The Round says 30.
- **Why:** A 25-minute user can't tell which plan counts as "done for today". 30 + 45–90 minutes is not a plan they can keep, and the 56-card banner is discouraging.
- **Fix:** One daily object. When `st.plan` is set, `roundPlan()` should build its legs from the day's missions: review (capped at 8) → mission lesson/lab → mission drill → Round scenario → teach-back. Hide `#upnext`'s mission list behind a "See all Day 10 missions" link. Remove `#due-banner` from Today whenever the Round contains a review leg. Instead, show "+48 more due" as small text on the review leg (`.hero-legs li small`). Change the plan copy to "About 30 minutes a day (one Round). Extra missions are optional." Add a time-budget setting in Settings: `<select id="set-budget"><option>15</option><option selected>25</option><option>45</option><option>90</option></select> minutes a day`. Use it to size the Round, e.g. 25 min → drop the estimate leg.

### 3. MAJOR: Tree and Estimate legs of the Round have no "Next leg" and no completion. The only way forward is "Skip leg"
- **Screen:** Round legs 2 and 3. **Shot:** `r-2-tree-full-light.png`, `r-3-est-full-light.png`
- **Saw:** The leg says "Two tree problems" or "Three estimates". The tree/estimate screens never count toward that number, and they show no Next-leg button. Only the concept (web), drill, scenario and teach legs call `roundLegDone()`. To continue, the user must press **Skip leg**, which reads as giving up. The completion card then said "0 minutes · +40 XP" (`r-7-done-light.png`).
- **Why:** The core daily loop breaks on legs 2 and 3 of the very first session.
- **Fix:** Give each leg a target, e.g. `{t:"tree",n:2}` and `{t:"estimate",n:3}`. In the tree "correct/finished scenario" handler and in the estimate "Lock it in" handler, add `if(ROUND&&ROUND.legs[ROUND.i].t==="tree"&&++ROUND.cnt>=ROUND.legs[ROUND.i].n)roundLegDone()`. Until the target is reached, show `roundNextBtn()` under the result as "Next leg →" so the user can leave early. Rename the round-bar button from "Skip leg" to "Skip" and give it secondary styling (`#rb-skip{background:transparent;color:var(--bg);border-color:#fff4}`).

### 4. MAJOR: Labs on a phone put every slider above the fold and the chart below it
- **Screen:** all labs at 390 px. **Shot:** `dx-390x844-light.png`, `confound-390x844-light.png`, `power-390x844-light.png`
- **Saw:** The first chart or canvas starts at y=922 (2×2), 762 (cut-off), 740 (Fagan), 935 (Risk), 678 (Power), 836 (CI), 809 (Outbreak), 955 (Confounding). The usable viewport is about 780 px above the tab bar. You drag a slider and nothing visible changes. The lab's whole promise ("Move it, watch what changes") fails on a phone.
- **Fix:** In `@media (max-width:820px)`, put the visual first and make it sticky:
  ```css
  @media (max-width:820px){
    .lab{display:flex;flex-direction:column}
    .lab>.ctrls{order:2}
    .lab>:not(.ctrls):first-of-type{order:1;position:sticky;top:56px;z-index:2;background:var(--bg)}
    .lab canvas,.lab svg{max-height:38vh}
    .view-head p{display:none}          /* or collapse to one line inside labs */
  }
  ```
  Also shrink the preset chips row ("Workplace screening / GP clinic / ER, suspected") into one horizontally scrolling row: `.presets{flex-wrap:nowrap;overflow-x:auto}`.

### 5. MAJOR: After answering a question on a phone, "Next question" is hidden under the tab bar
- **Screen:** any quiz. **Shot:** `quiz-after-answer.png`, `r-4-drill-ans-light.png`
- **Saw:** After `answer()`, the "Next question →" button sits at y=800 (tab bar starts at 781). The four "Why?" chips sit between the feedback and Next. You have to scroll on every single question.
- **Fix:** Put Next directly under the feedback box and the "Why?" chips under Next. Then pin the Next row:
  `.qnext{position:sticky;bottom:calc(70px + env(safe-area-inset-bottom));z-index:5;background:var(--bg);padding:8px 0}`. In a Round, use `bottom:calc(84px + …)` (round bar height). Also call `$('.qfb').scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'})` after answering. Use the full width for the button: `.qnext .btn{width:100%;min-height:52px}`.

### 6. MAJOR: The "Concept of the day" leg opens on a 55-node web you can't read; the actual concept is below the fold
- **Screen:** Round leg 1 and #web on a phone. **Shot:** `r-1-concept-light.png`, `r-1-concept-full-light.png`, `web-390x844-dark.png`
- **Saw:** `.web-svg{min-width:720px}` inside a 354 px scroller renders labels at about 7 px. Labels overlap ("Forest plot" over "Allocation concealment", "Log scale" over "gives"). Nodes are clipped at both edges ("Incide…", "se-control") and nothing tells you it pans. The concept card ("Cohort — Exposure first, follow forward. Gives incidence, RR.") starts at y≈850, under the round bar. The first thing a new user sees in their first session is the hardest screen in the app.
- **Fix:** (a) In a Round, or whenever `WEBSEL` is set on narrow screens, render the concept card *first* and the web below it. Show only the selected node's 1-hop neighbourhood, laid out radially at full size (`.web-svg{min-width:0}` with a filtered node set). Add "Show whole web" as a link. (b) For the full web on a phone, start with the selected node scrolled to centre: `wrap.scrollLeft = nodeX*scale - wrap.clientWidth/2`. Add pinch-zoom (CSS `touch-action:pan-x pan-y pinch-zoom`) and a visible hint "Drag to pan · tap a node" in `.web-wrap::after`. (c) Turn the 1-sentence concept into a 2-minute micro-lesson: definition, one worked example and one check question. That earns the "2 min" label.

### 7. MAJOR: "Round" means three different things
- **Screen:** Today hero, Learn › Rounds, round bar. **Shot:** `home-390x844-light.png`, `learn-390x844-light.png`, `r-5-round-full-light.png`
- **Saw:** "Today's round" (the 7-leg session) contains a leg called "Round: The screening day" (a branching clinic scenario from Learn › "Rounds"). While you play it, the bar says "Round · leg 5/6" over "Round: The screening day". The scenario also has its own "Exit" next to the round bar's "✕".
- **Why:** A first-time user can't build a mental model. "Do I tap Rounds in Learn to do my daily round?"
- **Fix:** Keep "Round" for the daily session. Rename the scenarios to **"Clinic calls"**. Change Learn tile `Rounds` → `Clinic calls`, `#rounds` view-head eyebrow `LEARN · SCENARIOS` → `LEARN · CLINIC CALLS`, and the leg label `"Round: "+rd.title` → `"Clinic call: "+rd.title`. In the scenario player, hide `Exit` when `ROUND` is set (the bar already has ✕).

### 8. MAJOR: No first-run orientation; the first screen offers 9 different starting points
- **Screen:** Today, first launch. **Shot:** `home-390x844-light.png`, `home-1280x900-light.png`
- **Saw:** In order, a new user sees: a level pill ("Medical student"), the Round hero, "Up next: Lesson 1" (with *Start lesson* and *Start the 30-day plan*), four quick tiles, a Hook, "Citrus & Drive: Not connected", "Weak spot: Diagnostic tests — No answers yet", and a "Five minutes?" tip. Nothing explains what a Round is, why there are legs, or whether to do Lesson 1 or the Round first. The Round never includes the Path, so a beginner's first Round tests concepts they haven't been taught yet.
- **Fix:** Add a one-time intro card shown when `!st.log.length && !st.roundsDone` (render in place of `#upnext`):
  > **Welcome. Here's how Kumquat works.**
  > **1. One Round a day (~25 min).** It mixes review, a short concept, problems and a clinic case. Start it and follow the bar at the bottom.
  > **2. Learn when you want depth.** Ten lessons, ten history cases.
  > **3. Hold anything for an explanation.**
  > [Start my first Round] [Take Lesson 1 first]

  On day 1, make the first Round "Lesson 1 (8 min) → 2 tree problems → 5 questions → teach-back" instead of Concept web + 8 mixed questions. Hide the "Weak spot" card until `topics[t].n>=10`, and hide "Citrus & Drive" until day 2 (or move it to Settings only). Drop the level title "Medical student" for this user, who is a qualified GP. Use neutral levels ("Level 1 · Novice → Fluent → Sharp → Expert") or a numeric level only.

### 9. MAJOR: Hold-to-explain is invisible
- **Screen:** everywhere. **Evidence:** a grep of the UI copy finds no mention of "hold", "long-press" or "press" anywhere. Only 2 `data-hint` attributes exist. On desktop the gesture is a 460 ms mouse hold, which no desktop user tries.
- **Why:** You built a whole explanation layer and the context menus (`.mast`, `.task`, `.trap`, `.casecard`, `.vrow`: Drill / Open lesson / Copy formula / Mark solved), and nobody will find them.
- **Fix:** (1) Teach it once: the first time any quiz feedback renders, show a toast "Tip: press and hold any term, chip or card for an explanation." Store `st.seen.holdTip=1`. (2) Give holdable items a visible affordance: `.mast,.task,.trap,.casecard,.vrow{position:relative}` and `…::after{content:"⋯";position:absolute;top:6px;right:8px;color:var(--muted);font-family:var(--px);font-size:12px}`. Tapping that "⋯" should open the same `sheet()`, so it doubles as a tap target. (3) On pointer devices, show the hint on hover: `@media (hover:hover){ add mouseenter → showBubble after 600ms }`, and set `title` attributes from `HINTS`. (4) Add a line to the Progress "How Kumquat teaches" block: "Hold anything to explain it."

### 10. MAJOR: Orange text in light mode fails contrast, and it's used on the smallest text
- **Screen:** all, light theme. **Measured:** `--accent #F26A1B` on `--bg #F3EBDD` = **2.59:1**, on `--surface` = 2.84:1 (AA needs 4.5:1). It is used for every `.eyebrow` (10 px pixel font), the round-leg numbers ("01"), "Open →" links, `.casecard` location eyebrows ("OH CLINIC, QIDDIYA") and the "Situation"/"Your role" labels (9 px). Dark mode is fine (7.09:1).
- **Fix:** In the light theme, use the existing darker token for text-sized orange:
  `.eyebrow,.hero-legs .n,.pathcta .num,.casecard .eyebrow,a.more{color:var(--accent-ink)}` (`#B9480A`, about 4.6:1 on `--bg`). Keep `--accent` for fills, borders and big numerals (≥24 px).

### 11. MAJOR: Persona 3 (a paper tonight) has no search and no glossary; the vault search misses common terms
- **Screen:** Learn › Formula vault, Appraisal kit. **Shot:** `vault-390x844-light.png`, `appraise-390x844-dark.png`
- **Saw:** No global search exists. In the vault, `p value`, `p-value`, `I²`/`I2`, `heterogeneity`, `forest`, `likelihood`, `number needed`, `Kaplan`, `kappa` all return **0 rows**, with no empty-state message. Meanwhile `SE` (the placeholder's own suggestion) returns 28 rows and `p ` returns 41, because the search is a plain substring match. In the Appraisal kit, the **Forest plot reader starts at y=1646**, below a 13-row RCT checklist. PICO is at 2164, GRADE at 2814. On Learn, the reference tools are the last 6 of 11 identical tiles, and there's no "reference" header visible in the first screen.
- **Fix:**
  - Add a search field in the header (`.top-in`, an icon button on phone that opens a sheet). It should search vault rows, concept-web nodes (each already has a one-line definition, so that's a ready-made glossary), bias bestiary, twins, designs and tests. Results link to the item.
  - Vault: add synonyms per row (`syn:"p-value p value significance alpha"`, `"I2 I² heterogeneity forest"`, `"NNT number needed to treat"`, `"LR likelihood ratio"`). For queries ≤2 chars, match on word start (`\bSE\b`). Rank title matches first. Add the empty state "No formula for ‘kappa’. Try the concept web →". Add missing rows: p value, I², NNH, kappa, Kaplan–Meier/log-rank, Cox/HR interpretation.
  - Appraisal kit: put a 4-button jump bar at the top: `[Checklist] [Forest plot] [PICO] [GRADE]` (`.jump{position:sticky;top:56px}`). Or make each a tab, as the design selector already is. Open the **Forest plot reader** first when arriving from Learn's "Read a paper" entry (see IA).

### 12. MAJOR: The same activities appear in three tabs; Practice is a flat list of 13 identical boxes
- **Screens:** Today, Learn, Labs, Practice, Progress. **Shots:** `practice-390x844-light.png`, `labs-390x844-light.png`, `learn-390x844-light.png`, `progress-390x844-light.png`
- **Saw:** Tree drill appears on Today (quick tile), Labs (Diagnosis) and Practice. Concept web is on Today and Learn. Blitz is on Today twice (quick tile and the "Five minutes?" tip). The per-topic mastery list (10 rows) appears in **both** Practice ("Drill one topic") and Progress (Overall mastery), with different captions ("New, needs reps · last 0" vs "30 more answers needed"). On Practice, 13 modes are plain text boxes with no icon or grouping, unlike the iconed tiles on Learn and Labs. With 56 cards due, the "Review deck" box looks exactly like the others (`d10-practice-390x844-dark.png`).
- **Fix:** See the IA proposal in (b). At minimum: group Practice into **Quick (≤5 min)**, **Daily**, **Exam blocks**, with headers `<h2 class="shelf">`. Give `.mode[data-start=review]` an accent state when due>0: `.mode.due{border-color:var(--accent);background:var(--accent-tint)}` plus a count badge. Remove the topic list from Practice and make the Progress rows tappable (already `.mast[data-start]`).

### 13. MINOR: Card titles are visually smaller than their descriptions (inverted hierarchy)
- **Screens:** Learn list, Labs list, Practice modes, Rounds. **Shots:** `learn-390x844-light.png`, `rounds-390x844-light.png`
- **Saw:** Titles use the pixel font at 12–14 px (`.tile b` 12px, `.mode b` 12px, `.casecard h3` 14px). The pixel face has a small x-height, so they read like 9–10 px. The descriptions below are 16 px Atkinson. Your eye lands on the description, not the name.
- **Fix:** `.tile b,.mode b{font-size:15px;line-height:1.3}` and `.casecard h3{font-size:17px}`. Alternatively, switch these titles to `font-family:var(--f-body);font-weight:700;font-size:1rem` and keep the pixel font for eyebrows, numerals and h1/h2 only.

### 14. MINOR: Pixel font at 9–10 px is too small for tab labels and meta labels
- **Measured:** tab labels 9 px (`.tabs a` in mobile query), eyebrows 10 px, `.tag` topic chips about 8–9 px, "Situation"/"Your role"/"Validity" labels 9 px, "WHY? (ONE TAP, IT SHARPENS YOUR TRAPS)" 10 px uppercase. Inactive tab labels are `--muted` 4.57:1 on `--bg`, which is right at the limit.
- **Fix:** Use 12px as the minimum for the pixel font: `.tabs a{font-size:11px}` on mobile with `letter-spacing:.02em`, `.eyebrow{font-size:11px}`, `.tag{font-size:11px;padding:3px 6px}`. Drop `text-transform:uppercase` on eyebrows longer than 3 words (the "WHY?" line → sentence case, body font: "Why did you miss it? One tap.").

### 15. MINOR: The toast covers the round bar
- **Shot:** `r-2-tree-full-light.png`, `r-3-est-full-light.png`, `r-4-drill-ans-light.png`
- **Saw:** "Leg done. Next: Two tree problems" (`#toast`, z-index 20) sits on top of the round bar (z-index 12). It hides the leg name and the Skip button for about 2 s on every leg change.
- **Fix:** `body.in-round #toast{bottom:auto;top:calc(64px + env(safe-area-inset-top,0px));transform:translateX(-50%) translateY(-300%)}` and `body.in-round #toast.on{transform:translateX(-50%) translateY(0)}`. Better still, drop the toast in rounds and animate the round-bar pip instead.

### 16. MINOR: The round bar covers the tab bar by accident (CSS cascade)
- **Saw:** The mobile rule `#roundbar{bottom:calc(66px…)}` (line ~67) is overridden by the later base rule `#roundbar{…bottom:0}` (line ~453). So during a Round the bar sits on top of the tabs and the tabs can't be reached. Focus mode is actually desirable, but it should be deliberate.
- **Fix:** Make it explicit: `body.in-round .tabs{display:none}`, delete the dead 66px rule, and put a "Pause" button on the round bar that jumps to Today without killing `ROUND`. Today's hero should then show "Resume round · leg 3/7".

### 17. MINOR: The Path is a 6,620 px wall
- **Screen:** Learn › The Path. **Shot:** `path-390x844-light.png`, `path-390x844-dark.png`
- **Saw:** All 10 units are fully expanded, each with 6–8 dense bullet points and 4 buttons ("Start lesson / Math gym / Drill this unit / Boss fight").
- **Fix:** Collapse units by default to a single row: number, title, status pill, progress bar. Expand only the *current* unit. Render the bullet summary inside `<details><summary>Key points</summary>`. Reduce the 4 buttons to the primary "Start lesson"/"Continue", plus a "⋯" sheet holding Gym, Drill and Boss fight.

### 18. MINOR: Progress is 3,300–3,700 px with the useful parts at the bottom
- **Shot:** `progress-390x844-light.png`, `d10-progress-390x844-light.png`
- **Saw:** The order is Mastery month → Overall % → Criteria for 100% → 10 topic bars → Mocks → Traps → Calibration → "How Kumquat teaches" essay → Settings link. The day-10 user's most actionable items (traps, calibration) are 2,000 px down. **Settings is reachable only from the very bottom of Progress.**
- **Fix:** New order: Streak/week heat-strip → Traps ("Your 5 most-missed, retry") → Topic bars (collapsed to the 3 weakest + "Show all 10") → Calibration → Mocks → Criteria for 100% (inside `<details>`) → "How Kumquat teaches" (move to an About sheet). Add a gear icon to the header (`.top-in`, beside the XP chip) that links to `#settings`.

### 19. MINOR: Mixed signals between level, XP and mastery
- **Shot:** `d10-home-390x844-light.png`, `d10-plan-390x844-light.png`
- **Saw:** On Day 10 the user is "Level 6 · Specialist" with 1850 XP and a 9-day streak, but "mastery 6%". The plan grid shows days 1–9 at 0–2/4 with no guidance on catching up. Day 10's missions are Lesson 7 although only lessons 1–4 are done.
- **Fix:** Lead with one number: mastery %. Rename levels to effort tiers ("Regular", "Committed"…), not clinical grades. On the plan, when a past day is <50% done, show a banner: "You're 3 lessons behind. Tomorrow's Round will fold Lesson 5 in. [Shift plan by 2 days]". The "Behind or ahead? Reset day numbering" button already exists, so promote it into that banner.

### 20. MINOR: Weak completion moment; the CTA after finishing invites a repeat
- **Shot:** `r-7-done-light.png`
- **Saw:** After the last leg there's a confetti burst, then Today. The hero's primary button becomes **"Another round · Concept of the day: Cohort"** (the same concept). The actual summary ("0 minutes · +40 XP … That's the day's work done") is in the `#upnext` card below the fold.
- **Fix:** Show a full-screen summary sheet: legs completed ✓, accuracy, cards cleared, streak +1, the hook of the day, "Tomorrow: 11 cards due · Lesson 5". The hero should then switch to a calm done state with the button demoted: `.hero.done .btn.primary{background:transparent;color:var(--ink);border:2px solid var(--line)}`, labelled "Bonus: 90-second blitz".

### 21. MINOR: The case/lesson player's Continue button half-hides behind the tab bar
- **Shot:** `case-snow-390x844-light.png`
- **Saw:** "Continue →" is right-aligned at the bottom of the scroll, partly under the tab bar. "Exit" is at the top, so the thumb has to cross the screen.
- **Fix:** In players (`#v-lesson,#v-case`), hide the tab bar (`body.in-player .tabs{display:none}`). Add a sticky full-width footer: `.pl-nav{position:sticky;bottom:calc(12px + env(safe-area-inset-bottom));display:flex;gap:8px}` with `[← Back] [Continue →]` at 52 px tall.

### 22. MINOR: Inconsistent button typography
- **Shot:** `home-1280x900-light.png`
- **Saw:** Primary buttons use the pixel font ("Start lesson", "Drill it · 10 Q", "Connect Google") but secondary buttons use bold body ("Start the 30-day plan", "Blitz", "Teach it back", "Clear"). Side by side in one row they look like two systems.
- **Fix:** Use one rule: all `.btn` in `var(--f-body)` 700 at 15px. Keep the pixel font for `.btn.big` hero CTAs only.

### 23. POLISH
- The Round hero subtitle repeats leg 1 ("Start today's round / Concept of the day: Cohort"). Use the time instead: "≈26 min · 6 legs". The HTML default says "Seven legs, about 30 minutes" before JS replaces it with "6 legs".
- The empty state "Weak spot: No answers yet. Ten questions will tell us." reads as a nag on day 1. Replace it with "Find your weak spot: 10 questions" or hide it.
- `#due-banner` uses the 📬 emoji, which is the only emoji-as-icon in an otherwise pixel-icon system. Use a pixel SVG.
- In dark mode on the 2×2 Lab, true-negative dots (`--null #5A5047` outline on near-black) almost disappear. Use `--muted`.
- `.tag` topic chips on Rounds cards (`rounds-390x844-light.png`) are about 8 px and not tappable. Either make them links to the topic drill or drop them.
- The Practice header copy "1-3-7-14-30 day schedule" is jargon for a new user. Use "misses come back after 1, 3, 7, 14 and 30 days."
- The tree drill's number input shows desktop spin arrows. Add `inputmode="numeric" pattern="[0-9]*"` and hide the spinners (`input[type=number]::-webkit-inner-spin-button{display:none}`).

---

## (b) Information-architecture proposal

The five tabs mix *what kind of thing* (Labs) with *what you're doing* (Learn, Practice). Labs is really a type of lesson, and the reference tools hide at the bottom of Learn. Proposed tabs (same 5 slots, clearer verbs):

| Tab (label) | Contains | Moves from |
|---|---|---|
| **Today** | Round (the single daily object, built from the plan when one is active), Resume, review count *inside* the Round, Hook of the day. Nothing else above the fold. | Today (trimmed). Mission list folds into Round. |
| **Study** | The Path (lessons, each with its lab inline), Casebook, Clinic calls (ex-"Rounds"), Concept web | Learn (top half) + Labs (labs listed under their lesson and also in an "All labs" shelf at the bottom) |
| **Drill** | Review deck (accented when due) · Quick (Blitz, Tree, Estimate, Twin, Formula flash) · Topic drills (from mastery rows) · Exam blocks (Step 1, Step 2CK/3, Marathon, Mock) · Teach it back | Practice + the topic list |
| **Toolkit** | Search field at the top. **Read a paper** (Forest plot reader → Appraisal checklist → GRADE → PICO), Formula vault, Test picker, Study designs, Bias bestiary, Twins, Blueprint | Learn (bottom half: reference) + Appraisal kit split into its parts |
| **Me** | Streak/week strip, Traps, Topic mastery, Calibration, Mocks, Mastery month calendar, Settings (gear), About/"How Kumquat teaches" | Progress + Settings |

Labels in the bottom bar: `Today · Study · Drill · Toolkit · Me`. All are one word, under 8 characters and fit at 11 px.
Persona 3 then gets: Toolkit → "Read a paper" → Forest plot reader in 2 taps. Today it takes Learn → scroll → Appraisal kit → scroll 1,600 px.

If you'd rather keep "Labs" as a tab (it's a distinctive feature), use `Today · Learn · Labs · Drill · Toolkit` and put Progress/Settings behind the header's level pill and a gear icon.

---

## (c) Ten changes that would most increase "joy to use"

1. **One daily Round that *is* the plan.** It's the right length for the user's budget, finishes with a proper summary sheet, then calms down. No second to-do list underneath (issues 2, 20).
2. **Every leg completes itself.** Tree and estimate count toward their target and roll on with a satisfying pip-fill animation on the round bar. No "Skip leg" to escape (issue 3).
3. **Labs with the picture pinned on top.** Drag a slider with your thumb and watch PPV collapse in the same screen (issue 4).
4. **A sticky, full-width "Next" after each answer.** One thumb, no scrolling, 30 questions flow (issue 5).
5. **A 2-minute "Concept of the day" card** with a mini 1-hop web and one check question, instead of the full 55-node web (issue 6).
6. **A header search / glossary** across vault, web nodes, biases, twins, designs. "What's I²?" answered in 3 seconds (issue 11).
7. **Hold-to-explain, taught once and shown by a "⋯".** Discovering that every term explains itself is a delight moment, so let people find it (issue 9).
8. **A first-run welcome card and a beginner-shaped first Round** (Lesson 1 inside it). The first 25 minutes should end with "I learned something and did the questions" (issue 8).
9. **Bigger, legible pixel type** (11 px minimum, titles 15 px+) and accessible orange in light mode. The retro style stays and stops hurting (issues 10, 13, 14).
10. **Traps that read like a personal coach.** Fix "[object Object]", show each miss with the topic chip and the "why you missed" reason, and add "Retry all 5" as a 2-minute mini-round (issue 1).
