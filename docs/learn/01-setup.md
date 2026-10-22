[Docs home](../README.md) · [Learning path](README.md) · Next: [two visual layers](02-shell-and-scene.md)

# 1. Run, inspect, and rebuild

## What you need

Use a Node.js version compatible with the installed Vite 7 toolchain: 20.19+ or 22.12+; this project was developed with Node 22.22.2. npm is the package manager represented by the lockfile. A modern browser needs WebGL for the room, while the JavaScript archive index can still operate if WebGL initialization fails.

From the project directory:

```bash
node --version
npm --version
npm ci
npm run dev
```

`npm ci` installs the locked graph and expects the manifest/lockfile to agree. Use `npm install` when deliberately editing dependencies. Never run installation in an unrelated parent directory; first confirm the current folder contains this project's `package.json`.

Open the exact Local URL printed by Vite. The default is commonly `http://localhost:5173/`, but a busy port can produce a different one. A `file://` double-click is not a substitute: source modules, asset paths, and bundling are meant to run through the server.

## Explore before editing

1. Select each year and notice the room palette, hardware, person, and object names.
2. Open the archive index; choose the workstation, notebook, and person.
3. Use each panel's year controls to compare versions of the same category.
4. Open the sample local post from the childhood notebook.
5. Play the console's fragment game with keys and on-screen buttons.
6. Toggle sound in the header and ambient motion in About; try reduced motion at the operating-system/browser level.

This establishes what is implemented before you start extending it.

## Understand the toolchain

- Browser entry: `index.html` requests `src/main.ts`.
- `main.ts` coordinates the application; `ui/` owns markup/controls, `audio.ts` owns sound, and `world.ts` assembles the `scene/` modules.
- Vite serves/transforms modules during development and builds static output.
- TypeScript checks source shapes; it does not render a room.
- Three.js builds the WebGL scene; it does not manage the DOM dialogs.
- CSS styles the document layer; it does not change mesh roughness or camera projection.

The exact fields and commands are in [the build reference](../reference/build.md).

## Make one small edit

Change the present chapter's `name` in `src/archive.ts`. Save and reload if the dev server does not refresh automatically. Confirm the room marker and person-panel heading use the new name. Then change one project's summary and confirm that only its intended era is affected.

This demonstrates the direction of ownership: source data → controller → visible labels. The browser does not write your edits back to the file.

## Build and inspect the output

```bash
npm run build
npm run preview
```

The first command performs TypeScript checks, then builds `dist/`. The second serves that existing output, commonly on port 4173. Stop each foreground server with Ctrl+C when done. Preview is a local check, not publication.

Inspect `dist/` and compare it with source: bundled hashed JS/CSS differs from editable TypeScript, and `public/` files appear at output-root paths. Confirm `dist/licenses/three-LICENSE.txt` and the font OFL files are present.

## If building from an empty study folder

Create a separate folder, initialize an npm package in ES module mode, install Three.js plus TypeScript/Vite and matching declarations, then reproduce the documented package/config/HTML contracts. The current source files are the canonical complete example. Avoid copying `node_modules/` or editing `dist/`; reproduce those through commands. Preserve applicable notices when sharing copies.

## Checkpoint

You can explain which file the browser enters, what each tool does, where content is edited, how to preview a production build, and where license texts are carried. Continue to [the DOM/WebGL split](02-shell-and-scene.md).
