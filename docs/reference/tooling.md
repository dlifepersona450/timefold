[Docs home](../README.md) · [Generated symbols](../generated/SYMBOLS.md) · [Verification](../learn/09-verification.md)

# Documentation scripts: functions, variables, and outputs

These Node ES modules maintain the manual. They are not imported by `src/main.ts` and do not run in visitors' browsers. They use script-relative project roots, local filesystem reads, and deterministic output rather than executing application modules to guess their data.

## Commands and write boundaries

| Script | Command | Writes |
| --- | --- | --- |
| [`build-docs.mjs`](../../scripts/build-docs.mjs) | `npm run docs:generate` | Only `docs/generated/` inventories |
| [`check-docs.mjs`](../../scripts/check-docs.mjs) | `npm run docs:check` | None; reports errors or JSON summary |
| [`audit-licenses.mjs`](../../scripts/audit-licenses.mjs) | `node scripts/audit-licenses.mjs` | None; prints JSON |
| Same audit with `--write` | `npm run docs:licenses` | `docs/rights/` inventories and exact installed-package notices |

The three scripts do not contact the internet. Installation must already provide TypeScript for the AST generator and installed package notices for a complete local license-copy pass. The audit can still record lock-only packages without installation; that is weaker evidence, explicitly marked.

## `build-docs.mjs`: imports and top-level bindings

`fs` supplies synchronous read/write/directory APIs; `path` builds paths; `crypto` hashes exact bytes; `ts` is TypeScript's parser API. TypeScript parses source but does not execute its runtime code.

| Binding | Meaning |
| --- | --- |
| `root` | Parent of this script directory |
| `generated` | `<root>/docs/generated` write root |
| `reference` | Maps root source basenames to semantic pages; grouped modules use `semanticReference` first |
| `cssSource`, `styles`, `styleInventory` | Stylesheet text, parsed rule list, and hash/count/structured inventory |
| `sourceInputs` | All files inside `src/`, including CSS |
| `sourceFiles` | TypeScript source/declaration files plus `vite.config.ts` |
| `scriptFiles` | `.mjs` documentation scripts |
| `records` | AST inventory for every indexed source/tooling module |
| `archivePath`, `archiveText`, `archive` | Path/text/parsed AST for authored data |
| `declarations` | Map of top-level archive variables to their initializer ASTs |
| `eraArray`, `contentArray` | The two authored array initializers |
| `eraPages` | Generated per-era page descriptors |
| `fingerprints` | Project-relative source/config/public/script SHA-256 records |
| `all` | Final project file list, excluding ignored generated/install/VCS directories |

Loop/callback locals are listed exhaustively in [the generated script inventory](../generated/symbols/build-docs.md); their scope distinguishes repeated `file`, `node`, `key`, `i`, and `record` names.

## Every generator helper

| Function / parameters | Result and behavior |
| --- | --- |
| `escapeCell(value)` | Stringifies and escapes table pipes/newlines for Markdown |
| `inline(value)` | Formats an inventory cell as inline code; substitutes embedded backticks so table formatting remains intact |
| `short(value, length = 150)` | Collapses whitespace and abbreviates long initializer snippets with an ellipsis |
| `hash(value)` | SHA-256 hex digest of text/bytes |
| `walk(directory)` | Recursively returns sorted files; skips `node_modules`, `dist`, `.git` |
| `write(relative, text)` | Creates generated output parents and writes text with a final newline |
| `semanticReference(file)` | Maps `src/scene/*` to the scene reference, `src/ui/*` and audio to UI, scripts to tooling, and root modules to `reference`; throws for an undocumented module |
| `symbolSlug(file)` | Removes the source/script prefix and extension, then joins nested path segments with hyphens so equal basenames in different groups retain distinct inventory pages |
| `names(binding)` | Extracts every identifier from an identifier/object/array binding pattern; ignores omitted destructuring entries |
| `isFunction(node)` | Detects function declarations/expressions, arrows, methods, getters, and setters with bodies |
| `functionName(node, source)` | Labels named functions, assigned arrows, properties, event assignments, and anonymous call callbacks by surrounding expression |
| `scopeOf(node, source)` | Walks ancestor functions to build a readable lexical scope path |
| `propertyPath(node, source)` | Builds interface/type/typed-property paths for field inventory |
| `analyze(file)` | Parses TS or JS and returns imports, functions, bindings, parameters, types, typed fields, line count, and hash |
| Local `lineOf(node)` inside `analyze` | Converts AST start position into one-based lookup line |
| Local recursive `visit(node)` inside `analyze` | Examines a node, records matching declarations, then visits children |
| `symbolPage(record)` | Formats one module's full declaration tables and source/reference navigation |
| Local `table(title, headers, rows)` inside `symbolPage` | Appends a standard table or explicit empty section |
| `unwrap(node)` | Removes parentheses, `as`, and `satisfies` wrappers around data initializer expressions |
| `leaves(node, label, source, result = [])` | Recursively enumerates array/object property leaves by authored path; preserves other expressions as source text |
| `cssDeclarations(body)` | Splits properties at semicolons outside quotes/parentheses/brackets; records normalized property/value pairs |
| `cssRules(text, contexts = [], rules = [])` | Recursively reads balanced CSS blocks, preserving media/supports/keyframe/layer/container contexts and source order |
| `describe(relative)` | Assigns a role description to each project file in the generated index |

### `analyze` record fields

`file` is root-relative; `sha256` identifies source bytes; `lines` counts source lines. `imports` records module/binding/line. `functions` records label, scope, AST kind, parameters, explicit return annotation or an inference note, and line. `variables` records every destructured identifier, explicit type or inference note, initializer snippet, scope, and line. `parameters`, `types`, and `fields` give their corresponding names/types/optional markers.

An inferred type is not computed by a full TypeScript type-checker program here. Semantic references describe actual returned values. Initializer snippets are deliberately shortened; this is not a copy of every full source body. Anonymous callbacks are included, even when they have no name in code. Function type signatures appear as typed fields rather than executable functions.

### Generator execution flow

1. Parse CSS rules/custom properties, then find and analyze application/configuration/tooling modules.
2. Write per-file symbol pages and machine-readable `symbols.json`.
3. Write the symbol index.
4. Parse `objects`, `eras`, `birthYear`, and `eraContent` initializers without evaluating them.
5. Write full authored leaf-expression tables per era plus the category/data index.
6. Write exact static import linkage.
7. Hash source, public assets, documentation scripts, and key root configuration files.
8. Write the file inventory, including the inventory file itself on a fresh run.

`photo(...)` remains a constructor expression in a data-value table; the generator does not call it. It does not fetch external images or turn a year expression into an evaluated biography. Full directory and AST callback details are available in its symbol page.

### Output contracts

| Generated output | Purpose |
| --- | --- |
| `STYLES.md`, `styles.json` | Complete CSS declaration/custom-property ledger and structured record |
| `SYMBOLS.md`, `symbols/*.md` | Navigable complete declaration lookup |
| `symbols.json` | Machine-readable function/binding/parameter/type/field evidence |
| `DATA.md`, `data-<year>.md` | Full authored snapshot values, grouped by era |
| `IMPORTS.md` | Literal static-import relationships |
| `FILES.md` | Every project file excluding dependency/build/VCS outputs |
| `source-manifest.json` | Hashes used to detect stale inventories |

The CSS reader handles this stylesheet's quotes, escapes, parentheses, nested contextual blocks, and declarations. It is a small repository-specific parser, not a full CSS standards parser; new syntax such as complex nesting or top-level non-block at-rules may require an extension.

Generated inventories do not update explanatory prose automatically. After changing source, edit the semantic guide, then regenerate. Changing the number/shape of data arrays can require updating generator assumptions; the present parser expects literal ordered `eras` and `eraContent` arrays.

## `check-docs.mjs`: every helper and state

Imports are Node `fs`, `path`, and `crypto`. The script is read-only and sets `process.exitCode = 1` when checks fail.

| Function / binding | Responsibility |
| --- | --- |
| `root` | Script-relative repository root |
| `errors` | Collected validation messages; all found issues are printed |
| `hash(bytes)` | Source-byte SHA-256 comparison |
| `walk(directory)` | Same sorted recursive file discovery/exclusions as the generator |
| `allFiles`, `markdown` | Complete project file list and maintained Markdown documents to inspect |
| `slug(value)` | Approximation of GitHub heading-anchor normalization |
| `anchors(text)` | Builds heading IDs with duplicate suffixes and explicit HTML `id` values |
| `checkedLinks` | Count of inspected local link targets |
| `manifestPath`, `manifest` | Saved source fingerprint location and parsed content |
| `expected` | Current source/public/script/root-config files expected in the fingerprint set |
| `required` | Semantic module-reference names that must exist with substantive content |
| `symbolsPath`, `symbols` | Generated symbol JSON location/content |
| `counts` | Totals for files/functions/variables/parameters/types/fields |
| `filesIndex`, `inventory` | Saved full file index location/text used to detect new unindexed files |

The checker scans local Markdown inline links outside fenced code and inline-code spans, resolves paths relative to the document, checks target existence, and verifies Markdown heading fragments. External protocols are skipped rather than contacted. Exact copied upstream license texts are not rewritten to repair their upstream-relative prose.

It compares fingerprints to current source/assets and checks for removed or newly unindexed files. It also requires the named semantic reference pages, but a minimum size is only a basic completeness guard—not proof of explanatory quality. A success prints JSON with Markdown/link/declaration counts.

The Markdown checker is purpose-built, not a complete CommonMark parser or external broken-link crawler. Exotic nested Markdown link syntax and some renderer-specific heading rules may need adjustment. A passing check is useful evidence, not a substitute for reading the rendered manual.

## License audit

The complete function/variable/field explanation of `audit-licenses.mjs` is in [dependency auditing](../rights/dependencies.md). It documents `packageName`, `repositoryUrl`, `readNotice`, `markdown`, every mapping/filter callback, package records, exact notice copies, deterministic sorting, platform differences, missing-evidence behavior, and `--write` boundaries. Its declarations also appear in [the symbol index](../generated/symbols/audit-licenses.md).

The audit does not refresh the public runtime notice automatically. Copy the exact new Three.js license into `public/licenses/` after changing versions, and preserve the existing OFL texts with the fonts.

## Failure and maintenance rules

- Parse/read/write errors throw; generated output is not an atomic transaction. Resolve the error and rerun rather than treating a partial index as complete.
- All scripts assume the repository structure described here.
- Hashes identify bytes, not ownership, scientific validity, or correctness.
- The file index can include obsolete generated pages if they remain on disk; review/delete obsolete documentation deliberately after removing/renaming a module.
- Run generation after new docs/notices are created so the full file list includes them.
- Keep `npm run build` separate: documentation validation does not type-check or execute the app.
