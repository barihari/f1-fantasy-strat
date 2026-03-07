import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/anthropic";
import { loadKnowledgeBase } from "@/lib/knowledge";
import { getNextRace, formatRaceLabel, getRaceSlug } from "@/lib/race-utils";
import { buildScreenshotAnalysisPrompt } from "@/lib/system-prompt";
import { appendToFile, writeFile, readFile } from "@/lib/github";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("screenshot") as File | null;
    const conversationSummary = formData.get("summary") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No screenshot provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif";

    const [kb, race] = await Promise.all([
      loadKnowledgeBase(),
      Promise.resolve(getNextRace()),
    ]);

    if (!race) {
      return NextResponse.json(
        { error: "No upcoming race found" },
        { status: 400 }
      );
    }

    const systemPrompt = buildScreenshotAnalysisPrompt(kb, race);
    const response = await analyzeImage(
      systemPrompt,
      base64,
      mediaType,
      "Analyze this F1 Fantasy lineup screenshot. Compare it to my recommended lineup and report if it matches or has differences."
    );

    const block = response.content[0];
    const analysisText = block.type === "text" ? block.text : "";
    const isMatch = analysisText.toUpperCase().startsWith("MATCH");

    if (isMatch) {
      const now = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });
      const raceLabel = formatRaceLabel(race);

      const logEntry = `\n## ${raceLabel} | ${now}\n\n${analysisText}\n\nVerified via screenshot: ${now}\n`;
      await appendToFile(
        "season/decision-log.md",
        logEntry,
        `Lock in: ${raceLabel}`
      );

      if (conversationSummary) {
        const summaryEntry = `\n## ${raceLabel} | ${now}\n\n${conversationSummary}\n`;
        await appendToFile(
          "season/conversation-summaries.md",
          summaryEntry,
          `Conversation summary: ${raceLabel}`
        );
      }

      const existingRec = await readFile(
        `season/race-recommendations/${getRaceSlug(race)}.md`
      );
      if (!existingRec) {
        await writeFile(
          `season/race-recommendations/${getRaceSlug(race)}.md`,
          `# ${raceLabel}\n\nVerified lineup (screenshot confirmed ${now}):\n\n${analysisText}\n`,
          `Race recommendation: ${raceLabel}`
        );
      }
    }

    return NextResponse.json({
      analysis: analysisText,
      confirmed: isMatch,
      race: formatRaceLabel(race),
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Analysis failed: ${String(error)}` },
      { status: 500 }
    );
  }
}
