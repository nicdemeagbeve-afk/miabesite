"use client"; // Ceci est crucial pour un composant client

import { HeroSection } from "@/components/landing/HeroSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ContactSection } from "@/components/landing/ContactSection"; // Import the new ContactSection
import { Footer } from "@/components/landing/Footer";
import { useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function HomePageClient() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'unauthorized') {
      toast.error("Accès non autorisé. Veuillez vous connecter ou créer un compte pour accéder à ce site.");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <ExamplesSection />
        <TestimonialsSection />
        <FAQSection />
        <PricingSection />
        <ContactSection /> {/* Add the new ContactSection here */}
      </main>
      <Footer />
    </div>
  );
}