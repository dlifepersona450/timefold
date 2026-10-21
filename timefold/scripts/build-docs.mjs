/** Rebuild documentation inventories from local source. No application execution. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const generated = path.join(root, "docs/generated");
const reference = {
  "archive.ts": "archive",
  "timeline.ts": "timeline",
  "main.ts": "interface",
  "audio.ts": "ui",
  "world.ts": "world",
  "temporal-objects.ts": "objects",
  "person.ts": "person",
  "portrait.ts": "portrait",
  "art.ts": "art",
  "game.ts": "game",
  "vite-env.d.ts": "build",
  "vite.config.ts": "build",
};
/** Match grouped implementation files before falling back to entry-point names. */
function semanticReference(file) {
  if (file.startsWith("scripts/")) return "tooling";
  if (file.startsWith("src/scene/")) return "scene";
  if (file.startsWith("src/ui/")) return "ui";
  const page = reference[path.basename(file)];
  if (!page) throw new Error("Missing semantic reference mapping: " + file);
  return page;
}
/** Preserve familiar root names while distinguishing nested modules with equal basenames. */
function symbolSlug(file) {
  return file
    .replace(/^(src|scripts)\//, "")
    .replace(/\.(ts|mjs)$/, "")
    .replaceAll("/", "-");
}
const escapeCell = (value) =>
  String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const inline = (value) => "`" + escapeCell(value).replace(/`/g, "ˋ") + "`";
const short = (value, length = 150) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > length ? text.slice(0, length - 1) + "…" : text;
};
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
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
function write(relative, text) {
  const target = path.join(generated, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text.endsWith("\n") ? text : text + "\n");
}
function names(binding) {
  if (ts.isIdentifier(binding)) return [binding.text];
  return binding.elements.flatMap((element) =>
    ts.isOmittedExpression(element) ? [] : names(element.name),
  );
}
const isFunction = (node) =>
  ts.isFunctionDeclaration(node) ||
  ts.isFunctionExpression(node) ||
  ts.isArrowFunction(node) ||
  ts.isMethodDeclaration(node) ||
  ts.isGetAccessorDeclaration(node) ||
  ts.isSetAccessorDeclaration(node);
function functionName(node, source) {
  if (node.name) return node.name.getText(source);
  const parent = node.parent;
  if (ts.isVariableDeclaration(parent) || ts.isPropertyAssignment(parent))
    return parent.name.getText(source);
  if (ts.isBinaryExpression(parent)) return parent.left.getText(source);
  if (ts.isCallExpression(parent)) {
    const target = parent.expression.getText(source),
      first = parent.arguments[0];
    return (
      short(target, 70) +
      (first && ts.isStringLiteral(first)
        ? "(" + JSON.stringify(first.text) + ")"
        : "") +
      " callback"
    );
  }
  return "anonymous " + ts.SyntaxKind[node.kind];
}
function scopeOf(node, source) {
  const scopes = [];
  let parent = node.parent;
  while (parent && !ts.isSourceFile(parent)) {
    if (isFunction(parent)) scopes.unshift(functionName(parent, source));
    parent = parent.parent;
  }
  return scopes.length ? scopes.join(" → ") : "module";
}
function propertyPath(node, source) {
  const parts = [node.name.getText(source)];
  let parent = node.parent;
  while (parent && !ts.isSourceFile(parent)) {
    if (
      ts.isInterfaceDeclaration(parent) ||
      ts.isTypeAliasDeclaration(parent) ||
      ts.isPropertySignature(parent)
    )
      parts.unshift(parent.name.getText(source));
    parent = parent.parent;
  }
  return parts.join(".");
}
function analyze(file) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const text = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(
    relative,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".mjs") ? ts.ScriptKind.JS : ts.ScriptKind.TS,
  );
  const functions = [],
    variables = [],
    parameters = [],
    types = [],
    fields = [],
    imports = [];
  const lineOf = (node) =>
    source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
  function visit(node) {
    if (ts.isImportDeclaration(node))
      imports.push({
        module: node.moduleSpecifier.text,
        clause: node.importClause?.getText(source) ?? "side effects",
        line: lineOf(node),
      });
    if (isFunction(node))
      functions.push({
        name: functionName(node, source),
        scope: scopeOf(node, source),
        kind: ts.SyntaxKind[node.kind],
        line: lineOf(node),
        parameters: node.parameters.map((p) => p.getText(source)),
        returns:
          node.type?.getText(source) ?? "inferred; see semantic reference",
      });
    if (ts.isVariableDeclaration(node))
      for (const name of names(node.name))
        variables.push({
          name,
          scope: scopeOf(node, source),
          line: lineOf(node),
          type: node.type?.getText(source) ?? "inferred",
          initializer: short(
            node.initializer?.getText(source) ?? "not initialized",
          ),
        });
    if (ts.isParameter(node))
      parameters.push({
        name: node.name.getText(source),
        scope: scopeOf(node, source),
        line: lineOf(node),
        type: node.type?.getText(source) ?? "inferred",
        default: short(node.initializer?.getText(source) ?? "none"),
        optional: Boolean(node.questionToken),
      });
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))
      types.push({
        name: node.name.text,
        kind: ts.SyntaxKind[node.kind],
        line: lineOf(node),
        scope: scopeOf(node, source),
      });
    if (ts.isPropertySignature(node) || ts.isMethodSignature(node))
      fields.push({
        path: propertyPath(node, source),
        line: lineOf(node),
        optional: Boolean(node.questionToken),
        type: ts.isMethodSignature(node)
          ? "(" +
            node.parameters.map((p) => p.getText(source)).join(", ") +
            ") => " +
            (node.type?.getText(source) ?? "void")
          : (node.type?.getText(source) ?? "inferred"),
      });
    ts.forEachChild(node, visit);
  }
  visit(source);
  return {
    file: relative,
    sha256: hash(text),
    lines: source.getLineAndCharacterOfPosition(text.length).line + 1,
    functions,
    variables,
    parameters,
    types,
    fields,
    imports,
  };
}
function symbolPage(record) {
  const ref = semanticReference(record.file);
  const nav =
    "[Docs home](../../README.md) · [Symbol index](../SYMBOLS.md) · [Semantic reference](../../reference/" +
    ref +
    ".md)";
  let out =
    nav + "\n\n# " + record.file + " — complete declaration inventory\n\n";
  out +=
    "Generated by `npm run docs:generate`. Read the semantic reference for the purpose and behavior of each group. This inventory enumerates every named declaration, parameter, type field, and anonymous callback found by the TypeScript parser; repeated names are distinguished by scope and source line. Lines are lookup aids and are regenerated when code changes. Object data values are in the [era data inventory](../DATA.md).\n\n";
  out +=
    "Source: [" +
    record.file +
    "](../../../" +
    record.file +
    "). SHA-256: " +
    inline(record.sha256) +
    ".\n\n";
  function table(title, headers, rows) {
    out += "## " + title + "\n\n";
    if (!rows.length) {
      out += "None in this module.\n\n";
      return;
    }
    out +=
      "| " +
      headers.join(" | ") +
      " |\n| " +
      headers.map(() => "---").join(" | ") +
      " |\n" +
      rows.map((row) => "| " + row.join(" | ") + " |").join("\n") +
      "\n\n";
  }
  table(
    "Imports",
    ["Module", "Bindings / purpose", "Line"],
    record.imports.map((i) => [inline(i.module), inline(i.clause), i.line]),
  );
  table(
    "Functions and callbacks",
    [
      "ID",
      "Name / callback target",
      "Scope",
      "Kind",
      "Parameters",
      "Return annotation",
      "Line",
    ],
    record.functions.map((f, i) => [
      "F" + (i + 1),
      inline(f.name),
      escapeCell(f.scope),
      f.kind,
      inline(f.parameters.join(", ") || "none"),
      inline(f.returns),
      f.line,
    ]),
  );
  table(
    "Variables and destructured bindings",
    [
      "ID",
      "Binding",
      "Scope",
      "Type annotation",
      "Initializer / binding source",
      "Line",
    ],
    record.variables.map((v, i) => [
      "V" + (i + 1),
      inline(v.name),
      escapeCell(v.scope),
      inline(v.type),
      inline(v.initializer),
      v.line,
    ]),
  );
  table(
    "Function parameters",
    [
      "ID",
      "Parameter",
      "Scope",
      "Type annotation",
      "Default",
      "Optional",
      "Line",
    ],
    record.parameters.map((p, i) => [
      "P" + (i + 1),
      inline(p.name),
      escapeCell(p.scope),
      inline(p.type),
      inline(p.default),
      p.optional ? "yes" : "no",
      p.line,
    ]),
  );
  table(
    "Interfaces and type aliases",
    ["Name", "Kind", "Scope", "Line"],
    record.types.map((t) => [
      inline(t.name),
      t.kind,
      escapeCell(t.scope),
      t.line,
    ]),
  );
  table(
    "Typed fields",
    ["Property path", "Type", "Optional", "Line"],
    record.fields.map((f) => [
      inline(f.path),
      inline(f.type),
      f.optional ? "yes" : "no",
      f.line,
    ]),
  );
  return out;
}
function unwrap(node) {
  while (
    ts.isAsExpression(node) ||
    ts.isParenthesizedExpression(node) ||
    ts.isSatisfiesExpression(node)
  )
    node = node.expression;
  return node;
}
function leaves(node, label, source, result = []) {
  node = unwrap(node);
  if (ts.isArrayLiteralExpression(node))
    node.elements.forEach((item, i) =>
      leaves(item, label + "[" + i + "]", source, result),
    );
  else if (ts.isObjectLiteralExpression(node))
    node.properties.forEach((property) => {
      if (ts.isPropertyAssignment(property))
        leaves(
          property.initializer,
          label + "." + property.name.getText(source),
          source,
          result,
        );
      else result.push([label, property.getText(source)]);
    });
  else result.push([label, node.getText(source).replace(/\s+/g, " ").trim()]);
  return result;
}
// A small quote/parenthesis-aware parser for this repository's CSS structure.
function cssDeclarations(body) {
  const parts = [];
  let start = 0,
    quote = "",
    depth = 0;
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (quote) {
      if (char === "\\") i++;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "(" || char === "[") depth++;
    if (char === ")" || char === "]") depth--;
    if (char === ";" && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts
    .map((part) => {
      const colon = part.indexOf(":");
      return colon < 0
        ? null
        : {
            property: part.slice(0, colon).trim(),
            value: part
              .slice(colon + 1)
              .trim()
              .replace(/\s+/g, " "),
          };
    })
    .filter(Boolean);
}
function cssRules(text, contexts = [], rules = []) {
  let cursor = 0;
  while (cursor < text.length) {
    let open = -1,
      quote = "",
      parens = 0;
    for (let i = cursor; i < text.length; i++) {
      const char = text[i];
      if (quote) {
        if (char === "\\") i++;
        else if (char === quote) quote = "";
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        continue;
      }
      if (char === "(") parens++;
      if (char === ")") parens--;
      if (char === "{" && parens === 0) {
        open = i;
        break;
      }
    }
    if (open < 0) break;
    const header = text.slice(cursor, open).trim().replace(/\s+/g, " ");
    let level = 1,
      close = open + 1;
    quote = "";
    for (; close < text.length; close++) {
      const char = text[close];
      if (quote) {
        if (char === "\\") close++;
        else if (char === quote) quote = "";
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        continue;
      }
      if (char === "{") level++;
      if (char === "}") {
        level--;
        if (level === 0) break;
      }
    }
    if (level !== 0) throw new Error("Unbalanced CSS block: " + header);
    const body = text.slice(open + 1, close);
    if (/^@(media|supports|keyframes|layer|container)\b/.test(header))
      cssRules(body, [...contexts, header], rules);
    else
      rules.push({
        context: contexts,
        selector: header,
        declarations: cssDeclarations(body),
      });
    cursor = close + 1;
  }
  return rules;
}
const cssSource = fs.readFileSync(path.join(root, "src/style.css"), "utf8");
const styles = cssRules(cssSource.replace(/\/\*[\s\S]*?\*\//g, ""));
const styleInventory = {
  format: 1,
  source: "src/style.css",
  sha256: hash(cssSource),
  blocks: styles.length,
  declarations: styles.reduce((sum, rule) => sum + rule.declarations.length, 0),
  rules: styles,
};
write("styles.json", JSON.stringify(styleInventory, null, 2));
write(
  "STYLES.md",
  "[Docs home](../README.md) · [Styles explained](../reference/styles.md) · [Symbol index](SYMBOLS.md)\n\n# Complete stylesheet rule and variable inventory\n\nGenerated from `src/style.css` by `npm run docs:generate`. Every declaration block remains in source order, with media/keyframe context. Values are normalized only for whitespace; later overrides still win according to the CSS cascade. See the semantic reference for explanations, and [styles.json](styles.json) for structured data.\n\nSource SHA-256: " +
    inline(styleInventory.sha256) +
    ". " +
    styles.length +
    " blocks; " +
    styleInventory.declarations +
    " declarations.\n\n## Custom property declarations\n\n| Property | Value | Selector | Context |\n|---|---|---|---|\n" +
    styles
      .flatMap((rule) =>
        rule.declarations
          .filter((d) => d.property.startsWith("--"))
          .map(
            (d) =>
              "| " +
              inline(d.property) +
              " | " +
              inline(d.value) +
              " | " +
              inline(rule.selector) +
              " | " +
              inline(rule.context.join(" → ") || "top level") +
              " |",
          ),
      )
      .join("\n") +
    "\n\n## All rules in source order\n\n| Rule | Context | Selector / at-rule | Every property and value |\n|---|---|---|---|\n" +
    styles
      .map(
        (rule, i) =>
          "| " +
          (i + 1) +
          " | " +
          inline(rule.context.join(" → ") || "top level") +
          " | " +
          inline(rule.selector) +
          " | " +
          rule.declarations
            .map((d) => inline(d.property + ": " + d.value))
            .join("<br>") +
          " |",
      )
      .join("\n") +
    "\n",
);

const sourceInputs = walk(path.join(root, "src"));
const sourceFiles = [
  ...sourceInputs.filter((file) => file.endsWith(".ts")),
  path.join(root, "vite.config.ts"),
];
const scriptFiles = walk(path.join(root, "scripts")).filter((file) =>
  file.endsWith(".mjs"),
);
const records = [...sourceFiles, ...scriptFiles].map(analyze);
for (const record of records)
  write(
    "symbols/" + symbolSlug(record.file) + ".md",
    symbolPage(record),
  );
write("symbols.json", JSON.stringify({ format: 1, files: records }, null, 2));
write(
  "SYMBOLS.md",
  "[Docs home](../README.md) · [Architecture](../architecture/README.md)\n\n# Complete symbol index\n\nGenerated from the TypeScript AST, including local helpers, anonymous callbacks, destructured variables, parameters, interfaces, and typed fields. [Semantic references](../reference/README.md) explain how they work; these pages are the exhaustive lookup layer. Initializer snippets are abbreviated, while the linked source retains the complete implementation.\n\n| File | Functions / callbacks | Variables | Parameters | Types | Fields |\n|---|---:|---:|---:|---:|---:|\n" +
    records
      .map(
        (r) =>
          "| [" +
          r.file +
          "](symbols/" +
          symbolSlug(r.file) +
          ".md) | " +
          r.functions.length +
          " | " +
          r.variables.length +
          " | " +
          r.parameters.length +
          " | " +
          r.types.length +
          " | " +
          r.fields.length +
          " |",
      )
      .join("\n") +
    "\n\nOther inventories: [all files](FILES.md), [era values](DATA.md), [module imports](IMPORTS.md), [machine-readable declarations](symbols.json).\n",
);
const archivePath = path.join(root, "src/archive.ts"),
  archiveText = fs.readFileSync(archivePath, "utf8"),
  archive = ts.createSourceFile(
    "archive.ts",
    archiveText,
    ts.ScriptTarget.Latest,
    true,
  );
const declarations = new Map();
for (const statement of archive.statements)
  if (ts.isVariableStatement(statement))
    for (const declaration of statement.declarationList.declarations)
      if (ts.isIdentifier(declaration.name) && declaration.initializer)
        declarations.set(
          declaration.name.text,
          unwrap(declaration.initializer),
        );
const eraArray = declarations.get("eras"),
  contentArray = declarations.get("eraContent");
const eraPages = [];
for (let i = 0; i < eraArray.elements.length; i++) {
  const era = eraArray.elements[i],
    yearProperty = era.properties.find(
      (p) => ts.isPropertyAssignment(p) && p.name.getText(archive) === "year",
    );
  const year = yearProperty?.initializer.text ?? String(i),
    filename = "data-" + year + ".md";
  eraPages.push({ year, filename, index: i });
  const rows = [
    ...leaves(era, "eras[" + i + "]", archive),
    ...leaves(contentArray.elements[i], "eraContent[" + i + "]", archive),
  ];
  write(
    filename,
    "[Docs home](../README.md) · [Data index](DATA.md) · [Data API](../reference/archive.md)\n\n# " +
      year +
      " — authored configuration and content\n\nGenerated from source expressions; strings and arithmetic are shown as written, not evaluated. `photo(...)` calls are constructors documented in the data API. These are fictional demo values.\n\n| Property path | Authored value / expression |\n|---|---|\n" +
      rows
        .map(
          ([key, value]) => "| " + inline(key) + " | " + inline(value) + " |",
        )
        .join("\n") +
      "\n",
  );
}
write(
  "DATA.md",
  "[Docs home](../README.md) · [Data API](../reference/archive.md)\n\n# Complete authored data inventory\n\nEvery leaf value in each era and content snapshot is listed below by property path. Editing instructions: [content](../CONTENT.md) and [timeline](../TIMELINE.md). Array position is the linkage; dates do not automatically select a chapter.\n\n" +
    eraPages
      .map(
        (p) =>
          "- [" +
          p.year +
          "](" +
          p.filename +
          ") — `eras[" +
          p.index +
          "]` and `eraContent[" +
          p.index +
          "]`",
      )
      .join("\n") +
    "\n\n## Stable category catalog\n\n| Property path | Authored value |\n|---|---|\n" +
    leaves(declarations.get("objects"), "objects", archive)
      .map(([key, value]) => "| " + inline(key) + " | " + inline(value) + " |")
      .join("\n") +
    "\n\nShared birth-year expression: " +
    inline(declarations.get("birthYear").getText(archive)) +
    ".\n",
);
write(
  "IMPORTS.md",
  "[Docs home](../README.md) · [Architecture](../architecture/README.md)\n\n# Exact import linkage\n\nThis table is generated from static import declarations. CSS side effects are included. Browser APIs and the `vite/client` triple-slash type directive are described in the [build reference](../reference/build.md); dynamic event/data relationships are in [runtime flow](../architecture/runtime.md).\n\n| Importing file | Module | Imported bindings |\n|---|---|\n" +
    records
      .flatMap((r) =>
        r.imports.map(
          (i) =>
            "| [" +
            r.file +
            "](../../" +
            r.file +
            ") | " +
            inline(i.module) +
            " | " +
            inline(i.clause) +
            " |",
        ),
      )
      .join("\n") +
    "\n",
);
const fingerprints = {};
for (const file of [
  ...sourceInputs,
  ...walk(path.join(root, "public")),
  ...scriptFiles,
  ...[
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "index.html",
    ".gitignore",
  ].map((p) => path.join(root, p)),
])
  fingerprints[path.relative(root, file).replaceAll(path.sep, "/")] = hash(
    fs.readFileSync(file),
  );
write(
  "source-manifest.json",
  JSON.stringify({ format: 1, files: fingerprints }, null, 2),
);
function describe(relative) {
  if (relative.startsWith("docs/generated/"))
    return "Generated inventory; rebuild with docs:generate";
  if (relative.startsWith("docs/rights/licenses/"))
    return "Exact upstream legal notice; see rights inventory";
  if (relative.startsWith("docs/rights/"))
    return "Rights, provenance, or dependency audit";
  if (relative.startsWith("docs/reference/"))
    return "Detailed source/API reference";
  if (relative.startsWith("docs/architecture/"))
    return "Cross-module architecture and lifecycle";
  if (relative.startsWith("docs/learn/"))
    return "Step-by-step implementation lesson";
  if (relative.startsWith("docs/showcase/"))
    return "Actual application screenshot or capture instructions";
  if (relative.startsWith("docs/"))
    return "Documentation navigation or authoring guide";
  if (relative.startsWith("public/fonts/"))
    return relative.endsWith(".txt")
      ? "Exact font license notice"
      : "Bundled font binary";
  if (relative.startsWith("public/licenses/"))
    return "Runtime license included in static output";
  if (relative.startsWith("public/memories/"))
    return "Standalone sample post, served unchanged";
  if (relative.startsWith("public/"))
    return "Static public asset, served unchanged";
  if (relative.startsWith("scripts/"))
    return "Documentation tooling; see tooling reference";
  if (relative.startsWith("src/"))
    return "Application source; see module reference and symbol index";
  const descriptions = {
    "README.md": "Project entry point",
    "CONCEPT.md": "Creative brief and interaction direction",
    "ASSET_SOURCES.md": "Asset origins and source links",
    "THIRD_PARTY_NOTICES.md": "Third-party notice entry point",
    "package.json": "Commands and declared dependency ranges",
    "package-lock.json": "Exact resolved dependency graph",
    "tsconfig.json": "TypeScript checking contract",
    "vite.config.ts": "Vite build/chunk configuration",
    "index.html": "Browser HTML entry point",
    ".gitignore": "Generated/local exclusions",
  };
  return descriptions[relative] ?? "Project file";
}
// Write once, then recalculate to include FILES.md itself on a fresh checkout.
write("FILES.md", "# File inventory\n");
const all = walk(root).map((file) =>
  path.relative(root, file).replaceAll(path.sep, "/"),
);
write(
  "FILES.md",
  "[Docs home](../README.md) · [Project map](../architecture/files.md)\n\n# Every project file\n\nGenerated source/document/asset inventory. `node_modules/`, `dist/`, and `.git/` are intentionally excluded: they are installation/build/version-control outputs. Installed and lockfile dependency coverage is in [the license inventory](../rights/dependencies.md). The build directory is reproducible, not a second source tree.\n\n| File | Role |\n|---|---|\n" +
    all
      .map(
        (relative) =>
          "| [" +
          relative +
          "](../../" +
          relative +
          ") | " +
          describe(relative) +
          " |",
      )
      .join("\n") +
    "\n",
);
console.log(
  "Generated documentation for " +
    records.length +
    " source/tooling modules and " +
    all.length +
    " project files.",
);
