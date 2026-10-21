[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

# Isometric memory game: `game.ts`

Source: [`src/game.ts`](../../src/game.ts). Related: [Interface integration](interface.md), [CSS](styles.md), [Content updates](../CONTENT.md), [`EraTheme` data](../../src/archive.ts).

The game is a small Canvas 2D puzzle embedded inside the game object's detail panel. It demonstrates a 2.5D view: a flat logical grid projects into diamond tiles, while wall tops and a character give the drawing apparent height. It has no Three.js scene, physics engine, server, timer, game framework, asset downloads, or independent animation loop. The surrounding room is WebGL; this mini-game uses a separate `CanvasRenderingContext2D`.

## Public contract and integration

```ts
export function mountGame(
  container: HTMLElement,
  options: { theme: EraTheme; year: string },
): () => void
```

| Parameter / return | Contract |
| --- | --- |
| `container` | An existing element whose `innerHTML` may be replaced. Must be present before mounting. The application creates `<div id="mini-game"></div>` for it. |
| `options.theme` | An [`EraTheme`](../../src/archive.ts) supplying all canvas colors. Values are authored CSS-compatible colors. |
| `options.year` | Era label drawn at the bottom of the canvas; source chapters supply a string such as `"1998"`. |
| Return | Cleanup function that removes this mount's `window` keydown listener. It does not remove the DOM, stop a timer, or clear state storage, because no timer/storage exists. |

[`ui/panel-controls.ts`](../../src/ui/panel-controls.ts)'s `mountPanelControls` mounts it with the selected chapter's exact `era.theme` and `era.year`. [`ui/detail.ts`](../../src/ui/detail.ts) stores its returned function as `cleanupPanel` and invokes it before a stage switch, re-render, or detail close. This prevents old game instances from consuming arrow keys after their canvas has gone away. The main timeline keydown handler returns while any modal is open, so the mounted game handles arrows without also moving the timeline.

The palette changes by era, while geometry, walls, fragments, and win rules are identical across all chapters. The project/game descriptions and linked progress resources live in [`archive.ts`](../../src/archive.ts); editing that prose does not replace the playable puzzle. Replacing the demo game requires editing this module or integrating another mount function with the same lifecycle contract.

## Every variable and local binding

All runtime state belongs to the closure created by a single `mountGame` call. Multiple mounts would have independent boards but competing global key listeners, so the current interface keeps one mounted game at a time.

| Binding | Initial value / type | Role and mutation |
| --- | --- | --- |
| `container`, `options` | Function parameters | Mount target and visual configuration. |
| `theme`, `year` | Destructured from `options` | Read-only references used by draw routines. No continuous timeline sampler is called inside the game. |
| `canvas` | `container.querySelector("canvas")!` | Canvas created by the game's template, fixed backing resolution 720 × 440. |
| `ctx` | `canvas.getContext("2d")!` | Drawing context. Non-null assertion assumes Canvas 2D is available; there is no local fallback for a null context. |
| `status` | `.game-status` element | Polite live region; changed after fragment collection, win and restart. |
| `player` | `[0, 5]`, inferred `number[]` | Logical grid coordinates, assigned to a new `[x,y]` after each valid move and reset on restart. Cast to a tuple only for spreading into `point`. |
| `collected` | `0` | Number of removed fragment keys. Increments once per fragment, resets on restart. |
| `won` | `false` | Stops further movement after all fragments and doorway condition are met. Restart resets it. |
| `walls` | `Set<string>` | Fixed blocked coordinates: `1,1`, `2,1`, `3,1`, `3,2`, `3,3`, `1,4`, `5,4`. It is never mutated after creation. |
| `fragments` | `Set<string>` | Starts with `0,0`, `5,1`, `4,5`. `move` deletes visited keys; restart assigns a fresh set. |
| `x`, `y` in drawing loops | Integers 0–5 | Iterate tiles row by row, with y outermost. Distinct from move's next-position locals. |
| `px`, `py` | Destructured from `point(x,y)` | Canvas-space center of a tile, wall, fragment, gate or character; each draw block has its own local pair. |
| `directions` | Record created per key event | Maps supported exact key strings to logical delta arrays. |
| `b` | Direction-button iterator | Captures one `[data-move]` button; callback parses its dataset into two numbers. |

The string key format `${x},${y}` is used consistently for both sets. A key such as `"1,4"` means grid column 1, row 4; it is unrelated to a pixel coordinate or timeline chapter.

## Every named function

### `point(x: number, y: number): number[]`

Pure projection from logical coordinates to canvas center coordinates:

```text
px = 360 + (x - y) × 41
py =  74 + (x + y) × 23
```

It returns `[px, py]` and changes no state. Increasing x moves right/down on screen; increasing y moves left/down. Therefore “up” in the controls means decreasing logical y and appears as an up/right diagonal in the isometric view.

Examples from the formula: `point(0,0) → [360,74]`, `point(0,5) → [155,189]`, `point(5,0) → [565,189]`, and `point(5,5) → [360,304]`. The origin and spacing constants are inline numeric values, not configurable exported variables. If you change canvas resolution or board size, review these offsets alongside the HUD and diamond geometry.

### `diamond(x: number, y: number, color: string, lift = 0): void`

Calls `point` to produce local `px`/`py`, then draws a filled/stroked four-point path. Vertices are `(px, py-20-lift)`, `(px+39, py-lift)`, `(px, py+20-lift)`, `(px-39, py-lift)`. `color` sets fill and `theme.shadow` sets stroke. `lift` visually moves the tile upward; it does not change logical collision coordinates. Default zero draws floor tiles; `55` draws a wall's raised cap.

It mutates the canvas context path, fill and stroke styles and draws immediately. No geometry object is returned. Tile center spacing (41 × 23 basis vectors) is slightly larger than diamond half-width/height (39 × 20), leaving visible separation between tiles.

### `draw(): void`

Repaints the complete canvas from current closure state:

1. Fill 720 × 440 with `theme.background`.
2. For every grid `(x,y)`, draw alternating `theme.floor` and `theme.wall` diamonds using `(x+y)%2`.
3. For blocked cells, draw a `theme.shadow` rectangle at `(px-30, py-60)` with size 60 × 60, then a raised `theme.plaster` diamond with lift 55. These rectangles are a simple wall illusion rather than full polygonal side faces.
4. At `(5,0)`, stroke a 34 × 54 doorway rectangle, line width 5. Color is `theme.metal` until `collected === 3`, then `theme.light`. Reset line width to 1 afterward.
5. For each remaining fragment, draw a radius-7 circle at `(px,py-19)`, fill/glow `theme.accent`, shadow blur 18, then reset shadow blur to zero.
6. After all tiles/objects, draw the player using `theme.paper`: a rounded 20 × 33 body (`roundRect`, radius 7) and radius-10 head.
7. Draw a text HUD in `13px monospace`, `theme.text`: fragment count at `(28,400)` and era label at `(490,400)`.

It returns nothing. Canvas drawing state is changed directly, without `save`/`restore`; explicitly reset lineWidth/shadowBlur after changing them if extending this code. The player is always drawn last, so this is not a complete depth-sorted renderer; a player may visually overlap a wall rather than being occluded correctly.

`draw` is called once on mount, after each valid movement (including walking over an already empty tile), and after restart. Invalid moves return before drawing. There is no `requestAnimationFrame`; a static board consumes no continuous game rendering work. CSS scales the canvas to the drawer width; backing resolution and device pixel ratio are not adjusted dynamically.

### `move(dx: number, dy: number): void`

This is the state transition function. If `won` is true it returns immediately. Otherwise local `x`/`y` are `player[0]+dx`, `player[1]+dy`. It rejects x/y outside inclusive range 0–5 or positions present in `walls`.

For a valid position:

1. Replace `player` with `[x,y]`.
2. Call `fragments.delete(`${x},${y}`)`. Because `Set.delete` reports whether the key existed, each fragment increments `collected` only once. Update the live-region message, including “The doorway is open.” on the third fragment.
3. If `x===5 && y===0 && collected===3`, set `won=true` and replace status with “A memory, put back together. You found your way home.”
4. Call `draw()`.

The doorway cell itself is not in `walls`. You can stand on/pass through it before collecting all fragments; it simply does not win yet. No collision sweep checks intermediate cells for larger deltas. All actual controls send one-cell cardinal deltas, so keep that restriction if adding inputs.

### `key(e: KeyboardEvent): void`

Creates local `directions` mapping these exact key values:

| Keys | Delta |
| --- | --- |
| `ArrowUp`, `w` | `[0,-1]` |
| `ArrowDown`, `s` | `[0,1]` |
| `ArrowLeft`, `a` | `[-1,0]` |
| `ArrowRight`, `d` | `[1,0]` |

When `directions[e.key]` exists, prevents native behavior and calls `move` with that pair. Other keys do nothing. Uppercase `W/A/S/D`, remapped keyboards, modifier combinations, input fields, and event-repeat throttling are not handled separately. Holding a key relies on native key repeat. It does not stop propagation. The listener is attached to `window`, not canvas, so the canvas does not need to receive focus.

## Anonymous callbacks and cleanup

| Callback | Action and state |
| --- | --- |
| `forEach(b)` over `[data-move]` | Assign an `onclick` function to each direction button. |
| Each direction button's `onclick` | Split `b.dataset.move` on comma, map each token through `Number`, cast to two-number tuple, call `move`. Dataset values are authored in the template; no general validation is performed. |
| `[data-restart]` `onclick` | Assign starting player, zero collected, false won, and fresh three-fragment set; restore initial status; redraw. Restart is allowed after winning. |
| Returned cleanup arrow | `window.removeEventListener("keydown", key)` using the same function identity. It is safe to remove an already removed listener. Does not alter canvas/HTML. |

After handlers are installed, the module attaches `window.addEventListener("keydown", key)` and calls `draw()` once. The detail view's `clear` method owns when the returned function is called, through the cleanup passed back by `mountPanelControls`. If reusing the game outside Timefold, keep the return value and invoke it before discarding/replacing its container.

```ts
import { mountGame } from "./game";
import { eras } from "./archive";

const target = document.querySelector<HTMLElement>("#my-game")!;
const cleanup = mountGame(target, {
  theme: eras[0].theme,
  year: eras[0].year,
});

// When your modal or route is removed:
cleanup();
target.replaceChildren();
```

This example uses the existing export and data shape. It is an integration pattern, not an additional runtime route in the repository.

## DOM contract

| Generated selector | Attributes / role | Consumer |
| --- | --- | --- |
| `.game-canvas` | `<canvas width="720" height="440">`, descriptive `aria-label` | `ctx` drawing target and responsive CSS. |
| `.game-status` | `<p aria-live="polite">` | Status changes after collection/win/restart. |
| `.game-controls` | Wrapper | Flex layout separating direction buttons and restart. |
| `.dpad` | Wrapper | Horizontal group of four labelled buttons. It is not a spatially arranged cross. |
| `[data-move="0,-1"]` | Button “Move up”, text ↑ | Logical y minus one. |
| `[data-move="-1,0"]` | Button “Move left”, text ← | Logical x minus one. |
| `[data-move="0,1"]` | Button “Move down”, text ↓ | Logical y plus one. |
| `[data-move="1,0"]` | Button “Move right”, text → | Logical x plus one. |
| `[data-restart]` | Button `.text-button`, “Restart ↺” | Reset callback. |

See [styles.md](styles.md) for hover/focus colors, sizing and mobile typography. Buttons provide pointer/touch and keyboard activation; native focus outlines remain available. The canvas has a label and the status announces progress, but it does not expose a semantic grid, wall locations or a full equivalent nonvisual puzzle. Treat that as a current accessibility limit, not a completed accessible game interface.

## Board, rules, and a reproducible winning route

Logical coordinates increase right across columns and down rows in this diagram; the actual canvas applies the isometric projection above.

```text
       x=0 1 2 3 4 5
y=0     F . . . . D
y=1     . # # # . F
y=2     . . . # . .
y=3     . . . # . .
y=4     . # . . . #
y=5     P . . . F .

P = initial player [0,5]
F = fragment
D = doorway [5,0]
# = wall
```

The following route has been checked against the actual coordinate sets. Starting from Restart:

| Step | Controls | End position / result |
| --- | --- | --- |
| 1 | Up five times | `(0,0)`, first fragment. |
| 2 | Right five times, Down once | `(5,1)`, second fragment. Passing `(5,0)` earlier does not win. |
| 3 | Down twice, Left once, Down twice | `(4,5)`, third fragment; avoids wall `(5,4)`. |
| 4 | Up five times, Right once | `(5,0)`, win. |

After winning, movement returns immediately until Restart. The board itself is not hidden or replaced with a victory screen. There is no scoring, saved progress, route optimization, inventory, animation or project-specific level selection.

## How to extend it while keeping the links understandable

To edit the board, update both fragment initialization locations (mount and restart), the `walls` set, and any count literals (`3`) used by status, HUD, gate and win rules. The current target count is repeated; a generalized game should derive it from a single immutable initial-fragment list. Changing only the initial fragment set creates mismatched restart/win behavior.

To change board dimensions, replace all hardcoded `6` loop bounds and `5` coordinate/bounds/gate positions together, then adjust `point`, canvas size, HUD positions and wall/fragment coordinates. Grid size is not currently an option. To make layouts era-specific, add a typed game-layout field to the content model and accept it in `mountGame` options; do not infer topology from prose or `year` strings.

To add movement animation, keep logical state transitions in `move` separate from interpolated drawing positions. Introduce a cancellable RAF and extend the returned cleanup to cancel it. To embed an external finished game instead, preserve a keyboard-accessible route and stop all timers/listeners/iframes when its detail panel changes. For linked hosted demos, adding a resource URL in [`archive.ts`](../../src/archive.ts) is already supported without modifying this module; consult [Content updates](../CONTENT.md).
