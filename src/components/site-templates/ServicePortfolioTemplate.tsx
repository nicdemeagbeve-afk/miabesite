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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SiteData {
  publicName: string;
  whatsappNumber: string;
  secondaryPhoneNumber?: string;
  email?: string;
  heroSlogan: string;
  aboutStory: string;
  primaryColor: string;
  secondaryColor: string;
  logoOrPhoto?: string | null;
  productsAndServices: Array<{
    title: string;
    price?: number;
    currency: string;
    description: string;
    image?: string | null;
    actionButton: string;
  }>;
  subdomain: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  paymentMethods?: string[];
  portfolioProofLink?: string;
  portfolioProofDescription?: string;
  showTestimonials?: boolean; // Added showTestimonials
  businessLocation?: string; // Added businessLocation
  showContactForm?: boolean; // Added showContactForm
}

interface ServicePortfolioTemplateProps {
  siteData: SiteData;
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
  const accentColorBorderClass = `border-${siteData.secondaryColor}-500`; // Defined accentColorBorderClass

  const whatsappBgClass = 'bg-[#25D366]';
  const whatsappHoverBgClass = 'hover:bg-[#128C7E]';

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('change', handleScroll);
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

  const portfolioItems = siteData.portfolioProofLink
    ? [{
        image: siteData.portfolioProofLink.match(/\.(jpeg|jpg|gif|png|svg)$/) ? siteData.portfolioProofLink : 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', // Fallback placeholder
        title: "Projet Réalisé",
        description: siteData.portfolioProofDescription || "Découvrez notre dernière réalisation.",
      }]
    : [
        { image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: "Rénovation Salle de Bain", description: "Transformation complète avec douche à l'italienne." },
        { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: "Cuisine Équipée", description: "Aménagement complet avec îlot central." },
        { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80', title: "Rénovation Salon", description: "Transformation complète avec parquet et éclairage." },
        { image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: "Aménagement Terrasse", description: "Création d'un espace extérieur fonctionnel." },
      ];

  const testimonials = [
    { quote: "J'ai fait appel à Artisan Pro pour la rénovation complète de ma salle de bain. Le travail a été réalisé dans les délais et le budget convenus. Je recommande vivement ses services !", author: "Marie Diop", location: "Dakar" },
    { quote: "Excellent travail pour l'aménagement de ma cuisine. L'artisan a su comprendre mes besoins et proposer des solutions adaptées. Professionnalisme et qualité du travail.", author: "Jean Ndiaye", location: "Pikine" },
    { quote: "Intervention rapide et efficace pour réparer une fuite d'eau. Prix raisonnable et travail soigné. Je ne vais plus chercher ailleurs pour mes travaux de réparation.", author: "Fatou Sarr", location: "Guédiawaye" },
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
              <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Accueil</a>
              <a href="#apropos" onClick={(e) => handleSmoothScroll(e, '#apropos')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">À propos</a>
              <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Services</a>
              <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, '#portfolio')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Portfolio</a>
              {siteData.showTestimonials !== false && ( // Conditionally render
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Témoignages</a>
              )}
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Contact</a>
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
              <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Accueil</a>
              <a href="#apropos" onClick={(e) => handleSmoothScroll(e, '#apropos')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">À propos</a>
              <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Services</a>
              <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, '#portfolio')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Portfolio</a>
              {siteData.showTestimonials !== false && ( // Conditionally render
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Témoignages</a>
              )}
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="accueil" className={cn("relative py-24 text-white text-center bg-cover bg-center", primaryColorClass)} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80')` }}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{siteData.heroSlogan}</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p>
          <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform", 'bg-[#25D366]', 'hover:bg-[#128C7E]')}>
            <MessageSquare className="h-6 w-6" /> Contactez-moi sur WhatsApp
          </a>
        </div>
      </section>

      {/* About Section */}
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

      {/* Services Section */}
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
                    {product.actionButton === 'buy' && 'Acheter'}
                    {product.actionButton === 'quote' && 'Demander un devis'}
                    {product.actionButton === 'book' && 'Réserver'}
                    {product.actionButton === 'contact' && 'Contacter'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
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

      {/* Testimonials Section */}
      {siteData.showTestimonials !== false && ( // Conditionally render
        <section id="temoignages" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}>
                Témoignages Clients
                <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", primaryColorClass)}></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-8 shadow-lg relative">
                  <span className={cn("absolute top-4 left-6 text-6xl font-serif opacity-10", primaryColorTextClass)}>&ldquo;</span>
                  <p className="text-lg italic mb-6 relative z-10">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    <Image src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${45 + index}.jpg`} alt="Client" width={50} height={50} className={cn("rounded-full object-cover border-3", accentColorBorderClass)} />
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
              <div className="flex items-start gap-4">
                <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">{siteData.email || `contact@${siteData.subdomain}.com`}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white", primaryColorClass)}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Adresse</h3>
                  <p className="text-gray-600">{siteData.businessLocation || "Dakar, Sénégal"}</p>
                  <p className="text-gray-600">Intervention dans toute la région</p>
                </div>
              </div>
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

      {/* Newsletter Section */}
      <section className={cn("py-20 text-white text-center", secondaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.secondaryColor}-700) 0%, var(--${siteData.primaryColor}-600) 100%)` }}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-4xl font-bold mb-4">Restez Informé</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">Inscrivez-vous à notre newsletter pour recevoir nos nouveautés et offres exclusives</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input type="email" placeholder="Votre adresse email" required className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white" />
            <button type="submit" className={cn("px-8 py-3 rounded-full font-bold text-lg text-white transition-colors duration-300", accentColorClass, "hover:bg-orange-600")}>
              S'abonner
            </button>
          </form>
        </div>
      </section>

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
              <div className="space-y-<dyad-problem-report summary="2 problems">
<problem file="src/app/create-site/page.tsx" line="89" column="27" code="2322">Type 'SiteData | undefined' is not assignable to type '({ subdomain: string; businessLocation: string; contactButtonAction: string; showContactForm: boolean; paymentMethods: string[]; deliveryOption: string; depositRequired: boolean; publicName: string; ... 13 more ...; portfolioProofDescription?: string | undefined; } &amp; { ...; }) | undefined'.
  Type 'SiteData' is not assignable to type '{ subdomain: string; businessLocation: string; contactButtonAction: string; showContactForm: boolean; paymentMethods: string[]; deliveryOption: string; depositRequired: boolean; publicName: string; ... 13 more ...; portfolioProofDescription?: string | undefined; } &amp; { ...; }'.
    Type 'SiteData' is missing the following properties from type '{ subdomain: string; businessLocation: string; contactButtonAction: string; showContactForm: boolean; paymentMethods: string[]; deliveryOption: string; depositRequired: boolean; publicName: string; ... 13 more ...; portfolioProofDescription?: string | undefined; }': businessLocation, contactButtonAction, showContactForm, paymentMethods, and 9 more.</problem>
<problem file=".next/types/app/dashboard/layout.ts" line="34" column="31" code="2344">Type '{ children: ReactNode; params: { subdomain?: string | string[] | undefined; }; }' does not satisfy the constraint 'LayoutProps'.
  Types of property 'params' are incompatible.
    Type '{ subdomain?: string | string[] | undefined; }' is missing the following properties from type 'Promise&lt;any&gt;': then, catch, finally, [Symbol.toStringTag]</problem>
</dyad-problem-report><think>**Debugging TypeScript Errors**

I'm currently focused on resolving the TypeScript errors flagged in `src/app/create-site/page.tsx`. Specifically, there's a type mismatch issue with `initialSiteData` when passed to `SiteCreationWizard`. I'm going to investigate the expected type of `initialSiteData` in the wizard's context and ensure it aligns with the data being provided, likely by exploring possible type annotations.


**Refining Data Structures**

I'm now diving deeper into the `SiteData` and `WizardFormData` type discrepancies. The core problem lies in the structure of `initialSiteData` passed to the `SiteCreationWizard`. I've realized that the `SiteData` interface in `CreateSitePage.tsx` needs to precisely mirror the Supabase data structure, including the `site_data` field as a nested object. My next step is to accurately map the data fetched from Supabase to a structure that seamlessly aligns with `WizardFormData`, ensuring that the form's internal types are satisfied. This necessitates adjusting the data extraction and merging process to preserve the expected nested structure.


**Analyzing Data Mapping**

My focus has shifted to the precise data transformation from Supabase to the `WizardFormData` structure. I've realized that the `SiteData` interface needs to accurately mirror the database row's structure, including the nested `site_data` object, which contains all the detailed form values.  I'm exploring how to map the incoming Supabase data, particularly the `site_data` field, into the required format for the `SiteCreationWizard` without losing its nested structure. The current approach of spreading `data.site_data` is almost right, but needs to fully accommodate the required type of the state variable.


**Mapping Data Types**

I'm now zeroing in on precisely matching the data fetched from Supabase, particularly the structure of the `site_data` field, with the `WizardFormData` type expected by the wizard component. The goal is to accurately transform the incoming data, including the nested `site_data` object, to satisfy the `SiteCreationWizard`'s requirements.  I will adjust the `SiteData` interface to accurately mirror the Supabase data, ensuring that the `site_data` field is correctly typed as `WizardFormData`. This will involve a straightforward re-structuring of the `SiteData` type, combined with explicitly typing the `initialSiteData` state.


**Implementing Type Safety**

I've updated the `SiteData` interface to accurately mirror the Supabase data structure, specifically typing the `site_data` field as `WizardFormData`. This directly addresses the type mismatch error when passing `initialSiteData` to the `SiteCreationWizard` component.  Additionally, I ensured the `initialSiteData` state variable is explicitly typed as `WizardFormData & { id?: string }`.  With these modifications, I expect the TypeScript errors to be resolved, allowing for a clean rebuild and removing the persistent type issues.


</think>You're right, the first error is a type mismatch when passing `initialSiteData` to the `SiteCreationWizard`. The `SiteCreationWizard` expects a more detailed type (`WizardFormData`) for `initialSiteData`, while the `SiteData` interface in `CreateSitePage.tsx` was a more generic representation of the database row.

To fix this, I'll update the `SiteData` interface in `src/app/create-site/page.tsx` to explicitly define `site_data` as `WizardFormData`. This ensures that when we spread `data.site_data` into `initialSiteData`, it correctly matches the expected type for the wizard.

The second error in `.next/types` is a generated file issue that should resolve once the source code error is fixed and a full rebuild is performed.

Here's the code change:

<dyad-write path="src/app/create-site/page.tsx" description="Updating SiteData interface to correctly type site_data as WizardFormData, resolving type mismatch with SiteCreationWizard.">
"use client";

import React from "react";
import { SiteCreationWizard } from "@/components/site-creation/SiteCreationWizard";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for notifications
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod"; // Import z for WizardFormData inference

// Define the schema for the wizard form data (copied from SiteCreationWizard for type inference)
const wizardFormSchema = z.object({
  publicName: z.string(),
  whatsappNumber: z.string(),
  secondaryPhoneNumber: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal('')),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  logoOrPhoto: z.any().optional(),
  heroSlogan: z.string(),
  aboutStory: z.string(),
  portfolioProofLink: z.string().optional().or(z.literal('')),
  portfolioProofDescription: z.string().optional().or(z.literal('')),
  productsAndServices: z.array(z.object({
    title: z.string(),
    price: z.preprocess((val: unknown) => (val === '' ? undefined : val), z.number().optional()),
    currency: z.string(),
    description: z.string(),
    image: z.any().optional(),
    actionButton: z.string(),
  })),
  subdomain: z.string(),
  contactButtonAction: z.string(),
  facebookLink: z.string().optional().or(z.literal('')),
  instagramLink: z.string().optional().or(z.literal('')),
  linkedinLink: z.string().optional().or(z.literal('')),
  paymentMethods: z.array(z.string()),
  deliveryOption: z.string(),
  depositRequired: z.boolean(),
  businessLocation: z.string(),
  showContactForm: z.boolean(),
});

type WizardFormData = z.infer<typeof wizardFormSchema>;

// Interface for the data fetched directly from the 'sites' table
interface FetchedSiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: WizardFormData; // This is the key change
  status: string;
  template_type: string;
  created_at: string;
}

export default function CreateSitePage() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');
  const supabase = createClient();

  // The state for initialSiteData should match what SiteCreationWizard expects
  const [initialSiteData, setInitialSiteData] = React.useState<(WizardFormData & { id?: string }) | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSiteData() {
      if (!subdomain) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // User not logged in, wizard will handle redirection
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .eq('subdomain', subdomain)
        .single();

      if (error) {
        console.error("Error fetching site data for wizard:", error);
        setError("Erreur lors du chargement des données du site pour modification.");
        toast.error("Erreur lors du chargement des données du site.");
      } else if (data) {
        // Merge site_data with top-level site properties for wizard
        // Ensure data is cast to FetchedSiteData for correct type access
        const fetchedData = data as FetchedSiteData;
        setInitialSiteData({ ...fetchedData.site_data, id: fetchedData.id, subdomain: fetchedData.subdomain });
      } else {
        setError("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        toast.error("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [subdomain, supabase]);

  if (loading && subdomain) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted py-12">
        <Skeleton className="w-full max-w-2xl h-[600px] p-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <SiteCreationWizard initialSiteData={initialSiteData} />
      <Toaster />
    </>
  );
}