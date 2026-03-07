"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockInState, setLockInState] = useState<
    "idle" | "awaiting_screenshot" | "analyzing" | "confirmed" | "mismatch"
  >("idle");
  const [confirmedRace, setConfirmedRace] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const isLockedInMessage = (text: string) =>
    /\blocked\s*in\b/i.test(text);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    if (isLockedInMessage(userMessage) && lockInState === "idle") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content:
            "Upload a screenshot of your F1 Fantasy lineup to confirm.",
        },
      ]);
      setLockInState("awaiting_screenshot");
      return;
    }

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantContent += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${String(error)}. Try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLockInState("analyzing");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "[Screenshot uploaded]" },
      { role: "assistant", content: "Analyzing your lineup..." },
    ]);

    try {
      const conversationText = messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

      const formData = new FormData();
      formData.append("screenshot", file);
      formData.append("summary", conversationText);

      const response = await fetch("/api/lock-in", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.confirmed) {
        setLockInState("confirmed");
        setConfirmedRace(result.race);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: result.analysis,
          };
          return updated;
        });
      } else {
        setLockInState("mismatch");
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content:
              result.analysis +
              "\n\nTell me about the differences, or upload a new screenshot when ready.",
          };
          return updated;
        });
      }
    } catch (error) {
      setLockInState("idle");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Screenshot analysis failed: ${String(error)}. Try again.`,
        };
        return updated;
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-45px)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-muted text-sm text-center mt-8">
            Ask about your team, transfers, boosts, or chips.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-foreground text-right"
                  : "text-foreground/90"
              }`}
            >
              {msg.role === "user" ? (
                <span className="text-muted text-xs block mb-1">you</span>
              ) : (
                <span className="text-muted text-xs block mb-1">
                  consultant
                </span>
              )}
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {lockInState === "confirmed" && (
          <div className="confirmed-banner">
            Confirmed: Team set for {confirmedRace}.
          </div>
        )}

        {isLoading && (
          <div className="text-muted text-sm animate-pulse">thinking...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {(lockInState === "awaiting_screenshot" || lockInState === "mismatch") && (
        <div className="flex-none px-4 py-3 border-t border-border">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleScreenshot}
            className="hidden"
            id="screenshot-input"
          />
          <label
            htmlFor="screenshot-input"
            className="block w-full text-center py-3 px-4 text-sm font-medium border border-accent text-accent cursor-pointer rounded"
          >
            Upload Screenshot
          </label>
        </div>
      )}

      {lockInState === "analyzing" && (
        <div className="flex-none px-4 py-3 border-t border-border text-center text-sm text-muted animate-pulse">
          Analyzing screenshot...
        </div>
      )}

      <form
        onSubmit={sendMessage}
        className="flex-none px-4 py-3 border-t border-border"
      >
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Ask about your team..."
            rows={1}
            className="flex-1 bg-transparent border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted resize-none focus:outline-none focus:border-foreground/30"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 text-sm text-foreground border border-border rounded disabled:opacity-30 hover:border-foreground/30"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
