# TIMEFOLD documentation

This is the learning and maintenance manual for the actual project in this folder. It explains the code that exists: a TypeScript/Three.js archive, four authored eras, seven selectable categories, changing atmosphere, a stylized aging person, and linked memories. It also distinguishes implemented behavior from possible extensions.

## Choose a route

| Your goal | Start here |
| --- | --- |
| Run the project for the first time | [Setup and build](learn/01-setup.md) |
| Learn to build an experience like this from scratch | [Learning path](learn/README.md) |
| Understand the whole system and its connections | [Architecture](architecture/README.md) |
| Follow the smaller scene and interface modules after the refactor | [Scene modules](reference/scene.md) and [UI modules](reference/ui.md) |
| Understand smooth transitions, batching, idle frames, and counters | [Performance and motion](reference/performance.md) |
| Find what a file does | [Project map](architecture/files.md) or [every file](generated/FILES.md) |
| Look up any function, callback, parameter, variable, or type field | [Complete symbol index](generated/SYMBOLS.md) |
| Understand a function rather than just find its declaration | [Module reference library](reference/README.md) |
| Add a new project, post, game, artwork, or progress update | [Content authoring](CONTENT.md) |
| Change years, ambient colors, object forms, age, or clothing | [Timeline authoring](TIMELINE.md) |
| Find every CSS selector and property value | [Generated stylesheet ledger](generated/STYLES.md) and [styles explained](reference/styles.md) |
| See the exact values in each sample chapter | [Generated era data](generated/DATA.md) |
| Reuse or replace an asset and check its provenance | [Asset sources](../ASSET_SOURCES.md) and [rights guide](rights/README.md) |
| Find upstream documentation and inspirations | [Reference bibliography](reference/references.md) |
| See the actual result or refresh the README images | [Showcase captures](showcase/README.md) |
| Check a change or keep this manual current | [Verification and documentation maintenance](learn/09-verification.md) |
| Understand unfamiliar vocabulary | [Glossary](reference/glossary.md) |

## Suggested reading order

1. [What lives where](architecture/files.md): distinguish source, static assets, dependencies, generated output, and documentation.
2. [Runtime journey](architecture/runtime.md): follow startup, a time change, a 3D click, an object panel, and cleanup.
3. [Data model](reference/archive.md) and [time math](reference/timeline.md): understand the shared contracts before changing geometry.
4. [Interface controller](reference/interface.md), [UI modules](reference/ui.md), [world facade](reference/world.md), [scene modules](reference/scene.md), and [styles](reference/styles.md): follow how the DOM and WebGL systems divide markup, behavior, rendering, and cleanup. Read [performance](reference/performance.md) alongside the scene lifecycle to understand the work done per frame.
5. [Procedural objects](reference/objects.md), [person](reference/person.md), [portrait](reference/portrait.md), [art](reference/art.md), and [game](reference/game.md): study individual features.
6. [Contracts and limits](architecture/contracts.md), [build configuration](reference/build.md), and [tooling](reference/tooling.md): make informed changes and maintain the project.

The declaration catalog covers authored application source, configuration, and documentation scripts. Third-party library internals are linked to upstream API documentation and license records; they are not copied into a second library manual.

## Three complementary levels

**Lessons** explain why an implementation is built in a particular order. **Semantic references** explain each module's state, functions, local variables, algorithms, and connections. **Generated inventories** enumerate every declaration and callback, including small local names such as `i`, `x`, `p`, and `node`, with their scope and source location. Repetitive data values are grouped by era instead of copied across unrelated chapters.

The generated pages are exact indexes, not a substitute for explanations. Initializer snippets in symbol tables are abbreviated; the linked source contains full bodies, and semantic references explain the behavior. The era data inventory preserves the authored leaf expressions and values.

## Keep the manual in sync

After changing source, update the relevant explanatory page, then run:

```bash
npm run docs:licenses  # refresh dependency evidence when dependency inputs change
npm run docs:generate # rebuild symbol, data, import, file, and hash inventories
npm run docs:check    # check local links, coverage, and source freshness
npm run build        # TypeScript checking and production bundle
```

`docs:check` is local and does not crawl external websites. Source hashes detect stale inventories; they cannot prove that an explanation is correct. Review the semantic page when behavior changes. [Tooling](reference/tooling.md) documents every documentation script and its limitations.

## Scope and provenance

The life story, dates, person, memories, and future are fictional demo content. Red-past/blue-future is an artistic mapping, not a physical law. The project uses original procedural visuals and bundled licensed fonts; sources and third-party notices are separately inventoried. A citation records a reference, while permission to copy an asset comes from its license or rights holder. See [the rights guide](rights/README.md) before redistributing or importing outside work.

Return to [project README](../README.md) or [creative concept](../CONCEPT.md).
