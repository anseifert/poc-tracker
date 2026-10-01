#!/usr/bin/env node
/**
 * Serves the tracker and persists state.json on PUT /api/state.
 * Run: node server.mjs  →  http://localhost:8080
 * Docker: set DATA_DIR=/data for persistent state volume.
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureStateFile } from "./scripts/ensure-state.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || ROOT;
const PORT = Number(process.env.PORT) || 8080;
const STATE_FILE = path.join(DATA_DIR, "state.json");
const INDEX = "virtualization-kubernetes-tracker.html";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function safePath(urlPath) {
  const rel = urlPath === "/" ? INDEX : decodeURIComponent(urlPath).replace(/^\/+/, "");
  const resolved = path.resolve(ROOT, rel);
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (url.pathname === "/api/state" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ writable: true }));
    return;
  }

  if (url.pathname === "/state.json" && req.method === "GET") {
    try {
      const data = await fs.readFile(STATE_FILE);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end("{}");
    }
    return;
  }

  if (url.pathname === "/api/state" && req.method === "PUT") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString("utf8");
    try {
      JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STATE_FILE, body.endsWith("\n") ? body : body + "\n");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const filePath = safePath(url.pathname);
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

await fs.mkdir(DATA_DIR, { recursive: true });
await ensureStateFile(DATA_DIR);

server.listen(PORT, () => {
  console.log(`POC tracker: http://localhost:${PORT}`);
  console.log(`State file: ${STATE_FILE}`);
});
