import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";
import { RestaurantJsonLd } from "@/components/RestaurantJsonLd";
import { getPublicEvents, getPublicMenu } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Carte — Grillades, spécialités camerounaises & cocktails",
  description:
    "La carte de La Cachette à Ékié, Yaoundé : poisson braisé, poulet DG, ndolé, cocktails signature et boissons locales. Tarifs en FCFA.",
  alternates: { canonical: `${SITE_URL}/carte` },
  openGraph: {
    url: `${SITE_URL}/carte`,
    title: "Carte de La Cachette · Ékié, Yaoundé",
  },
};

export default async function CartePage() {
  const [menuItems, events] = await Promise.all([getPublicMenu(), getPublicEvents()]);

  return (
    <>
      <RestaurantJsonLd menuItems={menuItems} events={events} />
      <Navbar />
      <main className="pt-24">
        <MenuSection items={menuItems} />
      </main>
      <Footer />
    </>
  );
}
