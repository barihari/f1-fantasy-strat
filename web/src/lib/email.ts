const NTFY_TOPIC = process.env.NTFY_TOPIC || "f1-fantasy-strat";

interface NotifyOptions {
  clickUrl?: string;
  actions?: { label: string; url: string }[];
}

export async function sendSMS(
  message: string,
  options?: NotifyOptions
): Promise<void> {
  const headers: Record<string, string> = { Title: "F1 Fantasy" };

  if (options?.clickUrl) {
    headers["Click"] = options.clickUrl;
  }

  if (options?.actions?.length) {
    headers["Actions"] = options.actions
      .map((a) => `view, ${a.label}, ${a.url}`)
      .join("; ");
  }

  const res = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: "POST",
    headers,
    body: message,
  });

  if (!res.ok) {
    throw new Error(`ntfy.sh error: ${res.status} ${await res.text()}`);
  }
}
