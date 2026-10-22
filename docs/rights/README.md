# Rights, provenance, and attribution

[Documentation home](../README.md) · [Architecture](../architecture/README.md) · [References](../reference/references.md) · [Asset register](../../ASSET_SOURCES.md) · [Third-party notices](../../THIRD_PARTY_NOTICES.md)

This guide records what is actually in this prototype, where it came from, and what to retain when sharing it. The source and bundled files were inspected on **21 October 2026**. It provides verifiable records and practical publishing steps; it cannot guarantee that a project will never receive a copyright or trademark claim.

## Start with the four different kinds of material

| Material | Examples here | What the record means |
| --- | --- | --- |
| Project-authored implementation and demo | Corridor geometry, procedural illustrations, fictional person, game, sample journal | Created for this prototype in the development session; see the [asset register](../../ASSET_SOURCES.md). No external model, photo, movie scene, or soundtrack is bundled for these elements. This does not itself choose a license for the project. |
| Licensed third-party runtime material | Three.js and five font binaries | Actual third-party material is delivered to the visitor. Retain the supplied copyright and permission notices. |
| Development and type tooling | Vite, TypeScript, type declarations, their transitive packages | Used to build/check the application. These packages are distinct from the production browser payload. Their exact local notices are preserved in the [dependency inventory](lock-inventory.md). |
| References and inspiration | Rachel Wei, Blink Industries, Interstellar, liminal/backrooms spaces, NASA's redshift explanation | References explain the direction and learning material. A credit or link does not give permission to copy someone else's models, photos, code, films, music, text, branding, or distinctive artwork. |

## The project's own license is still undecided

`package.json` marks the package `private: true` and does not declare a `license` field. There is no project-level `LICENSE` file. `private` prevents accidental npm publication; it does not grant visitors permission to reuse the project's own code or content.

These documents do not assign a copyright owner, assert ownership of somebody else's work, or silently apply MIT/OFL to the whole repository. If the owner wants an openly reusable educational project, they can choose a project license and add its terms separately. Existing third-party materials keep their own licenses regardless of that later decision. A source repository being readable is not, by itself, an open-source license.

## What a static release includes

`npm run build` creates `dist/`. Vite copies `public/` into that directory, so the three existing font notices travel with the five font files. The runtime Three.js license is also kept in [`public/licenses/three-LICENSE.txt`](../../public/licenses/three-LICENSE.txt); the public notice index is [`public/licenses/README.txt`](../../public/licenses/README.txt).

| In the source project | In the built website | Why it is present |
| --- | --- | --- |
| `public/licenses/three-LICENSE.txt` | `dist/licenses/three-LICENSE.txt` | Full MIT notice for the Three.js runtime |
| `public/licenses/README.txt` | `dist/licenses/README.txt` | Identifies the runtime library and locally bundled fonts |
| `public/fonts/dm-sans-OFL.txt` | `dist/fonts/dm-sans-OFL.txt` | DM Sans copyright and full OFL 1.1 |
| `public/fonts/ibm-plex-mono-OFL.txt` | `dist/fonts/ibm-plex-mono-OFL.txt` | IBM Plex copyright, reserved name, and full OFL 1.1 |
| `public/fonts/instrument-serif-OFL.txt` | `dist/fonts/instrument-serif-OFL.txt` | Instrument Serif copyright and full OFL 1.1 |

`docs/`, `ASSET_SOURCES.md`, and `THIRD_PARTY_NOTICES.md` are source documentation and are **not** automatically copied into `dist/`. Preserve them when distributing source or a learning archive. Keep the public notices when deploying only `dist/`. Do not assume a minifier preserves every third-party license comment; the separate runtime text exists independently of minified JavaScript.

## License conditions that matter to this implementation

### Three.js: MIT

The local `three@0.180.0` license names the three.js authors and requires its copyright and permission notice with copies or substantial portions of the software. Its full notice is reproduced in [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md) and the [runtime copy](../../public/licenses/three-LICENSE.txt). MIT permits modification and redistribution under its terms; it does not authorize copying unrelated artwork or imply endorsement by the library's maintainers. The [release-specific upstream license](https://github.com/mrdoob/three.js/blob/r180/LICENSE) is an additional reference.

### Fonts: SIL Open Font License 1.1

The three family-specific files in `public/fonts/` contain the full license and exact copyright notices. Keep them with redistributed font software. OFL permits bundling fonts in an app or website under its conditions, restricts selling the font by itself, and keeps the font software under OFL. Those font terms do not force the rest of the website or documents rendered with a font to use OFL. The authoritative text and use/modification guidance are available from the [SIL Open Font License site](https://openfontlicense.org/).

The IBM notice declares **“Plex”** as a Reserved Font Name. If making a modified font, follow the reserved-name rules and review the full license before distributing it. The local DM Sans and Instrument Serif notices do not declare a Reserved Font Name after their copyright lines. Preserve those exact notices rather than replacing them with a generic OFL template. A filename such as `normal-400.woff2` is a project asset filename, not proof of the font's complete original build history.

### Build tools and transitive packages

Most locked packages declare MIT; others declare Apache-2.0, BSD-3-Clause, or ISC. The Vite and Rollup notice files additionally cover code already bundled inside those tools. TypeScript has its own license and a separate `ThirdPartyNoticeText.txt`; both are preserved. See [dependencies.md](dependencies.md) for the direct dependencies, package graph, license-copy mechanism, and limitations. If redistributing tools or their source instead of only the built website, preserve their complete notices and applicable license conditions.

## References do not grant asset permissions

Rachel Wei and Blink Industries are named because the original brief used them as visual references. Interstellar informs the spatial metaphor of time. The general backrooms/liminal-space direction informs repetition and empty architecture. These references do not indicate a collaboration, sponsorship, asset license, or permission to clone their work. There are no copied film stills, movie dialogue, branded costume models, soundtrack recordings, portfolio screenshots, or backrooms images in the asset inventory.

The NASA page supports the meaning of redshift/blueshift. Its illustration is linked for learning and is not bundled. The original prompt also linked an OpenAI-hosted iridescent ribbon image; that image is not in this project's files or runtime requests. Its creator and license were not established from the supplied link, so the link is not treated as permission to embed it. See the [reference register](../reference/references.md) for exact scope and verification status.

## Add photographs, art, models, music, or text with a usable record

When replacing a procedural illustration with your own photograph, add the file and edit its content entry using [the content guide](../CONTENT.md). At the same time, add a row to [ASSET_SOURCES.md](../../ASSET_SOURCES.md) that records the exact file, creator, source, rights basis, and changes. This keeps the creative work and its provenance together.

For someone else's material, obtain a license or permission covering the intended distribution. For example, a model download page may permit use in a rendered video but have separate rules for distributing the model itself; a WebGL site sends the model to the visitor. A music service subscription is not automatically a license to redistribute its audio. Review the asset's actual terms instead of assuming a credit alone is enough.

Use this record for each new external asset:

```text
Project path:
Work title / original filename:
Creator / rights holder as stated by the source:
Source URL and version/release:
Date obtained:
License or written permission and where it is retained:
Allowed use relevant to this website:
Required attribution wording:
Changes made (crop, color, mesh edits, compression, etc.):
Consent/other rights relevant to real people or private material:
```

If a new person object portrays a real person, record the relevant consent for their image and biography; the current inhabitant is fictional. When writing about collaborators, use the names and project details they have authorized you to publish. A license for an image or model may not settle privacy, publicity, or trademark questions associated with its subject.

## Maintain the records when the project changes

1. After a dependency update, run `node scripts/audit-licenses.mjs --write` and inspect [lock-inventory.md](lock-inventory.md). Confirm versions, installed-license evidence, and any missing or changed notices.
2. If upgrading Three.js, refresh `public/licenses/three-LICENSE.txt` from that installed release's `LICENSE`, and update the version noted in the public index and root notices.
3. If replacing a font, retain its actual supplied copyright/license text and update the filename, binary version, and hash in the asset register.
4. When adding external creative material, retain its permission evidence and required attribution alongside the asset record. Remove or replace material whose rights do not cover the intended use.
5. Build the site and verify the license files are present in `dist/licenses/` and `dist/fonts/` before sharing that directory.

The audit script reads local package-root metadata and notices. It does not verify copyright ownership, inspect every line of bundled code, evaluate legal compatibility, scan creative assets, or certify compliance. It preserves evidence so maintainers can make informed decisions and review any unusual material in context.

## Further reading

Use [the reference register](../reference/references.md) to study the APIs and visual direction, [the asset register](../../ASSET_SOURCES.md) to find each shipped creative asset's origin, and [the dependency guide](dependencies.md) to understand the software inventory. Official web references were checked on **21 October 2026**; exact installed files remain the evidence for the versions actually used here.
