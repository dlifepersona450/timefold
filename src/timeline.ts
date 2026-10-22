import { eras, type EraTheme } from "./archive";

export const ROOM_SPACING = 16;
export const FIRST_ROOM_Z = -5;
export const chapterCount = eras.length - 1;
export const clampTime = (value: number) =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
export const timeForEra = (index: number) =>
  Math.max(0, Math.min(chapterCount, index)) / chapterCount;

function mixHex(a: string, b: string, t: number): string {
  const av = parseInt(a.slice(1), 16),
    bv = parseInt(b.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(((av >> shift) & 255) * (1 - t) + ((bv >> shift) & 255) * t)
      .toString(16)
      .padStart(2, "0");
  return "#" + channel(16) + channel(8) + channel(0);
}
// Equal chapter spacing, with actual calendar years interpolated inside each segment.
// The palette is art direction inspired by spectral shift, not a wavelength simulation.
export function sampleTimeline(value: number) {
  const progress = clampTime(value),
    position = progress * chapterCount;
  const fromIndex = Math.min(chapterCount - 1, Math.floor(position)),
    toIndex = fromIndex + 1,
    blend = position - fromIndex;
  const from = eras[fromIndex],
    to = eras[toIndex];
  const theme = Object.fromEntries(
    (Object.keys(from.theme) as (keyof EraTheme)[]).map((key) => [
      key,
      mixHex(from.theme[key], to.theme[key], blend),
    ]),
  ) as unknown as EraTheme;
  return {
    progress,
    fromIndex,
    toIndex,
    blend,
    index: Math.round(position),
    year: Math.round(
      Number(from.year) + (Number(to.year) - Number(from.year)) * blend,
    ),
    age: Math.round(
      from.person.age + (to.person.age - from.person.age) * blend,
    ),
    wavelengthNm: Math.round(
      from.spectralNm + (to.spectralNm - from.spectralNm) * blend,
    ),
    theme,
  };
}
