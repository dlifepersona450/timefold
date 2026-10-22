# Rendering performance and smooth transitions

[Docs home](../README.md) · [World API](world.md) · [Scene reference](scene.md)

The scene batches rigid opaque surfaces, reuses frame data, and schedules rendering according to activity. Its existing four palettes, era objects, seven archive categories, generated art, and person costumes remain editable through the existing content modules.

## Measured rendering work

The same browser harness imported `createWorld`, warmed up the renderer, disabled motion, and sampled `getDiagnostics()` at three times. Both runs used a 1280×800 viewport, pixel ratio 1, and Chrome headless with the SwiftShader software renderer. The sampled values are the most recent rendered frame's counters.

| Timeline stop | Normalized time | Before calls | After calls | Reduction |
| --- | --- | ---: | ---: | ---: |
| Past | `0` | 592 | 242 | 59.1% |
| Present | `2/3` | 328 | 137 | 58.2% |
| Future | `1` | 187 | 79 | 57.8% |

Triangle counters changed from `52,972 / 30,216 / 20,608` to `53,008 / 30,336 / 20,824`. Batching preserves geometry; larger merged bounds can keep a few more triangles submitted near view edges. These measurements support the rendering-call reduction for this scene and harness. They do not establish a device-specific FPS gain, a mobile battery result, or a general performance guarantee.

A shadow-refresh frame can cost more than a normal frame. Counter samples should always report viewport, pixel ratio, timeline time, motion state, and whether shadows refreshed. Do not compare an arbitrary moving frame with an arbitrary settled one and attribute every difference to batching.

## Rigid geometry batching

[`merge-static.ts`](../../src/scene/merge-static.ts) uses the official Three.js addon:

```ts
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
```

The implementation calls the dependency; it does not vendor a copied utility. [Official addon documentation](https://threejs.org/docs/pages/module-BufferGeometryUtils.html) explains its geometry compatibility requirements; the [Three.js r180 implementation](https://github.com/mrdoob/three.js/blob/r180/examples/jsm/utils/BufferGeometryUtils.js) matches the project's `three@0.180.x` dependency. Three.js attribution remains in the [third-party license inventory](../rights/dependencies.md).

The batching boundary is important. Architecture, folded-table parts, each temporal-object root, and each person root are separate rigid assemblies. Inside one assembly, meshes sharing a material instance, shadow flags, render order, and attribute names are candidates. Their local transforms are baked relative to the root, preserving placement, scale, normals, and UVs. Root groups survive, so picking, hover scaling, person sway, and island folding still work.

Transparent meshes remain separate to preserve Three.js sorting. Material arrays, hidden meshes, and meshes containing children are skipped. Lines and points are not merged. The source geometries are released after a successful merge, with retained shared references checked before disposal.

Tradeoffs:

- Converting indexed geometry to non-indexed geometry increases vertex-buffer storage for merged parts. It simplifies attribute compatibility and avoids changing surfaces.
- Merged bounding volumes are larger than individual-part volumes. Frustum culling can submit more geometry near edges, even while draw calls fall.
- Individual merged parts can no longer move, change materials, or receive separate picking IDs. Add such parts outside a batched root or do not batch that assembly.
- This utility is intended for the current rigid procedural meshes. Imported skinned/morphing meshes, custom per-mesh callbacks, groups with inherited render-layer overrides, or custom depth materials need a separate batching decision.

Do not merge an entire island containing independently selectable objects. Its six object roots must stay distinct.

## Allocation and animation work

The hypercube retains a `Float32Array` for projected vertices and a `BufferAttribute` for the 64 edge endpoints. Its 32-edge adjacency is built once at module initialization; trigonometric values are calculated once per update. A fixed conservative bounding sphere removes per-frame bounds recomputation. The algorithm writes existing coordinates instead of allocating sixteen `Vector3`s and endpoint arrays on every frame.

Camera, look, focus, pointer, palette, frame-status, and diagnostic records are reused. Picker root lists and ID lookup maps are prepared once. Pointer movement clears a reusable intersection array instead of rebuilding candidate/filter arrays; Three.js itself can still allocate its intersection records internally.

Outgoing archive displays fold smoothly toward their floor origin: scale is `1 - smoothstep(roomTime - room, .15, .85)`. Only a display with zero scale is hidden. This replaces the old `round(roomTime)` cutoff and clears foreground silhouettes before they reach the camera; reverse travel unfolds the display again. Architecture stays full size. Floating decorations and person sway update near the current era; hidden displays skip transform animation. Corridor geometry relies on ordinary Three.js frustum culling.

## Damping and frame timing

Time, camera position/aim, and hover emphasis use exponential damping:

```text
amount = 1 - exp(-deltaSeconds × rate)
next   = current + (target - current) × amount
```

This gives consistent easing across normal refresh rates. Time, camera, and hover use separate named rates in [settings](scene.md#settingsts-named-tuning-values). Small residuals snap exactly to their targets, so settled state can become idle. Frame delta is clamped to at most 0.05 seconds after a stall, avoiding an abrupt jump; very slow rendering consequently slows animation rather than attempting to catch up in one large step.

When motion is disabled, damping amounts become 1. Parallax and autonomous bobbing/sway stop; direct timeline state changes still update the projected hypercube and color palette.

## Shadow refreshes

Shadow maps use `autoUpdate = false`. A frame requests refresh when necessary:

1. The initial map is missing.
2. The scene changed and at least `1/12` second of animation time passed, with meaningful light travel (`0.25` units), scale changes, or a motion-mode change.
3. A dirty transition settles, even if its final travel was below the distance threshold.

The final rule prevents a stale last shadow after a small travel or hover adjustment. Idle decorative sway and photo bobbing intentionally reuse the settled map; their tiny shadow motion is not exact. For exact character or photo shadows, make their movement mark shadows dirty and measure the extra passes. The current cap is a maximum cadence in simulation time during qualifying motion, not an FPS target.

## RAF scheduling and page visibility

The lifecycle owns one requestAnimationFrame handle. Invalidating an already queued world does not create another loop.

| State | Rendering behavior |
| --- | --- |
| Motion enabled, page visible | RAF continues because photos, hypercubes, and people have ongoing visual animation. The dust particle positions themselves are fixed. |
| Motion disabled and settled | RAF stops. Timeline, focus, pointer, mode, or resize events request the next frame. |
| Motion disabled while direct state changes are applying | Necessary frames render; the world stops again once settled. |
| Document hidden | RAF is canceled immediately and no frame is requested. |
| Document visible again | The timestamp resets before resuming, so hidden wall-clock time does not jump the animation. |
| Disposed | RAF and listeners are removed and resources are released. |

Visibility handling follows the browser's [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API). Requesting a background screenshot or forcing an unusual headless visibility state can affect scheduling; inspect `document.hidden` when investigating a stopped loop.

## Inspect your own scene

A local browser module can use the public API without adding production UI:

```ts
import { createWorld } from "/src/world.ts";

const world = createWorld(canvas, () => {}, () => {});
world.setMotion(false);
world.setTime(2 / 3);
// Inspect after the scheduled frame has rendered.
console.table(world.getDiagnostics());
// Call world.dispose() when this experiment finishes.
```

Use a dedicated test canvas that fills its viewport; do not instantiate a second world on the production canvas. Sample `framesRendered` twice after reduced motion settles to verify that idle rendering stopped. Hide and restore the tab to verify clock reset. Travel through each era, open and close all seven categories, resize to mobile, and test pointer edges after changing batching or display retirement.

See the [world contract](world.md#diagnostics-fields) for every counter and the [scene reference](scene.md) for the implementation variables and functions.
