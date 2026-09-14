#!/usr/bin/env node
/**
 * Nitro bundles @electric-sql/pglite into _libs/electric-sql__pglite.mjs but
 * leaves the WASM/data sidecars behind. PGLite then does
 * `new URL("./pglite.data", import.meta.url)` and the preview process dies.
 * Copy the three artifacts next to the bundled module after `vite build`.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "node_modules/@electric-sql/pglite/dist");
const DEST = join(ROOT, ".vercel/output/functions/__server.func/_libs");
const FILES = ["pglite.data", "pglite.wasm", "initdb.wasm"];

if (!existsSync(DEST)) {
  console.log("[pglite-assets] no nitro function output — skipping");
  process.exit(0);
}

mkdirSync(DEST, { recursive: true });
for (const name of FILES) {
  const from = join(SRC, name);
  if (!existsSync(from)) {
    console.error(`[pglite-assets] missing ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(DEST, name));
}
console.log("[pglite-assets] copied wasm/data next to bundled PGLite");
