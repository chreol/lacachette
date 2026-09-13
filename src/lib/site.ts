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
  latitude: 3.831866,
  longitude: 11.540261,
};
export const SITE_MAPS_URL = "https://maps.app.goo.gl/qJYFWab2BePrqKGZ8";
export const SITE_OG_IMAGE = `${SITE_URL}/images/entree.webp`;
