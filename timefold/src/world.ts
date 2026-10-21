import * as T from "three";
import type { ArchiveId } from "./archive";
import { createSceneAnimation } from "./scene/animation";
import { buildScene } from "./scene/build";
import { createRenderer, createSceneLifecycle } from "./scene/lifecycle";
import { createPicking } from "./scene/picking";
import type { WorldDiagnostics } from "./scene/types";

export type { WorldDiagnostics } from "./scene/types";

/** Public bridge between the HTML interface and the WebGL scene. */
export interface World {
  setTime(value: number): void;
  focus(id: ArchiveId | null): void;
  setMotion(value: boolean): void;
  getDiagnostics(): WorldDiagnostics;
  dispose(): void;
}

export function createWorld(
  canvas: HTMLCanvasElement,
  onSelect: (id: ArchiveId) => void,
  onHover: (id: ArchiveId | null, x: number, y: number) => void,
): World {
  const renderer = createRenderer(canvas);
  const graph = buildScene();
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 180);
  const animation = createSceneAnimation(graph, camera);
  const motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lifecycle = createSceneLifecycle(renderer, camera, graph, animation, motion);
  const picking = createPicking(canvas, camera, graph, {
    room: animation.getPickingRoom,
    focused: animation.isFocused,
    pointer: animation.setPointer,
    hover: animation.setHover,
    invalidate: lifecycle.invalidate,
  }, onSelect, onHover);

  return {
    setTime(value) {
      animation.setTime(value);
      picking.clear();
    },
    focus(id) {
      animation.focus(id);
      picking.clear();
    },
    setMotion: lifecycle.setMotion,
    getDiagnostics: lifecycle.getDiagnostics,
    dispose() {
      picking.dispose();
      lifecycle.dispose();
    },
  };
}
