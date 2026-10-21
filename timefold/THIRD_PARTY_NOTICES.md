# Third-party notices

[Documentation home](docs/README.md) · [Rights guide](docs/rights/README.md) · [Asset sources](ASSET_SOURCES.md) · [Complete dependency inventory](docs/rights/lock-inventory.md)

This register identifies the third-party runtime files and preserves their notice locations, plus complete installed build-tool notices. Inspected **21 October 2026**. It does **not** license the project's own code or artwork and does not claim permission for reference-only third-party creative works.

## Three.js 0.180.0 — runtime

Source: [mrdoob/three.js, r180](https://github.com/mrdoob/three.js/tree/r180). Local original: `node_modules/three/LICENSE`. Exact retained copies: [documentation copy](docs/rights/licenses/three-0.180.0-LICENSE) and [public runtime copy](public/licenses/three-LICENSE.txt). The latter is copied into `dist/licenses/three-LICENSE.txt` by Vite.

The full notice below is reproduced from the installed package:

```text
The MIT License

Copyright © 2010-2025 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Fonts — runtime

All five WOFF2 files are distributed under **SIL Open Font License 1.1**. Full license texts and each family's exact copyright notices are retained in the source paths below and are copied unchanged into `dist/fonts/` with the font files. Those linked files are part of this notice register; retain them in distribution.

| Family | Shipped font files under `public/fonts/` | Exact full notice |
| --- | --- | --- |
| DM Sans | `dm-sans-normal-400.woff2` | [dm-sans-OFL.txt](public/fonts/dm-sans-OFL.txt) |
| IBM Plex Mono | `ibm-plex-mono-normal-400.woff2`, `ibm-plex-mono-normal-500.woff2` | [ibm-plex-mono-OFL.txt](public/fonts/ibm-plex-mono-OFL.txt) |
| Instrument Serif | `instrument-serif-normal-400.woff2`, `instrument-serif-italic-400.woff2` | [instrument-serif-OFL.txt](public/fonts/instrument-serif-OFL.txt) |

```text
Copyright 2014 The DM Sans Project Authors (https://github.com/googlefonts/dm-fonts)
Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"
Copyright 2022 The Instrument Serif Project Authors (https://github.com/Instrument/instrument-serif)
```

These copyright lines are an index, not a replacement for the full family-specific notices. Binary versions, byte counts, source-family links, and SHA-256 hashes are in [ASSET_SOURCES.md](ASSET_SOURCES.md#bundled-font-files). Read the full notices before modifying or redistributing the font software.

## Development tooling and declaration packages

The complete installed package-root notice files are preserved under `docs/rights/licenses/` with package name and locked version in their filenames. These are exact byte copies, including notices for dependencies already bundled into tools. Individual links for every installed locked package are in [lock-inventory.md](docs/rights/lock-inventory.md). The [JSON inventory](docs/rights/dependency-inventory.json) includes the original path and hash for each copy.

| Main tool | Locked version | Complete retained notice file(s) |
| --- | --- | --- |
| Vite | 7.3.7 | [LICENSE.md including bundled dependencies](docs/rights/licenses/vite-7.3.7-LICENSE.md) |
| TypeScript | 5.9.3 | [LICENSE.txt](docs/rights/licenses/typescript-5.9.3-LICENSE.txt), [ThirdPartyNoticeText.txt](docs/rights/licenses/typescript-5.9.3-ThirdPartyNoticeText.txt) |
| `@types/three` | 0.180.0 | [LICENSE](docs/rights/licenses/types__three-0.180.0-LICENSE) |
| Rollup | 4.64.12 | [LICENSE.md including bundled dependencies](docs/rights/licenses/rollup-4.64.12-LICENSE.md) |
| esbuild | 0.28.2 | [LICENSE.md](docs/rights/licenses/esbuild-0.28.2-LICENSE.md) |

These development packages are not automatically part of the production site's application bundle. If redistributing a development environment, archive, tool binary, or dependency source, retain the applicable upstream license and notice files with that material. Optional platform packages absent locally have only their declared lockfile license recorded; that is explicitly indicated in the inventory. Some installed native packages have no package-root license text, so their metadata is recorded without inventing a notice.

## Inspiration and acknowledgments

The project brief named Rachel Wei, Blink Industries, Interstellar, and backrooms/liminal spaces. They are acknowledged as references in the [reference register](docs/reference/references.md), not as licensors or contributors to the bundled asset set. The NASA Doppler-shift page supports the artistic red/blue metaphor. No asset license is inferred from those citations and no endorsement is asserted.
