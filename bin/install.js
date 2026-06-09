#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const pkgRoot = path.join(__dirname, "..");
const project = process.argv.includes("--project");
const base = project ? process.cwd() : os.homedir();

const skillsSrc = path.join(pkgRoot, "skills");
const commandsSrc = path.join(pkgRoot, "commands");
const commandsDest = path.join(configDir, "commands", "lazy-cat");

function copyDirInto(srcDir, destDir) {
  for (const name of fs.readdirSync(srcDir)) {
    fs.cpSync(path.join(srcDir, name), path.join(destDir, name), {
      recursive: true,
    });
  }
}

// Write the portable rule block into an instructions file, idempotently:
// replace an existing lean block between markers, or append a new one.
function writeRules(file, block) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const re = new RegExp(`${START}[\\s\\S]*?${END}`);
  const next = re.test(existing)
    ? existing.replace(re, block)
    : existing
    ? `${existing.trimEnd()}\n\n${block}\n`
    : `${block}\n`;
  fs.writeFileSync(file, next);
}

console.log(`lazy-cat installed to ${configDir}`);
console.log("  skills:   think-twice, surgical");
console.log("  commands: /lazy-cat:think-twice, /lazy-cat:surgical");
console.log("Restart your Claude Code session so the skills load.");
