import { NextRequest } from "next/server";
import client from "@/lib/anthropic";
import { loadKnowledgeBase } from "@/lib/knowledge";
import { getNextRace } from "@/lib/race-utils";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const [kb, race] = await Promise.all([
    loadKnowledgeBase(),
    Promise.resolve(getNextRace()),
  ]);

  if (!race) {
    return new Response("No upcoming race found", { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(kb, race);

  const anthropicMessages = messages.map(
    (m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })
  );

  const stream = client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: String(error) })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
