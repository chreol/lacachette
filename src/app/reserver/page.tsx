import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { ReservationBlock } from "@/components/ReservationSection";
import Footer from "@/components/Footer";
import { getPublicEvents } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Réserver une table",
  description:
    "Réservez une table à La Cachette, restaurant-bar Vintage Africain à Ékié, Yaoundé. Terrasse, salle principale ou salon VIP.",
  alternates: { canonical: `${SITE_URL}/reserver` },
  openGraph: {
    url: `${SITE_URL}/reserver`,
    title: "Réserver une table · La Cachette Yaoundé",
  },
};

export default async function ReserverPage() {
  const events = await getPublicEvents();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ReservationBlock events={events} />
      </main>
      <Footer />
    </>
  );
}
