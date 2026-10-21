# Dependencies and the license-audit script

[Documentation home](../README.md) · [Rights guide](README.md) · [Complete lockfile inventory](lock-inventory.md) · [JSON inventory](dependency-inventory.json) · [References](../reference/references.md)

This page explains every declared dependency, how development packages relate to the browser application, and how the local notice inventory is produced. Exact versions below come from the checked-in `package-lock.json`, inspected **21 October 2026**.

## Direct dependencies

| Name | Manifest range | Locked version | Role and linkage | Declared license |
| --- | --- | --- | --- | --- |
| `three` | `^0.180.0` | 0.180.0 | The only direct runtime package. Imported by `world.ts`, `temporal-objects.ts`, and `person.ts`. Provides renderer, scene, lights, cameras, meshes, vectors, materials, textures, raycaster, and math helpers. `vite.config.ts` puts it in a separate production chunk. | MIT |
| `@types/three` | `^0.180.0` | 0.180.0 | Development declarations consumed by TypeScript. Describes Three.js APIs at check time; not a renderer executed by the visitor. | MIT |
| `typescript` | `^5.9.3` | 5.9.3 | `npm run build` first invokes `tsc --noEmit`, checking types without generating JavaScript. Vite then transforms/bundles source. The TypeScript compiler is not the app's runtime. | Apache-2.0 |
| `vite` | `^7.1.0` | 7.3.7 | Runs `dev`, `build`, and `preview`; loads `vite.config.ts`, serves module development, builds static `dist/`, copies `public/`. The dev client exists during development; a normal production build does not ship the development server. | MIT, with additional bundled notices |

The manifest range is an allowed version range, not the exact installed version. `npm ci` installs according to the lockfile; a later update can change exact versions and notices. The official [npm lockfile documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json) explains the stored metadata. For this installed Vite major, use [Vite 7 documentation](https://v7.vite.dev/guide/) rather than assuming the latest guide's bundler behavior is identical.

## The dependency relationships

The source currently imports no third-party runtime library except `three`. Browser APIs provide DOM, Canvas 2D, SVG, Web Audio, event handling, and timing. No backend, CMS, account SDK, GSAP, React, React Three Fiber, custom shader package, or image-generation runtime is required.

The important development relationships in the local lockfile are:

| Parent / group | Packages or relationship | Why they appear |
| --- | --- | --- |
| `@types/three` | `@dimforge/rapier3d-compat`, `@tweenjs/tween.js`, `@types/stats.js`, `@types/webxr`, `@webgpu/types`, `fflate`, `meshoptimizer` | The broad Three.js declaration package references types for its optional ecosystem/add-ons. Their presence does not mean the prototype uses physics, tween.js, a stats overlay, mesh optimization, WebXR, WebGPU, or compression at runtime. |
| `vite` | `esbuild`, `fdir`, `picomatch`, `postcss`, `rollup`, `tinyglobby` | Transforms, bundling, file discovery, matching, and CSS processing used by the build/dev tool. |
| `vite` optional | `fsevents` on supported Darwin platforms | Platform-specific file-watching support; absent in the inspected Linux installation. |
| `esbuild` | `@esbuild/*` native platform packages | Lockfile lists platform variants; only the compatible executable is normally installed. Inspected machine uses `@esbuild/linux-x64`. |
| `rollup` | `@types/estree`, `@rollup/rollup-*` optional native variants | AST declarations and native parsing/build support; inspected machine includes the Linux x64 GNU package. |
| `postcss` | `nanoid`, `picocolors`, `source-map-js` | Identifiers, colorized terminal output, and source-map handling within the tooling. |
| `tinyglobby` | `fdir`, `picomatch` | Directory traversal and glob matching. |
| Additional locked optional entry | `@napi-rs/lzma-linux-x64-gnu@1.5.1` | Present in the existing lockfile and installed tree, marked development/optional. No dependency edge to it is identified among this project's normal declared dependency entries. The inventory retains the fact of its presence without claiming that the app needs or ships it. |

The [complete table](lock-inventory.md) includes **all 74 locked package paths**, including platform variants not installed on this machine. The [JSON file](dependency-inventory.json) contains each lock entry's explicit `dependencies` and `optionalDependencies`, registry archive URL/integrity, OS/CPU restrictions, local repository link, and notice hashes. A listing in a lockfile is not proof of inclusion in a production bundle.

## Exact notice evidence and its limits

The inspected Linux/x64 tree has 24 of those locked package paths installed. The inventory copies all package-root `LICENSE`, `LICENSE.*`, `COPYING`, `NOTICE`, matching variants, and TypeScript's `ThirdPartyNoticeText.txt` that are present. Every copy retains its original bytes and receives a SHA-256 hash in the JSON record.

Vite's `LICENSE.md` contains Vite's own MIT license plus notices for code bundled into Vite. Rollup's file similarly includes its own and bundled dependency notices. Those complete files are retained even though not every embedded component appears as a separate package in Timefold's lockfile. TypeScript's Apache license and separate third-party notices are both retained. This is more informative than treating every file in a package as necessarily having only its top-level license label.

For installed native `@esbuild/linux-x64`, `@rollup/rollup-linux-x64-gnu`, and `@napi-rs/lzma-linux-x64-gnu`, no package-root license text was present in the inspected package. The inventory records their declared MIT metadata and marks the absence of a local notice. The parent esbuild/Rollup full notices are preserved, but the script does not invent per-binary notices or declare that this resolves every possible redistribution question. Packages absent locally have their declared lockfile metadata recorded without pretending their archive contents were inspected.

The script deliberately does not scan the entire contents of `node_modules`, fetch packages from the network, audit optional platforms by installing them, or license-audit every internal source header. It also does not scan fonts or artistic references. Their records are in [ASSET_SOURCES.md](../../ASSET_SOURCES.md). A clean inventory is evidence preservation, not a legal certification or a vulnerability scan.

## Run the audit

From the `timefold/` directory:

```bash
# Read local metadata and print the inventory. No files are changed.
node scripts/audit-licenses.mjs

# Refresh the saved inventory and exact local notice copies.
node scripts/audit-licenses.mjs --write
```

The script uses only Node built-ins, with no installation or internet access beyond an already existing project/dependency tree. Its directory is resolved from its own module URL, so it also works when invoked using an absolute path from a different working directory. If dependencies are not installed, lock entries remain inventoried but no installed package notices can be copied.

The `--write` mode writes only:

- `docs/rights/dependency-inventory.json`: complete structured record.
- `docs/rights/lock-inventory.md`: readable table linking exact retained notices.
- `docs/rights/licenses/`: copied installed package-root license/notice files.

It does not change `src/`, `public/`, `package.json`, the lockfile, `node_modules`, or `dist/`. It does not automatically refresh the separate Three.js public runtime notice; follow [the rights guide's maintenance steps](README.md#maintain-the-records-when-the-project-changes) after upgrading it. Existing old notice copies are not deleted automatically; the newly generated inventory links only the current record, so review obsolete copies when dependencies change.

Output is deterministic for the same lockfile, installed metadata, notice contents, Node platform, and sorting behavior. No timestamp is inserted. Running it on another OS/CPU or installation will intentionally change installation evidence. The optional command argument recognized is `--write`; other arguments currently do not alter behavior.

## Script module map

Source: [`scripts/audit-licenses.mjs`](../../scripts/audit-licenses.mjs). It is a Node ES module (`.mjs`), separate from Vite's browser entry. Evaluation runs top to bottom, collecting records before printing or writing output. It exports no API and registers no event handlers.

### Imported APIs

| Import | Purpose |
| --- | --- |
| `createHash` from `node:crypto` | SHA-256 identifiers for exact notice bytes and the lockfile |
| `existsSync` | Check if the local installed package metadata exists |
| `mkdirSync` | Create documentation output directories only in `--write` mode |
| `readFileSync` | Read lockfile, manifest, local package metadata, and exact notice bytes |
| `readdirSync` | List the installed package root to identify notice filenames |
| `writeFileSync` | Write documentation records/copies only in `--write` mode |
| `dirname` | Find a copied notice destination's parent directory |
| `join` | Construct filesystem paths without manual path separators |
| `relative` | Store an original notice path relative to the project root |
| `fileURLToPath` from `node:url` | Convert the script-relative module URL to a filesystem root |

### Top-level variables and their linkage

| Identifier | Value / responsibility |
| --- | --- |
| `projectRoot` | Parent directory of this script directory, derived from `import.meta.url`; all reads use it |
| `outputRoot` | `<projectRoot>/docs/rights`; all persistent writes stay below it |
| `lock` | Parsed `package-lock.json`; its `packages` map drives the complete list |
| `manifest` | Parsed `package.json`; distinguishes direct runtime and direct development dependencies |
| `shouldWrite` | Whether `process.argv` contains `--write`; gates notice copies and saved output |
| `packages` | Sorted package records built by filtering out the root lockfile entry and mapping every dependency path |
| `inventory` | Top-level JSON payload; source description, schema, lock metadata/hash, platform, counts, `packages` |

### Named functions

| Function and parameters | Return / side effect | How it works |
| --- | --- | --- |
| `packageName(packagePath)` | Package name string | Finds the last `node_modules/` segment and slices the suffix. Handles scoped and nested dependency paths without treating a scope as the package's parent identity. |
| `repositoryUrl(repository)` | Normalized URL string or `null` | Accepts a repository string or `{ url }`, reads local `value`, removes a `git+` prefix and trailing `.git`. It does not contact or verify the repository. |
| `readNotice(packagePath, filename, name, version)` | `{ source, copy, sha256 }`; copies exact bytes only with `--write` | Builds `source`, reads its `content` buffer, builds a safe documentation `destination` from package name/version/notice filename, creates its parent, and writes unchanged bytes. The `source` field is project-relative; `copy` is relative to `docs/rights/`. |
| `markdown()` | Full Markdown table as a string | Builds `rows` from each package `entry`, formats `notices` as local links or explicit evidence gaps, and joins table/provenance text with real newlines. It consumes the already constructed `packages` and `inventory`; it performs no file writes. |

### Inline callbacks and local variables

| Location | Parameters / local variables | Responsibility |
| --- | --- | --- |
| `Object.entries(lock.packages).filter(...)` | Destructured `packagePath` | Excludes `""`, which represents Timefold itself, not a third-party dependency |
| `.sort(...)` | `left`, `right` | Sorts lockfile paths with English locale comparison for predictable order |
| Main `.map(...)` | `packagePath`, `entry` | Converts each locked entry into a stable inventory record |
| Main map locals | `name`, `metadataPath`, `installed`, `metadata`, `noticeFiles` | Name derived from path; expected installed metadata path; installation existence; parsed installed metadata or `null`; matching local notice filename list |
| `readdirSync(...).filter(...)` | `filename` | Selects case-insensitive root notice filenames via the shown regular expression; sorts filenames afterward |
| `noticeFiles.map(...)` | `filename` | Calls `readNotice` once per preserved notice |
| Installed count filter | `entry` | Counts inventory entries whose installed metadata exists |
| `markdown()` outer map | `entry`, local `notices` | Chooses notice links or missing-evidence text for one table row |
| Notice-link map | `notice` | Extracts the final source filename as link label and uses `copy` as target |
| `markdown()` local `rows` | Array of table row strings | Joined after the heading, explanatory text, hash/count, and table header |
| Final `if (shouldWrite)` | No additional persistent state | Creates output directory, writes JSON and Markdown, prints a short count; the other branch prints JSON to stdout |

### Inventory fields

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Format version for consumers of this local script's JSON; currently `1` |
| `source` | Human description of where data was read |
| `lockfileVersion`, `lockfileSha256` | npm lockfile format and exact file identifier; hash changes when any byte of the lockfile changes |
| `platform.os`, `platform.cpu` | Node's `process.platform` and `process.arch` for the inspection machine |
| `packageCount`, `installedCount` | Number of third-party lock paths and number with local package metadata |
| `packages[].name`, `version`, `path` | Package identity, locked version, and actual lock path |
| `declaredLicense` | Lock entry's license, else installed package's declared license, else `null`; a declaration rather than a file-by-file rights conclusion |
| `role` | Direct role from the manifest if present; otherwise classification from lockfile `dev`; not a full graph-reachability proof |
| `optional`, `os`, `cpu` | Stored lockfile platform/optional flags; `null` when unspecified |
| `resolved`, `integrity` | Registry archive URL and package-manager integrity string from the lockfile; the script records but does not redownload/reverify archives |
| `installed`, `installedVersion` | Local metadata presence and its version; compare against locked `version` to notice a stale installation |
| `repository`, `homepage` | Installed package's stated source links when available; absent local packages use `null` here |
| `dependencies`, `optionalDependencies` | Explicit package-to-package version-range edges from the lock entry |
| `notices` | Array of copied/planned local notice descriptors; empty if no notice file is available |
| `notices[].source` | Original local notice location relative to the project root |
| `notices[].copy` | Saved notice location relative to `docs/rights/`; default read-only mode describes the path without creating it |
| `notices[].sha256` | SHA-256 of the source bytes copied by `--write` |

### Failure behavior

Missing/malformed `package.json` or lockfile, unreadable notices, invalid installed metadata, or a write-permission failure causes Node to throw and exit unsuccessfully. The script does not silently replace missing evidence with a made-up license. Absence of a particular installed package is normal and is represented by `installed: false`; an installed package with no root notice is represented by an empty `notices` list.

The read-only mode is useful before regenerating: compare its records with saved JSON, examine unexpected version changes or missing notice evidence, then run `--write` when the installed tree represents the versions you intend to document.
