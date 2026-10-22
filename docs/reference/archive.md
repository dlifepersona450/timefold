[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

# `src/archive.ts` — data model and authored archive

Source: [`src/archive.ts`](../../src/archive.ts). Full declarations: [symbol inventory](../generated/symbols/archive.md). Every authored leaf value is grouped in the [era data inventory](../generated/DATA.md).

This module is the content/configuration boundary. It has no DOM, renderer, network request, file loader, or persistent storage. Importing it creates ordinary objects/arrays and derives two compatibility arrays. Other modules read these values; changing the file affects the next module evaluation/build, not a live server database.

## Complete module-level inventory

| Name | Kind | Purpose and consumers |
| --- | --- | --- |
| `objects` | exported readonly literal array | Stable seven-category catalog; main UI builds the index, counts, headings, and category lookup from it |
| `ArchiveId` | exported type | Union of category ID literals derived from `objects`; connects data, picking, focus, and panel dispatch |
| `EraTheme` | exported interface | All thirteen color fields shared by scene and interface |
| `PersonState` | exported interface | Age, stage, written costume/story, and material colors |
| `ObjectState` | exported interface | Per-era display identity of a persistent category |
| `Era` | exported interface | Chapter year, labels, palette, person, and all category states |
| `birthYear` | exported constant | Fictional 1988 baseline used by the four numeric age expressions |
| `eras` | exported `Era[]` | Ordered spatial/configuration snapshots: 1998, 2012, 2026, 2056 |
| `PhotoMemory` | exported interface | One gallery image's text and optional authored source |
| `PlaceMemory` | exported interface | One location/memory entry; labels, not a geolocation API |
| `ArchiveResource` | exported interface | Linked or text-only project/post/game/art/photo/note record |
| `EraContent` | exported interface | Featured memories and optional resource collections for one era |
| `photo` | private arrow function | Constructs a `PhotoMemory` with generated default alt text |
| `eraContent` | exported `EraContent[]` | Ordered content snapshots aligned by index with `eras` |
| `projectStages` | exported derived array | Compatibility view of `[project.title, project.description]` pairs |
| `journalEntries` | exported derived array | Compatibility view of `[journal.title, journal.text]` pairs |

There are no additional named application functions in this file. Its small `.map` callbacks and helper parameters are listed exhaustively in the generated inventory.

## `objects` and `ArchiveId`

`objects` uses `as const`. TypeScript retains each ID as a literal instead of widening it to arbitrary `string`. `(typeof objects)[number]['id']` selects the union of those ID fields.

| Catalog field | Meaning | Current use |
| --- | --- | --- |
| `id` | Stable machine identity | Object buttons, data keys, `ArchiveId`, panel choice, world roots |
| `name` | Default human label | Initial index template; replaced by the selected era's `objectStates[id].name` |
| `category` | Stable collection subtitle | Detail heading/category metadata; initial index subtitle |
| `mark` | Display number string | Object number and detail footer; not an array index |
| `icon` | Text glyph | Decorative category icon in the index |
| `description` | Baseline catalog description | Authored metadata; the current detail body instead uses the era-specific `ObjectState.description` |

The seven IDs are `projects`, `photos`, `game`, `journal`, `food`, `places`, and `person`. A resource with `type: 'art'` is not a new category ID. Place it under an existing resource key, usually `photos` or `projects`.

Adding a category requires all linked systems described in [identity contracts](../architecture/contracts.md). Adding a record to an existing collection only requires data and any local asset.

## Every `EraTheme` field

All values are six-digit hex strings. The CSS sampler parses RGB bytes; Three.js constructs color objects from the same strings.

| Field | Role | Main read sites |
| --- | --- | --- |
| `accent` | Highlights, outlines, glows, controls | `ui/timeline-view.ts`, scene lights/lines, object factory, person seams, game |
| `background` | Scene background/fog and interface atmosphere | World palette interpolation, CSS `--theme-bg`, game background |
| `wall` | Room wall color | World architecture, game tile alternation |
| `floor` | Floor color | World floor, game tile alternation |
| `plaster` | Columns, ceiling, slab surfaces | World construction, game obstacles |
| `paper` | Pages, pale material, illustrative foreground | Object meshes, journal CSS, game figure |
| `metal` | Hardware and trim | Object meshes, globe/frame details, game inactive doorway |
| `light` | Threshold/key-light and luminous geometry | World, object factory, active game exit |
| `shadow` | Dark surfaces and lower hemisphere | World ambient ground, meshes, game seams/obstacles |
| `ambient` | Hemisphere sky color | World interpolated light; CSS `--ambient` metadata |
| `panel` | HTML drawer/loading/fallback surface | Timeline-view `paint` → `--panel` |
| `text` | Main interface text | Timeline-view `paint` → `--cream`; game labels |
| `muted` | Secondary interface text | Timeline-view `paint` → `--muted` |

CSS variables sometimes keep historical names: `--lime` now receives `theme.accent`, regardless of whether the era is red, white, or blue. See [styles](styles.md). Some physical materials are fixed per room, while scene lighting/fog interpolate globally; this is not a spectral rendering engine.

## Every `PersonState` field

| Field | Type | Meaning and linkage |
| --- | --- | --- |
| `age` | number | Authored numeric age; time display interpolates it; mesh factory adjusts growth/aging within stage limits |
| `stage` | `child`, `young-adult`, `adult`, `elder` | Selects body/costume branch and SVG variation |
| `outfit` | string | Human-readable clothing description; shown in timeline/person detail |
| `description` | string | Life-stage story displayed in person panel |
| `hair` | hex string | Hair/scalp material in mesh and portrait |
| `top` | hex string | Main garment material/fill |
| `bottom` | hex string | Trousers/leg material/fill |
| `skin` | hex string | Skin material/fill in both representations |

`outfit` is descriptive, not a clothing generator. To add a hat, alter geometry/SVG; changing the text alone does not build it. Numeric age does not automatically choose the correct `stage` or turn hair grey; the authored data controls those decisions. See [person](person.md) and [portrait](portrait.md).

`birthYear` is used in expressions such as `1998 - birthYear`. Changing a chapter's `year` string does not rewrite that expression or the prose. Keep them aligned. All values are a fictional sample life.

## Every `ObjectState` and `Era` field

`ObjectState.name` is the selected era's label; `form` describes its physical medium; `description` introduces its panel. The actual form comes from geometry branches, not these words.

| Era field | Meaning |
| --- | --- |
| `year` | Numeric string used by calendar interpolation, labels, screen content, and resource context |
| `name` | Human chapter title |
| `phase` | Short stage label in controls and scene screens |
| `note` | Short room marker note, including authored age prose |
| `color` | Accent metadata retained in the schema; current renderers use `theme.accent`, so changing only `color` will not retheme the app |
| `spectralNm` | Decorative wavelength-study number interpolated for the timeline label |
| `direction` | Written atmosphere/time label shown above the range control |
| `theme` | Complete `EraTheme` object |
| `person` | Complete `PersonState` object |
| `objectStates` | `Record<ArchiveId, ObjectState>`; every category required |

The current hues are brown/red, amber/yellow, white/grey, and blue/black. `spectralNm` is a visual metaphor independent of those RGB choices; 540 nm is not a scientific description of the white/grey chapter. [Color theory/source context](references.md) and [authoring](../TIMELINE.md) explain the distinction.

## `PhotoMemory` and `photo(...)`

`PhotoMemory` fields:

| Field | Meaning |
| --- | --- |
| `title` | Gallery heading for this image |
| `caption` | Gallery body text |
| `art` | Numeric procedural composition variant used when `src` is absent |
| `src?` | Optional authored image URL/path; overrides the fallback image |
| `alt` | Descriptive text for the actual image |

`photo(title, caption, art): PhotoMemory` returns those first three fields and `alt: 'Original layered landscape study: ' + title`. Parameters are local strings/numeric variant; the function has no side effects and does not generate a canvas. Its return is a memory record. `ui/detail.ts` later prepares an image with the era index controlling palette and `photo.art` controlling composition.

If replacing an illustration with a real photograph, set both `src` and meaningful `alt`. The HTML gallery uses these values. Floating scene frames remain generated by `scene/build.ts` unless that construction path is changed as well.

## `PlaceMemory`

`name` is the visible location title, `coordinates` is an authored display string, and `note` is a description. Coordinates may be geographic numbers or a memory label such as “the atlas shelf.” They are not parsed, geocoded, mapped to latitude/longitude, or used to fetch map tiles.

The illustrative map positions pins using the entry index. Its current viewbox/layout is designed for three entries; adding more list records requires adjusting the map layout if additional pins should remain visible. Every list entry can still carry its own text.

## `ArchiveResource`

| Field | Required | Effect |
| --- | --- | --- |
| `id` | yes | Stable authored identity; rendered as `data-resource-id` |
| `title` | yes | Card title |
| `summary` | yes | Card body |
| `date` | yes | Displayed metadata and HTML `datetime`; use ISO `YYYY-MM-DD` |
| `type` | yes | `project`, `post`, `game`, `art`, `photo`, or `note`; labels the card/link |
| `url` | no | Local/relative or absolute HTTP(S) destination, after controller validation |
| `status` | no | Authored status chip |
| `progress` | no | Authored percentage; controller clamps display to 0–100 |

A missing URL creates a valid text-only record. A missing percentage creates no bar. Progress is not calculated from source control, dates, or checklists. Repeating an ID in another era is an authored snapshot relationship; the current code does not join/group these records at runtime.

`resources` is keyed by category, not by resource type. `resources.photos` can contain a resource whose `type` is `art`. See [the content guide](../CONTENT.md) for complete adding/updating examples and local asset paths.

## Every `EraContent` field

| Entry | Fields and rendering path |
| --- | --- |
| `resources?` | Optional partial category record of resource arrays; appended below featured memory |
| `project` | `title`, `description`, `code: string[]`, `tags: string[]`; panel renders escaped code; world forwards code to workstation factory |
| `photos` | `medium`, `items: PhotoMemory[]`; gallery label, image navigation, thumbnails |
| `game` | `title`, `description`, `note`; narrative around the shared mini-game |
| `journal` | `title`, `text`, `reminders: string[]`; featured notebook entry and reminder list |
| `food` | `title`, `description`, `note`, `time`, optional `src`, `alt`; still-life image and ritual text |
| `places` | `PlaceMemory[]`; illustrative map and selectable text list |

The workstation's CRT/earlier laptop terminal uses authored `project.code`; modern/future mesh dashboards use their own drawn blocks. All project detail panels show the authored code. Changing game text does not change map walls or rules. These distinctions prevent content edits being mistaken for geometry/mechanics edits.

## Ordered snapshots and derived exports

`eraContent[i]` belongs to `eras[i]`. Neither array is indexed by year or resource date. The initial data includes a local childhood post and a fictional project `timefold` at 10%, 55%, and 100% across later snapshots. These are examples of authoring structure, not a statement of the owner's biography or actual completion history.

`projectStages = eraContent.map(c => [c.project.title, c.project.description])` and the journal equivalent run once when the module evaluates. They are convenience views retained from the original API. Mutating `eraContent` later would not automatically recompute these arrays. The application currently reads the primary content directly.

## Reproducing this design

1. Define stable category IDs first.
2. Derive a union type from the catalog to avoid spelling drift.
3. Define a complete era schema for appearance and atmosphere.
4. Keep memory data separate from geometry construction.
5. Align ordered config/content arrays, or introduce an explicit ID join if the project grows.
6. Render one category through `id` and one moment through `i`.
7. Add validation before accepting remotely edited data.

Continue with [timeline math](timeline.md), [controller rendering](interface.md), [content authoring](../CONTENT.md), and [data leaf inventory](../generated/DATA.md).
