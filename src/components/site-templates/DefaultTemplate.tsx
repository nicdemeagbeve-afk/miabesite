"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SiteData {
  publicName: string;
  whatsappNumber: string;
  heroSlogan: string;
  aboutStory: string;
  primaryColor: string;
  secondaryColor: string;
  subdomain: string;
  showTestimonials?: boolean; // Added showTestimonials for consistency
}

interface DefaultTemplateProps {
  siteData: SiteData;
}

export function DefaultTemplate({ siteData }: DefaultTemplateProps) {
  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", primaryColorTextClass)}>
        Bienvenue sur {siteData.publicName}!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8">
        {siteData.heroSlogan || "Votre site est en ligne."}
      </p>
      <p className="text-md text-gray-600 mb-12 max-w-prose">
        {siteData.aboutStory || "Ceci est votre site par défaut. Vous pouvez le personnaliser depuis votre tableau de bord."}
      </p>
      <Link
        href={`https://wa.me/${siteData.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg", primaryColorClass, `hover:bg-${siteData.primaryColor}-700`)}
      >
        <MessageSquare className="h-6 w-6" /> Contactez-nous sur WhatsApp
      </Link>
      <p className="mt-8 text-sm text-gray-500">
        Sous-domaine: {siteData.subdomain}.miabesite.site
      </p>
    </div>
  );
}