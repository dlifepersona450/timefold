[Docs home](../README.md) · [Architecture](../architecture/README.md)

# Exact import linkage

This table is generated from static import declarations. CSS side effects are included. Browser APIs and the `vite/client` triple-slash type directive are described in the [build reference](../reference/build.md); dynamic event/data relationships are in [runtime flow](../architecture/runtime.md).

| Importing file | Module | Imported bindings |
|---|---|
| [src/game.ts](../../src/game.ts) | `./archive` | `type { EraTheme }` |
| [src/main.ts](../../src/main.ts) | `./style.css` | `side effects` |
| [src/main.ts](../../src/main.ts) | `./archive` | `{ eras, type ArchiveId }` |
| [src/main.ts](../../src/main.ts) | `./audio` | `{ mountAmbientAudio }` |
| [src/main.ts](../../src/main.ts) | `./timeline` | `{ chapterCount, sampleTimeline, timeForEra }` |
| [src/main.ts](../../src/main.ts) | `./world` | `{ createWorld, type World }` |
| [src/main.ts](../../src/main.ts) | `./ui/detail` | `{ createDetailView }` |
| [src/main.ts](../../src/main.ts) | `./ui/dom` | `{ collectInterfaceElements, requireElement }` |
| [src/main.ts](../../src/main.ts) | `./ui/format` | `{ escapeText }` |
| [src/main.ts](../../src/main.ts) | `./ui/shell` | `{ renderShell }` |
| [src/main.ts](../../src/main.ts) | `./ui/timeline-view` | `{ createTimelineView }` |
| [src/person.ts](../../src/person.ts) | `three` | `* as T` |
| [src/portrait.ts](../../src/portrait.ts) | `./archive` | `type { PersonState }` |
| [src/scene/animation.ts](../../src/scene/animation.ts) | `three` | `* as T` |
| [src/scene/animation.ts](../../src/scene/animation.ts) | `../archive` | `{ eras, type ArchiveId }` |
| [src/scene/animation.ts](../../src/scene/animation.ts) | `../timeline` | `{ clampTime, ROOM_SPACING }` |
| [src/scene/animation.ts](../../src/scene/animation.ts) | `./hypercube` | `{ updateHypercube }` |
| [src/scene/animation.ts](../../src/scene/animation.ts) | `./settings` | `{ SCENE_SETTINGS as SETTINGS }` |
| [src/scene/animation.ts](../../src/scene/animation.ts) | `./types` | `type { PickTarget, SceneGraph }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `three` | `* as T` |
| [src/scene/build.ts](../../src/scene/build.ts) | `../art` | `{ landscape }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `../archive` | `{ eras, eraContent }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `../timeline` | `{ FIRST_ROOM_Z, ROOM_SPACING }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `../temporal-objects` | `{ createTemporalObject, type TemporalObjectId }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `../person` | `{ createPerson }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `./hypercube` | `{ createHypercube }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `./merge-static` | `{ mergeStaticMeshes }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `./settings` | `{ SCENE_SETTINGS }` |
| [src/scene/build.ts](../../src/scene/build.ts) | `./types` | `type { FloatingElement, PickTarget, SceneGraph }` |
| [src/scene/hypercube.ts](../../src/scene/hypercube.ts) | `three` | `* as T` |
| [src/scene/lifecycle.ts](../../src/scene/lifecycle.ts) | `three` | `* as T` |
| [src/scene/lifecycle.ts](../../src/scene/lifecycle.ts) | `./animation` | `type { createSceneAnimation }` |
| [src/scene/lifecycle.ts](../../src/scene/lifecycle.ts) | `./settings` | `{ SCENE_SETTINGS }` |
| [src/scene/lifecycle.ts](../../src/scene/lifecycle.ts) | `./types` | `type { SceneGraph, WorldDiagnostics }` |
| [src/scene/merge-static.ts](../../src/scene/merge-static.ts) | `three` | `* as T` |
| [src/scene/merge-static.ts](../../src/scene/merge-static.ts) | `three/addons/utils/BufferGeometryUtils.js` | `{ mergeGeometries }` |
| [src/scene/picking.ts](../../src/scene/picking.ts) | `three` | `* as T` |
| [src/scene/picking.ts](../../src/scene/picking.ts) | `../archive` | `type { ArchiveId }` |
| [src/scene/picking.ts](../../src/scene/picking.ts) | `./settings` | `{ SCENE_SETTINGS }` |
| [src/scene/picking.ts](../../src/scene/picking.ts) | `./types` | `type { PickTarget, SceneGraph }` |
| [src/scene/types.ts](../../src/scene/types.ts) | `three` | `type * as T` |
| [src/scene/types.ts](../../src/scene/types.ts) | `../archive` | `type { ArchiveId }` |
| [src/scene/types.ts](../../src/scene/types.ts) | `./hypercube` | `type { Hypercube }` |
| [src/temporal-objects.ts](../../src/temporal-objects.ts) | `three` | `* as T` |
| [src/timeline.ts](../../src/timeline.ts) | `./archive` | `{ eras, type EraTheme }` |
| [src/ui/detail.ts](../../src/ui/detail.ts) | `../archive` | `{ eraContent, eras, objects, type ArchiveId }` |
| [src/ui/detail.ts](../../src/ui/detail.ts) | `../art` | `{ imageData }` |
| [src/ui/detail.ts](../../src/ui/detail.ts) | `./format` | `{ escapeText, twoDigits }` |
| [src/ui/detail.ts](../../src/ui/detail.ts) | `./panel-controls` | `{ mountPanelControls }` |
| [src/ui/detail.ts](../../src/ui/detail.ts) | `./panels` | `{ renderPanel, type PanelContext }` |
| [src/ui/detail.ts](../../src/ui/detail.ts) | `./resources` | `{ renderResources }` |
| [src/ui/panel-controls.ts](../../src/ui/panel-controls.ts) | `../archive` | `type { ArchiveId }` |
| [src/ui/panel-controls.ts](../../src/ui/panel-controls.ts) | `../game` | `{ mountGame }` |
| [src/ui/panel-controls.ts](../../src/ui/panel-controls.ts) | `./dom` | `{ requireElement }` |
| [src/ui/panel-controls.ts](../../src/ui/panel-controls.ts) | `./format` | `{ twoDigits }` |
| [src/ui/panel-controls.ts](../../src/ui/panel-controls.ts) | `./panels` | `type { PanelContext }` |
| [src/ui/panels.ts](../../src/ui/panels.ts) | `../archive` | `{ eras, type ArchiveId, type Era, type EraContent, type ObjectState }` |
| [src/ui/panels.ts](../../src/ui/panels.ts) | `../portrait` | `{ personPortrait }` |
| [src/ui/panels.ts](../../src/ui/panels.ts) | `./format` | `{ escapeText, twoDigits }` |
| [src/ui/resources.ts](../../src/ui/resources.ts) | `../archive` | `type { ArchiveResource }` |
| [src/ui/resources.ts](../../src/ui/resources.ts) | `./format` | `{ escapeText, safeResourceUrl }` |
| [src/ui/shell.ts](../../src/ui/shell.ts) | `../archive` | `{ eras, objects }` |
| [src/ui/shell.ts](../../src/ui/shell.ts) | `./format` | `{ escapeText, twoDigits }` |
| [src/ui/timeline-view.ts](../../src/ui/timeline-view.ts) | `../archive` | `{ eras, type ArchiveId }` |
| [src/ui/timeline-view.ts](../../src/ui/timeline-view.ts) | `../timeline` | `type { sampleTimeline }` |
| [src/ui/timeline-view.ts](../../src/ui/timeline-view.ts) | `./dom` | `type { InterfaceElements }` |
| [src/ui/timeline-view.ts](../../src/ui/timeline-view.ts) | `./format` | `{ twoDigits }` |
| [src/world.ts](../../src/world.ts) | `three` | `* as T` |
| [src/world.ts](../../src/world.ts) | `./archive` | `type { ArchiveId }` |
| [src/world.ts](../../src/world.ts) | `./scene/animation` | `{ createSceneAnimation }` |
| [src/world.ts](../../src/world.ts) | `./scene/build` | `{ buildScene }` |
| [src/world.ts](../../src/world.ts) | `./scene/lifecycle` | `{ createRenderer, createSceneLifecycle }` |
| [src/world.ts](../../src/world.ts) | `./scene/picking` | `{ createPicking }` |
| [src/world.ts](../../src/world.ts) | `./scene/types` | `type { WorldDiagnostics }` |
| [vite.config.ts](../../vite.config.ts) | `vite` | `{ defineConfig }` |
| [scripts/audit-licenses.mjs](../../scripts/audit-licenses.mjs) | `node:crypto` | `{ createHash }` |
| [scripts/audit-licenses.mjs](../../scripts/audit-licenses.mjs) | `node:fs` | `{ existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync }` |
| [scripts/audit-licenses.mjs](../../scripts/audit-licenses.mjs) | `node:path` | `{ dirname, join, relative }` |
| [scripts/audit-licenses.mjs](../../scripts/audit-licenses.mjs) | `node:url` | `{ fileURLToPath }` |
| [scripts/build-docs.mjs](../../scripts/build-docs.mjs) | `node:fs` | `fs` |
| [scripts/build-docs.mjs](../../scripts/build-docs.mjs) | `node:path` | `path` |
| [scripts/build-docs.mjs](../../scripts/build-docs.mjs) | `node:crypto` | `crypto` |
| [scripts/build-docs.mjs](../../scripts/build-docs.mjs) | `typescript` | `ts` |
| [scripts/check-docs.mjs](../../scripts/check-docs.mjs) | `node:fs` | `fs` |
| [scripts/check-docs.mjs](../../scripts/check-docs.mjs) | `node:path` | `path` |
| [scripts/check-docs.mjs](../../scripts/check-docs.mjs) | `node:crypto` | `crypto` |
