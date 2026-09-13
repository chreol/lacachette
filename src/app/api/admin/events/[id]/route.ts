import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { liveEventSchema } from "@/lib/validation";
import { deleteEvent, mapEvent, updateEvent } from "@/lib/content";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const parsed = liveEventSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const event = await updateEvent(id, {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.time !== undefined ? { time: data.time } : {}),
      ...(data.artist !== undefined ? { artist: data.artist } : {}),
      ...(data.genre !== undefined ? { genre: data.genre } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.image !== undefined ? { image: data.image || null } : {}),
      ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
    });
    if (!event) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }
    return NextResponse.json({ event: mapEvent(event) });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible de modifier la soirée", detail }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const ok = await deleteEvent(id);
    if (!ok) return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible de supprimer la soirée", detail }, { status: 500 });
  }
}
