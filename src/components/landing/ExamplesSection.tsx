"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link

// Placeholder images - in a real app, these would be actual images or dynamic
const exampleSites = [
  { name: "Restaurant 'Le Gourmet'", image: "/file.svg" }, // Using a placeholder image
  { name: "Boutique 'Mode Chic'", image: "/file.svg" },
  { name: "Salon de Coiffure 'Beauté Divine'", image: "/file.svg" },
  { name: "Startup 'InnovTech'", image: "/file.svg" },
  { name: "Association 'Aide aux Enfants'", image: "/file.svg" },
  { name: "Artisan 'Créations Bois'", image: "/file.svg" },
];

export function ExamplesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted px-4"> {/* Added px-4 */}
      <div className="container mx-auto text-center"> {/* Removed px-4 md:px-6, using container mx-auto */}
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
                priority={index === 0} // Add priority to the first image
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white text-lg font-semibold">{site.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
            Voir la démo en direct
          </Button>
        </div>
      </div>
    </section>
  );
}