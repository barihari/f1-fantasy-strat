import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/anthropic";
import { loadKnowledgeBase } from "@/lib/knowledge";
import {
  getNextRace,
  formatRaceLabel,
  getRaceSlug,
  getLocationSlug,
  getLockInStatus,
} from "@/lib/race-utils";
import { buildBriefPrompt } from "@/lib/system-prompt";
import { fetchSessionTimes } from "@/lib/f1-schedule";
import { writeFile, readFile } from "@/lib/github";
import { sendSMS } from "@/lib/email";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") || "tuesday") as
    | "tuesday"
    | "friday";

  const [kb, race] = await Promise.all([
    loadKnowledgeBase(),
    Promise.resolve(getNextRace()),
  ]);

  if (!race) {
    return NextResponse.json({ error: "No upcoming race" }, { status: 400 });
  }

  const sessionTimes = await fetchSessionTimes(race);
  const raceLabel = formatRaceLabel(race);
  const raceSlug = getRaceSlug(race);
  const isLockedIn = await getLockInStatus(race.round);
  const appUrl = process.env.APP_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  if (type === "tuesday") {
    const briefPrompt = buildBriefPrompt(kb, race, "tuesday");
    const brief = await generateText(briefPrompt, "Generate the full race brief.");

    await writeFile(
      `season/race-recommendations/${raceSlug}.md`,
      brief,
      `Tuesday brief: ${raceLabel}`
    );

    const lockTime = sessionTimes.lockDeadline || "check F1 app";
    const briefUrl = `${appUrl}/brief/${getLocationSlug(race)}`;
    const chatUrl = `${appUrl}/chat`;

    await sendSMS(`${raceLabel} — Lock by: ${lockTime}`, {
      clickUrl: briefUrl,
      actions: [
        { label: "View Brief", url: briefUrl },
        { label: "Open Chat", url: chatUrl },
      ],
    });

    return NextResponse.json({ sent: true, type, race: raceLabel });
  }

  if (isLockedIn) {
    return NextResponse.json({
      sent: false,
      type,
      race: raceLabel,
      reason: "Already locked in",
    });
  }

  const existingBrief = await readFile(
    `season/race-recommendations/${raceSlug}.md`
  );
  const fridayPrompt = buildBriefPrompt(kb, race, "friday", existingBrief || undefined);
  const result = await generateText(fridayPrompt, "Check for changes since Tuesday.");

  const lockTime = sessionTimes.lockDeadline || "check F1 app";
  const briefUrl = `${appUrl}/brief/${getLocationSlug(race)}`;
  const chatUrl = `${appUrl}/chat`;

  if (result.trim() === "NO_CHANGES") {
    await sendSMS(
      `${raceLabel} update — no changes, Tuesday plan holds. Lock by: ${lockTime}`,
      {
        clickUrl: briefUrl,
        actions: [
          { label: "View Brief", url: briefUrl },
          { label: "Open Chat", url: chatUrl },
        ],
      }
    );
  } else {
    const updatedBrief = (existingBrief || "") + "\n\n" + result;
    await writeFile(
      `season/race-recommendations/${raceSlug}.md`,
      updatedBrief,
      `Friday update: ${raceLabel}`
    );

    await sendSMS(
      `${raceLabel} UPDATE — changes suggested. Lock by: ${lockTime}`,
      {
        clickUrl: `${briefUrl}#changes`,
        actions: [
          { label: "View Changes", url: `${briefUrl}#changes` },
          { label: "Open Chat", url: chatUrl },
        ],
      }
    );
  }

  return NextResponse.json({ sent: true, type, race: raceLabel });
}
