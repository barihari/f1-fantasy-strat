import { Octokit } from "octokit";

function getOctokit() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

const owner = () => process.env.GITHUB_OWNER!;
const repo = () => process.env.GITHUB_REPO!;

export async function readFile(path: string): Promise<string | null> {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.rest.repos.getContent({
      owner: owner(),
      repo: repo(),
      path,
    });
    if ("content" in data && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

export async function writeFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const octokit = getOctokit();
  let sha: string | undefined;

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: owner(),
      repo: repo(),
      path,
    });
    if ("sha" in data) {
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: owner(),
    repo: repo(),
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
  });
}

export async function appendToFile(
  path: string,
  appendContent: string,
  message: string
): Promise<void> {
  const existing = await readFile(path);
  const newContent = existing ? existing + "\n" + appendContent : appendContent;
  await writeFile(path, newContent, message);
}

export async function listDirectory(path: string): Promise<string[]> {
  try {
    const octokit = getOctokit();
    const { data } = await octokit.rest.repos.getContent({
      owner: owner(),
      repo: repo(),
      path,
    });
    if (Array.isArray(data)) {
      return data.map((item) => item.name);
    }
    return [];
  } catch {
    return [];
  }
}
