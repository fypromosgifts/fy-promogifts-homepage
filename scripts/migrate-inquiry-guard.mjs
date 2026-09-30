import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const oldEndpoint = "https://formspree.io/f/xgoqqrno";
const newEndpoint = "/api/inquiry";
const guardTag = '<script src="/assets/fy-inquiry-guard.js?v=20260930-security" defer></script>';
const oldGuardVersion = "/assets/fy-inquiry-guard.js?v=20260902";
const newGuardVersion = "/assets/fy-inquiry-guard.js?v=20260930-security";

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", ".wrangler", "output"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (extname(entry.name).toLowerCase() === ".html") files.push(path);
  }
  return files;
}

let migrated = 0;
let cacheBusted = 0;
const pages = await htmlFiles(root);
for (const path of pages) {
  const original = await readFile(path, "utf8");
  if (!original.includes(oldEndpoint)) continue;
  let next = original.replaceAll(oldEndpoint, newEndpoint);
  if (!next.includes("/assets/fy-inquiry-guard.js")) {
    next = next.replace(/<\/body>/i, `${guardTag}</body>`);
  }
  if (next === original || !next.includes(guardTag)) {
    throw new Error(`Could not safely migrate ${path}`);
  }
  await writeFile(path, next, "utf8");
  migrated += 1;
}

for (const path of pages) {
  const original = await readFile(path, "utf8");
  const next = original.replaceAll(oldGuardVersion, newGuardVersion);
  if (next !== original) {
    await writeFile(path, next, "utf8");
    cacheBusted += 1;
  }
}

const toolingFiles = [
  "scripts/validate-release.mjs",
  "scripts/generate-gift-set-pages.mjs",
];
for (const relative of toolingFiles) {
  const path = join(root, relative);
  const original = await readFile(path, "utf8");
  let next = original.replaceAll(oldEndpoint, newEndpoint);
  if (relative.endsWith("generate-gift-set-pages.mjs")) {
    next = next.replace(
      '<script src="/assets/fy-attribution.js?v=20260828" defer></script></body></html>`;',
      '<script src="/assets/fy-attribution.js?v=20260828" defer></script><script src="/assets/fy-inquiry-guard.js?v=20260930-security" defer></script></body></html>`;'
    );
  }
  if (next !== original) await writeFile(path, next, "utf8");
}

console.log(`Migrated ${migrated} HTML files; refreshed guard URL in ${cacheBusted} files.`);
