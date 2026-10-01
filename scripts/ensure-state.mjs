#!/usr/bin/env node
/**
 * Creates gitignored state.json from state.json.example when missing.
 * Run via npm postinstall or from server.mjs on startup.
 * DATA_DIR env (optional): directory for state.json (e.g. /data in Docker).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const EMPTY_STATE =
  JSON.stringify(
    {
      version: 1,
      updatedAt: null,
      dataVersion: 0,
      datePolicyVersion: 0,
      progress: {},
      sections: {},
      sourceImportedAt: null,
    },
    null,
    2
  ) + "\n";

function resolveDataDir(dataDir) {
  if (dataDir) return path.resolve(dataDir);
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR);
  return ROOT;
}

export async function ensureStateFile(dataDir) {
  const dir = resolveDataDir(dataDir);
  const stateFile = path.join(dir, "state.json");
  const exampleFile = path.join(ROOT, "state.json.example");

  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(stateFile);
    return false;
  } catch {
    /* create below */
  }

  try {
    const template = await fs.readFile(exampleFile, "utf8");
    await fs.writeFile(stateFile, template.endsWith("\n") ? template : template + "\n");
    console.log(`Created ${path.basename(stateFile)} in ${dir}`);
  } catch {
    await fs.writeFile(stateFile, EMPTY_STATE);
    console.log(`Created ${path.basename(stateFile)} in ${dir} (default empty state)`);
  }
  return true;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  ensureStateFile().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
