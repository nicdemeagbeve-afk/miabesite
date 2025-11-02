"use client";

import React from "react";
import { Star, StarHalf } from "lucide-react"; // Import StarHalf
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Je n’y croyais pas, mais j’ai eu mon site en 4 minutes chrono !",
      author: "Kossi",
      location: "Lomé",
    },
    {
      quote: "Mon salon a maintenant un site web moderne sans que je touche au code.",
      author: "Aïcha",
      location: "Cotonou",
    },
    {
      quote: "Une solution incroyable pour lancer son business rapidement et à moindre coût.",
      author: "Moussa",
      location: "Abidjan",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
          Ce que nos clients disent de nous
        </h2>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(3)].map((_, i) => ( // 3 full stars
            <Star key={`full-${i}`} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          ))}
          <StarHalf className="h-6 w-6 fill-yellow-400 text-yellow-400" /> {/* 1 half star */}
          <Star className="h-6 w-6 text-yellow-400" /> {/* 1 empty star */}
          <span className="text-xl md:text-2xl font-semibold">3.5/5</span>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground mb-12">
          101 utilisateurs satisfaits
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <p className="text-base italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-primary text-sm">
                  – {testimonial.author}, {testimonial.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}