#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
SHA="${1:-$(git rev-parse HEAD)}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh not found. Install: brew install gh && gh auth login"
  echo "More options: docs/github-checks.md"
  exit 1
fi

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)" || {
  echo "Could not detect repo. Run from a clone with gh auth, or see docs/github-checks.md"
  exit 1
}

echo "Commit: $SHA"
echo "Repo:   $REPO"
echo ""

gh api "repos/${REPO}/commits/${SHA}/check-runs" --jq -r '
  .check_runs
  | sort_by(.name)
  | .[]
  | "\(.name)\n  status: \(.status)  conclusion: \(.conclusion // "-")\n  \(.html_url)\n"
'
