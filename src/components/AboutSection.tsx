"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Lightbulb, Users, User as UserIcon } from "lucide-react";

export function AboutSection() {
  const teamMembers = [
    {
      name: "Nicodème AGBEVE",
      role: "Fondateur & Développeur",
      description: "Visionnaire et architecte technique de Miabesite, il transforme les idées en réalité numérique.",
    },
    {
      name: "Christian ADEGBETI",
      role: "Co-fondateur & Cybersec",
      description: "Garant de la sécurité de nos plateformes et de la protection des données de nos utilisateurs.",
    },
    {
      name: "Communication & Media Manager",
      role: "Un membre clé de notre équipe",
      description: "Assure la visibilité de Miabesite et la connexion avec notre communauté.",
    },
    {
      name: "Développeur Back-end",
      role: "Un membre clé de notre équipe",
      description: "Construit l'infrastructure robuste qui alimente nos sites web automatisés.",
    },
    {
      name: "Développeur Front-end",
      role: "Un membre clé de notre équipe",
      description: "Crée des interfaces utilisateur intuitives et esthétiques pour une expérience optimale.",
    },
  ];

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-background px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-blue-600">
          À propos de Miabesite
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Bienvenue chez Miabesite, votre partenaire pour une présence en ligne rapide et sans effort en Afrique de l'Ouest. Nous croyons que chaque entreprise, petite ou grande, mérite un site web moderne et professionnel sans les tracas techniques ou les coûts exorbitants.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-left space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-yellow-500" /> Notre Mission
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              Notre mission est de démocratiser la création de sites web grâce à une technologie d'intelligence artificielle avancée. En seulement 5 minutes et pour un coût unique de <span className="font-semibold text-blue-600">1000 F CFA</span>, nous transformons vos idées en une réalité numérique, vous permettant de vous concentrer sur ce qui compte le plus : votre business.
            </p>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Lightbulb className="h-7 w-7 text-blue-600" /> Notre Vision
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              Nous aspirons à être le leader de la création de sites web automatisée en Afrique, en offrant des solutions innovantes, accessibles et fiables qui propulsent les entrepreneurs et les petites entreprises vers le succès numérique.
            </p>
          </div>
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/about-miabesite-hero.png"
              alt="À propos de Miabesite"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-black">
          Notre Équipe
        </h3>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Miabesite est fier d'être une équipe locale passionnée par le numérique, dédiée à soutenir la croissance économique de notre région. Nous sommes là pour vous accompagner à chaque étape, avec un support réactif et une plateforme intuitive.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card key={index} className="flex flex-col items-center p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
              <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4 border-4 border-yellow-400 flex items-center justify-center bg-gray-200">
                <UserIcon className="h-16 w-16 text-gray-500" /> {/* Always render the UserIcon */}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h4>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-gray-600">{member.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}