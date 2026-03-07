import { KnowledgeBase, formatKnowledgeForPrompt } from "./knowledge";
import { RaceInfo, formatRaceLabel } from "./race-utils";

export function buildSystemPrompt(
  kb: KnowledgeBase,
  currentRace: RaceInfo
): string {
  const knowledgeContext = formatKnowledgeForPrompt(kb);

  const consultantInstructions = kb.consultantPrompt
    .replace(/^---[\s\S]*?---\n*/m, "")
    .trim();

  return `${consultantInstructions}

## Current Context

You are the F1 Fantasy strategy consultant chatbot. The user is chatting with you on their phone.
The current/next race is: ${formatRaceLabel(currentRace)} at ${currentRace.location} (${currentRace.dates}).
Overtake tier: ${currentRace.overtakeTier}. ${currentRace.riskFlag ? `Risk flag: ${currentRace.riskFlag}.` : ""}

Keep responses concise and mobile-friendly. No walls of text — the user is reading on a phone screen.

## Magic Words

The user may say certain trigger phrases. When detected:
- "locked in" (any casing) — Respond: "Upload a screenshot of your F1 Fantasy lineup to confirm."
  Do NOT mark anything as confirmed until the screenshot is analyzed.
- "status" (any casing) — Return the current lineup from the team state below.
- "undo" (any casing) — Acknowledge and note that the last lock-in should be reverted.

## Knowledge Base

${knowledgeContext}`;
}

export function buildBriefPrompt(
  kb: KnowledgeBase,
  race: RaceInfo,
  type: "tuesday" | "friday",
  existingBrief?: string
): string {
  const knowledgeContext = formatKnowledgeForPrompt(kb);

  if (type === "friday" && existingBrief) {
    return `You are an F1 Fantasy strategy consultant. Below is the knowledge base and the existing Tuesday race brief.

Your task: Check if anything has changed since Tuesday (practice results, penalties, driver injuries, weather updates, news). If changes exist, output ONLY the changes section in markdown, starting with "## Changes Since Tuesday". If nothing changed, respond with exactly: "NO_CHANGES".

## Current Race
${formatRaceLabel(race)} at ${race.location} (${race.dates})

## Existing Tuesday Brief
${existingBrief}

## Knowledge Base
${knowledgeContext}`;
  }

  return `You are an F1 Fantasy strategy consultant. Generate a full race brief for the upcoming race using the knowledge base below. Follow the exact recommendation template format from the consultant protocol.

IMPORTANT: The brief title (H1) MUST use this exact format:
# Brief — Race ${race.round}: ${race.name}

## Current Race
${formatRaceLabel(race)} at ${race.location} (${race.dates})
Sprint: ${race.isSprint ? "Yes" : "No"}
Overtake Tier: ${race.overtakeTier}
${race.riskFlag ? `Risk Flag: ${race.riskFlag}` : ""}

## Knowledge Base
${knowledgeContext}`;
}

export function buildScreenshotAnalysisPrompt(
  kb: KnowledgeBase,
  race: RaceInfo
): string {
  return `You are an F1 Fantasy strategy consultant verifying a user's lineup.

Analyze this screenshot of their F1 Fantasy app lineup. Extract:
1. All 5 drivers and their prices
2. Both constructors and their prices
3. The 2X boosted driver
4. Total budget spent and remaining
5. Any other visible info (chips active, transfers used)

Then compare it against the recommended lineup in the team state and latest race recommendation below.

## Current Race
${formatRaceLabel(race)}

## Current Team State
${kb.season["team-state.md"] || "No team state found"}

## Latest Recommendation
${kb.season[`race-recommendations/`] || "Check race recommendation files"}

Respond in this format:
- Start with "MATCH" or "MISMATCH"
- List the lineup you extracted from the screenshot
- If MISMATCH, list each difference between screenshot and recommendation
- Keep it concise — the user is on their phone`;
}
