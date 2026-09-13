import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_GEO,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PHONE,
  SITE_URL,
} from "@/lib/site";
import type { LiveEvent, MenuItem } from "@/types/restaurant";

export function RestaurantJsonLd({
  menuItems,
  events,
  mapsUrl,
  sameAs,
  geo,
  addressStreet,
  email,
  phone,
}: {
  menuItems: MenuItem[];
  events: LiveEvent[];
  mapsUrl?: string;
  sameAs?: string[];
  geo?: { lat: number; lng: number };
  addressStreet?: string;
  email?: string;
  phone?: string;
}) {
  const street = addressStreet ?? SITE_ADDRESS.street;
  const restaurantEmail = email ?? SITE_EMAIL;
  const restaurantPhone = phone ?? SITE_PHONE;
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: SITE_NAME,
    alternateName: "La Cachette Resto",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: [SITE_OG_IMAGE, `${SITE_URL}/images/bar.webp`, `${SITE_URL}/images/logo.webp`],
    logo: `${SITE_URL}/images/logo.webp`,
    telephone: restaurantPhone,
    email: restaurantEmail,
    priceRange: "$$",
    servesCuisine: ["Cameroonian", "African", "Grill", "Cocktails"],
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: SITE_ADDRESS.city,
      addressRegion: SITE_ADDRESS.region,
      addressCountry: SITE_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo?.lat ?? SITE_GEO.latitude,
      longitude: geo?.lng ?? SITE_GEO.longitude,
    },
    hasMap: mapsUrl ?? "https://maps.google.com/?q=%C3%89ki%C3%A9+Dernier+Poteau+Yaound%C3%A9",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday"],
        opens: "17:00",
        closes: "00:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "17:00",
        closes: "02:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "12:00",
        closes: "22:00",
      },
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Terrasse", value: true },
      { "@type": "LocationFeatureSpecification", name: "VIP Lounge", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live music", value: true },
    ],
    menu: `${SITE_URL}/carte`,
    hasMenu: {
      "@type": "Menu",
      name: "Carte La Cachette",
      url: `${SITE_URL}/carte`,
      hasMenuSection: groupMenuSections(menuItems),
    },
    sameAs: sameAs?.length
      ? sameAs
      : [
          "https://t.me/LacachetteResto_Bot",
          "https://wa.me/237693547268",
          SITE_URL,
        ],
  };

  const eventNodes = events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    startDate: `${event.date}T${normalizeTime(event.time)}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: event.description,
    performer: { "@type": "PerformingGroup", name: event.artist },
    location: {
      "@type": "Restaurant",
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: street,
        addressLocality: SITE_ADDRESS.city,
        addressCountry: SITE_ADDRESS.country,
      },
    },
    organizer: { "@type": "Restaurant", name: SITE_NAME, url: SITE_URL },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/reserver?event=${event.id}`,
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "XAF",
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      {eventNodes.map((node, i) => (
        <script
          key={`event-jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}

function normalizeTime(time: string): string {
  const match = time.replace("h", ":").match(/^(\d{1,2}):?(\d{2})?/);
  if (!match) return "20:00:00";
  const h = match[1].padStart(2, "0");
  const m = (match[2] ?? "00").padStart(2, "0");
  return `${h}:${m}:00`;
}

function groupMenuSections(items: MenuItem[]) {
  const labels: Record<string, string> = {
    grillades: "Grillades & Braisés",
    specialites: "Spécialités Camerounaises",
    cocktails: "Cocktails Signature",
    boissons: "Boissons Locales",
  };
  const groups = new Map<string, MenuItem[]>();
  for (const item of items) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  return [...groups.entries()].map(([category, dishes]) => ({
    "@type": "MenuSection",
    name: labels[category] ?? category,
    hasMenuItem: dishes.map((dish) => ({
      "@type": "MenuItem",
      name: dish.name,
      description: dish.description,
      offers: {
        "@type": "Offer",
        price: dish.price,
        priceCurrency: "XAF",
      },
    })),
  }));
}
