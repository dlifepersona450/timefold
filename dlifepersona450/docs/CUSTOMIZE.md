# Customize the profile

[Manual](README.md) · [Appearance and settings](APPEARANCE.md) · [Public README](../README.md) · [Publishing](PUBLISH.md)

## Words and identity

Edit [`README.md`](../README.md) directly. Its introduction, interests, project description, and closing line describe one anonymous person. Keep the public name **DLife** unless you deliberately choose another pseudonym. You do not need a legal name, location, age, employer, or personal email for this presentation.

Use concrete descriptions of what you explore and build. Add a technology, credential, or finished project when it is accurate. Interests in web, game, and app creation are not a claim of proficiency in every language. The current workspace includes TIMEFOLD, so the feature can show a real result.

Keep the absence of Instagram, Facebook, and a personal website in mind when editing links. Add those destinations only if they exist and you want them public. Avoid placeholder destinations, `#` links, or invented contact buttons.

The account's short sidebar name/bio live in [`profile.json`](../profile.json). The JSON fields `name` and `bio` match the optional GitHub account-update API payload; the `bio` must remain within 160 characters. They are applied separately from Markdown, as explained in [Publishing](PUBLISH.md). The suggested avatar, optional status, repository topics, sharing card, and pins are documented field by field in [Appearance](APPEARANCE.md#every-settings-field).

## README structure and linkage

| Part | Purpose | Update when |
| --- | --- | --- |
| Top `<picture>` | Chooses a mobile, dark, or default SVG through ordered media queries | A banner filename, mobile breakpoint, or composition changes |
| `<source media="…" srcset="…">` | Connects one browser media condition to one local image | Adding a new image variant; put the more specific condition first |
| Fallback `<img>` | Supplies a default image, width, and accessible alt text | Any replacement affects the image's meaning or filename |
| Introduction | Establishes DLife as one curious person | The wording or emphasis changes |
| Interests | Explains creative directions without claiming false credentials | Interests evolve |
| Featured TIMEFOLD image and project link | Shows the real scene and directs visitors to the source | The project appearance, name, or destination changes |
| TIMEFOLD progress sentence | States that the first version is built and has room for improvement | Its actual state changes; no automated update service is present |
| Project technology labels | Identify the actual TIMEFOLD stack | The implementation changes; these are not general expertise badges |
| `<details>` process note | Keeps the idea-building sequence available without lengthening the main view | The described process changes; `<summary>` is the clickable disclosure title |
| Closing GitHub link | Gives visitors the actual account destination | The username changes |

HTML groups such as `<picture>` and `<p>` must be closed. Keep blank lines around Markdown headings and lists so GitHub parses them correctly. Do not add JavaScript, iframe embeds, or custom CSS assumptions to the profile: the maintained design works as static Markdown and supported HTML.

The full [banner selection explanation](APPEARANCE.md#profile-readme-banner) shows the linkage and source order. The mobile source wins first; it is one shared narrow composition rather than a separate light/dark pair. The PNG banner copies are optional export assets; the README points to SVG for crisp scaling.

## Feature a new project

1. Add or finish the real project in the workspace or its own repository. Give that project a README with purpose, a real screenshot, setup, and current limitations.
2. Capture an actual result. Put a reasonably sized image under this profile's `assets/` with a descriptive filename, such as a project-name preview. Include meaningful alt text.
3. In the public README, add the title, one sentence explaining the idea, and the working repository or deployed-demo link. A folder in the workspace needs an absolute link like the current TIMEFOLD destination:

   ```text
   https://github.com/dlifepersona450/DLife/tree/main/timefold
   ```

4. Link the image to that same useful destination. Relative image paths should remain inside this profile folder so the standalone export contains them.
5. Put full installation instructions in the project README; keep the profile feature short. For a standalone repository, optionally add its metadata to `github-settings.json` and select it as a pin through GitHub.
6. Commit the new image and text, push the workspace, and publish the profile snapshot as described in [Publishing](PUBLISH.md).

The project URL above becomes available to other people only after the workspace has been uploaded publicly. It is a source/showcase destination, not a claim of a deployed personal website. TIMEFOLD is currently a folder, so pin its containing `DLife` repository rather than trying to pin the folder.

### Refresh the TIMEFOLD screenshot

The profile keeps [`assets/timefold-preview.webp`](../assets/timefold-preview.webp) as a local copy of a real scene capture. This avoids a fragile relative path that would leave the exported profile repository. Replacing TIMEFOLD's own screenshots does **not** automatically replace this copy.

Run TIMEFOLD locally, choose a representative era, wait for the camera/scene to settle, and capture the actual scene. Compare desktop and narrow views before choosing a crop. Preserve the screenshot's aspect ratio; a visible interface is fine when it helps explain the project. Copy the selected image into the profile, compress it as WebP, update alt text if necessary, and record any newly introduced external asset sources. Do not label a concept mockup as a capture of the working project.

## Edit the SVG artwork

The vector sources are [`explorer-banner.svg`](../assets/explorer-banner.svg), [`explorer-banner-dark.svg`](../assets/explorer-banner-dark.svg), [`explorer-banner-mobile.svg`](../assets/explorer-banner-mobile.svg), [`avatar.svg`](../assets/avatar.svg), [`mark.svg`](../assets/mark.svg), and [`social-preview.svg`](../assets/social-preview.svg). Open them in a browser to inspect the result, or edit them as text/vector artwork. Each is self-contained and static.

| SVG element or attribute | Meaning and linkage |
| --- | --- |
| Root `<svg width height viewBox>` | Natural dimensions and internal coordinate bounds; preserve proportional scaling and the intended upload size |
| `<title>` and `<desc>` | Accessible name and visual description; root `aria-labelledby` connects their IDs where present |
| `<defs>` | Reusable gradients, patterns, and clip paths; these definitions appear where other shapes reference their IDs |
| `id` and `url(#id)` | Connect a shape's fill/clip/filter to its definition; renaming one side requires renaming the other |
| `<g>` and `transform` | Group related shapes and move, rotate, or scale them together |
| `<path d="…">` | Vector outlines such as the landscape or explorer silhouette; path commands define connected segments in the local coordinate system |
| Rectangles, circles, ellipses, lines, polygons | Geometric details and scene structure; coordinates follow the current group transform |
| `fill`, `stroke`, `stroke-width`, opacity | Interior color, outline, outline thickness, and layering; keep important edges legible at small sizes |
| Gradient stops | Position, color, and opacity along a gradient; referenced through the gradient's ID |
| `<text>` | Lettering using available system fonts; text is part of the SVG rather than a Markdown heading |
| README `alt` text | Plain-language fallback for the embedded image; independent of the SVG title/description |

The assets share an explorer/portal vocabulary, but they are independent SVGs rather than generated variants of one source. When changing the identity or palette, review **all six** vector files for consistency. Keep the avatar's important geometry away from square corners because GitHub displays circular crops. Keep the social card legible when reduced to a small shared-link thumbnail.

Use the existing custom shapes and palette as the starting point. Keep SVGs free of external font/image references and scripts. If introducing outside artwork or icons, record their original source, license, permitted redistribution, and any required credit in the [asset-origin notes](README.md#asset-origin-and-rights).

### Named SVG definitions

These are the reusable IDs in the current sources. Each SVG has its own document scope, so `sky` in one image is independent of `sky` in another. Embedding separate files through `<img>` does not combine their IDs.

| Source | Accessibility IDs | Reusable visual definitions and their users |
| --- | --- | --- |
| `explorer-banner.svg` | `banner-title`, `banner-description` | `sky` fills the background; `portal` fills the inner portal; `portal-ring` colors the ring stroke; `foreground` fills the near ridge; `frame` clips the full image to rounded corners; `portal-window` clips the miniature landscape to its circle |
| `explorer-banner-dark.svg` | `dark-banner-title`, `dark-banner-description` | Same named visual roles as the light banner, with a separate dark palette |
| `explorer-banner-mobile.svg` | `mobile-title`, `mobile-description` | `sky` fills the background; `portal` fills the circle; `ridge` fills the near landscape; `frame` clips the square image's rounded corners; `portal-window` clips the inner landscape |
| `avatar.svg` | `avatar-title`, `avatar-description` | `sky` fills the background; `portal` fills the circle; `coat` fills the explorer's coat; `portal-window` clips the mountains inside the circle |
| `social-preview.svg` | `social-title`, `social-description` | `sky` fills the card background; `portal` fills the circle; `ridge` fills the foreground; `portal-window` clips the inner landscape |
| `mark.svg` | `mark-title`, `mark-description` | No `<defs>` or referenced gradient/clip IDs; its rectangle, four paths, and circle use direct colors |

For the banner and social card, the four text elements hold the small top line, `DLife` wordmark, descriptive subtitle, and interest line. Avatar and mark contain no text lettering. System font fallbacks keep the SVG self-contained, but glyph metrics may vary between operating systems; inspect the exported image after changing a font or phrase. The source's back-to-front order determines overlapping shapes: backgrounds and portal landscape come first, then foreground ridges/explorer and lettering. The light and dark wide banners share layout, while the mobile and social versions have their own coordinates for their different aspect ratios.

## Regenerate upload images

From the **DLife workspace root**, run:

```bash
node scripts/export-profile-assets.mjs
```

The optional workspace helper uses Node 18 or later and a locally installed Chrome/Chromium browser. It exports `avatar.png`, `social-preview.png`, and the three banner PNGs beside their SVG sources. It does not change SVGs, upload files, update account settings, or generate the README preview/contact sheet. The profile itself still needs no Node runtime to display.

To select a browser explicitly:

```bash
node scripts/export-profile-assets.mjs --browser /path/to/chrome
```

The helper also accepts `--no-sandbox` for environments that require it, such as this container's headless rendering. Its exact helper/variable reference and failure behavior are documented in the workspace's [GitHub guide](https://github.com/dlifepersona450/DLife/blob/main/GITHUB.md). In a standalone profile checkout the workspace helper is not included; use the workspace copy or export the SVGs to PNG with a trusted local vector/browser tool at their natural dimensions.

Open the exported PNGs and check dimensions and file size before upload. The avatar and social-preview PNGs must stay below GitHub's 1 MB upload limit. Reducing image complexity or optimizing the PNG can help if a future edit exceeds it. Upload the **new PNG** after regenerating; changing source files alone does not update GitHub's stored avatar or repository preview.

The `docs/showcase/` contact sheet and approximate README captures are documentation snapshots, not runtime inputs. If you change the design, refresh those separately with a real local browser capture, keeping them identified as previews of the prepared files.

## Rename consistently

The account handle, special profile repository name, folder name, public URLs, settings plan, publishing destination, and documentation currently refer to `dlifepersona450`. They are explicit values, not a centrally generated configuration. Search the workspace for the old handle when renaming, then review each occurrence. GitHub requires the profile repository name to match the current username. Changing `github-settings.json` alone does not rename repositories, migrate links, or change Git author identity.

## Review an edit

1. Preview the README and every modified SVG/PNG; check narrow screens and light/dark preferences.
2. Check the first matching `<picture>` source and each local image path.
3. Open real project destinations and read the alt text.
4. Confirm profile bio accuracy and upload sizes after any changes.
5. Update the settings plan and documentation snapshots when their represented content changes.
6. Commit all profile additions in the workspace; run the export check, then publish through the documented procedure.
