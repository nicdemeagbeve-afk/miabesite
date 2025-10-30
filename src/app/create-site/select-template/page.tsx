"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, ShoppingCart, Briefcase, Palette, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectTemplatePage() {
  const templates = [
    {
      id: "default",
      name: "Site Basique",
      description: "Un site simple et efficace pour une présence en ligne rapide.",
      icon: <LayoutTemplate className="h-8 w-8 text-primary" />,
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Idéal pour vendre vos produits en ligne avec un panier et des fiches produits.",
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "service-portfolio",
      name: "Service & Portfolio",
      description: "Mettez en avant vos services et vos réalisations avec une galerie.",
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: "professional-portfolio",
      name: "Portfolio Professionnel",
      description: "Présentez votre expertise et vos projets pour attirer de nouveaux clients.",
      icon: <Palette className="h-8 w-8 text-primary" />,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    },
    {
      id: "artisan-ecommerce",
      name: "E-commerce Artisanal",
      description: "Une boutique en ligne chaleureuse pour vos créations faites à la main.",
      icon: <Store className="h-8 w-8 text-primary" />,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"> {/* Adjusted text size for mobile */}
          Choisissez votre Template
        </h1>
        <p className="text-base md:text-lg text-muted-foreground"> {/* Adjusted text size for mobile */}
          Sélectionnez le modèle qui correspond le mieux à votre activité. Vous pourrez le personnaliser par la suite.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col items-center p-4 md:p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300"> {/* Adjusted padding for mobile */}
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                {template.icon}
              </div>
              <CardTitle className="text-lg md:text-xl font-semibold">{template.name}</CardTitle> {/* Adjusted text size for mobile */}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between p-0">
              <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
              <div className="relative w-full h-32 rounded-md overflow-hidden mb-4">
                <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
              </div>
              <Link href={`/create-site?templateType=${template.id}`} passHref>
                <Button asChild className="w-full text-sm">
                  <div>
                    Sélectionner
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}