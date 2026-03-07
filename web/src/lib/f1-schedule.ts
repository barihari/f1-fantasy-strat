import { RaceInfo } from "./race-utils";

export interface SessionTimes {
  qualifying?: string;
  sprintQualifying?: string;
  sprint?: string;
  race?: string;
  lockDeadline?: string;
}

const JOLPICA_BASE = "https://api.jolpi.ca/ergast/f1/2026";

/**
 * Fetches session times from the Jolpica F1 API.
 * Falls back to stored lockUTC from the race calendar if fetch fails.
 */
export async function fetchSessionTimes(race: RaceInfo): Promise<SessionTimes> {
  try {
    const res = await fetch(`${JOLPICA_BASE}/${race.round}.json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallbackTimes(race);

    const data = await res.json();
    const raceData = data?.MRData?.RaceTable?.Races?.[0];
    if (!raceData) return fallbackTimes(race);

    const times: SessionTimes = {};

    if (raceData.Qualifying) {
      times.qualifying = formatUTCtoET(raceData.Qualifying.date, raceData.Qualifying.time);
    }
    if (raceData.SprintQualifying) {
      times.sprintQualifying = formatUTCtoET(raceData.SprintQualifying.date, raceData.SprintQualifying.time);
    }
    if (raceData.Sprint) {
      times.sprint = formatUTCtoET(raceData.Sprint.date, raceData.Sprint.time);
    }
    if (raceData.time) {
      times.race = formatUTCtoET(raceData.date, raceData.time);
    }

    if (race.isSprint && times.sprintQualifying) {
      times.lockDeadline = times.sprintQualifying;
    } else if (times.qualifying) {
      times.lockDeadline = times.qualifying;
    }

    return times.lockDeadline ? times : fallbackTimes(race);
  } catch {
    return fallbackTimes(race);
  }
}

function fallbackTimes(race: RaceInfo): SessionTimes {
  return { lockDeadline: formatUTCtoET(race.lockUTC.slice(0, 10), race.lockUTC.slice(11)) };
}

function formatUTCtoET(dateStr: string, timeStr: string): string {
  const utc = new Date(`${dateStr}T${timeStr}`);
  return utc.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/**
 * Returns the lock deadline as a UTC Date.
 * Tries the Jolpica API first; falls back to the stored lockUTC.
 */
export async function getLockDeadlineDate(race: RaceInfo): Promise<Date | null> {
  try {
    const res = await fetch(`${JOLPICA_BASE}/${race.round}.json`, {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const data = await res.json();
      const raceData = data?.MRData?.RaceTable?.Races?.[0];
      if (raceData) {
        const session = race.isSprint
          ? raceData.SprintQualifying
          : raceData.Qualifying;
        if (session?.date && session?.time) {
          const live = new Date(`${session.date}T${session.time}`);
          if (!isNaN(live.getTime())) return live;
        }
      }
    }
  } catch {
    // fall through to stored fallback
  }

  const fallback = new Date(race.lockUTC);
  return isNaN(fallback.getTime()) ? null : fallback;
}
