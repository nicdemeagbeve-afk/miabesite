"use client"; // Ceci est crucial pour un composant client

import { HeroSection } from "@/components/landing/HeroSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { useSearchParams } from "next/navigation"; // Importez useSearchParams ici
import React from "react"; // Importez React si vous utilisez React.useEffect
import { toast } from "sonner"; // Importez toast et Toaster si vous les utilisez

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
      </main>
      <Footer />
    </div>
  );
}