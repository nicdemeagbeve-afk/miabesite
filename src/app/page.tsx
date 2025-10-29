"use client"; // This page needs to be a client component to use useSearchParams and toast

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
import { PricingSection } from "@/components/landing/PricingSection"; // Import new PricingSection
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import React from "react";
import { toast } from "sonner"; // Import toast

export default function Home() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'unauthorized') {
      toast.error("Accès non autorisé. Veuillez vous connecter ou créer un compte pour accéder à ce site.");
    }
  }, [searchParams]);

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
        <PricingSection /> {/* Add the new Pricing Section here */}
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}