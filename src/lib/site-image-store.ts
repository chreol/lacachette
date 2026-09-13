import { prisma } from "@/lib/prisma";
import { imageFileName, isSafeImageName } from "@/lib/site-images";

export function mimeForImageName(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "image/webp";
}

export async function saveSiteImageBytes(fileName: string, bytes: Buffer, mime?: string) {
  const path = imageFileName(fileName);
  if (!isSafeImageName(path)) {
    throw new Error("Nom de fichier invalide");
  }
  const contentType = mime ?? mimeForImageName(path);
  await prisma.$executeRaw`
    INSERT INTO "SiteImage" (path, mime, bytes, "updatedAt")
    VALUES (${path}, ${contentType}, ${bytes}, CURRENT_TIMESTAMP)
    ON CONFLICT (path) DO UPDATE SET
      mime = EXCLUDED.mime,
      bytes = EXCLUDED.bytes,
      "updatedAt" = CURRENT_TIMESTAMP
  `;
}

export async function loadSiteImageBytes(fileName: string) {
  const path = imageFileName(fileName);
  if (!isSafeImageName(path)) return null;
  const rows = await prisma.$queryRaw<{ mime: string; bytes: Uint8Array }[]>`
    SELECT mime, bytes FROM "SiteImage" WHERE path = ${path} LIMIT 1
  `;
  return rows[0] ?? null;
}
