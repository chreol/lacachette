export const SITE_SLOTS = [
  { file: "logo.webp", usage: "Logo (navbar, footer, admin)" },
  { file: "entree.webp", usage: "Hero + image de partage Google / WhatsApp" },
  { file: "terrasse.webp", usage: "Espace Terrasse" },
  { file: "bar.webp", usage: "Grande salle & comptoir" },
  { file: "vip.webp", usage: "Salon VIP" },
  { file: "cuisine.webp", usage: "Cuisine ouverte" },
  { file: "sanitaires.webp", usage: "Sanitaires" },
  { file: "whatsapp-official.webp", usage: "Icône WhatsApp" },
  { file: "chreol-empire.png", usage: "Marque Chreol Empire (footer)" },
] as const;

export const GITHUB_IMAGES_DIR = "public/images";
export const ALLOWED_IMAGE_EXT = ["webp", "png", "jpg", "jpeg"];
export const MAX_IMAGE_BYTES = 1_500_000;

export function publicImagePath(file: string) {
  const cleaned = file.replace(/^\/+/, "").replace(/^images\//, "");
  return `/images/${cleaned}`;
}

export function githubImagePath(file: string) {
  const cleaned = file.replace(/^\/+/, "").replace(/^images\//, "");
  return `${GITHUB_IMAGES_DIR}/${cleaned}`;
}

export function isSafeImageName(file: string) {
  return /^(?:[a-z0-9_-]+\/)?[a-zA-Z0-9._-]+\.(webp|png|jpe?g)$/i.test(file);
}

export function contentImageFileName(
  folder: "menu" | "events",
  id: string,
  originalName: string,
) {
  const rawExt = originalName.split(".").pop()?.toLowerCase() ?? "webp";
  const ext = ALLOWED_IMAGE_EXT.includes(rawExt) ? rawExt : "webp";
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || `img-${Date.now()}`;
  return `${folder}/${safeId}.${ext}`;
}
