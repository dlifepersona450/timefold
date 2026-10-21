[Docs home](../README.md) · [Architecture](../architecture/README.md) · [Symbol index](../generated/SYMBOLS.md)

# Styles, tokens, selectors and responsive layout: `style.css`

Source: [`src/style.css`](../../src/style.css). Related: [Interface/DOM contract](interface.md), [Game](game.md), [Timeline sampling](timeline.md), [Font and asset credits](../rights/README.md).

The stylesheet renders the HTML interface above the WebGL canvas. It does not color Three.js meshes directly: [`scene/animation.ts`](../../src/scene/animation.ts) applies interpolated themes to scene lights/fog independently. The coordination point is the shared theme data in [`archive.ts`](../../src/archive.ts), sampled by [`timeline.ts`](../../src/timeline.ts) and written into root CSS properties by [`ui/timeline-view.ts`](../../src/ui/timeline-view.ts). The controller's `setTime` samples state and schedules that DOM paint.

This guide explains the layout systems, state classes, every custom property, selector families, interactions, media queries and animations. The [complete rule ledger](#complete-rule-ledger) linked from this page records **every declaration block and its exact property/value pairs in source order**, including later overrides and nested media/keyframe rules. Read the ledger with the semantic sections rather than treating a base declaration as its final computed value.

## How the file is organized and why order matters

1. Eight `@font-face` declarations load local WOFF2 fonts.
2. The first `:root` establishes typography and the original base palette; global rules reset the body, buttons, links, inputs, focus styles and hidden elements.
3. Base rules lay out canvas overlays, header, introduction, room marker, tooltip, timeline, loader/fallback, dialogs and each content type.
4. Initial responsive queries adapt wide, compact-height, tablet and mobile layouts. A direct `prefers-reduced-motion` query removes animation/transition.
5. The comment “Time affects the whole interface, as well as the WebGL room.” begins a second `:root` and theme overrides. They replace many base fixed colors with custom properties and `color-mix(...)` expressions.
6. Additional rules define detail era controls, era-specific project/photo/journal treatments, traveller portrait/costume/life-thread, and linked resource cards/progress.
7. Final mobile and short-height queries override the earlier queries where needed for those additions.

These are ordinary unlayered author rules. There is no CSS `@layer`, preprocesser, CSS module hashing or utility framework. Equal-specificity declarations later in the file win; more-specific selectors still win across sections, and `!important` rules override normal declarations. Inline custom properties set on `<html>` by `setTime` override same-name `:root` defaults. Descendants inherit the variables, so no per-element loop is needed for most color changes.

For example `.room-marker` starts with bottom `188px`, receives several responsive values, then a later base rule sets `177px`. Final short-height queries restore `145px` for compact desktop and `130px` for compact mobile. Merely editing the first `bottom` declaration may appear to have no effect because later rules win.

## All custom properties and their linkage

| Variable | Declaration / runtime source | Meaning and consumers |
| --- | --- | --- |
| `--cream` | Base root `#eae9dd`; main writes sampled `theme.text` | Primary text. Final root color and dialog foreground use it; resource headings use it. Historical name, not a fixed cream palette. |
| `--muted` | Base root `#a5b0a1`; main writes `theme.muted` | Secondary copy, chapter labels, metadata, resource descriptions and inactive life-thread elements. |
| `--lime` | Base root `#d4eaa9`; main writes sampled `theme.accent` | Compatibility name retained by early rules: focus outlines, slider/active states, original hover/brand/details. It has the same runtime value as `--accent`; it does not force the UI to be green. |
| `--line` | Base root `#eae9dd26`; main writes sampled accent + `30` alpha suffix | Borders, separators, progress track and life-thread halos. Appending `30` expects a six-digit hex accent string. Hex alpha `30` is about 18.8% opacity. |
| `--mono` | Root `"IBM Plex Mono", monospace` | Small technical labels, buttons, metadata, code, time controls. Not changed by timeline. |
| `--serif` | Root `"Instrument Serif", Georgia, serif` | Headlines, dates/age display, journal prose and resource titles. Not changed by timeline. |
| `--accent` | Later root `#ffc0a0`; main writes sampled `theme.accent` | Era's primary highlight, icons, game status, active states, linked resources. |
| `--theme-bg` | Later root `#301c22`; main writes sampled `theme.background` | Page background and scene-shade/fallback gradients. It is not the canvas renderer's CSS fill: WebGL paints its own background. |
| `--panel` | Later root `#2c2025`; main writes sampled `theme.panel` | Dialog, tooltip, loader/fallback and glass-button surfaces. |
| `--theme-paper` | Later root `#edd0b0`; main writes sampled `theme.paper` | Journal paper and childhood workstation casing. |
| `--theme-ink` | Later root `#29131e`; main writes sampled `theme.shadow` | Journal ink, dark hover foreground, modern journal bezel. The source theme field is `shadow`, not a separate `ink` property. |
| `--ambient` | Later root `#e9b4a0`; main writes sampled `theme.ambient` | Exposed UI theme token, currently **not consumed by a `var(--ambient)` declaration** in this stylesheet. The world does use the theme's ambient light value separately. |
| `--progress` | Range-input rule `0%`; main writes inline percentage on `#time` | Color-stop position in the timeline slider's background gradient. This is timeline position, unrelated to linked resource `<progress>` percentages. |

All custom properties are color strings except font stacks and timeline progress. Theme fields `wall`, `floor`, `plaster`, `metal`, and `light` are primarily renderer/game inputs and have no separate CSS custom property here. The mini-game consumes its chapter theme directly instead of inheriting CSS colors into its canvas pixels.

### Palette interpolation and remaining fixed colors

`sampleTimeline` mixes chapter hex channels; `setTime` applies each sampled color to root properties. CSS uses `color-mix(in srgb, ...)` to combine those colors with black, transparency, paper, or ink for shading. For example `color-mix(in srgb, var(--accent) 10%, transparent)` creates a translucent hover wash rather than a separate theme token.

The second theme section overrides most originally green component colors. Some fixed details remain, such as `::selection`'s pale-green/dark-green colors, the original slider-thumb halo, live-dot shadow, drawer scrollbar tint, grain opacity, and some decorative/base descendant colors. They are listed in the ledger. Editing only `--accent` is therefore not a claim that every rendered pixel becomes exclusively theme-derived. The main runtime also overrides first-root fallback `--cream`/`--muted`/`--lime` values immediately in `setTime(0)`.

To add a new theme token, extend `EraTheme` and every era's `theme`, let the sampler interpolate it, write its CSS variable in `setTime` if the DOM needs it, and consume it in the appropriate rule. Do not add a CSS variable without an owner/default; a missing `var(...)` can invalidate its declaration.

## Fonts and typography

The stylesheet uses three locally hosted families:

| Family / registration | File | Use and caveat |
| --- | --- | --- |
| DM Sans, normal 400/500/600/700 | [`dm-sans-normal-400.woff2`](../../public/fonts/dm-sans-normal-400.woff2) for all four registrations | Body and controls. Each declared weight currently references the **same** bundled font file. Separate weight-specific files are not loaded. `font-synthesis: none` prevents browser-generated synthetic bold/italic where unavailable. |
| IBM Plex Mono, normal 400 | [`ibm-plex-mono-normal-400.woff2`](../../public/fonts/ibm-plex-mono-normal-400.woff2) | Monospaced labels/code. |
| IBM Plex Mono, normal 500 | [`ibm-plex-mono-normal-500.woff2`](../../public/fonts/ibm-plex-mono-normal-500.woff2) | Medium monospaced registration available to consumers. |
| Instrument Serif, italic 400 | [`instrument-serif-italic-400.woff2`](../../public/fonts/instrument-serif-italic-400.woff2) | Emphasized serif portions and journal notes. |
| Instrument Serif, normal 400 | [`instrument-serif-normal-400.woff2`](../../public/fonts/instrument-serif-normal-400.woff2) | Display headings and journal body. |

Every face uses `font-display: swap`: fallback text can appear immediately, then the font swaps in. All share an explicit Latin-oriented `unicode-range`, including selected punctuation/currency/arrows. A glyph outside these ranges comes from a fallback font; do not assume the bundled files cover every language. Sans/monospace/Georgia/serif fallback stacks make the page usable if fonts fail.

Large headings use `clamp(minimum, viewport-relative value, maximum)`, such as the initial h1's `clamp(58px, 6.3vw, 98px)`. Mobile/short-height media queries change these ranges. The small labels are intentionally tiny in the visual design; their actual values and viewport changes are in the ledger. Browser zoom remains important for comfortable reading. Licensing and provenance belong with [the project's legal/credits documentation](../rights/README.md), not an inferred license based on a font name.

## Layout, stacking and pointer interaction

| Element / family | Layout and stacking | Why it behaves this way |
| --- | --- | --- |
| `body` | Margin zero, `overflow:hidden`, theme background | The room fills the viewport; page scroll is replaced by timeline travel. Modal drawers scroll internally. |
| `#world` | Fixed `inset:0`, width/height 100%, `touch-action:none` | Full-screen renderer surface; its touch gestures belong to the app. The CSS size is separate from renderer backing resolution. |
| `.scene-shade` | Fixed full-screen gradient, `pointer-events:none` | Protects headline/timeline contrast while allowing canvas hit testing through it. Opacity changes during object inspection. |
| `.grain` | Fixed full-screen, z-index 5, pointer-transparent | Decorative SVG `feTurbulence` fractal-noise texture. Not an image download or AI-generated asset. Opacity 0.055 desktop, 0.035 mobile. |
| `.header` | Fixed top, z-index 10, full-width flex | Brand left, utility actions right; archive button is absolutely centered on desktop. |
| `.intro` | Absolute at left/top, z-index 2; pointer-transparent except its button | Headline copy does not block canvas clicks over its rectangular box. Explore button explicitly restores `pointer-events:auto`. |
| `.scene-caption` | Fixed right side, pointer-transparent | Decorative scene annotation hidden on mobile and WebGL fallback. |
| `.room-marker` | Fixed left near footer, z-index 2, pointer-transparent | Current era, room index and traveller info. Hidden through opacity when inspecting. |
| `.tooltip` | Fixed z-index 7, pointer-transparent | Pointer hint positioned by world hover coordinates. Disabled on mobile by CSS. |
| `.timeline` | Fixed bottom, z-index 8, three-column grid | Year, flexible range/chapter area, previous/next controls. Two columns on mobile. |
| `.loading` | Fixed full-screen, z-index 30 | Covers startup until renderer success; `.loaded` fades and disables pointer interception, then main removes it. |
| `.fallback` | Fixed z-index 6 | HTML route to the index if WebGL construction fails. |
| Modal `dialog` | Native browser top layer while `showModal()` is active | Drawers appear above ordinary z-index layers; their backdrop is also top-layer browser behavior. |
| `.drawer` | Fixed right inset, `height:100dvh`, internal `overflow-y:auto` | Keeps world behind detail while allowing long content to scroll. `dvh` follows dynamic viewport height. |
| `.about-dialog` | Centered with `margin:auto`, limited viewport height | Smaller informational modal rather than a right-edge drawer. |

Z-index comparisons above apply to normal page stacking; native modal top-layer behavior outranks them. Adding an arbitrary large z-index to an ordinary element does not put it above a modal dialog.

## Selector-family guide

The generated ledger lists every exact selector. These families explain the implementation meaning so a learner can find the right rules before editing values.

| Family / selectors | Purpose, linkage and extension notes |
| --- | --- |
| `*`, `body`, `button`, `a`, `input`, `[hidden]`, `::selection` | Border-box sizing; no body scrolling; control resets; inherited fonts/colors; disabled opacity; transparent tap highlight; `[hidden]` always removed with `display:none!important`; global selection colors. Buttons/anchors use `touch-action:manipulation`. |
| `:focus-visible`, `:focus:not(:focus-visible)` | Focus-visible gets 2px accent-alias outline with 6px offset. Mouse-only button focus has no outline. Do not remove keyboard focus without an equally visible replacement. |
| `.header`, `.brand`, `.brand svg`, `.brand > span`, `.brand small` | Header layout, logo size, letter-spaced wordmark, secondary brand label. Brand click resets time in main. |
| `.archive-button`, `.index-icon`, `.count` | Centered archive action, glyph and zero-padded object count. Count has left separator; styles do not calculate its value. |
| `.header-actions`, `.utility`, `.about-button span` | Sound/about arrangement and hover accents. At tablet width the visible sound label disappears while button `aria-label` stays present. |
| `.sound-bars`, `i`, `:nth-child(...)`, `[aria-pressed="true"] .sound-bars i` | Four static bar heights; active button starts staggered `wave` animation. This is decorative animation based on button state, not audio-frequency analysis. |
| `.intro`, `.eyebrow`, `.intro .eyebrow`, `.live-dot`, `h1`, `h1 em`, `.intro-copy` | Hero typography, display hierarchy and decorative accent dot. `.intro` state transitions are governed by inspection and motion preferences. |
| `.explore-button`, `.explore-button span`, hover descendant | Underlined text action with an arrow moving 3px right/up on hover. `.intro button` re-enables pointer interaction. |
| `.small-note`, `.scene-caption`, `.scene-caption small`, `.cross` | Fine print and technical scene annotation; selected items are hidden/repositioned responsively. |
| `.room-marker`, `.room-number`, `.room-marker div > span`, `.room-marker small`, `.traveller-readout` | Chapter summary and age/outfit. Traveller readout uses `!important` display/font/color overrides because it shares a generic span selector. Compact mobile hides it. |
| `.tooltip`, `.tooltip span`, `.tooltip small` | Pointer object hint surface, title and metadata. TypeScript handles hidden state and viewport-clamped position. |
| `.timeline`, `.time-label .eyebrow`, `.time-year`, `.time-year > span`, `.track-heading` and child selectors | Footer grid and current-time labels; phase/wavelength label hidden on mobile. |
| `input[type="range"]`, WebKit and Mozilla thumb pseudos | Two-color progress line and square handle; `--progress` determines split. Browser-specific thumb rules are duplicated to support both engines. |
| `.era-buttons` and descendants, `.active`, `:hover` | Evenly spaced chapter buttons, endpoint alignment, year/phase labels, current chapter highlighting. DOM state is set by `setTime`, not by CSS. |
| `.timeline-navigation`, button shared with `.gallery-navigation`, child span | Circular navigation controls and scroll hint. Disabled button styles come from global `button:disabled`; mobile hides this entire region. |
| `.loading`, `.loading.loaded`, `.loading-symbol`, nested `svg` | Startup overlay, fade-out state and `spin` animation. Hidden/removal timing comes from main. |
| `.fallback` and descendants, `.webgl-unavailable ...` | WebGL failure content and generated radial background; hide decorative scene caption and simplify mobile intro. |
| `dialog`, `dialog::backdrop`, `dialog[open]`, `.drawer` | Shared modal color/border, translucent blurred backdrop, open animation, scrolling drawer dimensions. |
| `.drawer-top`, `.drawer-top .eyebrow`, `.close-button`, `:hover` | Drawer header alignment and close button. Top margin spacing changes for detail and responsive layouts. |
| `h2`, `h2 em`, `.drawer-intro`, `.drawer-foot` | Drawer/about display typography and supporting text. Footer copy is authored HTML, not generated from CSS. |
| `.object-list`, `.object-row`, child strong/small, `.object-number`, `.object-icon`, `.row-arrow` | Index uses four columns: mark, icon, flexible name/form, arrow. Hover wash doesn't change content or focus; main changes era-specific text. |
| `.detail-drawer`, `.detail-drawer .drawer-top`, `.detail-heading ...`, `.heading-period` | Wider content drawer, title hierarchy and accent punctuation. |
| `.text-button`, `:hover` | Shared understated controls for All objects, restart and ambient motion. |
| `.inspecting .intro`, `.inspecting .intro button`, `.inspecting .room-marker`, `.inspecting .scene-shade` | Fade/translate room overlay labels away and reduce shade opacity when inspecting; disable hidden intro button pointer events. Main owns this body state. |
| `.project-visual`, `.code-top`, `.code-top > span:first-child`, `.code-art`, `.code-art > span`, `.code-art > b`, `.project-coordinate` | Terminal-style project illustration, toolbar and code. The current renderer inserts escaped text plus `<br>`, so the legacy `span`/`b` syntax-color rules have no generated tokens to style. |
| `.detail-section-label`, `.phase-buttons` and descendants | Shared section labels and chapter-button strip; first rules establish borders/flex, later rules add strong/small year/phase lines. |
| `h3`, `#detail-content > p`, `.tags`, `.tags > span`, `.detail-footer` | Content title, direct prose, wrapping tags, and final archive marker. Direct-child selector does not automatically style nested resource descriptions/journal paragraphs. |
| `.gallery`, `.gallery > img`, `.image-badge` | Cropped main art with aspect ratio 1.32 and `object-fit:cover`; overlaid medium label. Source image dimensions remain independent. |
| `.gallery-navigation` and descendants, `.photo-thumbs` and descendants | Image counter and arrows, thumbnail strip with selected border/opacity. Later thumbnail width is one-third, overriding the original one-quarter assumption; more items continue in the same flex row without wrapping. |
| `.journal-page`, `.journal-date`, nested h3/p, `.journal-sign`, `.journal-rule`, `.journal-postscript` | Paper/ink typography and note layout. Later theme overrides replace fixed paper colors and adjust signature/date/postscript ink; prose is escaped plain text. |
| `.memory-meta`, `.food-note` | Food-memory metadata separators and large italic note. Gallery layout is reused for its illustration. |
| `.travel-map`, nested svg, `.map-coordinate`, `.place-list`, `.place-row` and children | Decorative map surface, coordinate overlay, accessible place-button list. `ui/panel-controls.ts` updates pin opacity/radius inline, not through a `.selected` CSS selector. |
| `.demo-note` | Small fictional/prototype disclosure. Uses `!important` font/color to override broader paragraph rules; later muted color supersedes original green. |
| `.game-canvas`, `.game-status`, `.game-controls`, `.dpad`, nested buttons | Responsive game image, live status, controls and button hover. Canvas pixel colors come from game `theme`, not these rules. |
| `.about-dialog` and direct children, `.about-bottom`, child span/button | Centered explanation modal and motion toggle footer. Direct-child selectors avoid changing every nested paragraph or button globally. |
| `.sr-only` | One-pixel clipped but accessible text/status region. It does not use `display:none`, preserving accessibility-tree participation. |
| `.reduced-motion *` and reduced-motion media query | Suppress animations/transitions according to class or OS preference. The class rule covers descendant elements; media query also names `*::before`/`*::after`. |
| `.era-object-spec`, `.object-time-controls` and descendants, `.phase-buttons button strong/small` | Era form metadata and detail chapter controls. `ui/detail.ts` generates `data-stage` buttons/handlers; style classes are independent of those dataset indices. |
| `.era-project-0`, nested `.code-art`, `.era-project-3` | Childhood CRT-like thick paper-colored casing and spacing; imagined future inset accent glow. Eras 1/2 use the base project appearance. |
| `.era-photo-0`, `.era-photo-3` | Childhood sepia filter and future accent glow. `ui/panels.ts` adds these classes from numeric `eraIndex`. |
| `.journal-era-2`, `.journal-era-3` | Modern/future ink bezel and rounded corners around the otherwise shared journal article. |
| `.person-study`, `.person-portrait`, `.person-age`, nested strong/span | Gradient portrait panel, responsive SVG, age overlay and year label. Actual anatomy and costume SVG come from `personPortrait`. |
| `.person-costume`, `.eyebrow`, strong | Outfit strip and typographic label, separated from biography. |
| `.life-thread`, child div, `:before`, `.active`, span/small | Age/year sequence with generated square markers along a border; active marker halo uses `--line`. The pseudo-elements are decorative, not controls. |
| `.linked-archive`, `.resource-card`, `.resource-meta`, nested h4/p | Connected project/post/game/art cards. Content links and progress values come from `memory.resources[objectId]`. |
| `.resource-status`, `.resource-progress`, `> span`, b, progress and WebKit pseudos | Status badge and semantic `<progress>` with era colors. `accent-color` supplies native coloring; WebKit bar/value rules refine its track/fill. No custom Firefox progress-fill pseudo is declared. |
| `.resource-link`, `> span[aria-hidden]`, hover | External project link row and large decorative arrow. New-tab spoken suffix uses `.sr-only`. |

### Generated era classes are positional

The category renderers in `ui/panels.ts` add classes such as `era-project-${eraIndex}`. Rules explicitly named `-0`, `-2`, `-3` refer to positions in the current `eras` array, not dates. If you insert or reorder chapters, review those selectors and their meaning. There is no CSS lookup that automatically recognizes “old” or “future” based on the year. Model changes in the WebGL scene are separate from these 2D treatments.

### Current hooks with limited or no current output

The body receives `data-era` for inspection, but this stylesheet has no `[data-era="..."]` theme selectors. The compatibility variable `--ambient` is defined but not used. `.code-art > span` and `> b` anticipate syntax-colored markup that the current escaped-code renderer does not emit. `.timeline-track` has a wide-screen max-width rule but relies on grid sizing otherwise. These are current source facts; they are not missing external dependencies.

## Animations and transitions

| Name / selector | Exact action | Trigger / cleanup |
| --- | --- | --- |
| `@keyframes wave` | Animate bar height toward `3px`. | Active sound bars: 1.4 s ease-in-out infinite alternate; bars 2/3 offset by .4/.8 s. Does not analyze actual audio. |
| `@keyframes spin` | Rotate to `360deg`. | Loader SVG: 4 s linear infinite. Stops when loader is removed or reduced motion disables it. |
| `@keyframes drawer-in` | Opacity 0→1 and translateX 30px→0. | `dialog[open]`: .45 s cubic-bezier(.2,.7,.2,1). Same rightward-entry animation also applies to centered about modal. |
| `button` | Background/color/opacity .2 s. | Hover/pressed/disabled changes, except reduced motion. |
| `.scene-shade` | Opacity 1 s. | Inspection state. Theme background values change through root properties, not this opacity transition. |
| `.intro` | Opacity .5 s, transform .8 s. | Inspection state. |
| `.explore-button span` | Transform .3 s. | Arrow hover translation. |
| `.room-marker` | Opacity .5 s. | Inspection state. |
| `.loading` | Opacity .6 s. | `.loaded`, followed by removal at 650 ms in main. |

There is no CSS continuous interpolation of theme variables declared here; the timeline's sampler produces intermediate values during input, and the world smooths its own render state separately. Setting a range value programmatically without calling `setTime` does not update colors.

## Every media query and its final effect

| Query (source order) | Main effects |
| --- | --- |
| `(min-width: 1600px)` | Slightly lower intro; 15px intro copy and 10px eyebrow; room marker initially 205px from bottom; timeline bottom padding 34px; track max-width 1000px; scene caption top 54%. Later room-marker rules override its bottom value. |
| `(max-height: 800px) and (min-width: 701px)` | Compact desktop header (90px), smaller h1/copy, reduced margins, shorter timeline padding, 40px year, tighter drawer/index spacing; initial room bottom 155px later becomes 145px in final matching query. |
| `(max-width: 1000px)` | Smaller header utility gaps, timeline grid `115px 1fr 100px` with 30px gap, intro/caption reposition, constrained fine print, sound label hidden, narrower drawers capped at 70%/75% viewport. |
| `(max-width: 700px)` | 85px header; smaller brand; archive button right-aligned; utility actions second row; mobile intro typography; scene caption hidden; room/timeline sized down; timeline becomes `61px 1fr`; phase label and previous/next area hidden; drawers full-width; about/fallback typography adjusted; tooltip always hidden; lower grain opacity. |
| `(max-height: 700px) and (max-width: 700px)` | Compact mobile h1 54px, shorter intro margins, last intro line break hidden, small note hidden, smaller room number, room note hidden, reduced timeline padding; room bottom later becomes 130px. |
| `(prefers-reduced-motion: reduce)` | Every element and before/after pseudo gets `animation:none!important; transition:none!important`. Applies even if in-app motion state is toggled back on. |
| Final `(max-width: 700px)` | Replace old mobile shade with theme-derived gradients; room bottom 177px; traveller font 6px/max-width 240px; portrait max-height 300px; smaller section label/resource-card padding/code font. |
| Final `(max-height: 800px) and (min-width: 701px)` | Final compact desktop room bottom 145px and traveller font 6px. |
| Final `(max-height: 700px) and (max-width: 700px)` | Final compact mobile room bottom 130px; hide traveller readout with `display:none!important`. |

Queries can match together. At 650px wide/650px high, tablet, mobile, compact mobile and final matching queries all apply; resolve conflicts with normal cascade rules. The rule ledger keeps each block's context, making overrides traceable without hardcoding documentation line numbers.

## Accessibility and browser behavior

Focus-visible outlines and real buttons provide keyboard routes; CSS never makes the canvas the sole navigation. `[hidden]` removes unused fallback/tooltip content; `.sr-only` preserves announcements and supplemental spoken text. Modal scrolling means long content stays reachable even though body scrolling is disabled. Main's `aria-pressed`, `aria-valuetext`, `disabled`, dialog labels and live regions provide state semantics that CSS alone cannot supply.

Both the OS media query and body reduced-motion class suppress cosmetic animation. No CSS preference for higher contrast or color blindness is implemented; check contrast when changing palettes, including paper/ink and text/panel combinations at interpolated times. Active states also use borders/pressed attributes in places, but color remains a major visual cue.

The stylesheet relies on modern `color-mix`, `aspect-ratio`, `dvh`, `backdrop-filter`, `:focus-visible`, and range/progress styling. Unsupported newer color declarations may fall back to earlier fixed declarations where one exists; later-only features do not all have explicit fallbacks. Native dialog support is a separate runtime requirement. Blur/filter/grain are visual costs layered over WebGL; reduce them on constrained devices if profiling shows a problem. The CSS mobile breakpoint is 700px, not a device-model check.

## How to learn and extend the styles

1. Open the page and inspect `<html>` while dragging time. Watch `--accent`, `--panel`, `--theme-bg` and the others change. Then inspect an actual dialog and check its **computed** color/background rather than its first matching source rule.
2. Use the [interface contracts](interface.md#dom-content-and-resource-contracts), [cached shell elements](ui.md#permanent-dom-references-uidomts), and [panel selectors](ui.md#panel-selector-contract) to find who creates an element or class. Then locate its family above and its exact rows in the linked generated ledger.
3. Change one theme in [`archive.ts`](../../src/archive.ts) for a color experiment. Change layout values in CSS for a layout experiment. The source owns these concerns separately.
4. For a new detail component, reuse spacing/type tokens and theme variables. Add the CSS near the corresponding content family or in a deliberate later extension section. Make its important state visible through text/attributes as well as color.
5. Check a wide window, tablet width, 390px mobile width, short mobile height, keyboard-only navigation, reduced-motion preference and WebGL fallback. These are manual layout/interaction checks; a successful TypeScript build cannot prove the CSS fits every viewport.
6. When rearranging eras, review positional `.era-*` rules. When adding a fifth chapter, review era-button widths, phase labels, life-thread spacing, photo thumb counts, and mobile overflow instead of assuming all lists wrap.

The `--lime` alias can eventually be renamed to `--accent`, but change all consumers and main's assignment together. Removing only its declaration leaves earlier focus/slider/hover rules with unresolved variables before runtime initialization.

## Complete rule ledger

The exact source-order ledger is generated automatically in [STYLES.md](../generated/STYLES.md), with every rule's media/keyframe context, selector, property, and value. A separate table enumerates all custom-property declarations, and [styles.json](../generated/styles.json) provides the same structured inventory.

Run `npm run docs:generate` after editing CSS; this refreshes the complete ledger as well as source fingerprints. Update the explanatory sections above when behavior changes. `npm run docs:check` verifies that source inventories are current; generation cannot automatically rewrite design explanations.

See [documentation tooling](tooling.md) for the stylesheet parser's behavior and limitations.
