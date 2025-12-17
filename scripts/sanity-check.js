/**
 * Sanity check to prevent accidental terminal artifacts getting pasted into source files.
 * Fails if we detect common terminal/heredoc prompt junk inside tracked source.
 */
const fs = require("fs");
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

const BANNED_PATTERNS = [
  { re: /^\s*cat\s+>\s+/m, msg: "Found `cat > ...` pasted into a source file." },
  { re: /<<\s*['"]?EOF['"]?/m, msg: "Found heredoc marker `<< EOF` pasted into a source file." },
  { re: /\bEOF;\b/m, msg: "Found `EOF;` artifact pasted into a source file." },
  { re: /@soldfield7890\s+➜/m, msg: "Found terminal prompt pasted into a source file." },
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...walk(full));
      continue;
    }

    const ext = path.extname(entry.name);
    if (!TARGET_EXTS.has(ext)) continue;

    out.push(full);
  }
  return out;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const hits = [];
  for (const pat of BANNED_PATTERNS) {
    if (pat.re.test(content)) hits.push(pat.msg);
  }
  return hits;
}

const files = walk(ROOT);
const failures = [];

for (const f of files) {
  const hits = checkFile(f);
  if (hits.length) failures.push({ file: path.relative(ROOT, f), hits });
}

if (failures.length) {
  console.error("\n❌ SANITY CHECK FAILED — terminal artifacts detected:\n");
  for (const f of failures) {
    console.error(`- ${f.file}`);
    for (const h of f.hits) console.error(`  ${h}`);
  }
  console.error("\nFix: remove the pasted terminal lines from the file(s) above.\n");
  process.exit(1);
}

console.log("✅ Sanity check passed (no terminal artifacts found).");
