import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CallToActionSection } from "@/components/landing/CallToActionSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <TrustSection />
        <ExamplesSection />
        <TestimonialsSection />
        <FAQSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}