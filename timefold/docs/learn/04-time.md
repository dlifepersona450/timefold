[Docs home](../README.md) · [Learning path](README.md) · Previous: [diorama](03-diorama.md) · Next: [interaction](05-interaction.md)

# 4. Make time a shared data coordinate

Begin with data before animation. A timeline needs clear answers to three questions: which authored snapshot is nearest, what calendar value lies between snapshots, and what visual state should approach the requested time?

## Separate configuration from memory

`eras[i]` describes appearance and atmosphere. `eraContent[i]` describes what each object remembers. The shared index links them. Stable object IDs describe categories, not dates or individual projects.

A small learning example is:

```ts
const years = [1998, 2012, 2026, 2056];
const progress = 0.5;
const position = progress * (years.length - 1);
const fromIndex = Math.min(years.length - 2, Math.floor(position));
const toIndex = fromIndex + 1;
const blend = position - fromIndex;
const year = Math.round(
  years[fromIndex] + (years[toIndex] - years[fromIndex]) * blend,
);
```

The answer is 2019. The chapters have equal spatial/control spacing, not equal calendar durations. The last 30-year gap advances faster than each earlier 14-year gap.

The full sampler adds finite-input clamping, nearest content index, age, decorative wavelength cue, and complete theme interpolation. [The timeline reference](../reference/timeline.md) explains every binding and boundary condition.

## Preserve the final endpoint

At progress 1, there is no “next” chapter beyond the last. Capping `fromIndex` at the penultimate entry and using `blend = 1` avoids an out-of-range access. Keep at least two eras unless you add explicit zero/one-era cases.

## Distinguish target and current time

The controller receives slider/wheel/year input immediately. `scene/animation.ts` stores that as `targetTime`, then eases `currentTime` toward it:

```ts
const alpha = 1 - Math.exp(-speed * dt);
current += (target - current) * alpha;
```

`dt` is elapsed seconds. `scene/lifecycle.ts` initializes the first step explicitly, clamps subsequent steps into `[0, 0.05]`, and resets the timestamp when returning from a hidden tab. A negative first-frame delta can reverse interpolation; a long hidden-tab interval can make the camera jump. These clock boundaries prevent both cases.

Reduced motion uses a snap rather than this approach. Do not add decorative movement that ignores the same preference.

The scene's `damp` helper snaps sufficiently small differences to the exact target. Without that final epsilon, an exponential approach would remain mathematically unfinished forever and a demand-driven renderer could keep scheduling frames for imperceptible changes. When ambient motion is disabled and no transition remains, the lifecycle stops requesting frames until the view is invalidated.

The DOM has a separate scheduling boundary: `ui/timeline-view.ts` stores the latest sample and paints at most once per requested frame, keeping rapid wheel/slider events from repeating all DOM writes. It updates chapter-only labels when the nearest chapter changes. A dialog opening calls `flush` so its labels, content, and selected controls agree immediately.

## Derive spatial position

Chapter `i` sits at `FIRST_ROOM_Z - i * ROOM_SPACING`. Travelling camera offsets use the corresponding fractional chapter position. The camera does not use calendar year directly; it uses normalized chapter progress. This avoids making a 30-year gap physically twice as long unless you deliberately design that behavior.

The world folds the outgoing archive display toward its floor anchor with `1 - smoothstep(roomTime - room, 0.15, 0.85)`, then hides it at zero scale. Reverse travel unfolds it. Architecture remains full size. This avoids a sudden disappearance halfway through a journey and prevents old props blocking the next chapter. The corresponding logic and named retirement thresholds are in `scene/animation.ts` and `scene/settings.ts`; placement originates in `scene/build.ts`.

## Let palette endpoints tell the story

Each era has a complete theme. The interface mixes RGB channel bytes for CSS variables; Three.js mixes its color objects for lights/fog. Room materials retain their own authored colors. Both systems share endpoints, not a single physical wavelength shader.

The palette progresses from brown/red through amber/yellow and white/grey into blue/black. The redshift/blueshift connection is a metaphor. Read [the reference/source explanation](../reference/references.md) before presenting it as science.

## Authored forms remain snapshots

A CRT and holographic workstation are different groups in different rooms. The person has discrete age/stage costumes. The continuity comes from travel, lighting, folds, and shared identity—not automatic mesh aging or clothing generation.

Try changing one year and compare its numeric age expressions, notes, object labels, and memories. [Timeline authoring](../TIMELINE.md) lists every place that prose/config must remain consistent.
