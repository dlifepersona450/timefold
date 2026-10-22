import * as T from "three";

/** Era silhouettes live here; archive.ts owns their editable story and colors. */
export interface ObjectPalette {
  accent: string;
  paper: string;
  metal: string;
  shadow: string;
  light: string;
}
export type TemporalObjectId =
  "projects" | "photos" | "game" | "journal" | "food" | "places";

export function createTemporalObject(
  id: TemporalObjectId,
  eraIndex: number,
  palette: ObjectPalette,
  year: string,
  phase: string,
  codeLines: readonly string[] = [],
): T.Group {
  const root = new T.Group();
  const material = (
    color: T.ColorRepresentation,
    roughness = 0.65,
    metalness = 0,
  ) => new T.MeshStandardMaterial({ color, roughness, metalness });
  const dark = material(palette.shadow);
  const paper = material(palette.paper);
  const metal = material(palette.metal, 0.3, 0.68);
  const accent = material(palette.accent, 0.4, 0.2);
  const glow = new T.MeshBasicMaterial({ color: palette.light });
  const hologram = new T.MeshPhysicalMaterial({
    color: palette.accent,
    transparent: true,
    opacity: 0.28,
    roughness: 0.12,
    metalness: 0.3,
    side: T.DoubleSide,
    depthWrite: false,
    emissive: palette.accent,
    emissiveIntensity: 0.3,
  });
  const mesh = (
    geometry: T.BufferGeometry,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
    parent: T.Object3D = root,
  ) => {
    const result = new T.Mesh(geometry, mat);
    result.position.set(x, y, z);
    result.castShadow = mat !== hologram && mat !== glow;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  };
  const box = (
    w: number,
    h: number,
    d: number,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
    parent: T.Object3D = root,
  ) => mesh(new T.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const ball = (
    r: number,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
    segments = 24,
  ) => mesh(new T.SphereGeometry(r, segments, 14), mat, x, y, z);
  const cylinder = (
    radius: number,
    h: number,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
    topRadius = radius,
  ) => mesh(new T.CylinderGeometry(topRadius, radius, h, 28), mat, x, y, z);
  const ring = (
    radius: number,
    thickness: number,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => mesh(new T.TorusGeometry(radius, thickness, 8, 48), mat, x, y, z);
  const outline = (
    geometry: T.BufferGeometry,
    color = palette.light,
    opacity = 0.8,
    parent: T.Object3D = root,
  ) => {
    const line = new T.LineSegments(
      new T.EdgesGeometry(geometry),
      new T.LineBasicMaterial({ color, transparent: true, opacity }),
    );
    parent.add(line);
    return line;
  };
  function screen(
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    kind = "terminal",
    parent: T.Object3D = root,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = palette.shadow;
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = palette.light;
    ctx.font = "26px monospace";
    ctx.fillText(`${year} / ${phase.toUpperCase()}`, 34, 53);
    if (kind === "terminal") {
      const lines = codeLines.length
        ? [...codeLines, "", "_ enter the next fold"]
        : [
            "TIMEFOLD / MEMORY SYSTEM",
            "",
            `> archive.open(${year})`,
            `> state: ${phase.toLowerCase()}`,
            "> a world in progress",
            "",
            "_ enter the next fold",
          ];
      lines.forEach((text, i) => ctx.fillText(text, 34, 103 + i * 35));
    } else {
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 4;
      for (let j = 0; j < 4; j++) {
        ctx.strokeRect(
          34 + (j % 2) * 294,
          95 + Math.floor(j / 2) * 140,
          260,
          112,
        );
        ctx.fillStyle = j % 2 ? palette.metal : palette.accent;
        ctx.fillRect(
          48 + (j % 2) * 294,
          110 + Math.floor(j / 2) * 140,
          60 + j * 20,
          12,
        );
      }
    }
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    return box(
      w,
      h,
      0.012,
      new T.MeshBasicMaterial({ map: texture }),
      x,
      y,
      z,
      parent,
    );
  }
  const buttons = (x: number, y: number, z: number, horizontal = true) => {
    for (let j = 0; j < 3; j++)
      ball(
        0.05,
        j === 1 ? glow : accent,
        x + (horizontal ? j * 0.16 : 0),
        y,
        z + (horizontal ? 0 : j * 0.16),
      );
  };
  switch (id) {
    case "projects": {
      if (eraIndex === 0) {
        // A deep cathode-ray tube, separate keyboard and tower.
        box(1.95, 1.45, 1.12, paper, 0, 0.97, -0.34);
        box(1.59, 1.07, 0.08, dark, 0, 1.02, 0.26);
        screen(1.42, 0.9, 0, 1.03, 0.31);
        cylinder(0.26, 0.24, paper, 0, 0.18, -0.3);
        box(1.35, 0.13, 0.7, paper, 0, 0.04, -0.3);
        const keys = box(1.85, 0.14, 0.64, paper, 0, 0.05, 0.72);
        keys.rotation.x = 0.1;
        for (let j = 0; j < 4; j++)
          box(1.55, 0.014, 0.045, metal, 0, 0.135 + j * 0.002, 0.5 + j * 0.12);
        box(0.48, 1.4, 0.98, paper, -1.28, 0.67, -0.24);
        box(0.35, 0.12, 0.02, dark, -1.28, 1.04, 0.26);
        ball(0.045, glow, -1.28, 0.69, 0.28);
      } else if (eraIndex < 3) {
        const thin = eraIndex === 2;
        box(2.15, thin ? 0.075 : 0.2, 1.36, thin ? metal : dark);
        box(
          1.78,
          0.02,
          0.66,
          thin ? dark : metal,
          0,
          thin ? 0.05 : 0.11,
          -0.16,
        );
        for (let j = 0; j < 4; j++)
          box(
            1.55,
            0.012,
            0.018,
            accent,
            0,
            thin ? 0.065 : 0.125,
            -0.4 + j * 0.14,
          );
        box(
          0.5,
          0.015,
          0.27,
          thin ? paper : metal,
          0,
          thin ? 0.05 : 0.11,
          0.43,
        );
        const lid = new T.Group();
        lid.position.set(0, 0.11, -0.63);
        lid.rotation.x = -0.17;
        root.add(lid);
        box(
          2.15,
          1.4,
          thin ? 0.055 : 0.16,
          thin ? metal : dark,
          0,
          0.7,
          0,
          lid,
        );
        screen(
          1.94,
          1.18,
          0,
          0.72,
          thin ? 0.035 : 0.09,
          thin ? "dashboard" : "terminal",
          lid,
        );
        if (thin) {
          const phone = box(0.38, 0.035, 0.68, dark, 1.4, 0.02, 0.3);
          phone.rotation.y = -0.2;
        }
      } else {
        cylinder(0.84, 0.1, metal, 0, 0.03, 0.08);
        const projectionRing = ring(0.66, 0.025, glow, 0, 0.12, 0.08);
        projectionRing.rotation.x = -Math.PI / 2;
        const pane = box(2.4, 1.5, 0.045, hologram, 0, 1.06, -0.13);
        const frame = outline(new T.BoxGeometry(2.4, 1.5, 0.045));
        frame.position.copy(pane.position);
        screen(1.95, 1.13, 0, 1.07, -0.09, "dashboard");
        const keyboard = box(2.2, 0.025, 0.66, hologram, 0, 0.3, 0.91);
        for (let j = 0; j < 4; j++)
          box(1.84, 0.012, 0.02, glow, 0, 0.32, 0.7 + j * 0.13);
        keyboard.rotation.x = -0.08;
        ball(0.08, glow, -1.05, 1.97, -0.1);
      }
      break;
    }
    case "photos": {
      const film = eraIndex === 0,
        future = eraIndex === 3;
      if (!future) {
        const dslr = eraIndex === 1;
        box(
          film ? 1.13 : 1.02,
          dslr ? 0.7 : 0.58,
          film ? 0.36 : 0.45,
          film ? metal : dark,
          0,
          0.31,
          0,
        );
        if (film) {
          box(1.1, 0.23, 0.38, paper, 0, 0.53, 0);
          box(0.22, 0.11, 0.045, dark, -0.35, 0.55, 0.21);
          cylinder(0.105, 0.08, metal, -0.38, 0.71, 0);
          cylinder(0.1, 0.07, metal, 0.38, 0.7, 0);
        } else {
          box(
            0.3,
            dslr ? 0.25 : 0.15,
            0.38,
            metal,
            0,
            dslr ? 0.75 : 0.62,
            -0.05,
          );
          box(0.22, dslr ? 0.72 : 0.5, 0.47, accent, 0.44, 0.32, 0.025);
          cylinder(0.065, 0.06, glow, 0.33, dslr ? 0.74 : 0.64, 0.01);
        }
        const long = dslr ? 0.68 : film ? 0.24 : 0.39;
        const lens = cylinder(
          dslr ? 0.34 : 0.28,
          long,
          metal,
          0,
          0.31,
          0.2 + long / 2,
        );
        lens.rotation.x = Math.PI / 2;
        const glass = cylinder(
          dslr ? 0.27 : 0.22,
          0.025,
          material("#213845", 0.05, 0.75),
          0,
          0.31,
          0.21 + long,
        );
        glass.rotation.x = Math.PI / 2;
        const rim = ring(
          dslr ? 0.32 : 0.265,
          0.025,
          film ? dark : accent,
          0,
          0.31,
          0.21 + long,
        );
        rim.rotation.z = 0.1;
      } else {
        box(0.96, 0.48, 0.22, metal, 0, 0.42, 0);
        box(1.18, 0.74, 0.03, hologram, 0, 0.43, -0.15);
        ring(0.32, 0.04, glow, 0, 0.43, 0.34);
        ring(0.23, 0.028, accent, 0, 0.43, 0.55);
        ball(0.16, hologram, 0, 0.43, 0.47);
        for (let j = 0; j < 3; j++)
          box(0.08, 0.04, 0.15, glow, -0.3 + j * 0.3, 0.72, 0);
        cylinder(0.32, 0.055, dark, 0, 0.01, 0);
      }
      break;
    }
    case "game": {
      if (eraIndex === 0) {
        // Portrait handheld with a monochrome screen and large plastic bezel.
        const device = new T.Group();
        root.add(device);
        device.rotation.x = -0.25;
        box(0.85, 0.22, 1.29, paper, 0, 0.14, 0, device);
        box(0.69, 0.035, 0.6, dark, 0, 0.27, -0.23, device);
        box(0.47, 0.015, 0.39, material("#91a478"), 0, 0.3, -0.23, device);
        box(0.1, 0.035, 0.33, dark, -0.2, 0.28, 0.3, device);
        box(0.32, 0.035, 0.1, dark, -0.2, 0.28, 0.3, device);
        mesh(
          new T.SphereGeometry(0.065, 12, 8),
          accent,
          0.19,
          0.29,
          0.3,
          device,
        );
        mesh(
          new T.SphereGeometry(0.065, 12, 8),
          accent,
          0.3,
          0.29,
          0.19,
          device,
        );
      } else if (eraIndex === 1) {
        box(1.13, 0.2, 0.57, dark, 0, 0.15, 0);
        const l = box(0.42, 0.25, 0.7, dark, -0.53, 0.1, 0.18);
        l.rotation.y = 0.25;
        const r = box(0.42, 0.25, 0.7, dark, 0.53, 0.1, 0.18);
        r.rotation.y = -0.25;
        cylinder(0.12, 0.12, metal, -0.29, 0.31, 0.02);
        cylinder(0.12, 0.12, metal, 0.24, 0.31, 0.18);
        buttons(0.39, 0.29, -0.12);
        ball(0.075, glow, 0, 0.28, -0.12);
      } else if (eraIndex === 2) {
        box(1.95, 0.17, 0.84, dark, 0, 0.1, 0);
        box(1.25, 0.025, 0.69, material("#243b43", 0.2), 0, 0.2, 0);
        box(0.25, 0.19, 0.85, accent, -0.92, 0.11, 0);
        box(0.25, 0.19, 0.85, metal, 0.92, 0.11, 0);
        cylinder(0.075, 0.045, paper, -0.91, 0.23, -0.2);
        cylinder(0.075, 0.045, dark, 0.91, 0.23, 0.2);
        for (let j = 0; j < 4; j++)
          box(
            0.16,
            0.01,
            0.12,
            j % 2 ? accent : glow,
            -0.35 + j * 0.22,
            0.22,
            Math.sin(j * 1.3) * 0.2,
          );
      } else {
        cylinder(0.49, 0.09, metal, 0, 0.06, 0);
        const hoop = ring(0.58, 0.035, glow, 0, 0.49, 0);
        hoop.rotation.x = -Math.PI / 3;
        const inner = ring(0.4, 0.012, accent, 0, 0.49, 0);
        inner.rotation.x = -Math.PI / 3;
        ball(0.14, hologram, 0, 0.48, 0);
        box(0.2, 0.075, 0.34, metal, -0.63, 0.3, 0.16);
        box(0.2, 0.075, 0.34, metal, 0.63, 0.3, 0.16);
      }
      break;
    }
    case "journal": {
      if (eraIndex === 0) {
        box(1.02, 0.18, 1.35, accent, 0, 0.09, 0);
        box(0.95, 0.09, 1.26, paper, 0.02, 0.1, 0);
        box(1.02, 0.035, 1.35, accent, 0, 0.2, 0);
        box(0.31, 0.015, 0.45, paper, 0, 0.225, -0.1);
        const pencil = cylinder(
          0.025,
          1.25,
          material("#d4ad59"),
          0.72,
          0.08,
          0,
        );
        pencil.rotation.x = Math.PI / 2;
        pencil.rotation.z = -0.15;
      } else if (eraIndex === 1) {
        for (const side of [-1, 1]) {
          const page = box(0.74, 0.1, 1.21, paper, side * 0.4, 0.1, 0);
          page.rotation.z = side * -0.075;
          for (let j = 0; j < 7; j++)
            box(0.54, 0.013, 0.012, metal, side * 0.4, 0.19, -0.42 + j * 0.13);
        }
        box(0.07, 0.18, 1.24, accent, 0, 0.08, 0);
        box(0.04, 0.025, 0.65, accent, 0.3, 0.23, 0.51);
      } else if (eraIndex === 2) {
        const tablet = new T.Group();
        tablet.rotation.x = -0.22;
        root.add(tablet);
        box(1.02, 0.06, 1.41, metal, 0, 0.12, 0, tablet);
        box(0.91, 0.015, 1.23, dark, 0, 0.16, 0, tablet);
        for (let j = 0; j < 8; j++)
          box(
            j === 0 ? 0.43 : 0.7,
            0.012,
            0.019,
            j === 0 ? accent : paper,
            -0.02,
            0.18,
            -0.4 + j * 0.115,
            tablet,
          );
        const stylus = cylinder(0.02, 1.15, paper, 0.7, 0.1, 0);
        stylus.rotation.x = Math.PI / 2;
      } else {
        cylinder(0.41, 0.06, metal, 0, 0.03, 0);
        for (let j = 0; j < 3; j++) {
          const page = box(
            0.92,
            0.025,
            1.18,
            hologram,
            j * 0.15 - 0.15,
            0.28 + j * 0.16,
            -j * 0.13,
          );
          page.rotation.y = j * 0.13;
          for (let n = 0; n < 4; n++)
            box(
              0.62,
              0.013,
              0.016,
              glow,
              j * 0.15 - 0.15,
              0.3 + j * 0.16,
              -j * 0.13 - 0.3 + n * 0.18,
            );
        }
      }
      break;
    }
    case "food": {
      const coffee = material("#4e2e21", 0.26);
      if (eraIndex < 2) {
        const enamel = eraIndex === 0;
        cylinder(0.47, 0.035, paper, 0, 0.015, 0);
        cylinder(
          0.29,
          enamel ? 0.55 : 0.45,
          enamel ? accent : paper,
          0,
          enamel ? 0.31 : 0.26,
          0,
          enamel ? 0.31 : 0.36,
        );
        const rim = ring(
          enamel ? 0.31 : 0.36,
          0.025,
          enamel ? metal : paper,
          0,
          enamel ? 0.59 : 0.49,
          0,
        );
        rim.rotation.x = Math.PI / 2;
        cylinder(
          enamel ? 0.275 : 0.32,
          0.012,
          coffee,
          0,
          enamel ? 0.585 : 0.48,
          0,
        );
        ring(
          0.19,
          enamel ? 0.035 : 0.065,
          enamel ? metal : paper,
          0.35,
          0.31,
          0,
        );
      } else if (eraIndex === 2) {
        const glass = new T.MeshPhysicalMaterial({
          color: palette.paper,
          transparent: true,
          opacity: 0.38,
          metalness: 0.05,
          roughness: 0.1,
          side: T.DoubleSide,
          depthWrite: false,
        });
        mesh(
          new T.CylinderGeometry(0.3, 0.27, 0.66, 32, 1, true),
          glass,
          0,
          0.35,
          0,
        );
        cylinder(0.26, 0.42, coffee, 0, 0.24, 0, 0.285);
        cylinder(0.28, 0.015, paper, 0, 0.46, 0);
        const rim = ring(0.3, 0.017, metal, 0, 0.69, 0);
        rim.rotation.x = Math.PI / 2;
        cylinder(0.38, 0.035, metal, 0, 0.015, 0);
      } else {
        cylinder(0.46, 0.065, metal, 0, 0.03, 0);
        const light = ring(0.34, 0.024, glow, 0, 0.1, 0);
        light.rotation.x = Math.PI / 2;
        cylinder(0.18, 0.44, hologram, 0, 0.56, 0, 0.34);
        const rim = ring(0.34, 0.022, glow, 0, 0.78, 0);
        rim.rotation.x = Math.PI / 2;
        cylinder(0.28, 0.015, coffee, 0, 0.72, 0);
        for (let j = 0; j < 3; j++)
          ball(
            0.025,
            glow,
            Math.cos(j * 2) * 0.25,
            0.25,
            Math.sin(j * 2) * 0.25,
          );
      }
      break;
    }
    case "places": {
      const r = 0.5;
      if (eraIndex === 0) {
        const globe = ball(r, paper, 0, 0.62, 0, 8);
        globe.rotation.z = -0.25;
        const wire = new T.LineSegments(
          new T.WireframeGeometry(new T.SphereGeometry(r + 0.004, 8, 5)),
          new T.LineBasicMaterial({ color: palette.accent }),
        );
        wire.position.y = 0.62;
        root.add(wire);
        for (let j = 0; j < 4; j++) {
          const land = mesh(
            new T.IcosahedronGeometry(0.13 + j * 0.02),
            accent,
            Math.cos(j * 1.7) * 0.36,
            0.65 + Math.sin(j * 1.7) * 0.2,
            0.31,
          );
          land.scale.z = 0.25;
        }
        box(0.62, 0.045, 0.47, paper, 0, 0.01, 0);
      } else {
        const body = ball(
          r,
          eraIndex === 1
            ? material("#a89d65")
            : eraIndex === 2
              ? dark
              : hologram,
          0,
          0.66,
          0,
        );
        if (eraIndex < 3) {
          for (let j = 0; j < 5; j++) {
            const land = mesh(
              new T.IcosahedronGeometry(0.14 + (j % 3) * 0.04),
              eraIndex === 1 ? material("#6d7851") : accent,
              Math.sin(j * 1.8) * 0.34,
              0.68 + Math.cos(j * 1.8) * 0.21,
              0.31,
            );
            land.scale.z = 0.24;
          }
        }
        const wire = new T.LineSegments(
          new T.WireframeGeometry(new T.SphereGeometry(r + 0.008, 16, 9)),
          new T.LineBasicMaterial({
            color: palette.light,
            transparent: true,
            opacity: eraIndex === 1 ? 0.25 : 0.65,
          }),
        );
        body.add(wire);
        const meridian = ring(
          0.61,
          0.022,
          eraIndex === 1 ? metal : glow,
          0,
          0.66,
          0,
        );
        meridian.rotation.z = -0.3;
        if (eraIndex === 3) {
          const orbit = ring(0.75, 0.014, glow, 0, 0.66, 0);
          orbit.rotation.x = 1.15;
          ball(0.06, glow, 0.72, 0.85, 0);
        }
      }
      cylinder(0.31, 0.07, eraIndex === 0 ? paper : metal, 0, 0.05, 0);
      if (eraIndex < 3) box(0.06, 0.23, 0.06, metal, 0, 0.17, 0);
      else {
        const base = ring(0.24, 0.025, glow, 0, 0.14, 0);
        base.rotation.x = Math.PI / 2;
      }
      break;
    }
  }
  root.userData.temporalId = id;
  return root;
}
