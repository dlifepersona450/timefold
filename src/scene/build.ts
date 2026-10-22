import * as T from "three";
import { landscape } from "../art";
import { eras, eraContent } from "../archive";
import { FIRST_ROOM_Z, ROOM_SPACING } from "../timeline";
import { createTemporalObject, type TemporalObjectId } from "../temporal-objects";
import { createPerson } from "../person";
import { createHypercube } from "./hypercube";
import { mergeStaticMeshes } from "./merge-static";
import { SCENE_SETTINGS } from "./settings";
import type { FloatingElement, PickTarget, SceneGraph } from "./types";

/** Build the corridor once. All rigid batching happens before animation starts. */
export function buildScene(): SceneGraph {
  const scene = new T.Scene();
  scene.background = new T.Color(eras[0].theme.background);
  scene.fog = new T.FogExp2(eras[0].theme.background, SCENE_SETTINGS.fogDensity);
  const ambient = new T.HemisphereLight(
    eras[0].theme.ambient,
    eras[0].theme.shadow,
    2.1,
  );
  scene.add(ambient);
  const sun = new T.DirectionalLight(eras[0].theme.light, 3.8);
  sun.position.set(-7, 15, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -25,
    right: 25,
    top: 25,
    bottom: -35,
  });
  sun.shadow.normalBias = 0.04;
  sun.shadow.bias = -0.0001;
  scene.add(sun, sun.target);
  const fill = new T.DirectionalLight(eras[0].theme.accent, 1.3);
  fill.position.set(8, 6, -35);
  scene.add(fill);
  const createMaterial = (
    color: T.ColorRepresentation,
    roughness = 0.7,
    metalness = 0,
  ) => new T.MeshStandardMaterial({ color, roughness, metalness });
  function addBox(
    width: number,
    height: number,
    depth: number,
    surface: T.Material,
    x = 0,
    y = 0,
    z = 0,
    parent: T.Object3D = scene,
  ) {
    const mesh = new T.Mesh(new T.BoxGeometry(width, height, depth), surface);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function createLabel(text: string, color: string, width = 3, height = 0.7) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 192;
    const context = canvas.getContext("2d")!;
    context.fillStyle = color;
    context.font = "36px monospace";
    context.textBaseline = "middle";
    context.fillText(text, 24, 96);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    return new T.Mesh(
      new T.PlaneGeometry(width, height),
      new T.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      }),
    );
  }
  const picks: PickTarget[] = [];
  const floats: FloatingElement[] = [];
  const archiveDisplays: T.Group[] = [];
  const islands: T.Group[] = [];
  const people: T.Group[] = [];
  const textures = eras.map((_, eraIndex) => {
    const texture = new T.CanvasTexture(landscape(eraIndex));
    texture.colorSpace = T.SRGBColorSpace;
    return texture;
  });
  const objectLayouts: {
    id: TemporalObjectId;
    x: number;
    y: number;
    z: number;
    rotation: number;
  }[] = [
    { id: "projects", x: -0.95, y: 2, z: -0.3, rotation: 0.12 },
    { id: "photos", x: 1.65, y: 2.04, z: 0.55, rotation: -0.3 },
    { id: "game", x: 0.65, y: 2, z: 1.35, rotation: -0.14 },
    { id: "journal", x: -2.3, y: 2, z: 0.94, rotation: 0.23 },
    { id: "food", x: 2.45, y: 2.02, z: -1.05, rotation: 0 },
    { id: "places", x: 0.85, y: 2.02, z: -1.35, rotation: 0 },
  ];
  for (let eraIndex = 0; eraIndex < eras.length; eraIndex++) {
    const era = eras[eraIndex];
    const theme = era.theme;
    const room = new T.Group();
    room.position.z = FIRST_ROOM_Z - eraIndex * ROOM_SPACING;
    scene.add(room);
    const architecture = new T.Group();
    architecture.name = `${era.year} corridor`;
    room.add(architecture);
    const plaster = createMaterial(theme.plaster);
    const wall = createMaterial(theme.wall);
    const paper = createMaterial(theme.paper);
    const dark = createMaterial(theme.shadow);
    const floor = createMaterial(theme.floor, 0.4, 0.12);
    const accent = createMaterial(theme.accent, 0.5);
    const light = new T.MeshBasicMaterial({ color: theme.light });
    const seamMat = createMaterial(theme.shadow);
    const segmentLength = ROOM_SPACING + (eraIndex === 0 ? 15 : 0);
    const segmentOffset = eraIndex === 0 ? 7.5 : 0;
    addBox(24, 0.3, segmentLength, floor, 0, -0.2, segmentOffset, architecture);
    addBox(0.4, 14, segmentLength, wall, -12, 6.8, segmentOffset, architecture);
    addBox(0.4, 14, segmentLength, wall, 12, 6.8, segmentOffset, architecture);
    addBox(24, 0.3, segmentLength, plaster, 0, 13.8, segmentOffset, architecture);
    for (let z = -8; z <= (eraIndex === 0 ? 22 : 8); z += 4)
      addBox(24, 0.012, 0.025, seamMat, 0, -0.035, z, architecture);
    for (let x = -12; x <= 12; x += 4)
      addBox(0.025, 0.012, segmentLength, seamMat, x, -0.034, segmentOffset, architecture);
    // The architecture shares the same red-to-blue journey as its archive objects.
    for (const z of [4, -4]) {
      addBox(1.1, 13.4, 1.1, plaster, -9, 6.65, z, architecture);
      addBox(1.1, 13.4, 1.1, plaster, 9, 6.65, z, architecture);
      addBox(18, 1.3, 1.1, plaster, 0, 12.7, z, architecture);
      addBox(4, 0.035, 0.65, light, 0, 13.56, z - 1, architecture);
      addBox(0.07, 9, 0.07, light, -8.43, 5.4, z + 0.57, architecture);
      addBox(0.06, 7, 2.4, dark, -11.75, 3.5, z - 3, architecture);
      addBox(0.06, 0.1, 2.6, light, -11.7, 7.1, z - 3, architecture);
    }
    // A lit threshold remains visible while the camera folds into the next year.
    addBox(0.045, 10.2, 0.045, light, -8.4, 5.1, -7.7, architecture);
    addBox(0.045, 10.2, 0.045, light, 8.4, 5.1, -7.7, architecture);
    addBox(16.8, 0.045, 0.045, light, 0, 10.2, -7.7, architecture);
    mergeStaticMeshes(architecture);
    // Leave the corridor intact while removing archive displays behind the
    // observer, where their silhouettes would intrude into the current room.
    const archiveDisplay = new T.Group();
    archiveDisplay.name = `${era.year} archive display`;
    room.add(archiveDisplay);
    archiveDisplays.push(archiveDisplay);
    const island = new T.Group();
    island.position.set(0.7, 0, 0);
    archiveDisplay.add(island);
    islands.push(island);
    const table = new T.Group();
    table.name = `${era.year} folded desk`;
    island.add(table);
    for (let layerIndex = 0; layerIndex < 4; layerIndex++) {
      const layer = addBox(
        7.2 - layerIndex * 0.17,
        0.09,
        4.6 - layerIndex * 0.1,
        layerIndex % 2 ? plaster : paper,
        0,
        1.25 + layerIndex * 0.13,
        0,
        table,
      );
      layer.rotation.y = (layerIndex - 1.5) * 0.025;
    }
    addBox(6.7, 0.19, 4.1, plaster, 0, 1.85, 0, table);
    addBox(3.7, 1.1, 1.7, plaster, 0, 0.55, 0, table);
    mergeStaticMeshes(table);
    const borderSource = new T.BoxGeometry(7.4, 0.03, 4.8);
    const border = new T.LineSegments(
      new T.EdgesGeometry(borderSource),
      new T.LineBasicMaterial({
        color: theme.accent,
        transparent: true,
        opacity: 0.65,
      }),
    );
    borderSource.dispose();
    border.position.y = 1.04;
    island.add(border);
    for (const layout of objectLayouts) {
      const object = createTemporalObject(
        layout.id,
        eraIndex,
        theme,
        era.year,
        era.phase,
        eraContent[eraIndex]?.project.code,
      );
      object.position.set(layout.x, layout.y, layout.z);
      object.rotation.y = layout.rotation;
      object.name = `${era.year} · ${era.objectStates[layout.id].name}`;
      mergeStaticMeshes(object);
      object.userData.id = layout.id;
      object.userData.room = eraIndex;
      island.add(object);
      picks.push({ id: layout.id, room: eraIndex, root: object });
    }
    const person = createPerson(era.person, eraIndex, theme.accent);
    person.position.set(5.3, 0, 0.95);
    person.rotation.y = -0.15;
    mergeStaticMeshes(person);
    person.userData.id = "person";
    person.userData.room = eraIndex;
    archiveDisplay.add(person);
    people.push(person);
    picks.push({ id: "person", room: eraIndex, root: person });
    const personLabel = createLabel(
      `${era.person.age} YEARS / ${era.person.stage.toUpperCase()}`,
      theme.light,
      3.7,
      0.55,
    );
    personLabel.position.set(4.1, 0.28, 2);
    personLabel.rotation.x = -0.5;
    archiveDisplay.add(personLabel);
    // Flat photographs unfold into shallow diorama reliefs.
    for (let photoIndex = 0; photoIndex < 3; photoIndex++) {
      const photo = new T.Group();
      photo.position.set(-4.4 + photoIndex * 0.55, 3 + photoIndex * 0.4, -1.5 - photoIndex * 1.1);
      photo.rotation.y = 0.22 + photoIndex * 0.1;
      archiveDisplay.add(photo);
      addBox(2.1, 2.6, 0.09, paper, 0, 0, 0, photo);
      addBox(
        1.86,
        2.12,
        0.025,
        new T.MeshBasicMaterial({ map: textures[(eraIndex + photoIndex) % textures.length] }),
        0,
        0.1,
        0.06,
        photo,
      );
      const mountain = new T.Mesh(new T.ConeGeometry(0.52, 0.85, 3), accent);
      mountain.position.set(0.2, -0.35, 0.24);
      mountain.scale.z = 0.3;
      photo.add(mountain);
      photo.userData = { id: "photos", room: eraIndex };
      picks.push({ id: "photos", room: eraIndex, root: photo });
      floats.push({ root: photo, room: eraIndex, baseY: photo.position.y, phase: photoIndex + eraIndex });
    }
    const roomLabel = createLabel(
      `0${eraIndex + 1} / ${era.year} / ${era.phase.toUpperCase()}`,
      theme.light,
      6.4,
      0.9,
    );
    roomLabel.position.set(-5.5, 5.5, -3.8);
    archiveDisplay.add(roomLabel);
    const portal = new T.Group();
    portal.position.set(5.8, 5.8, -4);
    archiveDisplay.add(portal);
    const hypercube = createHypercube(theme.accent);
    portal.add(hypercube.lines);
    floats.push({ root: portal, room: eraIndex, baseY: 5.8, phase: eraIndex + 3, hypercube });
  }
  const endZ =
    FIRST_ROOM_Z - (eras.length - 1) * ROOM_SPACING - ROOM_SPACING / 2 - 1;
  addBox(24, 14, 0.3, createMaterial(eras[eras.length - 1].theme.wall), 0, 6.8, endZ);
  addBox(
    5,
    9,
    0.1,
    new T.MeshBasicMaterial({ color: eras[eras.length - 1].theme.light }),
    0,
    4.5,
    endZ + 0.2,
  );
  const dustPositions = new Float32Array(360 * 3);
  let seed = 31;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let particleIndex = 0; particleIndex < 360; particleIndex++) {
    dustPositions[particleIndex * 3] = (rand() - 0.5) * 22;
    dustPositions[particleIndex * 3 + 1] = rand() * 12;
    dustPositions[particleIndex * 3 + 2] =
      15 - rand() * (30 + (eras.length - 1) * ROOM_SPACING);
  }
  const dustGeometry = new T.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new T.BufferAttribute(dustPositions, 3),
  );
  const dustMaterial = new T.PointsMaterial({
    color: eras[0].theme.light,
    size: 0.028,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  scene.add(new T.Points(dustGeometry, dustMaterial));
  const picksByRoom = eras.map((_, roomIndex) =>
    picks.filter((target) => target.room === roomIndex),
  );
  return {
    scene, ambient, sun, fill, dustMaterial, displays: archiveDisplays,
    islands, people, floats, picks, picksByRoom,
  };
}
