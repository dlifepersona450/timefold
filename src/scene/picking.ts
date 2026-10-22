import * as T from "three";
import type { ArchiveId } from "../archive";
import { SCENE_SETTINGS } from "./settings";
import type { PickTarget, SceneGraph } from "./types";

interface InteractionState {
  room(): number;
  focused(): boolean;
  pointer(x: number, y: number): void;
  hover(target: PickTarget | null): void;
  invalidate(): void;
}

/** Pointer listeners and reusable raycast storage; HTML callbacks retain viewport coordinates. */
export function createPicking(
  canvas: HTMLCanvasElement,
  camera: T.PerspectiveCamera,
  graph: SceneGraph,
  state: InteractionState,
  onSelect: (id: ArchiveId) => void,
  onHover: (id: ArchiveId | null, x: number, y: number) => void,
) {
  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const hits: T.Intersection[] = [];
  const rootsByRoom = graph.picksByRoom.map((targets) => targets.map((target) => target.root));
  const targetByRoot = new Map<T.Object3D, PickTarget>(graph.picks.map((target) => [target.root, target]));
  let hovered: PickTarget | null = null;
  let downX = 0;
  let downY = 0;

  function pick(event: PointerEvent, keepCurrent: boolean): PickTarget | null {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    camera.updateMatrixWorld();
    raycaster.setFromCamera(pointer, camera);
    const room = state.room();
    if (!graph.displays[room]?.visible) return null;
    // Keep the current surface while it still intersects. Hover enlargement can
    // otherwise alternate between adjacent pieces at a shared silhouette edge.
    hits.length = 0;
    if (keepCurrent && hovered?.room === room) {
      raycaster.intersectObject(hovered.root, true, hits);
      if (hits.length) return hovered;
    }
    hits.length = 0;
    raycaster.intersectObjects(rootsByRoom[room], true, hits);
    if (!hits.length) return null;
    let root: T.Object3D | null = hits[0].object;
    while (root && !targetByRoot.has(root)) root = root.parent;
    return root ? targetByRoot.get(root) ?? null : null;
  }

  function clear(): void {
    hovered = null;
    state.hover(null);
    canvas.style.cursor = "grab";
    onHover(null, 0, 0);
    state.invalidate();
  }

  function move(event: PointerEvent): void {
    const bounds = canvas.getBoundingClientRect();
    state.pointer(
      (event.clientX - bounds.left) / bounds.width - 0.5,
      (event.clientY - bounds.top) / bounds.height - 0.5,
    );
    if (state.focused()) return;
    hovered = pick(event, true);
    state.hover(hovered);
    canvas.style.cursor = hovered ? "pointer" : "grab";
    onHover(hovered?.id ?? null, event.clientX, event.clientY);
    state.invalidate();
  }

  function pointerDown(event: PointerEvent): void {
    downX = event.clientX;
    downY = event.clientY;
  }

  function pointerUp(event: PointerEvent): void {
    if (state.focused()) return;
    if (Math.hypot(event.clientX - downX, event.clientY - downY) > SCENE_SETTINGS.clickDistance) return;
    const target = pick(event, false);
    if (target) onSelect(target.id);
  }

  function leave(): void {
    state.pointer(0, 0);
    clear();
  }

  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointerleave", leave);
  return {
    clear,
    dispose() {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointerleave", leave);
      canvas.style.cursor = "";
    },
  };
}
