"use client"; // Ceci est crucial pour un composant client

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
import React from "react"; // Pas besoin de Suspense ici, il est dans le composant parent
import { toast, Toaster } from "sonner"; // N'oubliez pas Toaster si vous l'utilisez

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
      <Toaster /> {/* Placez le Toaster ici si vous l'utilisez */}
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
  );
}