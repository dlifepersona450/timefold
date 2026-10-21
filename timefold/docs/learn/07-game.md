[Docs home](../README.md) · [Learning path](README.md) · Previous: [person](06-person.md) · Next: [content](08-content-and-assets.md)

# 7. Put a game inside an archive object

The console opens an independent Canvas 2D game. It is not a second Three.js scene and does not need a physics engine. The exercise teaches how simple state, rules, projection, and cleanup fit behind an object panel.

## Keep board coordinates separate from pixels

The board is a 6×6 grid with integer `(x, y)` coordinates. An isometric projection turns a cell into screen position:

```text
screenX = 360 + (x - y) × 41
screenY = 74  + (x + y) × 23
```

Movement and collision use grid coordinates, not rendered pixel distances. A diamond tile and raised obstacle only affect drawing. The camera-like projection does not change the four allowed move directions.

## Define the smallest state

The source stores `player`, `collected`, `won`, fixed `walls`, and mutable `fragments`. Walls/fragments are sets of string keys such as `"3,2"`, making membership/deletion simple. The exit is at `(5, 0)`.

`draw()` clears the canvas and reconstructs the visible board from state. This immediate-mode design is small enough that a full redraw after an accepted move is straightforward. There is no RAF game loop; the app's 3D world has its own lifecycle scheduler, which runs continuously only for visible ambient motion or pending scene transitions.

## One movement function owns the rules

`move(dx, dy)`:

1. Rejects input after a win.
2. Computes the proposed grid cell.
3. Rejects out-of-bounds and wall positions.
4. Stores the new player position.
5. Removes a fragment from its set and increments the count if present.
6. Checks whether all three fragments have been collected at the exit.
7. Updates the status message and redraws.

Both keyboard and on-screen buttons call this function. Avoid copying collision logic into multiple handlers; the routes would drift apart.

## Theme the instance, not global rules

`mountGame(container, { theme, year })` receives the chosen era palette and year. Its board/background/glows/labels use those values. The surrounding title/story comes from `eraContent[n].game`.

The same map and objective run in every era. Editing game narrative does not produce new rules or levels. Add an explicit map configuration/variant if different mechanics should belong to different years.

## Manage ownership when a dialog changes

Mount creates canvas/status/buttons, binds key and button handlers, draws, and returns cleanup that removes the window key listener. `ui/panel-controls.ts` returns that cleanup to `ui/detail.ts`, which stores it and invokes it before replacing panel HTML or closing the detail. Without that cleanup, an invisible old instance could still react to arrow keys.

Restart resets player, count, win flag, and fragment set. It does not reload the whole webpage. Switching era or closing/reopening creates a fresh game instance, so no progress persists.

## Verify the rules

The [game reference](../reference/game.md) includes every local variable/function, fixed walls and fragment coordinates, controls, draw order, and a verified winning route. Test bounds/walls, collecting each item once, exit before all items, exit after all items, restart, and closing while a key handler exists.

A linked game build under `resources.game` is separate from this featured demo. It can open an external/local game destination without replacing the mini-game mechanics. Continue to [content and assets](08-content-and-assets.md).
