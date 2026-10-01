# POC Evaluation Tracker

A single-page app for tracking proof-of-concept evaluation criteria: upload a document, mark progress on two workstreams, view a progress chart, and generate HTML reports for email.

## Quick start

### Local (Node)

```bash
git clone https://github.com/anseifert/poc-tracker.git
cd poc-tracker
npm install   # creates state.json from state.json.example if missing
npm start
```

Open [http://localhost:8080](http://localhost:8080).

### Docker Compose

```bash
docker compose up --build
```

Progress is stored in the named volume `poc_tracker_state` (mounted at `/data` inside the container).

## Features

- **Upload** tab-delimited evaluation documents (or Google Doc `.txt` / `.html` exports)
- **Two workstreams** (Virtualization and Kubernetes) as tabs
- **Section grouping** within Virtualization (from `@section` or row metadata)
- **Progress chart** by workstream (completed / in progress / open)
- **Email report** (hamburger menu): preview HTML, copy to clipboard, or download — open and in-progress items only
- **Shared state** via `state.json` when using `npm start` or Docker (debounced save to disk)

`state.json` is **gitignored**. Each clone gets a fresh file from `state.json.example` on `npm install` or server startup.

## Document format

Use a **tab-delimited** plain-text file (`.txt` or `.tsv`).

1. Switch workstreams with `@workstream` or `@tab` (names like `Virtualization`, `Kubernetes`, `OKE`, `OVE`, etc.).
2. Group criteria with `@section` (optional; used for Virtualization table headings).
3. Add a header row, then one row per criterion.

Example:

```text
@workstream Virtualization
@section 1. Core functional parity
Criteria	Description	Success Criteria	Notes
VM import	Import VMs via MTV	VM boots cleanly	

@workstream Kubernetes
Criteria	Description	Success Criteria	Notes
Cluster install	Bare metal IPI	Cluster healthy	
```

Google Doc exports that already contain Virtualization / Kubernetes sections also work via **Google Doc .txt** or **Google Doc .html**.

## Project layout

| File | Purpose |
|------|---------|
| `virtualization-kubernetes-tracker.html` | App UI and logic |
| `server.mjs` | Static server + `PUT /api/state` persistence |
| `scripts/ensure-state.mjs` | Creates `state.json` when missing |
| `state.json.example` | Empty state template (committed) |
| `Dockerfile` / `docker-compose.yml` | Container deployment |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP port |
| `DATA_DIR` | project root | Directory containing `state.json` (use `/data` in Docker) |

## License

Private / internal use unless otherwise specified by the repository owner.
