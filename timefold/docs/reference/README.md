[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Complete symbol index](../generated/SYMBOLS.md)

# Module reference library

Each page explains actual source, including functions, parameters, state, variables, side effects, and connections. The generated index adds a declaration-by-declaration lookup for every local binding and callback. Follow the source link from a page when you want to compare the explanation with its implementation.

| Source | Detailed reference | Main responsibility |
| --- | --- | --- |
| `src/archive.ts` | [Data model](archive.md) | Categories, schemas, era configuration, memories, resources |
| `src/timeline.ts` | [Time sampling](timeline.md) | Normalized progress, chapter anchors, years, age, CSS palette math |
| `src/main.ts`, `src/audio.ts` | [Interface controller and sound](interface.md) | Requested state, dialogs, input, lifecycle ownership, optional audio |
| `src/ui/*.ts` | [Interface modules](ui.md) | Shell markup, cached elements, formatting, batched timeline paints, detail panels, resources, local controls |
| `src/world.ts` | [WebGL world facade](world.md) | Public interface, scene-controller assembly, callbacks, diagnostics, disposal |
| `src/scene/*.ts` | [Scene modules](scene.md) | Construction, interpolation, picking, frame lifecycle, settings/types, 4D projection, rigid mesh merging |
| Rendering changes and counters | [Performance and motion](performance.md) | Frame scheduling, visibility pause, batched surfaces, shadow updates, measurement limits |
| `src/temporal-objects.ts` | [Object geometry](objects.md) | Six object families across old, modern, and future forms |
| `src/person.ts` | [Person geometry](person.md) | Body proportions, age details, stage clothing, materials |
| `src/portrait.ts` | [Person portrait](portrait.md) | Inline SVG presentation of the same appearance data |
| `src/art.ts` | [Procedural art](art.md) | Generated landscapes and food studies |
| `src/game.ts` | [Mini-game](game.md) | Isometric grid, movement, collectible and win state |
| `src/style.css` | [Styles](styles.md) | Fonts, selectors, layers, themes, dialogs, responsive rules |
| HTML, package/config files, static assets | [Build and file contracts](build.md) | Browser entry, bundling, type checking, public copying |
| `scripts/*.mjs` | [Documentation tooling](tooling.md) | AST index, local links, source fingerprints, license inventory |

Other references: [glossary](glossary.md), [upstream bibliography](references.md), [all project files](../generated/FILES.md), [exact imports](../generated/IMPORTS.md), and [all era values](../generated/DATA.md).

The references describe current behavior. They do not imply that TypeScript types validate runtime user input, that a new text label generates geometry, or that dates automatically import/sort a feed. Those are separate design decisions explained in the relevant page.
