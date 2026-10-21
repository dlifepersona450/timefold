# Scene modules: construction, motion, picking, and cleanup

[Docs home](../README.md) · [World API](world.md) · [Performance and measurements](performance.md) · [All symbols](../generated/SYMBOLS.md)

The modules under [`src/scene/`](../../src/scene/) separate things that happen once from things that happen every frame. Geometry is constructed once; animation mutates existing objects; pointer interaction reports archive IDs; lifecycle decides when rendering runs and frees resources. This page explains the purpose and linkages of each module. The generated inventory supplies the exhaustive declaration-level lookup.

## Module map

| Source | Main exports | Responsibility |
| --- | --- | --- |
| [`types.ts`](../../src/scene/types.ts) | `PickTarget`, `FloatingElement`, `SceneGraph`, `WorldDiagnostics` | Shared typed records; imports of Three.js types are compile-time only. |
| [`settings.ts`](../../src/scene/settings.ts) | `SCENE_SETTINGS` | Named rendering and motion tuning constants. |
| [`build.ts`](../../src/scene/build.ts) | `buildScene` | Lights, corridor, era displays, object placement, generated textures, dust, and pick registration. |
| [`merge-static.ts`](../../src/scene/merge-static.ts) | `mergeStaticMeshes` | Per-material batching inside one rigid group. |
| [`hypercube.ts`](../../src/scene/hypercube.ts) | `Hypercube`, `createHypercube`, `updateHypercube` | Reusable 4D projection buffers and line rendering. |
| [`animation.ts`](../../src/scene/animation.ts) | `createSceneAnimation` | Time/camera damping, object emphasis, display retirement, colors, and shadow-refresh decisions. |
| [`picking.ts`](../../src/scene/picking.ts) | `createPicking` | Pointer listeners, raycasts, hover stability, and short-click selection. |
| [`lifecycle.ts`](../../src/scene/lifecycle.ts) | `createRenderer`, `createSceneLifecycle` | Rendering schedule, viewport, diagnostics, document visibility, and GPU cleanup. |

`world.ts` imports and assembles these pieces. `main.ts` interacts with the [World contract](world.md); it does not reach into these internal modules.

## `types.ts`: shared records

`PickTarget` has `id: ArchiveId`, `room: number`, and `root: T.Group`. It represents one physical selectable group. Several targets may share an ID, such as the camera and the three floating photo frames. Root identity distinguishes hover targets; category ID drives HTML content.

`FloatingElement` has `root`, `room`, `baseY`, `phase`, and optional `hypercube`. The room enables skipping hidden/distant animation. `baseY` avoids accumulating bobbing offsets. `phase` offsets sine waves. The explicit hypercube field replaces untyped storage in `root.userData`.

`SceneGraph` groups the persistent scene references:

| Field | Purpose |
| --- | --- |
| `scene` | The root `T.Scene`, including background and fog. |
| `ambient` | Hemisphere light, with independently blended sky/ground colors. |
| `sun` | Main directional light and shadow camera/target. |
| `fill` | Colored directional fill light. |
| `dustMaterial` | Shared color/size/opacity for the fixed dust field. |
| `displays` | One archive display per era; separate from corridor architecture. |
| `islands` | Folded-table groups; their rotation/depth changes during time travel. |
| `people` | One sculptural person group per era. |
| `floats` | Photo frames and hypercube portals with baseline animation data. |
| `picks` | All physical targets, used for hover/focus emphasis. |
| `picksByRoom` | Precomputed room grouping for picking and focus lookup. |

`WorldDiagnostics` contains `drawCalls`, `triangles`, `pixelRatio`, `framesRendered`, and `shadowsRendered`; [the API page](world.md#diagnostics-fields) specifies their units and limits.

## `settings.ts`: named tuning values

`SCENE_SETTINGS` is a readonly object through `as const`. It contains scene mechanics, while dates, biographies, and colors remain in `archive.ts`.

| Key | Default | Meaning |
| --- | --- | --- |
| `maxPixelRatio` | `1.5` | Upper bound on drawing-buffer scale, reapplied on resize. |
| `mobileBreakpoint` | `700` | Viewport width below which mobile FOV and camera composition apply. |
| `fogDensity` | `.022` | Exponential corridor fog density. |
| `timeDamping` | `5` | Rate at which rendered normalized time approaches its target. |
| `cameraDamping` | `6` | Rate for camera position and look target. |
| `hoverDamping` | `10` | Rate for interactive-root scale emphasis. |
| `timeEpsilon` | `.00002` | Normalized-time residual at which time snaps to its target. |
| `positionEpsilon` | `.001` | World-space position/aim residual at which the camera settles exactly. |
| `scaleEpsilon` | `.0001` | Scale residual at which root emphasis settles exactly. |
| `hoverScale` | `1.045` | Uniform emphasized scale of a pickable root. |
| `shadowInterval` | `1/12` | Minimum animation-time spacing between qualifying in-motion shadow refreshes. |
| `shadowDistance` | `.25` | Light-travel distance qualifying a throttled refresh. |
| `displayRetireStart` | `.15` | Fraction of an era interval after its anchor when the outgoing archive starts folding down. |
| `displayRetireEnd` | `.85` | Fraction at which the outgoing archive reaches zero scale and becomes hidden. |
| `clickDistance` | `8` | Maximum CSS-pixel pointer travel treated as a click. |

Keep retirement start below end and both within one era interval. Increasing damping rates makes travel settle faster. Increasing pixel ratio affects every rendered frame and GPU buffer size; measure it on the intended devices.

## `build.ts`: construction and placement

`buildScene(): SceneGraph` has no arguments. It reads `eras`, `eraContent`, `FIRST_ROOM_Z`, and `ROOM_SPACING` and creates the world once. Import links are explicit:

- `landscape` supplies original Canvas-generated photo textures.
- `createTemporalObject` supplies the six desk object silhouettes for each era, including optional project code lines.
- `createPerson` supplies age/stage/costume geometry.
- `createHypercube` supplies portal wireframes.
- `mergeStaticMeshes` batches eligible rigid surfaces before animation starts.

The scene starts with era 0 background/fog. Hemisphere intensity is `2.1`; the sun has intensity `3.8`, a `1024²` shadow map, position `(-7,15,12)`, orthographic bounds left/right `-25/25`, top/bottom `25/-35`, normal bias `.04`, and bias `-.0001`. Fill intensity is `1.3`, initially at `(8,6,-35)`. Basic-material ceiling strips and screens appear lit; they are not real area lights. No bloom or postprocessing pass is added.

### Construction helpers

`createMaterial(color, roughness=.7, metalness=0)` returns a new `MeshStandardMaterial`. Reuse its result to share a surface. Several meshes only batch together when they use the same material instance.

`addBox(width,height,depth,surface,x=0,y=0,z=0,parent=scene)` creates centered box geometry, sets its local position, enables casting/receiving shadows, adds it to the parent, and returns the mesh. Rotating the result rotates around its center.

`createLabel(text,color,width=3,height=.7)` draws text into a `1024×192` canvas, creates an sRGB `CanvasTexture`, and returns a plane with a transparent basic material and `depthWrite=false`. Labels remain independent of opaque mesh batching.

### Per-era hierarchy

```text
scene
└─ room (Z = FIRST_ROOM_Z - eraIndex * ROOM_SPACING)
   ├─ architecture (static opaque material batches)
   └─ archiveDisplay (smooth retirement scale; can become hidden)
      ├─ island (fold rotation and shallow-depth change)
      │  ├─ table (batched layers/base)
      │  ├─ border (line geometry)
      │  └─ six separate temporal-object roots
      ├─ person root
      ├─ person label
      ├─ three floating photo roots
      ├─ room label
      └─ portal → hypercube lines
```

Each room is 24 units wide and approximately 14 units tall. `segmentLength` adds a 15-unit entrance extension only for the first room; `segmentOffset=7.5` centers that extension. Floors, walls, ceiling, tile seams, columns, lintels, strips, and threshold lines share era-specific materials. Architecture batches before display creation, ensuring no interactive object is merged into the corridor.

`objectLayouts` contains the six IDs and their X/Y/Z/rotation placements. Edit it to move a desk object; its root is the hover/focus unit. The table's four thin layers rotate slightly around Y, with a top slab and support below. `borderSource` is a temporary box used to create the edge outline; it is disposed immediately after `EdgesGeometry` is created.

Every temporal object registers `{id,room,root}` after batching its rigid parts. The person is placed at `(5.3,0,.95)` and registers `person`; its initial yaw is `-.15`. Person age/stage labels derive from era data. Three floating photo groups register `photos` and enter `floats` with their baseline Y and phase. Their textures cycle through the generated `landscape` textures. The portal sits at `(5.8,5.8,-4)` and enters `floats` with explicit hypercube data.

After the era loop, the builder adds the final wall and lit end panel. A deterministic Park–Miller generator (`seed=31`, multiplier `16807`, modulus `2147483647`) fills 360 dust positions. Dust size is `.028`, opacity `.5`; points are stationary, while their material color follows time. `picksByRoom` is computed once from `picks` before returning the graph.

Room count follows `eras.length`, but the wider project still encodes four stages in artwork/object/person content. Palette interpolation requires at least two eras. See the [timeline guide](../TIMELINE.md) before changing chapter count.

## `merge-static.ts`: rigid surface batching

`mergeStaticMeshes(root: T.Group): void` updates world matrices and collects compatible opaque leaf meshes inside one rigid root. Buckets use material UUID, cast/receive shadow flags, render order, and geometry attribute names. Transparent meshes, material arrays, invisible meshes, and mesh nodes containing children are skipped.

For each bucket with at least two meshes:

1. Clone non-indexed geometry or convert indexed geometry to non-indexed form.
2. Compute `inverseRoot × mesh.matrixWorld` and apply that relative transform to geometry, including normals.
3. Call `mergeGeometries(geometries,false)` and release temporary geometry copies.
4. If successful, create one mesh with the original material and shadow/render-order settings, remove source meshes, and add the batch to the existing root.
5. Retain any removed geometry still referenced by another attached mesh; dispose the rest once.

`buckets`, `inverseRoot`, `relativeTransform`, and `removedGeometries` exist only during construction. They are not frame-loop allocations. The original root survives, so category picking and group transforms remain intact. Do not batch across independent animation boundaries or pass imported skinned/morphing assets without extending the checks.

The merge implementation is the installed Three.js addon, documented in [BufferGeometryUtils](https://threejs.org/docs/pages/module-BufferGeometryUtils.html); its [r180 source](https://github.com/mrdoob/three.js/blob/r180/examples/jsm/utils/BufferGeometryUtils.js) is the version reference. [Performance tradeoffs and license linkage](performance.md#rigid-geometry-batching) explain the non-indexed buffers and retained transparent parts.

## `hypercube.ts`: a reusable 4D projection

`Hypercube` stores `lines` and a 48-value `vertices` array. Module initialization builds `EDGES`, a 64-value `Uint8Array` of endpoint indices: vertices `0..15` are neighbors when their binary representation differs in one bit. The `vertex < neighbor` condition stores each of the 32 edges once.

`createHypercube(color)` creates a position attribute of `64×3` floats, sets `DynamicDrawUsage`, installs a conservative fixed radius-3 bounding sphere, creates the transparent line material at opacity `.7`, and initializes the projection at time zero.

`updateHypercube(hypercube,time)` calculates four trigonometric values once. The 16 input vertices contain coordinates ±1 in X/Y/Z/W. It rotates XW by `time`, then YW by `time*.7`, and applies perspective factor `3.5/(3.5-rotatedW)*.65`. The projected XYZ values go into existing `vertices`; the precomputed edge table copies them into the existing line-position buffer. Setting `needsUpdate=true` uploads the changed attribute. No vertex objects, edge arrays, or new bounds are created in the frame update.

This is a projected tesseract illustration. The page does not simulate relativistic spacetime or a physically traversable fourth spatial dimension.

## `animation.ts`: time, camera, color, and emphasis

`createSceneAnimation(graph,camera)` returns state methods plus `update(delta,motion)`. State is kept private in its closure:

| State | Purpose |
| --- | --- |
| `targetTime`, `currentTime` | Requested and smoothly rendered normalized time. |
| `elapsed` | Visible animation time for bobbing and sway; lifecycle excludes hidden time. |
| `selected`, `hovered` | Focused category and exact hovered physical target. |
| `mobile`, `mouse` | Camera composition mode and normalized parallax input. |
| `cameraTarget`, `lookTarget`, `currentLook`, `focusPosition` | Reused camera/focus vectors. |
| `focusTargets` | Per-room ID maps retaining the first registered target per category. |
| `paletteColors` | Preallocated Three.js colors for each era's background/light/ambient/shadow/accent. |
| `lastShadowZ`, `shadowAge`, `shadowDirty`, `previousMotion` | Throttled shadow updates and final-settle state. |
| `frameState` | Reused `{pending,updateShadows}` result consumed immediately by lifecycle. |

`damp(value,target,amount,epsilon)` lerps a scalar and snaps a small residual exactly to its target. It is used for timeline and hover scales. `update` follows this order:

1. Advance visible elapsed time and shadow age. Derive separate exponential amounts for time, camera, and hover; disabled motion uses amount 1.
2. Damp time. Calculate `roomTime=currentTime*(eras.length-1)`, `travelZ=-roomTime*ROOM_SPACING`, and the requested `activeRoom` for focus/emphasis.
3. Compute corridor camera and aim. Desktop targets are `(5.2,6.8,11+travelZ)` and `(-.7,1.8,-8+travelZ)`; mobile targets are `(5.5,7.2,18+travelZ)` and `(.3,1.8,-8+travelZ)`. Enabled parallax adds `mouse.x*.6` to X and subtracts `mouse.y*.4` from Y.
4. If selected, obtain the requested era's category root world position. Add `1.65` Y for person framing. Camera offset is `(4,person?1.7:3.2,person?7:6)`; aim offset is `(mobile?0:2,.3,0)`. No temporary offset vectors are allocated.
5. Damp camera position and aim, snap sufficiently small residuals, and call `lookAt`.
6. Smoothly retire each outgoing display with `scale=1-smoothstep(roomTime-room,.15,.85)`. Hide only at zero, preserve architecture, and mark changed display scales as shadow dirty. Reverse travel restores them continuously.
7. For visible nearby floats, set baseline-relative bobbing `sin(elapsed*.5+phase)*.09` and update the hypercube at `(motion?elapsed*.13:0)+currentTime*2`.
8. Fold islands using `sin((roomTime%1)*PI)^2` and a proximity factor `max(0,1-abs(roomTime-room)/1.25)`. Alternating rooms rotate Y by up to `.065` and Z by `.022`; depth scales by up to `.055`. Nearby people sway by `sin(elapsed*.24+room)*.025` around yaw `-.15`.
9. Damp target root scale toward `1.045` for hovered/focused categories in the requested era, otherwise 1. Hidden roots skip animation. Use child groups for permanent nonuniform object sizing.
10. Blend background/fog, hemisphere sky/ground, sun/fill, and dust colors between adjacent preallocated palettes. These are art-directed Three.js color blends; CSS theme blending is separately implemented in `timeline.ts`.
11. Move the sun to Z `12+travelZ`, its target to `travelZ-10`, and fill to `travelZ-15`. Decide whether the initial, throttled, or final settled shadow map needs refreshing.
12. Return the existing `frameState`, with `pending` describing unsettled time/camera/hover and `updateShadows` describing a requested refresh.

Methods returned alongside `update` are `getPickingRoom`, `isFocused`, `setTime`, `focus`, `setPointer`, `setHover`, and `setMobile`. `getPickingRoom` uses requested `targetTime`, matching HTML content and focus, rather than the lagging camera's current time. Intermediate visible props from an outgoing room remain scenery; only the destination era's targets are selectable during travel.

## `picking.ts`: pointer interaction

`createPicking(canvas,camera,graph,state,onSelect,onHover)` accepts a narrow `InteractionState` with `room`, `focused`, `pointer`, `hover`, and `invalidate` functions. It prepares one `Raycaster`, one normalized-device `pointer`, a reusable `hits` array, per-room root lists, and `targetByRoot` lookups. `hovered`, `downX`, and `downY` track pointer interaction.

`pick(event,keepCurrent)` normalizes coordinates relative to the canvas bounds, updates the camera world matrix, and sets the ray. It checks the requested room's display visibility. For hover, it first intersects the currently hovered root; if that still intersects, it keeps the target. This prevents enlarged adjacent silhouettes from alternating hover identities. Otherwise it intersects the room's prepared roots, climbs from the nearest mesh to its registered group, and returns that `PickTarget`. Click selection uses a fresh nearest hit rather than sticky hover.

`move` reports normalized parallax input, raycasts when unfocused, updates the cursor/tooltip, and invalidates the frame. `pointerDown` stores CSS coordinates. `pointerUp` ignores focused panels and gestures beyond `clickDistance`, then calls `onSelect` for a hit. `clear` clears hover and tooltip, sets a grab cursor, and invalidates. `leave` also recenters parallax. The returned `dispose` removes all four canvas listeners and resets the cursor.

Canvas listeners are pointermove, pointerdown, pointerup, and pointerleave. Timeline drag/wheel/keyboard navigation remains the responsibility of the HTML interface; mesh picking does not replace semantic keyboard controls.

## `lifecycle.ts`: rendering and resource ownership

`createRenderer(canvas)` creates an antialiased opaque `WebGLRenderer` with a high-performance preference, soft shadow maps, `autoUpdate=false`, initial shadow refresh, ACES filmic tone mapping, and exposure `1.12`.

`createSceneLifecycle(renderer,camera,graph,animation,initialMotion)` owns `motion`, `frame`, `lastTimestamp`, `disposed`, and the reusable diagnostics object. Its inner functions have separate duties:

| Function | Behavior |
| --- | --- |
| `invalidate()` | Queues one RAF if alive, visible, and not already queued. |
| `render(timestamp)` | Clears the handle, computes a nonnegative delta capped at `.05`, updates animation, requests necessary shadows, renders, records diagnostics, and schedules again only for enabled ambient motion or unsettled state. |
| `resize()` | Applies capped DPR and viewport size, sets mobile composition, updates camera aspect/FOV, stores pixel ratio, and invalidates. FOV is 55 on mobile or 45 otherwise. |
| `visibilityChanged()` | Cancels any queued frame, clears the timestamp, and resumes only if visible. |

Initialization resizes once and attaches a window resize listener plus a document visibilitychange listener. Returned `setMotion` updates the mode and invalidates. Returned `getDiagnostics` copies counters on demand. Returned `dispose` marks the loop disposed, cancels RAF, removes both listeners, disposes scene resources, and disposes the renderer.

`disposeScene(scene)` deduplicates attached geometries, materials, and direct material textures in three Sets. Mesh, Points, and LineSegments nodes contribute resources; directional lights release their shadow targets. Each resource is disposed once, then the scene is cleared. Custom shader resources nested in uniform trees, external loader caches, or objects created but never attached need their own explicit ownership if introduced later. Current procedural object factories still create some branch-specific unused materials; those have not been uploaded as scene surfaces and are left to JavaScript garbage collection.

The [performance chapter](performance.md) gives the exact scheduling table, shadow tradeoffs, measurements, and reproduction guidance.
