import { readFile } from "@/lib/github";
import { getRaceByRound, getRaceSlug, formatRaceLabel } from "@/lib/race-utils";
import BriefView from "@/components/BriefView";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ raceId: string }>;
}

export default async function BriefPage({ params }: PageProps) {
  const { raceId } = await params;
  const round = parseInt(raceId, 10);
  const race = getRaceByRound(round);

  if (!race) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-muted">Race not found.</p>
        <Link href="/chat" className="text-sm text-accent mt-4 inline-block">
          Open Chat
        </Link>
      </div>
    );
  }

  const slug = getRaceSlug(race);
  const content = await readFile(`season/race-recommendations/${slug}.md`);

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="pb-4 border-b border-border mb-6">
          <h1 className="text-lg font-medium">{formatRaceLabel(race)}</h1>
          <p className="text-sm text-muted">{race.location} — {race.dates}</p>
        </header>
        <p className="text-muted text-sm">
          Brief not generated yet. Check back after the Tuesday reminder fires.
        </p>
        <Link href="/chat" className="text-sm text-accent mt-4 inline-block">
          Open Chat
        </Link>
      </div>
    );
  }

  const hasChanges = content.includes("## Changes Since Tuesday");

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <Link href="/chat" className="text-xs text-muted hover:text-foreground">
          ← Chat
        </Link>
      </div>
      <BriefView content={content} hasChanges={hasChanges} />
    </div>
  );
}
