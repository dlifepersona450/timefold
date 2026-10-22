import * as T from "three";

export type PersonAppearance = {
  age: number;
  stage: string;
  outfit: string;
  description: string;
  hair: string;
  top: string;
  bottom: string;
  skin: string;
};

/**
 * Original sculptural human, facing +Z. Feet sit at Y=0; position the root in the room.
 * Stage selects the silhouette/costume; age adjusts growth, posture and facial lines.
 */
export function createPerson(
  appearance: PersonAppearance,
  eraIndex: number,
  accent: string,
): T.Group {
  const stages = ["child", "young-adult", "adult", "elder"];
  const stageIndex = stages.indexOf(appearance.stage);
  const era =
    stageIndex >= 0
      ? stageIndex
      : T.MathUtils.clamp(
          Math.round(Number.isFinite(eraIndex) ? eraIndex : 0),
          0,
          3,
        );
  const age = T.MathUtils.clamp(
    Number.isFinite(appearance.age) ? appearance.age : [10, 24, 38, 68][era],
    1,
    110,
  );
  const child = era === 0;
  const elder = era === 3;
  const aging = T.MathUtils.clamp((age - 50) / 40, 0, 1);
  const growth = child
    ? T.MathUtils.clamp((age - 10) * 0.045, -0.22, 0.18)
    : era === 1
      ? T.MathUtils.clamp((age - 24) * 0.004, -0.025, 0.025)
      : era === 2
        ? T.MathUtils.clamp((age - 38) * -0.001, -0.025, 0.02)
        : T.MathUtils.clamp((age - 68) * -0.003, -0.09, 0.04);
  const height = [2.43, 3.4, 3.47, 3.27][era] * (1 + growth);
  const unit = height / 3.5;
  const root = new T.Group();
  root.name = `Life witness · ${appearance.stage} · age ${appearance.age}`;
  root.userData.personAge = age;
  root.userData.personStage = stages[era];

  const matte = (color: string, roughness = 0.85, metalness = 0) =>
    new T.MeshStandardMaterial({ color, roughness, metalness });
  const skin = matte(appearance.skin);
  const wrinkle = skin.clone();
  wrinkle.color.multiplyScalar(0.72);
  const hair = matte(appearance.hair);
  const top = matte(appearance.top);
  const bottom = matte(appearance.bottom);
  const footwear = matte(elder ? "#253746" : "#393b37");
  const sole = matte("#d6cec1");
  const shirt = matte("#ded8c6");
  const dark = matte("#35343a");
  const seam = matte(accent, 0.5, elder ? 0.25 : 0);
  const detail = new T.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: elder ? 0.65 : 0.08,
    roughness: 0.55,
  });

  const mesh = (
    geometry: T.BufferGeometry,
    material: T.Material,
    x: number,
    y: number,
    z: number,
    parent: T.Object3D = root,
  ) => {
    const node = new T.Mesh(geometry, material);
    node.position.set(x * unit, y * unit, z * unit);
    node.castShadow = true;
    node.receiveShadow = true;
    parent.add(node);
    return node;
  };
  const box = (
    w: number,
    h: number,
    d: number,
    material: T.Material,
    x: number,
    y: number,
    z: number,
    parent: T.Object3D = root,
  ) =>
    mesh(
      new T.BoxGeometry(w * unit, h * unit, d * unit),
      material,
      x,
      y,
      z,
      parent,
    );
  const ellipsoid = (
    w: number,
    h: number,
    d: number,
    material: T.Material,
    x: number,
    y: number,
    z: number,
    parent: T.Object3D = root,
  ) => {
    const node = mesh(
      new T.SphereGeometry(unit, 14, 10),
      material,
      x,
      y,
      z,
      parent,
    );
    node.scale.set(w, h, d);
    return node;
  };
  const limb = (
    radius: number,
    length: number,
    material: T.Material,
    x: number,
    y: number,
    z: number,
  ) =>
    mesh(
      new T.CylinderGeometry(
        radius * unit * 0.9,
        radius * unit,
        length * unit,
        10,
      ),
      material,
      x,
      y,
      z,
    );

  // A child's larger head, shorter legs and broad backpack remain readable from the corridor.
  const legLength = child
    ? 1 + T.MathUtils.clamp((age - 10) * 0.015, -0.09, 0.1)
    : 1.23;
  const hipY = legLength + 0.15;
  const shoulderY = (child ? 2.42 : 2.48) - aging * 0.05;
  const headY = (child ? 2.99 : 3.04) - aging * 0.035;
  const headRadius = child
    ? T.MathUtils.clamp(0.46 - (age - 10) * 0.006, 0.4, 0.51)
    : 0.37;
  for (const side of [-1, 1]) {
    box(0.34, 0.18, 0.56, footwear, side * 0.24, 0.12, 0.1);
    box(0.36, 0.06, 0.58, sole, side * 0.24, 0.03, 0.1);
    const leg = limb(
      child ? 0.17 : 0.18,
      legLength,
      bottom,
      side * 0.23,
      0.2 + legLength / 2,
      0,
    );
    leg.rotation.z = side * 0.025;
    if (child) box(0.35, 0.14, 0.36, shirt, side * 0.23, 0.34, 0);
  }

  const torsoHeight = shoulderY - hipY;
  mesh(
    new T.CylinderGeometry(0.44 * unit, 0.35 * unit, torsoHeight * unit, 10),
    top,
    0,
    hipY + torsoHeight / 2,
    0,
  );
  ellipsoid(0.45, 0.19, 0.28, top, 0, shoulderY - 0.06, 0);
  limb(0.14, 0.23, skin, 0, shoulderY + 0.12, elder ? 0.04 : 0);

  for (const side of [-1, 1]) {
    const arm = limb(
      0.145,
      child ? 0.79 : 0.95,
      top,
      side * 0.55,
      shoulderY - (child ? 0.33 : 0.42),
      0.015,
    );
    arm.rotation.z = side * 0.09;
    ellipsoid(
      0.135,
      0.18,
      0.13,
      skin,
      side * 0.59,
      shoulderY - (child ? 0.79 : 0.96),
      0.025,
    );
    if (elder)
      box(0.27, 0.08, 0.29, detail, side * 0.57, shoulderY - 0.82, 0.02);
  }

  const head = new T.Group();
  head.position.set(0, headY * unit, aging * 0.16 * unit);
  root.add(head);
  head.rotation.x = aging * 0.1;
  ellipsoid(
    headRadius,
    headRadius * (child ? 1.02 : 1.1),
    headRadius * 0.86,
    skin,
    0,
    0,
    0,
    head,
  );
  for (const side of [-1, 1]) {
    ellipsoid(
      0.065,
      0.1,
      0.065,
      skin,
      side * headRadius * 0.96,
      -0.025,
      0,
      head,
    );
    ellipsoid(
      0.025,
      0.027,
      0.014,
      dark,
      side * headRadius * 0.39,
      0.025,
      headRadius * 0.81,
      head,
    );
    const brow = box(
      0.105,
      elder ? 0.024 : 0.018,
      0.025,
      hair,
      side * headRadius * 0.39,
      0.105,
      headRadius * 0.81,
      head,
    );
    brow.rotation.z = side * (elder ? -0.04 : 0.04);
    if (age >= 55) {
      const crease = box(
        0.075,
        0.012,
        0.014,
        wrinkle,
        side * headRadius * 0.62,
        -0.035,
        headRadius * 0.75,
        head,
      );
      crease.rotation.z = side * 0.25;
    }
  }
  ellipsoid(0.06, 0.07, 0.06, skin, 0, -0.045, headRadius * 0.86, head);
  box(0.11, 0.017, 0.018, dark, 0, -0.17, headRadius * 0.8, head);

  // Separate scalp and locks give each silhouette an age-specific hairstyle.
  const hairCap = mesh(
    new T.SphereGeometry(
      headRadius * unit * 1.035,
      14,
      8,
      0,
      Math.PI * 2,
      0,
      elder ? Math.PI * 0.39 : Math.PI * 0.52,
    ),
    hair,
    0,
    0.04,
    -0.025,
    head,
  );
  hairCap.scale.set(1, child ? 1.08 : 1, 0.9);
  if (elder) {
    for (const side of [-1, 1])
      ellipsoid(0.085, 0.22, 0.2, hair, side * 0.32, 0.015, -0.035, head);
    ellipsoid(0.25, 0.08, 0.18, hair, -0.07, 0.34, -0.02, head);
  } else {
    for (let n = 0; n < 3; n++) {
      const lock = ellipsoid(
        child ? 0.15 : 0.12,
        child ? 0.12 : 0.08,
        0.13,
        hair,
        -0.2 + n * 0.17,
        0.22 + n * 0.035,
        0.21,
        head,
      );
      lock.rotation.z = -0.2;
    }
  }

  if (child) {
    // School years: canvas backpack, straps, short coat and contrasting sneaker soles.
    box(0.72, 0.78, 0.27, seam, 0, 1.95, -0.36);
    box(0.48, 0.31, 0.06, top, 0, 1.77, -0.52);
    for (const side of [-1, 1]) {
      box(0.09, 0.88, 0.065, seam, side * 0.28, 2.0, 0.37);
      box(0.19, 0.035, 0.22, shirt, side * 0.24, 0.22, 0.25);
    }
    for (let n = 0; n < 3; n++) {
      const stripe = mesh(
        new T.TorusGeometry((0.38 + n * 0.016) * unit, 0.026 * unit, 6, 20),
        shirt,
        0,
        1.55 + n * 0.23,
        0,
      );
      stripe.rotation.x = Math.PI / 2;
    }
    box(0.31, 0.13, 0.045, shirt, 0, 1.73, 0.43);
  } else if (era === 1) {
    // Early adulthood: casual hoodie, tee, cross-body bag and headphones.
    // The hood sits behind the neck and remains visible around both shoulders.
    ellipsoid(0.36, 0.33, 0.3, top, 0, 2.57, -0.22);
    ellipsoid(0.25, 0.23, 0.23, dark, 0, 2.65, -0.12);
    box(0.27, 0.81, 0.06, shirt, 0, 2.0, 0.42);
    for (const side of [-1, 1])
      box(0.021, 0.32, 0.025, shirt, side * 0.16, 2.29, 0.45);
    for (const side of [-1, 1])
      box(0.19, 0.19, 0.05, top, side * 0.24, 2.19, 0.4);
    const strap = box(0.075, 1.13, 0.065, dark, 0.02, 2.04, 0.47);
    strap.rotation.z = -0.5;
    box(0.45, 0.39, 0.2, seam, 0.33, 1.56, 0.45);
    const headphoneBand = mesh(
      new T.TorusGeometry(0.23 * unit, 0.036 * unit, 6, 14, Math.PI),
      dark,
      0,
      shoulderY + 0.12,
      0.15,
    );
    headphoneBand.rotation.x = Math.PI / 2;
    for (const side of [-1, 1])
      ellipsoid(0.075, 0.095, 0.065, dark, side * 0.23, shoulderY + 0.12, 0.15);
  } else if (era === 2) {
    // Working years: structured jacket, cream shirt, lapels, pockets and a watch.
    box(0.3, 0.91, 0.07, shirt, 0, 1.98, 0.43);
    for (const side of [-1, 1]) {
      const lapel = box(0.13, 0.48, 0.07, seam, side * 0.17, 2.28, 0.46);
      lapel.rotation.z = side * 0.28;
      box(0.2, 0.045, 0.05, shirt, side * 0.25, 1.73, 0.32);
    }
    for (let n = 0; n < 3; n++)
      ellipsoid(0.025, 0.025, 0.015, dark, 0.07, 1.65 + n * 0.18, 0.48);
    box(0.28, 0.11, 0.29, dark, -0.58, 1.64, 0.02);
    box(0.14, 0.095, 0.025, seam, -0.58, 1.64, 0.18);
  } else {
    // Later life: silver hair, a long technical coat, raised collar and luminous seams.
    mesh(
      new T.CylinderGeometry(0.36 * unit, 0.54 * unit, 0.8 * unit, 10),
      top,
      0,
      1.2,
      0,
    );
    for (let n = 0; n < 5; n++)
      box(
        0.05,
        0.32,
        0.045,
        detail,
        0.13,
        0.96 + n * 0.3,
        [0.5, 0.45, 0.42, 0.44, 0.46][n],
      );
    for (const side of [-1, 1]) {
      const collar = box(0.23, 0.3, 0.31, top, side * 0.23, 2.53, 0.07);
      collar.rotation.z = side * 0.16;
      box(0.35, 0.05, 0.05, detail, side * 0.28, 1.61, 0.34);
      box(0.35, 0.38, 0.4, footwear, side * 0.23, 0.32, 0.035);
    }
    const brooch = mesh(
      new T.OctahedronGeometry(0.085 * unit),
      detail,
      -0.24,
      2.21,
      0.35,
    );
    brooch.rotation.z = Math.PI / 4;
  }

  return root;
}
