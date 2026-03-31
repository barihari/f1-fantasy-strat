import { readFile } from "@/lib/github";
import {
  getRaceByRound,
  getRaceByLocationSlug,
  getRaceSlug,
  formatRaceLabel,
  getLocationSlug,
  type RaceInfo,
} from "@/lib/race-utils";
import BriefView from "@/components/BriefView";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ raceId: string }>;
}

function resolveRace(raceId: string): RaceInfo | undefined {
  const round = parseInt(raceId, 10);
  if (!isNaN(round)) return getRaceByRound(round);
  return getRaceByLocationSlug(raceId);
}

export default async function BriefPage({ params }: PageProps) {
  const { raceId } = await params;

  const round = parseInt(raceId, 10);
  if (!isNaN(round)) {
    const race = getRaceByRound(round);
    if (race) redirect(`/brief/${getLocationSlug(race)}`);
  }

  const race = resolveRace(raceId);

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
          <p className="text-sm text-muted">
            {race.location} — {race.dates}
          </p>
        </header>
        <p className="text-muted text-sm">
          Brief not generated yet. Check back after the Tuesday reminder fires.
        </p>
      </div>
    );
  }

  const hasChanges = content.includes("## Changes Since Tuesday");

  return <BriefView content={content} hasChanges={hasChanges} />;
}
