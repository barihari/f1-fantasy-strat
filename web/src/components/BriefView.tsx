"use client";

import { useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BriefViewProps {
  content: string;
  hasChanges: boolean;
}

const CORE_SECTIONS = new Set([
  "this week's recommendation",
  "price watch",
  "looking ahead",
  "changes since tuesday",
]);

function isCoreSection(heading: string): boolean {
  return CORE_SECTIONS.has(heading.toLowerCase().replace(/\(.*?\)/g, "").trim());
}

interface Section {
  heading: string;
  body: string;
  isCore: boolean;
}

function parseSections(markdown: string): { header: string; sections: Section[] } {
  const parts = markdown.split(/(?=^## )/m);
  const header = parts[0];
  const sections = parts.slice(1).map((raw) => {
    const firstNewline = raw.indexOf("\n");
    const headingLine = firstNewline > -1 ? raw.slice(0, firstNewline) : raw;
    const heading = headingLine.replace(/^##\s*/, "").trim();
    const body = firstNewline > -1 ? raw.slice(firstNewline + 1).trim() : "";
    return { heading, body, isCore: isCoreSection(heading) };
  });
  return { header, sections };
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

  const { header, sections } = useMemo(() => parseSections(content), [content]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{header}</ReactMarkdown>
      </div>

      {sections.map((section, i) => {
        const isChanges = section.heading.toLowerCase() === "changes since tuesday";
        if (isChanges) {
          return (
            <div
              key={i}
              ref={changesRef}
              id="changes"
              className="changes-highlight"
            >
              <CoreSection heading={section.heading} body={section.body} />
            </div>
          );
        }
        if (section.isCore) {
          return <CoreSection key={i} heading={section.heading} body={section.body} />;
        }
        return (
          <CollapsibleSection key={i} heading={section.heading} body={section.body} />
        );
      })}
    </div>
  );
}
