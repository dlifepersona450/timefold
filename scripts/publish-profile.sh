#!/usr/bin/env bash
# Extract only the committed profile directory; upload only with --push.
set -euo pipefail

mode="${1:---check}"
if [[ $# -gt 1 || ( "$mode" != "--check" && "$mode" != "--push" ) ]]; then
  printf '%s\n' 'Usage: bash scripts/publish-profile.sh [--check|--push]' >&2
  exit 2
fi

workspace_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
profile_directory="dlifepersona450"
profile_repository="https://github.com/dlifepersona450/dlifepersona450.git"
cd -- "$workspace_root"

if [[ "$(git rev-parse --show-toplevel)" != "$workspace_root" ]]; then
  printf '%s\n' 'Run this script from the DLife workspace repository.' >&2
  exit 1
fi
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  printf '%s\n' 'Commit the workspace before preparing the profile.' >&2
  exit 1
fi
if ! git diff --quiet HEAD -- "$profile_directory/" \
  || [[ -n "$(git ls-files --others --exclude-standard -- "$profile_directory/")" ]]; then
  printf '%s\n' 'Commit your profile edits and new files before publishing.' >&2
  exit 1
fi
if ! git cat-file -e "HEAD:$profile_directory/README.md" 2>/dev/null; then
  printf '%s\n' 'The committed profile directory must contain README.md.' >&2
  exit 1
fi

# Git subtree produces history whose root is this directory, without switching
# branches or creating a nested repository. Check mode makes no network request.
profile_commit="$(git subtree split --quiet --prefix="$profile_directory" HEAD)"
printf 'Profile destination: %s\nProfile commit: %s\nRoot files:\n' "$profile_repository" "$profile_commit"
git ls-tree --name-only "$profile_commit"

if [[ "$mode" == "--push" ]]; then
  # A normal push rejects conflicting remote history; this script never forces it.
  git push "$profile_repository" "$profile_commit:refs/heads/main"
else
  printf '\n%s\n' 'Local check complete. Use --push after the public profile repository exists and Git authentication is ready.'
fi
