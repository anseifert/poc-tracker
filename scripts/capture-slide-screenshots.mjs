#!/usr/bin/env node
/**
 * Capture PNG screenshots for docs/slides (requires: npm i -D playwright).
 * Usage: npm start &  then  node scripts/capture-slide-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "docs", "slides", "images");
const BASE = process.env.SLIDE_BASE_URL || "http://localhost:8081";
const PAGE = `${BASE}/virtualization-kubernetes-tracker.html`;

async function openAppMenu(page) {
  const menu = page.locator("#appMenu");
  if (await menu.isHidden()) {
    await page.click("#menuToggle");
  }
  await menu.waitFor({ state: "visible", timeout: 5000 });
}

async function clickMenuItem(page, selector) {
  await openAppMenu(page);
  const item = page.locator(selector);
  await item.waitFor({ state: "visible", timeout: 10000 });
  await item.click();
}

async function closeAppMenu(page) {
  const menu = page.locator("#appMenu");
  if (await menu.isVisible()) {
    await page.click("#menuToggle");
    await menu.waitFor({ state: "hidden", timeout: 3000 });
  }
}

async function waitForTrackerData(page) {
  try {
    await page.waitForFunction(
      () => {
        const stats = document.getElementById("statsRow");
        return stats && !stats.hidden;
      },
      { timeout: 15000 }
    );
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Install Playwright first: npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Opening", PAGE);
  await page.goto(PAGE, { waitUntil: "networkidle" });
  console.log("Screenshot 01-home-import.png");
  await page.screenshot({ path: path.join(OUT, "01-home-import.png") });

  const hasData = await waitForTrackerData(page);
  if (!hasData) {
    console.warn(
      "Stopped after 01-home-import.png — no criteria visible within 15s.\n" +
        "  • Run npm start and ensure state.json has rows, or import/restore in the browser once.\n" +
        "  • Headless Playwright uses a fresh profile (no your manual localStorage); server state.json is what loads."
    );
    await browser.close();
    return;
  }
  console.log("Tracker data detected — capturing modals…");

  await closeAppMenu(page);
  console.log("Screenshot 02-tracker-main.png");
  await page.screenshot({ path: path.join(OUT, "02-tracker-main.png") });

  await openAppMenu(page);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "03-hamburger-menu.png") });
  await closeAppMenu(page);

  await clickMenuItem(page, "#btnPocSettings");
  await page.locator("#pocSettingsModal").waitFor({ state: "visible" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "04-poc-settings.png") });
  await page.click("#btnPocSettingsClose");
  await page.locator("#pocSettingsModal").waitFor({ state: "hidden" });

  await clickMenuItem(page, "#btnEmailReport");
  await page.locator("#reportModal").waitFor({ state: "visible" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "05-email-report.png") });
  await page.click("#btnReportClose");
  await page.locator("#reportModal").waitFor({ state: "hidden" });

  await clickMenuItem(page, "#btnViewTimegraph");
  await page.locator("#timegraphModal").waitFor({ state: "visible" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "06-timegraph.png") });
  await page.click("#btnTimegraphClose");
  await page.locator("#timegraphModal").waitFor({ state: "hidden" });

  await clickMenuItem(page, "#btnSignOffSheet");
  await page.locator("#signOffModal").waitFor({ state: "visible" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "07-sign-off.png") });

  await browser.close();
  console.log("Wrote screenshots to", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
