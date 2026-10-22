# `temporal-objects.ts`: six objects across four eras

[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

Source: [`src/temporal-objects.ts`](../../src/temporal-objects.ts). Read alongside [world construction](world.md), [timeline customization](../TIMELINE.md), and [content editing](../CONTENT.md).

This file constructs original procedural silhouettes from Three.js primitives. One call creates one category in one era. The world calls it six times per room, places the returned groups on the desk, and gives them selection IDs. Each era is a separate model instance; models do not continuously morph into each other as time moves.

## Exported types and factory

### `ObjectPalette`

| Field | Material role |
| --- | --- |
| `accent: string` | Colored casing, controls, continent fragments, hologram body. |
| `paper: string` | Pale plastic, notebook paper, ceramic, early globe surface. |
| `metal: string` | Metallic hardware, stands, rims, current devices. |
| `shadow: string` | Dark casing and generated screen background. |
| `light: string` | Unlit light-colored details, screen text, outlines. |

The argument is structurally compatible with `EraTheme`, which contains these five fields plus other scene/UI colors. This module ignores the additional theme fields. Palette strings should be valid Three.js/CSS colors.

### `TemporalObjectId`

The union is `"projects" | "photos" | "game" | "journal" | "food" | "places"`. `person` is deliberately constructed in [`person.ts`](person.md), outside this type. The IDs also exist in [`archive.ts`](../../src/archive.ts); keeping the category list, panel renderer, object layout, and this switch coordinated is necessary when adding a new category.

### `createTemporalObject(id, eraIndex, palette, year, phase, codeLines = []): T.Group`

| Parameter | Type | Meaning |
| --- | --- | --- |
| `id` | `TemporalObjectId` | Chooses the switch branch. |
| `eraIndex` | `number` | Normally array position `0..3`; chooses device generation. |
| `palette` | `ObjectPalette` | Era-specific material colors. |
| `year` | `string` | Text drawn into workstation screen headers. |
| `phase` | `string` | Text uppercased in headers and lowercased in fallback terminal status. |
| `codeLines` | `readonly string[]` | Optional project snippets drawn in terminal-mode screens. |

Local `root = new T.Group()` owns every constructed part. The factory returns it after setting `root.userData.temporalId = id`. It does not add the root to a scene, position it on a table, assign `userData.id`, register raycasting, animate it, or dispose it. [`scene/build.ts`](../../src/scene/build.ts) supplies `eraContent[eraIndex]?.project.code`, positions the root, batches compatible rigid parts, and registers it. The [scene animation, picking, and lifecycle modules](scene.md) own its later behavior and disposal.

The base coordinate convention is `Y` upward, desk contact near `Y = 0`, and device fronts toward `+Z`. Dimensions are relative world units. Local rotations are radians. Most small parts are intentionally exaggerated so the category remains readable from the corridor camera.

There is no runtime validation of IDs, palette fields, or era numbers here. The TypeScript caller normally supplies valid data. In particular, photos tests `eraIndex === 3` for its future branch, while several other branches use a final `else`; indexes beyond the current four chapters are not a consistent new-era API.

## Shared material variables

Local factory `material(color, roughness = .65, metalness = 0)` returns a new `MeshStandardMaterial`. Its arguments map directly to material properties.

| Local material | Construction | Use |
| --- | --- | --- |
| `dark` | `material(palette.shadow)` | Device casing, screens, notebook interiors. |
| `paper` | `material(palette.paper)` | Pale plastic, paper, ceramic surfaces. |
| `metal` | Roughness `.3`, metalness `.68` | Hardware, lenses, pedestals. |
| `accent` | Roughness `.4`, metalness `.2` | Colored case parts, controls, lines. |
| `glow` | `MeshBasicMaterial({color: palette.light})` | Visually bright unlit elements. Does not cast actual light. |
| `hologram` | Physical material: accent color/emissive, opacity `.28`, roughness `.12`, metalness `.3`, double-sided, `depthWrite: false`, emissive intensity `.3` | Transparent projected shapes. It uses neither transmission nor a custom hologram shader. |

All six are allocated for every call, even when a branch uses only some of them. Additional branch-local materials are described below. Attached mesh materials are later found by the world's cleanup traversal; unused allocations are not reachable through that traversal. If expanding this system significantly, create materials lazily or keep an explicit ownership list.

## Every helper function

### `mesh(geometry, mat, x = 0, y = 0, z = 0, parent = root)`

Receives a `BufferGeometry`, material, local position, and optional parent `Object3D`; returns local `result: Mesh`. It sets position, adds the mesh to its parent, enables receiving shadows, and enables casting except when `mat` is exactly the shared `hologram` or `glow` reference. This identity comparison is not a generic transparency test: a different transparent material can still cast shadows through this helper.

### `box(w, h, d, mat, x = 0, y = 0, z = 0, parent = root)`

Creates `BoxGeometry(w,h,d)`, delegates to `mesh`, and returns the resulting mesh. `w,h,d` are full extents. The center is the mesh origin; use the returned value to rotate a lid, grip, or page.

### `ball(r, mat, x = 0, y = 0, z = 0, segments = 24)`

Creates a sphere with radius `r`, `segments` around its circumference and `14` height segments. Delegates to `mesh` under `root`. Unlike `box`/`mesh`, this helper has no parent argument; nested-sphere parts use `mesh` directly when needed.

### `cylinder(radius, h, mat, x = 0, y = 0, z = 0, topRadius = radius)`

Creates `CylinderGeometry(topRadius,radius,h,28)` under `root`. The first radius argument in this wrapper is the **bottom** radius. The optional final `topRadius` permits tapering. Cylinders point along `Y`; lenses and styluses rotate the returned mesh to align along `Z`. No open-end option is exposed through this wrapper.

### `ring(radius, thickness, mat, x = 0, y = 0, z = 0)`

Creates `TorusGeometry(radius,thickness,8,48)` under `root`. `radius` is the torus major radius and `thickness` is tube radius. Its default plane is XY, so cup rims and horizontal projection bases rotate X by `PI/2` or `-PI/2`.

### `outline(geometry, color = palette.light, opacity = .8, parent = root)`

Local `line` combines `EdgesGeometry(geometry)` with a transparent `LineBasicMaterial`. It is added to `parent` and returned. It does not automatically copy the source mesh's position, which is why the future workstation explicitly copies the pane position into its outline. It does not add the supplied source geometry to the scene. Keep that distinction when implementing custom geometry ownership/cleanup.

### `screen(w, h, x, y, z, kind = "terminal", parent = root)`

Builds a generated texture on a very thin box; returns that box mesh.

1. Local `canvas` is `640 × 400`; local `ctx` fills it with `palette.shadow`.
2. Draw `year / PHASE` at `(34,53)` using `26px monospace` and `palette.light`.
3. For `kind === "terminal"`, local `lines` is either `codeLines` followed by a blank line and `_ enter the next fold`, or the built-in seven-line memory-system message. The array copy leaves the caller's readonly input unmodified. Callback locals `text` and `i` draw each line at X `34`, Y `103 + 35*i`.
4. Any other `kind` draws a dashboard, using loop `j = 0..3`. Outlined boxes form two columns/two rows: X `34+(j%2)*294`, Y `95+floor(j/2)*140`, size `260×112`. Bars begin `(48+(j%2)*294,110+floor(j/2)*140)`, width `60+20*j`, height `12`; their color alternates accent/metal.
5. Local `texture = CanvasTexture(canvas)` is marked `SRGBColorSpace`.
6. Return `box(w,h,.012,new MeshBasicMaterial({map:texture}),x,y,z,parent)`.

The generated texture fills all six box faces. There is no HTML, executable code, interactive dashboard, text wrapping, or automatic fit calculation inside this screen. More than roughly eight short terminal lines reaches the canvas bottom, and long lines clip horizontally. Only the `terminal` branch reads `codeLines`; current/future dashboard shapes do not display project snippets.

The basic screen material is a new instance rather than the shared `glow`, so the generic mesh helper marks it as casting a shadow. That is a result of the identity rule above.

### `buttons(x, y, z, horizontal = true): void`

Adds three `.05` radius spheres with loop-local `j`. The middle uses `glow`, others `accent`. If horizontal, positions advance X by `.16*j`; otherwise they advance Z by `.16*j`. Y remains constant. Returns no value. It is currently used by the second-era game controller.

## Complete branch matrix

| Category | Era 0 | Era 1 | Era 2 | Era 3 |
| --- | --- | --- | --- | --- |
| `projects` | Deep CRT, keyboard, tower | Thick laptop, terminal | Thin laptop, dashboard, phone | Projector disk, floating pane, projected keyboard |
| `photos` | Film camera | DSLR with long lens | Smaller digital camera with shorter lens | Volumetric scanner-like camera |
| `game` | Portrait monochrome handheld | Twin-grip controller | Wide handheld with two side controllers | Projection rings and separate hand controls |
| `journal` | Closed exercise book, pencil | Open notebook, ribbon | Tablet, stylus | Three floating translucent pages |
| `food` | Enamel mug | Ceramic cup | Transparent iced-coffee glass | Levitating translucent vessel |
| `places` | Coarse classroom globe | Warm earth-colored globe | Dark digital globe | Holographic globe with orbit ring |

These are generic original shapes. Their era choices are design decisions encoded in these branches; narrative descriptions do not invoke a device library or download external models.

## `projects`: workstation construction

### Era 0: CRT

The monitor body is a paper-colored `(1.95,1.45,1.12)` box centered `(0,.97,-.34)`. A dark `(1.59,1.07,.08)` inset at `(0,1.02,.26)` sits behind a `screen(1.42,.9,0,1.03,.31)`. A `.26` radius, `.24` high stem at `(0,.18,-.3)` sits above the `(1.35,.13,.7)` base. Together they create the monitor's depth rather than a flat laptop silhouette.

Local `keys` is the keyboard box `(1.85,.14,.64)` centered `(0,.05,.72)`, tilted X `.1`. Loop `j = 0..3` adds metal key rows `(1.55,.014,.045)` at Y `.135+.002*j`, Z `.5+.12*j`. A separate tower `(0.48,1.4,.98)` at `(-1.28,.67,-.24)` gets a dark drive slot at Y `1.04`, front Z `.26`, and a glowing `.045` indicator at Y `.69`, Z `.28`.

### Eras 1 and 2: laptop

`thin = eraIndex === 2` controls material and thickness. The base `(2.15, thickness,1.36)` uses `.2` dark casing in era 1 or `.075` metal in era 2. An inset keyboard area `(1.78,.02,.66)` sits at Z `-.16`, Y `.11` or `.05`; four accent key rows occupy Z `-.4+.14*j`. A trackpad `(0.5,.015,.27)` is at Z `.43` and the same chosen surface Y.

Local `lid` is a new nested group at `(0,.11,-.63)`, X rotation `-.17`. Its casing is `(2.15,1.4,.16/.055)` centered `(0,.7,0)`. Because both casing and screen are children of the lid, changing its tilt moves them together. The screen has dimensions `1.94 × 1.18`, local position `(0,.72,.09/.035)`, with terminal mode for era 1 and dashboard mode for era 2.

The thin branch adds local `phone`, a dark `(.38,.035,.68)` box at `(1.4,.02,.3)`, yaw `-.2`. This is a silhouette detail; it has no separate selection or app content.

### Era 3/final branch: projected workstation

A metal cylindrical base `.84` radius, `.1` high at `(0,.03,.08)` supports local `projectionRing` (`.66` major radius, `.025` tube), placed Y `.12`, Z `.08`, rotated X `-PI/2`. Local `pane` is `(2.4,1.5,.045)` translucent hologram at `(0,1.06,-.13)`. Local `frame` is the edge outline of the same dimensions, with its position copied from `pane`.

A dashboard screen `1.95 × 1.13` sits at `(0,1.07,-.09)`. Local `keyboard` is `(2.2,.025,.66)` hologram at `(0,.3,.91)`, tilted X `-.08`. Four glow rows lie at `(0,.32,.7+.13*j)`; they are root children rather than keyboard children, so changing the keyboard's tilt alone does not rotate its rows. A glowing sphere `.08` at `(-1.05,1.97,-.1)` completes the projected composition.

## `photos`: camera construction

Branch locals `film = eraIndex === 0` and `future = eraIndex === 3` choose analog/digital versus volumetric. In the nonfuture branch, `dslr = eraIndex === 1` chooses the bulkier body and long lens.

| Parameter | Film | DSLR | Era-2 digital |
| --- | ---: | ---: | ---: |
| Body width | 1.13 | 1.02 | 1.02 |
| Body height | .58 | .7 | .58 |
| Body depth | .36 | .45 | .45 |
| Body material | metal | dark | dark |
| Lens length `long` | .24 | .68 | .39 |
| Lens radius | .28 | .34 | .28 |

All body centers are `(0,.31,0)`. The film camera adds a pale top, dark viewfinder, and two short top cylinders as dials. Other cameras add a metal viewfinder housing, accent side grip, and glowing shutter detail, with larger viewfinder/grip heights for the DSLR.

Local `lens` is a cylinder at `(0,.31,.2+long/2)`, rotated X `PI/2` to project toward the camera front. Local `glass` is a thin cylinder at front Z `.21+long`, using a dedicated `material("#213845",.05,.75)`; it is a dark metallic surface, not transparent optical glass. Local `rim` is a torus on the front, radius `.32` for DSLR or `.265` otherwise, tube `.025`, dark for film/accent otherwise, rotated Z `.1`.

The future branch uses a metal `(.96,.48,.22)` body at Y `.42`, a translucent `(1.18,.74,.03)` rear pane at `(0,.43,-.15)`, two separated front rings, and a `.16` translucent sphere between them. Three small glow bars loop across X `-.3+.3*j` at Y `.72`. A dark cylindrical base `.32` radius, `.055` high sits near the desk. Its rings and sphere suggest volumetric capture; no scanner simulation or changing depth data is implemented.

## `game`: device construction

### Era 0: handheld

Local `device` is a root child rotated X `-.25`. Its paper-colored case is `(.85,.22,1.29)` at Y `.14`; the dark bezel `(.69,.035,.6)` and dedicated green display `(.47,.015,.39)`, color `#91a478`, lie near Z `-.23` at Y `.27/.3`. Two crossing dark boxes form the D-pad at `(-.2,.28,.3)`. Two small accent spheres use direct `mesh(...,device)` calls so they inherit the device tilt. The display is static; the HTML panel runs the mini-game separately.

### Era 1: controller

The dark center case is `(1.13,.2,.57)` at Y `.15`. Local `l` and `r` grips are `(.42,.25,.7)` at X `±.53`, Y `.1`, Z `.18`, yaw `+.25`/`-.25`. Two metal cylinders suggest thumbsticks. `buttons(.39,.29,-.12)` adds three controls; a `.075` glow ball marks the center. These are passive mesh parts, not individual input targets.

### Era 2: wide handheld

Dark body `(1.95,.17,.84)` at Y `.1`, dark teal display `(1.25,.025,.69)` in `#243b43` at Y `.2`, accent/metal side controllers at X `±.92`. Cylindrical sticks sit at opposite ends. Loop `j = 0..3` adds flat colored blocks across the screen at X `-.35+.22*j`, Y `.22`, Z `sin(1.3*j)*.2`. Those blocks suggest a game world but do not display the playable canvas.

### Era 3/final branch: projection controller

A metal `.49` radius, `.09` high base supports local `hoop` (`.58` radius, `.035` tube) and local `inner` (`.4`, `.012`), both centered Y `.49` and rotated X `-PI/3`. A `.14` hologram sphere lies at Y `.48`. Two metal `(.2,.075,.34)` grips are at X `±.63`, Y `.3`, Z `.16`. The hoops are not animated by this module; only their root inherits world hover/fold transforms.

## `journal`: writing-surface construction

### Era 0

Accent cover `(1.02,.18,1.35)`, paper page block `(.95,.09,1.26)`, thin upper cover, and a small pale cover label form a closed notebook. Local `pencil` is a `.025` radius, `1.25` long cylinder in dedicated `#d4ad59`, positioned `(.72,.08,0)`, rotated X `PI/2` and Z `-.15`.

### Era 1

Loop-local `side ∈ {-1,1}` places local `page` at X `.4*side`, Y `.1`, size `(.74,.1,1.21)`, with Z rotation `-.075*side`. Seven thin metal lines per page use `j = 0..6` and Z `-.42+.13*j`. An accent spine `(0.07,.18,1.24)` and small ribbon at `(.3,.23,.51)` complete the open-book silhouette. The text lines are root children; they do not rotate with a separately edited `page` mesh.

### Era 2

Local `tablet` is a group tilted X `-.22`. A metal `(1.02,.06,1.41)` body at Y `.12`, dark inset `(.91,.015,1.23)` at Y `.16`, and eight raised line boxes belong to that group. Loop `j = 0..7` uses short accent width `.43` for the first line and pale width `.7` afterward, at Z `-.4+.115*j`, Y `.18`. Local `stylus` is a separate paper-colored cylinder, `.02` radius, `1.15` long at `(.7,.1,0)`, rotated X `PI/2`.

### Era 3/final branch

A metal `.41` radius base supports three translucent local `page` meshes, loop `j = 0..2`. Page dimensions `(.92,.025,1.18)`, center `(j*.15-.15,.28+.16*j,-.13*j)`, yaw `.13*j`. Inner loop `n = 0..3` adds four glow text strokes per page. These strokes are placed directly under `root` using matching positions, not parented under `page`; a later page rotation edit needs matching stroke transforms or a new nested group.

The notebook geometry never reads journal text. Text is an HTML panel responsibility; write updates in archive content as explained in [CONTENT.md](../CONTENT.md).

## `food`: vessel construction

All branches share local `coffee = material("#4e2e21",.26)`. The color is independent of the era palette.

### Eras 0 and 1

`enamel = eraIndex === 0` selects the early mug versus ceramic cup. Both have a pale `.47` radius saucer near Y `.015`. Their cylindrical vessel uses bottom radius `.29`, top radius `.31` for enamel or `.36` for ceramic, height `.55/.45`, center Y `.31/.26`, material accent/paper. Local `rim` is a torus at Y `.59/.49`, rotated X `PI/2`; the coffee surface is a thin dark cylinder at Y `.585/.48`. A handle is a `.19` radius torus at `(.35,.31,0)`, metal `.035` tube for enamel or paper `.065` tube for ceramic.

### Era 2

Local `glass` is a separate `MeshPhysicalMaterial` using paper tint, transparency, opacity `.38`, metalness `.05`, roughness `.1`, double-sided, and `depthWrite: false`. A direct `mesh` call creates an **open-ended** cylinder with top/bottom radii `.3/.27`, height `.66`, radial segments `32`, height segments `1`. This bypasses the closed `cylinder` helper to expose open ends. The glass center is Y `.35`.

The coffee volume is a tapered cylinder (bottom `.26`, top `.285`, height `.42`) at Y `.24`, with a pale thin top at Y `.46`. Local `rim` is metal at Y `.69`, X rotation `PI/2`, above a `.38` radius metal saucer. Despite the variable name, the glass has no refraction/transmission and can exhibit normal transparent-surface sorting artifacts. It still casts shadows under the current generic helper because it is not the shared `hologram` reference.

### Era 3/final branch

A `.46` radius metal disk supports local `light` projection ring at Y `.1`, rotated X `PI/2`. The vessel itself is a hologram tapered cylinder, bottom radius `.18`, top `.34`, height `.44`, center Y `.56`, visibly lifted above its support. Local `rim` glows at Y `.78`; coffee sits at Y `.72`. Loop `j = 0..2` places `.025` glowing balls around a `.25` radius at Y `.25` using `(cos(2*j),sin(2*j))` in X/Z. These three samples are decorative, not evenly spaced `2*PI/3` angles.

## `places`: globe construction

Local `r = .5` is the surface radius for all versions.

### Era 0

Local `globe = ball(r,paper,0,.62,0,8)` uses only eight width segments, tilted Z `-.25`. Local `wire` uses `WireframeGeometry(SphereGeometry(r+.004,8,5))`, accent lines, placed Y `.62` as a separate root child. It does not inherit the globe mesh's tilt. Loop `j = 0..3` adds local `land` icosahedra with radius `.13+.02*j`, positions `(cos(1.7*j)*.36,.65+sin(1.7*j)*.2,.31)`, and Z scale `.25`. These are a stylized front-facing relief rather than geospatial continent data. A pale `.62 × .045 × .47` box suggests a classroom base.

### Eras 1, 2, and 3

Local `body` is the `.5` sphere at Y `.66`. Its material is a dedicated warm `#a89d65` for era 1, shared dark for era 2, and hologram otherwise. When `eraIndex < 3`, loop `j = 0..4` adds flattened local `land` icosahedra, radius `.14+(j%3)*.04`, at `(sin(1.8*j)*.34,.68+cos(1.8*j)*.21,.31)`, Z scale `.24`. Era 1 uses dedicated `#6d7851` materials; era 2 uses accent.

Local `wire` uses a finer sphere (`r+.008`, `16` width segments, `9` height segments) with light-color line material; opacity `.25` in era 1 or `.65` otherwise. It is parented to `body` at its origin, so it follows that sphere's transforms. Local `meridian` is a `.61` radius torus at Y `.66`, tube `.022`, metal for era 1 and glow for later eras, tilted Z `-.3`.

Exactly at era 3, local `orbit` adds another `.75` radius glow ring, tube `.014`, X tilt `1.15`, plus a `.06` glowing satellite at `(.72,.85,0)`. No orbit motion is calculated here.

### Shared support

Every version adds a `.31` radius, `.07` high base centered Y `.05`, paper for era 0 and metal otherwise. Before era 3, a `(.06,.23,.06)` metal stem at Y `.17` joins it to the sphere. Later versions replace the stem with local `base`, a `.24` glow ring at Y `.14`, X rotation `PI/2`, suggesting levitation.

## Local-symbol checklist

The tables and branch descriptions above cover each named binding. This condensed list helps locate one quickly:

| Scope | Named bindings |
| --- | --- |
| Factory/material setup | `root`, `material`, `dark`, `paper`, `metal`, `accent`, `glow`, `hologram` |
| Shape helpers | `mesh`, `result`, `box`, `ball`, `cylinder`, `ring`, `outline`, `line` |
| Screen | `screen`, `canvas`, `ctx`, `lines`, callback `text/i`, loop `j`, `texture` |
| Repeated controls | `buttons`, loop `j` |
| Projects | `keys`, `thin`, `lid`, `phone`, `projectionRing`, `pane`, `frame`, `keyboard`; key-row loops `j` |
| Photos | `film`, `future`, `dslr`, `long`, `lens`, `glass`, `rim`; indicator loop `j` |
| Game | `device`, `l`, `r`, `hoop`, `inner`; display loop `j` |
| Journal | `pencil`, `side`, `page`, `tablet`, `stylus`; line/page loops `j/n` |
| Food | `coffee`, `enamel`, `rim`, `glass`, `light`; particle loop `j` |
| Places | `r`, `globe`, `wire`, `land`, `body`, `meridian`, `orbit`, `base`; land loops `j` |

Loop variables with the same name belong to separate block scopes. They are counters, not shared animation state. Return-value variables such as `rim` exist so that a mesh can be rotated after construction; unnamed shape-helper calls still create real geometry and mesh nodes.

## Linkages, editing workflow, and limitations

To change a device generation, edit the category's exact era branch here. To change its name/story, edit `eras[index].objectStates[id]` in `archive.ts`. To change its linked project, title, progress, or panel text, edit `eraContent[index]`. To move the whole device, edit `objectLayouts` in `scene/build.ts`. These are distinct links; none infer the other from prose.

For a new part, construct it under the correct parent and maintain the root near the desk's contact point. A lid/tablet group is useful when several meshes must share a rotation. When a design currently creates rows or page marks directly under `root`, reparent them into a nested group if they must move as one object.

For a new era, do not assume increasing the array length produces a new silhouette. Audit all `=== 0`, `=== 1`, `=== 2`, `=== 3`, `<2`, and `<3` conditions, along with person stages and image palettes. For a new category, update `TemporalObjectId`, this switch, archive IDs/object states, world layout/picks, and the main panel rendering branch.

Texture labels are generated at world creation. They do not refresh after an in-memory data edit. No geometry exports its own `dispose`; once attached, the world's deduplicating scene traversal disposes its geometry, materials, and direct material texture properties. A caller using this factory outside the world must implement equivalent ownership and cleanup.

There are no downloaded meshes, branded logos, external texture services, shader-driven device morphs, working physical buttons, or baked animation clips in this file. The architecture deliberately keeps procedural construction inspectable so a learner can reconstruct each silhouette from boxes, spheres, cylinders, toruses, and line geometry.
