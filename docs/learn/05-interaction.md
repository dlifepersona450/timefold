[Docs home](../README.md) · [Learning path](README.md) · Previous: [time](04-time.md) · Next: [person](06-person.md)

# 5. Make geometry open a memory

The essential connection is a stable ID, not a DOM element stored inside a mesh. The world reports a selected category; the controller chooses content and opens a dialog.

## Register a root, not every child

After constructing an object group, the world sets its metadata and registers it:

```ts
root.userData.id = 'photos';
root.userData.room = eraIndex;
picks.push({ id: 'photos', room: eraIndex, root });
```

This shows the actual registration pattern; `picks` is assembled by `scene/build.ts` and shared through `SceneGraph`. `picksByRoom` indexes those records once for later interaction. A lens, camera body, and button can all be hit, but each climbs to the same root. Preserve this parent chain when adding meshes or loading a model.

## Convert pointer position into a ray

Use the canvas rectangle so client coordinates map to its actual position and size:

```ts
const bounds = canvas.getBoundingClientRect();
pointer.set(
  (event.clientX - bounds.left) / bounds.width * 2 - 1,
  -(event.clientY - bounds.top) / bounds.height * 2 + 1,
);
raycaster.setFromCamera(pointer, camera);
```

X maps left/right to -1/+1; Y is inverted because screen coordinates grow downward. The camera's aspect/projection must match the renderer's current size.

`scene/picking.ts` intersects only candidates in the requested nearest room whose archive display is visible. Interaction, focus, and panel content therefore agree on an era while the camera approaches it. A fresh query uses the first sorted hit, then follows its ancestors to a registered root. Hover first preserves its existing root if the ray still intersects it, avoiding flicker along shared edges. The [scene reference](../reference/scene.md) explains every local and branch.

Picking already uses the rectangle. If embedding the canvas in a smaller panel, also adapt `scene/lifecycle.ts`, which currently sizes renderer/camera to the viewport. Otherwise projection and canvas layout can still disagree.

## Separate hover from activation

Hover reports an ID plus screen coordinates for a tooltip. Pointer down remembers a position; pointer up rejects a movement over the drag threshold, then tries selection. That prevents a swipe from also activating a prop.

Hover scale can change a silhouette slightly; test clicks in the main body of an object, and inspect edges on actual devices. When writing browser checks, await animation frames after changing time before assuming camera and world matrices have reached the new view.

## Open an object through the controller

`openObject(id)` closes the index, snaps requested time to the selected chapter, flushes the queued timeline view, stores `activeObject`, requests world focus, renders the detail view, marks the document as inspecting, and calls `showModal()` if needed. The scene callback does not import HTML or call `querySelector` for the detail panel.

The archive index calls the same `openObject`, so keyboard and WebGL access share content behavior. Keep that alternative route when adding objects.

## Move the camera, not the webpage

Focus uses the root's world position as a target, then adds a fixed world-axis offset. The person adds a higher target so the camera sees a body rather than only feet. Closing focus returns to the current timeline overview.

This prototype presents content in a drawer while the scene approaches the prop. A complete “world expands out of a frame” effect would need additional geometry/shader/transition work; the current camera/drawer boundary is the foundation, not an unimplemented promise.

## Use native modal behavior carefully

`showModal()` gives a modal dialog and inert background. Escape and close/backdrop handlers call one close routine. Detail close invokes game cleanup, clears selection, releases scene focus, and restores a valid trigger.

Replacing `innerHTML` removes DOM nodes; it does not automatically remove window listeners created by an embedded game. `ui/detail.ts` therefore owns `clear`: it aborts the previous panel's local listeners and invokes the cleanup returned by `ui/panel-controls.ts` before replacing markup. The game supplies the explicit cleanup for its window key listener.

The outer application uses a separate `AbortController` for permanent shell/window listeners. Vite hot disposal aborts them, cancels queued DOM painting, disposes the current panel/audio/world, and closes remaining dialogs. Learn the owners in [the UI reference](../reference/ui.md) and [runtime cleanup](../architecture/runtime.md) before adding a listener with a longer lifetime than its DOM.

## Practice

Add a child mesh to a camera, verify hovering either part gives the same category, then test opening/closing via mouse, touch, and keyboard index. Compare [interface](../reference/interface.md), [runtime flow](../architecture/runtime.md), and [contracts](../architecture/contracts.md).
