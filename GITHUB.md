# GitHub setup and publishing

[Workspace](README.md) · [Profile editing manual](dlifepersona450/docs/README.md) · [Identity kit and settings](dlifepersona450/docs/APPEARANCE.md)

The GitHub account is [`dlifepersona450`](https://github.com/dlifepersona450), with the public name **DLife**. There are two destinations because GitHub requires the profile repository to have exactly the account's username.

| Destination | Contents | Visibility |
| --- | --- | --- |
| `dlifepersona450/DLife` | This whole workspace, including TIMEFOLD and the persona source | Choose public to share both projects, or private for personal storage |
| `dlifepersona450/dlifepersona450` | Only the contents of the `dlifepersona450/` directory | Public, required for the profile README |

The local `origin` is configured for the workspace URL. Repository creation and pushes require GitHub authentication. A local remote URL alone does not establish that either destination exists or has received files.

## Authenticate and create the destinations

Use GitHub in this session when available, or install the [official GitHub CLI](https://cli.github.com/) and run these commands from the `DLife` directory:

```bash
gh auth login --hostname github.com --git-protocol https --web
gh api user --jq .login
gh auth setup-git
```

Check that the printed login is `dlifepersona450`. The browser sign-in keeps passwords and tokens out of project files.

Create an empty public workspace repository so visitors can follow the featured TIMEFOLD link and inspect the source. For private personal storage, choose `--private` instead and remove or replace the public profile's TIMEFOLD link.

```bash
gh repo create dlifepersona450/DLife --public \
  --description "Creative technology experiments, TIMEFOLD, and the DLife persona"
```

Create an empty **public** profile repository:

```bash
gh repo create dlifepersona450/dlifepersona450 --public \
  --description "An anonymous explorer of technology, ideas, and adventures"
```

If a repository already exists, inspect and use it instead of running its create command. For a new destination, leave README, license, and .gitignore initialization off; the local commit provides its first content. Do not replace an existing repository's history to make these commands work.

## Upload the workspace and profile

The local workspace uses branch `main`. Its author name is `DLife` and its repository-local email is the GitHub-provided no-reply form for this account:

```text
345753314+dlifepersona450@users.noreply.github.com
```

Those settings apply to this repository only. They avoid putting a personal email or the machine's username into future commit metadata. A new clone needs its own local author settings; Git does not clone `.git/config`.

After reviewing `git status` and creating any missing local commit:

```bash
git remote -v
git log -1 --format='%h %an <%ae>'
git push --set-upstream origin main
bash scripts/publish-profile.sh --check
bash scripts/publish-profile.sh --push
```

The workspace push uploads every tracked project to `origin`. The profile script derives a separate commit history containing only `dlifepersona450/` and pushes that history to the profile repository's `main` branch. The profile's README and assets consequently sit at its root, so relative image links keep working. No nested `.git` directory, submodule, access-token file, or background synchronization is introduced.

Once the profile push succeeds, visit [the GitHub account](https://github.com/dlifepersona450). Its public profile README should show the banner and persona. Setting a remote, making a local commit, or running `--check` does not publish the profile.

## Set the account's short bio

The reviewed text is in [`dlifepersona450/profile.json`](dlifepersona450/profile.json). It contains only `name` and `bio`; links, account email, location, company, and social fields are outside this payload.

You can copy its text into GitHub's **Edit profile**, or apply it after confirming the authenticated account above:

```bash
gh api --method PATCH user --input dlifepersona450/profile.json
```

Updating the README does not automatically change the account's short bio, avatar, pinned repositories, or account settings.

## Apply the visual identity

The [appearance guide](dlifepersona450/docs/APPEARANCE.md) maps every asset to its supported GitHub placement. The reviewed [settings plan](dlifepersona450/github-settings.json) lists the avatar, status, repository descriptions/topics, and pin order; it is reference data, not an API request payload.

After publishing, upload [`avatar.png`](dlifepersona450/assets/avatar.png) as the account picture, upload [`social-preview.png`](dlifepersona450/assets/social-preview.png) under each repository's **Settings → Social preview**, and pin the workspace repository from the profile. TIMEFOLD is a folder in the workspace rather than a separately pinnable repository. Website and social fields stay empty.

The light/dark/mobile banners live inside the profile README's `<picture>` element. They do not require a separate account upload: GitHub has no native account cover-image field. The README also contains an actual TIMEFOLD screenshot copied into its own assets, so the standalone profile export has everything it needs.

## Regenerate uploadable images

Original SVGs remain the editable source. To export their five PNG counterparts, use a local Chrome or Chromium executable:

```bash
node scripts/export-profile-assets.mjs
```

Use `--browser /path/to/chrome` or the `DLIFE_CHROME_BIN` environment variable when Chrome is not found automatically. In a container that cannot run Chrome's sandbox, pass `--no-sandbox`. The script requires Node.js 18+ and local Chrome; there are no extra npm packages or internet requests. TIMEFOLD retains its own Node requirement.

[`scripts/export-profile-assets.mjs`](scripts/export-profile-assets.mjs) checks dimensions and a conservative 1,000,000-byte size limit before replacing existing exports. The avatar is 1024×1024; repository preview is 1280×640; banners are 1400×500 or 700×700. System-font availability can change the rasterized lettering, so inspect regenerated PNGs before publishing. Commit the SVG and PNG together.

| Function / binding | Responsibility |
| --- | --- |
| `workspace`, `assets` | Resolve the repository and profile-assets directory from the script's URL |
| `targets` | Explicit source/output base names and required widths/heights for the five exports |
| `parseArguments(args)` | Reads the optional browser path, environment override, and opt-in sandbox flag; rejects unsupported arguments |
| `findBrowser(preferred)` | Tries the requested executable or common Chrome/Chromium names with `--version`; reports a missing browser |
| `inspectPng(filename, target)` | Validates the PNG signature, reads IHDR dimensions, and enforces the export size limit; returns width/height/byte count |
| `renderAsset(browser, options, temporary, target)` | Writes a temporary HTML wrapper around the local SVG, invokes Chrome with a bounded runtime and explicit dimensions, and validates the screenshot |
| `source`, `output`, `page`, `imageUrl`, `args`, `result` | Per-export input/output paths, escaped file URL, browser argument array, and subprocess result; arguments are passed directly rather than executed as shell text |
| `main()` | Chooses a browser, makes a temporary browser/output directory, validates all exports, then copies them into the profile assets and prints each result |
| `renders`, `render`, `destination` | Validated temporary outputs and their committed-file destinations |
| `finally` cleanup | Removes the unique temporary directory after success or failure |
| Top-level `catch` | Prints the error message and sets exit code 1 |

Changing source SVG dimensions requires updating the matching target in the script. The script never publishes files or changes GitHub account settings. Documentation previews are separate browser captures, not outputs of this PNG exporter.

## Future changes

```bash
git add dlifepersona450
git commit -m "Update DLife profile"
git push origin main
bash scripts/publish-profile.sh --push
```

The script only exports committed profile files. Commit new images and documents as well as README edits. Its clean-directory check catches both changed tracked files and untracked additions. Updates made directly in GitHub's profile repository are not imported automatically; bring them into the workspace before the next publication. A conflicting push fails normally and is never forced.

TIMEFOLD-only changes need their normal commit and `git push origin main`; they do not need profile publication unless its featured-project text or banner also changes.

## Publishing script: every part

Source: [`scripts/publish-profile.sh`](scripts/publish-profile.sh).

| Part | Behavior |
| --- | --- |
| `set -euo pipefail` | Stops on command failures, unset bindings, and failed pipeline components |
| `mode` | First argument, defaulting to `--check`; accepts only `--check` or `--push`, rejecting extra arguments with exit code 2 |
| `workspace_root` | Resolves the script's parent directory independently of the caller's working directory |
| `profile_directory` | The folder exported by Git subtree; change it together with the folder name and documentation if renaming |
| `profile_repository` | The explicit profile push URL; the workspace `origin` remains separate |
| Repository/HEAD checks | Require the expected repository root and an existing commit |
| Tracked and untracked checks | Reject profile edits absent from the committed snapshot |
| `git cat-file -e` | Verifies that the committed export contains `README.md` |
| `profile_commit` | The commit SHA emitted by `git subtree split`; the split writes local Git objects without changing checked-out files or switching branches |
| `git ls-tree` | Lists exported root names so check mode exposes the publication layout |
| `--check` | Runs local checks/splitting only; makes no network requests |
| `--push` | Runs the same checks, then sends the split commit to the profile repository's `main` branch with an ordinary push |

The script requires Bash, Git, and the Git subtree helper. Git credentials and an existing destination repository are needed only for `--push`. It does not create repositories, change visibility, apply the account bio, upload uncommitted files, or alter `origin`. Those operations are explicit steps above.

## References

- [GitHub: managing a profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) — matching repository name, public visibility, and a nonempty root README.
- [GitHub: setting a commit email](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address) — repository-local author settings and no-reply addresses.
- [GitHub: updating the authenticated user](https://docs.github.com/en/rest/users/users#update-the-authenticated-user) — the `name`/`bio` update and required account permissions.
- [GitHub: subtree concepts](https://docs.github.com/en/get-started/using-git/about-git-subtree-merges) — maintaining a project directory within a larger repository.
- [Git's subtree helper source and command reference](https://github.com/git/git/tree/v2.34.1/contrib/subtree) — the `split`/`push` mechanism available in the inspected Git installation.
