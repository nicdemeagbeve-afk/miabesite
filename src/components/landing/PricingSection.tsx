"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function PricingSection() {
  const plans = [
    {
      name: "Gratuit",
      price: "0 F CFA",
      description: "Idéal pour démarrer votre présence en ligne.",
      features: [
        "1 site web basique",
        "Sous-domaine personnalisé",
        "Hébergement sécurisé",
        "Maintenance incluse",
        "Support WhatsApp limité",
      ],
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      buttonText: "Démarrer gratuitement",
      buttonVariant: "outline",
      link: "/create-site/select-template",
    },
    {
      name: "Standard",
      price: "1500 F CFA/mois",
      description: "Pour les petites entreprises qui veulent plus de fonctionnalités.",
      features: [
        "Jusqu'à 3 sites web (1 premium)",
        "Toutes les fonctionnalités du plan Gratuit",
        "Paiement mobile intégré",
        "Support WhatsApp et Email",
        "Statistiques de base",
      ],
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      buttonText: "Choisir le plan Standard",
      buttonVariant: "default",
      link: "/signup", // Or a specific pricing checkout page
    },
    {
      name: "Premium",
      price: "2500 F CFA/mois",
      description: "La solution complète pour les professionnels exigeants.",
      features: [
        "Jusqu'à 5 sites web (3 premium)",
        "Toutes les fonctionnalités du plan Standard",
        "Paiement international",
        "Support prioritaire 24h/7",
        "Exportation de code (ZIP)",
        "Domaine personnalisé (ex: monentreprise.com)",
        "Statistiques avancées",
      ],
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      buttonText: "Choisir le plan Premium",
      buttonVariant: "default",
      link: "/signup", // Or a specific pricing checkout page
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background px-4" id="pricing"> {/* Added px-4 */}
      <div className="container mx-auto text-center"> {/* Removed px-4 md:px-6, using container mx-auto */}
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Nos Plans d'Abonnement
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"> {/* Adjusted text size for mobile */}
          Choisissez le plan qui correspond le mieux à vos besoins et faites passer votre business au niveau supérieur.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"> {/* Adjusted gap and grid for mobile */}
          {plans.map((plan, index) => (
            <Card key={index} className={cn(
              "flex flex-col p-6 text-left shadow-lg transition-all duration-300 hover:scale-[1.02]",
              plan.name === "Standard" && "border-2 border-primary" // Highlight standard plan
            )}>
              <CardHeader className="pb-4 flex flex-col items-center text-center">
                <div className="mb-4">{plan.icon}</div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2">{plan.name}</CardTitle> {/* Adjusted text size for mobile */}
                <CardDescription className="text-muted-foreground text-sm">{plan.description}</CardDescription> {/* Ensured text-sm for smaller screens */}
                <p className="text-3xl md:text-4xl font-extrabold mt-4 mb-6"> {/* Adjusted text size for mobile */}
                  {plan.price}
                  {plan.name !== "Gratuit" && <span className="text-base font-medium text-muted-foreground">/mois</span>} {/* Adjusted text size for mobile */}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between p-0">
                <ul className="space-y-3 mb-8 text-gray-700 text-sm"> {/* Ensured text-sm for smaller screens */}
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-auto" variant={plan.buttonVariant as any}>
                  <Link href={plan.link}>
                    <span>{plan.buttonText}</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}