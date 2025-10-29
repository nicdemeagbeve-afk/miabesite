"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, ShoppingCart, Store, Phone, Mail, Facebook, Instagram, ChevronUp, Menu, X, Star, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the comprehensive schema type

interface EcommerceTemplateProps {
  siteData: SiteEditorFormData; // Use the comprehensive type
}

export function EcommerceTemplate({ siteData }: EcommerceTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);

  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-800`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-600`;

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

  const handleAddToCart = (productTitle: string) => {
    setCartCount(prev => prev + 1);
    toast.success(`"${productTitle}" a été ajouté à votre panier !`);
  };

  const products = siteData.productsAndServices.filter(item => item.actionButton === 'buy');
  const services = siteData.productsAndServices.filter(item => item.actionButton !== 'buy'); // Separate services

  // Use siteData.testimonials if available, otherwise fallback to hardcoded
  const testimonialsToDisplay = siteData.testimonials && siteData.testimonials.length > 0
    ? siteData.testimonials
    : [
        { quote: "J'ai acheté plusieurs articles et la qualité est toujours au rendez-vous. Livraison rapide et service client impeccable !", author: "Fatou Diallo", location: siteData.businessLocation || "Dakar", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
        { quote: "Ma boutique préférée pour les produits artisanaux. Chaque pièce est unique et faite avec passion. Je recommande vivement !", author: "Moussa Traoré", location: siteData.businessLocation || "Abidjan", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
        { quote: "Des créations magnifiques et un excellent rapport qualité-prix. J'adore mes nouveaux bijoux !", author: "Aïcha Koné", location: siteData.businessLocation || "Lomé", avatar: "https://randomuser.me/api/portraits/women/67.jpg" },
      ];

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
                <p className="text-sm text-gray-600">Boutique en ligne</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#products" onClick={(e) => handleSmoothScroll(e, '#products')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Produits</a>}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Services</a>}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">À propos</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Témoignages</a>
              )}
              {sectionsVisibility.showSkills && siteData.skills && siteData.skills.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Compétences</a>}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Contact</a>}
              <div className="relative">
                <ShoppingCart className={cn("h-6 w-6", primaryColorTextClass)} />
                {cartCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white", secondaryColorClass)}>
                    {cartCount}
                  </span>
                )}
              </div>
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
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#products" onClick={(e) => handleSmoothScroll(e, '#products')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Produits</a>}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Services</a>}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">À propos</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Témoignages</a>
              )}
              {sectionsVisibility.showSkills && siteData.skills && siteData.skills.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Compétences</a>}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Contact</a>}
              <div className="relative mt-4">
                <ShoppingCart className={cn("h-6 w-6", primaryColorTextClass)} />
                {cartCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white", secondaryColorClass)}>
                    {cartCount}
                  </span>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      {sectionsVisibility.showHero && (
        <section id="hero" className={cn("relative py-24 text-white text-center bg-cover bg-center", primaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${siteData.heroBackgroundImage}')` : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), var(--${siteData.primaryColor}-600)` }}>
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{siteData.heroSlogan}</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p>
            <Link
              href="#products"
              onClick={(e) => handleSmoothScroll(e, '#products')}
              className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg", primaryColorTextClass)}
            >
              <ShoppingCart className="h-6 w-6" /> Acheter maintenant
            </Link>
          </div>
        </section>
      )}

      {/* Products Section */}
      {sectionsVisibility.showProductsServices && products.length > 0 && (
        <section id="products" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", primaryColorTextClass)}>Nos Produits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                  <div className="h-56 overflow-hidden">
                    {product.image ? (
                      <Image src={product.image} alt={product.title} width={400} height={224} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Store className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    {product.price !== undefined && (
                      <p className={cn("text-2xl font-bold mb-4", secondaryColorTextClass)}>
                        {product.price} {product.currency}
                      </p>
                    )}
                    <button
                      onClick={() => handleAddToCart(product.title)}
                      className={cn("w-full px-5 py-2 rounded-lg font-bold text-white transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass)}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section (New for Ecommerce Template) */}
      {sectionsVisibility.showProductsServices && services.length > 0 && (
        <section id="services" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", primaryColorTextClass)}>Nos Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                  <div className="h-48 overflow-hidden">
                    {service.image ? (
                      <Image src={service.image} alt={service.title} width={400} height={192} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Wrench className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    {service.price !== undefined && (
                      <p className={cn("text-2xl font-bold mb-4", secondaryColorTextClass)}>
                        {service.price} {service.currency}
                      </p>
                    )}
                    <Link
                      href={`https://wa.me/${siteData.whatsappNumber}?text=Je%20suis%20intéressé%20par%20le%20service%20${service.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn("w-full px-5 py-2 rounded-lg font-bold text-white transition-colors duration-300 bg-[#25D366] hover:bg-[#128C7E]")}
                    >
                      {service.actionButton === 'quote' ? 'Demander un devis' : service.actionButton === 'book' ? 'Réserver' : 'Contacter'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {sectionsVisibility.showAbout && (
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
            <h2 className={cn("text-3xl md:text-4xl font-bold mb-8", primaryColorTextClass)}>À propos de nous</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {siteData.aboutStory}
            </p>
          </div>
        </section>
      )}

      {/* Skills Section (New for Ecommerce Template) */}
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
        <section id="testimonials" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", primaryColorTextClass)}>Ce que nos clients disent</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonialsToDisplay.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-8 shadow-lg relative">
                  <span className={cn("absolute top-4 left-6 text-6xl font-serif opacity-10", primaryColorTextClass)}>&ldquo;</span>
                  <p className="text-lg italic mb-6 relative z-10">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt="Client" width={50} height={50} className="rounded-full object-cover border-2 border-gray-200" />
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
        <section id="contact" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", primaryColorTextClass)}>Contactez-nous</h2>
            <div className="flex flex-col items-center space-y-6">
              {siteData.whatsappNumber && (
                <a
                  href={`https://wa.me/${siteData.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg bg-[#25D366] hover:bg-[#128C7E]")}
                >
                  <MessageSquare className="h-6 w-6" /> Discuter sur WhatsApp
                </a>
              )}
              {siteData.secondaryPhoneNumber && (
                <a
                  href={`tel:${siteData.secondaryPhoneNumber}`}
                  className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg", secondaryColorClass, secondaryColorHoverBgClass)}
                >
                  <Phone className="h-6 w-6" /> Appeler {siteData.secondaryPhoneNumber}
                </a>
              )}
              {siteData.email && (
                <a
                  href={`mailto:${siteData.email}`}
                  className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg", primaryColorClass, primaryColorHoverBgClass)}
                >
                  <Mail className="h-6 w-6" /> Envoyer un e-mail
                </a>
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