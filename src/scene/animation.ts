import * as T from "three";
import { eras, type ArchiveId } from "../archive";
import { clampTime, ROOM_SPACING } from "../timeline";
import { updateHypercube } from "./hypercube";
import { SCENE_SETTINGS as SETTINGS } from "./settings";
import type { PickTarget, SceneGraph } from "./types";

/** Frame-rate-independent damping that reaches its target exactly before idle. */
function damp(value: number, target: number, amount: number, epsilon: number): number {
  const next = T.MathUtils.lerp(value, target, amount);
  return Math.abs(next - target) < epsilon ? target : next;
}

export function createSceneAnimation(graph: SceneGraph, camera: T.PerspectiveCamera) {
  let targetTime = 0;
  let currentTime = 0;
  let elapsed = 0;
  let selected: ArchiveId | null = null;
  let hovered: PickTarget | null = null;
  let mobile = false;
  let lastShadowZ = Number.NaN;
  let shadowAge = SETTINGS.shadowInterval;
  let shadowDirty = true;
  let previousMotion = true;
  const mouse = new T.Vector2();
  const cameraTarget = new T.Vector3();
  const lookTarget = new T.Vector3();
  const currentLook = new T.Vector3(-0.7, 1.8, -8);
  const focusPosition = new T.Vector3();
  const focusTargets = graph.picksByRoom.map((targets) => {
    const byId = new Map<ArchiveId, PickTarget>();
    for (const target of targets) {
      if (!byId.has(target.id)) byId.set(target.id, target);
    }
    return byId;
  });
  const paletteColors = eras.map(({ theme }) => ({
    background: new T.Color(theme.background),
    light: new T.Color(theme.light),
    ambient: new T.Color(theme.ambient),
    shadow: new T.Color(theme.shadow),
    accent: new T.Color(theme.accent),
  }));
  const frameState = { pending: false, updateShadows: false };
  camera.position.set(5.2, 6.8, 11);
  camera.lookAt(currentLook);

  function update(delta: number, motion: boolean): { pending: boolean; updateShadows: boolean } {
    elapsed += delta;
    shadowAge += delta;
    const timeAmount = motion ? 1 - Math.exp(-delta * SETTINGS.timeDamping) : 1;
    const cameraAmount = motion ? 1 - Math.exp(-delta * SETTINGS.cameraDamping) : 1;
    const hoverAmount = motion ? 1 - Math.exp(-delta * SETTINGS.hoverDamping) : 1;
    const previousTime = currentTime;
    currentTime = damp(currentTime, targetTime, timeAmount, SETTINGS.timeEpsilon);
    const roomTime = currentTime * (eras.length - 1);
    const travelZ = -roomTime * ROOM_SPACING;
    const activeRoom = Math.round(targetTime * (eras.length - 1));
    const timeChanged = previousTime !== currentTime;
    cameraTarget.set(mobile ? 5.5 : 5.2, mobile ? 7.2 : 6.8, (mobile ? 18 : 11) + travelZ);
    lookTarget.set(mobile ? 0.3 : -0.7, 1.8, -8 + travelZ);
    if (motion) {
      cameraTarget.x += mouse.x * 0.6;
      cameraTarget.y -= mouse.y * 0.4;
    }
    if (selected) {
      const chosen = focusTargets[activeRoom].get(selected);
      if (chosen) {
        chosen.root.getWorldPosition(focusPosition);
        const isPerson = selected === "person";
        if (isPerson) focusPosition.y += 1.65;
        cameraTarget.copy(focusPosition);
        cameraTarget.x += 4;
        cameraTarget.y += isPerson ? 1.7 : 3.2;
        cameraTarget.z += isPerson ? 7 : 6;
        lookTarget.copy(focusPosition);
        lookTarget.x += mobile ? 0 : 2;
        lookTarget.y += 0.3;
      }
    }
    camera.position.lerp(cameraTarget, cameraAmount);
    currentLook.lerp(lookTarget, cameraAmount);
    const cameraPending = camera.position.distanceToSquared(cameraTarget) > SETTINGS.positionEpsilon ** 2
      || currentLook.distanceToSquared(lookTarget) > SETTINGS.positionEpsilon ** 2;
    if (!cameraPending) {
      camera.position.copy(cameraTarget);
      currentLook.copy(lookTarget);
    }
    camera.lookAt(currentLook);
    // Fold the outgoing archive down toward its floor anchor before the camera
    // reaches it. Architecture remains full size, and reverse travel unfolds it.
    for (let room = 0; room < graph.displays.length; room++) {
      const retired = T.MathUtils.smoothstep(roomTime - room, SETTINGS.displayRetireStart, SETTINGS.displayRetireEnd);
      const scale = 1 - retired;
      const display = graph.displays[room];
      if (display.scale.x !== scale) shadowDirty = true;
      display.scale.setScalar(scale);
      display.visible = scale > 0;
    }

    for (const item of graph.floats) {
      if (!graph.displays[item.room].visible) continue;
      if (Math.abs(roomTime - item.room) > 1.25) continue;
      item.root.position.y = item.baseY + (motion ? Math.sin(elapsed * 0.5 + item.phase) * 0.09 : 0);
      if (item.hypercube) updateHypercube(item.hypercube, (motion ? elapsed * 0.13 : 0) + currentTime * 2);
    }
    const fold = motion ? Math.sin((roomTime % 1) * Math.PI) ** 2 : 0;
    const motionChanged = motion !== previousMotion;
    for (let room = 0; room < graph.islands.length; room++) {
      if (!graph.displays[room].visible) continue;
      const proximity = Math.max(0, 1 - Math.abs(roomTime - room) / 1.25);
      const direction = room % 2 ? -1 : 1;
      const island = graph.islands[room];
      island.rotation.y = fold * proximity * direction * 0.065;
      island.rotation.z = -fold * proximity * direction * 0.022;
      island.scale.z = 1 - fold * proximity * 0.055;
      if (proximity > 0 || motionChanged) {
        graph.people[room].rotation.y = -0.15 + (motion ? Math.sin(elapsed * 0.24 + room) * 0.025 : 0);
      }
    }
    let scalePending = false;
    let scaleChanged = false;
    for (const target of graph.picks) {
      if (!graph.displays[target.room].visible) continue;
      const active = target.room === activeRoom && (hovered?.root === target.root || selected === target.id);
      const targetScale = active ? SETTINGS.hoverScale : 1;
      const scale = damp(target.root.scale.x, targetScale, hoverAmount, SETTINGS.scaleEpsilon);
      scaleChanged ||= target.root.scale.x !== scale;
      scalePending ||= scale !== targetScale;
      target.root.scale.setScalar(scale);
    }
    const fromIndex = Math.min(eras.length - 2, Math.floor(roomTime));
    const blend = roomTime - fromIndex;
    const from = paletteColors[fromIndex];
    const to = paletteColors[fromIndex + 1];
    (graph.scene.background as T.Color).copy(from.background).lerp(to.background, blend);
    (graph.scene.fog as T.FogExp2).color.copy(graph.scene.background as T.Color);
    graph.ambient.color.copy(from.ambient).lerp(to.ambient, blend);
    graph.ambient.groundColor.copy(from.shadow).lerp(to.shadow, blend);
    graph.sun.color.copy(from.light).lerp(to.light, blend);
    graph.fill.color.copy(from.accent).lerp(to.accent, blend);
    graph.dustMaterial.color.copy(from.light).lerp(to.light, blend);
    graph.sun.position.z = 12 + travelZ;
    graph.sun.target.position.z = travelZ - 10;
    graph.fill.position.z = travelZ - 15;

    shadowDirty ||= timeChanged || scaleChanged || motionChanged;
    const pending = currentTime !== targetTime || cameraPending || scalePending;
    // Limit expensive shadow passes during travel; always draw the exact final
    // map once movement settles. Idle decorative sway intentionally uses it.
    const shadowMoved = Math.abs(graph.sun.position.z - lastShadowZ) >= SETTINGS.shadowDistance;
    const updateShadows = Number.isNaN(lastShadowZ)
      || (shadowDirty && ((!pending) || (shadowAge >= SETTINGS.shadowInterval && (shadowMoved || scaleChanged || motionChanged))));
    if (updateShadows) {
      lastShadowZ = graph.sun.position.z;
      shadowAge = 0;
      shadowDirty = false;
    }
    previousMotion = motion;
    frameState.pending = pending;
    frameState.updateShadows = updateShadows;
    return frameState;
  }

  return {
    update,
    getPickingRoom: () => Math.round(targetTime * (eras.length - 1)),
    isFocused: () => selected !== null,
    setTime(value: number) { targetTime = clampTime(value); },
    focus(id: ArchiveId | null) { selected = id; },
    setPointer(x: number, y: number) { mouse.set(x, y); },
    setHover(target: PickTarget | null) { hovered = target; },
    setMobile(value: boolean) { mobile = value; },
  };
}
