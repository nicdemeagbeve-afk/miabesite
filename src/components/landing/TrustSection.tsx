"use client";

import React from "react";
import { CheckCircle, Globe, DollarSign, MessageSquare, Bot, Users } from "lucide-react";

export function TrustSection() {
  const reasons = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      text: "+300 sites déjà créés en Afrique de l’Ouest",
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      text: "Hébergement local rapide et sécurisé",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-yellow-500" />,
      text: "Aucun abonnement caché — Gratuit une seule fois",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      text: "Support réactif sur WhatsApp",
    },
    {
      icon: <Bot className="h-6 w-6 text-indigo-500" />,
      text: "Système 100 % automatisé basé sur l’IA",
    },
    {
      icon: <Users className="h-6 w-6 text-red-500" />,
      text: "Créé par une équipe locale passionnée du numérique",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background px-4" id="about"> {/* Added px-4 */}
      <div className="container mx-auto text-center"> {/* Removed px-4 md:px-6, using container mx-auto */}
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          Pourquoi nous faire confiance ?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm text-left">
              {reason.icon}
              <p className="text-base md:text-lg">{reason.text}</p> {/* Adjusted text size for mobile */}
            </div>
          ))}
        </div>
        <div className="mt-12 text-xl md:text-2xl font-semibold text-primary"> {/* Adjusted text size for mobile */}
          Équipe Tech Africaine
        </div>
      </div>
    </section>
  );
}