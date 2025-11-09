"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare, MapPin, Star, Wrench, Phone, Mail, User, Check, Briefcase, Hammer, PaintRoller, Palette, PencilRuler, StarHalf, CheckCircle, Menu, X, ChevronUp } from 'lucide-react'; // Added all potentially used icons
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';
import { toast } from 'sonner'; // Import toast for notifications
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Import Sheet components
import { Button } from "@/components/ui/button"; // Import Button

interface DefaultTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

export function DefaultTemplate({ siteData, subdomain }: DefaultTemplateProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);


  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-600`; // Defined here

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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offset = 80; // Adjust offset as needed for fixed header
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erreur lors de l'envoi du message.");
      } else {
        toast.success("Message envoyé avec succès ! Nous vous recontacterons bientôt.");
        setFormData({ name: '', phone: '', email: '', service: '', message: '' }); // Clear form
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Une erreur inattendue est survenue lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const productsAndServicesToDisplay = siteData.productsAndServices || [];
  const testimonialsToDisplay = siteData.testimonials || [];
  const skillsToDisplay = siteData.skills || [];

  // Helper to get Lucide icon component by name
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      MessageSquare, MapPin, Star, Wrench, Phone, Mail, User, Check, Briefcase, Hammer, PaintRoller, Palette, PencilRuler, StarHalf, CheckCircle
    };
    return icons[iconName] || Wrench; // Default to Wrench if not found
  };

  const navLinks = (
    <>
      {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Accueil</a>}
      {sectionsVisibility.showAbout && <a href="#apropos" onClick={(e) => handleSmoothScroll(e, '#apropos')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">À Propos</a>}
      {sectionsVisibility.showProductsServices && productsAndServicesToDisplay.length > 0 && <a href="#offres" onClick={(e) => handleSmoothScroll(e, '#offres')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Nos Offres</a>}
      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Témoignages</a>}
      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#competences" onClick={(e) => handleSmoothScroll(e, '#competences')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Compétences</a>}
      {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Contact</a>}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              {siteData.logoOrPhoto && (
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={40} height={40} className="rounded-full object-cover" />
              )}
              <h1 className={cn("text-lg font-bold", primaryColorTextClass)}>
                {siteData.publicName}
              </h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks}
            </div>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <div className="flex flex-col h-full py-4">
                    <div className="px-6 mb-4">
                      <h2 className="font-bold text-xl">{siteData.publicName}</h2>
                    </div>
                    <nav className="flex flex-col gap-2 px-6 text-base font-medium flex-1">
                      {navLinks}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {sectionsVisibility.showHero && (
        <section id="accueil" className={cn("py-12 md:py-24 lg:py-32 w-full bg-cover bg-center text-white flex flex-col items-center justify-center px-4", `bg-${siteData.primaryColor}-600`)}
          style={{
            backgroundImage: siteData.heroBackgroundImage
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${siteData.heroBackgroundImage}')`
              : undefined // Let Tailwind class handle background color if no image
          }}
        >
          {siteData.logoOrPhoto && (
            <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={80} height={80} className={cn("rounded-full object-cover mb-4", siteData.heroBackgroundImage ? "mx-auto" : "mx-auto")} />
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Bienvenue sur {siteData.publicName}!
          </h1>
          <p className="text-base md:text-xl mb-8 max-w-prose">
            {siteData.heroSlogan || "Votre site est en ligne."}
          </p>
          <Link
            href={`https://wa.me/${siteData.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-base text-white transition-colors duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg bg-green-500 hover:bg-green-600 w-full sm:w-auto")}
          >
            <MessageSquare className="h-5 w-5" /> Contactez-nous sur WhatsApp
          </Link>
        </section>
      )}

      {sectionsVisibility.showAbout && siteData.aboutStory && (
        <section id="apropos" className="py-12 md:py-24 w-full bg-white text-center px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-6", primaryColorTextClass)}>À Propos de Nous</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {siteData.aboutStory}
            </p>
          </div>
        </section>
      )}

      {sectionsVisibility.showProductsServices && productsAndServicesToDisplay.length > 0 && (
        <section id="offres" className="py-12 md:py-24 w-full bg-gray-50 text-center px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-12", primaryColorTextClass)}>Nos Offres</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productsAndServicesToDisplay.map((product, index) => {
                const productDetails = encodeURIComponent(`${product.title} - ${product.price || 'Prix non spécifié'} ${product.currency || ''}`);
                let contactLink = `https://wa.me/${siteData.whatsappNumber}?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20votre%20offre%20:%20${productDetails}.`;

                if (siteData.contactButtonAction === 'emailForm' && siteData.email) {
                  // For email form, we'll just direct to the contact section and rely on user to specify
                  // Or, if we had a dedicated product inquiry form, we could pre-fill.
                  // For now, WhatsApp is the most direct way to pass structured info.
                  contactLink = `#contact`; // Direct to contact form
                } else if (siteData.contactButtonAction === 'phoneNumber' && siteData.secondaryPhoneNumber) {
                  contactLink = `tel:${siteData.secondaryPhoneNumber}`;
                }

                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                    {product.image && (
                      <Image src={product.image} alt={product.title} width={120} height={80} className="mx-auto mb-4 object-cover rounded-md" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                    <p className="text-muted-foreground text-xs">{product.description}</p>
                    {product.price && (
                      <p className={cn("text-xl font-bold", secondaryColorTextClass)}>
                        {product.price} {product.currency}
                      </p>
                    )}
                    <Link
                      href={contactLink}
                      target={siteData.contactButtonAction === 'whatsapp' ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm text-white transition-colors duration-300 bg-green-500 hover:bg-green-600 w-full")}
                      onClick={(e) => {
                        if (siteData.contactButtonAction === 'emailForm' && siteData.showContactForm) {
                          setFormData(prev => ({ ...prev, service: product.title }));
                          handleSmoothScroll(e, '#contact');
                        }
                      }}
                    >
                      <MessageSquare className="h-4 w-4" /> {product.actionButton === 'buy' ? 'Acheter' : product.actionButton === 'quote' ? 'Demander un devis' : product.actionButton === 'book' ? 'Réserver' : 'Contacter'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section id="temoignages" className="py-12 md:py-24 w-full bg-white text-center px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-12", primaryColorTextClass)}>Ce que nos clients disent</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonialsToDisplay.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-4 text-left">
                  <p className="text-base italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <Image src={testimonial.avatar} alt={testimonial.author} width={40} height={40} className="rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-semibold text-primary text-sm">
                        – {testimonial.author}, {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && (
        <section id="competences" className="py-12 md:py-24 w-full bg-gray-50 text-center px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-12", primaryColorTextClass)}>Nos Compétences</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skillsToDisplay.map((skill, index) => {
                const IconComponent = skill.icon ? getLucideIcon(skill.icon) : Wrench;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                    <div className="flex items-center justify-center mb-4"><IconComponent className={cn("h-6 w-6", primaryColorTextClass)} /></div>
                    <h3 className="text-lg font-semibold text-gray-800">{skill.title}</h3>
                    <p className="text-muted-foreground text-xs">{skill.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showContact && (
        <section id="contact" className="py-12 md:py-24 w-full bg-white text-center px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-8", primaryColorTextClass)}>Contactez-nous</h2>
            {siteData.showContactForm ? (
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1 text-sm">Nom complet</label>
                    <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1 text-sm">Téléphone</label>
                    <input type="tel" id="phone" name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                    <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.email} onChange={handleChange} />
                  </div>
                  {productsAndServicesToDisplay.length > 0 && (
                    <div>
                      <label htmlFor="service" className="block text-gray-700 font-medium mb-1 text-sm">Service intéressé</label>
                      <select id="service" name="service" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.service} onChange={handleChange}>
                        <option value="">Sélectionnez un service</option>
                        {productsAndServicesToDisplay.map((product: any, idx: number) => (
                          <option key={idx} value={product.title}>{product.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1 text-sm">Message</label>
                    <textarea id="message" name="message" required className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.message} onChange={handleChange}></textarea>
                  </div>
                  <button type="submit" className={cn("w-full px-5 py-2 rounded-lg font-bold text-white text-base transition-colors duration-300", primaryColorClass, `hover:bg-${siteData.primaryColor}-700`)} disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {siteData.whatsappNumber && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-500" /> WhatsApp: {siteData.whatsappNumber}
                  </p>
                )}
                {siteData.secondaryPhoneNumber && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5 text-blue-500" /> Téléphone: {siteData.secondaryPhoneNumber}
                  </p>
                )}
                {siteData.email && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5 text-red-500" /> Email: {siteData.email}
                  </p>
                )}
                {siteData.businessLocation && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" /> Localisation: {siteData.businessLocation}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="w-full py-6 bg-gray-800 text-white text-center mt-auto px-4">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
        </p>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn("fixed bottom-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300", secondaryColorClass, secondaryColorHoverBgClass, showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4')}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}