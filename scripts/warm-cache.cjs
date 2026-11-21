// Startup cache flush + warm-up. Launched in the background by
// scripts/start.sh; it must never block or fail container startup.
//
// Why: `next build` runs in Docker without a database, so prerendered pages
// (home, CMS pages, blog shell, sitemap) are built with fallback
// data. Once the server is up this script:
//   1. waits for the port,
//   2. POSTs /api/internal/warm-cache (token-protected) -> revalidateSite(),
//   3. GETs the main pages twice so the fresh render is cached before
//      visitors arrive (the first GET may still get the stale copy while the
//      regeneration runs).
//
// Uses only Node built-ins (global fetch, node:net); the runtime image has no
// curl.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const net = require("node:net");

const PORT = Number(process.env.PORT || 3000);
const HOST = "127.0.0.1";
const BASE = `http://${HOST}:${PORT}`;
const TOKEN = process.env.CACHE_WARM_TOKEN || "";

const PAGES = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/how-to-order",
  "/support",
  "/blog",
  "/sitemap.xml",
];

const log = (...args) => console.log("[warm-cache]", ...args);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function portOpen() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: HOST, port: PORT });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(1000, () => done(false));
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });
}

async function request(path, init = {}) {
  try {
    const res = await fetch(BASE + path, {
      ...init,
      signal: AbortSignal.timeout(30_000),
    });
    await res.arrayBuffer().catch(() => {});
    return res.status;
  } catch (err) {
    return `error: ${err && err.message ? err.message : err}`;
  }
}

async function main() {
  if (TOKEN.length < 32) {
    log("CACHE_WARM_TOKEN missing or too short, skipping");
    return;
  }

  // Wait up to ~2 minutes for the server to listen.
  let up = false;
  for (let i = 0; i < 120 && !up; i++) {
    up = await portOpen();
    if (!up) await sleep(1000);
  }
  if (!up) {
    log(`port ${PORT} never opened, giving up`);
    return;
  }

  const flush = await request("/api/internal/warm-cache", {
    method: "POST",
    headers: { "x-cache-warm-token": TOKEN },
  });
  log(`flush -> ${flush}`);
  if (flush !== 200) return;

  for (let round = 1; round <= 2; round++) {
    for (const path of PAGES) {
      const status = await request(path);
      log(`round ${round} GET ${path} -> ${status}`);
    }
    if (round === 1) await sleep(2000);
  }
  log("done");
}

main().catch((err) => log("unexpected error", err));
