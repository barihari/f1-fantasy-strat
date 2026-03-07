import { RaceInfo } from "./race-utils";

export interface SessionTimes {
  fp1?: string;
  fp2?: string;
  fp3?: string;
  qualifying?: string;
  sprintQualifying?: string;
  sprint?: string;
  race?: string;
  lockDeadline?: string;
}

/**
 * Fetches session times from the F1 website for a given race.
 * Falls back to estimated times based on circuit timezone if fetch fails.
 */
export async function fetchSessionTimes(
  race: RaceInfo
): Promise<SessionTimes> {
  try {
    const raceSlug = race.name
      .toLowerCase()
      .replace(/\s*gp\s*/i, "-grand-prix")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const url = `https://www.formula1.com/en/racing/2026/${raceSlug}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "F1FantasyBot/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return estimateSessionTimes(race);
    }

    const html = await response.text();
    return parseSessionTimes(html, race);
  } catch {
    return estimateSessionTimes(race);
  }
}

function parseSessionTimes(html: string, race: RaceInfo): SessionTimes {
  const times: SessionTimes = {};

  const timePatterns = [
    { key: "qualifying", pattern: /Qualifying[^<]*?(\d{1,2}:\d{2})/i },
    { key: "race", pattern: /Race[^<]*?(\d{1,2}:\d{2})/i },
    { key: "sprintQualifying", pattern: /Sprint\s*(?:Qualifying|Shootout)[^<]*?(\d{1,2}:\d{2})/i },
    { key: "sprint", pattern: /Sprint(?!\s*(?:Qualifying|Shootout))[^<]*?(\d{1,2}:\d{2})/i },
  ];

  for (const { key, pattern } of timePatterns) {
    const match = html.match(pattern);
    if (match) {
      times[key as keyof SessionTimes] = match[1];
    }
  }

  if (race.isSprint && times.sprintQualifying) {
    times.lockDeadline = times.sprintQualifying;
  } else if (times.qualifying) {
    times.lockDeadline = times.qualifying;
  }

  if (!times.lockDeadline) {
    return estimateSessionTimes(race);
  }

  return times;
}

const CIRCUIT_TIMEZONE_OFFSETS: Record<string, number> = {
  Melbourne: 11,
  Shanghai: 8,
  Suzuka: 9,
  Sakhir: 3,
  Jeddah: 3,
  Miami: -4,
  Montreal: -4,
  "Monte Carlo": 2,
  Barcelona: 2,
  Spielberg: 2,
  Silverstone: 1,
  Spa: 2,
  Budapest: 2,
  Zandvoort: 2,
  Monza: 2,
  Madrid: 2,
  Baku: 4,
  "Marina Bay": 8,
  Austin: -5,
  "Mexico City": -6,
  Interlagos: -3,
  "Las Vegas": -7,
  Lusail: 3,
  "Yas Marina": 4,
};

function estimateSessionTimes(race: RaceInfo): SessionTimes {
  const offset = CIRCUIT_TIMEZONE_OFFSETS[race.location] ?? 0;
  const etOffset = -5;
  const diff = offset - etOffset;

  if (race.isSprint) {
    const sprintQualiLocal = 15;
    const sprintQualiET = sprintQualiLocal - diff;
    const h = ((sprintQualiET % 24) + 24) % 24;
    const day = sprintQualiET < 0 ? "Thu" : "Fri";
    return {
      lockDeadline: `${day} ${formatHour(h)}`,
      sprintQualifying: formatHour(h),
    };
  }

  const qualiLocal = 15;
  const qualiET = qualiLocal - diff;
  const h = ((qualiET % 24) + 24) % 24;
  const parsedDates = race.dates.match(/(\w+)\s+(\d+)-(\d+)/);
  const startDay = parsedDates ? parseInt(parsedDates[2]) + 1 : 0;
  const month = parsedDates ? parsedDates[1] : "";
  const dayLabel = qualiET < 0
    ? `Fri ${month} ${startDay}`
    : `Sat ${month} ${startDay}`;

  return {
    lockDeadline: `${dayLabel}, ${formatHour(h)} ET`,
    qualifying: formatHour(h),
  };
}

function formatHour(h: number): string {
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${h12}:00${period}`;
}

export function getLockDeadlineDate(
  race: RaceInfo,
  sessionTimes: SessionTimes
): Date | null {
  if (!sessionTimes.lockDeadline) return null;

  const year = new Date().getFullYear();
  const parsedDates = race.dates.match(/(\w+)\s+(\d+)-(\d+)/);
  if (!parsedDates) return null;

  const month = parsedDates[1];
  const dayNum = race.isSprint
    ? parseInt(parsedDates[2]) + 1
    : parseInt(parsedDates[2]) + 1;

  const timeMatch = sessionTimes.lockDeadline.match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) return null;

  const dateStr = `${month} ${dayNum}, ${year} ${timeMatch[1]}:${timeMatch[2]}:00`;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}
