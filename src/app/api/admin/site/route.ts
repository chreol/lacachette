import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DEFAULT_SITE_CONTENT, getSiteContent, saveSiteContent, type SiteContent } from "@/lib/site-content";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  try {
    const site = await getSiteContent();
    return NextResponse.json({ site });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible de charger le site", detail, site: DEFAULT_SITE_CONTENT }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const incoming = (body as { site?: SiteContent })?.site;
  if (!incoming || typeof incoming !== "object") {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    const site = await saveSiteContent(incoming);
    return NextResponse.json({ site });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Enregistrement impossible", detail }, { status: 500 });
  }
}
