import { prisma } from "@/lib/prisma";
import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_GEO,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from "@/lib/site";
import { DEFAULT_WEEK_HOURS, HOURS_LABELS, type DayHours } from "@/lib/opening-hours";

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  tagline: string;
  blurb: string;
  addressStreet: string;
  email: string;
  emailAlt: string;
  phone: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  googleMapsUrl: string;
  googleReviewUrl: string;
  geoLat: string;
  geoLng: string;
  hoursLabels: { days: string; hours: string }[];
  weekHours: Record<number, DayHours>;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Un écrin secret au cœur de Yaoundé",
  heroSubtitle: "Gastronomie camerounaise revisitée · Cocktails signature · Live Sessions",
  tagline: "L'ambiance se cache ici.",
  blurb:
    "Une évasion intimiste au cœur de Yaoundé. L'élégance du vintage africain rencontre la gastronomie moderne.",
  addressStreet: SITE_ADDRESS.street,
  email: SITE_EMAIL,
  emailAlt: "lacachette@resto.chreolempire.com",
  phone: SITE_PHONE,
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  googleMapsUrl: "https://maps.google.com/?q=%C3%89ki%C3%A9+Dernier+Poteau+Yaound%C3%A9",
  googleReviewUrl: "",
  geoLat: String(SITE_GEO.latitude),
  geoLng: String(SITE_GEO.longitude),
  hoursLabels: HOURS_LABELS,
  weekHours: DEFAULT_WEEK_HOURS,
};

let cache: { at: number; value: SiteContent } | null = null;

function normalizeWeek(raw: unknown): Record<number, DayHours> {
  const out: Record<number, DayHours> = { ...DEFAULT_WEEK_HOURS };
  if (!raw || typeof raw !== "object") return out;
  const src = raw as Record<string, DayHours>;
  for (let i = 0; i <= 6; i += 1) {
    const value = src[i] ?? src[String(i)];
    if (value) out[i] = value;
  }
  return out;
}

function mergeContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") return DEFAULT_SITE_CONTENT;
  const incoming = raw as Partial<SiteContent>;
  return {
    ...DEFAULT_SITE_CONTENT,
    ...incoming,
    hoursLabels: incoming.hoursLabels?.length ? incoming.hoursLabels : DEFAULT_SITE_CONTENT.hoursLabels,
    weekHours: normalizeWeek(incoming.weekHours ?? DEFAULT_WEEK_HOURS),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (cache && Date.now() - cache.at < 15_000) return cache.value;
  try {
    const rows = await prisma.$queryRaw<{ payload: SiteContent }[]>`
      SELECT payload FROM "SiteSetting" WHERE id = 'default' LIMIT 1
    `;
    const value = mergeContent(rows[0]?.payload);
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(payload: SiteContent): Promise<SiteContent> {
  const value = mergeContent(payload);
  const json = JSON.stringify(value);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "SiteSetting" (id, payload, "updatedAt")
     VALUES ('default', $1::jsonb, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, "updatedAt" = CURRENT_TIMESTAMP`,
    json,
  );
  cache = { at: Date.now(), value };
  return value;
}

export function mapsUrlFromContent(site: SiteContent) {
  const lat = site.geoLat.trim();
  const lng = site.geoLng.trim();
  const hasFieldGps =
    lat &&
    lng &&
    (lat !== String(SITE_GEO.latitude) || lng !== String(SITE_GEO.longitude));
  if (hasFieldGps) {
    return `https://maps.google.com/?q=${encodeURIComponent(`${lat},${lng}`)}`;
  }
  if (site.googleMapsUrl.trim()) return site.googleMapsUrl.trim();
  return `https://maps.google.com/?q=${encodeURIComponent(`${site.addressStreet}, Yaoundé`)}`;
}

export function napSameAs(site: SiteContent) {
  return [
    site.instagramUrl,
    site.facebookUrl,
    site.tiktokUrl,
    "https://t.me/LacachetteResto_Bot",
    `https://wa.me/${site.phone.replace(/[^\d]/g, "")}`,
    SITE_URL,
  ].filter(Boolean);
}

export { SITE_NAME, SITE_DESCRIPTION };
