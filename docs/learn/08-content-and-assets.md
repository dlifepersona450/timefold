[Docs home](../README.md) · [Learning path](README.md) · Previous: [game](07-game.md) · Next: [verification](09-verification.md)

# 8. Add your work without breaking the timeline

The shortest useful authoring loop is: choose a chapter, choose a category, add a record, attach the asset/link, then verify that historical and current versions tell the intended story.

## Featured memory versus collection

Each category has a featured memory in `eraContent[i]`. Optional `resources[id]` arrays add multiple projects/posts/releases below it. This lets one workstation contain several projects instead of requiring a new 3D laptop for every item.

Use the complete [content guide](../CONTENT.md) for copy-ready schemas and examples. The [data reference](../reference/archive.md) explains every field and consumer.

## An example current project

Inside the existing 2026 content entry, append a project record to its existing collection:

```ts
{
  id: 'my-new-project',
  type: 'project',
  title: 'My new project',
  summary: 'What this version can do and what I am learning.',
  date: '2026-10-21',
  status: 'Prototype',
  progress: 40,
  url: 'https://example.com/my-project',
}
```

Replace the example destination with the real URL. This object belongs inside `eraContent[2].resources.projects`, not in the stable `objects` category catalog. Keep existing entries unless intentionally removing them.

The date does not choose the era or sort records. The array location and order do. The status/percentage are authored; no repository/CMS integration is implied.

## Preserve history deliberately

Use the same `id` in a later era to record a new snapshot of the same work. Give it the appropriate date, summary, status, progress, and version-specific link. Keep an early concept entry in its original era rather than replacing it with a modern description.

For multiple updates inside the same era, add posts/devlogs to `resources.journal` or update the current project's description/status. The current app does not automatically construct a dated sub-timeline from records.

## Use public assets correctly

A local file `public/photos/walk.jpg` is referenced as `/photos/walk.jpg`. Never use a filesystem path such as `/home/yourname/...` in a visitor-facing URL. A resource can link to a PDF, artwork, local standalone page, or game build under `public/`.

A gallery item uses optional `src` plus `alt`; omitting `src` retains original generated artwork. Changing a gallery image does not automatically replace the decorative frame texture in WebGL. If both should use the same photograph, extend the scene texture-loading path and document its loading/disposal behavior.

## Record provenance when you add an asset

For each new external photo, model, texture, music file, icon, or font, record where it came from, its creator/license, applicable permission, and whether it is actually bundled or only linked. Update [ASSET_SOURCES.md](../../ASSET_SOURCES.md) and preserve the required notices.

A reference link is not a license. A free download is not always permission to redistribute. Original procedural images in this repo have a different origin from third-party fonts and Three.js. [The rights guide](../rights/README.md) explains this distinction and the current project's unassigned source-license status.

## Compare four surfaces after editing

1. The index's era-specific object name/form.
2. The visible room/object and person.
3. The featured panel text/image.
4. Any resource card/link/progress bar.

An old physical computer with a future memory can be deliberate, but it should not be an accidental data-index mismatch. Complete the [verification lesson](09-verification.md) before sharing changes.
