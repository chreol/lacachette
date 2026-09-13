import { commitSiteImage as commitGithubImage, githubMediaConfigured } from "@/lib/github-media";
import { saveSiteImageBytes } from "@/lib/site-image-store";
import { isSafeImageName, MAX_IMAGE_BYTES, publicImagePath } from "@/lib/site-images";

const DEFAULT_BUCKET = "site-media";

function supabaseUrl() {
  return (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
}

function supabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

export function supabaseMediaConfigured() {
  return Boolean(supabaseUrl() && supabaseKey());
}

/** Uploads always persist in Postgres (`DATABASE_URL`). Extra backends are optional. */
export function mediaUploadConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_URL);
}

function mimeForName(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "image/webp";
}

async function storageFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${supabaseUrl()}/storage/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${supabaseKey()}`,
      apikey: supabaseKey(),
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

async function ensurePublicBucket(bucket: string) {
  const existing = await storageFetch("/bucket");
  if (existing.ok) {
    const list = (await existing.json()) as { id?: string; name?: string }[];
    if (list.some((b) => b.id === bucket || b.name === bucket)) return;
  }
  await storageFetch("/bucket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  });
}

async function uploadToSupabase(fileName: string, bytes: Buffer) {
  if (!isSafeImageName(fileName)) {
    throw new Error("Nom de fichier invalide");
  }
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("Fichier trop lourd (max 1,5 Mo)");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? DEFAULT_BUCKET;
  await ensurePublicBucket(bucket);

  const objectPath = fileName.replace(/^\/+/, "");
  const encoded = objectPath
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/");

  const put = await storageFetch(`/object/${bucket}/${encoded}`, {
    method: "POST",
    headers: {
      "Content-Type": mimeForName(fileName),
      "x-upsert": "true",
    },
    body: new Uint8Array(bytes),
  });

  if (!put.ok) {
    const err = await put.text();
    throw new Error(`Supabase Storage : ${put.status} ${err.slice(0, 220)}`);
  }

  return { committed: true as const, storage: "supabase" as const };
}

export async function commitSiteImage(fileName: string, bytes: Buffer, message?: string) {
  if (!isSafeImageName(fileName)) {
    throw new Error("Nom de fichier invalide");
  }
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("Fichier trop lourd (max 1,5 Mo)");
  }

  await saveSiteImageBytes(fileName, bytes);

  if (supabaseMediaConfigured()) {
    try {
      await uploadToSupabase(fileName, bytes);
    } catch {
      // Database is the source of truth; Storage is optional.
    }
  }

  // GitHub commits retrigger Vercel; only if explicitly enabled.
  if (process.env.GITHUB_MEDIA_COMMIT === "1" && githubMediaConfigured()) {
    try {
      await commitGithubImage(fileName, bytes, message);
    } catch {
      // Keep the DB copy even if GitHub fails.
    }
  }

  return {
    path: publicImagePath(fileName),
    committed: true as const,
    storage: "database" as const,
  };
}
