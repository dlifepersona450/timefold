import * as T from "three";

/** Sixteen vertices × three projected coordinates, reused for every update. */
export interface Hypercube {
  lines: T.LineSegments<T.BufferGeometry, T.LineBasicMaterial>;
  vertices: Float32Array;
}

// A tesseract has 32 edges. Neighbors differ in exactly one binary coordinate.
const edgeIndices: number[] = [];
for (let vertex = 0; vertex < 16; vertex++) {
  for (let dimension = 0; dimension < 4; dimension++) {
    const neighbor = vertex ^ (1 << dimension);
    if (vertex < neighbor) edgeIndices.push(vertex, neighbor);
  }
}
const EDGES = new Uint8Array(edgeIndices);

export function createHypercube(color: T.ColorRepresentation): Hypercube {
  const geometry = new T.BufferGeometry();
  const positions = new T.BufferAttribute(new Float32Array(EDGES.length * 3), 3);
  positions.setUsage(T.DynamicDrawUsage);
  geometry.setAttribute("position", positions);
  // Projection is bounded: every axis <= .65 * 3.5 / (3.5 - sqrt(3)).
  // A conservative fixed sphere avoids recalculating bounds each animation frame.
  geometry.boundingSphere = new T.Sphere(new T.Vector3(), 3);
  const lines = new T.LineSegments(
    geometry,
    new T.LineBasicMaterial({ color, transparent: true, opacity: 0.7 }),
  );
  const hypercube = { lines, vertices: new Float32Array(16 * 3) };
  updateHypercube(hypercube, 0);
  return hypercube;
}

/** Rotate XW/YW in 4D, then perspective-project into the existing line buffer. */
export function updateHypercube(hypercube: Hypercube, time: number): void {
  const cosineX = Math.cos(time);
  const sineX = Math.sin(time);
  const cosineY = Math.cos(time * 0.7);
  const sineY = Math.sin(time * 0.7);
  const vertices = hypercube.vertices;
  for (let vertex = 0; vertex < 16; vertex++) {
    const x = vertex & 1 ? 1 : -1;
    const y = vertex & 2 ? 1 : -1;
    const z = vertex & 4 ? 1 : -1;
    const w = vertex & 8 ? 1 : -1;
    const rotatedX = x * cosineX - w * sineX;
    const intermediateW = x * sineX + w * cosineX;
    const rotatedY = y * cosineY - intermediateW * sineY;
    const rotatedW = y * sineY + intermediateW * cosineY;
    const projection = (3.5 / (3.5 - rotatedW)) * 0.65;
    vertices[vertex * 3] = rotatedX * projection;
    vertices[vertex * 3 + 1] = rotatedY * projection;
    vertices[vertex * 3 + 2] = z * projection;
  }
  const position = hypercube.lines.geometry.getAttribute("position") as T.BufferAttribute;
  const coordinates = position.array as Float32Array;
  for (let endpoint = 0; endpoint < EDGES.length; endpoint++) {
    const vertexOffset = EDGES[endpoint] * 3;
    const endpointOffset = endpoint * 3;
    coordinates[endpointOffset] = vertices[vertexOffset];
    coordinates[endpointOffset + 1] = vertices[vertexOffset + 1];
    coordinates[endpointOffset + 2] = vertices[vertexOffset + 2];
  }
  position.needsUpdate = true;
}
