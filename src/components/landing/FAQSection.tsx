"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Est-ce vraiment automatique ?",
      answer:
        "Oui, notre système basé sur l'IA génère votre site web complet en quelques minutes après que vous ayez rempli un court formulaire. Vous n'avez aucune compétence technique à avoir.",
    },
    {
      question: "Puis-je avoir un nom de domaine personnalisé ?",
      answer:
        "Oui, vous obtenez un sous-domaine personnalisé (ex: tonnom.ctcsite.com). Si vous souhaitez un nom de domaine entièrement personnalisé (ex: monentreprise.com), nous pouvons vous guider sur les étapes à suivre pour le connecter.",
    },
    {
      question: "Puis-je modifier mon site après ?",
      answer:
        "Absolument ! Une fois votre site créé, vous avez accès à un éditeur simple et intuitif qui vous permet de modifier les textes, les images, les couleurs et la structure de votre site à tout moment, sans risque de tout casser.",
    },
    {
      question: "Comment payer les 1000 F ?",
      answer:
        "Le paiement de 1000 F CFA se fait via des méthodes de paiement mobile locales sécurisées (Orange Money, Moov Money, etc.) ou par carte bancaire, directement sur notre plateforme.",
    },
    {
      question: "Que se passe-t-il si j’ai besoin d’aide ?",
      answer:
        "Notre équipe de support est disponible 24h/7 via WhatsApp pour répondre à toutes vos questions et vous assister en cas de besoin. Votre satisfaction est notre priorité.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
          Questions fréquentes
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base text-left">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}