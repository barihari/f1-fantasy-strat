"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BriefViewProps {
  content: string;
  hasChanges: boolean;
}

export default function BriefView({ content, hasChanges }: BriefViewProps) {
  const changesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasChanges && window.location.hash === "#changes") {
      changesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hasChanges]);

  const changesSplit = content.split("## Changes Since Tuesday");
  const mainBrief = changesSplit[0];
  const changesContent = changesSplit[1] || null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainBrief}</ReactMarkdown>
      </div>

      {changesContent && (
        <div ref={changesRef} id="changes" className="changes-highlight mt-8">
          <div className="prose prose-invert prose-sm max-w-none">
            <h2 className="text-accent mt-0">Changes Since Tuesday</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {changesContent}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
