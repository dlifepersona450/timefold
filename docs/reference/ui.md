[Docs home](../README.md) · [Controller](interface.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

# UI modules and synthesized audio

The interface is divided by ownership: pure markup, permanent DOM references, one frame of timeline painting, replaceable detail content, temporary panel interactions, and optional sound. This reference describes every new module, function, parameter, meaningful local binding, selector and cross-module contract. The [generated symbol index](../generated/SYMBOLS.md) supplies exact source locations and mechanically enumerates declarations.

## File and dependency map

| File | Responsibility | Called by / calls |
| --- | --- | --- |
| [`src/ui/format.ts`](../../src/ui/format.ts) | Escape text, validate resource URLs, format two-digit counters | Shared by shell, details, resources, panels, gallery, timeline and controller. |
| [`src/ui/dom.ts`](../../src/ui/dom.ts) | Required-element query and permanent shell reference collection | Main collects once; panel controls query only their own newly rendered nodes. |
| [`src/ui/shell.ts`](../../src/ui/shell.ts) | Permanent accessible HTML structure | Main inserts `renderShell`; reads `eras/objects` and formatting helpers. |
| [`src/ui/timeline-view.ts`](../../src/ui/timeline-view.ts) | Coalesced timeline theme/label/ARIA writes | Main calls `schedule/flush/dispose`; samples come from `timeline.ts`. |
| [`src/ui/detail.ts`](../../src/ui/detail.ts) | Detail heading, chapter controls, content composition and replacement lifecycle | Main creates/renders/clears; calls panel renderer, resources, controls, fallback artwork. |
| [`src/ui/panels.ts`](../../src/ui/panels.ts) | Seven content-specific pure HTML renderers | Detail invokes `renderPanel`; person renderer invokes `personPortrait`. |
| [`src/ui/resources.ts`](../../src/ui/resources.ts) | Linked project/post/art/progress cards | Detail passes one object's era-specific resources. |
| [`src/ui/panel-controls.ts`](../../src/ui/panel-controls.ts) | Photo/place interactions and mini-game mounting | Detail supplies a panel context and abort signal; calls `mountGame`. |
| [`src/audio.ts`](../../src/audio.ts) | Lazy Web Audio room tone and lifecycle | Main mounts controls once and calls the returned disposer. |

Pure render functions return strings and do not attach events. `safeResourceUrl` resolves URLs against the browser location, and portrait generation reads authored person data; neither performs a network fetch. `createDetailView` owns the temporary DOM's lifetime, while main owns which era/object should be displayed.

## Formatting: `ui/format.ts`

### `escapeText(value: string): string`

Local `entities` maps `&`, `<`, `>`, double quote and single quote to HTML entities. The replacement callback's `character` is each matched character. Escaping is for plain text embedded in HTML text/attribute positions; it is not a sanitizer for arbitrary HTML, CSS or JavaScript. Authored prose, titles, forms and image attributes pass through this helper before template insertion.

### `safeResourceUrl(value: string | undefined): string | null`

Missing input returns null. Local `url` is `new URL(value, window.location.href)`, so relative project paths become absolute URLs. Only `http:` and `https:` protocols return their resolved `href`; malformed and other protocols return null. A rejected link omits the anchor while preserving its resource card. The URL is escaped separately before HTML insertion.

### `twoDigits(value: number): string`

Returns `String(value).padStart(2, "0")`. It supplies archive count, room number, gallery count and place number formatting. It pads, without truncating or rounding, so callers pass integer counters.

## Permanent DOM references: `ui/dom.ts`

### `requireElement<ElementType>(selector, parent = document): ElementType`

`ElementType extends Element` determines the TypeScript return type; it does not runtime-check the HTML tag. `selector` is queried inside supplied `parent`, which may be the document, a dialog, HTML element or SVG group. Local `element` is the query result. A missing match throws `Missing interface element: …` at the markup contract boundary. There is no silent null assertion or optional missing-control fallback.

### `collectInterfaceElements()` and `InterfaceElements`

Locals `timeline` and `archiveDialog` narrow the scope of repeated controls. The returned object caches permanent nodes. Exported `InterfaceElements = ReturnType<typeof collectInterfaceElements>` keeps consumers aligned with this actual object rather than duplicating an interface.

| Returned property | Selector / scope | Used for |
| --- | --- | --- |
| `canvas` | `#world` | WebGL mount and touch input. |
| `brand` | `.brand` | Return to first moment. |
| `archiveButton` | `#archive-open` | Archive entry and safe focus restoration. |
| `fallbackButton` | `#fallback-index` | Archive access when WebGL initialization fails. |
| `backButton` | `#back-index` | Detail-to-index transition. |
| `aboutButton` | `#about-open` | Open about modal. |
| `exploreButton` | `#explore` | Projects shortcut. |
| `motionButton` | `#motion` | Motion label, pressed state, toggle event. |
| `soundButton` | `#sound` | Audio interaction and accessible state. |
| `soundLabel` | `.sound-label` | Human-readable sound state. |
| `archiveDialog` | `#archive-dialog` | Index modal. |
| `detailDialog` | `#detail-dialog` | Detail modal with `aria-labelledby="detail-title"`. |
| `aboutDialog` | `#about-dialog` | Explanation and motion control. |
| `detailContent` | `#detail-content` | Replaceable detail subtree; permanent container. |
| `closeButtons` | `button[data-close]`, document | Shared modal dismissal controls. |
| `eraButtons` | `button[data-era]`, inside `.timeline` | Footer chapter controls only; excludes `body[data-era]`. |
| `objectRows` | `button[data-object]`, inside archive dialog | Array of cached `{ button, name, form }` references. `name` is its `strong`, `form` its `small`. |
| `timeInput` | `#time` | Normalized time UI, progress CSS property and accessible value. |
| `timeYear` | `#time-year` | Interpolated year with preserved decorative dot span. |
| `roomNumber` | `#room-number` | Nearest chapter number. |
| `eraName` | `#era-name` | Authored chapter name. |
| `eraNote` | `#era-note` | Authored chapter note. |
| `travellerReadout` | `#traveller-readout` | Continuous age and discrete outfit. |
| `spectralLabel` | `#spectral-label` | Nearest chapter's artistic direction label. |
| `phaseLabel` | `#phase-label` | Interpolated wavelength color-study label. |
| `previousButton`, `nextButton` | `#prev-era`, `#next-era` | Chapter movement and endpoint disabled states. |
| `announcement` | `#announcement` | `role="status" aria-live="polite"` chapter announcements. |
| `tooltip` | `#tooltip` | Pointer hint for nearest-era object state. |
| `loading` | `#loading` | Fade/removal on scene initialization. |
| `fallback` | `#fallback` | Hidden-until-needed WebGL fallback. |
| `themeColor` | `meta[name="theme-color"]` | Optional browser theme metadata; the one intentionally nullable permanent reference. |

The object-row map callback's `button` is the row node used to find its nested labels once. Panel DOM is intentionally absent from this collection: panel replacement would invalidate those references.

## Page shell: `ui/shell.ts`

| Symbol / local | Meaning |
| --- | --- |
| `foldedMark` | Original inline decorative SVG folded-world mark, used by brand and loading state. `aria-hidden` excludes it from spoken content. |
| `renderEraButtons()` | Maps `eras` to footer buttons. Callback `era` is authored metadata and `index` is its numeric data attribute. First button starts active/pressed. Accessible names contain year and escaped name. |
| `renderObjectRows()` | Maps shared `objects` to index rows. Callback `object` supplies stable ID, number, icon, name and category. Names/forms are updated to current era by the timeline view. |
| `renderShell(motionEnabled)` | Returns all permanent markup. Boolean parameter sets the initial motion button label/pressed state. |
| `firstEra` | `eras[0]`, used for initial labels until the first timeline paint. |
| `objectCount` | Padded `objects.length`, shared by archive button and drawer heading. |

The returned structure is, in document order: scene canvas; shade/grain layers; header; intro/caption/room marker/tooltip/loader/fallback inside main; timeline footer; archive, detail and about dialogs; live announcement region. Main inserts it exactly once per module initialization. The shell does not query selectors, create a renderer, read mutable timeline state or register listeners.

The canvas label points keyboard users toward the archive index. Each archive object is a real button. The slider has a spoken label and value text; chapter buttons expose `aria-pressed`; detail names use `detail-title`; close buttons have explicit accessible names; sound and motion expose pressed state. SVG marks and scene decorations are hidden from assistive technologies when decorative.

The initial four-era/seven-object promotional copy intentionally describes the sample archive. If you add chapters or object types, review this copy as well as generated counts. It is not automatically pluralized marketing text.

## Batched timeline painting: `ui/timeline-view.ts`

### API and state

`TimelineSample` is `ReturnType<typeof sampleTimeline>`. It keeps the painter's input type linked to the sampler without importing its implementation at runtime. `createTimelineView(elements)` captures the permanent DOM object and returns `{ schedule, flush, dispose }`.

| Binding | Meaning |
| --- | --- |
| `pendingSample` | Latest sample waiting for paint, or undefined. A later scheduled sample replaces an earlier one in the same frame. |
| `animationFrame` | Pending `requestAnimationFrame` handle, or undefined. Zero is a valid handle; code checks undefined explicitly. |
| `paintedEra` | Last chapter whose discrete labels/index rows were written. Starts `-1` so first paint initializes all rows. |
| `announcedEra` | Last live-announced chapter, initially `0`. Initial startup stays quiet; later chapter changes are announced. |

### `paint(sample)`

Local `era = eras[sample.index]` supplies nearest-chapter prose and outfit. `theme = sample.theme` is continuously interpolated. `properties` maps theme fields into the interface's CSS custom property contract:

| CSS property | Theme source | Purpose |
| --- | --- | --- |
| `--accent`, `--lime` | `accent` | Primary accent; `--lime` is a retained CSS compatibility name, not a green-only palette requirement. |
| `--cream` | `text` | Main readable foreground. |
| `--muted` | `muted` | Secondary text. |
| `--theme-bg` | `background` | Interface backdrop. |
| `--panel` | `panel` | Modal/panel surfaces and browser theme-color. |
| `--theme-paper` | `paper` | Journal/light surfaces. |
| `--theme-ink` | `shadow` | Dark ink/depth. |
| `--line` | `accent + "30"` | Accent hex with alpha suffix for boundaries. Requires authored six-digit hex colors. |
| `--ambient` | `ambient` | Atmospheric interface decoration. |

The `Object.entries` callback's `property` and `color` are written on `document.documentElement.style`. Every paint updates optional theme-color metadata, range value/progress/value text, continuous year/age/wavelength labels and endpoint disabled flags.

`timeYear.firstChild` must remain the year text node produced by the shell, followed by the decorative `<span>·</span>`. Updating that text node avoids rebuilding its HTML on every frame.

Only when `sample.index !== paintedEra` does the painter write `body.dataset.era`, room number, chapter name/note/direction, footer button selection and object-row name/form. Era button callback `button` computes Boolean `selected` from its numeric data attribute. Object-row callback `row` reads `state = era.objectStates[row.button.dataset.object as ArchiveId]`, then updates cached nested labels. The body never participates in this button loop.

When `sample.index !== announcedEra`, the live region announces the authored chapter year, name, age and outfit. It does not announce every interpolated year while scrolling, avoiding excessive screen-reader speech.

### Scheduling functions

| Function / locals | Behavior |
| --- | --- |
| `schedule(sample)` | Replaces `pendingSample`; requests `flush` only if no frame is already queued. Main has already updated the world target. |
| `flush()` | Cancels a queued frame if present, clears its handle, and returns if no pending sample. Otherwise copies pending sample to local `sample`, clears pending state and calls `paint`. Safe both as RAF callback and synchronous action. |
| `dispose()` | Cancels pending RAF, clears frame/sample state. It does not paint or reset controller time. |

Main flushes before opening the archive and after selecting/snapping detail chapters so modal content, scene targets and labels share the same selected moment. Reduced motion still needs DOM batching: that batching is event coalescing, not decorative motion.

## Detail composition and lifetime: `ui/detail.ts`

### `renderStageButtons(selectedEra)`

Returns one button per era. Map callback `era` supplies year/phase, `index` supplies `data-stage` and selected state. Each button exposes `aria-pressed` and an explicit year name. `selectedEra` is an authored chapter index, not normalized time.

### `renderDetailMarkup(id, context)`

Looks up local `object` by stable ID; the find callback's `candidate` is a shared object entry. Context destructuring gets `eraIndex`, `era`, `memory`, `state`. The return string combines shared heading, chapter controls, `renderPanel`, `renderResources` and shared archive footer. Resource lookup is `memory.resources?.[id] ?? []`.

`detail-title` matches the permanent dialog's `aria-labelledby`. Resource IDs never replace archive IDs. Object marking/category come from shared `objects`; name/form/description come from the era-specific `objectStates`.

### `createDetailView(container, onSelectEra)`

`container` is permanent `#detail-content`; callback `onSelectEra(eraIndex)` belongs to main and updates canonical time/camera state. The factory creates image caches once and returns `{ render, clear }`.

| Binding / callback parameters | Meaning |
| --- | --- |
| `photoImages` | Array per era, then per photo. Uses authored `photo.src` or `imageData(eraIndex, false, photo.art)`. |
| `foodImages` | One image per era. Uses authored `memory.food.src` or `imageData(eraIndex, true)`. |
| Image-map `memory`, `eraIndex`, `photo` | Per-era content, its aligned era index, and individual photo record. Caches require `eraContent` and `eras` to align. |
| `listeners` | Active detail's `AbortController`, undefined after cleanup. Owns stage/gallery/place DOM listeners. |
| `cleanupPanel` | Optional non-DOM cleanup returned by `mountPanelControls`; currently the mini-game's window-key handler cleanup. |

`clear()` aborts detail listeners, clears their controller, invokes `cleanupPanel`, then clears it. It leaves markup in place because a closed modal does not need an empty body. The next `render` replaces it. Repeated `clear()` calls are safe.

`render(id, eraIndex)` first clears the previous panel. Local `era` and typed `context` bind chapter metadata, memory, selected object state, cached photo URLs and cached food URL. It inserts `renderDetailMarkup`, creates a fresh abort controller, captures local `signal`, registers stage buttons, then mounts content-specific controls and stores their cleanup.

Each stage callback's `button` is the old DOM button. Local `selectedEra` parses its `data-stage`; the callback invokes main's `onSelectEra`, which synchronously calls this view's `render` again. After replacement it re-finds the matching new `button[data-stage]` and focuses that node. This is one rerender caused by an interaction, not an infinite render loop.

A newly rendered gallery starts at photo zero, and a newly rendered game starts a fresh run. State is deliberately scoped to the panel instance; there is no persistence of per-era gallery/game state or automatic CMS synchronization. Content module reload/reinitialization recomputes image caches.

## Seven pure panels: `ui/panels.ts`

### `PanelContext` and renderer registry

| Field | Type / linkage |
| --- | --- |
| `eraIndex` | Numeric authored chapter index used by era-specific CSS classes and selection. |
| `era` | `Era` metadata from `eras[eraIndex]`; contains year, palette, person and object states. |
| `memory` | `EraContent` from aligned `eraContent[eraIndex]`. |
| `state` | `ObjectState` for the selected archive ID inside this era. |
| `photoImages` | Resolved image URL array for this era. |
| `foodImage` | Resolved food illustration URL for this era. |

`panelRenderers` is `Record<ArchiveId, (context: PanelContext) => string>`. Adding a new stable object ID makes TypeScript require a corresponding renderer entry. Exported `renderPanel(id, context)` delegates through this registry; it does not inspect controller globals or register listeners.

### Every panel function and its local bindings

| Function | Inputs and local bindings | Returned content / linkage |
| --- | --- | --- |
| `renderProjects` | Context `eraIndex`, `era`, `memory`, `state`; local `project = memory.project`; tag-map parameter `tag` | Faux code window, escaped code lines joined with `<br>`, project title/description and tags. CSS class `era-project-N` selects the authored era's surface. |
| `renderPhotos` | Context `eraIndex`, `memory`, `photoImages`; local `photos`, `firstPhoto`, `thumbnails`; thumbnail callback `source/index` | Main image/medium badge, previous/next buttons, count, title/caption and photo thumbnail buttons. Image sources and alternative text are escaped. `mountGallery` supplies behavior. |
| `renderGame` | Context `memory` | Empty `#mini-game` mount point plus game note, title, description and control hints. `mountGame` creates actual canvas/status/buttons afterward. |
| `renderJournal` | Context `eraIndex`, `era`, `memory`; local `journal` | Journal article with date/age, title, text, signature and reminders. Text/reminders are escaped plain text; reminder lines are joined with `<br>`. `journal-era-N` links to CSS. |
| `renderFood` | Context `era`, `memory`, `state`, `foodImage`; local `food` | Food image/alternative text, object-form/year badge, memory title/description, time/year and note. |
| `renderPlaces` | Context `memory`; local `pins` and `places`; both maps receive `place/index` | Illustrative SVG map with grid pattern, route, numbered pins, coordinate label and place buttons. First place starts selected; `mountPlaces` changes it. The pin map uses index for layout; its `place` entry aligns pins with the list. |
| `renderPerson` | Context `eraIndex`, `era`; local `lifeThread`, `birthYear`; life map receives `chapter/index` | `personPortrait(era.person)` SVG, age/year, outfit, narrative, four age/year marks and fictional-life notice. `birthYear` derives from first era year minus its age. |

Place pin geometry is intentionally schematic: circle `cx = 100 + index*192`, `cy = 140 + index*13`, text `x = 65 + index*192`, `y = 115 + index*13`. First radius/opacity are `9/1`; others `5/0.45`. These are layout points, not geographic coordinates. Adding many places requires a corresponding responsive map layout change.

The traveller portrait shows discrete authored chapter appearance. The room's timeline readout may show an interpolated age between chapters; opening an object snaps to its chapter so portrait, costume and object content agree.

## Linked content cards: `ui/resources.ts`

`renderResources(resources, year)` takes an `ArchiveResource[]` and chapter year. Empty arrays return an empty string. Otherwise it wraps `resources.map(renderResource)` in a labelled connected-archive section.

`renderResource(resource)` returns one inspectable `article[data-resource-id]`. Local `href = safeResourceUrl(resource.url)` is null for missing/rejected URLs. Local `progress` is null when omitted; otherwise it is clamped to `[0,100]`. Optional status, progress and anchor each render only when present/valid. A progress of zero is displayed correctly because the check uses null, not truthiness.

| Resource property | Output |
| --- | --- |
| `id` | Escaped `data-resource-id`; no controller event uses it as an object selector. |
| `type` | Uppercase metadata and “Open type” link text. |
| `date` | Escaped visible date and `<time datetime>`. Authoring guide expects a valid ISO date. |
| `title`, `summary` | Escaped heading/body. |
| `status` | Optional escaped status badge. |
| `progress` | Optional native `<progress>` and numeric label with resource-specific accessible name. Author values should be finite numbers. |
| `url` | Allowed HTTP(S)/relative target. Opens a new tab with `rel="noopener noreferrer"` and a screen-reader new-tab notice. |

There is no fetch of an external repository or blog, progress polling, automatic percentage calculation or inline remote article rendering. Every era can hold its own snapshot of the same project; author those snapshots as described in [Content](../CONTENT.md).

## Interactive panel controls: `ui/panel-controls.ts`

### `mountGallery(container, context, signal)`

Queries only the current panel's nodes once, then captures them in event closures. `context` supplies that panel's immutable era/photo images; `signal` belongs to the detail view and removes every listener before replacement.

| Binding | Meaning |
| --- | --- |
| `photos` | Current era's `PhotoMemory[]`. The sample contains at least one image; empty gallery arrays are not a supported rendered state. |
| `image` | Current `#gallery-image` element. |
| `countLabel` | `#gallery-count`. |
| `title`, `caption` | `#photo-title`, `#photo-caption`. |
| `thumbnails` | Current `button[data-photo]` array. |
| `selectedIndex` | Current photo index, initially `0`, local to this gallery instance. |

Nested `selectPhoto(index)` wraps previous/next requests using `(index + photos.length) % photos.length`. Local `photo = photos[selectedIndex]` updates image source/alt, padded count and title/caption. Its thumbnail loop parameters `button/thumbnailIndex` compute local `selected`, then update class and `aria-pressed`.

Previous/next button closures call `selectPhoto(selectedIndex - 1/+1)`. The thumbnail registration loop receives `button/index` and selects that exact index. Only one-step negative navigation is used; this helper is not a public arbitrary-negative-index API.

### `mountPlaces(container, context, signal)`

Captures `coordinate = .map-coordinate`, all current `button[data-place]` in `buttons`, and all SVG `[data-pin]` as `pins`. Each pin map's `element` becomes `{ element, circle }`; `circle` is queried once within that group.

Nested `selectPlace(index)` uses `context.memory.places[index].coordinates`, then updates all list pressed/active states and pin styles. Button loop parameters `button/buttonIndex` compute local `selected`; pin loop parameters `pin/pinIndex` compute their own local `selected`. Selected pins use opacity `1`, radius `9`; others `.45`, radius `5`. The registration loop's `button/index` close over matching list/pin positions. Coordinates are text, never HTML.

### `mountPanelControls(id, container, context, signal)`

Branches only on interaction needs, not on markup rendering. Photos mount gallery controls; places mount place controls; game returns `mountGame(#mini-game, { theme: context.era.theme, year: context.era.year })`. Other panels return undefined because their markup has no local interaction to clean up.

The returned callback owns non-DOM cleanup, currently the mini-game window key listener. The shared abort signal owns stage/gallery/place listeners. See [game](game.md) for its drawing, controls and cleanup implementation.

### Panel selector contract

| Selector | Produced by | Consumed by |
| --- | --- | --- |
| `#detail-title` | Shared detail markup | Permanent dialog accessible name. |
| `button[data-stage="N"]` | Stage button renderer | Detail chapter callback and new-button focus restoration. |
| `#gallery-image`, `#gallery-count`, `#photo-title`, `#photo-caption` | Photos renderer | Gallery cached nodes. |
| `#photo-prev`, `#photo-next`, `button[data-photo="N"]` | Photos renderer | Gallery event attachment and selected state. |
| `#mini-game` | Game renderer | Game mount target; game creates its own descendants. |
| `#grid`, `fill="url(#grid)"` | Places renderer | Inline SVG pattern reference; only one detail panel exists at once. |
| `button[data-place="N"]` | Places renderer | Place selection and pressed state. |
| `[data-pin="N"] circle` | Places renderer | Selected pin size/opacity. |
| `.map-coordinate` | Places renderer | Selected coordinate text. |
| `article[data-resource-id="ID"]` | Resource renderer | Inspectable authored identity; no click handler is attached to the article itself. |

Changing selectors requires corresponding renderer/control changes and potentially CSS updates. The permanent `#detail-content` container remains the boundary between main and replaceable DOM.

## Optional synthesized sound: `audio.ts`

### Public function and state

`mountAmbientAudio(button, label): () => void` takes the permanent sound button and visible sound label, attaches its own listeners and returns `dispose`. The `AudioContext` is lazy so construction/resume occurs during the user's click interaction.

| Binding | Type / initial state | Meaning |
| --- | --- | --- |
| `listeners` | `AbortController` | Owns button click and document visibility listeners. |
| `oscillators` | `OscillatorNode[]`, empty | Retains every created oscillator for explicit stop/disconnect. |
| `context` | `AudioContext \| undefined` | One lazy audio context. |
| `masterGain` | `GainNode \| undefined` | Shared volume fade node feeding destination. |
| `enabled` | Boolean, false | Whether audible ambience was requested. |
| `busy` | Boolean, false | Prevents overlapping click toggles while awaiting resume. |
| `disposed` | Boolean, false | Blocks later interaction and async completion updates after teardown. |

### Every audio function

| Function | Inputs / locals | Behavior |
| --- | --- | --- |
| `updateButton(unavailable = false)` | Boolean controls error text | Writes pressed state, enable/disable accessible label, and visible “Sound on/off/unavailable” text. |
| `reportUnavailable()` | No arguments | Sets enabled false, mutes an existing open context's master, and displays unavailable state. |
| `createAudioGraph()` | Tone loop receives `frequency/index`; locals `oscillator`, `voiceGain` | Creates context/master at zero gain, connects four sine voices, retains and starts them. Called inside `toggleSound`'s `try` so constructor/node errors are caught. |
| `toggleSound()` | Async; no event data needed | Returns if busy/disposed; marks busy, creates graph if absent, awaits resume, checks disposal, flips enabled, fades master and updates button. Catch reports unavailable unless disposed; finally clears busy. |
| `syncVisibility()` | Async; no event data needed | Returns without an active open context or after disposal. Suspends when document hidden; resumes when visible only if enabled. Catches rejected promises and reports unavailable. |
| `dispose()` | Oscillator loop's `oscillator` | Returns immediately if already disposed; otherwise marks disposed, aborts listeners, stops/disconnects oscillators, disconnects master, closes an open context while handling a rejected close promise. The guard makes repeated teardown safe. |

### Audio graph and numeric choices

```text
sine oscillator 55 Hz      → voice gain 0.12   ┐
sine oscillator 82.41 Hz   → voice gain 0.06   ├─ master gain → context.destination
sine oscillator 110 Hz     → voice gain 0.04   │
sine oscillator 164.81 Hz  → voice gain 0.03   ┘
```

Tone `index` adds `index * 2` cents detune; each voice gain is `0.12 / (index + 1)`. All tones start once. Sound-on fades the master toward `0.18`, sound-off toward `0`, using `setTargetAtTime(target, currentTime, 0.5)`. The `0.5` is an exponential time constant, not a guaranteed exact-duration fade. Muting keeps the oscillators alive until hidden-page suspension or disposal.

No recorded music, sound library or audio files are loaded. Failed audio is optional: the archive remains fully usable. Rapid clicks do not create overlapping toggles; pending async completions do not update disposed UI. Preferences are not persisted across reloads.

## Extend the interface without losing lifecycle ownership

For a new static object panel, add the stable ID/data/world object, add a renderer to `panelRenderers`, and style its semantic markup. For a new interactive panel, attach its event handlers in `panel-controls.ts` using the supplied abort signal. Return explicit cleanup for anything outside that DOM subtree: window listeners, timers, animation loops or media resources.

For a new timeline readout, add its permanent shell node and cached DOM reference, then update it in `paint`. Put values that change continuously outside the `paintedEra` branch; put authored chapter-only labels inside it. Add a live-region announcement only if it communicates a useful state change without speaking on every animation frame.

For new content links/status/progress, update [archive data](../../src/archive.ts) using the [content authoring guide](../CONTENT.md); there is no need to modify the renderer for another existing resource type. For scene motion and performance, use the [world reference](world.md) rather than adding scene animation to DOM modules.
