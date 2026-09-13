import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import StorySection from "@/components/StorySection";
import SpacesSection from "@/components/SpacesSection";
import MenuSection from "@/components/MenuSection";
import EventsSection from "@/components/EventsSection";
import { ReservationBlock } from "@/components/ReservationSection";
import DeliverySection from "@/components/DeliverySection";
import Footer from "@/components/Footer";
import { RestaurantJsonLd } from "@/components/RestaurantJsonLd";
import { getPublicEvents, getPublicMenu } from "@/lib/content";
import { getSiteContent, mapsUrlFromContent, napSameAs } from "@/lib/site-content";

export const revalidate = 30;

export default async function Home() {
  const [menuItems, events, site] = await Promise.all([
    getPublicMenu(),
    getPublicEvents(),
    getSiteContent(),
  ]);

  return (
    <>
      <RestaurantJsonLd
        menuItems={menuItems}
        events={events}
        mapsUrl={mapsUrlFromContent(site)}
        sameAs={napSameAs(site)}
        geo={{ lat: Number(site.geoLat), lng: Number(site.geoLng) }}
        addressStreet={site.addressStreet}
        email={site.email}
        phone={site.phone}
      />
      <Navbar />
      <main>
        <HeroSection title={site.heroTitle} subtitle={site.heroSubtitle} />
        <ConceptSection />
        <StorySection />
        <SpacesSection />
        <MenuSection items={menuItems} />
        <DeliverySection />
        <EventsSection events={events} />
        <ReservationBlock events={events} />
      </main>
      <Footer />
    </>
  );
}
