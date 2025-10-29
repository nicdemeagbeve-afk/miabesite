"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare, MapPin, Star, Wrench } from 'lucide-react'; // Added MapPin, Star, Wrench icons
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Import Image component
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the comprehensive schema type

interface DefaultTemplateProps {
  siteData: SiteEditorFormData; // Use the comprehensive type
}

export function DefaultTemplate({ siteData }: DefaultTemplateProps) {
  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;

  const sectionsVisibility = siteData.sectionsVisibility || {
    showHero: true,
    showAbout: true,
    showProductsServices: true,
    showTestimonials: true,
    showSkills: true,
    showContact: true,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
      {sectionsVisibility.showHero && (
        <section className="py-12 md:py-24 lg:py-32 w-full bg-cover bg-center text-white flex flex-col items-center justify-center"
          style={{
            backgroundImage: siteData.heroBackgroundImage
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${siteData.heroBackgroundImage}')`
              : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), var(--${siteData.primaryColor}-600)`
          }}
        >
          {siteData.logoOrPhoto && (
            <Image
              src={siteData.logoOrPhoto}
              alt={`${siteData.publicName} Logo`}
              width={100}
              height={100}
              className="rounded-full object-cover mb-4"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenue sur {siteData.publicName}!
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-prose">
            {siteData.heroSlogan || "Votre site est en ligne."}
          </p>
          <Link
            href={`https://wa.me/${siteData.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg bg-[#25D366] hover:bg-[#128C7E]")}
          >
            <MessageSquare className="h-6 w-6" /> Contactez-nous sur WhatsApp
          </Link>
        </section>
      )}

      {sectionsVisibility.showAbout && siteData.aboutStory && (
        <section className="py-12 md:py-24 w-full bg-white text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className={cn("text-3xl font-bold mb-6", primaryColorTextClass)}>À Propos de Nous</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {siteData.aboutStory}
            </p>
          </div>
        </section>
      )}

      {sectionsVisibility.showProductsServices && siteData.productsAndServices && siteData.productsAndServices.length > 0 && (
        <section className="py-12 md:py-24 w-full bg-gray-50 text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl font-bold mb-12", primaryColorTextClass)}>Nos Offres</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {siteData.productsAndServices.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 space-y-3">
                  {product.image && (
                    <Image src={product.image} alt={product.title} width={150} height={100} className="mx-auto mb-4 object-cover rounded-md" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  {product.price && (
                    <p className={cn("text-2xl font-bold", secondaryColorTextClass)}>
                      {product.price} {product.currency}
                    </p>
                  )}
                  <Link
                    href={`https://wa.me/${siteData.whatsappNumber}?text=Je%20suis%20intéressé%20par%20${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white transition-colors duration-300 bg-[#25D366] hover:bg-[#128C7E]")}
                  >
                    <MessageSquare className="h-5 w-5" /> {product.actionButton === 'buy' ? 'Acheter' : product.actionButton === 'quote' ? 'Demander un devis' : product.actionButton === 'book' ? 'Réserver' : 'Contacter'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && siteData.testimonials && siteData.testimonials.length > 0 && (
        <section className="py-12 md:py-24 w-full bg-white text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className={cn("text-3xl font-bold mb-12", primaryColorTextClass)}>Ce que nos clients disent</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {siteData.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-6 text-left">
                  <p className="text-lg italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <Image src={testimonial.avatar} alt={testimonial.author} width={50} height={50} className="rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showSkills && siteData.skills && siteData.skills.length > 0 && (
        <section className="py-12 md:py-24 w-full bg-gray-50 text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl font-bold mb-12", primaryColorTextClass)}>Nos Compétences</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {siteData.skills.map((skill, index) => {
                const IconComponent = skill.icon ? (
                  // Dynamically render Lucide icon based on string name
                  // This requires a mapping or a dynamic import, for simplicity,
                  // we'll use a placeholder or a limited set for now.
                  // In a real app, you'd have a map like { "Wrench": Wrench, ... }
                  // For this example, let's just use a generic icon or a few hardcoded ones.
                  // For now, I'll use Wrench as a default if the icon name isn't explicitly handled.
                  // A more robust solution would involve a component that takes a string and returns the Lucide icon.
                  <Wrench className={cn("h-8 w-8", primaryColorTextClass)} />
                ) : (
                  <Wrench className={cn("h-8 w-8", primaryColorTextClass)} />
                );

                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 space-y-3">
                    <div className="flex items-center justify-center mb-4">{IconComponent}</div>
                    <h3 className="text-xl font-semibold text-gray-800">{skill.title}</h3>
                    <p className="text-muted-foreground text-sm">{skill.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showContact && (
        <section className="py-12 md:py-24 w-full bg-white text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className={cn("text-3xl font-bold mb-8", primaryColorTextClass)}>Contactez-nous</h2>
            <div className="space-y-4">
              {siteData.whatsappNumber && (
                <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
                  <MessageSquare className="h-6 w-6 text-green-500" /> WhatsApp: {siteData.whatsappNumber}
                </p>
              )}
              {siteData.secondaryPhoneNumber && (
                <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
                  <Phone className="h-6 w-6 text-blue-500" /> Téléphone: {siteData.secondaryPhoneNumber}
                </p>
              )}
              {siteData.email && (
                <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
                  <Mail className="h-6 w-6 text-red-500" /> Email: {siteData.email}
                </p>
              )}
              {siteData.businessLocation && (
                <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
                  <MapPin className="h-6 w-6 text-gray-500" /> Localisation: {siteData.businessLocation}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="w-full py-8 bg-gray-800 text-white text-center mt-auto">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}