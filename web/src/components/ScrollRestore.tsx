"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "scroll-positions";

function getPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePosition(path: string, y: number) {
  const positions = getPositions();
  positions[path] = y;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

export default function ScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    const saved = getPositions()[pathname];
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    }

    function onScroll() {
      savePosition(pathname, window.scrollY);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
