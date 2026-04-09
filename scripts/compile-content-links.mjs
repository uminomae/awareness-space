#!/usr/bin/env node
/**
 * compile-content-links.mjs
 *
 * pd (project-design) の正本スクリプトから buildTermMap / injectLinks を
 * import し、as (awareness-space) の about MD に wiki リンクを注入する。
 *
 * 正本: /Users/uminomae/dev/project-design/scripts/compile-content-links.mjs
 *
 * Usage: node scripts/compile-content-links.mjs [--file assets/about/ja.md]
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, basename, relative } from "node:path";

import {
  WIKI_DIRS,
  WIKI_BASE,
  buildTermMap,
  injectLinks,
} from "../../project-design/scripts/compile-content-links.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const CONTENT_DIR = join(ROOT, "assets", "about");
const COMPILED_DIR = join(ROOT, "assets", "about", "compiled");

async function compileFile(filePath, termMap) {
  const markdown = await readFile(filePath, "utf-8");
  const compiled = injectLinks(markdown, termMap);
  const outPath = join(COMPILED_DIR, basename(filePath));
  await writeFile(outPath, compiled, "utf-8");
  const name = relative(ROOT, filePath);
  const outName = relative(ROOT, outPath);
  console.error(`compiled: ${name} -> ${outName}`);
}

async function main() {
  await mkdir(COMPILED_DIR, { recursive: true });
  const termMap = await buildTermMap();

  if (termMap.length === 0) {
    console.error("No wiki pages found, nothing to link.");
    return;
  }
  console.error(`Wiki term map: ${termMap.length} terms`);

  // --file オプション
  const fileIdx = process.argv.indexOf("--file");
  if (fileIdx !== -1 && process.argv[fileIdx + 1]) {
    const target = join(ROOT, process.argv[fileIdx + 1]);
    await compileFile(target, termMap);
    return;
  }

  // assets/about/ 直下の .md を処理（compiled/ 自身は除外）
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "compiled") continue;
    if (entry.name.endsWith(".md")) {
      await compileFile(join(CONTENT_DIR, entry.name), termMap);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
