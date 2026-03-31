"use client";

import { useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BriefViewProps {
  content: string;
  hasChanges: boolean;
}

interface Section {
  heading: string;
  body: string;
}

const CORE_MATCHERS: [string, string[]][] = [
  ["summary", ["summary"]],
  ["lineup", ["lineup", "recommendation"]],
  ["chip", ["chip"]],
  ["expectations", ["expectation", "race day"]],
  ["price", ["price watch"]],
  ["ahead", ["looking ahead"]],
  ["changes", ["changes since tuesday"]],
  ["this_week", ["this week"]],
];

const DETAIL_ORDER: string[][] = [
  ["circuit"],
  ["power unit"],
  ["storyline"],
  ["current team", "team analysis"],
  ["strategy", "transfer", "scouting"],
  ["post-race", "action item"],
  ["success", "metric"],
];

function matchSlot(heading: string, matchers: [string, string[]][]): string | null {
  const lower = heading.toLowerCase().replace(/\(.*?\)/g, "").trim();
  for (const [slot, keywords] of matchers) {
    if (keywords.some((kw) => lower.includes(kw))) return slot;
  }
  return null;
}

function detailPosition(heading: string): number {
  const lower = heading.toLowerCase();
  const idx = DETAIL_ORDER.findIndex((kws) => kws.some((kw) => lower.includes(kw)));
  return idx === -1 ? DETAIL_ORDER.length : idx;
}

function extractH3(body: string, keywords: string[]): { extracted: string; remainder: string } {
  const h3Parts = body.split(/(?=^### )/m);
  const matched: string[] = [];
  const rest: string[] = [];

  for (const part of h3Parts) {
    const lower = part.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(part.replace(/^###\s*/, "## ").trim());
    } else {
      rest.push(part);
    }
  }

  return {
    extracted: matched.join("\n\n"),
    remainder: rest.join("\n\n").trim(),
  };
}

function parseSections(markdown: string): {
  header: string;
  coreSections: (Section & { slot: string })[];
  detailSections: Section[];
} {
  const parts = markdown.split(/(?=^## )/m);
  const header = parts[0];

  const core: (Section & { slot: string })[] = [];
  const detail: Section[] = [];

  for (const raw of parts.slice(1)) {
    const firstNewline = raw.indexOf("\n");
    const headingLine = firstNewline > -1 ? raw.slice(0, firstNewline) : raw;
    const heading = headingLine.replace(/^##\s*/, "").trim();
    const body = firstNewline > -1 ? raw.slice(firstNewline + 1).trim() : "";
    const slot = matchSlot(heading, CORE_MATCHERS);

    if (slot === "chip") {
      core.push({ heading, body, slot });
    } else if (slot) {
      const lowerHeading = heading.toLowerCase();
      const hasChipInside =
        (lowerHeading.includes("strategy") || lowerHeading.includes("transfer")) &&
        body.toLowerCase().includes("### chip");

      if (hasChipInside) {
        const { extracted, remainder } = extractH3(body, ["chip"]);
        if (extracted) {
          const chipHeading = extracted.match(/^## (.+)/m)?.[1] || "Chip Strategy";
          core.push({
            heading: chipHeading,
            body: extracted.replace(/^## .+\n?/, "").trim(),
            slot: "chip",
          });
        }
        if (remainder) {
          detail.push({ heading, body: remainder });
        }
      } else {
        core.push({ heading, body, slot });
      }
    } else {
      const lowerHeading = heading.toLowerCase();
      if (
        (lowerHeading.includes("strategy") || lowerHeading.includes("transfer")) &&
        body.toLowerCase().includes("### chip")
      ) {
        const { extracted, remainder } = extractH3(body, ["chip"]);
        if (extracted) {
          const chipHeading = extracted.match(/^## (.+)/m)?.[1] || "Chip Strategy";
          core.push({
            heading: chipHeading,
            body: extracted.replace(/^## .+\n?/, "").trim(),
            slot: "chip",
          });
        }
        if (remainder) {
          detail.push({ heading, body: remainder });
        }
      } else {
        detail.push({ heading, body });
      }
    }
  }

  const slotOrder = CORE_MATCHERS.map(([s]) => s);
  core.sort((a, b) => slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot));
  detail.sort((a, b) => detailPosition(a.heading) - detailPosition(b.heading));

  return { header, coreSections: core, detailSections: detail };
}

function CollapsibleSection({ heading, body }: { heading: string; body: string }) {
  return (
    <details className="brief-collapsible">
      <summary>{heading}</summary>
      <div className="detail-content prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </details>
  );
}

function CoreSection({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <h2>{heading}</h2>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}

export default function BriefView({ content, hasChanges }: BriefViewProps) {
  const changesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasChanges && window.location.hash === "#changes") {
      changesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hasChanges]);

  const { header, coreSections, detailSections } = useMemo(
    () => parseSections(content),
    [content],
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{header}</ReactMarkdown>
      </div>

      {coreSections.map((section, i) => {
        if (section.slot === "changes") {
          return (
            <div
              key={`core-${i}`}
              ref={changesRef}
              id="changes"
              className="changes-highlight"
            >
              <CoreSection heading={section.heading} body={section.body} />
            </div>
          );
        }
        return (
          <CoreSection
            key={`core-${i}`}
            heading={section.heading}
            body={section.body}
          />
        );
      })}

      {detailSections.length > 0 && (
        <div className="space-y-2 pt-2">
          {detailSections.map((section, i) => (
            <CollapsibleSection
              key={`detail-${i}`}
              heading={section.heading}
              body={section.body}
            />
          ))}
        </div>
      )}
    </div>
  );
}
