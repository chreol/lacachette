import {
  githubImagePath,
  isSafeImageName,
  MAX_IMAGE_BYTES,
  publicImagePath,
} from "@/lib/site-images";

const GITHUB_API = "https://api.github.com";

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? "chreol/lacachette";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  return { token, repo, branch };
}

export function githubMediaConfigured() {
  return Boolean(process.env.GITHUB_TOKEN);
}

async function githubFetch(path: string, init?: RequestInit) {
  const { token } = githubConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN manquant");
  }
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

export async function commitSiteImage(fileName: string, bytes: Buffer, message?: string) {
  if (!isSafeImageName(fileName)) {
    throw new Error("Nom de fichier invalide");
  }
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("Fichier trop lourd (max 1,5 Mo)");
  }

  const { repo, branch } = githubConfig();
  const path = githubImagePath(fileName);
  const encodedPath = path
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/");

  const existing = await githubFetch(`/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`);
  let sha: string | undefined;
  if (existing.ok) {
    const json = (await existing.json()) as { sha?: string };
    sha = json.sha;
  } else if (existing.status !== 404) {
    const err = await existing.text();
    throw new Error(`GitHub lecture : ${existing.status} ${err.slice(0, 180)}`);
  }

  const put = await githubFetch(`/repos/${repo}/contents/${encodedPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: message ?? `media: mise a jour de ${fileName}`,
      content: bytes.toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!put.ok) {
    const err = await put.text();
    throw new Error(`GitHub commit : ${put.status} ${err.slice(0, 220)}`);
  }

  return { path: publicImagePath(fileName), committed: true };
}
