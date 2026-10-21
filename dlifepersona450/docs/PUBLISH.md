# Publish the GitHub profile

[Manual](README.md) · [Appearance and account settings](APPEARANCE.md) · [Customization](CUSTOMIZE.md)

The identity kit is prepared locally. GitHub displays its README on the account profile after it is committed and pushed to a **public** repository named **`dlifepersona450`** owned by **`dlifepersona450`**, with a nonempty `README.md` at the root. A local remote URL or exported commit does not prove that publication has happened. [GitHub's profile README requirements](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme)

## Two destinations, one source of edits

```text
DLife workspace → dlifepersona450/DLife
  timefold/                first project
  dlifepersona450/          second project / profile source
    README.md         ┐
    assets/           │
    profile.json      ├── Git subtree export → dlifepersona450/dlifepersona450
    github-settings.json  │                    README.md
    docs/             ┘                       assets/  JSON files  docs/
```

The persona folder is an ordinary workspace directory. Do not initialize a nested Git repository or submodule. A normal workspace push stores both projects; the separate profile publication exports only committed contents of `dlifepersona450/`. Thus README images remain relative to assets inside the profile repository, while the TIMEFOLD source link intentionally points to the public workspace repository.

Create the two destinations and authenticate as `dlifepersona450` before the initial push. The intended public showcase needs the workspace to be public as well; otherwise visitors cannot open its TIMEFOLD source link. Repository visibility in [`github-settings.json`](../github-settings.json) is a suggestion, not a remote change. Full setup commands and publishing-script checks live in the workspace's `GITHUB.md`, available after publication in the [workspace repository](https://github.com/dlifepersona450/DLife/blob/main/GITHUB.md).

## Review and send the files

From the workspace root, review changes and commit the profile assets, docs, and README together. The optional asset export helper regenerates the five PNGs if SVGs changed; see [Customization](CUSTOMIZE.md#regenerate-upload-images).

Then run:

```bash
git push --set-upstream origin main
bash scripts/publish-profile.sh --check
bash scripts/publish-profile.sh --push
```

`--check` creates and inspects a local profile-only Git snapshot without contacting GitHub. `--push` sends that snapshot to the profile repository. The script refuses changed/untracked profile files and never forces a push over conflicting remote history. The full script implementation, each variable, and failure behavior are documented in the workspace guide.

After a successful push, open [the GitHub account](https://github.com/dlifepersona450). Inspect README images, narrow layout, dark/light themes, alt text, and the TIMEFOLD link. If an image is missing, confirm that it was committed inside the exported `assets/` directory and that the path matches letter case.

## Apply account and repository appearance

Publication updates the README and tracked files. Avatar, short bio, status, repository metadata, pins, and social preview are separate GitHub settings. Follow [Appearance](APPEARANCE.md) to upload `avatar.png`, set the optional status, choose pins, and upload `social-preview.png` in each repository's settings.

For the account sidebar name/bio, use `profile.json` through GitHub's Edit profile or the optional GitHub CLI. Confirm the authenticated username before applying it from the workspace:

```bash
gh api user --jq .login
gh api --method PATCH user --input dlifepersona450/profile.json
```

Only `profile.json` is the name/bio API payload. Do **not** submit `github-settings.json` to this endpoint; that file is a documented manual setup plan. Neither operation creates Instagram, Facebook, a personal website, or a deployed project URL.

## Update later

Keep the workspace as the source of edits. Commit, push the workspace, and rerun the profile publication whenever its README, local assets, metadata plan, or docs change. Uploading only the workspace does not refresh the profile repository. Editing the profile repository directly does not automatically import those changes back into this workspace; reconcile them before publishing again.

A new avatar or social card also needs its corresponding manual upload. Merely changing a PNG in Git does not replace GitHub's stored setting. TIMEFOLD-only source changes need their normal workspace push; publish the profile again if its feature text or copied screenshot changes too.

## If using only the standalone profile repository

Clone and edit it normally. `README.md`, `assets/`, both JSON files, and `docs/` are already at the root. A normal commit/push updates that repository; no subtree export is needed. Use `--input profile.json` when applying the short bio because it is no longer in a nested workspace directory.

The standalone export does not contain the workspace's `scripts/` tools or TIMEFOLD source folder. Export replacement PNGs locally or use the workspace helper, and keep the project link pointed at its actual source repository. Choose one editing source when maintaining both copies so they do not drift.
