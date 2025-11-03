import { LandingNavbar } from "@/components/landing-navbar";
import { HeroSection } from "@/components/hero-section";
import { ExperiencesSection } from "@/components/experiences-section";
import { EcoTripsSection } from "@/components/eco-trips-section";
import { SustainableItineraries } from "@/components/sustainable-itineraries";
import { BuyFromLocal } from "@/components/buy-from-local";
import { CraftStories } from "@/components/craft-stories";
import { BlogSection } from "@/components/blog-section";
import { CTABanner } from "@/components/cta-banner";
import { WhyTrekkingMiles } from "@/components/why-trekking-miles";
import { SustainableTourism } from "@/components/sustainable-tourism";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-bold">
      <LandingNavbar />
      <HeroSection />
      <ExperiencesSection />
      <EcoTripsSection />
      <SustainableItineraries />
      <BuyFromLocal />
      <CraftStories />
      <BlogSection />
      <WhyTrekkingMiles />
      <SustainableTourism />
      <Footer />
    </div>
  );
}
