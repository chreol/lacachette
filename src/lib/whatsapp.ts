const RESTAURANT_WHATSAPP_NUMBER = "237693547268"; // sans "+", ni espaces (format wa.me)

/** Construit un lien wa.me pré-rempli. `phone` doit être au format international (ex: +237693547268). */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildRestaurantWhatsAppLink(message: string): string {
  return buildWhatsAppLink(RESTAURANT_WHATSAPP_NUMBER, message);
}

export { RESTAURANT_WHATSAPP_NUMBER };
