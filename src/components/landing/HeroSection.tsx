"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link"; // Import Link

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            Ton site web en 5 minutes.
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light">
            Ton business en ligne démarre aujourd’hui — pour seulement <span className="font-semibold">1000 F CFA</span> !
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link href="/create-site/select-template">Créer mon site maintenant</Link>
          </Button>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Garantie satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Support 24h/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}