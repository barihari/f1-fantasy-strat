# GitHub commit checks (red X / 0/1)

A red **X** on a commit means at least one **status check** failed (often **Vercel** deploy or **lint** in `web/`). `git show` only shows the diff, not CI logs.

## Quick: script from repo root

```bash
./scripts/check-commit-checks.sh          # uses HEAD
./scripts/check-commit-checks.sh 6f48fa3  # specific SHA
```

Requires [GitHub CLI](https://cli.github.com/) (`brew install gh`) and `gh auth login`.

## GitHub CLI (manual)

```bash
# List recent workflow runs on main
gh run list --repo "$(gh repo view --json nameWithOwner -q .nameWithOwner)" --branch main --limit 8

# Checks attached to one commit (name, status, link)
gh api "repos/$(gh repo view --json nameWithOwner -q .nameWithOwner)/commits/$(git rev-parse HEAD)/check-runs" \
  --jq '.check_runs[] | "\(.name)\t\(.conclusion // .status)\t\(.html_url)"'
```

Open the printed URL for full logs.

## Reproduce locally (Next app)

Most failures are ESLint or build:

```bash
cd web && npm ci && npm run lint && npm run build
```

## REST API without `gh`

Use a [personal access token](https://github.com/settings/tokens) with `repo` scope:

```bash
export GITHUB_TOKEN=ghp_...
OWNER=barihari
REPO=f1-fantasy-strat
SHA=6f48fa3
curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$OWNER/$REPO/commits/$SHA/check-runs" \
  | jq -r '.check_runs[] | "\(.name)\t\(.conclusion)\t\(.details_url)"'
```
