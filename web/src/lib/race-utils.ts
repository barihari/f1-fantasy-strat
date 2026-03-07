import { readFile } from "./github";

export interface RaceInfo {
  round: number;
  name: string;
  location: string;
  dates: string;
  isSprint: boolean;
  overtakeTier: string;
  riskFlag: string;
}

const RACE_CALENDAR: RaceInfo[] = [
  { round: 1, name: "Australian GP", location: "Melbourne", dates: "Mar 6-8", isSprint: false, overtakeTier: "Medium", riskFlag: "" },
  { round: 2, name: "Chinese GP", location: "Shanghai", dates: "Mar 13-15", isSprint: true, overtakeTier: "High", riskFlag: "" },
  { round: 3, name: "Japanese GP", location: "Suzuka", dates: "Mar 27-29", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 4, name: "Bahrain GP", location: "Sakhir", dates: "Apr 10-12", isSprint: false, overtakeTier: "High", riskFlag: "GEOPOLITICAL" },
  { round: 5, name: "Saudi Arabian GP", location: "Jeddah", dates: "Apr 17-19", isSprint: false, overtakeTier: "Low", riskFlag: "GEOPOLITICAL" },
  { round: 6, name: "Miami GP", location: "Miami", dates: "May 1-3", isSprint: true, overtakeTier: "High", riskFlag: "" },
  { round: 7, name: "Canadian GP", location: "Montreal", dates: "May 22-24", isSprint: true, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 8, name: "Monaco GP", location: "Monte Carlo", dates: "Jun 5-7", isSprint: false, overtakeTier: "Very Low", riskFlag: "" },
  { round: 9, name: "Barcelona-Catalunya GP", location: "Barcelona", dates: "Jun 12-14", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 10, name: "Austrian GP", location: "Spielberg", dates: "Jun 26-28", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 11, name: "British GP", location: "Silverstone", dates: "Jul 3-5", isSprint: true, overtakeTier: "Medium", riskFlag: "" },
  { round: 12, name: "Belgian GP", location: "Spa", dates: "Jul 17-19", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 13, name: "Hungarian GP", location: "Budapest", dates: "Jul 24-26", isSprint: false, overtakeTier: "Low-Medium", riskFlag: "" },
  { round: 14, name: "Dutch GP", location: "Zandvoort", dates: "Aug 21-23", isSprint: true, overtakeTier: "High", riskFlag: "" },
  { round: 15, name: "Italian GP", location: "Monza", dates: "Sep 4-6", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 16, name: "Spanish GP (Madrid)", location: "Madrid", dates: "Sep 11-13", isSprint: false, overtakeTier: "Unknown", riskFlag: "" },
  { round: 17, name: "Azerbaijan GP", location: "Baku", dates: "Sep 24-26", isSprint: false, overtakeTier: "Low", riskFlag: "" },
  { round: 18, name: "Singapore GP", location: "Marina Bay", dates: "Oct 9-11", isSprint: true, overtakeTier: "Low", riskFlag: "" },
  { round: 19, name: "United States GP", location: "Austin", dates: "Oct 23-25", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 20, name: "Mexico GP", location: "Mexico City", dates: "Oct 30-Nov 1", isSprint: false, overtakeTier: "Elite", riskFlag: "" },
  { round: 21, name: "Brazilian GP", location: "Interlagos", dates: "Nov 6-8", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 22, name: "Las Vegas GP", location: "Las Vegas", dates: "Nov 19-21", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 23, name: "Qatar GP", location: "Lusail", dates: "Nov 27-29", isSprint: false, overtakeTier: "Medium-High", riskFlag: "GEOPOLITICAL" },
  { round: 24, name: "Abu Dhabi GP", location: "Yas Marina", dates: "Dec 4-6", isSprint: false, overtakeTier: "Elite", riskFlag: "GEOPOLITICAL" },
];

export function getAllRaces(): RaceInfo[] {
  return RACE_CALENDAR;
}

export function getRaceByRound(round: number): RaceInfo | undefined {
  return RACE_CALENDAR.find((r) => r.round === round);
}

export function getNextRace(): RaceInfo | undefined {
  const now = new Date();
  const year = now.getFullYear();

  for (const race of RACE_CALENDAR) {
    const endDateStr = race.dates.includes("-")
      ? race.dates.split("-").pop()!.trim()
      : race.dates;
    const raceEnd = new Date(`${endDateStr} ${year}`);
    if (raceEnd >= now) {
      return race;
    }
  }
  return RACE_CALENDAR[RACE_CALENDAR.length - 1];
}

export function formatRaceLabel(race: RaceInfo): string {
  const sprint = race.isSprint ? " (Sprint)" : "";
  return `Race ${race.round} ${race.name}${sprint}`;
}

export function getRaceSlug(race: RaceInfo): string {
  const num = String(race.round).padStart(2, "0");
  const slug = race.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `race-${num}-${slug}`;
}

export async function getLockInStatus(round: number): Promise<boolean> {
  const log = await readFile("season/decision-log.md");
  if (!log) return false;
  return log.includes(`Race ${round}`) && log.includes("Verified via screenshot");
}
