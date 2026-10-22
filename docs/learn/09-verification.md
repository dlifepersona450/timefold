[Docs home](../README.md) · [Learning path](README.md) · Previous: [content](08-content-and-assets.md)

# 9. Verify changes and maintain the manual

This project currently has build/type checks and documentation tooling, plus a documented browser review procedure. It does not contain a permanent automated Playwright regression suite. Prior implementation checks do not guarantee a future edit works; rerun checks appropriate to what changed.

## Source and production checks

```bash
npm run docs:generate
npm run docs:check
npm run build
npm run preview
```

Generation updates indexes, not explanatory prose. Edit the affected semantic page before regeneration. A successful build means TypeScript checking and Vite bundling completed; it is not proof that a camera is well framed or a URL exists.

## Browser checks by feature

| Change | Verify |
| --- | --- |
| Content/resource | Correct chapter/category, title/date/status, link destination, progress, historical state |
| Gallery | First image, alt text, every thumbnail, previous/next wrap, stage switch |
| Timeline | Endpoints, year buttons, pixel/line/page wheel input, drag/swipe/arrows, between-year age/readout, four distinct palettes, no label/content mismatch after rapid input |
| Geometry | Silhouette, clipping, shadows, hover/click root, stable edges, focus/return, outgoing display folds smoothly and unfolds on reverse travel |
| Person | Every age/stage/outfit, head/feet visibility, skin/hair colors, matching portrait, focus target |
| Game | Walls/bounds, three single collections, exit condition, restart, keys/buttons, cleanup after closing |
| Dialog/UI | Keyboard focus, Escape, close/backdrop, index navigation, readable text, narrow/short viewports |
| Preferences | Reduced-motion snap/settled idle, ambient-motion toggle, sound on/off/unavailable, hidden-page rendering/audio pause and smooth resume |
| Lifecycle | Hot reload removes old input/audio/panel listeners, cancels pending paints/timeouts, and releases the old scene |
| Rendering failure | DOM archive index still opens all seven categories when WebGL cannot initialize |

Try at least a desktop viewport and a narrow phone-sized viewport. The canvas can render successfully while a prior room's props obscure the current one; visual review is necessary in addition to “no JavaScript errors.”

## Wait for actual rendering in browser automation

A click updates requested time before the next WebGL frame updates camera matrices. Fixed sleeps can be unreliable on slow software renderers. If adding automation, awaiting browser frames lets queued UI and scene work advance:

```js
await page.evaluate(() => new Promise(resolve => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
}));
```

This snippet belongs in an external browser-test environment with a `page` object; it is not an API exported by TIMEFOLD. Two browser frames do not guarantee that an ambient-motion camera has completed its damped journey. For an exact static framing/picking check, disable ambient motion, request the era, and wait for the resulting render; for motion checks, observe the transition and its final state rather than treating this snippet as a settling promise.

Prefer accessible DOM controls for content tests and use actual canvas clicks for a smaller set of picking checks. `World.getDiagnostics()` reports copied rendering counters for isolated world studies; it is not attached to `window` by the application. The [performance reference](../reference/performance.md) explains how to create a controlled study, compare counter differences, and verify that a settled reduced-motion view stops rendering. Do not mistake software-renderer latency or fewer draw calls for a measured FPS guarantee.

## Refresh dependency evidence when needed

After an intentional dependency update:

```bash
npm run docs:licenses
npm run docs:generate
npm run docs:check
npm run build
```

The license audit records installed-platform evidence and lock-only variants. It does not fetch missing platforms or prove rights over every internal file. Inspect changed notices, update provenance/versions, and refresh the exact public Three.js license after upgrading that runtime.

## Verify shipped notices

After building, these files should exist:

```text
dist/licenses/three-LICENSE.txt
dist/licenses/README.txt
dist/fonts/dm-sans-OFL.txt
dist/fonts/ibm-plex-mono-OFL.txt
dist/fonts/instrument-serif-OFL.txt
```

Source-distribution notices also live in the repository root and `docs/rights/`. Do not rely on a minifier preserving permission comments inside a JS chunk.

## Documentation checks and limits

`docs:check` verifies local inline-link targets/Markdown headings, required reference pages, source fingerprints, and the file index. It reports declaration counts from the generated AST record. It does not crawl external links, decide whether prose is true, validate visual contrast, or provide legal clearance.

The exact script behavior, every helper/local binding, output fields, and failure cases are explained in [tooling](../reference/tooling.md). When changing the generator/checker itself, regenerate once more so their own symbol pages and fingerprints are current.

When changing a module boundary, update [the architecture graph](../architecture/README.md), [file map](../architecture/files.md), and [reference library](../reference/README.md) as well as its semantic page. Source indexes now include nested `src/ui/` and `src/scene/` modules, so moving a function requires regeneration even if its visible behavior stays the same. Refresh the [showcase screenshots](../showcase/README.md) when the documented visual result changes.

## Troubleshooting

| Symptom | First checks |
| --- | --- |
| Blank/unstyled page | Correct server URL, browser console, network paths, module import errors |
| Archive works but room does not | WebGL capability/renderer initialization, console, graphics drivers; use fallback index |
| Wrong memory/year | `eras`/`eraContent` index alignment and stage selection |
| Numbers wrong between years | Numeric year strings, age expressions, sampler interval semantics |
| Theme stays green or only partly changes | CSS cascade/custom-property overrides, full theme fields, hardcoded material colors |
| Object visible but not clickable | Overlay pointer events, canvas sizing/NDC conversion, root metadata, room visibility, wait for frame |
| Old props cover current room | Archive-display retirement scale, timeline endpoints, root anchoring; architecture should remain full size |
| Clothing detail invisible | Surface Z offset versus torso depth, view angle, material contrast |
| Game reacts after closing | Ensure returned cleanup is invoked before replacing panel HTML |
| Duplicate response after hot reload | AbortController ownership, panel `clear`, audio/world disposal, outstanding RAF/timeouts |
| A linked asset is missing | Public-relative URL, filename case, built copy, external destination availability |
| Docs report stale hashes | Update explanation, rerun generation, then checker; do not hand-edit hashes |
| Docs report broken navigation | Fix actual path/heading, regenerate if inventory changed, rerun checker |

The documented current limits are collected in [contracts](../architecture/contracts.md); changing a prototype assumption is an implementation task, not a documentation-only toggle.
