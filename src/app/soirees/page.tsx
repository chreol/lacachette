import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import { RestaurantJsonLd } from "@/components/RestaurantJsonLd";
import { getPublicEvents, getPublicMenu } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Soirées live — Jazz, afro-soul & DJ set",
  description:
    "Programme des soirées de La Cachette à Ékié : live acoustique, jazz lounge et DJ set. Pré-réservez votre table pour la date.",
  alternates: { canonical: `${SITE_URL}/soirees` },
  openGraph: {
    url: `${SITE_URL}/soirees`,
    title: "Soirées La Cachette · Yaoundé",
  },
};

export default async function SoireesPage() {
  const [menuItems, events] = await Promise.all([getPublicMenu(), getPublicEvents()]);

  return (
    <>
      <RestaurantJsonLd menuItems={menuItems} events={events} />
      <Navbar />
      <main className="pt-24">
        <EventsSection events={events} />
      </main>
      <Footer />
    </>
  );
}
