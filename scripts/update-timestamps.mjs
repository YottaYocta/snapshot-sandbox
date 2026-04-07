#!/usr/bin/env node
import { execSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";

const root = new URL("..", import.meta.url).pathname;
const jsonPath = join(root, "src/data/component-timestamps.json");
const scanDirs = [join(root, "src/components"), join(root, "src/pages")];

function findAstroFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findAstroFiles(full));
    else if (entry.name.endsWith(".astro")) results.push(full);
  }
  return results;
}

const allFiles = scanDirs.flatMap(findAstroFiles);

// Files staged in this commit
const staged = new Set(
  execSync("git diff --cached --name-only", { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((f) => join(root, f))
);

// Read existing timestamps
let existing = {};
try {
  existing = JSON.parse(readFileSync(jsonPath, "utf8"));
} catch {}

const now = new Date().toISOString();
const result = {};

for (const file of allFiles) {
  const key = relative(root, file);
  if (staged.has(file)) {
    result[key] = now;
  } else if (existing[key]) {
    result[key] = existing[key];
  } else {
    try {
      const ts = execSync(`git log -1 --format="%aI" -- "${file}"`, { encoding: "utf8" }).trim();
      result[key] = ts || now;
    } catch {
      result[key] = now;
    }
  }
}

writeFileSync(jsonPath, JSON.stringify(result, null, 2) + "\n");
console.log("Updated component-timestamps.json");
