# Customize the profile

[Manual](README.md) · [Public README](../README.md) · [Publishing](PUBLISH.md)

## Text and identity

Edit [`README.md`](../README.md) directly. Its introduction, interests, project description, and closing line are written for one anonymous person. Keep the public name **DLife** unless you deliberately choose another pseudonym. A legal name, location, age, employer, personal email, or external social account is not needed for this profile.

Use concrete descriptions of what you explore and build. Add a technology, credential, or completed project when it is accurate; the current profile does not claim a language list or professional background. The current workspace includes TIMEFOLD, so it can be featured as a real local project rather than a hypothetical one.

The absence of Instagram, Facebook, and a personal website is intentional. Add links when those destinations exist and you want them public. Do not leave placeholder destinations or `#` links in the profile.

## Featured projects

The TIMEFOLD link targets:

```text
https://github.com/dlifepersona450/DLife/tree/main/timefold
```

That link becomes available to others after the workspace is uploaded to a public repository. It is a source/showcase link, not a claim that a website is deployed. If the workspace is private, remove the featured project link or publish the project elsewhere and replace the URL.

To feature another project, add its actual title, a sentence describing its combination of ideas, and a working repository or deployment link. Keep descriptions short enough that the profile remains easy to scan. Project-specific installation instructions belong in the project's README.

## Banner artwork

Edit [`assets/explorer-banner.svg`](../assets/explorer-banner.svg). SVG is a text-based vector format; its `viewBox` defines the internal coordinate system. The README's image link embeds it without compiling or uploading it to an outside image provider.

| SVG part | What to change |
| --- | --- |
| Root `viewBox` and dimensions | Coordinate bounds and the banner's natural aspect ratio; preserve proportional scaling |
| `<title>` / `<desc>` | Accessible description of the visual; update these if the scene changes |
| `<defs>` | Reusable gradients, patterns, and clipping definitions; IDs are referenced with `url(#id)` |
| Groups, paths, circles, rectangles | The explorer, landscape, paths, portal, and geometric details; coordinates are local to their group transforms |
| `fill`, `stroke`, opacity | Palette, outlines, and layering; the artwork has its own colors independent of GitHub's page theme |
| `<text>` | Banner lettering; the SVG uses available system fonts rather than fetching licensed font files |
| README image alt text | A plain-language fallback for the embedded banner |

GitHub sanitizes and proxies displayed images. Keep the banner self-contained and static; external stylesheet links, JavaScript, interactive elements, and outside font requests are unnecessary. Edit the illustration rather than adding outside asset services. If replacing it with imported artwork, record that artwork's source and redistribution permission.

## Account bio

Edit [`profile.json`](../profile.json). The keys match the GitHub account-update API:

| Key | Meaning |
| --- | --- |
| `name` | The public display name; currently `DLife` |
| `bio` | The short text displayed in the GitHub account sidebar; keep it within GitHub's bio length limit |

This JSON contains public text only. It is neither a credential file nor a live synchronization setting. Applying it is a separate authenticated operation explained in the [publishing guide](PUBLISH.md). The JSON does not change the GitHub username, Git author identity, account email, avatar, or repository visibility.

## Linkage when renaming

The folder name, GitHub handle, special profile repository name, README destinations, publishing script destination, documentation, and local commit identity currently all refer to `dlifepersona450`. They are explicit values, not a dynamically generated configuration. Search the workspace for that username when renaming, and update the whole chain together. GitHub still needs the profile repository name to match the new account username.

## Review an edit

1. Preview the README and SVG; make sure the banner scales on narrow screens.
2. Check actual project destinations and image paths.
3. Confirm the short bio is accurate if you changed `profile.json`.
4. Commit the profile files in the workspace.
5. Run the local export check, then publish as described in [Publishing](PUBLISH.md).
