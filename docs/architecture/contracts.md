[Docs home](../README.md) · [Runtime flow](runtime.md) · [Verification](../learn/09-verification.md)

# Contracts, assumptions, and extension boundaries

These are the conditions the current implementation expects. They explain why an apparently small edit can require changes elsewhere.

## Data contracts

| Assumption | Reason | What to update if changing it |
| --- | --- | --- |
| At least two eras | Sampling reads adjacent entries and divides by chapter count | Add explicit zero/one-era behavior before reducing further |
| `eras` and `eraContent` share length and order | Index links room, appearance, and memories | Add both entries together; no automatic date join exists |
| Years are numeric strings in chronological order | Calendar interpolation uses `Number(year)` | Use another formatter/calculation for nonnumeric dates |
| Age is authored independently of prose | Geometry/sampling reads numeric `person.age` | Update age expressions and written notes together |
| Every era has all seven `objectStates` | Index/panels read the selected category directly | Add complete records when adding categories/eras |
| All theme fields are six-digit hex colors | `mixHex` parses and bit-shifts RGB channels | Add a color parser/validator before accepting other formats |
| Gallery contains at least one item | Panel immediately reads item zero; navigation uses its length | Implement an empty state before clearing the list |
| Places contains at least one entry | Map initially reads its first coordinate | Add empty-list behavior before removing all places |
| Typed source is trusted authored content | It is compiled local data, not a remote input parser | Validate at runtime before connecting a CMS/feed |

TypeScript checks declared shapes, not semantic chronology, permissions, color contrast, URL availability, or an external image's contents.

## Identity contracts

A category ID appears in `objects`, `ArchiveId`, every `objectStates`, resource keys, world layouts, mesh creation dispatch, and panel dispatch. Renaming one side breaks the relationship. Resource IDs are different: they label pieces of work inside a category and are not looked up as scene roots.

`userData.id` marks a selectable root; `userData.room` supplies its era. Nested meshes can have arbitrary names, but a hit must climb to the registered root. Preserve that parent relationship when replacing a mesh with a model.

## Coordinate contracts

Three.js world Y is up. Persons face +Z and stand with feet near Y=0. Object factories return groups with local origins suitable for tabletop placement. `scene/build.ts` applies position/rotation after construction. Shared room spacing is 16 units; the first room is at Z=-5.

Picking converts pointer coordinates through `canvas.getBoundingClientRect()`. Renderer size, mobile breakpoint, and camera aspect in `scene/lifecycle.ts` still use viewport dimensions. Embedding the scene in a smaller element therefore requires adapting that resize contract, even though the picking conversion already supports a canvas rectangle.

## Presentation contracts

The controller's `selectedEra` responds to requested time. The world's `currentTime` can lag while easing. A static detail view is associated with a snapped chapter. Object forms, person costumes, and memory snapshots do not continuously morph; world atmosphere and movement do.

Architectural surfaces keep per-room material colors. Lighting/fog interpolate globally. CSS themes use sampled RGB channels. Calling this “all materials physically changing wavelength” would be inaccurate.

`style.css` contains an earlier green presentation followed by explicit temporal-theme overrides. The cascade and later rules matter. If reorganizing, preserve specificity, media query behavior, and custom-property inheritance; do not delete a repeated selector on the assumption it is accidental.

## Rendering and performance contracts

- Renderer pixel ratio is capped at `SCENE_SETTINGS.maxPixelRatio`, with resizing handled centrally; this is not an automatic hardware-quality ladder.
- Shadow updates track travel, hovered/selected scale, display visibility, and motion changes. Travel passes are throttled, and settling produces a final map. Decorative idle sway deliberately reuses a shadow map; it does not force a new shadow pass every frame.
- `mergeStaticMeshes` batches compatible opaque rigid meshes within one pickable or moving root. Transparent materials remain separate. Do not run it across independently animated descendants: their transforms would be baked away.
- Geometry is procedural; there is no GLTF loader, texture atlas, instancing system, or model asset pipeline yet. Static merging is a distinct optimization from instancing.
- Four rooms and people are prebuilt. An outgoing display scales smoothly toward its floor anchor over the authored retirement interval, then hides at scale zero; it unfolds on reverse travel. It is hidden, not unloaded, and architecture remains full size for continuity. Frustum culling can additionally omit off-screen meshes from rendering.
- Reduced motion disables decorative movement and snaps travel/focus interpolation. Its settled view stops scheduling RAF callbacks until an input, resize, or visibility change invalidates it. Ambient-motion mode continues animating while visible; hidden documents pause both modes.
- Animation uses elapsed seconds with a clamped, resettable clock. A fresh timestamp after visibility changes prevents a background-tab interval becoming a camera jump.
- `getDiagnostics()` returns a copied counter record. A draw-call count is not an FPS measurement, and one software-renderer result is not a hardware guarantee. See [performance and diagnostics](../reference/performance.md).
- A slow software WebGL browser is useful for correctness checks but is not a representative GPU performance benchmark.

## Links, images, and ownership

Resource URLs are restricted by the controller to HTTP(S) after relative URL resolution. Image `src` values are trusted authored markup; they are not a general remote-image sanitization boundary. Always provide appropriate alt text and use content you can distribute.

A resource link is an outbound destination; it does not embed, import, synchronize, or grant rights over that destination. Uploaded public files are distributed with the build. [Rights documentation](../rights/README.md) explains the different implications.

## Deliberate nonfeatures

There is no admin interface, database, automatic feed import, routing system, user identity, analytics, upload service, saved game, automatic project-history inference, or deployment integration in this local prototype. These can be added behind the existing data/controller boundaries, but the current docs never depend on them being present.
