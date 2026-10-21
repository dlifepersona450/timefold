# `art.ts`: deterministic Canvas 2D illustrations

[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

Source: [`src/art.ts`](../../src/art.ts). Related: [world textures](world.md), [content editing](../CONTENT.md), [timeline palettes](../TIMELINE.md).

The archive's default landscapes and food still lifes are drawn with browser Canvas 2D commands. The file does not download photos, call an image-generation service, load image files, or import somebody else's illustration. The same generated canvas can become a Three.js texture or an HTML image data URL. The artwork is illustrative sample content; replacing its title does not make it a photograph of that subject.

## Public functions and inputs

### `landscape(index = 0, food = false, variant = 0): HTMLCanvasElement`

| Parameter | Type | Behavior |
| --- | --- | --- |
| `index` | Inferred `number` | Selects one of four color palettes by `index % palettes.length`; also directly changes a mountain peak and selects food composition branches. Normally `0..3`. |
| `food` | Inferred `boolean` | `false` draws landscape, `true` draws tabletop still life. |
| `variant` | Inferred `number` | Moves the landscape sun/one peak and changes grain seed. In food mode, changes grain but not the main composition. |

Returns a fresh `900 × 680` canvas every call. The returned canvas is not inserted into the DOM, and the function does not return a Promise. Construction and grain drawing run synchronously on the main thread.

### `imageData(index, food = false, variant = 0)`

Requires `index: number` and otherwise takes the same defaults. Calls `landscape(index,food,variant).toDataURL("image/webp")` and returns its data URL string. Browser support determines the actual encoded format; an unsupported requested format can fall back to PNG. No object URL is created, so there is no `URL.revokeObjectURL` obligation. The generated canvas/string becomes garbage-collectable when no references remain.

Do not confuse this function name with the browser `ImageData` pixel-buffer type. This project function returns an encoded string suitable for `<img src>`, not an `ImageData` object.

## Callers and explicit linkages

[`scene/build.ts`](../../src/scene/build.ts) calls `landscape(eraIndex)` once for each era, wraps the result in `CanvasTexture`, and marks that texture sRGB. Three floating frame images per era reuse those era textures using `(eraIndex + photoIndex) % textures.length`. The shallow cone in front of each frame is 3D geometry built in the world; it is not part of this canvas.

[`ui/detail.ts`](../../src/ui/detail.ts)'s `createDetailView` computes:

```ts
const photoImages = eraContent.map((memory, eraIndex) =>
  memory.photos.items.map((photo) => photo.src ?? imageData(eraIndex, false, photo.art)),
);
const foodImages = eraContent.map(
  (memory, eraIndex) => memory.food.src ?? imageData(eraIndex, true),
);
```

`photo.art` is the landscape variant; `eraIndex` is the era palette. A defined `src` bypasses fallback drawing for that HTML image. Because the operator is `??`, an empty string is considered a supplied value; omit the field or use an appropriate nullish value rather than an empty string when you want fallback art.

Those arrays are calculated once when the detail-view factory is created during application startup. They do not regenerate just because timeline progress changes. Each gallery selects the already prepared era image. Setting an HTML content `src` does not replace the generated 3D frame textures, because the world uses a separate call path.

## Canvas setup and palette variables

Local `canvas` is created using `document.createElement("canvas")`, sized to `900 × 680`. Local `c = canvas.getContext("2d")!` is the drawing context. The non-null assertion is a TypeScript assumption, not a runtime fallback; the code expects a browser with Canvas 2D support.

Local `palettes` contains four independent `[sky,mid,dark]` triplets:

| Index | `sky` | `mid` | `dark` | Direction |
| ---: | --- | --- | --- | --- |
| 0 | `#dbc5ad` | `#a77c68` | `#65433f` | Warm paper/brown-red. |
| 1 | `#eddaa3` | `#b29050` | `#695248` | Amber/yellow. |
| 2 | `#e5e5e1` | `#a8b0b5` | `#596473` | Pale grey/white. |
| 3 | `#c7dff1` | `#789bc1` | `#344f79` | Cool blue. |

`const [sky,mid,dark] = palettes[index % palettes.length]` selects and destructures the triplet. These colors are not read from `eras[].theme`; changing the room theme does not automatically change these illustrations. Update this table when the generated art should match a redesigned era palette.

The remainder of this file uses a top-left origin, X increasing right, Y increasing downward, in canvas pixels. Every position below is a drawing-space value, independent of WebGL world units and browser viewport size. `fillRect`, `ellipse`, `arc`, polygon paths, and Bézier curves draw in order; later shapes overlay earlier ones.

## Landscape branch (`food === false`), drawing order

Before either branch, fill the entire canvas with `sky`. Then landscape construction proceeds:

1. **Sun.** Fill color `#ede1b4`; draw a circle radius `58` centered `(660-85*variant,170+22*variant)` using `arc(...,0,2*PI)`.
2. **Distant mountains.** Fill `mid`; path vertices `(0,380) → (200,210+20*index+25*variant) → (380,380) → (560,260) → (900,400) → (900,680) → (0,680)`. Filling closes the mountain polygon.
3. **Foreground ridge.** Fill `dark`; move to `(0,500)`, draw a cubic Bézier using control points `(260,350)` and `(540,560)` to `(900,440)`, then close down through the lower corners. The curve is a smooth hill boundary rather than a sequence of triangle peaks.
4. **River/path opening.** Fill `sky`; start `(460,680)`, curve with controls `(650,540),(480,470)` to `(570,420)`, then return with controls `(420,480),(570,550)` to `(300,680)`. This pale curved band cuts visually through the foreground.
5. **Tree trunk.** Fill `dark`; rectangle `(130,280,8,180)`.
6. **Four triangular branches.** Loop-local `i = 0..3` creates a filled triangle from `(134,220+35*i)` to `(85-8*i,330+25*i)` to `(185+8*i,330+25*i)`. Increasing width toward the bottom creates a stylized conifer.

`variant` changes only selected elements. It does not select an external photograph, move the entire landscape, or add a random new scene. Large or negative variants are not clamped and can move the sun outside the frame. `index` directly affects the peak even when its palette wraps after four entries.

## Food branch (`food === true`), shared base

All four food compositions first draw:

* Mid-color tabletop rectangle from Y `470` to the bottom (`900×210`).
* Pale plate ellipse `#e9e0c9`, center `(450,420)`, radii `(260,115)`.
* Dark ellipse center `(450,400)`, radii `(130,75)`, suggesting food shadow or a bowl interior.

All ellipse angles span `0..2*PI`; a rotation argument of `0` leaves them horizontal. The following branches add era-specific foreground shapes.

### Exact `index === 0`: toast and glass

Draw a `#c59556` rectangle `(300,310,260,145)` and an inset `#e3c694` rectangle `(315,320,230,115)` to suggest toast/crust. Draw a pale `#f0e4cc` glass rectangle `(600,265,100,150)` with `#795347` outline width `10`. This is a blocky stylized still life, not a textured food asset.

### Exact `index === 1`: pastry and coffee

Use `#c88d45`; loop-local `i = 0..4` draws five overlapping ellipses centered `(360+43*i,390-8*i)`, radii `(32,70)`, rotation `-.6`. Their overlapping lobes suggest pastry. A pale `#eee4ca` ellipse at `(650,300)` with radii `(65,70)` suggests a cup; a `#564132` ellipse at `(650,270)`, radii `(51,23)`, gives it a coffee surface.

### Exact `index === 2`: colorful plate and iced drink

Loop-local `i = 0..7` draws eight radius-29 circles at `(360+(i%4)*53,350+floor(i/4)*54)`, alternating `#c56651`, `#d6ad53`, and `#688766` with `i%3`. A pale `#eaf1f0` glass outline, width `9`, rectangle `(620,230,94,160)`, surrounds a brown `#5e4231` liquid rectangle `(629,299,76,83)`.

### Final `else`: imagined future still life

Use `#a5ddf8`, line width `10`, to stroke an ellipse at `(650,360)`, radii `(85,25)`, suggesting a projection base. Draw a rounded pale `#d4e5ee` rectangle `(600,190,100,150)` with corner radius `25`. Then use `#65896f`; loop `i = 0..5` draws six leaf-like ellipses at `(355+26*i,385-8*i)`, radii `(33,14)`, rotation `-.5`.

The last branch is selected for any index other than exactly `0`, `1`, or `2`, even though palettes wrap. For example, index `4` uses palette 0 with the future food composition. This behavior matters if adding a fifth era. `roundRect` also requires a browser implementation of that Canvas 2D method; there is no polyfill in this file.

## Deterministic grain: `seed`, `random`, and the final loop

After either main composition, the function overlays subtle pixel grain. Local `seed = 175 + index + variant*91`. Local closure `random()` updates it:

```text
seed = (seed*16807) % 2147483647
return seed/2147483647
```

This is a multiplicative linear congruential sequence. The same valid integer inputs produce the same sequence and drawing commands, making fallback art stable across reloads. It is a decorative pseudo-random source, not cryptographic randomness. Pixel-perfect output can still vary slightly across browser canvas rasterizers and encoders.

The final loop's local `i = 0..31999` performs three draws from the sequence per speck:

1. Choose white `rgba(255,255,255,.045)` when `random() > .5`, otherwise black `rgba(0,0,0,.04)`.
2. Set X to `random()*900`.
3. Set Y to `random()*680`.
4. Draw a `1×1` rectangle at those floating-point coordinates.

No array stores the grain, no animation changes it, and no filtering/blur pass is applied. Because it draws after the complete scene, the grain covers sky, objects, and tabletop alike.

## Complete local-symbol map

| Scope | Variables / functions |
| --- | --- |
| Public API | `landscape`, parameters `index/food/variant`; `imageData`, same parameters |
| Canvas/palette | `canvas`, `c`, `palettes`, destructured `sky/mid/dark` |
| Food composition | Separate block-scoped `i` counters for pastry, food circles, future leaves |
| Landscape composition | Block-scoped `i` for four tree triangles |
| Grain | `seed`, closure `random`, final loop `i` |

All other values in the source are direct drawing literals. The illustration has no interfaces, classes, module-level mutable state, timer, event listener, imported dependency, or hidden image cache.

## Editing, performance, and input limits

To recolor an era, edit its triplet and inspect any deliberately fixed colors in the sun, plate, food, and cup. To change a composition, preserve draw order: background first, then far shapes, then near shapes, then grain. To add variants, extend the explicit parameterized positions or introduce a controlled variant branch rather than expecting titles/captions to drive the image.

If replacing fallback art with real owned/licensed images, set `src` in content and keep its caption/alt text accurate. See [CONTENT.md](../CONTENT.md) for the content schema and the documentation's references/rights guidance for asset provenance. A remote image can make a canvas non-exportable if later drawn without suitable cross-origin access; this module currently avoids that issue because it only draws its own shapes.

Valid current calls use nonnegative integer era indexes and small integer variants. Negative/noninteger indexes can produce an undefined `palettes[...]` value and fail destructuring; `NaN`/infinite indexes are also invalid. The grain generator does not normalize negative or fractional seeds. Validate new external inputs before calling, rather than assuming TypeScript number annotations sanitize runtime data.

Each call performs at least 32,000 grain rectangles plus the main shapes, and `imageData` additionally encodes an image string. Avoid calling it on every animation frame. The current app prepares gallery strings once and the world prepares its own texture canvases once; they are separate allocations rather than a shared global cache. If many eras/photos make startup slow, cache by `(index,food,variant)`, pre-render assets, or generate asynchronously in a worker, accounting for the separate Canvas/WebGL ownership.
