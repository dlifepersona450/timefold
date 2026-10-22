import type * as T from "three";
import type { ArchiveId } from "../archive";
import type { Hypercube } from "./hypercube";

/** Each physical target keeps its own root, even when several photos share an ID. */
export interface PickTarget {
  id: ArchiveId;
  room: number;
  root: T.Group;
}

export interface FloatingElement {
  root: T.Group;
  room: number;
  baseY: number;
  phase: number;
  hypercube?: Hypercube;
}

/** Built once, then shared by animation and pointer interaction. */
export interface SceneGraph {
  scene: T.Scene;
  ambient: T.HemisphereLight;
  sun: T.DirectionalLight;
  fill: T.DirectionalLight;
  dustMaterial: T.PointsMaterial;
  displays: T.Group[];
  islands: T.Group[];
  people: T.Group[];
  floats: FloatingElement[];
  picks: PickTarget[];
  picksByRoom: PickTarget[][];
}

/** Debugging counters; no renderer or scene mutation is exposed. */
export interface WorldDiagnostics {
  drawCalls: number;
  triangles: number;
  pixelRatio: number;
  framesRendered: number;
  shadowsRendered: number;
}
