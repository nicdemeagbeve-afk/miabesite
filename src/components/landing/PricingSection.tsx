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
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background px-4" id="pricing">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Nos Plans d'Abonnement
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choisissez le plan qui correspond le mieux à vos besoins et faites passer votre business au niveau supérieur.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={cn(
              "flex flex-col p-6 text-left shadow-lg transition-all duration-300 hover:scale-[1.02]",
              plan.name === "Standard" && "border-2 border-primary"
            )}>
              <CardHeader className="pb-4 flex flex-col items-center text-center">
                <div className="mb-4">{plan.icon}</div>
                <CardTitle className="text-xl md:text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">{plan.description}</CardDescription>
                <p className="text-3xl md:text-4xl font-extrabold mt-4 mb-6">
                  {plan.price}
                  {plan.name !== "Gratuit" && <span className="text-base font-medium text-muted-foreground">/mois</span>}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between p-0">
                <Link href={plan.link} passHref>
                  <Button asChild className="w-full mt-auto" variant={plan.buttonVariant as any}>
                    <div>
                      {plan.buttonText}
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nouvelle section CTA */}
        <div className="mt-16"> {/* Ajoute une marge supérieure pour séparer des cartes de prix */}
          <section
            className="relative w-full py-12 md:py-24 lg:py-32 bg-cover bg-center text-primary-foreground px-4 rounded-lg overflow-hidden"
            style={{ backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.8), rgba(var(--primary), 0.8)), url('/cta-Image.png')` }}
          >
            <div className="container mx-auto text-center relative z-10 space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl leading-tight">
                Prêt à lancer votre site ?
              </h2>
              <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
                Créez votre site professionnel gratuitement et mettez votre business en ligne en quelques minutes !
              </p>
              <Link href="/create-site/select-template" passHref>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto">
                  <div>
                    Commencer maintenant
                  </div>
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}