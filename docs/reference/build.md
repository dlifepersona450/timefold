[Docs home](../README.md) · [Project map](../architecture/files.md) · [Symbol index](../generated/SYMBOLS.md)

# Entry points, configuration, public assets, and output

This chapter covers each non-feature source/configuration file. [Dependency evidence](../rights/dependencies.md) provides exact installed/locked versions and licenses; [upstream references](references.md) identify the versioned documentation used.

## `index.html`: the browser entry

Source: [`index.html`](../../index.html).

| Part | Responsibility and connection |
| --- | --- |
| `<!doctype html>` | Standards-mode HTML document |
| `<html lang="en">` | Language metadata for the English interface |
| UTF-8 meta | Supports punctuation, symbols, and the multilingual-capable font stack |
| Viewport meta | Makes mobile CSS widths correspond to the device viewport |
| `theme-color` meta | Initial browser chrome color; `ui/timeline-view.ts` updates it from the sampled panel color during its batched paint |
| Description meta | Static search/share description; not an automatic biography generator |
| `/favicon.svg` link | Refers to the public root asset, independent of dynamic scene colors |
| `<title>` | Browser/tab title, distinct from `package.json` name |
| `#app` | Empty DOM mount element; `main.ts` inserts the markup returned by `ui/shell.ts` |
| `<script type="module" src="/src/main.ts">` | ES module entry resolved by Vite; production output points at hashed built chunks |

There are no named JavaScript functions in the HTML file. Its linkage is declarative. Without JavaScript, the interactive content is not server-rendered into this empty mount point; the WebGL fallback is a JavaScript-created DOM fallback, not a no-JavaScript document.

The entry module coordinates `ui/`, `audio.ts`, and the `world.ts` facade. Feature modules remain ordinary static ES imports; splitting responsibilities into files does not make them lazy-loaded routes or add runtime dependencies. `world.ts` assembles the `scene/` modules. The [architecture graph](../architecture/README.md), [UI reference](ui.md), and [scene reference](scene.md) map those relationships.

## `package.json`: every field and script

Source: [`package.json`](../../package.json).

| Field | Current value / meaning |
| --- | --- |
| `name` | `timefold`, package identity used by npm |
| `private` | `true`, prevents accidental npm publication; does not establish copyright or a source license |
| `version` | `0.1.0`, package metadata; does not change a story era |
| `type` | `module`, selects Node ES module interpretation for applicable JavaScript files |
| `dependencies.three` | Allowed runtime package range `^0.180.0` |
| `devDependencies.@types/three` | Three.js declaration package, allowed range `^0.180.0` |
| `devDependencies.typescript` | Type checker/compiler API, allowed range `^5.9.3` |
| `devDependencies.vite` | Development/build/preview tooling, allowed range `^7.1.0` |

Exact versions are determined by the [lockfile and dependency inventory](../rights/dependencies.md), not these ranges.

| npm command | Exact command | What runs / changes |
| --- | --- | --- |
| `npm run dev` | `vite --host 0.0.0.0` | Serves source modules with development reload; binds available network interfaces; no production build required |
| `npm run build` | `tsc --noEmit && vite build` | Checks application types first; only then creates static `dist/` |
| `npm run preview` | `vite preview --host 0.0.0.0` | Locally serves an existing production build; does not rebuild or publish it |
| `npm run docs:generate` | `node scripts/build-docs.mjs` | Parses local source, rebuilds documentation inventories |
| `npm run docs:check` | `node scripts/check-docs.mjs` | Read-only local link/freshness/reference validation |
| `npm run docs:licenses` | `node scripts/audit-licenses.mjs --write` | Refreshes saved dependency metadata and exact local notices |

Vite normally uses port 5173 for development and 4173 for preview, but can choose another available port. Use the printed URL. To request a port, pass `-- --port 5174`. To bind only loopback, change the host argument deliberately. There is no hosting registration, public tunnel, deployment command, or account requirement in this configuration.

## `package-lock.json`

Source: [`package-lock.json`](../../package-lock.json). It is npm's generated exact graph: root package metadata; resolved package paths/versions; integrity hashes; dependencies and optional dependencies; platform constraints; development/optional flags and declared license metadata where present.

Use `npm ci` for a clean lockfile-based installation. `npm install` is useful while editing dependencies and may update the lockfile. Do not manually change a version in the lockfile alone. Review it together with `package.json`, rerun the license audit, and preserve updated notices when upgrading runtime packages.

The [complete inventory](../rights/lock-inventory.md) covers every lock path, including platform-specific packages absent on the inspected machine. A development dependency or optional lock entry is not proof that its code runs in the browser.

## `tsconfig.json`: every compiler option

Source: [`tsconfig.json`](../../tsconfig.json).

| Option | Value | Meaning here |
| --- | --- | --- |
| `target` | `ES2022` | Language target used by TypeScript's checking configuration; TypeScript emits no app JS here |
| `lib` | `ES2022`, `DOM`, `DOM.Iterable` | Standard-language and browser/iterable-DOM type declarations available to source |
| `module` | `ESNext` | ES module model for checking |
| `moduleResolution` | `bundler` | Resolution behavior compatible with package exports and bundler-style module imports |
| `strict` | `true` | Enables strict family checks, including implicit-any/nullability rules |
| `skipLibCheck` | `true` | Skips full checking of dependency declaration files, not all application type checking |
| `noEmit` | `true` | TypeScript reports errors without producing a second JS output tree |
| `allowImportingTsExtensions` | `true` | Permits TypeScript-extension imports under this no-emit/bundler setup; current feature imports are generally extensionless |
| `include` | `src` | Application source/declarations are checked; documentation `.mjs` scripts and Vite config are outside this include set |

A non-null assertion such as `querySelector(...)!` is a compile-time assertion, not a runtime existence check. DOM IDs/types must still match actual markup. Interfaces do not validate remote JSON. [Contracts](../architecture/contracts.md) identifies semantic assumptions that type checking cannot enforce.

## `vite.config.ts`

Source: [`vite.config.ts`](../../vite.config.ts). It imports `defineConfig` from Vite and default-exports a configuration object wrapped by that helper. There are no custom plugins, server routes, aliases, environment secrets, or application functions in this file.

The configuration path is:

```text
build
└── rollupOptions
    └── output
        └── manualChunks
            └── three: ["three"]
```

For the installed Vite 7 toolchain, `rollupOptions` customizes Rollup output. The `three` manual chunk separates the Three.js package from the smaller app chunk, which helps reuse a stable library chunk when application code changes. It does not lazy-load the scene or reduce all graphics memory automatically. Production HTML/CSS/JS filenames contain content hashes.

Use [Vite 7 references](references.md) for this implementation; current/latest Vite documentation can describe a different major's bundler. No custom `base` is configured, and public URLs start at `/`; deploying under a nested subdirectory needs deliberate base/asset-link changes and a verification pass.

## `src/vite-env.d.ts`

Source: [`src/vite-env.d.ts`](../../src/vite-env.d.ts). Its triple-slash directive references `vite/client`, adding ambient declarations for Vite features such as `import.meta.hot`. It defines no application variables and emits no runtime script. It does not enable hot reload by itself; the dev server supplies that behavior.

## `.gitignore`

Source: [`.gitignore`](../../.gitignore). Three patterns:

- `node_modules/`: installed dependencies; reproduce using the package/lock files.
- `dist/`: generated production output; rebuild instead of editing it.
- `.DS_Store`: macOS directory metadata unrelated to the project.

No rule excludes project docs or notices. Preserve the notices with the distribution to which they apply.

## `public/favicon.svg`

Source: [`public/favicon.svg`](../../public/favicon.svg). The original code-native icon has a `40 × 40` viewbox, a rounded dark rectangle, and a set of outlined nested polygon/connecting paths. `fill`, `stroke`, and `stroke-width` are SVG attributes, not Three.js materials. It uses a fixed pale accent; `ui/shell.ts`'s inline header mark is another SVG string, not a runtime import of this file.

Changing this asset updates the tab icon after cache/reload, not the animated hypercube or the inline logo. For all three to match, edit the relevant independent representations. [Asset provenance](../../ASSET_SOURCES.md) records their original construction.

## `public/memories/first-world.html`

Source: [`public/memories/first-world.html`](../../public/memories/first-world.html). A complete standalone fictional notebook post, linked by `eraContent[0].resources.journal[0].url`.

It has its own charset/viewport/title, cream-and-brown inline CSS, a `<main>` article, a date/age label, narrative paragraphs, a provenance footer, and a root return link. Its CSS styles `body`, `main`, `small`, `a`, `h1`, and `footer`; these do not enter the main app stylesheet. It contains no JavaScript functions or external assets.

Every inline CSS rule in that sample post is intentionally small:

| Selector | Exact declarations and effect |
| --- | --- |
| `body` | `margin: 0`; background `#ede0cb`; text `#483a35`; `18px/1.8 Georgia, serif` sets a readable cream-paper article |
| `main` | `max-width: 650px`; `margin: 12vh auto`; `padding: 0 28px` centers a responsive reading column |
| `small, a` | `11px/1.6 monospace`; `.05em` letter spacing; `#86564c` metadata/link color |
| `h1` | Weight `400`, size `54px`, line height `1.05` for an editorial title |
| `footer` | `margin: 50px 0 30px`; `padding-top: 20px`; `1px solid #483a3533` top border; `13px` text separates the sample/provenance note |
| `a` | `display: inline-block`; `padding: 12px 0` gives the return link vertical room |

Editing it updates the linked page. Editing the resource record changes its card/link in the archive. Neither operation imports this article into `journal.text`; featured memory and linked post are separate authored surfaces.

## `public/fonts/`

Five WOFF2 files support three families:

| Files | CSS family / role |
| --- | --- |
| `dm-sans-normal-400.woff2` | DM Sans body/interface face; shared URL is registered by multiple weight rules |
| `ibm-plex-mono-normal-400.woff2`, `ibm-plex-mono-normal-500.woff2` | IBM Plex Mono metadata/code/navigation |
| `instrument-serif-normal-400.woff2`, `instrument-serif-italic-400.woff2` | Instrument Serif editorial headings and italic emphasis |

The three `*-OFL.txt` files retain exact notices. Filenames alone are not a font-version audit; [asset sources](../../ASSET_SOURCES.md) records inspected font metadata, origin, versions, and hashes. The complete [CSS reference](styles.md) shows each `@font-face` declaration, weight registration, source URL, and fallback stack.

## `public/licenses/`

`three-LICENSE.txt` is an exact copy of `node_modules/three/LICENSE`. `README.txt` points to that text and the public font notices. Vite copies these into `dist/`, so a static distribution includes the runtime/font permission texts even when minification removes comments from JS. After upgrading Three.js, refresh the public copy as described in [rights maintenance](../rights/README.md).

## Production output

A successful build produces HTML, CSS and JavaScript chunks plus copied static files. It does not ship TypeScript declarations as executable app logic, run a server backend, upload anything, or include this whole source manual automatically. Source and static-output distributions have different notice/asset contents; preserve the appropriate ones. [Verification](../learn/09-verification.md) includes commands for checking the built notices.

## Documentation showcase assets

The WebP files in [`docs/showcase/`](../showcase/README.md) are screenshots for the project README, not runtime textures or Vite `public/` assets. They stay in a source distribution and are not copied to `dist/` automatically. The capture notes list each view and explain how to refresh the images after a visual change. [Asset sources](../../ASSET_SOURCES.md) records their provenance alongside the procedural scene that generated them.
