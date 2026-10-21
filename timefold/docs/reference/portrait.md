# `portrait.ts`: the person's inline SVG illustration

[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

Source: [`src/portrait.ts`](../../src/portrait.ts). Related: [3D person construction](person.md), [world selection and focus](world.md), [timeline/person configuration](../TIMELINE.md).

This small module returns the editorial SVG portrait displayed in the traveller's HTML detail panel. It is independently drawn vector artwork using the same person data as the 3D figure. It does not render or photograph the Three.js mesh, import an SVG file, or turn the configured `outfit` sentence into geometry.

## Import and public function

The only import is `type { PersonState } from "./archive"`. It is a compile-time type dependency; no archive values are imported at runtime.

### `personPortrait(person: PersonState): string`

Takes one archive person configuration and returns a complete inline `<svg>...</svg>` markup string. It does not add anything to the DOM, attach listeners, return an SVG DOM element, or modify `person`. [`ui/panels.ts`](../../src/ui/panels.ts)'s `renderPerson` invokes it when the selected category is `person`, wraps it in `.person-study`, and adds surrounding age/costume/story HTML. The detail view inserts that returned panel markup.

| `person` field | Where the SVG uses it |
| --- | --- |
| `stage` | Selects child/young/elder styling, appears in `aria-label`, and uppercased bottom label. |
| `age` | Raw age in `aria-label`; `String(age).padStart(2,"0")` in bottom label. |
| `outfit` | Descriptive text in `aria-label`. |
| `top` | Base upper-body fill and elder coat fill. |
| `bottom` | Leg/trouser fill. |
| `skin` | Head, neck, hands. |
| `hair` | Hair-cap path fill. |
| `description` | Not used by this function; main renders it beside the portrait. |

Unlike the 3D factory, this function does not sanitize age, infer stage from an era index, or compute growth from age. Age is a printed value. The silhouette and facial creases change only when `stage` changes.

## Every local variable

| Local | Exact value / responsibility |
| --- | --- |
| `child` | `person.stage === "child"`. |
| `young` | `person.stage === "young-adult"`. |
| `elder` | `person.stage === "elder"`. |
| `scale` | Child `.76`, elder `.88`, otherwise `.9`; scales the complete body group. |
| `head` | Child `27`, otherwise `23`; head ellipse X radius and hair path measurements. |
| `clothes` | One of four SVG fragment strings containing costume overlays; inserted after base skin/clothing. |

The nested conditional choosing `clothes` checks child, then young, then elder, then uses the adult fragment. A runtime unknown stage gets the adult fragment and `.9` scale. `PersonState` prevents that in normal typed configuration, but a TypeScript annotation does not validate remotely loaded JSON.

There are no local helper functions, loops, collections, timers, or mutable module-level variables. Most of the implementation is one returned SVG template string.

## SVG coordinate system and drawing stack

The SVG has class `person-portrait`, `viewBox="0 0 400 390"`, `role="img"`, and a generated `aria-label` describing stage, age, and outfit. The viewBox defines drawing coordinates; CSS in [`style.css`](../../src/style.css) determines its displayed size. It can scale without a bitmap resolution limit.

SVG draws in document order, so the following stack also describes which elements can cover earlier shapes:

1. Gradient definition.
2. Architectural frame and steps.
3. Ground shadow.
4. Transformed full-body group: legs, shoes, torso/arms, exposed skin, stage costume overlay, head, hair, facial features, elder extras.
5. Two editorial text labels in the outer viewBox coordinates.

### Gradient and background architecture

`<defs>` contains `linearGradient id="portrait-light"` with `x2="0" y2="1"`. Its first stop uses `var(--accent)` with opacity `.13`, and its final stop at offset `1` fades the same color to opacity `0`. This is a vertical light wash using the default object-bounding-box gradient coordinates.

The path `M115 329V42H285V329` draws an open doorway-like outline: move to `(115,329)`, rise to Y `42`, cross to X `285`, descend to Y `329`. Its fill uses `url(#portrait-light)`, stroke is `var(--accent)`, stroke opacity `.25`. Filled SVG subpaths are implicitly closed, while the stroke retains the open bottom edge.

Three horizontal path segments create steps: `(102,329)→(298,329)`, `(85,346)→(315,346)`, `(65,365)→(335,365)`, accent stroke opacity `.14`. A dark translucent ground ellipse is centered `(200,330)`, radii `(68,10)`, fill `#080f172e`.

The gradient ID is fixed, not unique per call. The current detail view normally displays one portrait. Rendering many portraits in one document requires unique IDs and matching `url(#...)` references to avoid document-level SVG ID collisions.

### Body group transform

The main group has:

```text
translate(200 330) scale(scale) translate(0 -270)
```

For elders, append `rotate(-3 0 100)` within this transform list. With SVG matrix composition, the local body coordinates are effectively processed by the rightmost transform first. This places the feet near the ground anchor while shrinking a child's entire silhouette. The elder rotation tips the drawing three degrees about local `(0,100)` before the enclosing placement/scale.

These values have no direct unit conversion to the 3D person's `unit = height/3.5`. They are separately chosen 2D composition values.

## Base body and face, shape by shape

| Element | Construction / why it exists |
| --- | --- |
| Legs | A single filled path begins at `(-28,90)`, extends to left foot near Y `257`, returns through the crotch point `(0,142)`, and mirrors into the right leg. Fill is `person.bottom`. |
| Shoes | Dark `#24343b` path with rectangular inner edges and quadratic curves at the outer toes. Left and right occupy local Y `251..266`. |
| Torso/arms | One symmetric path in `person.top` runs from shoulders near `(±31,1)` through elbows/outer wrists near `(±55,96)`, then back through the torso waist at Y `108`. Quadratic sections soften shoulders. |
| Hands | Skin ellipses at `(-48,104)` and `(48,104)`, radii `(7,11)`. |
| Neck | Skin path from `(-11,-25)` through `(±11,8)`, with a quadratic curve at the collar. |
| Costume | The selected `clothes` fragment is inserted here, so it can overlay the base top and neck. |
| Head | Skin ellipse centered `(0,-43)`, radius X `head`, radius Y `head*1.2`. |
| Hair | Filled path uses `head` to outline a swept cap from left head edge through upper curves near Y `-77..-80` to the right edge, then a jagged lower hairline. Fill is `person.hair`. |
| Eyes | Two `#4b342f` circles at `(±9,-43)`, radius `1.8`. |
| Mouth | Unfilled quadratic path from `(-5,-28)` through control `(0,-24)` to `(5,-28)`, stroke `#704b40`, width `1.5`. |

The head is drawn after the costume overlay, naturally covering costume parts that extend behind it. There are no 2D ears, nose geometry, separate eyebrows, or projected 3D shadows in this illustration.

## Four `clothes` fragments

### Child

Three pale stripes use `stroke="#f4d4b3"`, width `7`, opacity `.7`, horizontal at local Y `28`, `47`, `66`, with widths growing from `68` to `74`. A second group uses dark `#413b41`, width `7`, no fill, with two quadratic strap paths starting near X `±28`, Y `3`, curving toward Y `69`. These read as a striped jumper and backpack straps, corresponding broadly to the 3D child's costume.

There is no separately drawn rear backpack in this front-oriented SVG. The child-specific `head = 27` and smaller body scale create the age silhouette.

### Young adult

A dark green `#384e43` hood path begins `(-23,2)`, curves above the neck, and returns through a collar opening near Y `23`. Two pale `#d6cdb5` drawstring lines run from Y `16` to `46` at X `±7`. A translucent dark `#293f3838` pocket/trapezoid covers Y `68..90`.

These secondary colors are literal SVG values. Changing `person.top` recolors the base body but does not recolor the fixed hood/drawstrings. The SVG does not include every 3D accessory: it has no matching cross-body bag or headphone geometry.

### Adult/default fragment

A pale green-grey `#c3d1be` collar/lapel polygon runs from `(-22,-3)` through the central opening around `(0,24)` and back through `(0,34)`. A dark `#314d45`, width-2 path draws the center seam from Y `34` to `100` and two pocket strokes at Y `45`. These are editorial jacket cues; a numerical age change does not modify them.

### Elder

An extra coat path in `person.top` extends from shoulder area `(±36,12)` down to a wider hem at `(±43,142)`. A group with accent stroke width `2`, no fill, opacity `.9` draws two technical seam paths and a horizontal line at Y `116`. A pale `#e1e9e5` triangular collar sits at the neck. Two `#b5ced8` circles at Y `47` and `66`, radius `2`, read as buttons.

The elder body uses the additional `-3°` group rotation. Hair color still comes from the data; the stage does not automatically whiten it.

## Elder-only facial extras

After the eyes/mouth, the returned template appends a conditional SVG fragment only when `elder` is true:

* Fine `#795c51` strokes, width `1`, no fill: short cheek/corner creases and two forehead lines near Y `-55` and `-59`.
* Glasses group: no fill, pale `#c9dfeb`, width `1.5`; rounded rectangles at `(-19,-49)` and `(4,-49)`, each `15×12`, corner radius `4`, linked by a bridge from X `-4` to `4` at Y `-44`.

This differs intentionally from the 3D figure: the SVG has glasses, while `person.ts` currently adds age-threshold creases and does not build glasses. The 3D age threshold is `>=55`; this SVG's crease threshold is the `elder` stage. If exact visual parity matters, edit both modules together.

## Labels, CSS colors, and accessibility

The upper label at `(26,34)` reads `THE SAME PERSON`, in monospace `9px`, letter spacing `2`. The bottom label at `(26,367)` reads `AGE {padded age} / {UPPERCASED STAGE}`, also monospace `9px`. Both use `var(--accent)`.

`--accent` is inherited from the document's timeline theme. It controls SVG frame light, elder seams, and label ink. `person.top/bottom/skin/hair` remain the selected era's configured values. As a result, the portrait can contain fixed character colors under continuously changing UI accent colors. It has no light/shadow calculation from the WebGL scene.

The outer `role="img"` and `aria-label` provide one semantic image description. The drawing is not keyboard-focusable or a separate control. Main supplies dialog structure and focus management; this function does not.

## SVG path syntax used here

To reproduce or adjust this artwork, the source uses only a small set of commands:

| Command | Meaning | Example responsibility |
| --- | --- | --- |
| `M x y` | Move the pen without drawing. | Start a limb, hair, or label-frame outline. |
| `L x y` | Draw a straight segment. | Coat edge, trouser edge. |
| `H x` / `V y` | Horizontal / vertical segment. | Steps, seams, stripes. |
| `Q cx cy x y` | Quadratic Bézier: one control point, one endpoint. | Shoulders, hood, mouth, shoe toes. |
| `Z` | Close the current subpath. | Filled coat and collar polygons. |

Several numeric coordinates are compacted without spaces, such as `M-22-3`; SVG parses that as `M -22 -3`. Adding whitespace while learning can improve readability without changing the shape. Within one `d` string, a second `M` starts a separate subpath, as used for the two shoes or two drawstrings.

## Editing workflow and trust boundary

Change the person data for primary colors, printed age, stage, and accessible outfit description. Change this function's paths to add accessories, alter the clothing drawing, or match a new 3D costume. Keep the viewBox, body transform, and local-coordinate conventions in mind so new paths do not appear far from the figure.

For a new stage, add its test/fragment, choose its scale/head proportions, and audit the 3D person's `stages` array and costume branches. A new prose outfit string alone cannot create a new illustration.

The function currently interpolates configured strings directly into SVG attributes and its accessible label. Main inserts this return value as markup. Repository-owned static data is the present trust boundary; this output must not be treated as an escaping/sanitization function for untrusted content. If loading remote/user-entered data, validate color fields and escape text/attribute values (or build the SVG through DOM APIs with safe attribute setting) before insertion. Main's escaping of surrounding paragraph text does not sanitize this SVG string.

No graphics disposal is needed: the SVG has ordinary DOM lifecycle. Once the detail panel is replaced/removed and references are released, the browser can reclaim its nodes. There is no WebGL texture, RAF callback, listener, file handle, or external URL allocated by `personPortrait`.
