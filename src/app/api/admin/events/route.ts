import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { liveEventSchema } from "@/lib/validation";
import { createEvent, listEvents, mapEvent } from "@/lib/content";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const events = await listEvents();
    return NextResponse.json({ events: events.map(mapEvent) });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json(
      { error: "Impossible de charger les soirées", detail, events: [] },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

  const parsed = liveEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const event = await createEvent({
      title: data.title,
      date: data.date,
      time: data.time,
      artist: data.artist,
      genre: data.genre,
      description: data.description,
      image: data.image || null,
      isPublished: data.isPublished ?? true,
    });
    return NextResponse.json({ event: mapEvent(event) }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible d'ajouter la soirée", detail }, { status: 500 });
  }
}
