[Docs home](../README.md) · [Styles explained](../reference/styles.md) · [Symbol index](SYMBOLS.md)

# Complete stylesheet rule and variable inventory

Generated from `src/style.css` by `npm run docs:generate`. Every declaration block remains in source order, with media/keyframe context. Values are normalized only for whitespace; later overrides still win according to the CSS cascade. See the semantic reference for explanations, and [styles.json](styles.json) for structured data.

Source SHA-256: `a674df13640c9a843655e1507fbe4455f95199aadb5db508d220aef94b0b02ee`. 379 blocks; 1034 declarations.

## Custom property declarations

| Property | Value | Selector | Context |
|---|---|---|---|
| `--cream` | `#eae9dd` | `:root` | `top level` |
| `--muted` | `#a5b0a1` | `:root` | `top level` |
| `--lime` | `#d4eaa9` | `:root` | `top level` |
| `--line` | `#eae9dd26` | `:root` | `top level` |
| `--mono` | `"IBM Plex Mono", monospace` | `:root` | `top level` |
| `--serif` | `"Instrument Serif", Georgia, serif` | `:root` | `top level` |
| `--progress` | `0%` | `input[type="range"]` | `top level` |
| `--accent` | `#ffc0a0` | `:root` | `top level` |
| `--theme-bg` | `#301c22` | `:root` | `top level` |
| `--panel` | `#2c2025` | `:root` | `top level` |
| `--theme-paper` | `#edd0b0` | `:root` | `top level` |
| `--theme-ink` | `#29131e` | `:root` | `top level` |
| `--ambient` | `#e9b4a0` | `:root` | `top level` |

## All rules in source order

| Rule | Context | Selector / at-rule | Every property and value |
|---|---|---|---|
| 1 | `top level` | `@font-face` | `font-family: "DM Sans"`<br>`font-style: normal`<br>`font-weight: 400`<br>`font-display: swap`<br>`src: url(/fonts/dm-sans-normal-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 2 | `top level` | `@font-face` | `font-family: "DM Sans"`<br>`font-style: normal`<br>`font-weight: 500`<br>`font-display: swap`<br>`src: url(/fonts/dm-sans-normal-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 3 | `top level` | `@font-face` | `font-family: "DM Sans"`<br>`font-style: normal`<br>`font-weight: 600`<br>`font-display: swap`<br>`src: url(/fonts/dm-sans-normal-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 4 | `top level` | `@font-face` | `font-family: "DM Sans"`<br>`font-style: normal`<br>`font-weight: 700`<br>`font-display: swap`<br>`src: url(/fonts/dm-sans-normal-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 5 | `top level` | `@font-face` | `font-family: "IBM Plex Mono"`<br>`font-style: normal`<br>`font-weight: 400`<br>`font-display: swap`<br>`src: url(/fonts/ibm-plex-mono-normal-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 6 | `top level` | `@font-face` | `font-family: "IBM Plex Mono"`<br>`font-style: normal`<br>`font-weight: 500`<br>`font-display: swap`<br>`src: url(/fonts/ibm-plex-mono-normal-500.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 7 | `top level` | `@font-face` | `font-family: "Instrument Serif"`<br>`font-style: italic`<br>`font-weight: 400`<br>`font-display: swap`<br>`src: url(/fonts/instrument-serif-italic-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 8 | `top level` | `@font-face` | `font-family: "Instrument Serif"`<br>`font-style: normal`<br>`font-weight: 400`<br>`font-display: swap`<br>`src: url(/fonts/instrument-serif-normal-400.woff2) format("woff2")`<br>`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` |
| 9 | `top level` | `:root` | `font-family: "DM Sans", sans-serif`<br>`color: #eae9dd`<br>`background: #242c26`<br>`font-synthesis: none`<br>`font-weight: 400`<br>`--cream: #eae9dd`<br>`--muted: #a5b0a1`<br>`--lime: #d4eaa9`<br>`--line: #eae9dd26`<br>`--mono: "IBM Plex Mono", monospace`<br>`--serif: "Instrument Serif", Georgia, serif`<br>`color-scheme: dark` |
| 10 | `top level` | `*` | `box-sizing: border-box` |
| 11 | `top level` | `body` | `margin: 0`<br>`overflow: hidden` |
| 12 | `top level` | `button, a, input` | `-webkit-tap-highlight-color: transparent` |
| 13 | `top level` | `button` | `font: inherit`<br>`color: inherit`<br>`cursor: pointer` |
| 14 | `top level` | `button` | `background: none`<br>`border: 0` |
| 15 | `top level` | `button:disabled` | `opacity: 0.25`<br>`cursor: default` |
| 16 | `top level` | `button:focus-visible, a:focus-visible, input:focus-visible` | `outline: 2px solid var(--lime)`<br>`outline-offset: 6px` |
| 17 | `top level` | `button:focus:not(:focus-visible)` | `outline: none` |
| 18 | `top level` | `a` | `color: inherit`<br>`text-decoration: none` |
| 19 | `top level` | `button, a` | `touch-action: manipulation` |
| 20 | `top level` | `button` | `transition: background 0.2s, color 0.2s, opacity 0.2s` |
| 21 | `top level` | `::selection` | `background: #d4eaa9`<br>`color: #1a281e` |
| 22 | `top level` | `[hidden]` | `display: none !important` |
| 23 | `top level` | `#world` | `position: fixed`<br>`inset: 0`<br>`width: 100%`<br>`height: 100%`<br>`touch-action: none` |
| 24 | `top level` | `.scene-shade` | `position: fixed`<br>`inset: 0`<br>`pointer-events: none`<br>`background: linear-gradient( 90deg, rgba(16, 24, 21, 0.87) 0%, rgba(16, 24, 21, 0.66) 25%, rgba(16, 24, 21, 0.15) 54%, transparent 75% ), linear-gradient( 0deg, rgba(15, 23, 19, 0.94), transparent 29%, transparent 80%, rgba(17, 25, 21, 0.6) )`<br>`transition: opacity 1s` |
| 25 | `top level` | `.grain` | `position: fixed`<br>`inset: 0`<br>`pointer-events: none`<br>`z-index: 5`<br>`opacity: 0.055`<br>`background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.6' filter='url(%23n)'/%3E%3C/svg%3E")` |
| 26 | `top level` | `.header` | `position: fixed`<br>`z-index: 10`<br>`top: 0`<br>`left: 0`<br>`width: 100%`<br>`height: 112px`<br>`padding: 0 4.2%`<br>`display: flex`<br>`align-items: center`<br>`justify-content: space-between` |
| 27 | `top level` | `.brand` | `display: flex`<br>`align-items: center`<br>`gap: 12px` |
| 28 | `top level` | `.brand svg` | `width: 43px`<br>`height: 43px`<br>`color: var(--lime)` |
| 29 | `top level` | `.brand > span` | `font-size: 15px`<br>`letter-spacing: 0.25em`<br>`font-weight: 550` |
| 30 | `top level` | `.brand small` | `display: block`<br>`font: 8px var(--mono)`<br>`letter-spacing: 0.13em`<br>`color: #bec7b6`<br>`margin-top: 7px` |
| 31 | `top level` | `.archive-button` | `position: absolute`<br>`left: 50%`<br>`transform: translateX(-50%)`<br>`display: flex`<br>`gap: 12px`<br>`align-items: center`<br>`font-size: 12px`<br>`padding: 12px 16px`<br>`border: 1px solid #b4bea63b`<br>`border-radius: 4px`<br>`background: #24302659`<br>`backdrop-filter: blur(8px)` |
| 32 | `top level` | `.archive-button:hover` | `background: #d4eaa91a` |
| 33 | `top level` | `.index-icon` | `font-size: 19px`<br>`font-weight: 400`<br>`line-height: 1` |
| 34 | `top level` | `.count` | `font: 9px var(--mono)`<br>`border-left: 1px solid #b4bea63b`<br>`padding-left: 12px`<br>`color: #bdc9b1` |
| 35 | `top level` | `.header-actions` | `display: flex`<br>`gap: 30px`<br>`align-items: center` |
| 36 | `top level` | `.utility` | `font-size: 11px`<br>`display: flex`<br>`gap: 9px`<br>`align-items: center`<br>`padding: 10px 0` |
| 37 | `top level` | `.utility:hover` | `color: var(--lime)` |
| 38 | `top level` | `.about-button span` | `font-size: 18px`<br>`margin-left: 9px` |
| 39 | `top level` | `.sound-bars` | `display: flex`<br>`align-items: center`<br>`gap: 2px`<br>`height: 14px` |
| 40 | `top level` | `.sound-bars i` | `display: block`<br>`width: 2px`<br>`height: 4px`<br>`background: #c4cbb7` |
| 41 | `top level` | `.sound-bars i:nth-child(2)` | `height: 10px` |
| 42 | `top level` | `.sound-bars i:nth-child(3)` | `height: 14px` |
| 43 | `top level` | `.sound-bars i:nth-child(4)` | `height: 7px` |
| 44 | `top level` | `[aria-pressed="true"] .sound-bars i` | `animation: wave 1.4s ease-in-out infinite alternate` |
| 45 | `top level` | `[aria-pressed="true"] .sound-bars i:nth-child(2)` | `animation-delay: 0.4s` |
| 46 | `top level` | `[aria-pressed="true"] .sound-bars i:nth-child(3)` | `animation-delay: 0.8s` |
| 47 | `@keyframes wave` | `to` | `height: 3px` |
| 48 | `top level` | `.intro` | `position: absolute`<br>`left: 6%`<br>`top: 24%`<br>`z-index: 2`<br>`transition: opacity 0.5s, transform 0.8s`<br>`pointer-events: none` |
| 49 | `top level` | `.intro button` | `pointer-events: auto` |
| 50 | `top level` | `.eyebrow` | `font: 9px var(--mono)`<br>`letter-spacing: 0.13em`<br>`line-height: 1.8`<br>`display: block` |
| 51 | `top level` | `.intro .eyebrow` | `color: #c8d2bd`<br>`display: flex`<br>`align-items: center`<br>`gap: 9px`<br>`margin-bottom: 28px` |
| 52 | `top level` | `.live-dot` | `width: 5px`<br>`height: 5px`<br>`display: inline-block`<br>`background: var(--lime)`<br>`border-radius: 50%`<br>`box-shadow: 0 0 10px #d4eaa944` |
| 53 | `top level` | `h1` | `font-family: var(--serif)`<br>`font-weight: 400`<br>`font-size: clamp(58px, 6.3vw, 98px)`<br>`letter-spacing: -0.035em`<br>`line-height: 0.98`<br>`margin: 0` |
| 54 | `top level` | `h1 em` | `font-weight: 400`<br>`color: #d2e0bb` |
| 55 | `top level` | `.intro-copy` | `font-size: 13px`<br>`line-height: 1.8`<br>`color: #c0c7b8`<br>`margin: 27px 0 25px` |
| 56 | `top level` | `.explore-button` | `display: flex`<br>`gap: 45px`<br>`align-items: center`<br>`padding: 0 0 12px`<br>`border-bottom: 1px solid #b9c7a87a`<br>`font-size: 12px` |
| 57 | `top level` | `.explore-button span` | `display: inline-block`<br>`font-size: 24px`<br>`color: var(--lime)`<br>`transition: transform 0.3s` |
| 58 | `top level` | `.explore-button:hover span` | `transform: translate(3px, -3px)` |
| 59 | `top level` | `.small-note` | `font: 8px var(--mono)`<br>`color: #a0ab97`<br>`margin-top: 19px`<br>`letter-spacing: -0.01em` |
| 60 | `top level` | `.scene-caption` | `position: fixed`<br>`right: 4.3%`<br>`top: 48%`<br>`font: 8px var(--mono)`<br>`letter-spacing: 0.12em`<br>`display: flex`<br>`gap: 14px`<br>`color: #edf1d6a1`<br>`text-align: right`<br>`line-height: 1.9`<br>`pointer-events: none` |
| 61 | `top level` | `.scene-caption small` | `font-size: 7px`<br>`color: #b6c1a985` |
| 62 | `top level` | `.cross` | `font-size: 20px`<br>`font-weight: 400` |
| 63 | `top level` | `.room-marker` | `position: fixed`<br>`left: 6%`<br>`bottom: 188px`<br>`display: flex`<br>`gap: 18px`<br>`align-items: center`<br>`z-index: 2`<br>`pointer-events: none`<br>`transition: opacity 0.5s` |
| 64 | `top level` | `.room-number` | `font-family: var(--serif)`<br>`font-size: 43px`<br>`color: #d4eaa9`<br>`line-height: 1`<br>`padding-right: 18px`<br>`border-right: 1px solid #afbd9b40` |
| 65 | `top level` | `.room-marker div > span` | `font-size: 12px` |
| 66 | `top level` | `.room-marker small` | `display: block`<br>`font-size: 9px`<br>`color: #adb9a2`<br>`margin-top: 7px` |
| 67 | `top level` | `.tooltip` | `position: fixed`<br>`z-index: 7`<br>`pointer-events: none`<br>`padding: 13px 16px`<br>`background: #18251eea`<br>`border: 1px solid #c4d7a942`<br>`backdrop-filter: blur(10px)`<br>`min-width: 170px` |
| 68 | `top level` | `.tooltip span` | `display: block`<br>`font-size: 13px`<br>`margin-bottom: 6px` |
| 69 | `top level` | `.tooltip small` | `font: 8px var(--mono)`<br>`color: var(--lime)` |
| 70 | `top level` | `.timeline` | `position: fixed`<br>`bottom: 0`<br>`left: 0`<br>`right: 0`<br>`margin: 0 4.2%`<br>`padding: 29px 0 24px`<br>`z-index: 8`<br>`border-top: 1px solid #c8d2b832`<br>`display: grid`<br>`grid-template-columns: 150px 1fr 130px`<br>`gap: 55px`<br>`align-items: center` |
| 71 | `top level` | `.time-label .eyebrow` | `font-size: 8px`<br>`color: #b3bea7` |
| 72 | `top level` | `.time-year` | `display: block`<br>`font-family: var(--serif)`<br>`font-size: 46px`<br>`line-height: 1.2`<br>`letter-spacing: -0.03em` |
| 73 | `top level` | `.time-year > span` | `color: var(--lime)`<br>`margin-left: 5px` |
| 74 | `top level` | `.track-heading` | `display: flex`<br>`justify-content: space-between`<br>`color: #bac6ac`<br>`font: 7px var(--mono)`<br>`letter-spacing: 0.09em`<br>`margin: 0 0 12px` |
| 75 | `top level` | `.track-heading > span:last-child` | `color: var(--lime)` |
| 76 | `top level` | `input[type="range"]` | `--progress: 0%`<br>`-webkit-appearance: none`<br>`appearance: none`<br>`width: 100%`<br>`height: 2px`<br>`background: linear-gradient( 90deg, var(--lime) var(--progress), #abb99a4d var(--progress) )`<br>`display: block`<br>`margin: 0`<br>`cursor: ew-resize`<br>`padding: 0`<br>`border: 0` |
| 77 | `top level` | `input[type="range"]::-webkit-slider-thumb` | `-webkit-appearance: none`<br>`width: 10px`<br>`height: 10px`<br>`border-radius: 0`<br>`background: var(--lime)`<br>`box-shadow: 0 0 0 4px #d4eaa918`<br>`cursor: ew-resize` |
| 78 | `top level` | `input[type="range"]::-moz-range-thumb` | `width: 10px`<br>`height: 10px`<br>`border: 0`<br>`border-radius: 0`<br>`background: var(--lime)`<br>`cursor: ew-resize` |
| 79 | `top level` | `.era-buttons` | `display: flex`<br>`justify-content: space-between`<br>`margin-top: 13px` |
| 80 | `top level` | `.era-buttons button` | `padding: 0`<br>`color: #b1bca6`<br>`min-width: 42px`<br>`text-align: center` |
| 81 | `top level` | `.era-buttons button:first-child` | `text-align: left` |
| 82 | `top level` | `.era-buttons button:last-child` | `text-align: right` |
| 83 | `top level` | `.era-buttons span` | `display: block`<br>`font: 10px var(--mono)` |
| 84 | `top level` | `.era-buttons small` | `display: block`<br>`font-size: 8px`<br>`margin-top: 5px`<br>`opacity: 0.65` |
| 85 | `top level` | `.era-buttons button.active` | `color: var(--lime)` |
| 86 | `top level` | `.era-buttons button:hover` | `color: var(--cream)` |
| 87 | `top level` | `.timeline-navigation` | `display: flex`<br>`gap: 8px`<br>`position: relative`<br>`justify-content: flex-end`<br>`padding-bottom: 17px` |
| 88 | `top level` | `.timeline-navigation button, .gallery-navigation button` | `width: 38px`<br>`height: 38px`<br>`border: 1px solid #c8d2b83b`<br>`border-radius: 50%`<br>`font-size: 16px` |
| 89 | `top level` | `.timeline-navigation button:not(:disabled):hover, .gallery-navigation button:hover` | `background: var(--lime)`<br>`color: #1a281e` |
| 90 | `top level` | `.timeline-navigation > span` | `position: absolute`<br>`bottom: -5px`<br>`right: 0`<br>`font: 7px var(--mono)`<br>`color: #acb99f`<br>`letter-spacing: 0.05em`<br>`white-space: nowrap` |
| 91 | `top level` | `.loading` | `position: fixed`<br>`inset: 0`<br>`z-index: 30`<br>`background: #1c2922`<br>`display: flex`<br>`align-items: center`<br>`justify-content: center`<br>`gap: 16px`<br>`font: 11px var(--mono)`<br>`color: var(--lime)`<br>`transition: opacity 0.6s` |
| 92 | `top level` | `.loading.loaded` | `opacity: 0`<br>`pointer-events: none` |
| 93 | `top level` | `.loading-symbol` | `width: 40px`<br>`height: 40px` |
| 94 | `top level` | `.loading-symbol svg` | `width: 100%`<br>`height: 100%`<br>`animation: spin 4s linear infinite` |
| 95 | `@keyframes spin` | `to` | `transform: rotate(360deg)` |
| 96 | `top level` | `.fallback` | `position: fixed`<br>`z-index: 6`<br>`left: 50%`<br>`top: 40%`<br>`transform: translateY(-50%)`<br>`max-width: 380px`<br>`background: #263429e8`<br>`padding: 30px`<br>`border: 1px solid var(--line)` |
| 97 | `top level` | `.fallback > span` | `font: 8px var(--mono)`<br>`color: var(--lime)` |
| 98 | `top level` | `.fallback h2` | `font-size: 40px` |
| 99 | `top level` | `.fallback p` | `font-size: 12px`<br>`line-height: 1.8`<br>`color: #b7c3ab` |
| 100 | `top level` | `.webgl-unavailable .scene-caption` | `display: none` |
| 101 | `top level` | `.webgl-unavailable #world` | `background: radial-gradient(ellipse at 70% 50%, #72785a, #1d2c23 70%)` |
| 102 | `top level` | `dialog` | `color: var(--cream)`<br>`background: #1d2a23`<br>`border: 1px solid #c4d3b329`<br>`padding: 0` |
| 103 | `top level` | `dialog::backdrop` | `background: #09150e55`<br>`backdrop-filter: blur(3px)` |
| 104 | `top level` | `dialog[open]` | `animation: drawer-in 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)` |
| 105 | `@keyframes drawer-in` | `from` | `opacity: 0`<br>`transform: translateX(30px)` |
| 106 | `@keyframes drawer-in` | `to` | `opacity: 1`<br>`transform: translateX(0)` |
| 107 | `top level` | `.drawer` | `position: fixed`<br>`inset: 0 0 0 auto`<br>`margin: 0`<br>`width: min(540px, 100%)`<br>`height: 100dvh`<br>`max-height: none`<br>`max-width: 100%`<br>`padding: 28px 38px 24px`<br>`overflow-y: auto`<br>`scrollbar-width: thin`<br>`scrollbar-color: #738467 transparent`<br>`box-shadow: -20px 0 80px #0c180d30` |
| 108 | `top level` | `.drawer-top` | `display: flex`<br>`justify-content: space-between`<br>`align-items: center`<br>`min-height: 30px`<br>`margin-bottom: 46px` |
| 109 | `top level` | `.drawer-top .eyebrow` | `font-size: 8px`<br>`color: #b6c5a5` |
| 110 | `top level` | `.close-button` | `border: 1px solid #b4c6a333`<br>`border-radius: 50%`<br>`width: 33px`<br>`height: 33px`<br>`display: grid`<br>`place-items: center`<br>`font-size: 14px`<br>`flex-shrink: 0` |
| 111 | `top level` | `.close-button:hover` | `color: var(--lime)`<br>`background: #cadfa510` |
| 112 | `top level` | `h2` | `font: 400 55px/1.02 var(--serif)`<br>`letter-spacing: -0.025em`<br>`margin: 0` |
| 113 | `top level` | `h2 em` | `color: #ccddaf`<br>`font-weight: 400` |
| 114 | `top level` | `.drawer-intro` | `font-size: 12px`<br>`line-height: 1.7`<br>`color: #aebda3`<br>`margin: 20px 0 34px` |
| 115 | `top level` | `.object-list` | `border-top: 1px solid var(--line)` |
| 116 | `top level` | `.object-row` | `width: 100%`<br>`display: grid`<br>`grid-template-columns: 20px 42px 1fr 20px`<br>`align-items: center`<br>`gap: 15px`<br>`text-align: left`<br>`border-bottom: 1px solid var(--line)`<br>`padding: 21px 0` |
| 117 | `top level` | `.object-row:hover` | `background: #c5dfaa08` |
| 118 | `top level` | `.object-number` | `font: 8px var(--mono)`<br>`color: #9db18d` |
| 119 | `top level` | `.object-icon` | `font-size: 27px`<br>`color: #c7dcae`<br>`text-align: center` |
| 120 | `top level` | `.object-row strong` | `font-weight: 400`<br>`font-size: 16px` |
| 121 | `top level` | `.object-row small` | `display: block`<br>`font: 8px var(--mono)`<br>`margin-top: 7px`<br>`color: #a7b99a` |
| 122 | `top level` | `.row-arrow` | `font-size: 20px`<br>`color: #c8dcab` |
| 123 | `top level` | `.drawer-foot` | `font: 7px var(--mono)`<br>`color: #a0b190`<br>`margin: 26px 0 5px`<br>`letter-spacing: 0.06em` |
| 124 | `top level` | `.detail-drawer` | `width: min(570px, 100%)` |
| 125 | `top level` | `.detail-drawer .drawer-top` | `margin-bottom: 28px` |
| 126 | `top level` | `.detail-heading .eyebrow` | `font-size: 8px`<br>`color: #b7cda4` |
| 127 | `top level` | `.detail-heading h2` | `margin-top: 14px`<br>`font-size: 55px` |
| 128 | `top level` | `.heading-period` | `color: var(--lime)` |
| 129 | `top level` | `.detail-heading > p` | `color: #adbd9e`<br>`font-size: 12px`<br>`margin: 15px 0 29px` |
| 130 | `top level` | `.text-button` | `font: 10px var(--mono)`<br>`color: #b7c9a4`<br>`padding: 7px 0` |
| 131 | `top level` | `.text-button:hover` | `color: var(--lime)` |
| 132 | `top level` | `.inspecting .intro` | `opacity: 0`<br>`transform: translateX(-30px)`<br>`pointer-events: none` |
| 133 | `top level` | `.inspecting .intro button` | `pointer-events: none` |
| 134 | `top level` | `.inspecting .room-marker` | `opacity: 0` |
| 135 | `top level` | `.inspecting .scene-shade` | `opacity: 0.3` |
| 136 | `top level` | `.project-visual` | `position: relative`<br>`min-height: 280px`<br>`background: #14221d`<br>`border: 1px solid #8ca4753b`<br>`padding: 16px 20px` |
| 137 | `top level` | `.code-top` | `font: 8px var(--mono)`<br>`color: #92a083`<br>`display: flex`<br>`justify-content: space-between`<br>`padding-bottom: 15px`<br>`border-bottom: 1px solid #a7b58d20` |
| 138 | `top level` | `.code-top > span:first-child` | `letter-spacing: 0.25em`<br>`font-size: 7px` |
| 139 | `top level` | `.code-art` | `font: 12px/1.9 var(--mono)`<br>`padding: 25px 0`<br>`color: #d3d9c3` |
| 140 | `top level` | `.code-art > span` | `color: #869f85` |
| 141 | `top level` | `.code-art > b` | `font-weight: 400`<br>`color: #d8bd8f` |
| 142 | `top level` | `.project-coordinate` | `position: absolute`<br>`right: 15px`<br>`bottom: 15px`<br>`font: 7px var(--mono)`<br>`color: #81977b` |
| 143 | `top level` | `.detail-section-label` | `font: 8px var(--mono)`<br>`color: #a6ba94`<br>`margin: 26px 0 13px` |
| 144 | `top level` | `.phase-buttons` | `display: flex`<br>`border: 1px solid #adbf983d` |
| 145 | `top level` | `.phase-buttons button` | `padding: 12px 4px`<br>`flex: 1`<br>`font-size: 9px`<br>`border-right: 1px solid #adbf983d`<br>`color: #a9ba98` |
| 146 | `top level` | `.phase-buttons button:last-child` | `border-right: 0` |
| 147 | `top level` | `.phase-buttons button.active` | `background: #cfdfa41a`<br>`color: var(--lime)` |
| 148 | `top level` | `.phase-buttons button:hover` | `background: #c4d5a626` |
| 149 | `top level` | `h3` | `font: 400 30px/1.15 var(--serif)`<br>`margin: 28px 0 14px` |
| 150 | `top level` | `#detail-content > p` | `font-size: 12px`<br>`line-height: 1.9`<br>`color: #b6c2a8` |
| 151 | `top level` | `.tags` | `display: flex`<br>`gap: 7px`<br>`flex-wrap: wrap`<br>`margin-top: 24px` |
| 152 | `top level` | `.tags > span` | `font: 8px var(--mono)`<br>`border: 1px solid #9cb48940`<br>`padding: 7px 9px`<br>`color: #a9bc98` |
| 153 | `top level` | `.detail-footer` | `display: flex`<br>`justify-content: space-between`<br>`border-top: 1px solid var(--line)`<br>`padding-top: 18px`<br>`margin-top: 35px`<br>`font: 7px var(--mono)`<br>`color: #8fa280` |
| 154 | `top level` | `.gallery` | `position: relative`<br>`overflow: hidden`<br>`background: #53674e` |
| 155 | `top level` | `.gallery > img` | `width: 100%`<br>`display: block`<br>`aspect-ratio: 1.32`<br>`object-fit: cover` |
| 156 | `top level` | `.image-badge` | `position: absolute`<br>`bottom: 14px`<br>`left: 14px`<br>`font: 7px var(--mono)`<br>`padding: 8px 10px`<br>`background: #17251dd9`<br>`color: #d2dcc5` |
| 157 | `top level` | `.gallery-navigation` | `display: flex`<br>`justify-content: space-between`<br>`align-items: center`<br>`margin-top: 15px` |
| 158 | `top level` | `.gallery-navigation > span` | `font: 9px var(--mono)`<br>`color: #b4c7a1` |
| 159 | `top level` | `.gallery-navigation > div` | `display: flex`<br>`gap: 8px` |
| 160 | `top level` | `.gallery-navigation button` | `width: 30px`<br>`height: 30px`<br>`font-size: 14px` |
| 161 | `top level` | `.photo-thumbs` | `display: flex`<br>`gap: 10px`<br>`margin-top: 24px` |
| 162 | `top level` | `.photo-thumbs button` | `width: calc(25% - 7px)`<br>`padding: 3px`<br>`border: 1px solid transparent`<br>`opacity: 0.5` |
| 163 | `top level` | `.photo-thumbs button.active` | `border-color: var(--lime)`<br>`opacity: 1` |
| 164 | `top level` | `.photo-thumbs button:hover` | `opacity: 1` |
| 165 | `top level` | `.photo-thumbs img` | `width: 100%`<br>`display: block` |
| 166 | `top level` | `.journal-page` | `background: #e0d6b9`<br>`color: #3b4635`<br>`padding: 32px 29px`<br>`box-shadow: 4px 5px 0 #b7b69d28` |
| 167 | `top level` | `.journal-date` | `font: 8px var(--mono)`<br>`color: #626c53` |
| 168 | `top level` | `.journal-page h3` | `font-size: 36px`<br>`margin-top: 32px` |
| 169 | `top level` | `.journal-page > p` | `font: 19px/1.6 var(--serif)` |
| 170 | `top level` | `.journal-sign` | `font: italic 21px var(--serif)`<br>`display: block`<br>`margin: 26px 0` |
| 171 | `top level` | `.journal-rule` | `height: 1px`<br>`background: #656c4b33`<br>`margin-top: 28px` |
| 172 | `top level` | `.journal-page .journal-postscript` | `font: 9px/2.6 var(--mono)`<br>`color: #697150`<br>`margin-bottom: 0` |
| 173 | `top level` | `.memory-meta` | `display: flex`<br>`justify-content: space-between`<br>`padding: 17px 0`<br>`border-top: 1px solid var(--line)`<br>`border-bottom: 1px solid var(--line)`<br>`font: 7px var(--mono)`<br>`color: #b4c6a1`<br>`margin-top: 25px` |
| 174 | `top level` | `.food-note` | `font: italic 26px/1.3 var(--serif)`<br>`color: #cfddbb`<br>`padding: 30px 12px 6px` |
| 175 | `top level` | `.travel-map` | `position: relative`<br>`background: #34452f`<br>`border: 1px solid #a7c48d3b`<br>`padding-bottom: 30px` |
| 176 | `top level` | `.travel-map svg` | `width: 100%`<br>`display: block` |
| 177 | `top level` | `.map-coordinate` | `position: absolute`<br>`bottom: 15px`<br>`left: 20px`<br>`font: 9px var(--mono)`<br>`color: #c5d7ac` |
| 178 | `top level` | `.place-list` | `margin-top: 25px` |
| 179 | `top level` | `.place-row` | `display: flex`<br>`gap: 17px`<br>`align-items: center`<br>`width: 100%`<br>`text-align: left`<br>`padding: 20px 0`<br>`border-top: 1px solid var(--line)` |
| 180 | `top level` | `.place-row > span:first-child` | `font: 8px var(--mono)`<br>`color: #96ad84` |
| 181 | `top level` | `.place-row > span:last-child` | `margin-left: auto`<br>`color: #a3bd8e` |
| 182 | `top level` | `.place-row strong` | `font-size: 13px`<br>`font-weight: 400` |
| 183 | `top level` | `.place-row small` | `display: block`<br>`line-height: 1.7`<br>`font-size: 10px`<br>`color: #9aaf8a`<br>`margin-top: 7px` |
| 184 | `top level` | `.place-row.active strong` | `color: var(--lime)` |
| 185 | `top level` | `.place-row:hover strong` | `color: var(--lime)` |
| 186 | `top level` | `.demo-note` | `font: 9px/1.9 var(--mono) !important`<br>`color: #94ab83 !important` |
| 187 | `top level` | `.game-canvas` | `width: 100%`<br>`height: auto`<br>`display: block`<br>`border: 1px solid #8ca4753b` |
| 188 | `top level` | `.game-status` | `font: 10px/1.7 var(--mono)`<br>`color: var(--lime)`<br>`min-height: 35px`<br>`margin: 15px 0 0` |
| 189 | `top level` | `.game-controls` | `display: flex`<br>`align-items: center`<br>`justify-content: space-between` |
| 190 | `top level` | `.dpad` | `display: flex`<br>`gap: 5px` |
| 191 | `top level` | `.dpad button` | `width: 33px`<br>`height: 33px`<br>`border: 1px solid #afc09640`<br>`border-radius: 3px` |
| 192 | `top level` | `.dpad button:hover` | `background: var(--lime)`<br>`color: #263923` |
| 193 | `top level` | `.about-dialog` | `width: min(600px, calc(100% - 30px))`<br>`padding: 50px`<br>`margin: auto`<br>`max-height: calc(100dvh - 30px)` |
| 194 | `top level` | `.about-dialog > .close-button` | `position: absolute`<br>`right: 20px`<br>`top: 20px` |
| 195 | `top level` | `.about-dialog > .eyebrow` | `color: #b7c9a4`<br>`font-size: 8px`<br>`margin-bottom: 30px` |
| 196 | `top level` | `.about-dialog h2` | `font-size: 61px` |
| 197 | `top level` | `.about-dialog > p` | `font-size: 12px`<br>`color: #b5c4a6`<br>`line-height: 1.9`<br>`margin-top: 24px` |
| 198 | `top level` | `.about-dialog > p strong` | `font-weight: 500`<br>`color: #d0dfbe` |
| 199 | `top level` | `.about-bottom` | `margin-top: 30px`<br>`padding-top: 22px`<br>`border-top: 1px solid var(--line)`<br>`display: flex`<br>`gap: 14px`<br>`flex-direction: column` |
| 200 | `top level` | `.about-bottom > span` | `font: 7px var(--mono)`<br>`color: #94aa84` |
| 201 | `top level` | `.about-bottom button` | `align-self: flex-start` |
| 202 | `top level` | `.sr-only` | `position: absolute`<br>`width: 1px`<br>`height: 1px`<br>`margin: -1px`<br>`padding: 0`<br>`overflow: hidden`<br>`clip: rect(0, 0, 0, 0)`<br>`white-space: nowrap`<br>`border: 0` |
| 203 | `top level` | `.reduced-motion *` | `animation: none !important`<br>`transition: none !important` |
| 204 | `@media (min-width: 1600px)` | `.intro` | `top: 25%` |
| 205 | `@media (min-width: 1600px)` | `.intro-copy` | `font-size: 15px` |
| 206 | `@media (min-width: 1600px)` | `.eyebrow` | `font-size: 10px` |
| 207 | `@media (min-width: 1600px)` | `.room-marker` | `bottom: 205px` |
| 208 | `@media (min-width: 1600px)` | `.timeline` | `padding-bottom: 34px` |
| 209 | `@media (min-width: 1600px)` | `.timeline-track` | `max-width: 1000px` |
| 210 | `@media (min-width: 1600px)` | `.scene-caption` | `top: 54%` |
| 211 | `@media (max-height: 800px) and (min-width: 701px)` | `.header` | `height: 90px` |
| 212 | `@media (max-height: 800px) and (min-width: 701px)` | `.intro` | `top: 23%` |
| 213 | `@media (max-height: 800px) and (min-width: 701px)` | `.intro .eyebrow` | `margin-bottom: 20px` |
| 214 | `@media (max-height: 800px) and (min-width: 701px)` | `h1` | `font-size: clamp(56px, 5.8vw, 85px)` |
| 215 | `@media (max-height: 800px) and (min-width: 701px)` | `.intro-copy` | `margin-top: 19px`<br>`margin-bottom: 18px`<br>`font-size: 12px` |
| 216 | `@media (max-height: 800px) and (min-width: 701px)` | `.small-note` | `margin-top: 13px` |
| 217 | `@media (max-height: 800px) and (min-width: 701px)` | `.room-marker` | `bottom: 155px` |
| 218 | `@media (max-height: 800px) and (min-width: 701px)` | `.timeline` | `padding-top: 22px`<br>`padding-bottom: 18px` |
| 219 | `@media (max-height: 800px) and (min-width: 701px)` | `.time-year` | `font-size: 40px` |
| 220 | `@media (max-height: 800px) and (min-width: 701px)` | `.drawer-top` | `margin-bottom: 30px` |
| 221 | `@media (max-height: 800px) and (min-width: 701px)` | `.object-row` | `padding: 17px 0` |
| 222 | `@media (max-width: 1000px)` | `.header-actions` | `gap: 18px` |
| 223 | `@media (max-width: 1000px)` | `.timeline` | `gap: 30px`<br>`grid-template-columns: 115px 1fr 100px` |
| 224 | `@media (max-width: 1000px)` | `.intro` | `left: 5%` |
| 225 | `@media (max-width: 1000px)` | `.scene-caption` | `right: 4%`<br>`top: 39%` |
| 226 | `@media (max-width: 1000px)` | `.small-note` | `max-width: 220px`<br>`line-height: 1.8` |
| 227 | `@media (max-width: 1000px)` | `.sound-label` | `display: none` |
| 228 | `@media (max-width: 1000px)` | `.drawer` | `width: min(510px, 70%)` |
| 229 | `@media (max-width: 1000px)` | `.detail-drawer` | `width: min(530px, 75%)` |
| 230 | `@media (max-width: 700px)` | `.header` | `height: 85px`<br>`padding: 0 6%` |
| 231 | `@media (max-width: 700px)` | `.brand` | `gap: 7px` |
| 232 | `@media (max-width: 700px)` | `.brand svg` | `width: 33px`<br>`height: 33px` |
| 233 | `@media (max-width: 700px)` | `.brand > span` | `font-size: 12px`<br>`letter-spacing: 0.2em` |
| 234 | `@media (max-width: 700px)` | `.brand small` | `font-size: 6px`<br>`margin-top: 5px` |
| 235 | `@media (max-width: 700px)` | `.archive-button` | `left: auto`<br>`right: 6%`<br>`transform: none`<br>`padding: 9px`<br>`font-size: 10px`<br>`gap: 8px` |
| 236 | `@media (max-width: 700px)` | `.archive-button .count` | `font-size: 8px`<br>`padding-left: 8px` |
| 237 | `@media (max-width: 700px)` | `.header-actions` | `position: fixed`<br>`top: 90px`<br>`right: 6%`<br>`gap: 16px` |
| 238 | `@media (max-width: 700px)` | `.utility` | `font-size: 9px` |
| 239 | `@media (max-width: 700px)` | `.about-button span` | `font-size: 13px`<br>`margin-left: 0` |
| 240 | `@media (max-width: 700px)` | `.intro` | `top: 20%`<br>`left: 7%`<br>`right: 7%` |
| 241 | `@media (max-width: 700px)` | `.intro .eyebrow` | `font-size: 7px`<br>`margin-bottom: 22px`<br>`letter-spacing: 0.09em` |
| 242 | `@media (max-width: 700px)` | `h1` | `font-size: clamp(57px, 12.7vw, 80px)` |
| 243 | `@media (max-width: 700px)` | `.intro-copy` | `font-size: 11px`<br>`line-height: 1.75`<br>`margin: 20px 0` |
| 244 | `@media (max-width: 700px)` | `.explore-button` | `font-size: 11px`<br>`gap: 38px`<br>`padding-bottom: 9px` |
| 245 | `@media (max-width: 700px)` | `.small-note` | `font-size: 7px`<br>`max-width: 230px`<br>`margin-top: 14px` |
| 246 | `@media (max-width: 700px)` | `.scene-shade` | `background: linear-gradient(90deg, #111e18b3, rgba(16, 24, 21, 0.4) 70%), linear-gradient(0deg, #111e18f0, transparent 40%, #111e1844 85%)` |
| 247 | `@media (max-width: 700px)` | `.scene-caption` | `display: none` |
| 248 | `@media (max-width: 700px)` | `.room-marker` | `left: 7%`<br>`bottom: 180px`<br>`gap: 13px` |
| 249 | `@media (max-width: 700px)` | `.room-number` | `font-size: 34px`<br>`padding-right: 13px` |
| 250 | `@media (max-width: 700px)` | `.room-marker div > span` | `font-size: 11px` |
| 251 | `@media (max-width: 700px)` | `.room-marker small` | `font-size: 8px`<br>`max-width: 230px`<br>`line-height: 1.7` |
| 252 | `@media (max-width: 700px)` | `.timeline` | `margin: 0 6%`<br>`padding: 20px 0 22px`<br>`grid-template-columns: 61px 1fr`<br>`gap: 18px` |
| 253 | `@media (max-width: 700px)` | `.time-label .eyebrow` | `font-size: 6px` |
| 254 | `@media (max-width: 700px)` | `.time-year` | `font-size: 32px` |
| 255 | `@media (max-width: 700px)` | `.track-heading` | `font-size: 6px`<br>`letter-spacing: 0.01em`<br>`margin-bottom: 13px` |
| 256 | `@media (max-width: 700px)` | `.track-heading > span:first-child` | `max-width: 155px` |
| 257 | `@media (max-width: 700px)` | `.track-heading > span:last-child` | `display: none` |
| 258 | `@media (max-width: 700px)` | `.era-buttons` | `margin-top: 13px` |
| 259 | `@media (max-width: 700px)` | `.era-buttons span` | `font-size: 9px` |
| 260 | `@media (max-width: 700px)` | `.era-buttons small` | `font-size: 7px` |
| 261 | `@media (max-width: 700px)` | `.timeline-navigation` | `display: none` |
| 262 | `@media (max-width: 700px)` | `.drawer, .detail-drawer` | `width: 100%`<br>`padding: 25px 26px` |
| 263 | `@media (max-width: 700px)` | `.drawer-top` | `margin-bottom: 35px` |
| 264 | `@media (max-width: 700px)` | `.drawer h2` | `font-size: 51px` |
| 265 | `@media (max-width: 700px)` | `.object-row` | `padding: 20px 0` |
| 266 | `@media (max-width: 700px)` | `.object-list` | `margin-top: 24px` |
| 267 | `@media (max-width: 700px)` | `.about-dialog` | `padding: 45px 27px 30px` |
| 268 | `@media (max-width: 700px)` | `.about-dialog h2` | `font-size: 50px` |
| 269 | `@media (max-width: 700px)` | `.about-dialog > p` | `font-size: 12px` |
| 270 | `@media (max-width: 700px)` | `.detail-drawer .drawer-top` | `margin-bottom: 25px` |
| 271 | `@media (max-width: 700px)` | `.detail-heading h2` | `font-size: 50px` |
| 272 | `@media (max-width: 700px)` | `.code-art` | `font-size: 11px` |
| 273 | `@media (max-width: 700px)` | `.fallback` | `left: 6%`<br>`right: 6%`<br>`max-width: none`<br>`top: 47%`<br>`transform: none`<br>`padding: 22px` |
| 274 | `@media (max-width: 700px)` | `.webgl-unavailable .intro` | `top: 18%` |
| 275 | `@media (max-width: 700px)` | `.webgl-unavailable .intro-copy, .webgl-unavailable .small-note, .webgl-unavailable .intro .explore-button` | `display: none` |
| 276 | `@media (max-width: 700px)` | `.fallback h2` | `font-size: 31px` |
| 277 | `@media (max-width: 700px)` | `.fallback p` | `font-size: 11px` |
| 278 | `@media (max-width: 700px)` | `.tooltip` | `display: none !important` |
| 279 | `@media (max-width: 700px)` | `.grain` | `opacity: 0.035` |
| 280 | `@media (max-width: 700px)` | `.game-status` | `font-size: 9px` |
| 281 | `@media (max-height: 700px) and (max-width: 700px)` | `.intro` | `top: 19%` |
| 282 | `@media (max-height: 700px) and (max-width: 700px)` | `h1` | `font-size: 54px` |
| 283 | `@media (max-height: 700px) and (max-width: 700px)` | `.intro .eyebrow` | `margin-bottom: 15px` |
| 284 | `@media (max-height: 700px) and (max-width: 700px)` | `.intro-copy` | `font-size: 10px`<br>`margin: 15px 0` |
| 285 | `@media (max-height: 700px) and (max-width: 700px)` | `.intro-copy br:last-child` | `display: none` |
| 286 | `@media (max-height: 700px) and (max-width: 700px)` | `.small-note` | `display: none` |
| 287 | `@media (max-height: 700px) and (max-width: 700px)` | `.room-marker` | `bottom: 142px` |
| 288 | `@media (max-height: 700px) and (max-width: 700px)` | `.timeline` | `padding-top: 15px`<br>`padding-bottom: 18px` |
| 289 | `@media (max-height: 700px) and (max-width: 700px)` | `.room-marker small` | `display: none` |
| 290 | `@media (max-height: 700px) and (max-width: 700px)` | `.room-number` | `font-size: 28px` |
| 291 | `@media (prefers-reduced-motion: reduce)` | `*, *::before, *::after` | `animation: none !important`<br>`transition: none !important` |
| 292 | `top level` | `:root` | `--accent: #ffc0a0`<br>`--theme-bg: #301c22`<br>`--panel: #2c2025`<br>`--theme-paper: #edd0b0`<br>`--theme-ink: #29131e`<br>`--ambient: #e9b4a0`<br>`color: var(--cream)`<br>`background: var(--theme-bg)` |
| 293 | `top level` | `body` | `background: var(--theme-bg)` |
| 294 | `top level` | `.scene-shade` | `background: linear-gradient( 90deg, color-mix(in srgb, var(--theme-bg), #000 32%) 0%, color-mix(in srgb, var(--theme-bg) 80%, transparent) 26%, transparent 65% ), linear-gradient( 0deg, color-mix(in srgb, var(--theme-bg), #000 20%), transparent 32%, transparent 80%, color-mix(in srgb, var(--theme-bg) 45%, transparent) )` |
| 295 | `top level` | `.brand small, .intro-copy, .small-note, .intro .eyebrow, .room-marker small, .utility, .drawer-intro, .drawer-foot, .drawer-top .eyebrow, .text-button, .object-number, .object-row small, .detail-heading > p, .era-object-spec, #detail-content > p, .detail-footer, .about-dialog > p, .about-bottom > span, .demo-note, .time-label .eyebrow, .track-heading, .era-buttons button, .timeline-navigation > span` | `color: var(--muted)` |
| 296 | `top level` | `h1 em, h2 em, .live-dot, .brand svg, .object-icon, .row-arrow, .explore-button span, .track-heading > span:last-child, .room-number, .heading-period, .detail-section-label, .detail-heading .eyebrow, .gallery-navigation > span, .game-status, .map-coordinate, .food-note, .place-row.active strong, .place-row:hover strong, .journal-sign` | `color: var(--accent)` |
| 297 | `top level` | `.live-dot, .sound-bars i` | `background: var(--accent)` |
| 298 | `top level` | `.archive-button` | `background: color-mix(in srgb, var(--panel) 40%, transparent)`<br>`border-color: var(--line)` |
| 299 | `top level` | `.archive-button:hover, .object-row:hover, .phase-buttons button:hover` | `background: color-mix(in srgb, var(--accent) 10%, transparent)` |
| 300 | `top level` | `.count, .timeline, .object-list, .object-row, .drawer-top, .phase-buttons, .phase-buttons button, .detail-footer, .tags > span, .memory-meta, .place-row, .about-bottom, .close-button, .game-canvas, .dpad button` | `border-color: var(--line)` |
| 301 | `top level` | `.count, .tags > span, .memory-meta, .phase-buttons button, .place-row small, .place-row > span:first-child, .close-button, .code-top` | `color: var(--muted)` |
| 302 | `top level` | `.tooltip, dialog, .drawer, .about-dialog, .loading, .fallback` | `background: var(--panel)`<br>`color: var(--cream)`<br>`border-color: var(--line)` |
| 303 | `top level` | `dialog::backdrop` | `background: color-mix(in srgb, var(--theme-bg) 35%, transparent)` |
| 304 | `top level` | `.tooltip small, .text-button:hover, .close-button:hover, .about-dialog > p strong, .about-dialog > .eyebrow` | `color: var(--accent)` |
| 305 | `top level` | `.timeline-navigation button, .gallery-navigation button` | `border-color: var(--line)` |
| 306 | `top level` | `.timeline-navigation button:not(:disabled):hover, .gallery-navigation button:hover, .dpad button:hover` | `background: var(--accent)`<br>`color: var(--theme-ink)` |
| 307 | `top level` | `.room-number` | `border-color: var(--line)` |
| 308 | `top level` | `.explore-button` | `border-color: color-mix(in srgb, var(--accent) 55%, transparent)` |
| 309 | `top level` | `.era-buttons button.active, .era-buttons button:hover, .phase-buttons button.active` | `color: var(--accent)` |
| 310 | `top level` | `.phase-buttons button.active` | `background: color-mix(in srgb, var(--accent) 14%, transparent)` |
| 311 | `top level` | `.era-object-spec` | `display: block`<br>`font: 7px/1.7 var(--mono)`<br>`letter-spacing: 0.05em`<br>`margin-top: -12px`<br>`margin-bottom: 21px` |
| 312 | `top level` | `.object-time-controls` | `margin: 0 0 24px` |
| 313 | `top level` | `.object-time-controls .detail-section-label` | `display: flex`<br>`justify-content: space-between`<br>`font-size: 7px`<br>`margin: 0 0 12px` |
| 314 | `top level` | `.object-time-controls .detail-section-label > span` | `color: var(--muted)` |
| 315 | `top level` | `.object-time-controls .phase-buttons button` | `padding: 10px 4px` |
| 316 | `top level` | `.phase-buttons button strong` | `font: 10px var(--mono)`<br>`display: block` |
| 317 | `top level` | `.phase-buttons button small` | `font-size: 7px`<br>`display: block`<br>`margin-top: 5px`<br>`color: var(--muted)` |
| 318 | `top level` | `.project-visual` | `background: color-mix(in srgb, var(--panel), #000 18%)`<br>`border-color: var(--line)` |
| 319 | `top level` | `.code-top` | `border-color: var(--line)`<br>`font-size: 7px`<br>`gap: 10px` |
| 320 | `top level` | `.code-art` | `color: var(--accent)`<br>`overflow-wrap: anywhere`<br>`font-size: 11px` |
| 321 | `top level` | `.project-coordinate` | `color: var(--muted)` |
| 322 | `top level` | `.era-project-0` | `border: 8px solid var(--theme-paper)`<br>`border-radius: 12px 12px 30px 12px` |
| 323 | `top level` | `.era-project-0 .code-art` | `letter-spacing: 0.035em` |
| 324 | `top level` | `.era-project-3` | `box-shadow: inset 0 0 60px color-mix(in srgb, var(--accent) 5%, transparent)`<br>`border-radius: 3px` |
| 325 | `top level` | `.image-badge` | `background: color-mix(in srgb, var(--panel) 90%, transparent)`<br>`color: var(--accent)` |
| 326 | `top level` | `.era-photo-0` | `filter: sepia(0.25)` |
| 327 | `top level` | `.era-photo-3` | `box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 6%, transparent)` |
| 328 | `top level` | `.photo-thumbs button` | `width: calc(33.333% - 7px)` |
| 329 | `top level` | `.photo-thumbs button.active` | `border-color: var(--accent)` |
| 330 | `top level` | `.journal-page` | `background: var(--theme-paper)`<br>`color: var(--theme-ink)`<br>`box-shadow: 4px 5px 0 var(--line)` |
| 331 | `top level` | `.journal-page .journal-sign, .journal-date, .journal-page .journal-postscript` | `color: color-mix(in srgb, var(--theme-ink) 70%, var(--theme-paper))` |
| 332 | `top level` | `.journal-rule` | `background: color-mix(in srgb, var(--theme-ink) 20%, transparent)` |
| 333 | `top level` | `.journal-era-2, .journal-era-3` | `border: 6px solid var(--theme-ink)`<br>`border-radius: 12px`<br>`box-shadow: 0 0 0 1px var(--line)` |
| 334 | `top level` | `.travel-map` | `background: color-mix(in srgb, var(--panel), var(--accent) 10%)`<br>`border-color: var(--line)`<br>`color: var(--accent)` |
| 335 | `top level` | `.demo-note` | `color: var(--muted) !important` |
| 336 | `top level` | `.traveller-readout` | `display: block !important`<br>`font: 7px/1.8 var(--mono) !important`<br>`color: var(--accent) !important`<br>`letter-spacing: 0.025em`<br>`margin-top: 7px` |
| 337 | `top level` | `.room-marker` | `bottom: 177px` |
| 338 | `top level` | `.person-study` | `position: relative`<br>`border: 1px solid var(--line)`<br>`background: linear-gradient( 145deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 75% )` |
| 339 | `top level` | `.person-portrait` | `display: block`<br>`width: 100%`<br>`height: auto`<br>`max-height: 360px` |
| 340 | `top level` | `.person-age` | `position: absolute`<br>`right: 23px`<br>`bottom: 22px`<br>`display: flex`<br>`gap: 10px`<br>`align-items: center`<br>`color: var(--accent)` |
| 341 | `top level` | `.person-age strong` | `font: 55px/0.9 var(--serif)` |
| 342 | `top level` | `.person-age span` | `font: 7px/1.8 var(--mono)`<br>`color: var(--muted)` |
| 343 | `top level` | `.person-costume` | `border-bottom: 1px solid var(--line)`<br>`padding: 20px 0` |
| 344 | `top level` | `.person-costume .eyebrow` | `font-size: 7px`<br>`color: var(--muted)` |
| 345 | `top level` | `.person-costume strong` | `font-size: 12px`<br>`display: block`<br>`margin-top: 7px`<br>`font-weight: 400`<br>`color: var(--accent)` |
| 346 | `top level` | `.life-thread` | `display: flex`<br>`justify-content: space-between`<br>`position: relative`<br>`margin: 25px 0`<br>`padding-top: 15px`<br>`border-top: 1px solid var(--line)` |
| 347 | `top level` | `.life-thread > div` | `position: relative`<br>`text-align: center`<br>`min-width: 25px`<br>`color: var(--muted)` |
| 348 | `top level` | `.life-thread > div:before` | `content: ""`<br>`position: absolute`<br>`top: -18px`<br>`left: 50%`<br>`width: 5px`<br>`height: 5px`<br>`background: var(--muted)`<br>`transform: translateX(-50%)` |
| 349 | `top level` | `.life-thread .active` | `color: var(--accent)` |
| 350 | `top level` | `.life-thread .active:before` | `background: var(--accent)`<br>`box-shadow: 0 0 0 4px var(--line)` |
| 351 | `top level` | `.life-thread span` | `font: 25px var(--serif)`<br>`display: block` |
| 352 | `top level` | `.life-thread small` | `font: 7px var(--mono)` |
| 353 | `top level` | `.linked-archive` | `margin-top: 30px` |
| 354 | `top level` | `.resource-card` | `padding: 20px`<br>`border: 1px solid var(--line)`<br>`margin-bottom: 12px`<br>`background: color-mix(in srgb, var(--accent) 3%, transparent)` |
| 355 | `top level` | `.resource-meta` | `display: flex`<br>`justify-content: space-between`<br>`gap: 10px`<br>`font: 7px var(--mono)`<br>`color: var(--muted)` |
| 356 | `top level` | `.resource-card h4` | `font: 28px/1.1 var(--serif)`<br>`font-weight: 400`<br>`margin: 18px 0 10px`<br>`color: var(--cream)` |
| 357 | `top level` | `.resource-card p` | `font-size: 11px`<br>`line-height: 1.8`<br>`color: var(--muted)`<br>`margin: 0 0 16px` |
| 358 | `top level` | `.resource-status` | `display: inline-block`<br>`font: 8px var(--mono)`<br>`padding: 5px 8px`<br>`border: 1px solid var(--line)`<br>`color: var(--accent)` |
| 359 | `top level` | `.resource-progress` | `display: block`<br>`margin: 16px 0 0` |
| 360 | `top level` | `.resource-progress > span` | `display: flex`<br>`justify-content: space-between`<br>`color: var(--muted)`<br>`font: 7px var(--mono)` |
| 361 | `top level` | `.resource-progress b` | `font-weight: 400`<br>`color: var(--accent)` |
| 362 | `top level` | `.resource-progress progress` | `width: 100%`<br>`height: 3px`<br>`display: block`<br>`margin-top: 10px`<br>`accent-color: var(--accent)`<br>`border: 0`<br>`background: var(--line)` |
| 363 | `top level` | `.resource-progress progress::-webkit-progress-bar` | `background: var(--line)` |
| 364 | `top level` | `.resource-progress progress::-webkit-progress-value` | `background: var(--accent)` |
| 365 | `top level` | `.resource-link` | `display: flex`<br>`justify-content: space-between`<br>`align-items: center`<br>`border-top: 1px solid var(--line)`<br>`padding-top: 15px`<br>`margin-top: 20px`<br>`font-size: 11px`<br>`color: var(--accent)` |
| 366 | `top level` | `.resource-link > span[aria-hidden]` | `font-size: 20px` |
| 367 | `top level` | `.resource-link:hover` | `text-decoration: underline` |
| 368 | `top level` | `.webgl-unavailable #world` | `background: radial-gradient( ellipse at 70% 50%, color-mix(in srgb, var(--accent) 25%, var(--panel)), var(--theme-bg) 70% )` |
| 369 | `@media (max-width: 700px)` | `.scene-shade` | `background: linear-gradient( 90deg, color-mix(in srgb, var(--theme-bg) 80%, transparent), color-mix(in srgb, var(--theme-bg) 24%, transparent) 80% ), linear-gradient(0deg, var(--theme-bg), transparent 45%)` |
| 370 | `@media (max-width: 700px)` | `.room-marker` | `bottom: 177px` |
| 371 | `@media (max-width: 700px)` | `.traveller-readout` | `font-size: 6px !important`<br>`max-width: 240px` |
| 372 | `@media (max-width: 700px)` | `.person-portrait` | `max-height: 300px` |
| 373 | `@media (max-width: 700px)` | `.object-time-controls .detail-section-label` | `font-size: 6px` |
| 374 | `@media (max-width: 700px)` | `.resource-card` | `padding: 17px` |
| 375 | `@media (max-width: 700px)` | `.code-art` | `font-size: 10px` |
| 376 | `@media (max-height: 800px) and (min-width: 701px)` | `.room-marker` | `bottom: 145px` |
| 377 | `@media (max-height: 800px) and (min-width: 701px)` | `.traveller-readout` | `font-size: 6px !important` |
| 378 | `@media (max-height: 700px) and (max-width: 700px)` | `.room-marker` | `bottom: 130px` |
| 379 | `@media (max-height: 700px) and (max-width: 700px)` | `.traveller-readout` | `display: none !important` |
