import * as T from "three";
import type { createSceneAnimation } from "./animation";
import { SCENE_SETTINGS } from "./settings";
import type { SceneGraph, WorldDiagnostics } from "./types";

export function createRenderer(canvas: HTMLCanvasElement): T.WebGLRenderer {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  return renderer;
}

/** Own the RAF handle, viewport, visibility pause, diagnostics, and GPU cleanup. */
export function createSceneLifecycle(
  renderer: T.WebGLRenderer,
  camera: T.PerspectiveCamera,
  graph: SceneGraph,
  animation: ReturnType<typeof createSceneAnimation>,
  initialMotion: boolean,
) {
  let motion = initialMotion;
  let frame = 0;
  let lastTimestamp = 0;
  let disposed = false;
  const diagnostics: WorldDiagnostics = {
    drawCalls: 0, triangles: 0, pixelRatio: 1, framesRendered: 0, shadowsRendered: 0,
  };

  function invalidate(): void {
    if (disposed || frame || document.hidden) return;
    frame = requestAnimationFrame(render);
  }

  function render(timestamp: number): void {
    frame = 0;
    if (disposed || document.hidden) return;
    // Resuming a background tab starts a fresh clock, avoiding a large jump.
    const delta = lastTimestamp === 0 ? 1 / 60 : T.MathUtils.clamp((timestamp - lastTimestamp) / 1000, 0, 0.05);
    lastTimestamp = timestamp;
    const state = animation.update(delta, motion);
    if (state.updateShadows) renderer.shadowMap.needsUpdate = true;
    if (renderer.shadowMap.needsUpdate) diagnostics.shadowsRendered++;
    renderer.render(graph.scene, camera);
    diagnostics.framesRendered++;
    diagnostics.drawCalls = renderer.info.render.calls;
    diagnostics.triangles = renderer.info.render.triangles;
    if (motion || state.pending) invalidate();
    else lastTimestamp = 0;
  }

  function resize(): void {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, SCENE_SETTINGS.maxPixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    const mobile = window.innerWidth < SCENE_SETTINGS.mobileBreakpoint;
    animation.setMobile(mobile);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = mobile ? 55 : 45;
    camera.updateProjectionMatrix();
    diagnostics.pixelRatio = renderer.getPixelRatio();
    invalidate();
  }

  function visibilityChanged(): void {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTimestamp = 0;
    if (!document.hidden) invalidate();
  }

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", visibilityChanged);
  return {
    invalidate,
    getDiagnostics: (): WorldDiagnostics => ({ ...diagnostics }),
    setMotion(value: boolean): void {
      motion = value;
      invalidate();
    },
    dispose(): void {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibilityChanged);
      disposeScene(graph.scene);
      renderer.dispose();
    },
  };
}

/** Shared materials/textures are released once, including the sun's shadow target. */
function disposeScene(scene: T.Scene): void {
  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  const textures = new Set<T.Texture>();
  scene.traverse((node) => {
    if (node instanceof T.Mesh || node instanceof T.Points || node instanceof T.LineSegments) {
      geometries.add(node.geometry);
      const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of nodeMaterials) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (value instanceof T.Texture) textures.add(value);
        }
      }
    }
    if (node instanceof T.DirectionalLight) node.shadow.dispose();
  });
  geometries.forEach((geometry) => geometry.dispose());
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  scene.clear();
}
