/** World units and animation rates. Calendar years and palettes belong in archive.ts. */
export const SCENE_SETTINGS = {
  maxPixelRatio: 1.5,
  mobileBreakpoint: 700,
  fogDensity: 0.022,
  timeDamping: 5,
  cameraDamping: 6,
  hoverDamping: 10,
  timeEpsilon: 0.00002,
  positionEpsilon: 0.001,
  scaleEpsilon: 0.0001,
  hoverScale: 1.045,
  shadowInterval: 1 / 12,
  shadowDistance: 0.25,
  displayRetireStart: 0.15,
  displayRetireEnd: 0.85,
  clickDistance: 8,
} as const;
