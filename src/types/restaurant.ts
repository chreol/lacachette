/* ══════════════════════════════════════════════════════════
   LA CACHETTE — Types & Data Models
   ══════════════════════════════════════════════════════════ */

// ── Espaces / Zones ──
export interface Space {
  id: string;
  name: string;
  zone: string;
  tagline: string;
  description: string;
  image: string;
  materials: string[];
  craftLocation?: string;
  icon: string; // Lucide icon name
}

// ── Menu ──
export type MenuCategory =
  | "grillades"
  | "specialites"
  | "cocktails"
  | "boissons";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // en FCFA
  category: MenuCategory;
  image?: string;
  badge?: "Incontournable" | "Nouveau" | "Chef" | "Signature";
  spices?: string[];
  isVegetarian?: boolean;
}

// ── Événements ──
export interface LiveEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  artist: string;
  genre: string;
  description: string;
  image?: string;
  isPrivate?: boolean;
}

// ── Réservation ──
export type SpaceChoice =
  | "terrasse"
  | "salle"
  | "vip"
  | "privatisation-vip";

export interface ReservationForm {
  name: string;
  phone: string; // +237 xxx xxx xxx
  date: string;
  time: string;
  guests: number;
  space: SpaceChoice;
  message?: string;
}

// ══════════════════════════════════════════════════════════
//   DONNÉES STATIQUES
// ══════════════════════════════════════════════════════════

export const spaces: Space[] = [
  {
    id: "entree",
    name: "L'Arche d'Entrée",
    zone: "Zone 1",
    tagline: "Le passage vers un autre monde",
    description:
      "Franchissez notre arche majestueuse en bambou tressé, encadrée de briques de terre rouge et de fougères luxuriantes. L'enseigne pyrogravée et les lanternes ambrées annoncent la couleur : vous entrez dans un sanctuaire.",
    image: "/images/entree.webp",
    materials: ["Bambou local", "Briques de terre cuite", "Lanternes LED 2700K"],
    icon: "DoorOpen",
  },
  {
    id: "terrasse",
    name: "La Terrasse Éco-Lounge",
    zone: "Zone 2",
    tagline: "Sous les étoiles de Yaoundé",
    description:
      "Salons en palettes recyclées, coussins en tissus hydrofuges, pergolas végétalisées et guirlandes foraines. Un jardin secret où le bambou rencontre la terre cuite, bercé par une brise tropicale.",
    image: "/images/terrasse.webp",
    materials: ["Palettes recyclées", "Bambou", "Pots en terre cuite"],
    craftLocation: "Menuiserie artisanale Mvan / Ékié",
    icon: "TreePalm",
  },
  {
    id: "salle",
    name: "La Grande Salle & Le Comptoir",
    zone: "Zone 3",
    tagline: "Le cœur battant de La Cachette",
    description:
      "Un comptoir monumental en briques et bois d'iroko verni, surmonté de dizaines de suspensions en raphia tressé. Les étagères rétro-éclairées exposent nos spiritueux tandis que les masques sculptés veillent sur l'assemblée.",
    image: "/images/bar.webp",
    materials: ["Briques apparentes", "Bois d'iroko", "Suspensions raphia"],
    icon: "Wine",
  },
  {
    id: "vip",
    name: "Le Salon VIP Lounge",
    zone: "Zone 4",
    tagline: "L'intimité version premium",
    description:
      "Fauteuils club retapissés en étoffes Ndop indigo et Bogolan, table basse sculptée dans un tronc d'arbre, tapis en jonc naturel. Une alcôve feutrée éclairée à la bougie pour les soirées d'exception.",
    image: "/images/vip.webp",
    materials: ["Textile Ndop / Bogolan", "Tronc sculpté", "Tapis jonc"],
    icon: "Crown",
  },
  {
    id: "cuisine",
    name: "La Cuisine Ouverte",
    zone: "Zone 5",
    tagline: "Transparence & fraîcheur",
    description:
      "Espace de préparation impeccable aux normes d'hygiène : plans en inox alimentaire, carrelage blanc lavable, épices étiquetées et produits frais du marché. Ici, la cuisine camerounaise se prépare sous vos yeux.",
    image: "/images/cuisine.webp",
    materials: ["Inox alimentaire", "Carrelage blanc", "Épices locales"],
    icon: "ChefHat",
  },
  {
    id: "sanitaires",
    name: "Les Sanitaires Signature",
    zone: "Zone 6",
    tagline: "Le souci du détail, partout",
    description:
      "Mur en briques rouges, vasque martelée en laiton, miroir encadré de raphia tressé et appliques vintage. Même aux toilettes, l'expérience La Cachette reste cohérente et soignée.",
    image: "/images/sanitaires.webp",
    materials: ["Briques rouges", "Vasque laiton", "Miroir raphia"],
    icon: "Sparkles",
  },
];

export const menuItems: MenuItem[] = [
  // ── Grillades & Poissons braisés ──
  {
    id: "poisson-braise",
    name: "Bar Braisé aux Aromates",
    description:
      "Bar entier braisé aux aromates locaux, servi avec aloko doré et bobolo artisanal.",
    price: 5500,
    category: "grillades",
    badge: "Incontournable",
    spices: ["Djansang", "Pébé", "Poivre de Penja"],
  },
  {
    id: "poulet-dg",
    name: "Poulet DG",
    description:
      "Poulet sauté aux plantains mûrs frits, légumes croquants et épices camerounaises.",
    price: 4500,
    category: "grillades",
    badge: "Chef",
    spices: ["Poivre de Penja", "Gingembre frais"],
  },
  {
    id: "brochettes-boeuf",
    name: "Brochettes Soya",
    description:
      "Brochettes de bœuf marinées aux épices soya, grillées au charbon de bois.",
    price: 2500,
    category: "grillades",
  },
  {
    id: "crevettes-grillees",
    name: "Crevettes Grillées Penja",
    description:
      "Crevettes jumbo grillées au beurre d'ail et poivre blanc de Penja.",
    price: 7000,
    category: "grillades",
    badge: "Signature",
  },
  // ── Spécialités camerounaises ──
  {
    id: "ndole",
    name: "Ndolé Royal",
    description:
      "Feuilles de ndolé aux crevettes fumées, viande de bœuf et arachides pilées.",
    price: 4000,
    category: "specialites",
    badge: "Incontournable",
  },
  {
    id: "eru",
    name: "Eru Traditionnel",
    description:
      "Eru aux feuilles de waterleaf, crayfish, peau de bœuf et huile de palme rouge.",
    price: 3500,
    category: "specialites",
  },
  {
    id: "mbongo-tchobi",
    name: "Mbongo Tchobi",
    description:
      "Sauce noire traditionnelle au poisson, épicée aux mbongo et hiio.",
    price: 4500,
    category: "specialites",
    badge: "Chef",
  },
  {
    id: "koki",
    name: "Koki aux Haricots",
    description:
      "Gâteau de haricots cornilles aux feuilles de bananier, huile de palme et épinards.",
    price: 2000,
    category: "specialites",
    isVegetarian: true,
  },
  // ── Cocktails Signature ──
  {
    id: "cocktail-cachette",
    name: "Le Secret de La Cachette",
    description:
      "Rhum vieux camerounais, jus de fruit de la passion, sirop de gingembre et zeste de citron vert.",
    price: 3500,
    category: "cocktails",
    badge: "Signature",
  },
  {
    id: "cocktail-ambre",
    name: "L'Ambre de Penja",
    description:
      "Whisky infusé au poivre de Penja, miel de forêt, citron et angostura.",
    price: 4000,
    category: "cocktails",
  },
  {
    id: "cocktail-baobab",
    name: "Sunset Baobab",
    description:
      "Gin, pulpe de baobab, jus d'ananas Victoria et sirop de citronnelle.",
    price: 3000,
    category: "cocktails",
    badge: "Nouveau",
  },
  // ── Boissons locales ──
  {
    id: "jus-foulerou",
    name: "Jus de Folléré",
    description: "Infusion d'hibiscus (bissap) glacée, sucrée au miel local.",
    price: 1000,
    category: "boissons",
  },
  {
    id: "jus-gingembre",
    name: "Ginger Shot Intense",
    description: "Concentré de gingembre frais, citron vert et piment.",
    price: 800,
    category: "boissons",
  },
  {
    id: "vin-palme",
    name: "Matango Frais",
    description: "Vin de palme traditionnel frais du jour, servi en calebasse.",
    price: 1500,
    category: "boissons",
    badge: "Incontournable",
  },
];

export const liveEvents: LiveEvent[] = [
  {
    id: "evt-1",
    title: "Acoustic Soul Night",
    date: "2026-09-13",
    time: "20h00",
    artist: "Blick Bassy Acoustic Set",
    genre: "Afro-Soul / Acoustic",
    description:
      "Session acoustique intimiste aux sonorités soul africaines, guitare et voix dans la lumière ambrée.",
  },
  {
    id: "evt-2",
    title: "Jazz & Cocktails Lounge",
    date: "2026-09-20",
    time: "21h00",
    artist: "Richard Bona Quartet",
    genre: "Jazz / Afro-Fusion",
    description:
      "Une soirée jazz fusion avec cocktails signature et tapas camerounaises.",
  },
  {
    id: "evt-3",
    title: "DJ Set Afro-Vintage",
    date: "2026-09-27",
    time: "22h00",
    artist: "DJ Sango",
    genre: "Afrobeats / Amapiano Lounge",
    description:
      "DJ set lounge mêlant afrobeats doux, amapiano et classiques camerounais revisités.",
  },
];

export const menuCategories: { key: MenuCategory; label: string; icon: string }[] = [
  { key: "grillades", label: "Grillades & Braisés", icon: "Flame" },
  { key: "specialites", label: "Spécialités Camerounaises", icon: "Soup" },
  { key: "cocktails", label: "Cocktails Signature", icon: "Martini" },
  { key: "boissons", label: "Boissons Locales", icon: "GlassWater" },
];
