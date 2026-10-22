# `world.ts`: the interface to the WebGL world

[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Scene implementation](scene.md) · [Performance](performance.md)

Source: [`src/world.ts`](../../src/world.ts). This file is the small public bridge between the HTML interface and the scene. Construction, frame updates, pointer picking, and resource ownership have separate modules under [`src/scene/`](../../src/scene/). Read this page first, then follow the [scene reference](scene.md) for implementation details and the [generated symbol index](../generated/SYMBOLS.md) for every declaration.

## Public contract

`createWorld(canvas, onSelect, onHover): World` creates one complete browser-side world. It requires a real `HTMLCanvasElement`, Canvas 2D for procedural textures, and WebGL. It uses the installed Three.js dependency. Initialization errors propagate to the caller, which owns the fallback interface.

| Argument | Type | Meaning |
| --- | --- | --- |
| `canvas` | `HTMLCanvasElement` | Full-window rendering surface and pointer-event target. |
| `onSelect` | `(id: ArchiveId) => void` | Called after a short pointer-up on an archive object, while no detail panel is focused. The caller opens the corresponding HTML panel. |
| `onHover` | `(id: ArchiveId \| null, x: number, y: number) => void` | Reports the category and viewport CSS coordinates for the tooltip. Clearing hover reports `(null, 0, 0)`. |

`World` preserves the original methods and adds read-only counters:

| Method | Input | Effect |
| --- | --- | --- |
| `setTime(value)` | Number, normalized to `[0,1]` | Uses `clampTime` to handle non-finite values and bounds, updates the travel target, clears hover, and schedules a frame. With motion enabled the displayed time catches up smoothly. |
| `focus(id)` | Any `ArchiveId`, or `null` | Sets or clears the category camera target, clears hover, and schedules a frame. The first physical target of that category in the destination era is used. |
| `setMotion(value)` | Boolean | Enables or disables ambient animation, parallax, and travel interpolation; schedules a frame. Disabled motion renders direct state changes, then stops RAF when settled. |
| `getDiagnostics()` | None | Returns a fresh `WorldDiagnostics` snapshot; modifying it cannot modify scene state. See the fields below. |
| `dispose()` | None | Removes canvas, window, and document listeners; cancels RAF; releases scene resources, shadow targets, and the renderer. Treat the instance as unusable afterward. |

`ArchiveId` comes from [`archive.ts`](../../src/archive.ts): `projects`, `photos`, `game`, `journal`, `food`, `places`, `person`. There are still seven categories in every era. Several floating photographs share `photos`; category focus intentionally uses the desk camera registered first.

### Diagnostics fields

`WorldDiagnostics` is defined in [`scene/types.ts`](../../src/scene/types.ts) and re-exported from `world.ts`.

| Field | Unit | Meaning |
| --- | --- | --- |
| `drawCalls` | Rendering calls | `renderer.info.render.calls` recorded after the most recent frame. This is a rendering-work indicator, not a frame-rate estimate. |
| `triangles` | Triangles | `renderer.info.render.triangles` for that frame. Lines and dust points are separate primitive types. |
| `pixelRatio` | Drawing-buffer/CSS ratio | Current capped pixel ratio. Recalculated when the viewport resizes. |
| `framesRendered` | Count | Actual calls to `renderer.render` since creation. It should stop increasing in settled reduced-motion mode and while the document is hidden. |
| `shadowsRendered` | Count | Frames that requested a shadow-map update. It counts requested updates rather than exposing Three.js internal pass objects. |

Before the first frame, render counters are zero. A snapshot creates a small object only when requested; the frame loop keeps its counters in one reusable record.

## How the modules link

```text
HTML event / timeline / detail panel (main.ts)
    ↓ setTime / focus / setMotion
createWorld (world.ts)
    ├─ createRenderer (scene/lifecycle.ts)
    ├─ buildScene (scene/build.ts)
    │    ├─ temporal-objects.ts + person.ts + art.ts
    │    └─ scene/hypercube.ts + scene/merge-static.ts
    ├─ createSceneAnimation (scene/animation.ts)
    ├─ createSceneLifecycle (scene/lifecycle.ts)
    └─ createPicking (scene/picking.ts)
          ├─ animation state + lifecycle.invalidate
          └─ onSelect / onHover → HTML interface
```

`graph` is the typed `SceneGraph` returned by construction. `camera` is a `PerspectiveCamera(45,1,.1,180)`, corrected to the viewport by lifecycle setup. `animation` owns travel, focus, hover, and visual state. `motion` reads the initial `prefers-reduced-motion` preference. `lifecycle` owns the renderer's schedule and cleanup. `picking` owns pointer listeners. These are the meaningful local variables in the facade; scene internals stay in their respective files.

Initialization creates those pieces in dependency order. The picker receives functions (`room`, `focused`, `pointer`, `hover`, `invalidate`) rather than unrestricted animation state. It can read the active era and focus status, report normalized pointer input, set a hovered root, and request rendering.

When `setTime` or `focus` runs, the animation state changes first. `picking.clear()` then clears the tooltip and invokes `invalidate`, guaranteeing that reduced-motion worlds repaint after API changes. `setMotion` and `getDiagnostics` delegate directly to lifecycle. Disposal removes pointer listeners before freeing the scene, so future input cannot reach disposed objects.

## What belongs where when editing

| Intended change | File / guide |
| --- | --- |
| Add projects, posts, links, progression, dates, costumes, or palette data | [`archive.ts`](../../src/archive.ts), [content guide](../CONTENT.md), [timeline guide](../TIMELINE.md) |
| Change object silhouettes or anatomy | [`temporal-objects.ts`](../../src/temporal-objects.ts), [`person.ts`](../../src/person.ts), [objects](objects.md), [person](person.md) |
| Move desk objects, change corridor geometry, lights, or photo placement | [`scene/build.ts`](../../src/scene/build.ts), [scene construction](scene.md#buildts-construction-and-placement) |
| Tune camera easing, hover, shadow cadence, or display retirement | [`scene/settings.ts`](../../src/scene/settings.ts), [settings](scene.md#settingsts-named-tuning-values) |
| Change time-based transforms and focus composition | [`scene/animation.ts`](../../src/scene/animation.ts), [frame update](scene.md#animationts-time-camera-color-and-emphasis) |
| Change pointer hit behavior | [`scene/picking.ts`](../../src/scene/picking.ts), [picking](scene.md#pickingts-pointer-interaction) |
| Change rendering schedule or cleanup | [`scene/lifecycle.ts`](../../src/scene/lifecycle.ts), [lifecycle](scene.md#lifecyclets-rendering-and-resource-ownership) |

The world builds geometry once. Editing archive configuration or silhouettes requires reload/recreation; calling `setTime` does not rebuild data. The underlying technique still uses separate era rooms rather than a continuous anatomical or costume morph. Shader-based geometry morphs would be a new feature with their own resource lifecycle.
