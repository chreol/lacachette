import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { menuDishSchema } from "@/lib/validation";
import { deleteDish, mapDish, updateDish } from "@/lib/content";

function parseSpices(raw?: string): string[] | undefined {
  if (raw === undefined) return undefined;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

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

  const parsed = menuDishSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const dish = await updateDish(id, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.badge !== undefined ? { badge: data.badge || null } : {}),
      ...(data.spices !== undefined ? { spices: parseSpices(data.spices) } : {}),
      ...(data.isVegetarian !== undefined ? { isVegetarian: data.isVegetarian } : {}),
      ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      ...(data.image !== undefined ? { image: data.image || null } : {}),
    });
    if (!dish) {
      return NextResponse.json({ error: "Plat introuvable" }, { status: 404 });
    }
    return NextResponse.json({ dish: mapDish(dish) });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible de modifier le plat", detail }, { status: 500 });
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
    const ok = await deleteDish(id);
    if (!ok) return NextResponse.json({ error: "Plat introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible de supprimer le plat", detail }, { status: 500 });
  }
}
