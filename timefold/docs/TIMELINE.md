# Editing TIMEFOLD's timeline

[Documentation home](README.md) · [Learning path](learn/README.md) · [Data reference](reference/archive.md) · [Symbol index](generated/SYMBOLS.md)

The archive is authored as four snapshots of the same fictional life. The room, its tools, and its inhabitant belong to the same chapter. Traveling blends the atmosphere and camera path; opening an object selects one chapter and its corresponding content.

All dates, memories, projects, and the person are demo material. In particular, the 1988 birth year and imagined 2056 chapter are not the owner's biography.

## Where to change things

| Change                                               | File and entry point                               |
| ---------------------------------------------------- | -------------------------------------------------- |
| Years, chapter names, phase labels, room notes       | `src/archive.ts` → `eras`                          |
| Palette and atmosphere                               | `eras[n].theme`, plus chapter color labels         |
| Person age, life stage, clothing description, colors | `eras[n].person` and `birthYear`                   |
| Per-era object name, form label, description         | `eras[n].objectStates`                             |
| Project, photos, game text, journal, food, travel    | `src/archive.ts` → `eraContent[n]`                 |
| Stable categories, icons, order                      | `src/archive.ts` → `objects`                       |
| Time sampling, calendar interpolation, room spacing  | `src/timeline.ts`                                  |
| Physical object silhouettes                          | `src/temporal-objects.ts` → `createTemporalObject` |
| Physical person, hair, posture, clothing             | `src/person.ts` → `createPerson`                   |
| Matching portrait inside the person panel            | `src/portrait.ts` → `personPortrait`               |
| Room construction and physical layouts               | `src/scene/build.ts`                               |
| Camera, lighting interpolation, display folding      | `src/scene/animation.ts`, `src/scene/settings.ts`   |
| Picking, rendering, viewport, and cleanup             | `src/scene/picking.ts`, `src/scene/lifecycle.ts`    |
| Detail panels and image fallback                     | `src/ui/detail.ts`, `src/ui/panels.ts`             |
| Timeline labels and shared CSS palette               | `src/ui/timeline-view.ts`                          |
| HTML layout and theme use                            | `src/style.css`                                    |

The index of an era links its room, appearance, and `eraContent` entry. Index `0` is 1998, `1` is 2012, `2` is 2026, and `3` is 2056. Keep these arrays aligned when editing or reordering chapters.

## How time behaves

The timeline has **equally spaced chapters**, not equally spaced calendar years. Its normalized range is `0` to `1`:

| Progress | Chapter | Age |
| -------- | ------- | --- |
| `0`      | 1998    | 10  |
| `1 / 3`  | 2012    | 24  |
| `2 / 3`  | 2026    | 38  |
| `1`      | 2056    | 68  |

Within each segment, the displayed calendar year and age interpolate between its endpoints. At progress `0.5`, for example, the display is halfway from 2012 to 2026: **2019, age 31**. The colors interpolate across the same segment. Since the last segment spans 30 years, its calendar advances faster than the earlier 14-year segments.

`sampleTimeline(value)` in `src/timeline.ts` calculates the interface's temporal state. It returns `progress`, `fromIndex`, `toIndex`, `blend`, nearest chapter `index`, rounded `year`, rounded `age`, decorative `wavelengthNm`, and interpolated `theme`. The WebGL scene interpolates lighting and atmosphere from the same era theme endpoints while its camera travels. `timeForEra(index)` returns a chapter's normalized position. `ROOM_SPACING` and `FIRST_ROOM_Z` define the spatial layout.

Each room contains an authored silhouette of the same object categories and person. The child does not continuously grow into a biological adult mesh between rooms: you travel between clearly staged versions. Opening an object snaps to the selected chapter so the physical object, year, and contents agree.

## Edit years and the person's age

Change `eras[n].year` using a numeric year string, keeping the array in chronological order. Edit its name, phase, and note to describe the new chapter. The timeline calculations use these actual year values; there is no separate year list to maintain.

The person currently uses a shared birth year:

```ts
export const birthYear = 1988;
```

Each era's age expression uses its own year, such as `age: 2026 - birthYear`. If you change an era from 1998 to 2000, update both `year: '2000'` and that person's expression to `age: 2000 - birthYear`. If you change `birthYear`, the four existing age expressions update together.

Also update authored strings containing ages or dates: chapter `note`, `person.description`, `objectStates.person.form`, and any memories mentioning a year. The source does not rewrite prose automatically.

## Edit the person and costume

Each `person` entry follows `PersonState`. For example, the present-day configuration can become:

```ts
person: {
  age: 2026 - birthYear,
  stage: 'adult',
  outfit: 'Indigo work jacket + everyday trousers',
  description: 'A maker pausing beside the work in progress.',
  hair: '#55483d',
  top: '#405d88',
  bottom: '#303b49',
  skin: '#c9906f',
},
```

`stage` accepts `child`, `young-adult`, `adult`, or `elder`. It selects the silhouette and costume. Numeric `age` also adjusts height, a child's head/leg proportions, older posture, and facial lines. `hair`, `top`, `bottom`, and `skin` are material colors. `outfit` and `description` are the written account of this version of the person. The matching detail portrait is drawn by `src/portrait.ts`.

The initial progression is a child with a backpack, a young adult with a hoodie and messenger bag, an adult in a work jacket, and an elder with silver hair and a long technical coat. Edit the corresponding stage branch in `src/person.ts` when you want different garment shapes, accessories, hair geometry, or posture. Changing the `outfit` text alone does not generate a new costume mesh. Keep the written outfit and physical clothes consistent.

The person's per-era display name and short form label live separately in `objectStates.person`; the stable archive category lives in `objects`.

## Edit the temporal colors

Every `theme` entry needs all the fields defined by `EraTheme`, written as six-digit hex colors such as `#a4d6ff`. Adjacent themes are blended by `sampleTimeline`; the result drives the room and interface together.

| Fields                     | Role                                  |
| -------------------------- | ------------------------------------- |
| `accent`                   | Primary timeline and interface accent |
| `background`, `shadow`     | Room depth, darkness, and atmosphere  |
| `wall`, `floor`, `plaster` | Architecture surfaces                 |
| `paper`, `metal`           | Archive material palette              |
| `light`, `ambient`         | Light colors                          |
| `panel`, `text`, `muted`   | HTML panels and readable type         |

Start with one chapter's `accent` and `light`, then adjust its surfaces, background, and interface colors together. Keep text readable against the panel and room. `color` is the chapter's accent metadata; keep it consistent with `theme.accent`. `direction` supplies the chapter's color/time description.

The authored sequence is brown/cream/red → amber/yellow → neutral white/grey → blue/black, with green used sparingly as an accent. `spectralNm` holds an approximate visual cue of `680`, `610`, `540`, and `460` nanometers. The wavelength display interpolates these numbers, but the palette is authored independently: this is not a spectral renderer or physical time simulation.

The red/blue direction is an artistic analogy. Redshift describes observed light moving toward longer wavelengths, while blueshift describes shorter wavelengths; the Doppler case relates this to recession or approach. It does not establish a universal past-red/future-blue rule. [NASA's Doppler-shift illustration](https://science.nasa.gov/asset/webb/doppler-shift-of-a-stars-spectrum/) provides the reference behind the metaphor.

## Edit objects and their physical forms

Stable IDs connect the room to its detail panel: `projects`, `photos`, `game`, `journal`, `food`, `places`, and `person`. A category can have a different name in every era. For example, `projects` becomes a family computer, first laptop, slim workstation, and future light workstation.

To rename the 1998 computer, edit its existing `objectStates` entry:

```ts
projects: {
  name: 'The borrowed computer',
  form: 'Beige CRT + keyboard',
  description: 'The machine where the first experiment began.',
},
```

These strings describe the object; they do not build geometry from words. In `src/temporal-objects.ts`, `createTemporalObject(id, eraIndex, palette, year, phase, codeLines?)` selects a category and its era-specific geometry. The optional final argument supplies the visible workstation code from that era's `project.code`. Edit the relevant branch to change the actual monitor thickness, camera lens, console controls, writing surface, vessel, or globe. Keep the returned group compatible with the selectable root assembled in `scene/build.ts`.

Current forms deliberately move from bulky/analogue to modern to speculative. The changes include a CRT becoming a light workstation, a film camera becoming a light-field device, a cartridge handheld becoming luminous rings, and paper becoming suspended light pages. The future forms are design fiction.

## Edit the contents inside an object

Use `eraContent[n]` in `src/archive.ts`; every chapter has the same `EraContent` structure:

| Entry       | Editable content                                                                        |
| ----------- | --------------------------------------------------------------------------------------- |
| `project`   | `title`, `description`, `code` lines, `tags`                                            |
| `photos`    | `medium` label and `items` with title, caption, image, alt text                         |
| `game`      | `title`, `description`, `note`                                                          |
| `journal`   | `title`, `text`, `reminders`                                                            |
| `food`      | `title`, `description`, `note`, `time`, optional image, `alt`                           |
| `places`    | List of `name`, `coordinates`, and `note`                                               |
| `resources` | Optional per-object collections of linked projects, posts, games, art, photos, or notes |

For adding new work and recording release/progress snapshots, follow [CONTENT.md](CONTENT.md). The primary fields above describe each object's featured memory; its `resources` collection can hold multiple pieces of work.

The mini-game shares one playable map across eras; its title and story change. Edit `src/game.ts` to change its mechanics or layout. Editing `eraContent[n].game` changes its narrative, not its game rules.

Replace a photo item in `eraContent[2].photos.items` with your own local asset:

```ts
{
  title: 'Afternoon in Bandung',
  caption: 'The light at the end of an ordinary walk.',
  art: 2,
  src: '/photos/2026-bandung.jpg',
  alt: 'Warm afternoon light across a quiet street in Bandung',
},
```

Put the actual image at `public/photos/2026-bandung.jpg`. Vite serves `public/` from the site root, so the URL omits `public`. `art` selects a procedural composition variant; the bundled studies use values `0` to `3`, while the palette follows the era. Omit `src` to use that generated artwork. Add a `src` and matching `alt` to a food entry the same way. These image fields update the detail gallery; the floating scene frames remain procedural dioramas unless you also change `scene/build.ts`.

The generated artwork is a placeholder. It is not evidence of a real trip or a real photograph. Future memories should retain their speculative framing unless you deliberately change the premise.

`projectStages` and `journalEntries` at the bottom of `archive.ts` are derived compatibility exports. Edit `eraContent`, rather than maintaining separate copies of those lists.

## Replace procedural forms with models

The prototype ships with original procedural geometry. There is no model loader or automatic `model` configuration field yet. To use Blender assets:

1. Export a compact `.glb` into `public/models/`, with a useful origin and scale.
2. Add `GLTFLoader` from `three/examples/jsm/loaders/GLTFLoader.js` and load the local URL such as `/models/1998-computer.glb`.
3. Integrate the model into the matching object creator or person stage. Keep the outer selectable root, object ID, room assignment, and camera target behavior. Match the original object's overall bounds; keep a person's feet at the same local floor height.
4. Cache shared loads, clone appropriately for rooms, preserve shadow settings, and dispose replaced geometry, materials, and textures through the scene lifecycle.
5. Keep procedural geometry as a loading/error fallback, then verify selection, close/return transitions, and mobile performance.

A different mesh for each chapter fits the existing snapshot approach. A single continuously aging character would require an additional rig, morph targets or skeletal animation, and explicit transitions between the age/costume states.

## Add or remove a chapter

Changing an existing chapter is the simplest customization. The timeline helpers derive their chapter count from `eras`, but adding a chapter also requires matching content and artwork:

1. Add a complete `Era`, including all seven `objectStates`, person fields, and theme fields.
2. Add its `EraContent` at the same array index.
3. Add a deliberate geometry/costume variant in `temporal-objects.ts` and `person.ts`. Existing index branches do not invent extra historical forms.
4. Review `scene/build.ts` for corridor dimensions, repeated architecture, lights, and labels; review `scene/animation.ts` and `scene/settings.ts` for the camera's full journey and display folding. `ROOM_SPACING` controls chapter separation; the surrounding corridor must still contain all rooms. The public `world.ts` facade should keep the same control/callback contract.
5. Check procedural-art indices, chapter controls, mobile layout, and text containing hard-coded dates or chapter counts. Keep at least two chronological chapters for the interpolation helpers.

## Verify a change

Run `npm run dev` while editing. Visit every chapter, open all seven categories, and compare the visible object, person, year, palette, and memory. Scrub between stops to check the interpolated colors and displayed age. Try the archive index and timeline with a keyboard and at a narrow screen width.

Run `npm run build` before sharing the result. It checks TypeScript and creates the static `dist/` output. Use `npm run preview` to inspect that build locally. The archive needs no backend or account; local assets keep the scene self-contained. Remote images and external links use their supplied destinations. Bundled font licenses remain in `public/fonts/`.
