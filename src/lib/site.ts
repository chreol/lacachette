import { RESTAURANT_LOCATION } from "@/lib/restaurant-location";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://resto.chreolempire.com"
).replace(/\/$/, "");

export const SITE_NAME = "LA CACHETTE";
export const SITE_TAGLINE = "Restaurant-bar Vintage Africain · Ékié, Yaoundé";
export const SITE_DESCRIPTION =
  "LA CACHETTE : restaurant-bar éco-lounge Vintage Africain à Ékié, Yaoundé. Cuisine camerounaise revisitée, grillades, cocktails signature et live sessions dans un écrin de bois, bambou et lumière ambrée.";
export const SITE_PHONE = "+237693547268";
export const SITE_EMAIL = "restolacachette@chreolempire.com";
export const SITE_ADDRESS = {
  street: "Ékié, Dernier Poteau",
  city: "Yaoundé",
  region: "Centre",
  postalCode: "",
  country: "CM",
};
export const SITE_GEO = {
  latitude: RESTAURANT_LOCATION.lat,
  longitude: RESTAURANT_LOCATION.lng,
};
export const SITE_MAPS_URL =
  "https://www.google.com/maps/place//data=!4m2!3m1!1s0x108bc53a001691d1:0x55daf1a8e7749cd9";
export const SITE_OG_IMAGE = `${SITE_URL}/images/entree.webp`;
