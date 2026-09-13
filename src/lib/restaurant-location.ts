export const RESTAURANT_LOCATION = {
  lat: 3.8318611,
  lng: 11.54025,
  address: "Ékié, Yaoundé IV, Cameroun",
  dms: `3°49'54.7"N 11°32'24.9"E`,
};

export const DELIVERY_ZONES = {
  A: {
    label: "Zone A — Ékié & alentours",
    fee: 500,
    minOrder: 2000,
    delay: "20-30 min",
    quartiers: ["Ékié", "Mimboman", "Nkomo", "Kondengui", "Nsam"],
  },
  B: {
    label: "Zone B — Yaoundé IV & proches",
    fee: 1000,
    minOrder: 3000,
    delay: "30-45 min",
    quartiers: ["Mvog-Ada", "Mvog-Mbi", "Nlongkak", "Omnisports", "Essos"],
  },
  C: {
    label: "Zone C — Centre & périphérie",
    fee: 1500,
    minOrder: 5000,
    delay: "45-60 min",
    quartiers: ["Bastos", "Centre-ville", "Mokolo", "Ngousso", "Odza"],
  },
} as const;

export type DeliveryZoneKey = keyof typeof DELIVERY_ZONES;

export const ALL_QUARTIERS = (
  Object.entries(DELIVERY_ZONES) as [DeliveryZoneKey, (typeof DELIVERY_ZONES)[DeliveryZoneKey]][]
).flatMap(([key, zone]) =>
  zone.quartiers.map((quartier) => ({
    quartier,
    zone: key,
    label: zone.label,
    fee: zone.fee,
    minOrder: zone.minOrder,
    delay: zone.delay,
  })),
);

export const DELIVERY_WHATSAPP_MESSAGE =
  "Bonjour La Cachette, je souhaite une livraison. Mon quartier : … / plats : …";
