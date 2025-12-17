/**
 * Sanity check to prevent accidental terminal artifacts getting pasted into source files.
 */
const fs2 = require("fs");
const path = require("path");

const ROOT = process.cwd();

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "_archive",
  "archive",
  "dist",
  "build",
]);

const TARGET_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".md"]);

const BANNED = [
  { re: /^\s*cat\s+>\s+/m, msg: "Found `cat > ...` pasted into a source file." },
  { re: /<<\s*['"]?EOF['"]?/m, msg: "Found heredoc marker `<< EOF` pasted into a source file." },
  { re: /\bEOF;\b/m, msg: "Found `EOF;` artifact pasted into a source file." },
  { re: /@soldfield7890\s+➜/m, msg: "Found terminal prompt pasted into a source file." },
];

function walk(dir) {
  const out = [];
  for (const entry of fs2.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walk(full));
      continue;
    }
    const ext = path.extname(entry.name);
    if (TARGET_EXTS.has(ext)) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const hits = [];

for (const f of files) {
  const text = fs2.readFileSync(f, "utf8");
  for (const rule of BANNED) {
    if (rule.re.test(text)) {
      hits.push({ file: f.replace(ROOT + "/", ""), msg: rule.msg });
    }
  }
}

if (hits.length) {
  console.error("\n❌ SANITY CHECK FAILED — terminal artifacts detected:\n");
  for (const h of hits) console.error(`- ${h.file}\n  ${h.msg}\n`);
  process.exit(1);
}

console.log("✅ Sanity check passed (no terminal artifacts found).");
