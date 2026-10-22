# `person.ts`: procedural anatomy, aging, and costume

[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

Source: [`src/person.ts`](../../src/person.ts). Related: [world placement and focus](world.md), [SVG panel portrait](portrait.md), [timeline/person editing](../TIMELINE.md).

This module builds a stylized human from primitive Three.js meshes. One configured stage chooses a readable silhouette and costume; a numeric age adjusts growth, head proportions, posture, and optional facial creases. It is an original procedural figure with no downloaded character, rig, texture, or motion-capture file.

The world creates one figure per room at startup. Travelling reveals another room's figure. There is no live morph between a child mesh and an elder mesh, no skeletal animation, and no real-time biological simulation. That distinction helps you decide which file to change: timeline data selects appearances; this file defines how those appearances become geometry.

## Input type: `PersonAppearance`

| Property | Type | Read by geometry? | Meaning |
| --- | --- | --- | --- |
| `age` | `number` | Yes | Numeric growth/posture/crease input, sanitized as described below. |
| `stage` | `string` | Yes | Known names select child/young-adult/adult/elder branches. |
| `outfit` | `string` | No | Descriptive costume text used by the panel; not a model-generation prompt. |
| `description` | `string` | No | Story text used elsewhere; not facial expression or animation instructions. |
| `hair` | `string` | Yes | Hair/scalp/eyebrow material color. |
| `top` | `string` | Yes | Main upper-body and coat color. |
| `bottom` | `string` | Yes | Leg/trouser material color. |
| `skin` | `string` | Yes | Skin material color; wrinkle material is derived from it. |

[`archive.ts`](../../src/archive.ts) defines `PersonState` with the same properties and a narrower stage union. TypeScript structural typing lets it pass directly to this factory. `PersonAppearance` itself permits any stage string because the factory has a fallback for unknown values.

## Export: `createPerson(appearance, eraIndex, accent): T.Group`

* `appearance: PersonAppearance`: input data; the function reads it without mutation.
* `eraIndex: number`: fallback stage selector when `appearance.stage` is unknown. Under normal archive data, the explicit stage takes precedence.
* `accent: string`: era color used in straps, seams, watch detail, bag, and luminous future details.

Returns a `Group` oriented toward `+Z`, with feet resting at approximately `Y = 0`. It is not attached to a scene. `scene/build.ts` positions it at `(5.3,0,.95)` relative to the room display, applies yaw `-.15`, batches compatible rigid opaque parts, adds picking metadata, and registers the category `person`. The builder also supplies the current room's `theme.accent`; animation and picking use the preserved outer root.

The factory sets `root.name` to a debugging label containing the original configured stage and age; `root.userData.personAge` contains the sanitized age, and `root.userData.personStage` contains the resolved known stage. It does not set the raycast selection key `userData.id`: world assembly does that afterward.

## Stage and age resolution: every setup variable

| Local | Exact behavior |
| --- | --- |
| `stages` | Ordered array `["child","young-adult","adult","elder"]`. |
| `stageIndex` | `stages.indexOf(appearance.stage)`; `-1` for unknown stage. |
| `era` | `stageIndex` if known; otherwise round finite `eraIndex` (or `0`) and clamp to `0..3`. |
| `age` | Use finite `appearance.age`; otherwise defaults `[10,24,38,68][era]`. Clamp result to `1..110`. Fractions are retained, not rounded. |
| `child` | `era === 0`. |
| `elder` | `era === 3`. |
| `aging` | `clamp((age-50)/40,0,1)`: zero at/below 50, reaches one at 90, then stays one. |
| `growth` | Stage-specific bounded age adjustment, in the table below. |
| `height` | Stage baseline `[2.43,3.4,3.47,3.27][era] * (1+growth)`. |
| `unit` | `height/3.5`; converts design coordinates to world units. |
| `root` | New parent group for the entire figure. |

The growth formulas are deliberately small and stylized:

| Resolved stage | `growth` formula | Baseline |
| --- | --- | ---: |
| Child | `clamp((age-10)*.045, -.22, .18)` | 2.43 |
| Young adult | `clamp((age-24)*.004, -.025, .025)` | 3.4 |
| Adult | `clamp((age-38)*-.001, -.025, .02)` | 3.47 |
| Elder | `clamp((age-68)*-.003, -.09, .04)` | 3.27 |

`height` is a scale reference, not a measured bounding-box height. Anatomy uses approximate design coordinates up to about `3.5`; hair and accessories can change the final bounds.

Stage and age are independent. An age of 70 with stage `adult` keeps the adult jacket while receiving age-based posture and creases. Setting `outfit` to “raincoat” does not create a raincoat; edit the relevant costume branch. Hair does not automatically turn grey with age: use `appearance.hair` for the desired color. Skin does not automatically change color either.

## Material variables and surface choices

### Helper `matte(color, roughness = .85, metalness = 0)`

Returns a `MeshStandardMaterial`. Most surfaces intentionally use high roughness to read as a small sculptural figure.

| Local | Source / parameters | Where it appears |
| --- | --- | --- |
| `skin` | `appearance.skin` | Head, ears, neck, nose, hands. |
| `wrinkle` | Clone of `skin`, color multiplied by `.72` | Facial creases at age 55+. |
| `hair` | `appearance.hair` | Scalp, hair locks, brows. |
| `top` | `appearance.top` | Torso, sleeves, costume surfaces. |
| `bottom` | `appearance.bottom` | Legs. |
| `footwear` | Elder `#253746`, otherwise `#393b37` | Shoes; elder branch adds taller boots. |
| `sole` | `#d6cec1` | Contrasting shoe soles. |
| `shirt` | `#ded8c6` | Child stripes, socks and accents; pale tee/shirt details. |
| `dark` | `#35343a` | Eyes, mouth, hoodie inset, headphone/bag/watch details. |
| `seam` | `accent`, roughness `.5`, metalness `.25` for elder or `0` otherwise | Straps, bag, lapels, watch face. |
| `detail` | Standard material, color and emissive `accent`, intensity `.65` for elder or `.08` otherwise, roughness `.55` | Future cuffs, seams, brooch. |

`detail` is emissive but is not an actual scene light; it brightens its own material appearance. The world's tone mapping affects final color. These materials are shared among this person's parts. Each person call allocates its own set, so changing one figure's material later does not automatically change another figure.

## All construction helpers and scaling rules

### `mesh(geometry, material, x, y, z, parent = root)`

Creates local `node = new Mesh(geometry,material)`, sets its position to `(x*unit,y*unit,z*unit)`, enables casting and receiving shadows, adds it to `parent`, and returns it. It assumes the supplied geometry's dimensions already include the appropriate unit scaling. It does not multiply geometry dimensions a second time.

The optional parent permits face parts to live in a movable `head` group. Those positions are **local** to the head; the group translation is separate. Do not use unscaled geometry with this helper unless you intentionally want world-sized dimensions.

### `box(w, h, d, material, x, y, z, parent = root)`

Constructs `BoxGeometry(w*unit,h*unit,d*unit)` and delegates positioning to `mesh`. `w/h/d` are full extents in design units. Returns the mesh so a collar, brow, or strap can rotate.

### `ellipsoid(w, h, d, material, x, y, z, parent = root)`

Creates a sphere of radius `unit`, with `14` width and `10` height segments, through `mesh`. Local `node.scale.set(w,h,d)` stretches it. Here `w/h/d` are **radii/semiaxes**, unlike full extents in `box`: an ellipsoid with `w=.4` has total width `.8*unit`. This distinction matters when replacing a head or hand shape.

### `limb(radius, length, material, x, y, z)`

Creates a tapered cylinder with top radius `radius*unit*.9`, bottom radius `radius*unit`, length `length*unit`, and `10` radial segments. The Y axis runs through its center. It attaches directly to `root`; there is no parent parameter. Returns the mesh for small limb rotations. The current arms/legs are single segments, not articulated upper/lower limbs.

Every shape built through `mesh` casts shadows, including emissive details. The factory returns individually inspectable meshes without merging or instancing them. During scene construction, `scene/build.ts` calls `mergeStaticMeshes` to combine compatible opaque rigid parts while preserving the outer person root and separate transparent parts. Inspect the factory return before that call when studying individual body/clothing meshes; inspect the builder's result when assessing rendered draw calls. No instancing system is used.

## Body proportions

| Local | Formula / value | Purpose |
| --- | --- | --- |
| `legLength` | Child `1 + clamp((age-10)*.015,-.09,.1)`; otherwise `1.23` | Children gain slightly longer legs with age. |
| `hipY` | `legLength + .15` | Lower torso anchor. |
| `shoulderY` | `(child ? 2.42 : 2.48) - aging*.05` | Slight shoulder drop as age increases. |
| `headY` | `(child ? 2.99 : 3.04) - aging*.035` | Slight age-dependent head lowering. |
| `headRadius` | Child `clamp(.46-(age-10)*.006,.4,.51)`; otherwise `.37` | Larger relative child head. |
| `torsoHeight` | `shoulderY-hipY` | Connects hips to shoulder line. |

These are design-space values and acquire `unit` in geometry/position helpers.

### Feet and legs

The first `for (const side of [-1,1])` mirrors left/right parts:

* Shoe box `(.34,.18,.56)` centered `(side*.24,.12,.1)`.
* Sole box `(.36,.06,.58)` centered `(side*.24,.03,.1)`, whose bottom lies exactly at design Y `0`.
* Local `leg = limb(child ? .17 : .18,legLength,bottom,side*.23,.2+legLength/2,0)`. Rotated Z `side*.025` for a slight open stance.
* Children receive a pale `(.35,.14,.36)` sock/cuff box at `(side*.23,.34,0)`.

Shoes/legs are not parented to a hip joint and do not move independently during timeline travel. The world's slight person yaw rotates the entire root.

### Torso and neck

The torso is a ten-sided tapered cylinder, top radius `.44*unit`, bottom `.35*unit`, height `torsoHeight*unit`, center `(0,hipY+torsoHeight/2,0)`. An ellipsoid `(.45,.19,.28)` near `shoulderY-.06` rounds the shoulders. A skin limb radius `.14`, length `.23`, center Y `shoulderY+.12` creates the neck; its Z offset is `.04` for elder, zero otherwise.

### Arms and hands

The next mirrored `side` loop adds local `arm`: radius `.145`, length `.79` child or `.95` otherwise, X `side*.55`, Y `shoulderY-(child ? .33 : .42)`, Z `.015`; rotated Z `side*.09`. Each hand is a skin ellipsoid `(.135,.18,.13)` at X `side*.59`, Y `shoulderY-(child ? .79 : .96)`, Z `.025`.

Elders receive luminous `(.27,.08,.29)` cuff boxes near the wrist at `(side*.57,shoulderY-.82,.02)`. There are no fingers, elbows, hand poses, or interaction animations.

## Head group, face, and age markings

Local `head` is a group under `root` positioned `(0,headY*unit,aging*.16*unit)` and rotated X `aging*.1`. Increasing age after 50 shifts the head slightly forward and tips it. Facial details and hair belong to this group, so they follow the same pose.

The head skin ellipsoid has semiaxes `(headRadius,headRadius*(child ? 1.02 : 1.1),headRadius*.86)`. The face points toward `+Z`.

Another mirrored `side` loop adds:

| Part | Construction in head-local design coordinates |
| --- | --- |
| Ear | Skin ellipsoid `(.065,.1,.065)` at `(side*headRadius*.96,-.025,0)`. |
| Eye | Dark ellipsoid `(.025,.027,.014)` at `(side*headRadius*.39,.025,headRadius*.81)`. |
| Local `brow` | Hair box `(.105,elder ? .024 : .018,.025)` at the same eye X, Y `.105`, Z `headRadius*.81`; Z rotation `side*(elder ? -.04 : .04)`. |
| Local `crease` | Only when `age >= 55`: wrinkle box `(.075,.012,.014)` at `(side*headRadius*.62,-.035,headRadius*.75)`, Z rotation `side*.25`. |

The nose is a small skin ellipsoid `(.06,.07,.06)` at `(0,-.045,headRadius*.86)`. A dark mouth box `(.11,.017,.018)` at `(0,-.17,headRadius*.8)` completes the face. The age lines are two small crease strokes; this is a readability cue, not a detailed skin-aging shader.

## Hair cap and hairstyle branches

Local `hairCap` is a partial sphere with radius `headRadius*unit*1.035`, width segments `14`, height segments `8`, full longitude `2*PI`, and polar extent `PI*.39` for elder or `PI*.52` otherwise. It sits at `(0,.04,-.025)` inside `head`, with scale `(1, child ? 1.08 : 1, .9)`.

The shorter elder polar extent opens the cap around the sides/forehead. Elder side hair uses two ellipsoids `(.085,.22,.2)` at X `±.32`, Y `.015`, Z `-.035`, plus one `(.25,.08,.18)` ellipsoid at `(-.07,.34,-.02)`.

For other stages, loop `n = 0..2` creates local `lock` ellipsoids: child semiaxes `(.15,.12,.13)`, otherwise `(.12,.08,.13)`. Positions are `(-.2+.17*n,.22+.035*n,.21)`, and each lock rotates Z `-.2`. The named stage changes the geometry; `appearance.hair` controls all of its color.

## Four complete costume branches

### Child: jumper, backpack, and sneakers

The `if (child)` branch adds:

* Backpack `(.72,.78,.27)` in `seam` at `(0,1.95,-.36)`.
* Front pocket `(.48,.31,.06)` in `top` at `(0,1.77,-.52)`; negative Z is the back of this +Z-facing figure.
* Two mirrored `side` straps `(.09,.88,.065)` in `seam` at `(side*.28,2,.37)` on the visible torso front.
* Two pale sneaker detail boxes at `(side*.24,.22,.25)`.
* Loop `n = 0..2`: local `stripe` is a pale torus with radius `(.38+.016*n)*unit`, tube `.026*unit`, radial segments `6`, tubular segments `20`, at Y `1.55+.23*n`, rotated X `PI/2`. These rings read as horizontal jumper stripes around the torso.
* Pale chest patch `(.31,.13,.045)` at `(0,1.73,.43)`.

The backpack and stripes remain fixed relative to root; they are not cloth simulation. A reader changing the torso silhouette should inspect the rings and front strap Z values for intersections.

### Young adult (`era === 1`): hoodie, tee, bag, headphones

Two ellipsoids create the hood behind the neck: top-colored `(.36,.33,.3)` at `(0,2.57,-.22)` and dark inset `(.25,.23,.23)` at `(0,2.65,-.12)`. A pale tee box `(.27,.81,.06)` at `(0,2,.42)` sits in the front opening.

A mirrored `side` loop adds pale drawstrings `(.021,.32,.025)` at X `±.16`, Y `2.29`, Z `.45`; another adds two top-colored small front panels `(.19,.19,.05)` at X `±.24`, Y `2.19`, Z `.4`.

Local `strap` is dark `(.075,1.13,.065)` at `(.02,2.04,.47)`, rotated Z `-.5`; the accent-color cross-body bag `(.45,.39,.2)` is at `(.33,1.56,.45)`. Local `headphoneBand` is a half torus with radius `.23*unit`, tube `.036*unit`, segment counts `6/14`, arc `PI`, at `(0,shoulderY+.12,.15)`, rotated X `PI/2`. Two dark ellipsoid earcups at X `±.23` complete headphones resting around the neck.

Changing the numeric age while retaining `young-adult` adjusts scale within its small bounds; it does not replace the hoodie with the next costume.

### Adult (`era === 2`): jacket, shirt, lapels, watch

A pale shirt `(.3,.91,.07)` at `(0,1.98,.43)` sits beneath the jacket. A mirrored `side` loop adds local `lapel`, `(.13,.48,.07)` in `seam` at `(side*.17,2.28,.46)`, Z rotation `side*.28`, and pale pocket welts `(.2,.045,.05)` at `(side*.25,1.73,.32)`.

Loop `n = 0..2` adds three small dark ellipsoid buttons at `(.07,1.65+.18*n,.48)`. A dark `(.28,.11,.29)` wristband at `(-.58,1.64,.02)` and a seam-colored `(.14,.095,.025)` face at `(-.58,1.64,.18)` create the watch.

The jacket's main form is the shared `top` torso and arms; this branch adds the details that make those forms read as structured clothing.

### Elder/final branch: technical coat, collar, boots, brooch

A ten-sided coat-skirt cylinder with top radius `.36*unit`, bottom `.54*unit`, height `.8*unit` sits at `(0,1.2,0)` and extends the existing torso into a longer coat.

Loop `n = 0..4` places five luminous seam boxes `(.05,.32,.045)` at X `.13`, Y `.96+.3*n`, and Z from `[.5,.45,.42,.44,.46][n]`. Those per-segment depths follow the different widths of the coat silhouette rather than forming one flat stripe.

A mirrored `side` loop creates local `collar`, `(.23,.3,.31)` at `(side*.23,2.53,.07)`, rotated Z `side*.16`; luminous pocket lines at `(side*.28,1.61,.34)`; and taller footwear boxes `(.35,.38,.4)` at `(side*.23,.32,.035)`.

Local `brooch` is an octahedron radius `.085*unit`, detail material, at `(-.24,2.21,.35)`, rotated Z `PI/4`. Its bright material and luminous coat lines evoke the imagined future. The stage selects this futuristic costume; a high age by itself does not.

## Symbol checklist

| Scope | Variables / functions covered in this chapter |
| --- | --- |
| API | `PersonAppearance`, `createPerson`, parameters `appearance/eraIndex/accent` |
| Resolution / scale | `stages`, `stageIndex`, `era`, `age`, `child`, `elder`, `aging`, `growth`, `height`, `unit`, `root` |
| Materials | `matte`, `skin`, `wrinkle`, `hair`, `top`, `bottom`, `footwear`, `sole`, `shirt`, `dark`, `seam`, `detail` |
| Helpers | `mesh`, `box`, `ellipsoid`, `limb`; local `node` in mesh/ellipsoid |
| Anatomy | `legLength`, `hipY`, `shoulderY`, `headY`, `headRadius`, `torsoHeight`, `leg`, `arm`, `head`, `brow`, `crease` |
| Hair | `hairCap`, `lock`, mirrored `side`, lock loop `n` |
| Costume | `stripe`, `strap`, `headphoneBand`, `lapel`, `collar`, `brooch`; branch-local `side/n` loops |

All `side` loops mirror with `-1` and `+1`. All `n` loops create a finite number of repeated details. These bindings are local construction variables, not values updated by the animation frame.

## How to edit and reproduce the figure

For colors/age/story, edit `eras[index].person` in `archive.ts`, then reload. For actual clothing, edit the branch above and update `outfit` so its description agrees. The HTML portrait is independently constructed in [portrait.md](portrait.md); a new 3D accessory will not automatically appear in it.

For proportions, start with stage baselines, `growth`, `legLength`, and `headRadius`. Then inspect the relationship among `hipY`, `shoulderY`, and `headY`. Costume details contain their own design coordinates, so a radically taller torso requires moving lapels, straps, pockets, and hood elements as well. The geometry is a handcrafted parameterized assembly, not a constraint solver.

To learn the construction in isolation, create a scene with a group at the origin, add the sole/shoe boxes and two leg cylinders, add the torso/arms, then a separate head group. Confirm that local head parts follow one head rotation before adding hair. Finally add one costume branch. This sequence mirrors the actual ownership hierarchy and makes coordinate mistakes easier to locate.

For smooth aging, a new animation system would need to retain references to body parts or share compatible geometry, then interpolate proportions/materials as time changes. This function currently returns only a group; it has no update method. The world does a small full-person yaw and hover scale, not anatomy updates.

All scene-attached geometry/materials are disposed by [`World.dispose`](world.md). This function has no private RAF, event listener, texture, or explicit cleanup method. When using it outside that world, traverse and dispose its owned resources once, deduplicating materials shared by many parts. Materials allocated for unused branches, such as a crease material on a young figure, are not found by a scene-only traversal.

The portrait and in-world age label use raw archive data, while this factory sanitizes age/stage. Keep data valid even though fallback behavior exists, and keep age/year relationships consistent in archive configuration. A clamped mesh age should be a defensive fallback, not a content-editing workflow.
