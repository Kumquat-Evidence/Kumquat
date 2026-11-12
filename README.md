# Kumquat

Biostatistics, epidemiology and critical-appraisal trainer: a static web app (PWA) with no backend, set in the world of **Dar al-Mizan, the House of the Balance**. Live at **https://kumquat-evidence.github.io/kumquat/**. On a phone, open it and choose *Add to Home screen*.

This copy is the Google-connected one: Drive sync, Citrus and Yuzu. The claude.ai artifact copy keeps its progress on that device only.

## Repository layout
| Path | What it is |
| --- | --- |
| `src/kumquat.html` | **The app's source** (one self-contained file; also what the claude.ai artifact publishes) |
| `src/pwa-head.html`, `src/pwa-tail.html` | Phone-app shell around it: manifest, icons, service-worker registration, update bar |
| `src/sw.template.js` | Service worker; the build stamps the cache name with a content hash |
| `index.html`, `sw.js` | **Built files** served by GitHub Pages. Never edit these by hand |
| `tools/build.js` | Builds `index.html` + `sw.js` from `src/` (`--check` = fail if they're stale) |
| `tests/` | Playwright suites and the runner (`tests/run.js`) |
| `docs/notes.md` | Developer notes per version: features, state keys, functions |
| `docs/world.md` | The world bible: Dar al-Mizan, Ibn Sina, the Dajij, ranks, avatars (fiction labelled) |
| `docs/review/` | The 7.0.0 review panel's reports |

## Making a change
```bash
npm install                    # Playwright (first time)
npx playwright install chromium
# edit src/kumquat.html
node tools/build.js            # rebuild index.html + sw.js
node tests/run.js quick        # all suites except the long sweep (~4 min)
node tests/run.js              # everything (~12 min)
```
Commit `src/` and the rebuilt `index.html`/`sw.js` together. CI fails if the build is stale.

## Tests (GitHub Actions)
`.github/workflows/tests.yml` runs on every push and pull request:
1. checks that `index.html`/`sw.js` match `src/`
2. runs every suite in `tests/run.js`
3. uploads the screenshots if anything fails

| Suite | Covers |
| --- | --- |
| v7test | Daily Round end to end, Toolkit search, Read the paper, decoder, figures, layout at 3 widths × 2 themes |
| v8test | Name the method, fading hints, takeaways recall, Name the link, Abstract X-ray |
| v9test | Moods, interfaces, keyboard, gamepad, sound |
| v9btest | Strict mastery, formula tools, bias and design tools, Read a real paper |
| v9ctest | Campaign, deep links, clinic calls, Citrus status v2 |
| v10test | The guild world: look, Shaykh, omen, oath, duels, Archive |
| audit | Content integrity and every lesson, case and clinic call played to the end |
| hubtest | Google Drive, Citrus and Yuzu across two devices with a fake Drive |
| pwatest | Phone app offline start and the update bar |
| sweep | Every view on 4 screen sizes and themes, then random tapping, checking for errors and horizontal scroll |

**Publishing only green builds:** the workflow's `deploy` job publishes to GitHub Pages only after all tests pass, but only once Pages is set to *Settings → Pages → Source: GitHub Actions*. Until then Pages publishes `main` directly.

## Google, Citrus and Yuzu
- Sign-in uses the shared Citrus web client (built in). `https://kumquat-evidence.github.io` must be in its *Authorised JavaScript origins*.
- Writes `My Apps/hub/kumquat/state.json` (progress) and `status.json` (Citrus contract v2), plus the legacy `Citrus Maxima/Apps/Kumquat.status.json`.
- Reads `My Apps/hub/citrus/plan.json` for today's block and shifts.
- Sends weekly packs to `My Apps/Yuzu/collection/inbox/`.
- Deep links: `?from=citrus&do=round|review|realpaper|campaign|recheck-<topic>`.

## Updates on the phone
The app checks for a new version whenever it comes to the foreground. When one is ready, a bar says "New version ready" with an Update button, and nothing reloads on its own.
