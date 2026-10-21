import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Batch rigid opaque parts inside one moving/pickable root. Do not call on an
 * ancestor of independently animated children: local transforms are baked here.
 * Transparent parts stay separate so Three.js can continue sorting them.
 */
export function mergeStaticMeshes(root: T.Group): void {
  const buckets = new Map<string, T.Mesh<T.BufferGeometry, T.Material>[]>();
  root.updateWorldMatrix(true, true);
  root.traverse((node) => {
    if (!(node instanceof T.Mesh) || Array.isArray(node.material)) return;
    if (!node.visible || node.material.transparent || node.children.length) return;
    const attributeKey = Object.keys(node.geometry.attributes).sort().join(",");
    const key = [node.material.uuid, node.castShadow, node.receiveShadow, node.renderOrder, attributeKey].join(":");
    const bucket = buckets.get(key);
    if (bucket) bucket.push(node);
    else buckets.set(key, [node]);
  });
  const inverseRoot = root.matrixWorld.clone().invert();
  const relativeTransform = new T.Matrix4();
  const removedGeometries = new Set<T.BufferGeometry>();
  for (const meshes of buckets.values()) {
    if (meshes.length < 2) continue;
    const geometries = meshes.map((mesh) => {
      const geometry = mesh.geometry.index
        ? mesh.geometry.toNonIndexed()
        : mesh.geometry.clone();
      relativeTransform.multiplyMatrices(inverseRoot, mesh.matrixWorld);
      geometry.applyMatrix4(relativeTransform);
      return geometry;
    });
    const merged = mergeGeometries(geometries, false);
    geometries.forEach((geometry) => geometry.dispose());
    if (!merged) continue;
    merged.computeBoundingSphere();
    const representative = meshes[0];
    const batch = new T.Mesh(merged, representative.material);
    batch.name = `${root.name || "Rigid assembly"} / batched surface`;
    batch.castShadow = representative.castShadow;
    batch.receiveShadow = representative.receiveShadow;
    batch.renderOrder = representative.renderOrder;
    for (const mesh of meshes) {
      mesh.removeFromParent();
      removedGeometries.add(mesh.geometry);
    }
    root.add(batch);
  }
  // A geometry can be shared by multiple meshes; retain anything still attached.
  root.traverse((node) => {
    if (node instanceof T.Mesh) removedGeometries.delete(node.geometry);
  });
  removedGeometries.forEach((geometry) => geometry.dispose());
}
