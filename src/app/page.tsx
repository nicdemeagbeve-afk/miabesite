"use client"; // This page needs to be a client component to use useSearchParams and toast

import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { toast } from "sonner";
import HomePageClient from "@/components/HomePageClient";

// Ce composant s'affichera pendant que le contenu principal charge
function LoadingFallback() {
  return <div>Chargement de la page, veuillez patienter un peu...</div>;
}

export default function Home() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'unauthorized') {
      toast.error("Accès non autorisé. Veuillez vous connecter ou créer un compte pour accéder à ce site.");
    }
  }, [searchParams]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <StepsSection />
          <FeaturesSection />
          {/* AboutSection is now a dedicated page, removed from here */}
          <ExamplesSection />
          <TestimonialsSection />
          <FAQSection />
          <PricingSection />
          {/* CallToActionSection removed as requested */}
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}