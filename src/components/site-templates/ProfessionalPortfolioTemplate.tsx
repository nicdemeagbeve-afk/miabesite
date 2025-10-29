"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu,
  X,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ChevronUp,
  Hammer,
  Wrench,
  PaintRoller,
  Star,
  User,
  CheckCircle,
  Briefcase, // Added import
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the comprehensive schema type

interface ProfessionalPortfolioTemplateProps {
  siteData: SiteEditorFormData; // Use the comprehensive type
  subdomain: string; // Add subdomain prop
}

export function ProfessionalPortfolioTemplate({ siteData, subdomain }: ProfessionalPortfolioTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const primaryColorClass = `bg-${siteData.primaryColor}-700`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-700`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-700`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-800`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-900`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-600`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-600`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-700`;

  const accentColorClass = `bg-${siteData.secondaryColor}-500`;
  const accentColorTextClass = `text-${siteData.secondaryColor}-500`;
  const accentColorBorderClass = `border-${siteData.secondaryColor}-500`;

  const whatsappBgClass = 'bg-[#25D366]';
  const whatsappHoverBgClass = 'hover:bg-[#128C7E]';

  const sectionsVisibility = siteData.sectionsVisibility || {
    showHero: true,
    showAbout: true,
    showProductsServices: true,
    showTestimonials: true,
    showSkills: true,
    showContact: true,
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('change', handleScroll); // Corrected event listener cleanup
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, setSelectedIndex]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offset = 80;
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  // Use siteData.skills if available, otherwise fallback to hardcoded
  const skillsToDisplay = siteData.skills && siteData.skills.length > 0
    ? siteData.skills
    : [
        {
          icon: "Wrench",
          title: "Rénovation",
          description: "Expertise en rénovation complète et aménagement intérieur.",
        },
        {
          icon: "Hammer",
          title: "Réparation",
          description: "Interventions rapides et durables en plomberie, électricité, etc.",
        },
        {
          icon: "PaintRoller",
          title: "Finitions",
          description: "Maîtrise des finitions : peinture, carrelage, parquet.",
        },
      ];

  // Use siteData.productsAndServices as portfolio items if available, otherwise fallback to hardcoded
  const portfolioItemsToDisplay = siteData.productsAndServices.length > 0
    ? siteData.productsAndServices.map(p => ({
        image: p.image || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', // Fallback placeholder
        title: p.title,
        description: p.description,
        category: "Rénovation", // Placeholder, could be dynamic
        tags: ["Rénovation", "Aménagement"], // Placeholder, could be dynamic
      }))
    : [
        { image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: "Rénovation Complète d'Appartement", description: "Transformation d'un appartement ancien en espace moderne et fonctionnel", category: "renovation", tags: ["Rénovation", "Aménagement", "3 mois"] },
        { image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: "Réparation Salle de Bain", description: "Résolution de problèmes d'humidité et remplacement des équipements", category: "reparation", tags: ["Plomberie", "Carrelage", "2 semaines"] },
        { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80', title: "Finitions Cuisine Sur Mesure", description: "Réalisation d'une cuisine entièrement personnalisée avec finitions haut de gamme", category: "finition", tags: ["Cuisine", "Sur mesure", "1 mois"] },
      ];

  const testimonialsToDisplay = siteData.testimonials && siteData.testimonials.length > 0
    ? siteData.testimonials
    : [
        { quote: "J'ai confié la rénovation complète de mon appartement à cet artisan et je suis absolument ravi du résultat. Le travail a été réalisé dans les délais, avec un professionnalisme remarquable. Je recommande vivement !", author: "Thomas Martin", location: siteData.businessLocation || "Dakar", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { quote: "Une intervention rapide et efficace pour réparer une fuite d'eau qui menaçait de causer des dégâts importants. L'artisan a su identifier le problème rapidement et proposer une solution durable. Prix très correct pour la qualité du travail.", author: "Sophie Diallo", location: siteData.businessLocation || "Pikine", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        { quote: "La rénovation de ma cuisine a été un véritable succès grâce au professionnalisme et à l'expertise de cet artisan. Il a su comprendre mes besoins et proposer des solutions à la fois esthétiques et fonctionnelles. Un travail de qualité !", author: "Robert Ndiaye", location: siteData.businessLocation || "Mermoz", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
      ];

  const paymentMethods = siteData.paymentMethods && siteData.paymentMethods.length > 0
    ? siteData.paymentMethods
    : ["Mobile Money", "Cash", "Virement", "Wave"];

  // Helper to get Lucide icon component by name
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Wrench, Hammer, PaintRoller, Briefcase, Star, CheckCircle,
      // Add other Lucide icons as needed
    };
    return icons[iconName] || Wrench; // Default to Wrench if not found
  };

  return (
    <div className="font-sans antialiased text-gray-800 bg-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              {siteData.logoOrPhoto ? (
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={50} height={50} className="rounded-full object-cover" />
              ) : (
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white text-2xl", primaryColorClass)}>
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h1 className={cn("text-xl font-bold", primaryColorTextClass)}>{siteData.publicName}</h1>
                <p className={cn("text-sm font-medium", accentColorTextClass)}>Réalisations & Compétences</p>
              </div>
            </div>
            <div className={cn("hidden md:flex items-center gap-8")}>
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300">Accueil</a>}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#competences" onClick={(e) => handleSmoothScroll(e, '#competences')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300">Compétences</a>}
              {sectionsVisibility.showProductsServices && portfolioItemsToDisplay.length > 0 && <a href="#realisations" onClick={(e) => handleSmoothScroll(e, '#realisations')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300">Réalisations</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300">Témoignages</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300">Contact</a>}
            </div>
            <button className={cn("md:hidden text-2xl", primaryColorTextClass)} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-40">
            <nav className="flex flex-col items-center gap-4">
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Accueil</a>}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#competences" onClick={(e) => handleSmoothScroll(e, '#competences')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Compétences</a>}
              {sectionsVisibility.showProductsServices && portfolioItemsToDisplay.length > 0 && <a href="#realisations" onClick={(e) => handleSmoothScroll(e, '#realisations')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Réalisations</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Témoignages</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Contact</a>}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      {sectionsVisibility.showHero && (
        <section id="accueil" className={cn("relative py-32 text-white text-center bg-cover bg-center", primaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(52, 152, 219, 0.8) 100%), url('${siteData.heroBackgroundImage}')` : `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(52, 152, 219, 0.8) 100%), var(--${siteData.primaryColor}-700)` }}>
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{siteData.heroSlogan}</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p>
            <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform", whatsappBgClass, whatsappHoverBgClass, "shadow-lg hover:shadow-xl")}>
              <MessageSquare className="h-6 w-6" /> Discuter de mon projet
            </a>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && (
        <section id="competences" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Mes Domaines d'Expertise
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-full", secondaryColorClass)}></span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">Un savoir-faire diversifié pour répondre à tous vos besoins</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillsToDisplay.map((skill: any, index: number) => {
                const IconComponent = getLucideIcon(skill.icon);
                return (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-t-4" style={{ borderColor: `var(--${siteData.secondaryColor}-500)` }}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-700), var(--${siteData.secondaryColor}-500))` }}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className={cn("text-2xl font-semibold", primaryColorTextClass)}>{skill.title}</h3>
                    </div>
                    <p className="text-gray-600">{skill.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section (Hardcoded for now, could be dynamic) */}
      <section className={cn("py-20 text-white text-center", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-700) 0%, var(--${siteData.secondaryColor}-500) 100%)` }}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-4">
              <span className="block text-5xl font-bold mb-2">150+</span>
              <span className="text-lg opacity-90">Projets Réalisés</span>
            </div>
            <div className="p-4">
              <span className="block text-5xl font-bold mb-2">10+</span>
              <span className="text-lg opacity-90">Années d'Expérience</span>
            </div>
            <div className="p-4">
              <span className="block text-5xl font-bold mb-2">98%</span>
              <span className="text-lg opacity-90">Clients Satisfaits</span>
            </div>
            <div className="p-4">
              <span className="block text-5xl font-bold mb-2">24h</span>
              <span className="text-lg opacity-90">Délai d'Intervention</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      {sectionsVisibility.showProductsServices && portfolioItemsToDisplay.length > 0 && (
        <section id="realisations" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Mes Réalisations
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-full", secondaryColorClass)}></span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">Découvrez une sélection de mes projets les plus représentatifs</p>
            </div>
            {/* Filters (simplified for now, can be made dynamic later) */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Tous</button>
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Rénovation</button>
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Réparation</button>
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Finitions</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItemsToDisplay.map((item: any, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    <Image src={item.image} alt={item.title} width={400} height={256} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className={cn("text-xl font-semibold mb-2", primaryColorTextClass)}>{item.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section id="temoignages" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Ils m'ont fait confiance
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-full", secondaryColorClass)}></span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">Retours d'expérience de clients satisfaits</p>
            </div>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-8">
                  {testimonialsToDisplay.map((testimonial: any, index: number) => (
                    <div key={index} className="flex-none w-full pl-8">
                      <div className="bg-white rounded-xl p-12 shadow-lg text-center relative">
                        <span className={cn("absolute top-6 left-8 text-7xl font-serif opacity-10", accentColorTextClass)}>&ldquo;</span>
                        <p className="text-xl italic mb-8 relative z-10 leading-relaxed">{testimonial.quote}</p>
                        <div className="flex flex-col items-center justify-center gap-4">
                          {testimonial.avatar ? (
                            <Image src={testimonial.avatar} alt="Client" width={70} height={70} className={cn("rounded-full object-cover border-4", accentColorBorderClass)} />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <User className="h-8 w-8" />
                            </div>
                          )}
                          <div>
                            <h4 className={cn("text-xl font-semibold mb-1", primaryColorTextClass)}>{testimonial.author}</h4>
                            <p className="text-gray-600">{testimonial.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-8">
                {testimonialsToDisplay.map((_, index) => (
                  <button
                    key={index}
                    className={cn("h-3 w-3 rounded-full bg-gray-300 cursor-pointer transition-all duration-300", selectedIndex === index && cn("bg-red-500 scale-125", secondaryColorClass))}
                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {sectionsVisibility.showContact && (
        <section className={cn("py-20 text-white text-center", secondaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.secondaryColor}-600) 0%, var(--${siteData.primaryColor}-800) 100%)` }}>
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-4xl font-bold mb-4">Prêt à concrétiser votre projet ?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">N'hésitez pas à me contacter pour discuter de vos besoins et obtenir un devis personnalisé</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform", whatsappBgClass, whatsappHoverBgClass, "shadow-lg hover:shadow-xl")}>
                <MessageSquare className="h-6 w-6" /> Discuter de mon projet
              </a>
              {siteData.secondaryPhoneNumber && (
                <a href={`tel:${siteData.secondaryPhoneNumber}`} className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg">
                  <Phone className="h-6 w-6" /> Appeler maintenant
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className={cn("py-16 text-white", primaryColorDarkBgClass)}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-full after:bg-blue-500">
                {siteData.publicName}
              </h3>
              <p className="text-gray-300">Artisan passionné avec plus de 10 ans d'expérience dans la rénovation, la réparation et les finitions. Engagement qualité et satisfaction client garantis.</p>
              <div className="flex gap-4 mt-4">
                {siteData.facebookLink && (
                  <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {siteData.instagramLink && (
                  <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {siteData.whatsappNumber && (
                  <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-full after:bg-blue-500">
                Contact
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <p>{siteData.secondaryPhoneNumber || siteData.whatsappNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <p>{siteData.whatsappNumber}</p>
                </div>
                {siteData.email && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <p>{siteData.email}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p>{siteData.businessLocation || "Dakar, Sénégal"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-full after:bg-blue-500">
                Modes de paiement
              </h3>
              <p className="text-gray-300">Nous acceptons les paiements suivants :</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {paymentMethods.map((method: string, index: number) => (
                  <span key={index} className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-semibold">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10 opacity-70">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn("fixed bottom-8 right-8 h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300", secondaryColorClass, secondaryColorHoverBgClass, showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4')}
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
}