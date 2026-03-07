import { NextResponse } from "next/server";
import { readFile } from "@/lib/github";
import { getNextRace, getLockInStatus, formatRaceLabel } from "@/lib/race-utils";

export async function GET() {
  const race = getNextRace();
  if (!race) {
    return NextResponse.json({ error: "No upcoming race" }, { status: 400 });
  }

  const [teamState, isLockedIn] = await Promise.all([
    readFile("season/team-state.md"),
    getLockInStatus(race.round),
  ]);

  return NextResponse.json({
    race: formatRaceLabel(race),
    round: race.round,
    lockedIn: isLockedIn,
    teamState: teamState || "No team state found",
  });
}
