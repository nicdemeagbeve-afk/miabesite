"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, ShoppingCart, Store, Phone, Mail, Facebook, Instagram, ChevronUp, Menu, X, Star, Wrench, User, Check, Briefcase, Hammer, PaintRoller, Palette, PencilRuler, StarHalf, CheckCircle } from 'lucide-react'; // Added all potentially used icons
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';

interface EcommerceTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

export function EcommerceTemplate({ siteData, subdomain }: EcommerceTemplateProps) {
  const [quantities, setQuantities] = React.useState<{ [index: number]: number }>({}); // New state for quantities, using index
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service: '', // This will hold product title + quantity + price
    message: '',
    product_name: '',
    product_price: undefined as number | undefined,
    product_currency: '',
    quantity: undefined as number | undefined,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-800`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-600`;

  const accentColorClass = `bg-${siteData.secondaryColor}-500`;
  const accentColorTextClass = `text-${siteData.secondaryColor}-500`; // Fixed: Added missing definition

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize quantities for existing products
  React.useEffect(() => {
    const initialQuantities: { [index: number]: number } = {};
    siteData.productsAndServices?.forEach((_, index) => {
      initialQuantities[index] = 1;
    });
    setQuantities(initialQuantities);
  }, [siteData.productsAndServices]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductOrder = (product: any, index: number, quantity: number) => { // Added index
    const productDetails = `${product.title} (Quantité: ${quantity}) - Prix: ${product.price || 'Non spécifié'} ${product.currency || ''}`;

    if (siteData.contactButtonAction === 'whatsapp') {
      const whatsappLink = `https://wa.me/${siteData.whatsappNumber}?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20votre%20offre%20:%20${encodeURIComponent(productDetails)}.`;
      window.open(whatsappLink, "_blank");
    } else if (siteData.contactButtonAction === 'phoneNumber' && siteData.secondaryPhoneNumber) {
      window.location.href = `tel:${siteData.secondaryPhoneNumber}`;
    } else if (siteData.contactButtonAction === 'emailForm' && siteData.showContactForm) {
      setFormData(prev => ({
        ...prev,
        service: productDetails, // Pre-fill service_interested with product details
        product_name: product.title,
        product_price: product.price,
        product_currency: product.currency,
        quantity: quantity,
        message: `Je souhaite commander : ${product.title} (Quantité: ${quantity}).`, // Pre-fill message
      }));
      // Smooth scroll to contact section
      const targetElement = document.querySelector('#contact');
      if (targetElement) {
        const offset = 80;
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/site/${subdomain}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_name: formData.name,
          sender_email: formData.email,
          sender_phone: formData.phone,
          service_interested: formData.service,
          message: formData.message,
          product_name: formData.product_name || undefined,
          product_price: formData.product_price || undefined,
          product_currency: formData.product_currency || undefined,
          quantity: formData.quantity || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erreur lors de l'envoi du message.");
      } else {
        toast.success("Message envoyé avec succès ! Nous vous recontacterons bientôt.");
        setFormData({ name: '', phone: '', email: '', service: '', message: '', product_name: '', product_price: undefined, product_currency: '', quantity: undefined }); // Clear form
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Une erreur inattendue est survenue lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
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

  const skillsToDisplay = siteData.skills || [];

  // Helper to get Lucide icon component by name (simplified for DefaultTemplate)
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Wrench, Star, Check, User, Phone, Mail, MessageSquare, ShoppingCart, Store, Briefcase, Hammer, PaintRoller, Palette, PencilRuler, StarHalf, CheckCircle
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
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xl", primaryColorClass)}>
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h1 className={cn("text-lg font-bold", primaryColorTextClass)}>{siteData.publicName}</h1> {/* Adjusted text size for mobile */}
                <p className="text-xs text-gray-600">Boutique en ligne</p> {/* Adjusted text size for mobile */}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#products" onClick={(e) => handleSmoothScroll(e, '#products')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm">Produits</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm">Services</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm">À propos</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm">Compétences</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm">Témoignages</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm">Contact</a>} {/* Adjusted text size for mobile */}
              <div className="relative">
                <ShoppingCart className={cn("h-5 w-5", primaryColorTextClass)} /> {/* Adjusted size for mobile */}
                {cartCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold text-white", secondaryColorClass)}> {/* Adjusted size for mobile */}
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
            <button className="md:hidden text-gray-700 text-xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}> {/* Adjusted text size for mobile */}
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-40">
            <nav className="flex flex-col items-center gap-4">
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#products" onClick={(e) => handleSmoothScroll(e, '#products')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Produits</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Services</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">À propos</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Compétences</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Témoignages</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Contact</a>} {/* Adjusted text size for mobile */}
              <div className="relative mt-4">
                <ShoppingCart className={cn("h-5 w-5", primaryColorTextClass)} /> {/* Adjusted size for mobile */}
                {cartCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold text-white", secondaryColorClass)}> {/* Adjusted size for mobile */}
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
        <section id="hero" className={cn("relative py-16 md:py-24 text-white text-center bg-cover bg-center px-4", primaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${siteData.heroBackgroundImage}')` : undefined }}> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-4xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            {siteData.logoOrPhoto && (
              <Image
                src={siteData.logoOrPhoto}
                alt={`${siteData.publicName} Logo`}
                width={siteData.heroBackgroundImage ? 60 : 100} // Smaller if background image, larger if not
                height={siteData.heroBackgroundImage ? 60 : 100}
                className={cn("rounded-full object-cover mb-4", siteData.heroBackgroundImage ? "mx-auto" : "mx-auto")}
              />
            )}
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{siteData.heroSlogan}</h2> {/* Adjusted text size for mobile */}
            <p className="text-base md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p> {/* Adjusted text size for mobile */}
            <Link
              href="#products"
              onClick={(e) => handleSmoothScroll(e, '#products')}
              className={cn("inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-base bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg w-full sm:w-auto", primaryColorTextClass)}
            >
              <ShoppingCart className="h-5 w-5" /> Acheter maintenant
            </Link>
          </div>
        </section>
      )}

      {/* Products Section */}
      {sectionsVisibility.showProductsServices && products.length > 0 && (
        <section id="products" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)}>Nos Produits</h2> {/* Adjusted text size and mb for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap and grid for mobile */}
              {products.map((product, index) => {
                const currentQuantity = quantities[index] || 1; // Use index for quantity
                return (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                    <div className="h-48 overflow-hidden"> {/* Adjusted height for mobile */}
                      {product.image ? (
                        <Image src={product.image} alt={product.title} width={300} height={192} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <Store className="h-10 w-10" /> {/* Adjusted size for mobile */}
                        </div>
                      )}
                    </div>
                    <div className="p-4"> {/* Adjusted padding for mobile */}
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.title}</h3> {/* Adjusted text size for mobile */}
                      <p className="text-gray-600 text-xs mb-4">{product.description}</p> {/* Ensured text-xs for smaller screens */}
                      {product.price !== undefined && (
                        <p className={cn("text-xl font-bold mb-4", secondaryColorTextClass)}> {/* Adjusted text size for mobile */}
                          {product.price} {product.currency}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <label htmlFor={`quantity-${index}`} className="sr-only">Quantité</label>
                        <input
                          type="number"
                          id={`quantity-${index}`}
                          min="1"
                          value={currentQuantity}
                          onChange={(e) => setQuantities(prev => ({ ...prev, [index]: parseInt(e.target.value) || 1 }))}
                          className="w-16 text-center border rounded-md py-1 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleProductOrder(product, index, currentQuantity)}
                        className={cn("w-full px-4 py-2 rounded-lg font-bold text-white text-sm transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass)}
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Section (New for Ecommerce Template) */}
      {sectionsVisibility.showProductsServices && services.length > 0 && (
        <section id="services" className="py-12 bg-white px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)}>Nos Services</h2> {/* Adjusted text size and mb for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap and grid for mobile */}
              {services.map((service, index) => {
                const currentQuantity = quantities[index] || 1; // Use index for quantity
                return (
                  <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                    <div className="h-40 overflow-hidden"> {/* Adjusted height for mobile */}
                      {service.image ? (
                        <Image src={service.image} alt={service.title} width={300} height={160} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <Wrench className="h-10 w-10" /> {/* Adjusted size for mobile */}
                        </div>
                      )}
                    </div>
                    <div className="p-4"> {/* Adjusted padding for mobile */}
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{service.title}</h3> {/* Adjusted text size for mobile */}
                      <p className="text-gray-600 text-xs mb-4">{service.description}</p> {/* Ensured text-xs for smaller screens */}
                      {service.price !== undefined && (
                        <p className={cn("text-xl font-bold mb-4", secondaryColorTextClass)}> {/* Adjusted text size for mobile */}
                          {service.price} {service.currency}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <label htmlFor={`service-quantity-${index}`} className="sr-only">Quantité</label>
                        <input
                          type="number"
                          id={`service-quantity-${index}`}
                          min="1"
                          value={currentQuantity}
                          onChange={(e) => setQuantities(prev => ({ ...prev, [index]: parseInt(e.target.value) || 1 }))}
                          className="w-16 text-center border rounded-md py-1 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleProductOrder(service, index, currentQuantity)}
                        className={cn("w-full px-4 py-2 rounded-lg font-bold text-white text-sm transition-colors duration-300 bg-[#25D366] hover:bg-[#128C7E]")}
                      >
                        {service.actionButton === 'quote' ? 'Demander un devis' : service.actionButton === 'book' ? 'Réserver' : 'Contacter'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showAbout && (
        <section id="about" className="py-12 bg-white px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl text-center"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold mb-8", primaryColorTextClass)}>À propos de nous</h2> {/* Adjusted text size for mobile */}
            <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed"> {/* Adjusted text size for mobile */}
              {siteData.aboutStory}
            </p>
          </div>
        </section>
      )}

      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && (
        <section id="skills" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)}>Nos Compétences</h2> {/* Adjusted text size and mb for mobile */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap and grid for mobile */}
              {skillsToDisplay.map((skill, index) => {
                const IconComponent = getLucideIcon(skill.icon || "Wrench"); // Default icon
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-3"> {/* Adjusted padding for mobile */}
                    <div className="flex items-center justify-center mb-4">{<IconComponent className={cn("h-6 w-6", primaryColorTextClass)} />}</div>
                    <h3 className="text-lg font-semibold text-gray-800">{skill.title}</h3> {/* Adjusted text size for mobile */}
                    <p className="text-muted-foreground text-xs">{skill.description}</p> {/* Ensured text-xs for smaller screens */}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section id="testimonials" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)}>Ce que nos clients disent</h2> {/* Adjusted text size and mb for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Adjusted gap and grid for mobile */}
              {testimonialsToDisplay.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg relative"> {/* Adjusted padding for mobile */}
                  <span className={cn("absolute top-2 left-4 text-5xl font-serif opacity-10", accentColorTextClass)}>&ldquo;</span> {/* Adjusted text size for mobile */}
                  <p className="text-base italic mb-4 relative z-10">{testimonial.quote}</p> {/* Adjusted text size for mobile */}
                  <div className="flex items-center gap-4">
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt="Client" width={40} height={40} className="rounded-full object-cover border-2 border-gray-200" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="h-5 w-5" /> {/* Adjusted size for mobile */}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{testimonial.author}</h4> {/* Adjusted text size for mobile */}
                      <p className="text-xs text-gray-600">{testimonial.location}</p> {/* Ensured text-xs for smaller screens */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showContact && (
        <section id="contact" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-3xl text-center"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)}>Contactez-nous</h2> {/* Adjusted text size and mb for mobile */}
            {siteData.showContactForm ? (
              <div className="bg-white p-6 rounded-lg shadow-md"> {/* Adjusted padding for mobile */}
                <form onSubmit={handleSubmit} className="space-y-4"> {/* Adjusted space-y for mobile */}
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1 text-sm">Nom complet</label> {/* Adjusted text size for mobile */}
                    <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.name} onChange={handleChange} /> {/* Adjusted padding and text size for mobile */}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1 text-sm">Téléphone</label> {/* Adjusted text size for mobile */}
                    <input type="tel" id="phone" name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.phone} onChange={handleChange} /> {/* Adjusted padding and text size for mobile */}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm">Email</label> {/* Adjusted text size for mobile */}
                    <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.email} onChange={handleChange} /> {/* Adjusted padding and text size for mobile */}
                  </div>
                  {siteData.productsAndServices.filter(item => item.actionButton !== 'buy').length > 0 && (
                    <div>
                      <label htmlFor="service" className="block text-gray-700 font-medium mb-1 text-sm">Service intéressé</label> {/* Adjusted text size for mobile */}
                      <select id="service" name="service" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.service} onChange={handleChange}> {/* Adjusted padding and text size for mobile */}
                        <option value="">Sélectionnez un service</option>
                        {siteData.productsAndServices.filter(item => item.actionButton !== 'buy').map((service: any, idx: number) => (
                          <option key={idx} value={service.title}>{service.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1 text-sm">Message</label> {/* Adjusted text size for mobile */}
                    <textarea id="message" name="message" required className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.message} onChange={handleChange}></textarea> {/* Adjusted padding, min-height, and text size for mobile */}
                  </div>
                  <button type="submit" className={cn("w-full px-5 py-2 rounded-lg font-bold text-white text-base transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass)} disabled={isSubmitting}> {/* Adjusted padding and text size for mobile */}
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4"> {/* Adjusted space-y for mobile */}
                {siteData.whatsappNumber && (
                  <a
                    href={`https://wa.me/${siteData.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-3 px-5 py-2 rounded-lg font-bold text-base text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg bg-[#25D366] hover:bg-[#128C7E] w-full sm:w-auto")}
                  >
                    <MessageSquare className="h-5 w-5" /> Discuter sur WhatsApp
                  </a>
                )}
                {siteData.secondaryPhoneNumber && (
                  <a
                    href={`tel:${siteData.secondaryPhoneNumber}`}
                    className={cn("inline-flex items-center gap-3 px-5 py-2 rounded-lg font-bold text-base text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg w-full sm:w-auto", secondaryColorClass, secondaryColorHoverBgClass)}
                  >
                    <Phone className="h-5 w-5" /> Appeler {siteData.secondaryPhoneNumber}
                  </a>
                )}
                {siteData.email && (
                  <a
                    href={`mailto:${siteData.email}`}
                    className={cn("inline-flex items-center gap-3 px-5 py-2 rounded-lg font-bold text-base text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg w-full sm:w-auto", primaryColorClass, primaryColorHoverBgClass)}
                  >
                    <Mail className="h-5 w-5" /> Envoyer un e-mail
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className={cn("py-6 text-white px-4", primaryColorDarkBgClass)}> {/* Adjusted padding for mobile */}
        <p className="text-xs text-gray-400"> {/* Ensured text-xs for smaller screens */}
          © {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}