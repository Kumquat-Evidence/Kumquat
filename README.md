# Kumquat (phone app)

Biostatistics, epidemiology and critical appraisal trainer. Static PWA, no backend. This copy is the **Google-connected** one; the claude.ai artifact stays local-only.

## Put it online (GitHub Pages, like Mephisto)
1. Create a GitHub organisation (e.g. `Kumquat-Evidence`) and a repo `Kumquat` in it.
2. Upload these files to the repo root. Settings -> Pages -> Deploy from a branch -> `main` / root.
3. Open `https://<org>.github.io/Kumquat/` on your phone -> Add to Home screen.

## Connect Google (once)
1. Google Cloud console -> Clients -> the *Citrus web* client -> Authorised JavaScript origins -> add `https://<org>.github.io` (no path). Save.
2. In the app: Progress -> Google, Citrus & backup -> paste the Client ID -> Connect Google.

## What it writes to Drive
- `My Apps/hub/kumquat/state.json` (whole progress, master copy)
- `My Apps/hub/kumquat/status.json` (hub-contract status)
- `Citrus Maxima/Apps/Kumquat.status.json` (simple shape Citrus Maxima reads today)
- Reads `My Apps/hub/scheduler/plan.json` for today's Kumquat block.
