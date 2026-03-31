import { NextResponse } from "next/server";
import { listDirectory } from "@/lib/github";
import { getAllRaces, getLocationSlug, getShortName } from "@/lib/race-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const files = await listDirectory("season/race-recommendations");
  const races = getAllRaces();

  const available = races
    .filter((race) => {
      const slug = `race-${String(race.round).padStart(2, "0")}-`;
      return files.some((f) => f.startsWith(slug) && f.endsWith(".md"));
    })
    .map((race) => ({
      round: race.round,
      name: race.name,
      shortName: getShortName(race),
      location: race.location,
      locationSlug: getLocationSlug(race),
      dates: race.dates,
      isSprint: race.isSprint,
    }));

  return NextResponse.json(available);
}
