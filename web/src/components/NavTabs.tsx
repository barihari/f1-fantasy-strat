"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface BriefEntry {
  round: number;
  name: string;
  shortName: string;
  location: string;
  locationSlug: string;
  dates: string;
  isSprint: boolean;
}

export default function NavTabs() {
  const pathname = usePathname();
  const isBrief = pathname.startsWith("/brief");
  const isChat = pathname === "/chat" || pathname === "/";
  const [briefs, setBriefs] = useState<BriefEntry[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/briefs")
      .then((r) => r.json())
      .then(setBriefs)
      .catch(() => {});
  }, []);

  const currentSlug = isBrief ? pathname.split("/brief/")[1] || null : null;

  useEffect(() => {
    if (currentSlug && typeof window !== "undefined") {
      sessionStorage.setItem("last-brief-slug", currentSlug);
    }
  }, [currentSlug]);

  const storedBriefSlug =
    typeof window !== "undefined"
      ? sessionStorage.getItem("last-brief-slug")
      : null;
  /** On /chat, fall back to last brief slug persisted while on a brief page (no setState in effect). */
  const activeSlug = currentSlug || storedBriefSlug;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }
    if (drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  const activeBrief = activeSlug
    ? briefs.find((b) => b.locationSlug === activeSlug)
    : null;
  const latestBrief = briefs[briefs.length - 1];
  const displayBrief = activeBrief || latestBrief;

  const briefHref = displayBrief
    ? `/brief/${displayBrief.locationSlug}`
    : "/brief";

  const briefLabel = displayBrief
    ? `Brief — ${displayBrief.shortName}`
    : "Brief";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center">
          <Link
            href={briefHref}
            className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
              isBrief
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {briefLabel}
          </Link>
          <Link
            href="/chat"
            className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
              isChat
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            Chat
          </Link>
          {briefs.length > 0 && (
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="px-3 py-3 text-muted hover:text-foreground transition-colors"
              aria-label="Browse briefs"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50">
          <div
            ref={drawerRef}
            className="absolute right-0 top-0 h-full w-72 bg-background border-l border-border overflow-y-auto"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Race Briefs
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-muted hover:text-foreground text-lg"
              >
                &times;
              </button>
            </div>
            <ul className="py-2">
              {briefs.map((brief) => {
                const isActive = activeSlug === brief.locationSlug;
                return (
                  <li key={brief.round}>
                    <Link
                      href={`/brief/${brief.locationSlug}`}
                      onClick={() => setDrawerOpen(false)}
                      className={`block px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "text-accent bg-accent/10"
                          : "text-foreground hover:bg-white/5"
                      }`}
                    >
                      <span className="text-muted font-mono text-xs mr-2">
                        R{String(brief.round).padStart(2, "0")}
                      </span>
                      {brief.shortName}
                      {brief.isSprint && (
                        <span className="ml-2 text-xs text-accent/70">
                          Sprint
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
