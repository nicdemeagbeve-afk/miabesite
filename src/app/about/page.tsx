import React from "react";
import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AboutSection } from "@/components/AboutSection"; // Import the moved AboutSection
import { getSupabaseStorageUrl } from "@/lib/utils"; // Import getSupabaseStorageUrl
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase

export const metadata: Metadata = {
  title: "À propos de nous",
  description: "Découvrez l'histoire, la mission, la vision et l'équipe de Miabesite.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AboutSection />
        <Image
          src={getSupabaseStorageUrl("static-assets", "about-miabesite-hero.png")}
          alt="À propos de Miabesite"
          width={1200} // Ajustez la largeur et la hauteur selon votre design
          height={600}
          className="w-full h-auto object-cover"
        />
      </main>
      <Footer />
    </div>
  );
}