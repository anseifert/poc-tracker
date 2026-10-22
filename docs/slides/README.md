# POC Evaluation Tracker — user guide slides

## View the deck

Open **`index.html`** in a browser (Chrome or Edge recommended).

- **Next / previous:** arrow keys, space, or click the arrows
- **Overview:** `Esc`
- **Print or PDF:** `Ctrl+P` / `Cmd+P` (enable “Background graphics” for best results)

## Real app screenshots (optional)

Illustrations in the deck are SVG mockups aligned with the live UI. To replace them with PNGs from your environment:

```bash
# Terminal 1 — leave running (skip if port 8081 is already in use)
npm start

# Terminal 2
npm run capture-slides
```

Playwright uses a **fresh browser profile** (not your normal Chrome cookies). Criteria must come from **`state.json`** on the server or the script only saves the home screen and exits with a warning.

The script opens the **hamburger menu** before each menu action (items are hidden inside the nav). Images are written to `docs/slides/images/*.png`. Reload the deck; slides pick up files when present.

## Contents

The deck covers setup, import paths, the main tracker, POC Settings, reports, timegraph, sign-off, and backup/restore.
