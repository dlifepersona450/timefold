# Put the identity kit on GitHub

[Manual](README.md) · [Customize the files](CUSTOMIZE.md) · [Publish](PUBLISH.md) · [Suggested settings](../github-settings.json)

The kit covers the parts of GitHub you can directly personalize: the profile README, avatar, public name and bio, optional status, pinned repositories, repository metadata, and repository sharing images. **GitHub has no separate profile cover upload like an X or Facebook cover.** The large explorer banner belongs inside the README. Uploading an avatar, committing a banner, and setting a repository's social preview are three separate actions. See [GitHub's profile elements](https://docs.github.com/en/account-and-profile/concepts/personal-profile).

The files are prepared locally. Their presence does not mean the account has changed or either repository has been published. Follow [Publishing](PUBLISH.md) for the repository upload, then place the account and repository assets using the steps here.

## Asset placement

| Asset | Dimensions | Where it appears | How to use it |
| --- | --- | --- | --- |
| [`explorer-banner.svg`](../assets/explorer-banner.svg) | 1400 × 500 | Top of the profile README in light mode or as the fallback | Keep the README's relative image reference |
| [`explorer-banner-dark.svg`](../assets/explorer-banner-dark.svg) | 1400 × 500 | Same README region when the dark media condition matches | Keep its `<source>` in the README's `<picture>` |
| [`explorer-banner-mobile.svg`](../assets/explorer-banner-mobile.svg) | 700 × 700 | Taller composition for narrow screens | Keep its narrow-screen `<source>` before the dark source |
| [`explorer-banner.png`](../assets/explorer-banner.png), [`explorer-banner-dark.png`](../assets/explorer-banner-dark.png), [`explorer-banner-mobile.png`](../assets/explorer-banner-mobile.png) | Same as their SVG sources | Optional reuse outside the README | Use in tools that require raster images; README uses SVG |
| [`avatar.png`](../assets/avatar.png) | 1024 × 1024 | GitHub account picture beside the profile and throughout GitHub | Upload under account Settings → Public profile → Profile picture |
| [`avatar.svg`](../assets/avatar.svg) | 1024 × 1024 | Editable source for the avatar | Edit this source, regenerate PNG, upload that PNG |
| [`mark.svg`](../assets/mark.svg) | 128 × 128 | Optional small identity accent in project artwork | Reuse the self-contained SVG; it is not a native GitHub badge or achievement |
| [`social-preview.png`](../assets/social-preview.png) | 1280 × 640 | Repository link cards on sites that display GitHub social previews | Upload under that repository's Settings → Social preview |
| [`social-preview.svg`](../assets/social-preview.svg) | 1280 × 640 | Editable source for the repository sharing card | Edit this source and regenerate PNG before uploading |
| [`timefold-preview.webp`](../assets/timefold-preview.webp) | Actual scene capture | Clickable featured-project image in the profile README | Replace with another real scene capture when the project changes |

The PNG upload assets have opaque backgrounds so their contrast does not depend on another site's background. The avatar keeps its important shapes near the center for GitHub's crop. Check the crop when uploading rather than stretching a wide banner into the avatar slot.

### Profile README banner

The README uses a responsive picture. The pattern below shows the file linkage; the public README is the maintained version.

```html
<picture>
  <source media="(max-width: 600px)" srcset="assets/explorer-banner-mobile.svg">
  <source media="(prefers-color-scheme: dark)" srcset="assets/explorer-banner-dark.svg">
  <img src="assets/explorer-banner.svg"
       alt="DLife, an anonymous explorer following ideas toward an open horizon."
       width="100%">
</picture>
```

The browser selects the **first matching source**. A narrow viewport therefore gets the mobile composition even when it also prefers dark colors. Wider dark views get the dark banner; wider light views get the default image. The fallback `img` also provides alt text and a usable source when no condition matches. All paths resolve inside the exported profile repository.

GitHub documents the `<picture>` and `prefers-color-scheme` pattern for README images. Media matching reflects browser/page behavior; check the published README in the GitHub themes you use rather than assuming a local mockup proves every theme. [GitHub writing quickstart](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github)

### Avatar, name, and bio

1. Open [GitHub's public profile settings](https://github.com/settings/profile) while signed in as `dlifepersona450`.
2. Under Profile picture, choose Edit → Upload a photo and select `assets/avatar.png` from this folder. Inspect the crop, then confirm the new picture.
3. Copy the name and bio from [`profile.json`](../profile.json) into their fields, then update the profile.
4. Leave location, company, public email, website, social accounts, and pronouns blank unless you choose to provide accurate information. There is currently no Instagram, Facebook, or personal website to link.

GitHub accepts PNG/JPG/GIF avatars below 1 MB and below 3000 × 3000 pixels; its quality recommendation is about 500 × 500. This kit supplies a 1024 × 1024 PNG for cropping within those bounds. Its bio limit is 160 characters. See [Profile reference](https://docs.github.com/en/account-and-profile/reference/profile-reference) and [Personalize your profile](https://docs.github.com/en/account-and-profile/tutorials/personalize-your-profile).

### Optional status

The settings plan suggests `🧭 Exploring the next idea`. To use it, open the avatar menu → Set status, enter the message and emoji, choose its visibility and expiration, then save. This is a suggestion, not a claim about current availability. Change or clear it whenever it no longer fits. Publishing README files does not set the status. [GitHub status instructions](https://docs.github.com/en/account-and-profile/tutorials/personalize-your-profile#setting-a-status)

### Featured work and pins

The README can link directly to the TIMEFOLD folder and show its screenshot. A GitHub pin selects a **repository or gist**, so it cannot separately pin `DLife/timefold` while TIMEFOLD remains a folder. Pin `dlifepersona450/DLife` to make the containing project collection easy to find.

After the public workspace repository exists, open your profile → Customize your pins → select `DLife` → Save pins. You may arrange up to six repositories and gists combined; there is no need to fill all six. Add future real repositories when they offer distinct work. [GitHub pin instructions](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/pinning-items-to-your-profile)

### Repository descriptions, topics, and sharing cards

For each destination in [`github-settings.json`](../github-settings.json), open its repository page and use the gear beside About to copy the suggested description and topics. Leave Website empty until a real deployment exists. A source-folder URL belongs in the README's project link rather than pretending to be a personal website. Topic names use lowercase letters, numbers, and hyphens; GitHub allows up to 20 with at most 50 characters each. [GitHub topic instructions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)

Then open that repository's Settings → Social preview → Edit → Upload an image and choose `assets/social-preview.png`. The plan uses the DLife identity card for both the profile repository and whole workspace. Future standalone project repositories can have their own project-specific cards. Merely committing the PNG does not select it in repository settings.

GitHub recommends 1280 × 640 for this preview, accepts PNG/JPG/GIF under 1 MB, and supports shared custom previews from public repositories. External sites may cache an older card, so inspect both the repository setting and the actual shared link when replacing it. This card customizes **repository links**; it does not configure arbitrary Open Graph tags for the account's profile URL. [GitHub social preview instructions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)

## Every settings field

[`github-settings.json`](../github-settings.json) is a **human-readable setup plan**. No script imports it and GitHub does not discover it. Do not pass it wholesale to `gh api user`: the actual name/bio API payload is the separate `profile.json`. Paths below are relative to this profile folder, which is also the exported repository root.

| Field | Meaning and linkage |
| --- | --- |
| `account` | Groups the suggested account identity and asset settings |
| `account.login` | Expected authenticated GitHub username; check it before editing account settings; changing this value alone does not rename an account |
| `account.profilePayload` | Path to `profile.json`, the single source of the suggested `name` and `bio`; avoids copying those strings into two JSON files |
| `account.avatarFile` | Local PNG to select in the account picture upload; its SVG is the editable source |
| `account.status` | Optional status suggestion; remove or ignore this object if no status is wanted |
| `account.status.message` | Human-facing status text; not derived from commit activity or a live progress service |
| `account.status.emoji` | Unicode emoji to select with the status text |
| `repositories` | Array of intended repository setup suggestions; does not imply those repositories exist |
| `repositories[].name` | Repository name under `account.login`; the profile entry must match the username |
| `repositories[].description` | Short About text summarizing that repository's actual contents |
| `repositories[].topics` | Array of relevant discovery topics; these describe project subjects, not verified personal qualifications |
| `repositories[].homepage` | Website field; intentionally an empty string because no deployment/personal website exists |
| `repositories[].visibility` | Intended visibility, `public` in this plan; changing the file does not change remote access settings |
| `repositories[].socialPreviewFile` | Local PNG to upload in that repository's Social preview settings; both entries can share the same identity card |
| `pins` | Ordered list of intended `owner/repository` pins; apply and arrange them through Customize your pins |

`profile.json` has just two fields: `name`, the public display name `DLife`, and `bio`, the short anonymous-person introduction. README prose is maintained separately because a short sidebar bio and a full profile introduction serve different lengths. Review both when changing the persona.

## Supported additions later

More project screenshots, a short current-learning note, a real demo link, or a small process sketch can fit naturally in the README when you have them. Keep achievements and statistics based on actual GitHub activity. GitHub owns its contribution graph and earned achievements; these assets do not fabricate or alter them. An externally hosted statistics image would introduce an additional dependency and is not part of this kit.

## Official references

These describe GitHub behavior, not licenses for this project's artwork. Checked while preparing this kit on 21 October 2026.

- [Managing a profile README](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme): matching username/repository, public visibility, nonempty root README.
- [Profile reference](https://docs.github.com/en/account-and-profile/reference/profile-reference): avatar formats, dimensions, and size.
- [Personalize your profile](https://docs.github.com/en/account-and-profile/tutorials/personalize-your-profile): public name, bio, optional fields, avatar, and status.
- [Writing quickstart](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github): responsive README images and theme selection.
- [Pinning items](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/pinning-items-to-your-profile): choosing and arranging repositories/gists.
- [Repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics): relevant metadata and valid topic names.
- [Repository social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview): upload location, image requirements, and sharing behavior.
