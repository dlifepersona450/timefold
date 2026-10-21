[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

# Application controller: `main.ts`

Source: [`src/main.ts`](../../src/main.ts). Related: [UI and audio modules](ui.md), [timeline and data](timeline.md), [WebGL world](world.md), [mini-game](game.md), [CSS and layout](styles.md), [content editing](../CONTENT.md).

The controller coordinates selected time, selected objects, native dialogs and user input. The permanent shell, panel markup, panel interactions, timeline painting and synthesized sound live in small modules documented in [UI and audio](ui.md). The application uses ordinary TypeScript and browser APIs. There is no React tree, router, database or content editor.

## Read a complete interaction first

1. [`index.html`](../../index.html) creates `#app` and loads `main.ts`. Importing `style.css` includes the interface stylesheet through Vite.
2. `main.ts` reads the initial reduced-motion preference and inserts `renderShell(motionEnabled)`. It captures the permanent DOM references once through `collectInterfaceElements`.
3. It creates the timeline view, detail view, optional audio controls and abortable input listeners. Creating audio controls does not create an `AudioContext`; sound starts only after a click.
4. `setTime(0)` samples the first chapter, updates controller state and queues DOM painting. `timelineView.flush()` applies this initial sample synchronously.
5. `initializeWorld` calls `createWorld(canvas, openObject, showTooltip)`, applies the same target time/motion preference, fades the loader and schedules its removal.
6. A slider, wheel, keyboard arrow, chapter button or swipe calls `setTime`. The world receives every target immediately. UI writes are batched into one animation-frame callback, which uses the most recent sample.
7. Selecting an object calls `openObject(id)`: snap to the nearest authored chapter, flush its UI, focus the 3D object, render its content, and show the detail modal.
8. A detail chapter button calls `selectDetailEra`. The controller changes time and camera focus; `detailView.render` replaces the content after removing old listeners and cleaning up any game. Keyboard focus moves to the corresponding new chapter button.
9. Closing detail clears its listeners/game, releases camera focus, removes inspection styling, and restores a connected visible trigger or falls back to the archive button.

```text
archive.ts ── eras/objects/eraContent ────────────┬─ ui/shell.ts
                                                 ├─ timeline.ts → sample
                                                 └─ ui/detail.ts → panels/resources/controls

DOM input → main.setTime(progress) ──────────────┬─ world.setTime(progress), immediately
                                                 └─ timelineView.schedule(sample)
                                                     └─ next animation frame → theme/labels/ARIA

DOM/canvas selection → main.openObject(id) ───────┬─ world.focus(id)
                                                 └─ detailView.render(id, selectedEra)

detail chapter → main.selectDetailEra(index) ─────┬─ setTime + flush + world.focus
                                                 └─ detailView.render → clear old panel → render new

dialog close / HMR → detailView.clear() ──────────┴─ abort detail listeners + game cleanup
```

## Imports and boundaries

| Import | Contract |
| --- | --- |
| `style.css` | Global presentation. The timeline view writes CSS properties consumed by its theme rules. |
| `eras`, `ArchiveId` | Authored chapter metadata and the seven stable archive IDs. The controller reads tooltips and nearest chapters; it does not edit content. |
| `mountAmbientAudio` | Attaches sound/visibility handlers and returns a disposer. Audio graph creation is deferred until a sound-button click. |
| `chapterCount` | Number of timeline intervals: `eras.length - 1`. |
| `sampleTimeline` | Clamps normalized input and returns continuous colors/year/age plus nearest chapter. |
| `timeForEra` | Converts a chapter index to clamped normalized progress. |
| `createWorld`, `World` | World constructor and public handle. The controller only calls `setTime`, `focus`, `setMotion`, `dispose`. The world calls `openObject` and `showTooltip`. |
| `createDetailView` | Owns replaceable detail markup, panel event handlers and game teardown. Returns `render` and `clear`. |
| `collectInterfaceElements`, `requireElement` | Cached permanent shell references and a query helper that reports missing markup early. |
| `escapeText` | Escapes tooltip strings before HTML insertion. |
| `renderShell` | Returns the permanent accessible page structure and data-driven archive/era buttons. |
| `createTimelineView` | Owns batched theme/label writes. Returns `schedule`, `flush`, `dispose`. |

## Every controller binding

| Binding | Type / initial value | Ownership and lifetime |
| --- | --- | --- |
| `motionEnabled` | Boolean from inverse reduced-motion query | Controller preference for world motion. `toggleMotion` changes it; the shell receives its initial value. |
| `elements` | `InterfaceElements` | Cached permanent nodes from `collectInterfaceElements`. A panel's temporary nodes are deliberately queried inside its own lifecycle. |
| `listeners` | `AbortController` | Owns all main-controller element/window listeners. `dispose` aborts them together. |
| `signal` | `listeners.signal` | Passed into every listener registered by `bindDialogControls` and `bindNavigationControls`. |
| `dialogs` | Array of three `HTMLDialogElement`s | Used for modal guards, shared dismissal behavior and disposal. |
| `timelineView` | `{ schedule, flush, dispose }` | One queued timeline DOM paint at a time. Main still owns the canonical requested progress. |
| `detailView` | `{ render, clear }` | One active detail panel's listeners and optional game. Images are cached inside this view. |
| `disposeAudio` | `() => void` | Returned by `mountAmbientAudio`, called during hot disposal. |
| `world` | `World \| undefined` | Set after successful WebGL initialization. Optional calls preserve all HTML archive access if initialization fails. |
| `timelineProgress` | `number`, initially `0` | Latest clamped requested progress, `[0, 1]`. Written synchronously by `setTime`; used by wheel/swipe/chapter navigation. |
| `selectedEra` | `number`, initially `0` | Nearest authored chapter from `sample.index`. Changes synchronously even if DOM painting is pending. |
| `activeObject` | `ArchiveId \| null`, initially null | Currently inspected archive category. Set on open; cleared on close. |
| `returnFocusTarget` | `HTMLElement \| null` | Element focused before the latest `showDialog`; only restored if connected and outside closed dialogs. |
| `loadingTimeout` | Timer handle or undefined | Removes the faded loader after 650 ms; canceled during disposal. |
| `touchStartX`, `touchStartY` | Numbers, initially `0` | First touch's start coordinates for dominant-axis swipe navigation. |

The normalized target is different from the world's interpolated current position. The controller never reads world internals to infer time. Both labels and 3D objects begin from the same sampled target; the renderer controls how the scene approaches it.

## Every controller function

### `setTime(value)`

`value` is any normalized progress request. Local `sample = sampleTimeline(value)` clamps it, then updates `timelineProgress` and `selectedEra`. The world gets `setTime(timelineProgress)` immediately; the timeline view receives `schedule(sample)`.

This order matters during fast wheel/slider events: input remains responsive while repeated DOM changes within the same display frame are coalesced. `setTime` does not rebuild open detail content. The detail chapter callback explicitly requests that rebuild.

### `hasOpenDialog()`

Returns whether any member of `dialogs` is open. Its iterator parameter `dialog` is one native dialog. Wheel, keyboard and swipe handlers use this guard so background timeline navigation does not consume modal interactions.

### `showDialog(dialog)`

`dialog` is the modal to show. Captures the current `document.activeElement` if it is an `HTMLElement`, then calls `showModal()`. Native dialog behavior provides modal focus containment and background inertness. The controller separately handles closing and focus restoration.

### `closeDialog(dialog)`

Closes the supplied dialog. For detail it calls `detailView.clear`, clears `activeObject`, requests `world.focus(null)` and removes `body.inspecting`. Local `canRestoreFocus` checks the captured trigger is connected and does not belong to `dialog:not([open])`. A valid trigger is focused; otherwise `elements.archiveButton` receives focus.

Restoration does not attempt to focus an old archive-row button inside the closed archive dialog. Returning from detail to the index subsequently opens the new modal and allows the browser to focus its controls.

### `openIndex()`

Closes detail through its cleanup path when necessary, flushes the latest pending timeline UI and opens the archive modal. Archive, fallback and “All objects” buttons share this action.

### `openObject(id)`

`id` is a stable `ArchiveId`, not a linked resource ID. Closes the archive modal if needed, snaps requested progress to `timeForEra(selectedEra)` and flushes its DOM changes. It stores the selected object, asks the world to focus it, renders the matching detail and adds `body.inspecting`. It shows detail only if that dialog is not already open.

The snap guarantees authored prose, discrete costume, selected object geometry and chapter labels represent one chapter. Narrative text is not interpolated between eras. Dataset casts are compile-time assertions; invalid external runtime IDs are not validated as a content import API.

### `selectDetailEra(eraIndex)`

Returns early without an active object. Otherwise the supplied chapter index is converted with `timeForEra`, time/UI are updated, the same object is refocused, and `detailView.render(activeObject, selectedEra)` rebuilds its content. The detail module restores the matching new stage button's focus after this callback returns.

### `previousEra()` and `nextEra()`

Previous uses `ceil(timelineProgress * chapterCount - 0.01) - 1`; next uses `floor(timelineProgress * chapterCount + 0.01) + 1`. The small offset stabilizes behavior exactly at chapter boundaries. `timeForEra` clamps out-of-range chapter requests at the endpoints. These actions are shared by footer arrows and arrow-key navigation.

### `handleWheel(event)`

Returns for open dialogs or `event.ctrlKey` (browser/trackpad zoom). Otherwise prevents default scrolling and converts `event.deltaY` to pixels using local `pixelsPerUnit`:

| `deltaMode` | Multiplier | Meaning |
| --- | --- | --- |
| `WheelEvent.DOM_DELTA_PIXEL` | `1` | Delta already represents pixels. |
| `WheelEvent.DOM_DELTA_LINE` | `16` | One line is treated as 16 CSS pixels. This is a chosen input sensitivity, not a measured platform font metric. |
| `WheelEvent.DOM_DELTA_PAGE` | `window.innerHeight` | One page equals current viewport height. |

It requests `timelineProgress + event.deltaY * pixelsPerUnit * 0.00015`. There is no separate wheel accumulator or inertia loop. The world handles scene easing and the timeline view handles DOM batching.

### `handleKeyDown(event)`

Local `target` is the event target. Local `editingText` excludes `input`, `textarea`, `select` and contenteditable elements. Open dialogs also suppress this handler. Right/down prevents default and calls `nextEra`; left/up calls `previousEra`. Other keys retain browser behavior. A focused range input keeps its native arrow-key behavior and emits `input` events.

### `handleTouchStart(event)` and `handleTouchEnd(event)`

Start reads local `touch = event.touches[0]`; absent touches are ignored. It records `clientX/clientY` in the controller's start variables. End ignores open dialogs, reads `changedTouches[0]` and computes local `deltaX`, `deltaY` and dominant signed `distance`. If its absolute value exceeds 35 CSS pixels, progress changes by `distance * 0.0009`. Both listeners are passive on the scene canvas. This is a single-touch gesture, without pinch or gesture-history tracking.

### `toggleMotion()`

Toggles `motionEnabled`, updates `world.setMotion`, the button's visible label and `aria-pressed`, then toggles `body.reduced-motion`. The initial value comes from the OS query; there is no stored preference or media-query-change listener. The CSS's OS reduced-motion media query still applies independently of this in-app button.

### `showTooltip(id, x, y)`

This is the world hover callback. Local `tooltip` is cached shell markup. Null `id` hides it. Otherwise local `era` and `state` select the nearest chapter's object name/form, which are escaped before HTML insertion.

`x/y` are pointer client coordinates. Tooltip left is `min(x + 18, innerWidth - 220)` and top is `max(10, min(y + 18, innerHeight - 85))`. The CSS suppresses tooltips on small screens; the archive index provides keyboard/mobile access to the same objects.

### `bindDialogControls()`

Attaches abortable listeners to permanent dialog controls. Iterator `button` closes its nearest owning dialog. Iterator `dialog` gets two handlers:

- `cancel` receives `event`, prevents native default close and routes Escape through `closeDialog`, preserving game cleanup and focus restoration.
- `click` ignores events whose target is not the dialog itself. Local `bounds` is its rectangle and `outside` tests pointer coordinates against its edges. A click on the modal backdrop closes through the same lifecycle.

The close buttons, Escape and backdrop therefore share one cleanup path.

### `bindNavigationControls()`

Connects every main navigation route using the shared `signal`. Button callback parameters identify cached controls; object-row destructuring reads its cached `button` only. The event map below lists every route. No permanent selector is repeatedly queried during wheel/slider updates.

### `initializeWorld()`

Calls `createWorld` inside a synchronous `try/catch`, passes the cached canvas, `openObject` and `showTooltip`, then applies current time and motion. Success adds `.loaded` and stores a timeout to remove the loader after 650 ms. Failure's local `error` is logged, the loader is removed, fallback content is shown, and `body.webgl-unavailable` is added.

This catches initialization failure. It is not a recovery mechanism for later WebGL context loss or arbitrary render-loop failures. The HTML content remains usable without `world` because every controller world call is guarded.

### `dispose()`

Aborts every controller element/window listener, clears the loader timer, cancels queued timeline painting, clears detail/game resources, disposes audio and world, closes open dialogs, and removes transient body classes. Its final `dialog` iterator closes without invoking user focus restoration because the whole application is being replaced.

Vite invokes this function through `import.meta.hot.dispose(dispose)`. The audio and world modules each own their own listener/graphics cleanup. Closed Web Audio promises and late async sound completions are handled by the audio module. The module initializes once per Vite module evaluation; it does not expose a general multi-instance embeddable mount API.

## Complete input map

| Source | Registered event / action | Behavior |
| --- | --- | --- |
| Archive button, fallback button, back button | `click` → `openIndex` | Open all seven objects. |
| About button | `click` → `showDialog(aboutDialog)` | Open explanatory modal. |
| Brand | `click`, prevent default → `setTime(0)` | Return to first moment without a hash navigation. |
| Range input | `input` → `setTime(Number(value) / 1000)` | Convert UI `[0,1000]` to normalized `[0,1]`. |
| Cached footer `button[data-era]` | `click` → `setTime(timeForEra(Number(dataset.era)))` | Select authored chapter. |
| Previous/next buttons | `click` → `previousEra` / `nextEra` | Chapter stepping; endpoint disabled state belongs to timeline view. |
| Explore button | `click` → `openObject("projects")` | Workstation shortcut. |
| Cached index `button[data-object]` | `click` → `openObject(dataset.object as ArchiveId)` | Shared index/canvas content path. |
| Motion button | `click` → `toggleMotion` | Motion preference. |
| Window | Nonpassive `wheel` → `handleWheel` | Normalized continuous time travel. |
| Window | `keydown` → `handleKeyDown` | Background chapter navigation. |
| Canvas | Passive `touchstart` / `touchend` | Dominant-axis swipe. |
| Three dialogs | `cancel`, backdrop `click` | Shared accessible close path. |
| Permanent `button[data-close]` | `click` | Close owning dialog. |
| Detail chapter buttons | `click` via detail module → `selectDetailEra` | Rebuild selected object's era content and restore button focus. |
| Sound button/document | Managed by audio module | Lazy sound toggle and hidden-page suspension. |

`body[data-era]` remains available as era metadata, but it is never included in era-button loops. `collectInterfaceElements` explicitly queries `button[data-era]` inside `.timeline`. This prevents button-only classes, pressed states or handlers from being assigned to the body.

## DOM, content and resource contracts

[UI modules](ui.md) lists every cached DOM reference and all panel-specific selectors. [Content](../CONTENT.md) documents authoring and links; [timeline](../TIMELINE.md) documents era/person/geometry customization. Every detail receives one `PanelContext` containing the same era index, era metadata, memories, object state and chosen image URLs.

The controller does not fetch resources when a link is clicked. It displays authored snapshots of progress and status. Link safety, optional progress bars and new-tab accessibility are implemented in `ui/resources.ts`; gallery fallback images and SVG portraits are assembled by the detail modules. Updating content means editing the source and rebuilding/redeploying.

## Rebuild this controller as a learning exercise

1. Put a canvas, range input, status labels and native dialog in a permanent shell function.
2. Collect permanent element references once. A required selector should report a clear error if markup and code drift.
3. Keep requested time and nearest chapter in the controller. Write one `setTime` used by every navigation route.
4. Send world targets immediately, but batch purely visual DOM writes into the next animation frame. Add a synchronous flush for interactions that need matching content immediately.
5. Split pure panel markup from panel event attachment. Pass a typed context instead of reading hidden mutable controller globals.
6. Give a replaceable panel a cleanup path before adding game keyboard handlers or other global resources.
7. Use one dialog close path for buttons, Escape and backdrop; restore focus to connected visible controls.
8. Attach listeners with an `AbortSignal`, retain timers/RAF handles, and dispose owned resources during HMR or unmount.

The code modules and their detailed local bindings are documented next in [UI and audio modules](ui.md).
