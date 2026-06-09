#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const pkgRoot = path.join(__dirname, "..");
const configDir =
  process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");

const skillsSrc = path.join(pkgRoot, "skills");
const commandsSrc = path.join(pkgRoot, "commands");
const commandsDest = path.join(configDir, "commands", "lazy-cat");

for (const name of fs.readdirSync(skillsSrc)) {
  fs.cpSync(
    path.join(skillsSrc, name),
    path.join(configDir, "skills", name),
    { recursive: true }
  );
}

fs.mkdirSync(commandsDest, { recursive: true });
for (const name of fs.readdirSync(commandsSrc)) {
  fs.cpSync(path.join(commandsSrc, name), path.join(commandsDest, name), {
    recursive: true,
  });
}

console.log(`lazy-cat installed to ${configDir}`);
console.log("  skills:   think-twice, surgical");
console.log("  commands: /lazy-cat:think-twice, /lazy-cat:surgical");
console.log("Restart your Claude Code session so the skills load.");
