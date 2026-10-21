# Maintaining the DLife persona

[Public profile README](../README.md) · [Customization](CUSTOMIZE.md) · [Publishing](PUBLISH.md)

The public persona belongs to **DLife**, an anonymous person exploring technology, creative websites, games, apps, and adventure. Interests are described as interests, without invented qualifications, employers, follower counts, or platform accounts.

## File map

| File | Purpose and linkage |
| --- | --- |
| [`README.md`](../README.md) | The public-facing Markdown rendered on GitHub; links the banner and the featured TIMEFOLD project |
| [`assets/explorer-banner.svg`](../assets/explorer-banner.svg) | Original static vector artwork embedded through a relative image link in the README |
| [`profile.json`](../profile.json) | A separate `name`/`bio` payload for GitHub's account profile; it is not automatically read by the README |
| [`docs/README.md`](README.md) | This maintenance/navigation entry |
| [`docs/CUSTOMIZE.md`](CUSTOMIZE.md) | Where to change words, projects, artwork, and identity details |
| [`docs/PUBLISH.md`](PUBLISH.md) | How this folder becomes the standalone GitHub profile repository |

There are no application functions, dependency packages, API secrets, runtime variables, or build steps in the persona itself. Markdown provides content and navigation; SVG provides the banner; JSON holds optional account metadata. Their behavior and update boundaries are documented separately below.

The source folder is kept inside the DLife workspace. Publishing exports this folder as a standalone repository whose root contains the same README, assets, metadata, and maintenance docs. The workspace's TIMEFOLD project remains in its own folder and keeps its own complete manual.

## Preview

Open `README.md` in a Markdown preview and open the SVG in a browser to inspect the illustration. A local preview can approximate GitHub's layout; the final check is GitHub's rendered profile after publication. Check narrow layouts and both GitHub light and dark themes, especially heading contrast and image sizing.

Images and text are local. The README has no external badge service, visitor counter, generated contribution card, tracking pixel, or animated typing service. The project's GitHub links are normal outbound links.

## Asset origin

The explorer illustration is original SVG constructed for this persona. It contains its own shapes, colors, and text; it does not embed photos, film imagery, downloaded icons, external fonts, JavaScript, or a third-party avatar. Edit the vector source directly. Original artwork provenance does not select a repository-wide source license.

Start with [customization](CUSTOMIZE.md) to change the persona, then [publishing](PUBLISH.md) to put the committed version on the GitHub profile.
