import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { commitSiteImage, mediaUploadConfigured } from "@/lib/site-media";
import {
  ALLOWED_IMAGE_EXT,
  contentImageFileName,
  isSafeImageName,
  MAX_IMAGE_BYTES,
  SITE_SLOTS,
} from "@/lib/site-images";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  return NextResponse.json({
    configured: mediaUploadConfigured(),
    slots: SITE_SLOTS,
    maxBytes: MAX_IMAGE_BYTES,
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (!mediaUploadConfigured()) {
    return NextResponse.json(
      {
        error:
          "Ajoute SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (photos immédiates) ou GITHUB_TOKEN (commit repo) dans Vercel, puis redéploie.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulaire invalide" }, { status: 400 });
  }

  const slot = String(form.get("slot") ?? "");
  const folder = String(form.get("folder") ?? "");
  const entityId = String(form.get("id") ?? "");
  const uploaded = form.get("file");
  if (!(uploaded instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  let fileName = slot || uploaded.name.replace(/\s+/g, "-").toLowerCase();
  if (folder === "menu" || folder === "events") {
    fileName = contentImageFileName(folder, entityId || crypto.randomUUID(), uploaded.name);
  }
  if (!isSafeImageName(fileName)) {
    return NextResponse.json(
      { error: `Nom invalide. Extensions : ${ALLOWED_IMAGE_EXT.join(", ")}` },
      { status: 400 },
    );
  }

  if (uploaded.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Fichier trop lourd (max 1,5 Mo)" }, { status: 400 });
  }

  const buffer = Buffer.from(await uploaded.arrayBuffer());
  try {
    const result = await commitSiteImage(
      fileName,
      buffer,
      `admin: photo ${fileName} (${session.email})`,
    );
    return NextResponse.json({
      ok: true,
      ...result,
      hint:
        result.storage === "supabase"
          ? "Photo en ligne tout de suite. Rafraîchis la page."
          : "Vercel redéploie tout seul en 1–2 min. Ensuite rafraîchis le site.",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur stockage";
    return NextResponse.json({ error: "Upload impossible", detail }, { status: 502 });
  }
}
