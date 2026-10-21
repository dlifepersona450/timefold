# Asset sources and provenance

[Documentation home](docs/README.md) · [Rights guide](docs/rights/README.md) · [Reference register](docs/reference/references.md) · [Third-party notices](THIRD_PARTY_NOTICES.md)

Inventory inspected **21 October 2026**. This register covers files and runtime-generated creative material in the current prototype. It distinguishes project-created material from licensed third-party files and references that are not included. It does not choose a license for the project's own work; see [the project-license status](docs/rights/README.md#the-projects-own-license-is-still-undecided).

## Project-created visual, audio, and text material

“Project-created” means authored for this prototype during the development session, including code-assisted construction. It does not assert an external artist credit, an exclusive-rights determination, or that similarity to any existing work has been exhaustively checked. No image-generation raster output or externally downloaded stock image/model is required for the items below.

| File or generating source | Material delivered/displayed | Origin and linkage | Third-party creative asset bundled? |
| --- | --- | --- | --- |
| `src/world.ts`, `src/scene/` | Corridor, doors, tiled floor, lights, fog, diorama strata, frame placement, floating dust, projected hypercubes | The world facade assembles local scene modules; `scene/build.ts` constructs original geometry and generated `art.ts` surfaces; `scene/hypercube.ts` projects local 4D points; Three.js and its geometry-merging utility retain their software license | No imported models, room textures, or architectural photographs |
| `src/temporal-objects.ts` | Computers, cameras, consoles, journals, food vessels, globes/maps for four eras | Procedural shapes constructed for the prototype; labels can be painted on local canvases | No branded hardware model or downloaded prop |
| `src/person.ts` | Fictional inhabitant at four ages, hair, body proportions, outfits, accessories | Primitive meshes assembled using authored `PersonState` values | No scanned person, actor likeness, or imported character mesh |
| `src/portrait.ts` | Matching portrait in the person detail panel | Locally generated SVG/data URL from the same fictional person data | No portrait photograph |
| `src/art.ts` | Landscape studies, food still lifes, paper grain; gallery images and scene textures | Canvas 2D commands, authored palettes, deterministic seeded noise; `imageData()` produces browser data URLs; `world.ts` uses `CanvasTexture` | No remote photos, stock illustrations, or scraped images |
| `src/game.ts` | Isometric grid, walls, player, fragments, doorway, on-screen controls | Canvas 2D drawing and local grid/movement rules authored for this prototype | No third-party sprite sheet, game artwork, sound effect, or level map |
| `src/audio.ts` | Optional ambient chord | Web Audio sine oscillators at 55, 82.41, 110, and 164.81 Hz mixed locally after the sound toggle; the module owns audio initialization, visibility and cleanup | No audio recording, music track, movie score, or sample file |
| `src/archive.ts` | Fictional life timeline, captions, projects, memories, journal, progress snapshots | Authored sample narrative. The birth year 1988 and ages 10/24/38/68 are fictional; future content is speculative | No imported autobiography or copied external posts |
| `public/memories/first-world.html` | “A secret door behind the desk” sample local journal post | Authored illustrative 1998 notebook entry linked from the archive | No copied book, film dialogue, or external blog article |
| `public/favicon.svg` | Small folded geometric symbol | Project-created SVG paths and background; no external logo file | No licensed brand mark imported |
| `src/style.css` data-URI SVG | Subtle grain overlay | Inline SVG `feTurbulence`/rectangle/filter markup authored in CSS | No texture image download |
| `src/main.ts`, `src/ui/`, `src/style.css` | UI labels, timeline controls, dialogs, cards, graphic composition | The controller coordinates locally authored shell/panel templates and behavior in `ui/`; fonts separately licensed below; arrows/symbols are text characters | No external UI image kit or icon font |

`public/` currently contains the favicon, five fonts, their three notices, the sample post, and the runtime-license index/copy. Photos in the default experience are generated illustrations even though their archive category is called “Photography.” Labels and alt text should continue to distinguish illustrative demos from actual photos or biography until replaced with real work.

## README showcase screenshots

The following WebP images are captures of this running application, created for its documentation. They show the original procedural environment, fictional sample content, interface, and separately licensed fonts described above. They are not downloaded reference images, film stills, stock photographs, or AI-generated concept artwork. Their appearance is evidence of the prototype's rendered result rather than evidence of a real person's life or work.

| Documentation file | Captured view / linkage |
| --- | --- |
| [`docs/showcase/timefold-1998.webp`](docs/showcase/timefold-1998.webp) | Childhood desktop room and warm palette; used by the README's era comparison |
| [`docs/showcase/timefold-2026.webp`](docs/showcase/timefold-2026.webp) | Present desktop room; README hero and comparison image |
| [`docs/showcase/timefold-2056.webp`](docs/showcase/timefold-2056.webp) | Imagined future desktop room and cool palette |
| [`docs/showcase/traveller.webp`](docs/showcase/traveller.webp) | Traveller detail panel with its generated portrait and authored chapter story |
| [`docs/showcase/mobile.webp`](docs/showcase/mobile.webp) | Responsive scene and timeline in a mobile viewport |

The [capture notes](docs/showcase/README.md) describe how to reproduce and refresh these views. Files under `docs/showcase/` are source-documentation assets and are not automatically copied into the static site. They do not assign a new license to the project or remove the applicable font/software notices.

## Bundled font files

The local license notices and embedded binary copyright/name/version records were inspected. Source repositories below are the upstream family projects, **not** an assertion that an exact historic download URL, release commit, or conversion command has been recovered. No acquisition log was present for the original WOFF2 downloads. Keep the local binary hashes as identifiers of the actual shipped files.

| Local file under `public/fonts/` | Embedded family/style and version | Use in this app | Source family and license |
| --- | --- | --- | --- |
| `dm-sans-normal-400.woff2` | DM Sans 9pt Regular; `Version 4.004;gftools[0.9.30]` | Main interface/body; the same file is referenced by CSS declarations at 400, 500, 600, and 700 | [DM fonts upstream](https://github.com/googlefonts/dm-fonts); [local DM Sans OFL](public/fonts/dm-sans-OFL.txt) |
| `ibm-plex-mono-normal-400.woff2` | IBM Plex Mono Regular; `Version 2.3` | Monospaced interface metadata | [IBM Plex upstream](https://github.com/IBM/plex); [local IBM OFL](public/fonts/ibm-plex-mono-OFL.txt) |
| `ibm-plex-mono-normal-500.woff2` | IBM Plex Mono Medium; `Version 2.3` | Medium monospaced interface metadata | [IBM Plex upstream](https://github.com/IBM/plex); [local IBM OFL](public/fonts/ibm-plex-mono-OFL.txt) |
| `instrument-serif-normal-400.woff2` | Instrument Serif Regular; `Version 1.000; ttfautohint (v1.8.4.7-5d5b);gftools[0.9.27]` | Serif titles | [Instrument Serif upstream](https://github.com/Instrument/instrument-serif); [local Instrument OFL](public/fonts/instrument-serif-OFL.txt) |
| `instrument-serif-italic-400.woff2` | Instrument Serif Italic; same version string as regular | Italic serif text | [Instrument Serif upstream](https://github.com/Instrument/instrument-serif); [local Instrument OFL](public/fonts/instrument-serif-OFL.txt) |

Exact family copyright lines supplied with the fonts:

```text
DM Sans:
Copyright 2014 The DM Sans Project Authors (https://github.com/googlefonts/dm-fonts)

IBM Plex:
Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"

Instrument Serif:
Copyright 2022 The Instrument Serif Project Authors (https://github.com/Instrument/instrument-serif)
```

The IBM font binaries also contain `Copyright 2017 IBM Corp. All rights reserved.` Their bundled OFL notice supplies the permissions; retain both the binary metadata and supplied license. The DM Sans binary includes variable-font instances despite its project filename ending in `400`; this register reports the actual CSS wiring and embedded metadata rather than assuming that the filename describes the whole font's capabilities.

| Binary filename | Bytes | SHA-256 |
| --- | ---: | --- |
| `dm-sans-normal-400.woff2` | 36932 | `9fea608a947e67020c33cad9a6fe3d60c54119dfb8cff87768a8117a15ed7543` |
| `ibm-plex-mono-normal-400.woff2` | 14708 | `08949f728dc52d528e69b1667d15c89a5686a4ee9a296ff90983985f99c380f7` |
| `ibm-plex-mono-normal-500.woff2` | 14888 | `01d285447409c8a588692162439a038b8cbd7871309ee20267b0d2d91c6e8e22` |
| `instrument-serif-normal-400.woff2` | 21032 | `5eb09b5ac0e28b67c2f041c8ba6d244604ca0c0980d65912ab2d47fed84ddc31` |
| `instrument-serif-italic-400.woff2` | 22128 | `5a51946dfffa82972bc98745359c46761515641fda557c25116459a9f83da4a7` |

All five are self-hosted and loaded from `/fonts/`; the bundled CSS does not request Google Fonts at runtime. Browser fallback families (`sans-serif`, `monospace`, and `Georgia, serif`) refer to fonts installed on the visitor's system, not additional font binaries shipped by this project.

## Software is inventoried separately

Three.js provides the rendering implementation and is included in the production JavaScript. The font assets above remain separately licensed. Vite, TypeScript, and type/build dependencies are development tooling. For all 74 locked package paths, see the [complete dependency inventory](docs/rights/lock-inventory.md), [machine-readable source data](docs/rights/dependency-inventory.json), and [notice register](THIRD_PARTY_NOTICES.md).

## Reference-only material absent from the bundle

| Reference | How it informed the brief | Included material / permission status |
| --- | --- | --- |
| [Rachel Wei portfolio](https://rachelqrwei.ca/) | Interactive personal diorama/portfolio direction named by the user | Reference link only; no screenshot, site code, model, or image copied into the asset set |
| [Blink Industries](https://www.blinkindustries.tv/) | User's broad reference to isometric rooms | No specific work was identified in the brief; no studio asset is bundled and no permission is claimed |
| [Interstellar, official film page](https://www.paramount.com/movies/interstellar) | Spatial metaphor for time and impossible architecture | No film still, movie clip, dialogue excerpt, score, logo, or named character asset bundled |
| Backrooms / liminal spaces | General empty-space/repetition mood | No individual original photograph, horror entity, game level, film sequence, or community story is attributed or reproduced; the brief did not identify a specific work |
| [NASA Doppler-shift explanation](https://science.nasa.gov/asset/webb/doppler-shift-of-a-stars-spectrum/) | Vocabulary for warm past/cool future palette | Explanatory link only; its illustration is not bundled; no claim that past and future inherently have those colors |
| OpenAI-hosted iridescent ribbon image linked in the original brief | Abstract liquid/holographic reference for the second concept | Not downloaded or embedded; creator, license, and exact provenance were not established by the brief's hosting URL |

The full original ribbon URL is preserved in the [reference register](docs/reference/references.md#image-reference-from-the-original-brief). Asset licenses are not inferred from their hostnames. Referencing a film, studio, artist, or general genre does not imply their endorsement.

## Add a new entry

When an asset is added, create an exact-path row above or a new section with: creator/rightsholder as stated, source URL/version, acquisition date, license/permission evidence, required attribution, changes, and relevant consent for real people/private material. Link the row to its local notice file. For your own newly authored work, say that clearly and choose its publishing terms deliberately; do not label it public domain by default.

Replacing a gallery `src` with an external URL does not avoid copyright requirements. It also changes runtime networking and availability. The [content guide](docs/CONTENT.md) covers the URL/data wiring; the [rights guide](docs/rights/README.md#add-photographs-art-models-music-or-text-with-a-usable-record) covers the corresponding record.
