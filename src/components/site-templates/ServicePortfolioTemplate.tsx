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
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  ChevronUp,
  Star,
  Wrench,
  Palette,
  Hammer,
  PaintRoller,
  CheckCircle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the comprehensive schema type

interface ServicePortfolioTemplateProps {
  siteData: SiteEditorFormData; // Use the comprehensive type
}

export function ServicePortfolioTemplate({ siteData }: ServicePortfolioTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-800`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-600`;

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

  const portfolioItems = siteData.productsAndServices.length > 0
    ? siteData.productsAndServices.map(p => ({
        image: p.image || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', // Fallback placeholder
        title: p.title,
        description: p.description,
        price: p.price,
        currency: p.currency,
        actionButton: p.actionButton,
      }))
    : [
        { image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: "Rénovation Salle de Bain", description: "Transformation complète avec douche à l'italienne.", price: 150000, currency: "XOF", actionButton: "quote" },
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: "Cuisine Équipée", description: "Aménagement complet avec îlot central.", price: 250000, currency: "XOF", actionButton: "quote" },
        { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80', title: "Rénovation Salon", description: "Transformation complète avec parquet et éclairage.", price: 100000, currency: "XOF", actionButton: "quote" },
        { image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: "Aménagement Terrasse", description: "Création d'un espace extérieur fonctionnel.", price: 80000, currency: "XOF", actionButton: "quote" },
      ];

  const testimonialsToDisplay = siteData.testimonials && siteData.testimonials.length > 0
    ? siteData.testimonials
    : [
        { quote: "J'ai fait appel à Artisan Pro pour la rénovation complète de ma salle de bain. Le travail a été réalisé dans les délais et le budget convenus. Je recommande vivement ses services !", author: "Marie Diop", location: siteData.businessLocation || "Dakar", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
        { quote: "Excellent travail pour l'aménagement de ma cuisine. L'artisan a su comprendre mes besoins et proposer des solutions adaptées. Professionnalisme et qualité du travail.", author: "Jean Ndiaye", location: siteData.businessLocation || "Pikine", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
        { quote: "Intervention rapide et efficace pour réparer une fuite d'eau. Prix raisonnable et travail soigné. Je ne vais plus chercher ailleurs pour mes travaux de réparation.", author: "Fatou Sarr", location: siteData.businessLocation || "Guédiawaye", avatar: "https://randomuser.me/api/portraits/women/67.jpg" },
      ];

  const paymentMethods = siteData.paymentMethods && siteData.paymentMethods.length > 0
    ? siteData.paymentMethods
    : ["Mobile Money", "Cash", "Virement", "Wave"];

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              {siteData.logoOrPhoto ? (
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={50} height={50} className="rounded-full object-cover" />
              ) : (
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-bold", primaryColorClass)}>
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h1 className={cn("text-xl font-bold", primaryColorTextClass)}>{siteData.publicName}</h1>
                <p className="text-sm text-gray-600">Expert en Rénovation</p>
              </div>
            </div>
            <div className={cn("hidden md:flex items-center gap-6")}>
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Accueil</a>}
              {sectionsVisibility.showAbout && <a href="#apropos" onClick={(e) => handleSmoothScroll(e, '#apropos')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">À propos</a>}
              {sectionsVisibility.showProductsServices && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Services</a>}
              {sectionsVisibility.showProductsServices && <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, '#portfolio')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Portfolio</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Témoignages</a>
              )}
              {sectionsVisibility.showSkills && siteData.skills && siteData.skills.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Compétences</a>}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Contact</a>}
            </div>
            <button className="md:hidden text-gray-700 text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-40">
            <nav className="flex flex-col items-center gap-4">
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Accueil</a>}
              {sectionsVisibility.showAbout && <a href="#apropos" onClick={(e) => handleSmoothScroll(e, '#apropos')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">À propos</a>}
              {sectionsVisibility.showProductsServices && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Services</a>}
              {sectionsVisibility.showProductsServices && <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, '#portfolio')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Portfolio</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Témoignages</a>
              )}
              {sectionsVisibility.showSkills && siteData.skills && siteData.skills.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Compétences</a>}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Contact</a>}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      {sectionsVisibility.showHero && (
        <section id="accueil" className={cn("relative py-24 text-white text-center bg-cover bg-center", primaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${siteData.heroBackgroundImage}')` : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), var(--${siteData.primaryColor}-600)` }}>
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{siteData.heroSlogan}</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p>
            <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform", whatsappBgClass, whatsappHoverBgClass)}>
              <MessageSquare className="h-6 w-6" /> Contactez-moi sur WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* About Section */}
      {sectionsVisibility.showAbout && (
        <section id="apropos" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                À propos de nous
                <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", primaryColorClass)}></span>
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 text-lg leading-relaxed space-y-4">
                <p>{siteData.aboutStory}</p>
                <p>Nous nous engageons à fournir un travail de qualité avec une attention particulière aux détails. Notre objectif est de satisfaire pleinement nos clients en répondant à leurs besoins spécifiques et en respectant les délais convenus. Chaque projet est pour nous l'occasion de créer un espace de vie amélioré et fonctionnel.</p>
                <p>Basé à {siteData.businessLocation || "Dakar, Sénégal"}, nous nous déplaçons dans toute la région pour réaliser vos projets.</p>
              </div>
              <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
                <Image src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Artisan au travail" width={700} height={400} className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {sectionsVisibility.showProductsServices && siteData.productsAndServices && siteData.productsAndServices.length > 0 && (
        <section id="services" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Nos Services
                <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", primaryColorClass)}></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteData.productsAndServices.map((product: any, index: number) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                  <div className="h-52 overflow-hidden">
                    {product.image ? (
                      <Image src={product.image} alt={product.title} width={400} height={208} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Wrench className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h3>
                    {product.price !== undefined && (
                      <div className={cn("text-2xl font-bold mb-4", primaryColorTextClass)}>
                        {product.price} {product.currency}
                      </div>
                    )}
                    <p className="text-gray-600 mb-6 text-sm">{product.description}</p>
                    <a href={`https://wa.me/${siteData.whatsappNumber}?text=Je%20suis%20intéressé%20par%20${product.title}`} target="_blank" rel="noopener noreferrer" className={cn("inline-block px-5 py-2 rounded-lg font-bold text-white transition-colors duration-300", secondaryColorClass, secondaryColorHoverBgClass)}>
                      {product.actionButton === 'buy' ? 'Acheter' : product.actionButton === 'quote' ? 'Demander un devis' : product.actionButton === 'book' ? 'Réserver' : 'Contacter'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section (using productsAndServices as portfolio items) */}
      {sectionsVisibility.showProductsServices && siteData.productsAndServices && siteData.productsAndServices.length > 0 && (
        <section id="portfolio" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Nos Réalisations
                <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", primaryColorClass)}></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioItems.map((item: any, index: number) => (
                <div key={index} className="relative rounded-lg overflow-hidden shadow-lg group">
                  <Image src={item.image} alt={item.title} width={400} height={250} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-200 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showSkills && siteData.skills && siteData.skills.length > 0 && (
        <section id="skills" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", primaryColorTextClass)}>Nos Compétences</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {siteData.skills.map((skill, index) => {
                const IconComponent = skill.icon ? (
                  // Placeholder for dynamic Lucide icon rendering
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

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section id="temoignages" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Témoignages Clients
                <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", primaryColorClass)}></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonialsToDisplay.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-8 shadow-lg relative">
                  <span className={cn("absolute top-4 left-6 text-6xl font-serif opacity-10", primaryColorTextClass)}>&ldquo;</span>
                  <p className="text-lg italic mb-6 relative z-10">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt="Client" width={50} height={50} className={cn("rounded-full object-cover border-3", accentColorBorderClass)} />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionsVisibility.showContact && (
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Contactez-nous
                <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", primaryColorClass)}></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Téléphone</h3>
                    <p className="text-gray-600">{siteData.secondaryPhoneNumber || siteData.whatsappNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">{siteData.whatsappNumber}</p>
                  </div>
                </div>
                {siteData.email && (
                  <div className="flex items-start gap-4">
                    <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">{siteData.email || `contact@${siteData.subdomain}.com`}</p>
                    </div>
                  </div>
                )}
                {siteData.businessLocation && (
                  <div className="flex items-start gap-4">
                    <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Adresse</h3>
                      <p className="text-gray-600">{siteData.businessLocation}</p>
                      <p className="text-gray-600">Intervention dans toute la région</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Horaires</h3>
                    <p className="text-gray-600">Lun - Sam: 8h00 - 18h00</p>
                    <p className="text-gray-600">Dimanche: Sur rendez-vous</p>
                  </div>
                </div>
              </div>
              {siteData.showContactForm && (
                <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom complet</label>
                      <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Téléphone</label>
                      <input type="tel" id="phone" name="phone" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                      <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Service intéressé</label>
                      <select id="service" name="service" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Sélectionnez un service</option>
                        {siteData.productsAndServices.map((product: any, idx: number) => (
                          <option key={idx} value={product.title}>{product.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                      <textarea id="message" name="message" required className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[150px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <button type="submit" className={cn("w-full px-6 py-3 rounded-lg font-bold text-white transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass)}>
                      Envoyer le message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={cn("py-8 text-white", primaryColorDarkBgClass)}>
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <Link href="/" className="font-bold text-xl">
              {siteData.publicName}
            </Link>
            <p className="text-sm text-gray-300 mt-2">
              {siteData.heroSlogan}
            </p>
          </div>
          <div className="flex gap-4">
            {siteData.facebookLink && (
              <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <Facebook className="h-6 w-6" />
              </a>
            )}
            {siteData.instagramLink && (
              <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <Instagram className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
        <div className="container px-4 md:px-6 text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
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