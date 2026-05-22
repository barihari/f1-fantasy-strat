#!/usr/bin/env python3
from __future__ import annotations

import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable, Optional


@dataclass(frozen=True)
class ExtractSpec:
    path: str
    title: str
    include_whole_file: bool = False
    headings: tuple[str, ...] = ()
    max_lines: Optional[int] = None
    # If set, extract the *last* block starting at a matching heading (e.g. last "## " section).
    last_heading_prefix: Optional[str] = None


HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")


def repo_root() -> str:
    here = os.path.abspath(os.path.dirname(__file__))
    return os.path.abspath(os.path.join(here, ".."))


def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def find_latest_race_brief_path(root: str) -> Optional[str]:
    directory = os.path.join(root, "season", "race-recommendations")
    if not os.path.isdir(directory):
        return None

    try:
        names = os.listdir(directory)
    except OSError:
        return None

    candidates = sorted(
        [n for n in names if n.startswith("race-") and n.endswith(".md") and "-draft" not in n]
    )
    if not candidates:
        return None
    return os.path.join(directory, candidates[-1])


def heading_level(line: str) -> Optional[int]:
    m = HEADING_RE.match(line)
    if not m:
        return None
    return len(m.group(1))


def extract_heading_block(text: str, heading_text: str) -> Optional[str]:
    """
    Extract a markdown block starting at an exact heading line like:
      '## Budget' or '### Chip Strategy'
    and ending at the next heading of level <= current heading's level.
    """
    lines = text.splitlines()
    target = heading_text.strip()

    for i, line in enumerate(lines):
        if line.strip() != target:
            continue

        lvl = heading_level(line)
        if lvl is None:
            continue

        j = i + 1
        while j < len(lines):
            nxt_lvl = heading_level(lines[j])
            if nxt_lvl is not None and nxt_lvl <= lvl:
                break
            j += 1

        block = "\n".join(lines[i:j]).rstrip() + "\n"
        return block

    return None


def extract_many_heading_blocks(text: str, headings: Iterable[str]) -> str:
    parts: list[str] = []
    for h in headings:
        block = extract_heading_block(text, h)
        if block:
            parts.append(block)
    return "\n".join(parts).strip() + ("\n" if parts else "")


def extract_last_top_level_block(text: str, prefix: str, max_lines: Optional[int]) -> str:
    """
    Extract from the last heading that begins with `prefix` (e.g. '## ')
    to end-of-file. Optionally cap lines.
    """
    lines = text.splitlines()
    idx = None
    for i, line in enumerate(lines):
        if line.startswith(prefix):
            idx = i
    if idx is None:
        return ""

    block_lines = lines[idx:]
    if max_lines is not None:
        block_lines = block_lines[:max_lines]
    return "\n".join(block_lines).rstrip() + "\n"


def cap_lines(text: str, max_lines: Optional[int]) -> str:
    if max_lines is None:
        return text
    lines = text.splitlines()
    return "\n".join(lines[:max_lines]).rstrip() + ("\n" if lines else "")


def build_pack(root: str) -> tuple[str, list[str]]:
    inputs_used: list[str] = []

    latest_brief_path = find_latest_race_brief_path(root)
    latest_brief_rel = (
        os.path.relpath(latest_brief_path, root) if latest_brief_path else "(none found)"
    )

    specs: list[ExtractSpec] = [
        ExtractSpec(
            path=os.path.join(root, "season", "team-state.md"),
            title="1) Team State (Trimmed)",
            headings=(
                "## Current Lineup (Pre-Transfer)",
                "## Budget",
                "## Transfers",
                "## Chips Status",
                "## Rival Context",
            ),
        ),
        ExtractSpec(
            path=os.path.join(root, "league-rivals.md"),
            title="2) Rivals Snapshot",
            include_whole_file=True,
            max_lines=220,
        ),
        ExtractSpec(
            path=os.path.join(root, "season", "gap-catchup-strategy.md"),
            title="3) Gap Catch-up Strategy (Key Sections)",
            headings=(
                "## The Core Problem",
                "## Chip Sequencing Plan",
                "## Three Scenarios",
                "## Monaco Chip Note",
            ),
        ),
        ExtractSpec(
            path=os.path.join(root, "season", "conversation-summaries.md"),
            title="4) Latest Conversation Decisions (Most Recent Block)",
            last_heading_prefix="## ",
            max_lines=140,
        ),
    ]

    if latest_brief_path:
        specs.append(
            ExtractSpec(
                path=latest_brief_path,
                title=f"5) Latest Race Brief (Key Excerpts) — {os.path.basename(latest_brief_path)}",
                headings=(
                    "## Executive Summary",
                    "### Transfer Strategy",
                    "### Chip Strategy",
                    "## Lineup Recommendations",
                ),
                max_lines=240,
            )
        )

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    header = f"""# Context Pack (Generated)\n\nGenerated: **{now}**\n\nIncludes:\n- `season/team-state.md` (selected sections)\n- `league-rivals.md` (full)\n- `season/gap-catchup-strategy.md` (key sections)\n- `season/conversation-summaries.md` (most recent block)\n- Latest brief: `{latest_brief_rel}` (key excerpts)\n\nRegenerate:\n- `python3 scripts/build-context-pack.py`\n\n---\n\n"""

    out_parts: list[str] = [header]

    for spec in specs:
        if not os.path.isfile(spec.path):
            continue

        rel = os.path.relpath(spec.path, root)
        inputs_used.append(rel)
        raw = read_text(spec.path)

        out_parts.append(f"## {spec.title}\n")
        out_parts.append(f"*Source:* `{rel}`\n\n")

        if spec.include_whole_file:
            out_parts.append(cap_lines(raw.strip() + "\n", spec.max_lines))
        elif spec.last_heading_prefix:
            out_parts.append(
                extract_last_top_level_block(raw, spec.last_heading_prefix, spec.max_lines)
            )
        else:
            extracted = extract_many_heading_blocks(raw, spec.headings)
            out_parts.append(cap_lines(extracted, spec.max_lines))

        out_parts.append("\n---\n\n")

    return ("".join(out_parts).rstrip() + "\n", inputs_used)


def main() -> int:
    root = repo_root()
    pack, _inputs = build_pack(root)
    out_path = os.path.join(root, "season", "context-pack.md")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(pack)

    print(f"Wrote: {os.path.relpath(out_path, root)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

