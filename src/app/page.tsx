import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { VenueShowcaseSection } from "@/components/landing/VenueShowcaseSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

export default function Home(){
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
      <Navbar />

        <HeroSection />
        <FeaturesSection />
        <VenueShowcaseSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}