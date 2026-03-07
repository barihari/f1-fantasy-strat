import { NextRequest, NextResponse } from "next/server";
import { getNextRace, getLockInStatus, formatRaceLabel } from "@/lib/race-utils";
import { fetchSessionTimes, getLockDeadlineDate } from "@/lib/f1-schedule";
import { sendSMS } from "@/lib/email";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const race = getNextRace();
  if (!race) {
    return NextResponse.json({ error: "No upcoming race" }, { status: 400 });
  }

  const isLockedIn = await getLockInStatus(race.round);
  if (isLockedIn) {
    return NextResponse.json({
      sent: false,
      reason: "Already locked in",
      race: formatRaceLabel(race),
    });
  }

  const sessionTimes = await fetchSessionTimes(race);
  const lockDeadline = getLockDeadlineDate(race, sessionTimes);

  if (!lockDeadline) {
    return NextResponse.json({
      sent: false,
      reason: "Could not determine lock deadline",
    });
  }

  const now = new Date();
  const msUntilLock = lockDeadline.getTime() - now.getTime();
  const hoursUntilLock = msUntilLock / (1000 * 60 * 60);

  if (hoursUntilLock <= 2 && hoursUntilLock > 0) {
    const appUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const minutesLeft = Math.round(msUntilLock / (1000 * 60));
    const chatUrl = `${appUrl}/chat`;
    await sendSMS(
      `${formatRaceLabel(race)} — lock deadline in ${minutesLeft} min! You haven't confirmed changes.`,
      {
        clickUrl: chatUrl,
        actions: [{ label: "Lock In Now", url: chatUrl }],
      }
    );

    return NextResponse.json({
      sent: true,
      race: formatRaceLabel(race),
      minutesUntilLock: minutesLeft,
    });
  }

  return NextResponse.json({
    sent: false,
    reason:
      hoursUntilLock > 2
        ? `Too early — ${Math.round(hoursUntilLock)}h until lock`
        : "Lock deadline has passed",
  });
}
