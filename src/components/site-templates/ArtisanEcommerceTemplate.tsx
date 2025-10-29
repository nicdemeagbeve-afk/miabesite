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
  Hammer, // Added import
  PaintRoller, // Added import
  Briefcase, // Added import
  CheckCircle, // Added import
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the comprehensive schema type

interface ArtisanEcommerceTemplateProps {
  siteData: SiteEditorFormData; // Use the comprehensive type
}

export function ArtisanEcommerceTemplate({ siteData }: ArtisanEcommerceTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);

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
    return () => window.removeEventListener('change', handleScroll); // Corrected event listener cleanup
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
            <div className="flex gap-6">
              {siteData.secondaryPhoneNumber && (
                <a href={`tel:${siteData.secondaryPhoneNumber}`} className="text-white hover:text-gray-300 flex items-center gap-1">
                  <Phone className="h-4 w-4" /> {siteData.secondaryPhoneNumber}
                </a>
              )}
              {siteData.email && (
                <a href={`mailto:${siteData.email}`} className="text-white hover:text-gray-300 flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {siteData.email}
                </a>
              )}
            </div>
            <div className="flex gap-4">
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
            <div className="flex items-center gap-3">
              {siteData.logoOrPhoto ? (
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={50} height={50} className="rounded-full object-cover" />
              ) : (
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white text-2xl", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}>
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h1 className={cn("text-xl font-bold", secondaryColorTextClass)}>{siteData.publicName}</h1>
                <p className={cn("text-sm font-medium", primaryColorTextClass)}>Produits & Services Sur Mesure</p>
              </div>
            </div>
            <div className={cn("hidden md:flex items-center gap-8")}>
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300")}>Accueil</a>}
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300")}>Produits</a>}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300")}>Services</a>}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300")}>Compétences</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300")}>Avis Clients</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className={cn("text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-lg", primaryColorClass, "hover:text-red-500 hover:after:w-full transition-all duration-300")}>Contact</a>}
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className={cn("relative text-gray-700 text-xl hover:text-red-500 transition-colors")}>
                <Search className="h-5 w-5" />
              </a>
              <a href="#" className={cn("relative text-gray-700 text-xl hover:text-red-500 transition-colors")}>
                <User className="h-5 w-5" />
              </a>
              <a href="#" className={cn("relative text-gray-700 text-xl hover:text-red-500 transition-colors")}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white", primaryColorClass)}>
                    {cartCount}
                  </span>
                )}
              </a>
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
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Produits</a>}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Services</a>}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#skills" onClick={(e) => handleSmoothScroll(e, '#skills')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Compétences</a>}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Avis Clients</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2">Contact</a>}
              <div className="flex gap-6 mt-4">
                <a href="#" className={cn("relative text-gray-700 text-xl hover:text-red-500 transition-colors")}>
                  <Search className="h-5 w-5" />
                </a>
                <a href="#" className={cn("relative text-gray-700 text-xl hover:text-red-500 transition-colors")}>
                  <User className="h-5 w-5" />
                </a>
                <a href="#" className={cn("relative text-gray-700 text-xl hover:text-red-500 transition-colors")}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className={cn("absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white", primaryColorClass)}>
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
        <section id="accueil" className={cn("relative py-24 text-white text-center bg-cover bg-center", secondaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(231, 76, 60, 0.8) 100%), url('${siteData.heroBackgroundImage}')` : `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(231, 76, 60, 0.8) 100%), var(--${siteData.secondaryColor}-700)` }}>
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{siteData.heroSlogan}</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">{siteData.aboutStory}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className={cn("inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg bg-white text-red-600 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg", primaryColorTextClass)}>
                <ShoppingCart className="h-6 w-6" /> Voir les produits
              </a>
              <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg">
                <Wrench className="h-6 w-6" /> Découvrir les services
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Features Section (Hardcoded for now, could be dynamic) */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
              <div className={cn("h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}>
                <Truck className="h-10 w-10" />
              </div>
              <h3 className={cn("text-xl font-semibold mb-3", secondaryColorTextClass)}>Livraison Rapide</h3>
              <p className="text-gray-600">Expédition sous 48h pour tous les produits en stock</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
              <div className={cn("h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}>
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className={cn("text-xl font-semibold mb-3", secondaryColorTextClass)}>Garantie Qualité</h3>
              <p className="text-gray-600">Tous nos produits et services sont garantis 12 mois</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
              <div className={cn("h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}>
                <Lock className="h-10 w-10" />
              </div>
              <h3 className={cn("text-xl font-semibold mb-3", secondaryColorTextClass)}>Paiement Sécurisé</h3>
              <p className="text-gray-600">Transactions 100% sécurisées avec cryptage SSL</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
              <div className={cn("h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}>
                <Headset className="h-10 w-10" />
              </div>
              <h3 className={cn("text-xl font-semibold mb-3", secondaryColorTextClass)}>Support Client</h3>
              <p className="text-gray-600">Assistance 7j/7 par téléphone, email et WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {sectionsVisibility.showProductsServices && products.length > 0 && (
        <section id="produits" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", secondaryColorTextClass)}>
                Nos Produits Phares
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-lg", primaryColorClass)}></span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">Découvrez une sélection de nos créations artisanales les plus populaires</p>
            </div>
            {/* Product Filters (simplified for now) */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Tous</button>
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Décoration</button>
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Mobilier</button>
              <button className={cn("px-5 py-2 rounded-full font-semibold transition-all duration-300 border", primaryColorBorderClass, secondaryColorTextClass, secondaryColorHoverBgClass, "hover:text-white")}>Accessoires</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: typeof siteData.productsAndServices[number], index: number) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative group">
                  {index === 0 && <span className={cn("absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold text-white z-10", primaryColorClass)}>Nouveau</span>}
                  {index === 1 && <span className={cn("absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold text-white z-10", primaryColorClass)}>Bestseller</span>}
                  <div className="h-56 overflow-hidden relative">
                    {product.image ? (
                      <Image src={product.image} alt={product.title} width={400} height={224} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <Palette className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-md hover:bg-gray-100 transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-md hover:bg-gray-100 transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className={cn("text-sm font-medium mb-1 block", accentColorTextClass)}>Décoration</span> {/* Placeholder category */}
                    <h3 className={cn("text-xl font-semibold mb-2", secondaryColorTextClass)}>{product.title}</h3>
                    <div className="flex items-center gap-1 mb-4 text-yellow-500 text-sm">
                      <Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4 fill-yellow-500" /><Star className="h-4 w-4" />
                      <span className="text-gray-500">(24)</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      {product.price !== undefined && (
                        <span className={cn("text-2xl font-bold", primaryColorTextClass)}>
                          {product.price} {product.currency}
                        </span>
                      )}
                      {index === 0 && <span className="text-gray-500 line-through">55,000 XOF</span>}
                      {index === 0 && <span className={cn("px-2 py-1 rounded-lg text-xs font-bold text-white", successColorClass)}>-18%</span>}
                    </div>
                    <button onClick={() => handleAddToCart(product.title)} className={cn("w-full py-3 rounded-lg font-bold text-white transition-colors duration-300 flex items-center justify-center gap-2", secondaryColorClass, secondaryColorHoverBgClass)}>
                      <ShoppingCart className="h-5 w-5" /> Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {sectionsVisibility.showProductsServices && services.length > 0 && (
        <section id="services" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", secondaryColorTextClass)}>
                Nos Services Sur Mesure
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-lg", primaryColorClass)}></span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">Des prestations adaptées à vos besoins spécifiques</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: typeof siteData.productsAndServices[number], index: number) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-t-4" style={{ borderColor: `var(--${siteData.secondaryColor}-500)` }}>
                  <div className={cn("h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-600), var(--${siteData.secondaryColor}-500))` }}>
                    {index === 0 && <PencilRuler className="h-10 w-10" />}
                    {index === 1 && <Wrench className="h-10 w-10" />}
                    {index === 2 && <Palette className="h-10 w-10" />}
                  </div>
                  <h3 className={cn("text-xl font-semibold mb-3", secondaryColorTextClass)}>{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.price !== undefined && (
                    <div className={cn("text-2xl font-bold mb-6", primaryColorTextClass)}>
                      À partir de {service.price} {service.currency}
                    </div>
                  )}
                  <ul className="list-none space-y-2 mb-8 text-left">
                    <li className="flex items-center gap-2"><Check className={cn("h-5 w-5", successColorTextClass)} /> Consultation personnalisée</li>
                    <li className="flex items-center gap-2"><Check className={cn("h-5 w-5", successColorTextClass)} /> Esquisses et maquettes</li>
                    <li className="flex items-center gap-2"><Check className={cn("h-5 w-5", successColorTextClass)} /> 3 propositions de design</li>
                    <li className="flex items-center gap-2"><Check className={cn("h-5 w-5", successColorTextClass)} /> Ajustements illimités</li>
                  </ul>
                  <a href={`https://wa.me/${siteData.whatsappNumber}?text=Je%20suis%20intéressé%20par%20le%20service%20${service.title}`} target="_blank" rel="noopener noreferrer" className={cn("w-full py-3 rounded-lg font-bold text-white transition-colors duration-300 flex items-center justify-center gap-2", secondaryColorClass, secondaryColorHoverBgClass)}>
                    <ShoppingCart className="h-5 w-5" /> {service.actionButton === 'quote' && 'Demander un devis'}
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
        <section id="skills" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-12", primaryColorTextClass)}>Nos Compétences</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {skillsToDisplay.map((skill: typeof siteData.skills[number], index: number) => {
                const IconComponent = getLucideIcon(skill.icon || "Wrench"); // Default icon
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 space-y-3">
                    <div className="flex items-center justify-center mb-4"><IconComponent className={cn("h-8 w-8", primaryColorTextClass)} /></div>
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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 relative inline-block", secondaryColorTextClass)}>
                Avis Clients
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-24 h-1 rounded-lg", primaryColorClass)}></span>
              </h2>
              <p className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto">Ce que disent nos clients satisfaits</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Placeholder testimonials */}
              {testimonialsToDisplay.map((testimonial: typeof siteData.testimonials[number], index: number) => (
                <div key={index} className="bg-gray-100 rounded-xl p-8 shadow-lg relative">
                  <span className={cn("absolute top-6 left-8 text-7xl font-serif opacity-10", accentColorTextClass)}>&ldquo;</span>
                  <p className="text-lg italic mb-8 relative z-10 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt="Client" width={60} height={60} className={cn("rounded-full object-cover border-3", accentColorBorderClass)} />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h4 className={cn("text-xl font-semibold mb-1", secondaryColorTextClass)}>{testimonial.author}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section (Hardcoded for now) */}
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
      {sectionsVisibility.showContact && (
        <footer id="contact" className={cn("py-16 text-white", primaryColorDarkBgClass)}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-lg after:bg-blue-500">
                  {siteData.publicName}
                </h3>
                <p className="text-gray-300">Créations uniques et services sur mesure pour valoriser votre intérieur. Qualité artisanale et satisfaction client garanties.</p>
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
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-lg after:bg-blue-500">
                  Liens Rapides
                </h3>
                <ul className="space-y-2 text-gray-300">
                  {sectionsVisibility.showHero && <li><a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="hover:text-blue-500 transition-colors">Accueil</a></li>}
                  {sectionsVisibility.showProductsServices && products.length > 0 && <li><a href="#produits" onClick={(e) => handleSmoothScroll(e, '#produits')} className="hover:text-blue-500 transition-colors">Produits</a></li>}
                  {sectionsVisibility.showProductsServices && services.length > 0 && <li><a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="hover:text-blue-500 transition-colors">Services</a></li>}
                  {sectionsVisibility.showContact && <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="hover:text-blue-500 transition-colors">Contact</a></li>}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-lg after:bg-blue-500">
                  Contact
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <p>{siteData.businessLocation || "Dakar, Sénégal"}</p>
                  </div>
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
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:rounded-lg after:bg-blue-500">
                  Modes de Paiement
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
      )}

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