import { readFile } from "./github";

export interface RaceInfo {
  round: number;
  name: string;
  displayName: string;
  location: string;
  dates: string;
  raceDate: string;
  /** Fallback lock deadline in UTC ISO format (qualifying or sprint qualifying start) */
  lockUTC: string;
  isSprint: boolean;
  overtakeTier: string;
  riskFlag: string;
}

const RACE_CALENDAR: RaceInfo[] = [
  { round: 1, name: "Australian GP", displayName: "Australia", location: "Melbourne", dates: "Mar 6-8", raceDate: "2026-03-08", lockUTC: "2026-03-07T05:00:00Z", isSprint: false, overtakeTier: "Medium", riskFlag: "" },
  { round: 2, name: "Chinese GP", displayName: "China", location: "Shanghai", dates: "Mar 13-15", raceDate: "2026-03-15", lockUTC: "2026-03-13T07:30:00Z", isSprint: true, overtakeTier: "High", riskFlag: "" },
  { round: 3, name: "Japanese GP", displayName: "Japan", location: "Suzuka", dates: "Mar 27-29", raceDate: "2026-03-29", lockUTC: "2026-03-28T06:00:00Z", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 4, name: "Bahrain GP", displayName: "Bahrain", location: "Sakhir", dates: "Apr 10-12", raceDate: "2026-04-12", lockUTC: "2026-04-11T16:00:00Z", isSprint: false, overtakeTier: "High", riskFlag: "GEOPOLITICAL" },
  { round: 5, name: "Saudi Arabian GP", displayName: "Saudi Arabia", location: "Jeddah", dates: "Apr 17-19", raceDate: "2026-04-19", lockUTC: "2026-04-18T17:00:00Z", isSprint: false, overtakeTier: "Low", riskFlag: "GEOPOLITICAL" },
  { round: 6, name: "Miami GP", displayName: "Miami", location: "Miami", dates: "May 1-3", raceDate: "2026-05-03", lockUTC: "2026-05-01T20:30:00Z", isSprint: true, overtakeTier: "High", riskFlag: "" },
  { round: 7, name: "Canadian GP", displayName: "Canada", location: "Montreal", dates: "May 22-24", raceDate: "2026-05-24", lockUTC: "2026-05-22T20:30:00Z", isSprint: true, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 8, name: "Monaco GP", displayName: "Monaco", location: "Monte Carlo", dates: "Jun 5-7", raceDate: "2026-06-07", lockUTC: "2026-06-06T14:00:00Z", isSprint: false, overtakeTier: "Very Low", riskFlag: "" },
  { round: 9, name: "Barcelona-Catalunya GP", displayName: "Barcelona", location: "Barcelona", dates: "Jun 12-14", raceDate: "2026-06-14", lockUTC: "2026-06-13T14:00:00Z", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 10, name: "Austrian GP", displayName: "Austria", location: "Spielberg", dates: "Jun 26-28", raceDate: "2026-06-28", lockUTC: "2026-06-27T14:00:00Z", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 11, name: "British GP", displayName: "Great Britain", location: "Silverstone", dates: "Jul 3-5", raceDate: "2026-07-05", lockUTC: "2026-07-03T15:30:00Z", isSprint: true, overtakeTier: "Medium", riskFlag: "" },
  { round: 12, name: "Belgian GP", displayName: "Belgium", location: "Spa", dates: "Jul 17-19", raceDate: "2026-07-19", lockUTC: "2026-07-18T14:00:00Z", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 13, name: "Hungarian GP", displayName: "Hungary", location: "Budapest", dates: "Jul 24-26", raceDate: "2026-07-26", lockUTC: "2026-07-25T14:00:00Z", isSprint: false, overtakeTier: "Low-Medium", riskFlag: "" },
  { round: 14, name: "Dutch GP", displayName: "Netherlands", location: "Zandvoort", dates: "Aug 21-23", raceDate: "2026-08-23", lockUTC: "2026-08-21T14:30:00Z", isSprint: true, overtakeTier: "High", riskFlag: "" },
  { round: 15, name: "Italian GP", displayName: "Italy", location: "Monza", dates: "Sep 4-6", raceDate: "2026-09-06", lockUTC: "2026-09-05T14:00:00Z", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 16, name: "Spanish GP (Madrid)", displayName: "Spain (Madrid)", location: "Madrid", dates: "Sep 11-13", raceDate: "2026-09-13", lockUTC: "2026-09-12T14:00:00Z", isSprint: false, overtakeTier: "Unknown", riskFlag: "" },
  { round: 17, name: "Azerbaijan GP", displayName: "Azerbaijan", location: "Baku", dates: "Sep 24-26", raceDate: "2026-09-26", lockUTC: "2026-09-25T12:00:00Z", isSprint: false, overtakeTier: "Low", riskFlag: "" },
  { round: 18, name: "Singapore GP", displayName: "Singapore", location: "Marina Bay", dates: "Oct 9-11", raceDate: "2026-10-11", lockUTC: "2026-10-09T12:30:00Z", isSprint: true, overtakeTier: "Low", riskFlag: "" },
  { round: 19, name: "United States GP", displayName: "United States", location: "Austin", dates: "Oct 23-25", raceDate: "2026-10-25", lockUTC: "2026-10-24T21:00:00Z", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 20, name: "Mexico GP", displayName: "Mexico", location: "Mexico City", dates: "Oct 30-Nov 1", raceDate: "2026-11-01", lockUTC: "2026-10-31T21:00:00Z", isSprint: false, overtakeTier: "Elite", riskFlag: "" },
  { round: 21, name: "Brazilian GP", displayName: "Brazil", location: "Interlagos", dates: "Nov 6-8", raceDate: "2026-11-08", lockUTC: "2026-11-07T18:00:00Z", isSprint: false, overtakeTier: "High", riskFlag: "" },
  { round: 22, name: "Las Vegas GP", displayName: "Las Vegas", location: "Las Vegas", dates: "Nov 19-21", raceDate: "2026-11-21", lockUTC: "2026-11-21T04:00:00Z", isSprint: false, overtakeTier: "Medium-High", riskFlag: "" },
  { round: 23, name: "Qatar GP", displayName: "Qatar", location: "Lusail", dates: "Nov 27-29", raceDate: "2026-11-29", lockUTC: "2026-11-28T18:00:00Z", isSprint: false, overtakeTier: "Medium-High", riskFlag: "GEOPOLITICAL" },
  { round: 24, name: "Abu Dhabi GP", displayName: "Abu Dhabi", location: "Yas Marina", dates: "Dec 4-6", raceDate: "2026-12-06", lockUTC: "2026-12-05T14:00:00Z", isSprint: false, overtakeTier: "Elite", riskFlag: "GEOPOLITICAL" },
];

export function getAllRaces(): RaceInfo[] {
  return RACE_CALENDAR;
}

export function getRaceByRound(round: number): RaceInfo | undefined {
  return RACE_CALENDAR.find((r) => r.round === round);
}

export function getNextRace(): RaceInfo | undefined {
  const now = new Date();
  for (const race of RACE_CALENDAR) {
    const raceEnd = new Date(race.raceDate + "T23:59:59Z");
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

export function getShortName(race: RaceInfo): string {
  return race.displayName;
}

export function getLocationSlug(race: RaceInfo): string {
  return race.displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getRaceByLocationSlug(slug: string): RaceInfo | undefined {
  return RACE_CALENDAR.find((r) => getLocationSlug(r) === slug);
}

export async function getLockInStatus(round: number): Promise<boolean> {
  const log = await readFile("season/decision-log.md");
  if (!log) return false;
  return (
    log.includes(`Race ${round}`) &&
    (log.includes("Verified via screenshot") ||
      log.includes("Verified via user confirmation"))
  );
}
