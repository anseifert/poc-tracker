# POC Evaluation Tracker

A single-page app for tracking proof-of-concept evaluation criteria: import from a **Google Doc** or **markdown**, mark progress on two workstreams, view a progress chart, and generate HTML reports for email.

## Quick start

### Local (Node)

```bash
git clone https://github.com/anseifert/poc-tracker.git
cd poc-tracker
npm install   # creates state.json from state.json.example if missing
npm start
```

Open [http://localhost:8080](http://localhost:8080) (or the port shown in the console).

### Docker Compose

```bash
docker compose up --build
```

Progress is stored in the named volume `poc_tracker_state` (mounted at `/data` inside the container).

## Importing criteria

### Google Doc (default)

On the main page, paste the document URL and click **Import from Google Doc**. The server downloads Google’s plain-text export (`/export?format=txt`).

The doc must be shared so **anyone with the link can view**. Private docs will fail unless you change sharing. Import requires `npm start` or Docker (not `file://`).

### Markdown

Switch to the **Markdown** tab, paste content, and click **Import markdown**.

- `##` headings → workstreams (e.g. Virtualization, Kubernetes)
- `###` headings → sections within a workstream
- Markdown tables → criteria rows (Criteria, Description, Success Criteria, Notes)

## Features

- Two workstreams (Virtualization and Kubernetes) as tabs after import
- Section grouping within Virtualization
- Progress chart by workstream
- Email report (hamburger menu): preview HTML, copy, or download
- Shared state via `state.json` when using `npm start` or Docker

`state.json` is **gitignored**. Each clone gets a fresh file from `state.json.example` on `npm install` or server startup.

## Project layout

| File | Purpose |
|------|---------|
| `virtualization-kubernetes-tracker.html` | App UI and logic |
| `server.mjs` | Static server, `PUT /api/state`, `POST /api/import-google-doc` |
| `scripts/ensure-state.mjs` | Creates `state.json` when missing |
| `Dockerfile` / `docker-compose.yml` | Container deployment |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP port |
| `DATA_DIR` | project root | Directory containing `state.json` (use `/data` in Docker) |
