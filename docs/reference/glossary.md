[Docs home](../README.md) · [Learning path](../learn/README.md) · [References](references.md)

# Glossary in the context of this project

| Term | Meaning here | Read more |
| --- | --- | --- |
| 2.5D | Flat/layered imagery arranged in depth, often with shallow 3D relief; not a separate browser dimension mode | [Objects](objects.md), [art](art.md) |
| Pseudo-4D timeline | A spatial metaphor for time through authored room snapshots | [Architecture](../architecture/README.md) |
| 4D projection | Actual four-coordinate hypercube rotation/projective math producing a drawable 3D wireframe | [World](world.md) |
| Archive category | Stable ID connecting a scene root to content, e.g. `photos` | [Data](archive.md) |
| Era | One authored year/appearance/content snapshot | [Timeline editing](../TIMELINE.md) |
| Normalized progress | A number from 0 to 1 spanning the whole journey | [Time math](timeline.md) |
| Linear interpolation / lerp | `a + (b - a) * t` between two values | [Time math](timeline.md) |
| Exponential easing | Frame-time-aware approach to a target using `1 - exp(-speed * dt)` | [World](world.md) |
| `dt` | Elapsed frame time in seconds, clamped to avoid unstable interpolation | [World](world.md) |
| Scene graph | Parent/child hierarchy of objects whose transforms compose | [World](world.md) |
| Local/world coordinates | Position relative to a parent versus the composed scene position | [Object geometry](objects.md) |
| Camera / view | Position/orientation/projection used to render the scene | [World](world.md) |
| Perspective | Distant objects appear smaller according to field of view/depth | [World](world.md) |
| NDC | Normalized device coordinates; pointer positions mapped to roughly -1..1 for ray construction | [World](world.md) |
| Raycasting | Testing a camera ray against candidate geometry to identify a hit | [World](world.md) |
| Selectable root | Group carrying `userData.id` and registered for picking/focus | [Contracts](../architecture/contracts.md) |
| Culling | Omitting an object/display from drawing or picking; does not necessarily unload it | [World](world.md) |
| Mesh | Geometry paired with material and transform | [Objects](objects.md) |
| Material | Surface rendering parameters such as color, roughness, metalness, transparency | [Objects](objects.md) |
| Texture | Image-like data sampled by a material; here often a generated canvas | [Art](art.md) |
| Canvas 2D | Browser immediate drawing API used for the game and generated images | [Game](game.md), [art](art.md) |
| WebGL | GPU-oriented browser graphics API used through Three.js | [World](world.md) |
| SVG | Vector markup used for the logo/portrait/map | [Portrait](portrait.md) |
| RAF | `requestAnimationFrame`, browser frame scheduling | [World](world.md) |
| DOM | Browser document elements, controls, dialogs, and text | [Interface](interface.md) |
| Native dialog | HTML `<dialog>` opened with `showModal()` | [Interface](interface.md) |
| CSS custom property | Named inherited style value such as `--accent` | [Styles](styles.md) |
| Cascade | Rules resolving which CSS declarations apply by origin, specificity, and order | [Styles](styles.md) |
| Type / interface | Compile-time description; not a runtime validator | [Data](archive.md) |
| AST | Abstract syntax tree, parsed source structure used for the declaration index | [Tooling](tooling.md) |
| Module | File with explicit imports/exports | [Import inventory](../generated/IMPORTS.md) |
| Bundle / chunk | Built JavaScript module output, potentially grouped for caching | [Build](build.md) |
| Lockfile | Exact dependency-resolution metadata, distinct from allowed manifest ranges | [Dependencies](../rights/dependencies.md) |
| HMR | Development hot-module replacement/disposal behavior | [Interface](interface.md) |
| Disposal | Releasing listeners, frames, or GPU resources owned by a module | [World](world.md) |
| Resource card | Authored external/local link or milestone inside a category/era | [Content](../CONTENT.md) |
| Snapshot history | Explicitly authored versions, not automatically reconstructed progress | [Content](../CONTENT.md) |
| Provenance | A record of where an asset/code/reference came from | [Asset sources](../../ASSET_SOURCES.md) |
| Attribution | Credit; distinct from a license granting permission to copy | [Rights](../rights/README.md) |
| MIT / OFL | Licenses used by particular third-party dependencies/fonts, not an automatically chosen license for the whole project | [Notices](../../THIRD_PARTY_NOTICES.md) |
