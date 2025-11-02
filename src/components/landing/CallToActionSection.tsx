"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { getSupabaseStorageUrl } from "@/lib/utils"; // Import getSupabaseStorageUrl
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase

export function CallToActionSection() {
  return (
    <section
      className="relative w-full py-12 md:py-24 lg:py-32 bg-cover bg-center text-primary-foreground px-4 overflow-hidden"
      style={{ backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.8), rgba(var(--primary), 0.8)), url('${getSupabaseStorageUrl("static-assets" , "cta-image.png")}')` }}
    >
      <div className="container mx-auto text-center relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl leading-tight">
            Ne laisse pas ton idée dormir.
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl font-light">
            Mets ton business en ligne aujourd’hui <span className="font-semibold">gratuitement</span> !
          </p>
          <Link href="/create-site/select-template" passHref>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto">
              <div>
                Je crée mon site maintenant
              </div>
            </Button>
          </Link>
        </div>
        <Image
          src={getSupabaseStorageUrl("static-assets", "cta-image.png")}
          alt="Appel à l'action"
          width={800} // Ajustez la largeur et la hauteur selon votre design
          height={450}
          className="mx-auto mt-8 rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}