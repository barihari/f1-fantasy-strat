#!/usr/bin/env bash
set -euo pipefail

ctx="season/context-pack.md"

stat_mtime() {
  local f="$1"
  if stat -f %m "$f" >/dev/null 2>&1; then
    stat -f %m "$f"
    return 0
  fi
  # Linux fallback
  stat -c %Y "$f"
}

is_stale=0
reason=""

watched_files=(
  "season/team-state.md"
  "season/gap-catchup-strategy.md"
  "season/conversation-summaries.md"
  "league-rivals.md"
)

if [[ ! -f "$ctx" ]]; then
  is_stale=1
  reason="Context pack is missing."
else
  ctx_mtime="$(stat_mtime "$ctx")"

  # Include all race briefs (new or edited briefs should trigger a refresh).
  if [[ -d "season/race-recommendations" ]]; then
    while IFS= read -r -d '' f; do
      watched_files+=("${f#./}")
    done < <(find "season/race-recommendations" -maxdepth 1 -type f -name "race-*.md" -print0 2>/dev/null || true)
  fi

  for f in "${watched_files[@]}"; do
    [[ -f "$f" ]] || continue
    f_mtime="$(stat_mtime "$f")"
    if [[ "$f_mtime" -gt "$ctx_mtime" ]]; then
      is_stale=1
      reason="Some key files changed after the last context pack generation."
      break
    fi
  done
fi

if [[ "$is_stale" -eq 1 ]]; then
  echo "$(cat <<'JSON'
{
  "permission": "ask",
  "user_message": "Your `season/context-pack.md` may be stale. Run: `python3 scripts/build-context-pack.py` to refresh it (recommended after edits to team state / rivals / catch-up / conversation summaries / race briefs).",
  "agent_message": "Context-pack reminder hook: recommend regenerating the pack before continuing."
}
JSON
)"
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0

