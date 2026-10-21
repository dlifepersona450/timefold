# DLife

A workspace for exploring technology, combining ideas, and building things that invite curiosity.

| Project | What it explores | Start here |
| --- | --- | --- |
| **01 · TIMEFOLD** | A WebGL life archive combining liminal spaces, miniature worlds, and a navigable timeline | [Showcase and setup](timefold/README.md) · [Complete manual](timefold/docs/README.md) |
| **02 · DLife persona** | An anonymous GitHub identity with adaptive banners, an avatar, a portal mark, and project artwork | [Profile README](dlifepersona450/README.md) · [Identity kit](dlifepersona450/docs/APPEARANCE.md) · [Editing guide](dlifepersona450/docs/README.md) |

## GitHub destinations

The whole workspace is intended for **`dlifepersona450/DLife`**. The local `origin` remote points to `https://github.com/dlifepersona450/DLife.git`.

The profile has its own GitHub destination, **`dlifepersona450/dlifepersona450`**. Publishing copies the committed contents of `dlifepersona450/` to that repository's root, where GitHub can display its README on the account profile. There is one local repository for this workspace; the profile folder is an ordinary directory.

See [GitHub setup and publishing](GITHUB.md) for authentication, repository creation, the initial upload, and future updates. Configuring a remote URL does not create a repository or upload files.

## Work locally

For TIMEFOLD:

```bash
cd timefold
npm ci
npm run dev
```

For the persona, edit its Markdown and SVG directly. No build, account, or package installation is needed to edit or preview those files locally.

Project-specific documentation stays with each project. Dependencies, build output, environment files, and private-key files are excluded from Git. TIMEFOLD's asset and third-party notices remain in its folder; a workspace-wide source license has not been chosen.
