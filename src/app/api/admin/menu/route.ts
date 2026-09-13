import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { menuDishSchema } from "@/lib/validation";
import { createDish, listDishes, mapDish } from "@/lib/content";

function parseSpices(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const dishes = await listDishes();
    return NextResponse.json({ dishes: dishes.map(mapDish) });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible de charger la carte", detail, dishes: [] }, { status: 500 });
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

  const parsed = menuDishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const dish = await createDish({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      badge: data.badge || null,
      spices: parseSpices(data.spices),
      isVegetarian: data.isVegetarian ?? false,
      isAvailable: data.isAvailable ?? true,
      sortOrder: data.sortOrder ?? 0,
      image: data.image || null,
    });
    return NextResponse.json({ dish: mapDish(dish) }, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: "Impossible d'ajouter le plat", detail }, { status: 500 });
  }
}
