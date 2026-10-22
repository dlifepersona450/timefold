[Docs home](../README.md) · [Learning path](README.md) · Previous: [layers](02-shell-and-scene.md) · Next: [time](04-time.md)

# 3. Turn simple geometry into a layered world

A recognizable object does not always need a downloaded model. A monitor can begin as a box, a camera lens as a cylinder, a cup handle as a torus, and a globe as a sphere with orbit lines. TIMEFOLD's procedural factories make those construction decisions explicit.

## Start with a local-coordinate group

Create a `Group` for an object and put all of its parts inside it. Position those parts relative to that root. Only then place the root in the room.

```ts
const book = new T.Group();
const cover = new T.Mesh(
  new T.BoxGeometry(1.02, 0.18, 1.35),
  new T.MeshStandardMaterial({ color: '#c5684f' }),
);
cover.position.y = 0.09;
book.add(cover);
const pages = new T.Mesh(
  new T.BoxGeometry(0.95, 0.09, 1.26),
  new T.MeshStandardMaterial({ color: '#edd0b0' }),
);
pages.position.set(0.02, 0.1, 0);
book.add(pages);
book.position.set(-2.3, 2, 0.94);
```

This isolated exercise uses the same kind of dimensions as the childhood notebook. The full factory adds more detail, era branches, materials, shadow flags, and a returned selectable root.

Changing `book.position` moves the entire book. Changing `pages.position` moves the pages within it. That distinction is the basis of mesh reuse and reliable focus/picking.

## Build shape helpers deliberately

`createTemporalObject` has local helpers for mesh creation, boxes, balls, cylinders, rings, outlines, screens, and small buttons. Each helper standardizes defaults such as shadow flags and parent attachment. Learn their parameter order before changing geometry: the cylinder helper has both base and optional top radius, which changes its taper.

The complete [object reference](../reference/objects.md) lists every helper, local material, dimension branch, and return value. The [symbol inventory](../generated/symbols/temporal-objects.md) locates every short `x`, `y`, `z`, `j`, and `parent` binding by scope.

## Make 2.5D through depth separation

The slab uses multiple thin layers with slightly different dimensions and rotations. Photographs are planar framed images, but a shallow cone relief projects beyond the plane. Moving the camera changes overlap/parallax between these layers.

This is a composition technique, not a special “2.5D renderer.” The browser still renders a 3D scene. Thickness, lighting, and perspective make flat elements feel like a little physical archive.

## Give eras different silhouettes

Changing color alone is not enough to communicate old versus future technology. The source uses different geometry branches:

- Workstation: deep CRT/tower/keyboard → thick laptop → slim laptop → floating light interface.
- Camera: film compact → large DSLR lens/body → mirrorless → speculative floating lens/sensor.
- Game device: portrait cartridge handheld → twin-stick gamepad → wide handheld → spatial control rings.
- Writing: paper exercise book → open notebook → tablet/stylus → suspended pages.
- Ritual: enamel/ceramic/glass/future vessels.
- Globe: printed/vintage/digital/holographic variations.

Each era returns a distinct group; the category ID and root-registration contract stay stable even though their children differ. That is why the same `ArchiveId` can open the correct memory across all four rooms.

## Batch rigid details after construction

`scene/build.ts` constructs the detailed local groups, then calls `mergeStaticMeshes` where their opaque parts can move as one rigid assembly. That helper bakes each compatible part's transform relative to the root and combines matching material/shadow/geometry-layout buckets. Picking still resolves the outer category root. Transparent surfaces remain separate so the renderer can sort them.

Keep independently moving children out of such a batch: a future page that needs its own animation cannot have its transform baked into a parent mesh. Static merging reduces draw submissions; it is not instancing, and it does not require removing the authored silhouette. Study [scene construction and merging](../reference/scene.md) and [the performance tradeoffs](../reference/performance.md) before changing the batch boundary.

## Materials and generated textures

Use roughness/metalness to separate paper from hardware. Transparent physical materials create the future's light surfaces, while basic materials keep screen/glow colors visible without requiring direct light. A canvas can become a `CanvasTexture`; its source is generated code rather than a fetched picture.

The actual module allocates some materials that a branch may not use. Scene traversal only sees attached resources during disposal; a general reusable renderer should track all allocations explicitly. This limitation is documented rather than hidden by the helper abstraction.

## Practice

1. Modify the book's cover thickness and compare it in the old/present eras.
2. Add a small bookmark as a child mesh, keeping the same category root.
3. Change a material through the era palette rather than a random global CSS color.
4. Verify camera focus, hover, shadows, and mobile framing after a geometry change.

Next, [make the room's identity depend on time](04-time.md).
