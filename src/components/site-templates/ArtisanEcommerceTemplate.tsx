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
  Store,
  Search,
  User,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Lock,
  Headset,
  Heart,
  Eye,
  Star,
  Palette,
  PencilRuler,
  Wrench,
  StarHalf,
  Check,
  Hammer,
  PaintRoller,
  Briefcase,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';

interface ArtisanEcommerceTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

export function ArtisanEcommerceTemplate({ siteData, subdomain }: ArtisanEcommerceTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service: '', // For services section contact
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-800`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-700`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-700`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-800`;

  const accentColorClass = `bg-${siteData.secondaryColor}-500`;
  const accentColorTextClass = `text-${siteData.secondaryColor}-500`;
  const accentColorBorderClass = `border-${siteData.secondaryColor}-500`;

  const successColorClass = 'bg-green-600';
  const successColorTextClass = 'text-green-600';

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
      const offset = 100;
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

  const paymentMethods = siteData.paymentMethods && siteData.paymentMethods.length > 0
    ? siteData.paymentMethods
    : ["Mobile Money", "Wave", "Carte Bancaire", "Virement", "Cash"];

  const products = siteData.productsAndServices.filter((item: typeof siteData.productsAndServices[number]) => item.actionButton === 'buy');
  const services = siteData.productsAndServices.filter((item: typeof siteData.productsAndServices[number]) => item.actionButton !== 'buy');

  const testimonialsToDisplay = siteData.testimonials && siteData.testimonials.length > 0
    ? siteData.testimonials
    : [
        { quote: "J'ai commandé une table basse sur mesure et je suis absolument ravi du résultat. L'artisan a su comprendre exactement ce que je voulais et le produit final est encore plus beau que ce que j'imaginais.", author: "Marie Diop", location: siteData.businessLocation || "Dakar", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
        { quote: "Service de réparation rapide et efficace pour mon fauteuil ancien. Le prix était raisonnable et le travail soigné. Je recommande vivement cette boutique pour la qualité de ses services.", author: "Jean Ndiaye", location: siteData.businessLocation || "Pikine", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
        { quote: "La personnalisation du panier que j'ai offert en cadeau était parfaite. La gravure était précise et le produit de grande qualité. Livraison rapide et emballage soigné.", author: "Fatou Sarr", location: siteData.businessLocation || "Guédiawaye", avatar: "https://randomuser.me/api/portraits/women/67.jpg" },
      ];

  const skillsToDisplay = siteData.skills && siteData.skills.length > 0
    ? siteData.skills
    : [
        { icon: "PencilRuler", title: "Design Sur Mesure", description: "Création de pièces uniques selon vos envies." },
        { icon: "Wrench", title: "Restauration", description: "Redonner vie à vos objets anciens avec soin." },
        { icon: "Palette", title: "Finitions Artisanales", description: "Des détails qui font toute la différence." },
      ];

  // Helper to get Lucide icon component by name
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Wrench, Hammer, PaintRoller, Briefcase, Star, CheckCircle, PencilRuler, Palette,
      // Add other Lucide icons as needed
    };
    return icons[iconName] || Wrench; // Default to Wrench if not found
  };

  return (
    <div className="font-sans antialiased text-gray-800 bg-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className={cn("bg-gray-800 text-white py-2 text-sm", secondaryColorClass)}>
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex gap-4 sm:gap-6"> {/* Adjusted gap for mobile */}
              {siteData.secondaryPhoneNumber && (
                <a href={`tel:${siteData.secondaryPhoneNumber}`} className="text-white hover:text-gray-300 flex items-center gap-1 text-xs sm:text-sm"> {/* Adjusted text size for mobile */}
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" /> {siteData.secondaryPhoneNumber} {/* Adjusted size for mobile */}
                </a>
              )}
              {siteData.email && (
                <a href={`mailto:${siteData.email}`} className="text-white hover:text-gray-300 flex items-center gap-1 text-xs sm:text-sm"> {/* Adjusted text size for mobile */}
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" /> {siteData.email} {/* Adjusted size for mobile */}
                </a>
              )}
            </div>
            <div className="flex gap-3 sm:gap-4"> {/* Adjusted gap for mobile */}
              {siteData.facebookLink && (
                <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {siteData.instagramLink && (
                  <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              {siteData.whatsappNumber && (
                <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                  <MessageSquare className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2"> {/* Adjusted gap for mobile */}
              {siteData.logoOrPhoto ? (
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xl", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h1 className={cn("text-lg font-bold", secondaryColorTextClass)}>{siteData.publicName}</h1> {/* Adjusted text size for mobile */}
                <p className={cn("text-xs font-medium", primaryColorTextClass)}>Produits & Services Sur Mesure</p> {/* Adjusted text size for mobile */}
              </div>
            </div>
            <div className={cn("hidden md:flex items-center gap-6")}> {/* Adjusted gap for mobile */}
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm")}>Accueil</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm")}>Produits</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm")}>Services</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm")}>Compétences</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm")}>Avis Clients</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm")}>Contact</a>} {/* Adjusted text size for mobile */}
            </div>
            <div className="hidden md:flex items-center gap-4"> {/* Adjusted gap for mobile */}
              <a href="#" className={cn("relative text-gray-700 text-lg hover:text-red-500 transition-colors")}> {/* Adjusted text size for mobile */}
                <Search className="h-4 w-4" /> {/* Adjusted size for mobile */}
              </a>
              <a href="#" className={cn("relative text-gray-700 text-lg hover:text-red-500 transition-colors")}> {/* Adjusted text size for mobile */}
                <User className="h-4 w-4" /> {/* Adjusted size for mobile */}
              </a>
              <a href="#" className={cn("relative text-gray-700 text-lg hover:text-red-500 transition-colors")}> {/* Adjusted text size for mobile */}
                <ShoppingCart className="h-4 w-4" /> {/* Adjusted size for mobile */}
                {cartCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold text-white", primaryColorClass)}> {/* Adjusted size for mobile */}
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
            <button className={cn("md:hidden text-xl", primaryColorTextClass)} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}> {/* Adjusted text size for mobile */}
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-40">
            <nav className="flex flex-col items-center gap-4">
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Accueil</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Produits</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Services</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Compétences</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Avis Clients</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Contact</a>} {/* Adjusted text size for mobile */}
              <div className="flex gap-4 mt-4">
                <a href="#" className={cn("relative text-gray-700 text-lg hover:text-red-500 transition-colors")}> {/* Adjusted text size for mobile */}
                  <Search className="h-4 w-4" /> {/* Adjusted size for mobile */}
                </a>
                <a href="#" className={cn("relative text-gray-700 text-lg hover:text-red-500 transition-colors")}> {/* Adjusted text size for mobile */}
                  <User className="h-4 w-4" /> {/* Adjusted size for mobile */}
                </a>
                <a href="#" className={cn("relative text-gray-700 text-lg hover:text-red-500 transition-colors")}> {/* Adjusted text size for mobile */}
                  <ShoppingCart className="h-4 w-4" /> {/* Adjusted size for mobile */}
                  {cartCount > 0 && (
                    <span className={cn("absolute -top-2 -right-2 h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold text-white", primaryColorClass)}> {/* Adjusted size for mobile */}
                      {cartCount}
                    </span>
                  )}
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      {sectionsVisibility.showHero && (
        <section id="accueil" className={cn("relative py-16 md:py-24 text-white text-center bg-cover bg-center px-4", secondaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(231, 76, 60, 0.8) 100%), url('${siteData.heroBackgroundImage}')` : `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(231, 76, 60, 0.8) 100%), var(--${siteData.secondaryColor}-700)` }}> {/* Adjusted padding for mobile */}
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
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{siteData.heroSlogan}</h2> {/* Adjusted text size for mobile */}
            <p className="text-base md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p> {/* Adjusted text size for mobile */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center"> {/* Adjusted gap for mobile */}
              <a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-base bg-white text-red-600 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg w-full sm:w-auto", primaryColorTextClass)}> {/* Adjusted padding, text size, and width for mobile */}
                <ShoppingCart className="h-5 w-5" /> Voir les produits
              </a>
              <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-base bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg w-full sm:w-auto"> {/* Adjusted padding, text size, and width for mobile */}
                <Wrench className="h-5 w-5" /> Découvrir les services
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Features Section (Hardcoded for now, could be dynamic) */}
      <section className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
        <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Adjusted grid and gap for mobile */}
            <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"> {/* Adjusted padding for mobile */}
              <div className={cn("h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                <Truck className="h-8 w-8" /> {/* Adjusted size for mobile */}
              </div>
              <h3 className={cn("text-lg font-semibold mb-2", secondaryColorTextClass)}>Livraison Rapide</h3> {/* Adjusted text size for mobile */}
              <p className="text-gray-600 text-sm">Expédition sous 48h pour tous les produits en stock</p> {/* Adjusted text size for mobile */}
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"> {/* Adjusted padding for mobile */}
              <div className={cn("h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                <ShieldCheck className="h-8 w-8" /> {/* Adjusted size for mobile */}
              </div>
              <h3 className={cn("text-lg font-semibold mb-2", secondaryColorTextClass)}>Garantie Qualité</h3> {/* Adjusted text size for mobile */}
              <p className="text-gray-600 text-sm">Tous nos produits et services sont garantis 12 mois</p> {/* Adjusted text size for mobile */}
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"> {/* Adjusted padding for mobile */}
              <div className={cn("h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                <Lock className="h-8 w-8" /> {/* Adjusted size for mobile */}
              </div>
              <h3 className={cn("text-lg font-semibold mb-2", secondaryColorTextClass)}>Paiement Sécurisé</h3> {/* Adjusted text size for mobile */}
              <p className="text-gray-600 text-sm">Transactions 100% sécurisées avec cryptage SSL</p> {/* Adjusted text size for mobile */}
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"> {/* Adjusted padding for mobile */}
              <div className={cn("h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                <Headset className="h-8 w-8" /> {/* Adjusted size for mobile */}
              </div>
              <h3 className={cn("text-lg font-semibold mb-2", secondaryColorTextClass)}>Support Client</h3> {/* Adjusted text size for mobile */}
              <p className="text-gray-600 text-sm">Assistance 7j/7 par téléphone, email et WhatsApp</p> {/* Adjusted text size for mobile */}
            </div>
          </div>
        </div>
      </section>

      {sectionsVisibility.showProductsServices && products.length > 0 && (
        <section id="produits" className="py-12 bg-white px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
              <h2 className={cn("text-2xl md:text-4xl font-bold mb-4 relative inline-block", secondaryColorTextClass)}> {/* Adjusted text size for mobile */}
                Nos Produits Phares
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-lg", primaryColorClass)}></span> {/* Adjusted width for mobile */}
              </h2>
              <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">Découvrez une sélection de nos créations artisanales les plus populaires</p> {/* Adjusted mt and text size for mobile */}
            </div>
            {/* Product Filters (simplified for now) */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap"> {/* Adjusted gap and flex-wrap for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Tous</button> {/* Adjusted padding and text size for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Décoration</button> {/* Adjusted padding and text size for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Mobilier</button> {/* Adjusted padding and text size for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Accessoires</button> {/* Adjusted padding and text size for mobile */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted grid and gap for mobile */}
              {products.map((product: typeof siteData.productsAndServices[number], index: number) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative group">
                  {index === 0 && <span className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-lg text-xs font-bold text-white z-10", primaryColorClass)}>Nouveau</span>} {/* Adjusted padding and text size for mobile */}
                  {index === 1 && <span className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-lg text-xs font-bold text-white z-10", primaryColorClass)}>Bestseller</span>} {/* Adjusted padding and text size for mobile */}
                  <div className="h-48 overflow-hidden relative"> {/* Adjusted height for mobile */}
                    {product.image ? (
                      <Image src={product.image} alt={product.title} width={300} height={192} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Palette className="h-10 w-10" /> {/* Adjusted size for mobile */}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> {/* Adjusted position for mobile */}
                      <button className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-md hover:bg-gray-100 transition-colors"> {/* Adjusted size for mobile */}
                        <Heart className="h-4 w-4" /> {/* Adjusted size for mobile */}
                      </button>
                      <button className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-md hover:bg-gray-100 transition-colors"> {/* Adjusted size for mobile */}
                        <Eye className="h-4 w-4" /> {/* Adjusted size for mobile */}
                      </button>
                    </div>
                  </div>
                  <div className="p-4"> {/* Adjusted padding for mobile */}
                    <span className={cn("text-xs font-medium mb-1 block", accentColorTextClass)}>Décoration</span> {/* Placeholder category, adjusted text size for mobile */}
                    <h3 className={cn("text-lg font-semibold mb-2", secondaryColorTextClass)}>{product.title}</h3> {/* Adjusted text size for mobile */}
                    <div className="flex items-center gap-1 mb-4 text-yellow-500 text-xs"> {/* Adjusted text size for mobile */}
                      <Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3" /> {/* Adjusted size for mobile */}
                      <span className="text-gray-500">(24)</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      {product.price !== undefined && (
                        <span className={cn("text-xl font-bold", primaryColorTextClass)}> {/* Adjusted text size for mobile */}
                          {product.price} {product.currency}
                        </span>
                      )}
                      {index === 0 && <span className="text-gray-500 line-through text-sm">55,000 XOF</span>} {/* Adjusted text size for mobile */}
                      {index === 0 && <span className={cn("px-2 py-1 rounded-lg text-xs font-bold text-white", successColorClass)}>-18%</span>} {/* Adjusted padding and text size for mobile */}
                    </div>
                    <button onClick={() => handleAddToCart(product.title)} className={cn("w-full py-2.5 rounded-lg font-bold text-white text-sm transition-colors duration-300 flex items-center justify-center gap-2", secondaryColorClass, secondaryColorHoverBgClass)}> {/* Adjusted padding and text size for mobile */}
                      <ShoppingCart className="h-4 w-4" /> Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showProductsServices && services.length > 0 && (
        <section id="services" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
              <h2 className={cn("text-2xl md:text-4xl font-bold mb-4 relative inline-block", secondaryColorTextClass)}> {/* Adjusted text size for mobile */}
                Nos Services Sur Mesure
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-lg", primaryColorClass)}></span> {/* Adjusted width for mobile */}
              </h2>
              <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">Des prestations adaptées à vos besoins spécifiques</p> {/* Adjusted mt and text size for mobile */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted grid and gap for mobile */}
              {services.map((service: typeof siteData.productsAndServices[number], index: number) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-t-4" style={{ borderColor: `var(--${siteData.secondaryColor}-500)` }}> {/* Adjusted padding for mobile */}
                  <div className={cn("h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                    {index === 0 && <PencilRuler className="h-8 w-8" />} {/* Adjusted size for mobile */}
                    {index === 1 && <Wrench className="h-8 w-8" />} {/* Adjusted size for mobile */}
                    {index === 2 && <Palette className="h-8 w-8" />} {/* Adjusted size for mobile */}
                  </div>
                  <h3 className={cn("text-lg font-semibold mb-2", secondaryColorTextClass)}>{service.title}</h3> {/* Adjusted text size for mobile */}
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p> {/* Adjusted text size for mobile */}
                  {service.price !== undefined && (
                    <div className={cn("text-xl font-bold mb-6", primaryColorTextClass)}> {/* Adjusted text size for mobile */}
                      À partir de {service.price} {service.currency}
                    </div>
                  )}
                  <ul className="list-none space-y-2 mb-6 text-left text-sm"> {/* Adjusted space-y and text size for mobile */}
                    <li className="flex items-center gap-2"><Check className={cn("h-4 w-4", successColorTextClass)} /> Consultation personnalisée</li> {/* Adjusted size for mobile */}
                    <li className="flex items-center gap-2"><Check className={cn("h-4 w-4", successColorTextClass)} /> Esquisses et maquettes</li> {/* Adjusted size for mobile */}
                    <li className="flex items-center gap-2"><Check className={cn("h-4 w-4", successColorTextClass)} /> 3 propositions de design</li> {/* Adjusted size for mobile */}
                    <li className="flex items-center gap-2"><Check className={cn("h-4 w-4", successColorTextClass)} /> Ajustements illimités</li> {/* Adjusted size for mobile */}
                  </ul>
                  <a href={`https://wa.me/${siteData.whatsappNumber}?text=Je%20suis%20intéressé%20par%20le%20service%20${service.title}`} target="_blank" rel="noopener noreferrer" className={cn("w-full py-2.5 rounded-lg font-bold text-white text-sm transition-colors duration-300 flex items-center justify-center gap-2", secondaryColorClass, secondaryColorHoverBgClass)}> {/* Adjusted padding and text size for mobile */}
                    <ShoppingCart className="h-4 w-4" /> {service.actionButton === 'quote' && 'Demander un devis'}
                    {service.actionButton === 'book' && 'Réserver ce service'}
                    {service.actionButton === 'contact' && 'Contacter pour ce service'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && (
        <section id="skills" className="py-12 bg-white px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)}>Nos Compétences</h2> {/* Adjusted text size and mb for mobile */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted grid and gap for mobile */}
              {skillsToDisplay.map((skill: typeof siteData.skills[number], index: number) => {
                const IconComponent = getLucideIcon(skill.icon || "Wrench"); // Default icon
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 space-y-3"> {/* Adjusted padding for mobile */}
                    <div className="flex items-center justify-center mb-4"><IconComponent className={cn("h-6 w-6", primaryColorTextClass)} /></div> {/* Adjusted size for mobile */}
                    <h3 className="text-lg font-semibold text-gray-800">{skill.title}</h3> {/* Adjusted text size for mobile */}
                    <p className="text-muted-foreground text-sm">{skill.description}</p> {/* Adjusted text size for mobile */}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section className="py-12 bg-white px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
              <h2 className={cn("text-2xl md:text-4xl font-bold mb-4 relative inline-block", secondaryColorTextClass)}> {/* Adjusted text size for mobile */}
                Avis Clients
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-lg", primaryColorClass)}></span> {/* Adjusted width for mobile */}
              </h2>
              <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">Ce que disent nos clients satisfaits</p> {/* Adjusted mt and text size for mobile */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Adjusted grid and gap for mobile */}
              {/* Placeholder testimonials */}
              {testimonialsToDisplay.map((testimonial: typeof siteData.testimonials[number], index: number) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 shadow-lg relative"> {/* Adjusted padding for mobile */}
                  <span className={cn("absolute top-4 left-4 text-6xl font-serif opacity-10", accentColorTextClass)}>&ldquo;</span> {/* Adjusted text size for mobile */}
                  <p className="text-base italic mb-6 relative z-10 leading-relaxed">{testimonial.quote}</p> {/* Adjusted text size for mobile */}
                  <div className="flex items-center gap-4">
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt="Client" width={50} height={50} className={cn("rounded-full object-cover border-3", accentColorBorderClass)} />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"> {/* Adjusted size for mobile */}
                        <User className="h-6 w-6" /> {/* Adjusted size for mobile */}
                      </div>
                    )}
                    <div>
                      <h4 className={cn("text-lg font-semibold mb-1", secondaryColorTextClass)}>{testimonial.author}</h4> {/* Adjusted text size for mobile */}
                      <p className="text-gray-600 text-sm">{testimonial.location}</p> {/* Adjusted text size for mobile */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section (Hardcoded for now) */}
      <section className={cn("py-16 text-white text-center px-4", secondaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.secondaryColor}-700) 0%, var(--${siteData.primaryColor}-600) 100%)` }}> {/* Adjusted padding for mobile */}
        <div className="container mx-auto max-w-4xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
          <h2 className="text-3xl font-bold mb-4">Restez Informé</h2> {/* Adjusted text size for mobile */}
          <p className="text-base md:text-xl mb-8 opacity-90">Inscrivez-vous à notre newsletter pour recevoir nos nouveautés et offres exclusives</p> {/* Adjusted text size for mobile */}
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input type="email" placeholder="Votre adresse email" required className="flex-1 px-5 py-2.5 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white text-sm" /> {/* Adjusted padding and text size for mobile */}
            <button type="submit" className={cn("px-6 py-2.5 rounded-full font-bold text-base text-white transition-colors duration-300", accentColorClass, "hover:bg-orange-600")}> {/* Adjusted padding and text size for mobile */}
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      {sectionsVisibility.showContact && (
        <footer id="contact" className={cn("py-12 text-white px-4", primaryColorDarkBgClass)}> {/* Adjusted padding for mobile */}
          <div className="container mx-auto"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-12"> {/* Adjusted gap and mb for mobile */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:rounded-lg after:bg-blue-500"> {/* Adjusted width for mobile */}
                  {siteData.publicName}
                </h3>
                <p className="text-gray-300 text-sm">Créations uniques et services sur mesure pour valoriser votre intérieur. Qualité artisanale et satisfaction client garanties.</p> {/* Adjusted text size for mobile */}
                <div className="flex gap-3 mt-4"> {/* Adjusted gap for mobile */}
                  {siteData.facebookLink && (
                    <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"> {/* Adjusted size for mobile */}
                      <Facebook className="h-5 w-5" /> {/* Adjusted size for mobile */}
                    </a>
                  )}
                  {siteData.instagramLink && (
                    <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"> {/* Adjusted size for mobile */}
                      <Instagram className="h-5 w-5" /> {/* Adjusted size for mobile */}
                    </a>
                  )}
                  {siteData.whatsappNumber && (
                    <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-500 transition-colors"> {/* Adjusted size for mobile */}
                      <MessageSquare className="h-5 w-5" /> {/* Adjusted size for mobile */}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:rounded-lg after:bg-blue-500"> {/* Adjusted width for mobile */}
                  Liens Rapides
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm"> {/* Adjusted space-y and text size for mobile */}
                  {sectionsVisibility.showHero && <li><a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="hover:text-blue-500 transition-colors">Accueil</a></li>}
                  {sectionsVisibility.showProductsServices && products.length > 0 && <li><a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className="hover:text-blue-500 transition-colors">Produits</a></li>}
                  {sectionsVisibility.showProductsServices && services.length > 0 && <li><a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="hover:text-blue-500 transition-colors">Services</a></li>}
                  {sectionsVisibility.showContact && <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="hover:text-blue-500 transition-colors">Contact</a></li>}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:rounded-lg after:bg-blue-500"> {/* Adjusted width for mobile */}
                  Contact
                </h3>
                <div className="space-y-3 text-gray-300 text-sm"> {/* Adjusted space-y and text size for mobile */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"> {/* Adjusted size for mobile */}
                      <MapPin className="h-4 w-4" /> {/* Adjusted size for mobile */}
                    </div>
                    <p>{siteData.businessLocation || "Dakar, Sénégal"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"> {/* Adjusted size for mobile */}
                      <Phone className="h-4 w-4" /> {/* Adjusted size for mobile */}
                    </div>
                    <p>{siteData.secondaryPhoneNumber || siteData.whatsappNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"> {/* Adjusted size for mobile */}
                      <MessageSquare className="h-4 w-4" /> {/* Adjusted size for mobile */}
                    </div>
                    <p>{siteData.whatsappNumber}</p>
                  </div>
                  {siteData.email && (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"> {/* Adjusted size for mobile */}
                        <Mail className="h-4 w-4" /> {/* Adjusted size for mobile */}
                      </div>
                      <p>{siteData.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:rounded-lg after:bg-blue-500"> {/* Adjusted width for mobile */}
                  Modes de Paiement
                </h3>
                <p className="text-gray-300 text-sm">Nous acceptons les paiements suivants :</p> {/* Adjusted text size for mobile */}
                <div className="flex flex-wrap gap-2 mt-4"> {/* Adjusted gap for mobile */}
                  {paymentMethods.map((method: string, index: number) => (
                    <span key={index} className="bg-white text-gray-800 px-2.5 py-1 rounded-md text-xs font-semibold"> {/* Adjusted padding and text size for mobile */}
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-white/10 opacity-70"> {/* Adjusted padding for mobile */}
              <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.</p> {/* Adjusted text size for mobile */}
            </div>
          </div>
        </footer>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn("fixed bottom-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300", secondaryColorClass, secondaryColorHoverBgClass, showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4')}
      >
        <ChevronUp className="h-5 w-5" /> {/* Adjusted size for mobile */}
      </button>
    </div>
  );
}