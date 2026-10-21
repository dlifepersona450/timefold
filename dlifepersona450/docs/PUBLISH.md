# Publish the GitHub profile

[Manual](README.md) · [Customization](CUSTOMIZE.md)

GitHub displays the profile README from a **public** repository named **`dlifepersona450`** owned by **`dlifepersona450`**. A nonempty `README.md` must be at that repository's root. These are [GitHub's profile README requirements](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme).

## Two destinations, one working copy

```text
DLife workspace → dlifepersona450/DLife
  timefold/                first project
  dlifepersona450/          second project / profile source
    README.md  ───────┐
    assets/          ├── Git subtree export → dlifepersona450/dlifepersona450
    profile.json     │                         README.md
    docs/       ─────┘                         assets/  profile.json  docs/
```

The profile folder is an ordinary directory in the workspace. No submodule or nested repository needs initializing. A normal workspace push stores both projects, while the separate profile publication exports only the second project's committed contents.

Create the two destinations and authenticate as `dlifepersona450` before the initial push. Full commands and the publishing script's variables, checks, and failure behavior are in the workspace's `GITHUB.md`. In the workspace working copy, open that file at `DLife/GITHUB.md`; after publication it is available in the [workspace repository](https://github.com/dlifepersona450/DLife/blob/main/GITHUB.md).

From the workspace root, after committing the profile:

```bash
git push --set-upstream origin main
bash scripts/publish-profile.sh --check
bash scripts/publish-profile.sh --push
```

`--check` creates and inspects the local profile-only Git snapshot without contacting GitHub. `--push` sends that snapshot to the public profile repository. The script refuses changed/untracked profile files and never forces a push over conflicting remote history.

Relative links such as `assets/explorer-banner.svg` resolve within the profile repository once this folder becomes its root. Links to TIMEFOLD intentionally use its absolute GitHub repository URL because that project is outside this export.

## Update later

Edit and commit the source in the workspace. Push the workspace and rerun the profile publication. Uploading only the workspace does not update the profile repository. Editing the profile repository directly does not automatically change this working copy; reconcile those edits before publishing again.

For the account sidebar bio, edit `profile.json`, verify the authenticated username, and apply it separately from the workspace:

```bash
gh api user --jq .login
gh api --method PATCH user --input dlifepersona450/profile.json
```

The GitHub CLI is an optional authenticated way to apply the bio. You can also copy the name and bio into GitHub's **Edit profile**. Neither operation creates Instagram, Facebook, a personal website, or a project deployment.

## If you only have the standalone profile repository

Clone and edit that repository normally. `README.md`, `assets/`, `profile.json`, and `docs/` are already at its root; no subtree export is needed there. A normal commit and push updates the GitHub profile. In that checkout, use `--input profile.json` when applying the bio, because the file is no longer under a nested directory.

Choose the workspace as the source of edits when maintaining both repositories, so their copies do not drift. The root workspace's GitHub guide documents the initial authentication and publishing procedure without placing access tokens in source files.
