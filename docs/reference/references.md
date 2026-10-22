# References and further learning

[Documentation home](../README.md) · [Architecture](../architecture/README.md) · [Rights guide](../rights/README.md) · [Asset sources](../../ASSET_SOURCES.md)

This register separates **inspiration**, **technical learning references**, and **the sources of actual bundled files**. The principal project, license, inspiration, and physics sources were checked on **21 October 2026**; a row records limitations where relevant. The additional API links are a learning directory, not an archived copy or guarantee of future availability. A useful learning link does not imply code was copied from its examples or that it was historically consulted while the first prototype was written. The local source and [dependency/asset records](../../ASSET_SOURCES.md) identify what actually ships.

## Visual and narrative direction from the brief

| Reference | Link / verification | What it informs here | What it does not provide |
| --- | --- | --- | --- |
| Rachel Wei's portfolio | [rachelqrwei.ca](https://rachelqrwei.ca/) — official portfolio URL supplied by the user; site responds, but its interactive content was not available as readable page text to the audit tool | A personal archive approached as interactive objects/dioramas, named in the original brief | No code, screenshot, model, texture, exact layout, or license was obtained from it |
| Blink Industries | [Official studio site](https://www.blinkindustries.tv/) — studio reference verified; the prompt did not name a particular project/page | The user's general direction toward isometric miniature rooms | No specific isometric artwork is attributed as a source; no studio asset or copying permission is included |
| Interstellar (2014) | [Official Paramount film page](https://www.paramount.com/movies/interstellar) — identifies the film and its credits | A cultural reference for treating time as something spatial and emotionally personal | No movie still, dialogue, soundtrack, film model, branded costume, or recreation of a specific scene is included |
| Backrooms / liminal-space imagery | General cultural direction supplied by the user; no specific original work, image, author, or source URL supplied | Empty repetition, thresholds, corridors, suspended time, contemplative uncertainty | This is not a provenance claim about an individual original backrooms photograph or story. No community image, named entity, game map, or film sequence is bundled |
| The Folded Worlds + TIMEFOLD concepts | User's brief in this project conversation; consolidated in [CONCEPT.md](../../CONCEPT.md) | Pseudo-4D timeline as the surrounding space; 2.5D interactive life objects inside each era | Not a third-party asset pack or license grant for unrelated works mentioned in the brief |

Credits acknowledge direction. They do not claim affiliation or endorsement and do not substitute for permission to reproduce a creative work. Keep later references just as specific: identify the actual author/work when one is used, and record whether it is merely a link or an embedded asset.

### Image reference from the original brief

The prompt linked an abstract iridescent liquid/ribbon image with a descriptive caption. Its exact supplied URL is preserved here for traceability:

```text
https://images.openai.com/static-rsc-4/SQjMWzg6gunhd9MWiZ2SfOLOmaZ4We00xWbZP6u77X1kqx9jW6DIKGto1n8o4r5hjYYy0pXkqcaGpBZL0YYYAfJvv9XLUtSSmqehn9EinsXxnNdzKMhP2_Y2--EhLC5DQf2xou_c0FIJ1IpQ0jpPUJsOKltwwZEtm6TsnH9RHz7idk_UeoQykvB__WsDlZ7G?purpose=inline
```

That hosted image is **reference-only**: no image file was downloaded into `public/`, no texture uses it, and the app does not request it. The URL/caption alone does not establish the creator, original source, or reuse license. The prototype's illustrations come from `src/art.ts`, and its geometric objects come from local mesh-building functions. If that reference image is ever to become an actual asset, establish and record the applicable rights first.

## Color and physics: the boundary of the metaphor

[NASA: Doppler Shift of a Star's Spectrum](https://science.nasa.gov/asset/webb/doppler-shift-of-a-stars-spectrum/) explains how relative motion changes observed spectral wavelengths: approaching motion produces shorter/bluer wavelengths; receding motion produces longer/redder wavelengths. The page's illustration is credited to NASA, ESA, CSA, and Leah Hustak (STScI); it is **linked, not embedded** in this project.

TIMEFOLD maps an early chapter to warm red/brown and a possible future to blue. This is an authored design metaphor, not a physical conclusion from the NASA example. The temporal values in `src/archive.ts` and interpolation in `src/timeline.ts` do not calculate a light source's physical Doppler shift, the universe's history, or a physically accurate visible spectrum. `spectralNm` is a display cue independent of the authored room/HTML color palette. Read [CONCEPT.md](../../CONCEPT.md#color-as-time) and [the timeline guide](../TIMELINE.md#edit-the-temporal-colors) alongside the code.

## Software actually used

The locked versions are **Three.js 0.180.0**, **Vite 7.3.7**, **TypeScript 5.9.3**, and **@types/three 0.180.0**. Use the [dependency guide](../rights/dependencies.md) to distinguish manifest version ranges from exact lockfile versions. Latest online docs can differ from this project's release; use release-specific code and Vite 7 docs when checking an API or build behavior.

| Subject | Official / first-party reference | Related implementation and what to learn |
| --- | --- | --- |
| Three.js overview | [Three.js manual, fundamentals](https://threejs.org/manual/en/fundamentals.html) | `world.ts` and `scene/`: scene, camera, renderer, mesh, light, and frame-lifecycle roles |
| Three.js API index | [Three.js API documentation](https://threejs.org/docs/) | Look up the exact classes/methods used in the source; the online index follows current releases |
| Release-specific implementation | [Three.js r180 source](https://github.com/mrdoob/three.js/tree/r180/src), [r180 docs files](https://github.com/mrdoob/three.js/tree/r180/docs) | Match behavior to the actual installed 0.180.0 release |
| Scene graph | [Three.js manual, scene graph](https://threejs.org/manual/en/scenegraph.html) | `scene/build.ts`, `person.ts`, `temporal-objects.ts`: parent/child transforms, local positions, groups |
| Camera and projection | [Three.js PerspectiveCamera docs](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) | Perspective projection, aspect ratio, field of view, camera approach/return |
| Materials | [Three.js manual, materials](https://threejs.org/manual/en/materials.html) | Distinguish lit standard materials from unlit texture/label materials |
| Lights | [Three.js manual, lights](https://threejs.org/manual/en/lights.html) | Room atmosphere, light color/intensity, shadow-producing lighting |
| Color management | [Three.js manual, color management](https://threejs.org/manual/en/color-management.html) | `CanvasTexture.colorSpace`, color input, renderer output; authored palette interpolation is separate from spectral physics |
| Shadows | [Three.js manual, shadows](https://threejs.org/manual/en/shadows.html) | Shadow maps, receiving/casting surfaces, performance tradeoffs |
| Raycasting | [Three.js Raycaster docs](https://threejs.org/docs/#api/en/core/Raycaster) | Pointer coordinates → camera ray → intersected object → `ArchiveId` → detail panel |
| Canvas textures | [Three.js manual, canvas textures](https://threejs.org/manual/en/canvas-textures.html) | `art.ts`/`scene/build.ts` and object labels: a local Canvas 2D drawing becomes a GPU texture |
| Resource cleanup | [Three.js manual, cleaning up](https://threejs.org/manual/en/cleanup.html) | `scene/lifecycle.ts` disposal of geometries, materials, textures, shadow targets, and renderer resources |
| Geometry | [Three.js manual, primitives](https://threejs.org/manual/en/primitives.html), [BufferGeometry docs](https://threejs.org/docs/#api/en/core/BufferGeometry) | Procedural object construction and moving point/line buffers |
| Math helpers | [Three.js MathUtils docs](https://threejs.org/docs/#api/en/math/MathUtils) | Linear interpolation and damping in the camera/scene; custom 4D projection remains local code |
| Vite 7 setup/build | [Vite 7 getting started](https://v7.vite.dev/guide/), [Vite 7 build guide](https://v7.vite.dev/guide/build.html) | `package.json`, `vite.config.ts`: dev server, production bundling, output files |
| Public assets | [Vite 7 static asset handling](https://v7.vite.dev/guide/assets.html#the-public-directory) | Why `public/photos/example.jpg` is referred to as `/photos/example.jpg`; why notices ship unchanged |
| Hosting/static output | [Vite 7 static deployment guide](https://v7.vite.dev/guide/static-deploy.html) | How `dist/` becomes a static site; preview is a local check |
| TypeScript language | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | Data types, interfaces, unions, generics, optional properties, and callback signatures |
| Function types | [TypeScript Handbook, more on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) | Callback contracts, `() => void` cleanup functions, optional/default parameters |
| Object and union types | [Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html), [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) | `ArchiveId`, era/content interfaces, typed DOM queries and person/object states |
| Compiler configuration | [TSConfig reference](https://www.typescriptlang.org/tsconfig/) | `tsconfig.json`, `noEmit`, DOM libraries, module resolution, strict checks |
| Lockfile semantics | [npm package-lock.json documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json) | Exact versions, registry archives/integrity, platform optional dependencies |

The code does not import React, Next.js, React Three Fiber, GSAP, a CMS, or a custom GLSL/TSL shader. Those appeared as possible stacks in the concept brief, not as installed implementation dependencies. The current mini-game is Canvas 2D; the surrounding corridor is Three.js/WebGL. Blender is a possible future asset-authoring tool, not a requirement to run this prototype.

## Browser APIs behind the experience

These references explain browser behavior used directly by the app. They are documentation links, not additional runtime dependencies.

| API/topic | Reference | Where it helps |
| --- | --- | --- |
| Canvas 2D drawing | [WHATWG canvas specification](https://html.spec.whatwg.org/multipage/canvas.html), [MDN Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) | `art.ts`, `game.ts`, local label textures: paths, fills, clipping, text, data URLs |
| WebGL foundation | [Khronos WebGL 2.0 specification](https://registry.khronos.org/webgl/specs/latest/2.0/) | Browser rendering foundation below Three.js; no need to rewrite the project at raw GL level to follow it |
| Frame timing | [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) | Scene updates and timing; a frame timestamp is not a calendar year |
| Pointer input | [W3C Pointer Events](https://www.w3.org/TR/pointerevents/) | Cursor/touch input, pointer positions, parallax and object selection |
| Dialogs | [WHATWG dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element) | Native detail/about dialog lifecycle, focus and close behavior |
| Keyboard | [MDN KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) | Time controls and mini-game key mappings |
| Motion preferences | [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), [MDN matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) | CSS reduced-motion rules and JavaScript's initial motion preference detection |
| Web Audio | [W3C Web Audio specification](https://www.w3.org/TR/webaudio/), [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Optional synthesized sine tones; oscillator → gain → output routing |
| URL parsing | [WHATWG URL Standard](https://url.spec.whatwg.org/) | `safeResourceUrl()` behavior for local/external links |
| DOM text/HTML | [MDN textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent), [MDN innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) | Why authored strings need escaping when interpolated into HTML templates |
| Font loading | [MDN @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), [MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) | Local WOFF2 references, weight/style declarations, fallback behavior |
| CSS variables | [MDN custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) | Shared timeline palette written to UI theme properties |
| CSS grain | [MDN SVG feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) | Inline SVG noise overlay; no downloaded texture needed |
| Resize handling | [MDN Window resize event](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event) | Window resize listener → renderer size and camera aspect synchronization |

## Fonts and license sources

The actual full notices are bundled locally; preserve those files. These upstream links provide family context and official license information, not a recovered exact WOFF2 download history.

| Material | Official source | Local evidence |
| --- | --- | --- |
| DM Sans | [Google Fonts DM project](https://github.com/googlefonts/dm-fonts), [Google Fonts distributed DM Sans OFL](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) | [DM Sans OFL](../../public/fonts/dm-sans-OFL.txt), embedded binary copyright/version, [binary hash](../../ASSET_SOURCES.md#bundled-font-files) |
| IBM Plex Mono | [IBM Plex repository](https://github.com/IBM/plex), [IBM license](https://github.com/IBM/plex/blob/master/LICENSE.txt) | [IBM Plex OFL](../../public/fonts/ibm-plex-mono-OFL.txt), declared reserved name “Plex” |
| Instrument Serif | [Instrument Serif repository](https://github.com/Instrument/instrument-serif), [Instrument OFL](https://github.com/Instrument/instrument-serif/blob/main/OFL.txt) | [Instrument Serif OFL](../../public/fonts/instrument-serif-OFL.txt) |
| SIL Open Font License | [Official site](https://openfontlicense.org/), [official license text](https://openfontlicense.org/open-font-license-official-text/) | Exact family-specific full text already bundled; do not replace copyright lines with a generic template |
| Three.js | [r180 license](https://github.com/mrdoob/three.js/blob/r180/LICENSE) | [Full local retained copy](../rights/licenses/three-0.180.0-LICENSE), [runtime notice](../../public/licenses/three-LICENSE.txt) |
| Vite | [7.3.7 license and bundled notices](https://github.com/vitejs/vite/blob/v7.3.7/packages/vite/LICENSE.md) | [Installed package's complete retained file](../rights/licenses/vite-7.3.7-LICENSE.md) |
| TypeScript | [5.9.3 license](https://github.com/microsoft/TypeScript/blob/v5.9.3/LICENSE.txt) | [Installed license](../rights/licenses/typescript-5.9.3-LICENSE.txt), [full third-party notices](../rights/licenses/typescript-5.9.3-ThirdPartyNoticeText.txt) |

The dependency inventory preserves exact installed notice contents even when upstream websites change. For a new external asset, use the [rights guide's provenance template](../rights/README.md#add-photographs-art-models-music-or-text-with-a-usable-record) and add its source/permission to [ASSET_SOURCES.md](../../ASSET_SOURCES.md).
