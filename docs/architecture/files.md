[Docs home](../README.md) · [Architecture](README.md) · [Every file](../generated/FILES.md)

# Project files and ownership

This map groups files by what they do. The [generated file inventory](../generated/FILES.md) enumerates every source, document, asset, notice, and script, including binary fonts and exact upstream notices. `node_modules/`, `dist/`, and `.git/` are excluded because they are dependency, build, and version-control outputs rather than authored source.

## Browser entry and configuration

| File | Read by | Meaning and linkage |
| --- | --- | --- |
| [`index.html`](../../index.html) | Browser / Vite | Defines metadata, favicon, `#app`, and module entry `/src/main.ts` |
| [`package.json`](../../package.json) | npm and maintainers | Scripts, dependency ranges, private package marker, module mode |
| [`package-lock.json`](../../package-lock.json) | npm | Exact resolved versions and package integrity graph; commit with dependency changes |
| [`tsconfig.json`](../../tsconfig.json) | TypeScript | DOM/ES2022 type environment, strict checking, bundler resolution, no emitted JS |
| [`vite.config.ts`](../../vite.config.ts) | Vite | Static build and a separate Three.js chunk |
| [`.gitignore`](../../.gitignore) | Git / tooling convention | Excludes dependencies, output, and macOS metadata |
| [`src/vite-env.d.ts`](../../src/vite-env.d.ts) | TypeScript only | Loads Vite client ambient types, including `import.meta.hot` |

The [build reference](../reference/build.md) documents every configuration key and script rather than treating these as unexplained boilerplate.

## Application source

| Group | Files | Responsibility |
| --- | --- | --- |
| Authored state | [`archive.ts`](../../src/archive.ts) | Types, stable categories, four eras, person appearances, per-era memories/resources |
| Time math | [`timeline.ts`](../../src/timeline.ts) | Constants and normalized temporal sampling |
| Controller | [`main.ts`](../../src/main.ts) | Owns requested time, selection, input binding, dialog lifecycle, startup, and application disposal |
| Audio | [`audio.ts`](../../src/audio.ts) | Lazily creates local ambient synthesis, handles visibility/failure, and returns cleanup |
| World facade | [`world.ts`](../../src/world.ts) | Assembles scene-building, animation, picking, and lifecycle controllers behind the `World` interface |
| Mesh factories | [`temporal-objects.ts`](../../src/temporal-objects.ts), [`person.ts`](../../src/person.ts) | Build object and person groups with local coordinates/materials |
| Other visuals | [`art.ts`](../../src/art.ts), [`portrait.ts`](../../src/portrait.ts) | Canvas image studies and SVG portrait |
| Embedded game | [`game.ts`](../../src/game.ts) | Independent isometric game instance and cleanup |
| DOM styles | [`style.css`](../../src/style.css) | Fonts, selectors, layers, variables, breakpoints, theme overrides |

Read a file's [semantic reference](../reference/README.md) for intent and its [symbol inventory](../generated/SYMBOLS.md) for every declaration, parameter, and callback scope.

### Interface modules: `src/ui/`

These modules separate permanent shell markup, cached elements, changing timeline state, and replaceable object panels. Their [UI reference](../reference/ui.md) documents all exported and local helpers.

| File | Owner and linkage |
| --- | --- |
| [`shell.ts`](../../src/ui/shell.ts) | `renderShell` returns the initial interface HTML; `main.ts` inserts it once |
| [`dom.ts`](../../src/ui/dom.ts) | `requireElement` checks markup contracts; `collectInterfaceElements` caches typed shell elements |
| [`format.ts`](../../src/ui/format.ts) | Shared text escaping, safe resource URL resolution, and two-digit formatting |
| [`timeline-view.ts`](../../src/ui/timeline-view.ts) | Coalesces samples into one DOM paint per frame; provides immediate `flush` and pending-paint disposal |
| [`detail.ts`](../../src/ui/detail.ts) | Builds the per-era context, renders detail content/resources, owns panel listeners and cleanup |
| [`panels.ts`](../../src/ui/panels.ts) | Seven category renderers in a typed registry, plus their shared `PanelContext` |
| [`panel-controls.ts`](../../src/ui/panel-controls.ts) | Gallery/place interaction and game mounting after panel markup exists |
| [`resources.ts`](../../src/ui/resources.ts) | Linked work cards, authored status/progress, and optional outbound links |

### Scene modules: `src/scene/`

Each file owns a distinct part of the scene's lifetime. The [scene reference](../reference/scene.md) explains its functions and local state, while the [performance reference](../reference/performance.md) explains why the frame/shadow/batching boundaries matter.

| File | Owner and linkage |
| --- | --- |
| [`build.ts`](../../src/scene/build.ts) | Constructs corridor, lights, displays, rigid objects, people, labels, dust, and room-indexed pick targets |
| [`animation.ts`](../../src/scene/animation.ts) | Owns target/current time, camera/look targets, focus, hover scale, display visibility, palette and shadow invalidation |
| [`picking.ts`](../../src/scene/picking.ts) | Owns canvas pointer handlers, reusable raycast storage, hovered-root stability, and category callbacks |
| [`lifecycle.ts`](../../src/scene/lifecycle.ts) | Creates/configures renderer; owns viewport, RAF scheduling, visibility pause, diagnostics, and GPU disposal |
| [`hypercube.ts`](../../src/scene/hypercube.ts) | Creates 4D vertices/edges and updates their projected 3D line positions |
| [`merge-static.ts`](../../src/scene/merge-static.ts) | Batches compatible rigid opaque meshes within a root while retaining transparent meshes separately |
| [`settings.ts`](../../src/scene/settings.ts) | Named rendering, damping, shadow, culling, and picking constants |
| [`types.ts`](../../src/scene/types.ts) | Shared `SceneGraph`, target/float records, and copied diagnostic-counter shape |

## Static public files

`public/` is copied to the output root without module transformation. The file `public/memories/first-world.html`, for example, is requested as `/memories/first-world.html`.

- [`public/favicon.svg`](../../public/favicon.svg): original small geometric icon. Its static colors are independent of the dynamic canvas theme.
- [`public/memories/first-world.html`](../../public/memories/first-world.html): standalone fictional post linked from the childhood notebook. It has its own inline CSS and return link.
- `public/fonts/`: five locally bundled WOFF2 files and three exact font notices. Font-face rules in `style.css` choose the appropriate file.
- [`public/licenses/three-LICENSE.txt`](../../public/licenses/three-LICENSE.txt): exact Three.js runtime license, copied into every static build.
- [`public/licenses/README.txt`](../../public/licenses/README.txt): points static-distribution recipients to the runtime and font notices.

Origins, names, use, and licenses of these files are in [ASSET_SOURCES.md](../../ASSET_SOURCES.md). A file being reachable from `public/` does not establish permission to distribute it; record rights when adding assets.

## Documentation and tooling

- [`README.md`](../../README.md): short project landing page.
- [`CONCEPT.md`](../../CONCEPT.md): creative premise, atmosphere, eras, interaction rhythm.
- [`docs/README.md`](../README.md): navigable manual entry.
- `docs/learn/`: lessons that build up the implementation.
- `docs/architecture/`: file map, dynamic flow, contracts.
- `docs/reference/`: module and configuration details.
- [`CONTENT.md`](../CONTENT.md), [`TIMELINE.md`](../TIMELINE.md): task-focused authoring guides.
- `docs/generated/`: generated declaration/data/import/file inventories and source fingerprints; regenerate rather than hand-edit.
- `docs/rights/`: practical provenance and dependency audit, exact license copies, and machine-readable evidence.
- [`docs/showcase/`](../showcase/README.md): actual application screenshots, their view descriptions, and refresh/provenance instructions; these are documentation assets rather than runtime textures.
- `scripts/`: documentation generation/checking and dependency-license inventory; no script executes the application to infer its content.
- [`ASSET_SOURCES.md`](../../ASSET_SOURCES.md), [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md): top-level provenance/notice entry points.

## Generated directories

`node_modules/` is recreated by installation from the lockfile. Installed packages vary by platform; the lockfile can include optional binaries for other operating systems. [Dependency auditing](../rights/dependencies.md) distinguishes these cases.

`dist/` is produced by `npm run build`: HTML, hashed application/CSS/Three.js chunks, and copied public files. It is not the editable app and does not automatically contain this entire source manual. If distributing source, preserve source notices; if distributing static output, preserve `public` notices that the build copies.
