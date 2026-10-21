[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

# `src/timeline.ts` — time sampling and palette math

Source: [`src/timeline.ts`](../../src/timeline.ts). Every declaration and callback: [symbol inventory](../generated/symbols/timeline.md).

This module is mostly pure arithmetic. It imports `eras` and the `EraTheme` type. It does not move a camera, create DOM, read the clock, or fetch historical information. The UI calls its sampler; the world imports spatial constants and independently interpolates its own rendering state.

## Constants and module bindings

| Name | Initial value | Meaning |
| --- | --- | --- |
| `ROOM_SPACING` | `16` | Z-distance between adjacent room centers |
| `FIRST_ROOM_Z` | `-5` | First room center Z |
| `chapterCount` | `eras.length - 1` | Number of intervals, despite the name; four eras produce three intervals |

`chapterCount` is computed when imported. Editing source and reloading recomputes it. Mutating the era array at runtime is not a supported reactive update.

## `clampTime(value)`

Input: numeric normalized progress. Output: a finite value within `[0, 1]`.

The function first uses `Number.isFinite(value)`. A nonfinite value becomes zero, including `NaN` and infinity; finite values are clamped with `Math.min`/`Math.max`. It does not coerce a string into a number. Its only local binding is parameter `value`; there are no side effects.

Examples: `clampTime(-0.2) → 0`, `clampTime(0.4) → 0.4`, `clampTime(2) → 1`, `clampTime(NaN) → 0`.

The world has its own `MathUtils.clamp` path; callers should continue supplying valid normalized values rather than relying on every subsystem to handle malformed input identically.

## `timeForEra(index)`

Input: a chapter index, normally an integer from `0` through `chapterCount`. Output: clamped index divided by interval count.

For four eras, the anchors are `0`, `1/3`, `2/3`, and `1`. It clamps range but does not round fractional indices or guard all nonfinite input. It expects at least two eras so division has a nonzero denominator. UI buttons supply actual integer indices.

The function is used by year buttons, arrow navigation, object opening, and detail-stage controls. It converts authored chapter identity back to normalized timeline input.

## Private `mixHex(a, b, t)`

Input: two `#RRGGBB` strings and a blend factor, normally within `[0, 1]`. Output: a lowercase six-digit `#rrggbb` string.

1. `av` and `bv` parse each string without `#` as base-16 integers.
2. Local arrow `channel(shift)` extracts an 8-bit channel using right shift and `& 255`.
3. It computes `round(aChannel * (1 - t) + bChannel * t)`.
4. It converts the result to base 16 and left-pads to two characters.
5. Shifts `16`, `8`, and `0` reconstruct red, green, and blue.

`a`, `b`, `t`, `av`, `bv`, `channel`, and its `shift` parameter are all the function's bindings. There is no CSS parser, color-space conversion, alpha support, named-color support, or wavelength-to-RGB calculation.

The sampler supplies a valid blend. Calling this helper with short hex or invalid text would not be validated into a useful color. Three.js `Color` internally handles color spaces differently, so intermediate CSS and WebGL colors share endpoints without promising identical numerical rendering.

## `sampleTimeline(value)`

### Step-by-step calculation

Let `N = eras.length - 1` and `p = clampTime(value)`.

1. `progress = p`.
2. `position = p * N` is the chapter-space coordinate.
3. `fromIndex = min(N - 1, floor(position))` chooses the start of an adjacent pair.
4. `toIndex = fromIndex + 1` chooses its end.
5. `blend = position - fromIndex` is interpolation inside that pair.
6. `from` and `to` reference those two era records.
7. `theme` enumerates the first record's theme keys and calls `mixHex` for each corresponding color.
8. Nearest authored content index is `round(position)`.
9. Calendar year, numeric age, and decorative wavelength cue use rounded linear interpolation between endpoints.

At `p = 1`, `position = N`, but `fromIndex` is capped at `N - 1`; therefore the final pair is valid and `blend = 1`. This avoids reading a nonexistent next era.

### Every local and callback binding

| Binding | Purpose |
| --- | --- |
| `value` | Caller-supplied normalized input |
| `progress` | Clamped normalized input |
| `position` | Fractional chapter-space coordinate |
| `fromIndex`, `toIndex` | Adjacent valid array positions |
| `blend` | Position within that pair |
| `from`, `to` | References to era records |
| `theme` | Newly constructed mixed theme object |
| `.map` callback `key` | One `EraTheme` property name used to read/mix corresponding colors |

`Object.fromEntries` constructs a new object. The `as unknown as EraTheme` assertion tells TypeScript its intended shape; it does not perform runtime validation. Matching complete themes are a data contract.

### Return contract

| Field | Meaning | Current consumer |
| --- | --- | --- |
| `progress` | Normalized clamped input | Controller stores `timelineProgress`, sends it to world |
| `fromIndex`, `toIndex`, `blend` | Adjacent sampling state | Available to extensions/debugging; not every field is rendered |
| `index` | Nearest authored chapter | Controller's `selectedEra` and content choice |
| `year` | Rounded interpolated calendar year | Timeline year label and accessible range description |
| `age` | Rounded interpolated age | Traveller readout and accessible description |
| `wavelengthNm` | Rounded authored visual cue | Small color-study label |
| `theme` | All interpolated CSS theme colors | `ui/timeline-view.ts` writes custom properties and meta theme color during a batched paint |

### Worked example

At `value = 0.5` with four eras:

```text
N = 3
position = 1.5
fromIndex = 1 (2012, age 24)
toIndex = 2   (2026, age 38)
blend = 0.5
index = 2    (nearest snapshot; Math.round chooses the later index at halfway)
year = round(2012 + 14 × 0.5) = 2019
age = round(24 + 14 × 0.5) = 31
wavelengthNm = round(610 + (540 - 610) × 0.5) = 575
```

The index can select a 2026 room label while the interpolated calendar reads 2019. That is a deliberate distinction between chapter selection and the between-chapter readout. Opening an object then snaps to the selected chapter anchor.

## Spatial linkage

Room `i` is centered at `FIRST_ROOM_Z - i * ROOM_SPACING`. The world computes the negative travelling offset `z = -currentTime * (eras.length - 1) * ROOM_SPACING`. Camera Z is its overview offset plus `z`, moving deeper along negative Z as time increases. Changing spacing in the shared constants changes both room spacing and journey length, but camera framing and surrounding architecture still deserve a visual review.

## What must remain true

There must be at least two complete eras; indices/content must align; years must be numeric; every theme must have matching six-digit-hex fields. Values are authored snapshots, not measured time coordinates. No browser date or timezone enters the calculation.

See [contracts](../architecture/contracts.md), [timeline editing](../TIMELINE.md), [world interpolation](world.md), and [controller state](interface.md).
