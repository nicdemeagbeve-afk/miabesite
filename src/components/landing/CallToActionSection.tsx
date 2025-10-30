"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link

export function CallToActionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-primary text-primary-foreground px-4"> {/* Added px-4 */}
      <div className="container mx-auto text-center flex flex-col lg:flex-row items-center justify-center gap-8"> {/* Removed px-4 md:px-6, using container mx-auto */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl leading-tight">
            Ne laisse pas ton idée dormir.
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl font-light"> {/* Adjusted text size for mobile */}
            Mets ton business en ligne aujourd’hui <span className="font-semibold">gratuitement</span> !
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
            <Link href="/create-site/select-template"><span>Je crée mon site maintenant</span></Link>
          </Button>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <Image
            src="/globe.svg" // Using a placeholder image, replace with actual smartphone image if available
            width={400}
            height={400}
            alt="Smartphone affichant un site prêt"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}