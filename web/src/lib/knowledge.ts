import { readFile, listDirectory } from "./github";

export interface KnowledgeBase {
  knowledge: Record<string, string>;
  data: Record<string, string>;
  season: Record<string, string>;
  consultantPrompt: string;
}

async function loadDirectory(dir: string): Promise<Record<string, string>> {
  const files = await listDirectory(dir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const entries: Record<string, string> = {};

  await Promise.all(
    mdFiles.map(async (file) => {
      const content = await readFile(`${dir}/${file}`);
      if (content) {
        entries[file] = content;
      }
    })
  );

  return entries;
}

export async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  const [knowledge, data, season, consultantPrompt] = await Promise.all([
    loadDirectory("knowledge"),
    loadDirectory("data"),
    loadDirectory("season"),
    readFile(".cursor/rules/f1-fantasy-consultant.mdc"),
  ]);

  return {
    knowledge,
    data,
    season,
    consultantPrompt: consultantPrompt || "",
  };
}

export function formatKnowledgeForPrompt(kb: KnowledgeBase): string {
  const sections: string[] = [];

  sections.push("# Knowledge Files\n");
  for (const [file, content] of Object.entries(kb.knowledge)) {
    sections.push(`## ${file}\n${content}\n`);
  }

  sections.push("# Data Files\n");
  for (const [file, content] of Object.entries(kb.data)) {
    sections.push(`## ${file}\n${content}\n`);
  }

  sections.push("# Season State\n");
  for (const [file, content] of Object.entries(kb.season)) {
    sections.push(`## ${file}\n${content}\n`);
  }

  return sections.join("\n---\n\n");
}
