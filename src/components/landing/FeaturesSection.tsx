"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Server, Settings, Layout, Smartphone, FileText } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Sous-domaine personnalisé",
      description: "(tonnom.ctcsite.com)",
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Hébergement sécurisé",
      description: "(Serveurs rapides, 99% uptime)",
    },
    {
      icon: <Settings className="h-6 w-6 text-primary" />,
      title: "Maintenance incluse",
      description: "(Mises à jour, sécurité, support)",
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "Design automatique",
      description: "(Choisi selon ton secteur)",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Site responsive",
      description: "(Adapté à téléphone, tablette, PC)",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Contenu intelligent",
      description: "(Textes générés pour ton activité)",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          Ce que tu obtiens gratuitement
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}