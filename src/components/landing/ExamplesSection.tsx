"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link

// Placeholder images - in a real app, these would be actual images or dynamic
const exampleSites = [
  { name: "Restaurant 'Le Gourmet'", image: "https://picsum.photos/seed/restaurant/400/300" },
  { name: "Boutique 'Mode Chic'", image: "https://picsum.photos/seed/fashion/400/300" },
  { name: "Salon de Coiffure 'Beauté Divine'", image: "https://picsum.photos/seed/salon/400/300" },
  { name: "Startup 'InnovTech'", image: "https://picsum.photos/seed/tech/400/300" },
  { name: "Association 'Aide aux Enfants'", image: "https://picsum.photos/seed/charity/400/300" },
  { name: "Artisan 'Créations Bois'", image: "https://picsum.photos/seed/craft/400/300" },
];

export function ExamplesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          Exemples de sites créés automatiquement
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {exampleSites.map((site, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src={site.image}
                alt={site.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white text-lg font-semibold">{site.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/create-site/select-template" passHref>
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto">
              <div>
                Voir la démo en direct
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}