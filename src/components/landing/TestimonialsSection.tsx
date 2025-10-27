"use client";

import React from "react";
import { Star } from "lucide-react";
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
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
          Ce que nos clients disent de nous
        </h2>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-2xl font-semibold">4.9/5</span>
        </div>
        <p className="text-xl text-muted-foreground mb-12">
          +1000 utilisateurs satisfaits
        </p>
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-primary">
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