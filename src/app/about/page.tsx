import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AboutSection } from "@/components/AboutSection"; // Import the moved AboutSection

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
      </main>
      <Footer />
    </div>
  );
}