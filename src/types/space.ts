export interface VisualAsset {
  id: string;
  title: string;
  category: 'exterior' | 'terrace' | 'bar' | 'vip' | 'kitchen' | 'food' | 'event';
  description: string;
  materials: string[];
  localCraftLocation?: string;
  zone?: string;
}

export const cachetteAssets: VisualAsset[] = [
  {
    id: 'hero-entrance',
    title: 'Vue crépusculaire de La Cachette',
    category: 'exterior',
    description: 'Arche en bambou, briques de terre et guirlandes foraines.',
    materials: ['Bambou local', 'Briques de terre cuite', 'Guirlandes LED 2700K'],
    zone: 'Zone 1 - Entrée'
  },
  {
    id: 'outdoor-terrace',
    title: 'Terrasse éco-responsable',
    category: 'terrace',
    description: 'Salons en palettes recyclées, pergolas végétalisées et plantes tropicales.',
    materials: ['Palettes recyclées', 'Tissus hydrofuges', 'Pots en terre cuite'],
    localCraftLocation: 'Menuiserie artisanale Mvan / Ékié',
    zone: 'Zone 2 - Terrasse'
  },
  {
    id: 'main-bar',
    title: 'Comptoir central et salle',
    category: 'bar',
    description: 'Comptoir maçonné en briques et plateau en bois dur verni.',
    materials: ['Briques apparentes', 'Bois d’iroko/ayous', 'Suspensions raphia'],
    zone: 'Zone 3 - Salle principale'
  },
  {
    id: 'vip-lounge',
    title: 'Salon intimiste VIP',
    category: 'vip',
    description: 'Fauteuils club retapissés en étoffes traditionnelles et lumière tamisée.',
    materials: ['Textile Ndop / Bogolan', 'Table basse tronc sculpté', 'Tapis jonc'],
    zone: 'Zone 4 - VIP'
  },
  {
    id: 'kitchen-functional',
    title: 'Cuisine optimisée',
    category: 'kitchen',
    description: 'Espace de préparation propre, compact et aux normes d’hygiène.',
    materials: ['Inox alimentaire', 'Carrelage blanc lavable'],
    zone: 'Zone 5 - Cuisine'
  },
  {
    id: 'food-braised-fish',
    title: 'Poisson braisé & accompagnements',
    category: 'food',
    description: 'Bar braisé aux aromates locaux, aloko doré et bobolo artisanal.',
    materials: ['Plat céramique artisanale', 'Planchette bois'],
  },
  {
    id: 'live-event',
    title: 'Soirées Acoustiques & Détente',
    category: 'event',
    description: 'Session musicale intimiste au cœur de la nuit yaoundéenne.',
    materials: ['Scène d’angle en bois', 'Éclairage d’ambiance'],
  }
];
