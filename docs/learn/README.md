[Docs home](../README.md) · [Architecture](../architecture/README.md) · [References](../reference/README.md)

# Build-and-learn path

This path explains a sensible order for building an experience like TIMEFOLD. The source folder contains the complete working implementation; lesson snippets isolate one concept and are not replacements for the whole application. Use a separate scratch project for experiments rather than repeatedly replacing the production entry.

| Lesson | You will build / understand | Actual source to compare |
| --- | --- | --- |
| [1. Setup and build](01-setup.md) | Run and inspect a TypeScript/Vite/Three.js project | Package/config/HTML files |
| [2. Two visual layers](02-shell-and-scene.md) | DOM interface over a rendered scene | `main.ts`, `ui/shell.ts`, `ui/dom.ts`, `world.ts`, `style.css` |
| [3. Objects in a diorama](03-diorama.md) | Groups, local transforms, materials, layered depth, rigid batching | `temporal-objects.ts`, `scene/build.ts`, `scene/merge-static.ts` |
| [4. Time as data](04-time.md) | Chapter anchors, interpolation, shared palette, scheduled painting | `archive.ts`, `timeline.ts`, `scene/animation.ts`, `ui/timeline-view.ts` |
| [5. Picking and unfolding](05-interaction.md) | Pointer rays, identity, camera focus, dialogs, panel lifetimes | `scene/picking.ts`, `scene/animation.ts`, `main.ts`, `ui/detail.ts` |
| [6. A person across time](06-person.md) | Age/stage proportions and costume construction | `person.ts`, `portrait.ts` |
| [7. A game inside an object](07-game.md) | Isometric projection, rules, input, cleanup | `game.ts` |
| [8. Publishing memories into the archive](08-content-and-assets.md) | New projects/posts/art, links, snapshots, rights records | `archive.ts`, `public/` |
| [9. Verify and maintain](09-verification.md) | Type/build checks, browser review, documentation and notices | `scripts/`, docs, output |

Read the [glossary](../reference/glossary.md) when a term is unfamiliar. Use the [complete symbol index](../generated/SYMBOLS.md) to locate every helper and local variable discussed in a lesson.

After the lessons, use the [UI module reference](../reference/ui.md) and [scene module reference](../reference/scene.md) to trace the extracted functions file by file. The [performance reference](../reference/performance.md) connects their boundaries to frame scheduling, rigid mesh batches, stable hover, visibility pause, and shadow updates.

The lessons progress from a small mental model to the full system. They do not require a backend, account, React, GSAP, Blender, or downloaded 3D model. Those can be future extensions; the present implementation uses browser APIs and procedural geometry.
