/** Validate navigation, inventory freshness, and module reference coverage. Read-only. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function walk(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      if (["node_modules", "dist", ".git"].includes(entry.name)) return [];
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    });
}
const allFiles = walk(root),
  markdown = allFiles.filter((file) => file.endsWith(".md"));
function slug(value) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_]/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/ /g, "-");
}
function anchors(text) {
  const result = new Set(),
    counts = new Map();
  for (const match of text.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const base = slug(match[1]),
      count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    result.add(base + (count ? "-" + count : ""));
  }
  for (const match of text.matchAll(/\bid=["']([^"']+)["']/g))
    result.add(match[1]);
  return result;
}
let checkedLinks = 0;
for (const file of markdown) {
  const text = fs
    .readFileSync(file, "utf8")
    .replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, "")
    .replace(/(`+)[\s\S]*?\1/g, "");
  for (const match of text.matchAll(
    /!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^)]*["'])?\)/g,
  )) {
    let href = match[1].replace(/^<|>$/g, "");
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) continue;
    const hashIndex = href.indexOf("#"),
      fragment =
        hashIndex < 0 ? "" : decodeURIComponent(href.slice(hashIndex + 1));
    href = (hashIndex < 0 ? href : href.slice(0, hashIndex)).split("?")[0];
    let target;
    try {
      target = href
        ? path.resolve(path.dirname(file), decodeURIComponent(href))
        : file;
    } catch {
      errors.push(path.relative(root, file) + ": malformed link " + match[1]);
      continue;
    }
    checkedLinks++;
    if (!fs.existsSync(target)) {
      errors.push(path.relative(root, file) + ": missing link " + match[1]);
      continue;
    }
    if (
      fragment &&
      target.endsWith(".md") &&
      !anchors(fs.readFileSync(target, "utf8")).has(fragment)
    )
      errors.push(path.relative(root, file) + ": missing heading " + match[1]);
  }
}
const manifestPath = path.join(root, "docs/generated/source-manifest.json");
if (!fs.existsSync(manifestPath))
  errors.push("Missing generated inventory. Run npm run docs:generate.");
else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const expected = [
    ...walk(path.join(root, "src")),
    ...walk(path.join(root, "public")),
    ...walk(path.join(root, "scripts")).filter((f) => f.endsWith(".mjs")),
    ...[
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "vite.config.ts",
      "index.html",
      ".gitignore",
    ].map((p) => path.join(root, p)),
  ];
  for (const file of expected) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    if (manifest.files[relative] !== hash(fs.readFileSync(file)))
      errors.push(
        "Stale source inventory: " +
          relative +
          "; run npm run docs:generate after updating its semantic reference.",
      );
  }
  for (const relative of Object.keys(manifest.files))
    if (!fs.existsSync(path.join(root, relative)))
      errors.push("Removed source remains in manifest: " + relative);
}
const required = [
  "archive",
  "timeline",
  "interface",
  "world",
  "scene",
  "performance",
  "ui",
  "objects",
  "person",
  "portrait",
  "art",
  "game",
  "styles",
  "build",
  "tooling",
  "references",
];
for (const name of required) {
  const file = path.join(root, "docs/reference/" + name + ".md");
  if (!fs.existsSync(file) || fs.statSync(file).size < 500)
    errors.push("Missing or incomplete semantic reference: " + name);
}
const symbolsPath = path.join(root, "docs/generated/symbols.json");
let counts = {
  files: 0,
  functions: 0,
  variables: 0,
  parameters: 0,
  types: 0,
  fields: 0,
};
if (fs.existsSync(symbolsPath)) {
  const symbols = JSON.parse(fs.readFileSync(symbolsPath, "utf8"));
  for (const record of symbols.files) {
    counts.files++;
    for (const key of [
      "functions",
      "variables",
      "parameters",
      "types",
      "fields",
    ])
      counts[key] += record[key].length;
  }
}
const filesIndex = path.join(root, "docs/generated/FILES.md");
if (fs.existsSync(filesIndex)) {
  const inventory = fs.readFileSync(filesIndex, "utf8");
  for (const file of allFiles) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    if (!inventory.includes("](" + "../../" + relative + ")"))
      errors.push(
        "File missing from generated index: " +
          relative +
          "; run npm run docs:generate.",
      );
  }
}
if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else
  console.log(
    JSON.stringify(
      {
        ok: true,
        markdownFiles: markdown.length,
        localLinks: checkedLinks,
        declarations: counts,
      },
      null,
      2,
    ),
  );
