import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mediaSrc } from "@/lib/site-images";
import {
  liveEvents as fallbackEvents,
  menuItems as fallbackMenu,
  type LiveEvent,
  type MenuCategory,
  type MenuItem,
} from "@/types/restaurant";

export type DishRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  badge: string | null;
  spices: string[];
  isVegetarian: boolean;
  isAvailable: boolean;
  sortOrder: number;
  image: string | null;
};

export type EventRow = {
  id: string;
  title: string;
  date: string;
  time: string;
  artist: string;
  genre: string;
  description: string;
  image: string | null;
  isPublished: boolean;
};

export function mapDish(row: DishRow): MenuItem & { isAvailable: boolean; sortOrder?: number } {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category as MenuCategory,
    badge: (row.badge as MenuItem["badge"]) ?? undefined,
    spices: Array.isArray(row.spices) && row.spices.length ? row.spices : undefined,
    isVegetarian: row.isVegetarian || undefined,
    image: row.image ? mediaSrc(row.image) : undefined,
    isAvailable: row.isAvailable,
    sortOrder: row.sortOrder,
  };
}

export function mapEvent(row: EventRow): LiveEvent & { isPublished: boolean } {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time,
    artist: row.artist,
    genre: row.genre,
    description: row.description,
    image: row.image ? mediaSrc(row.image) : undefined,
    isPublished: row.isPublished,
  };
}

function newId() {
  return crypto.randomUUID();
}

export async function listDishes(): Promise<DishRow[]> {
  return prisma.$queryRaw<DishRow[]>`
    SELECT id, name, description, price, category, badge, spices,
           "isVegetarian", "isAvailable", "sortOrder", image
    FROM "MenuDish"
    ORDER BY "sortOrder" ASC, name ASC
  `;
}

export async function listEvents(): Promise<EventRow[]> {
  return prisma.$queryRaw<EventRow[]>`
    SELECT id, title, date, time, artist, genre, description, image, "isPublished"
    FROM "LiveEvent"
    ORDER BY date ASC
  `;
}

export async function getPublicMenu(): Promise<MenuItem[]> {
  try {
    const rows = await listDishes();
    const available = rows.filter((r) => r.isAvailable);
    if (available.length === 0) return fallbackMenu;
    return available.map(mapDish);
  } catch {
    return fallbackMenu;
  }
}

export async function getPublicEvents(): Promise<LiveEvent[]> {
  try {
    const rows = await listEvents();
    const published = rows.filter((r) => r.isPublished);
    if (published.length === 0) return fallbackEvents;
    return published.map(mapEvent);
  } catch {
    return fallbackEvents;
  }
}

function spicesSql(spices: string[]) {
  if (!spices.length) return Prisma.sql`ARRAY[]::text[]`;
  return Prisma.sql`ARRAY[${Prisma.join(spices)}]::text[]`;
}

export async function createDish(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  badge?: string | null;
  spices: string[];
  isVegetarian: boolean;
  isAvailable: boolean;
  sortOrder: number;
  image?: string | null;
}): Promise<DishRow> {
  const id = newId();
  await prisma.$executeRaw`
    INSERT INTO "MenuDish"
      (id, name, description, price, category, badge, spices, "isVegetarian", "isAvailable", "sortOrder", image, "updatedAt")
    VALUES (
      ${id},
      ${data.name},
      ${data.description},
      ${data.price},
      ${data.category},
      ${data.badge ?? null},
      ${spicesSql(data.spices)},
      ${data.isVegetarian},
      ${data.isAvailable},
      ${data.sortOrder},
      ${data.image ?? null},
      CURRENT_TIMESTAMP
    )
  `;
  const rows = await prisma.$queryRaw<DishRow[]>`
    SELECT id, name, description, price, category, badge, spices,
           "isVegetarian", "isAvailable", "sortOrder", image
    FROM "MenuDish" WHERE id = ${id}
  `;
  return rows[0];
}

export async function updateDish(
  id: string,
  patch: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    badge: string | null;
    spices: string[];
    isVegetarian: boolean;
    isAvailable: boolean;
    sortOrder: number;
    image: string | null;
  }>,
): Promise<DishRow | null> {
  const currentRows = await prisma.$queryRaw<DishRow[]>`
    SELECT id, name, description, price, category, badge, spices,
           "isVegetarian", "isAvailable", "sortOrder", image
    FROM "MenuDish" WHERE id = ${id}
  `;
  const current = currentRows[0];
  if (!current) return null;
  const next = {
    ...current,
    ...patch,
    spices: patch.spices ?? current.spices,
  };
  await prisma.$executeRaw`
    UPDATE "MenuDish" SET
      name = ${next.name},
      description = ${next.description},
      price = ${next.price},
      category = ${next.category},
      badge = ${next.badge},
      spices = ${spicesSql(next.spices ?? [])},
      "isVegetarian" = ${next.isVegetarian},
      "isAvailable" = ${next.isAvailable},
      "sortOrder" = ${next.sortOrder},
      image = ${next.image},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
  return next;
}

export async function deleteDish(id: string): Promise<boolean> {
  const result = await prisma.$executeRaw`DELETE FROM "MenuDish" WHERE id = ${id}`;
  return result > 0;
}

export async function createEvent(data: {
  title: string;
  date: string;
  time: string;
  artist: string;
  genre: string;
  description: string;
  image?: string | null;
  isPublished: boolean;
}): Promise<EventRow> {
  const id = newId();
  await prisma.$executeRaw`
    INSERT INTO "LiveEvent"
      (id, title, date, time, artist, genre, description, image, "isPublished", "updatedAt")
    VALUES (
      ${id},
      ${data.title},
      ${data.date},
      ${data.time},
      ${data.artist},
      ${data.genre},
      ${data.description},
      ${data.image ?? null},
      ${data.isPublished},
      CURRENT_TIMESTAMP
    )
  `;
  return { id, ...data, image: data.image ?? null };
}

export async function updateEvent(
  id: string,
  patch: Partial<{
    title: string;
    date: string;
    time: string;
    artist: string;
    genre: string;
    description: string;
    image: string | null;
    isPublished: boolean;
  }>,
): Promise<EventRow | null> {
  const currentRows = await prisma.$queryRaw<EventRow[]>`
    SELECT id, title, date, time, artist, genre, description, image, "isPublished"
    FROM "LiveEvent" WHERE id = ${id}
  `;
  const current = currentRows[0];
  if (!current) return null;
  const next = { ...current, ...patch };
  await prisma.$executeRaw`
    UPDATE "LiveEvent" SET
      title = ${next.title},
      date = ${next.date},
      time = ${next.time},
      artist = ${next.artist},
      genre = ${next.genre},
      description = ${next.description},
      image = ${next.image},
      "isPublished" = ${next.isPublished},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;
  return next;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const result = await prisma.$executeRaw`DELETE FROM "LiveEvent" WHERE id = ${id}`;
  return result > 0;
}
