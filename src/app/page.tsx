import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import StorySection from "@/components/StorySection";
import SpacesSection from "@/components/SpacesSection";
import MenuSection from "@/components/MenuSection";
import EventsSection from "@/components/EventsSection";
import ReservationSection from "@/components/ReservationSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ConceptSection />
        <StorySection />
        <SpacesSection />
        <MenuSection />
        <EventsSection />
        <ReservationSection />
      </main>
      <Footer />
    </>
  );
}
