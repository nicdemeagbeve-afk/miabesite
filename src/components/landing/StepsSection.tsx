"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Bot, Globe } from "lucide-react";

export function StepsSection() {
  const steps = [
    {
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      title: "1. Tu remplis un court formulaire",
      description: "Nom, activité, couleurs — et c’est tout !",
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "2. Notre IA crée ton site automatiquement",
      description: "Design, structure, textes et images adaptés à ton activité.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "3. Ton site est en ligne en moins de 5 minutes",
      description: "Avec ton propre sous-domaine (ex: tonnom.ctcsite.com) Et si tu veux, tu peux le modifier toi-même quand tu veux — sans rien casser.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background px-4"> {/* Added px-4 */}
      <div className="container mx-auto text-center"> {/* Removed px-4 md:px-6, using container mx-auto */}
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          En 3 étapes simples
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"> {/* Added max-w-5xl mx-auto for better centering on larger screens */}
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col items-center p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{step.description}</p> {/* Ensured text-sm for smaller screens */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}