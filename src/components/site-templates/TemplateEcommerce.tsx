"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageSquare, 
  ShoppingCart, 
  Store, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  ChevronUp, 
  Menu, 
  X, 
  Star, 
  Wrench, 
  User, 
  Check, 
  Briefcase, 
  StarHalf, 
  CheckCircle, 
  Trash2, // Added for cart removal
  Minus, // Added for quantity
  Plus // Added for quantity
} from 'lucide-react'; 
import { cn } from '@/lib/utils'; // Assuming this utility function exists
import { toast } from 'sonner'; // Assuming sonner is available for notifications
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Assuming schema exists

// --- Types de Données pour le Panier ---
type ProductType = SiteEditorFormData['productsAndServices'][number];
interface CartItem extends ProductType {
  quantity: number;
  index: number;
}

// --- Propriétés du Composant ---
interface EcommerceTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

// --- Composant Principal ---
export function EcommerceTemplate({ siteData, subdomain }: EcommerceTemplateProps) {
  // --- États Locaux ---
  const [quantities, setQuantities] = React.useState<{ [index: number]: number }>({}); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false); // New: State for Cart Modal
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]); // New: State for Cart Items

  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service: '', // Holds the serialized cart content for order
    message: '',
    product_name: '',
    product_price: undefined as number | undefined,
    product_currency: '',
    quantity: undefined as number | undefined,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- Classes de Couleurs Dynamiques (Entièrement Modifiables) ---
  // Note: Votre configuration Tailwind (tailwind.config.js) doit inclure une 'safelist' 
  // pour les couleurs dynamiques basées sur siteData.primaryColor et siteData.secondaryColor.
  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-800`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-600`; // Added for customizability

  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-600`;
  const secondaryColorBorderClass = `border-${siteData.secondaryColor}-500`; // Added for customizability

  const sectionsVisibility = siteData.sectionsVisibility || {
    showHero: true,
    showAbout: true,
    showProductsServices: true,
    showTestimonials: true,
    showSkills: true,
    showContact: true,
  };

  const products = siteData.productsAndServices ? siteData.productsAndServices.filter(item => item.actionButton === 'buy') : [];
  const services = siteData.productsAndServices ? siteData.productsAndServices.filter(item => item.actionButton !== 'buy') : [];

  // --- Initialisation & Effets ---
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const initialQuantities: { [index: number]: number } = {};
    products.forEach((_, index) => {
      initialQuantities[index] = 1;
    });
    setQuantities(initialQuantities);
  }, [siteData.productsAndServices]);

  // --- Fonctions de Navigation et Formulaire ---

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Logique du Panier (Shopping Cart) ---

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleAddToCart = (product: ProductType, index: number) => {
    const quantityToAdd = quantities[index] || 1;

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.index === index);

      if (existingItemIndex > -1) {
        // Le produit existe déjà, on met à jour la quantité
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantityToAdd;
        return newItems;
      } else {
        // Nouveau produit
        const newItem: CartItem = { ...product, quantity: quantityToAdd, index };
        return [...prevItems, newItem];
      }
    });

    toast.success(`"${product.title}" (${quantityToAdd}) a été ajouté au panier.`);
    setIsCartOpen(true); // Ouvrir le panier après l'ajout
  };

  const handleUpdateCartQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.index === index);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity = newQuantity;
        return newItems;
      }
      return prevItems;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.index !== index));
    toast.info("Produit retiré du panier.");
  };

  const handleValidateCart = () => {
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }
    
    // 1. Serialize cart items for the contact form
    const productList = cartItems.map(item => 
      `- ${item.title} (Quantité: ${item.quantity}) - Prix: ${item.price || 'Non spécifié'} ${item.currency || ''}`
    ).join('\n');

    const totalOrderDetails = `Commande Totale :\n${productList}\n\nMontant Total: ${totalCartPrice} ${siteData.currency || 'XOF'}`;

    if (siteData.contactButtonAction === 'whatsapp' && siteData.whatsappNumber) {
      const whatsappLink = `https://wa.me/${siteData.whatsappNumber}?text=Bonjour,%20je%20souhaite%20valider%20ma%20commande%20:%20${encodeURIComponent(totalOrderDetails)}.`;
      window.open(whatsappLink, "_blank");
    } else if (siteData.contactButtonAction === 'phoneNumber' && siteData.secondaryPhoneNumber) {
      window.location.href = `tel:${siteData.secondaryPhoneNumber}`;
    } else if (siteData.contactButtonAction === 'emailForm' && siteData.showContactForm) {
      // 2. Pre-fill the contact form
      setFormData(prev => ({
        ...prev,
        service: "Commande E-commerce", // General service title
        message: totalOrderDetails, // Detailed list in the message field
        // Reset single product fields
        product_name: '',
        product_price: undefined,
        product_currency: '',
        quantity: undefined,
      }));
      setIsCartOpen(false); // Close cart modal
      
      // 3. Smooth scroll to contact section
      const targetElement = document.querySelector('#contact');
      if (targetElement) {
        const offset = 80;
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth',
        });
      } else {
         toast.info("Veuillez remplir le formulaire ci-dessous pour finaliser votre commande.");
      }
    } else {
        toast.error("Aucune méthode de contact n'est configurée pour valider la commande.");
    }
  };

  // --- Soumission du Formulaire (Order/Contact) ---

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // If the form is submitted via cart validation, formData.message contains the order details.
    // Otherwise, it's a standard contact request.

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
          service_interested: formData.service || "Demande de contact",
          message: formData.message,
          // Sending cart details as separate fields if available (optional for backend)
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
        // Clear form and cart after a successful order submission
        setFormData({ name: '', phone: '', email: '', service: '', message: '', product_name: '', product_price: undefined, product_currency: '', quantity: undefined }); 
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Une erreur inattendue est survenue lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Données pour Témoignages et Compétences ---

  const testimonialsToDisplay = siteData.testimonials && siteData.testimonials.length > 0
    ? siteData.testimonials
    : [
        { quote: "J'ai acheté plusieurs articles et la qualité est toujours au rendez-vous. Livraison rapide et service client impeccable !", author: "Fatou Diallo", location: siteData.businessLocation || "Dakar", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
        { quote: "Ma boutique préférée pour les produits artisanaux. Chaque pièce est unique et faite avec passion. Je recommande vivement !", author: "Moussa Traoré", location: siteData.businessLocation || "Abidjan", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
      ];

  const skillsToDisplay = siteData.skills || [];

  // Helper pour obtenir l'icône Lucide (assure que les icônes sont modifiables)
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Wrench, Star, Check, User, Phone, Mail, MessageSquare, ShoppingCart, Store, Briefcase, 
      StarHalf, CheckCircle, Plus, Minus, Trash2, Facebook, Instagram 
    };
    return icons[iconName] || Wrench; 
  };
  
  // --- Sous-Composant: Cart Modal (Panier) ---
  const CartModal = () => (
    <div 
      id="cart-modal" 
      className={cn(
        "fixed inset-0 z-[100] transition-opacity duration-300", 
        isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
      <div className={cn(
        "fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl transition-transform duration-300 p-6 flex flex-col",
        isCartOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className={cn("text-2xl font-bold", primaryColorTextClass)}>
            <ShoppingCart className="inline h-6 w-6 mr-2" /> Votre Panier ({totalCartCount})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500">
            Votre panier est vide.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto my-4 space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.index} className="flex items-center gap-4 border-b pb-4 last:border-b-0" id={`cart-item-${item.index}`}>
                <div className="w-16 h-16 flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} width={64} height={64} className="rounded-md object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className={secondaryColorTextClass}>
                    {item.price} {item.currency || siteData.currency || 'XOF'} x {item.quantity}
                  </p>
                  <p className="text-sm font-bold text-gray-700">Total: {((item.price || 0) * item.quantity).toFixed(2)} {siteData.currency || 'XOF'}</p>
                </div>
                
                {/* Contrôles de Quantité Modifiables */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => handleUpdateCartQuantity(item.index, item.quantity - 1)} 
                    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors"
                    id={`btn-minus-${item.index}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 text-sm font-medium" id={`quantity-display-${item.index}`}>{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateCartQuantity(item.index, item.quantity + 1)} 
                    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors"
                    id={`btn-plus-${item.index}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button 
                  onClick={() => handleRemoveFromCart(item.index)} 
                  className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-full"
                  id={`btn-remove-${item.index}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-800">Total de la commande :</span>
            <span className={cn("text-2xl font-extrabold", primaryColorTextClass)}>
              {totalCartPrice.toFixed(2)} {siteData.currency || 'XOF'}
            </span>
          </div>
          <button 
            onClick={handleValidateCart} 
            disabled={cartItems.length === 0}
            className={cn("w-full px-5 py-3 rounded-lg font-bold text-white text-lg transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass, cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : '')}
            id="btn-validate-cart"
          >
            Valider la Commande
          </button>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            id="btn-continue-shopping"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
  
  // --- Rendu du Composant ---
  return (
    <div className="font-sans antialiased text-gray-800 bg-white overflow-x-hidden" id="ecommerce-template-root">
      
      {/* Panier Modale */}
      <CartModal />

      {/* Header (Bandeau de Navigation Statique) */}
      <header className="bg-white shadow-lg sticky top-0 z-50" id="main-header">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3" id="logo-area">
              {siteData.logoOrPhoto ? (
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xl", primaryColorClass)} id="default-logo">
                  {siteData.publicName ? siteData.publicName.charAt(0) : 'E'}
                </div>
              )}
              <h1 className={cn("text-xl font-bold", secondaryColorTextClass)} id="site-name-header">{siteData.publicName}</h1>
            </div>
            
            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-6" id="desktop-nav-menu">
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#products" onClick={(e) => handleSmoothScroll(e, '#products')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Produits</a>}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Services</a>}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">À Propos</a>}
              {sectionsVisibility.showTestimonials && <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Avis</a>}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Contact</a>}
            </div>

            {/* Cart Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)} 
                className={cn("relative p-2 rounded-full transition-colors", primaryColorTextClass, `hover:bg-${siteData.primaryColor}-50`)}
                id="btn-open-cart"
                aria-label="Ouvrir le panier"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalCartCount > 0 && (
                  <span className={cn("absolute top-0 right-0 h-5 w-5 rounded-full text-xs font-bold text-white flex items-center justify-center", secondaryColorClass)} id="cart-count-badge">
                    {totalCartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className={cn("md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors", primaryColorTextClass)}
                id="btn-toggle-mobile-menu"
                aria-label="Menu mobile"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </nav>
        </div>
        
        {/* Menu Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl py-4 z-40" id="mobile-menu-overlay">
            <nav className="flex flex-col items-center gap-4">
              {sectionsVisibility.showProductsServices && products.length > 0 && <a href="#products" onClick={(e) => handleSmoothScroll(e, '#products')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Produits</a>}
              {sectionsVisibility.showProductsServices && services.length > 0 && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Services</a>}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">À Propos</a>}
              {sectionsVisibility.showTestimonials && <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Avis Clients</a>}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Contact</a>}
            </nav>
          </div>
        )}
      </header>
      
      {/* 1. Hero Section */}
      {sectionsVisibility.showHero && (
        <section id="hero" className={cn("py-16 md:py-24 text-white", primaryColorDarkBgClass)} style={{ backgroundImage: siteData.heroImage ? `url(${siteData.heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center bg-black/30 md:bg-transparent p-6 rounded-lg">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4" id="hero-title">{siteData.publicName}</h2>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto" id="hero-slogan">{siteData.heroSlogan || "Votre destination en ligne pour des produits de qualité."}</p>
            <button 
                onClick={() => handleSmoothScroll({ preventDefault: () => {} } as React.MouseEvent<HTMLAnchorElement, MouseEvent>, '#products')}
                className={cn("inline-flex items-center gap-3 px-8 py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg", secondaryColorClass, secondaryColorHoverBgClass)}
                id="btn-discover-products"
            >
                <Store className="h-5 w-5" /> Découvrir le Catalogue
            </button>
          </div>
        </section>
      )}

      {/* 2. Products Section (Catalogue) */}
      {sectionsVisibility.showProductsServices && products.length > 0 && (
        <section id="products" className="py-12 bg-gray-100 px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)} id="products-section-title">Notre Catalogue Produits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="products-list">
              {products.map((product, index) => {
                const currentQuantity = quantities[index] || 1; 
                return (
                  <div key={index} id={`product-card-${index}`} className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
                    <div className="h-48 overflow-hidden relative">
                      {product.image ? (
                        <Image src={product.image} alt={product.title} width={400} height={200} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <Store className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-gray-900" id={`product-title-${index}`}>{product.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3" id={`product-description-${index}`}>{product.description}</p>
                      </div>

                      {product.price !== undefined && (
                        <p className={cn("text-2xl font-extrabold my-2", secondaryColorTextClass)} id={`product-price-${index}`}>
                          {product.price.toFixed(2)} {product.currency || siteData.currency || 'XOF'}
                        </p>
                      )}

                      {/* Sélecteur de Quantité Modifiable */}
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <label htmlFor={`quantity-${index}`} className="block text-gray-700 font-medium text-sm">Quantité:</label>
                        <input
                          type="number"
                          id={`quantity-${index}`}
                          name={`quantity-${index}`}
                          min="1"
                          value={currentQuantity}
                          onChange={(e) => {
                            const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                            setQuantities({ ...quantities, [index]: newQuantity });
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
                        />
                      </div>

                      {/* Bouton d'Action - Ajout au Panier */}
                      <button
                        onClick={() => handleAddToCart(product, index)}
                        className={cn("mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass)}
                        id={`btn-add-to-cart-${index}`}
                      >
                        <ShoppingCart className="h-5 w-5" /> Ajouter au panier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Services Section (Si existante) */}
      {sectionsVisibility.showProductsServices && services.length > 0 && (
        <section id="services" className="py-12 bg-white px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12", secondaryColorTextClass)} id="services-section-title">Nos Prestations Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="services-list">
              {services.map((service, index) => {
                const IconComponent = service.icon ? getLucideIcon(service.icon) : Wrench;
                return (
                  <div key={index} id={`service-card-${index}`} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                    <div className="h-40 overflow-hidden">
                      {service.image ? (
                        <Image src={service.image} alt={service.title} width={300} height={160} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <IconComponent className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800" id={`service-title-${index}`}>{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3" id={`service-description-${index}`}>{service.description}</p>
                      {service.price !== undefined && (
                        <p className={cn("text-lg font-bold mb-3", primaryColorTextClass)} id={`service-price-${index}`}>
                          À partir de {service.price} {service.currency || siteData.currency || 'XOF'}
                        </p>
                      )}
                      {/* Bouton d'action pour le service, utilise l'action définie dans siteData */}
                      <Link 
                        href="#contact"
                        onClick={(e) => handleSmoothScroll(e, '#contact')}
                        className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors duration-300", secondaryColorClass, secondaryColorHoverBgClass)}
                        id={`btn-contact-service-${index}`}
                      >
                        <MessageSquare className="h-4 w-4" /> Demander un devis
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. About Section */}
      {sectionsVisibility.showAbout && (
        <section id="about" className="py-12 bg-gray-100 px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)} id="about-section-title">À Propos de {siteData.publicName}</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2" id="about-text-content">
                <p className="text-gray-700 text-base mb-4" id="about-paragraph-1">{siteData.aboutSectionText || "Notre mission est de vous offrir une sélection rigoureuse de produits de qualité. Nous nous engageons à un service client irréprochable et une expérience d'achat en ligne fluide et agréable."}</p>
                <p className="text-gray-700 text-base mb-4" id="about-paragraph-2">{siteData.aboutSectionSlogan || "Chaque achat est une promesse de satisfaction et de durabilité. Découvrez la différence avec notre e-commerce."}</p>
                {/* Liste de points clés basés sur skillsToDisplay si showSkills est false, sinon on affiche un bouton */}
                {skillsToDisplay.length > 0 && (
                    <Link 
                        href="#skills"
                        onClick={(e) => handleSmoothScroll(e, '#skills')}
                        className={cn("inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-base text-white transition-all duration-300", secondaryColorClass, secondaryColorHoverBgClass, 'mt-4')}
                        id="btn-view-skills"
                    >
                        Nos Engagements <CheckCircle className="h-5 w-5" />
                    </Link>
                )}
              </div>
              <div className="md:w-1/2" id="about-image-area">
                {siteData.businessPhoto ? (
                  <Image src={siteData.businessPhoto} alt="Image de l'entreprise" width={500} height={350} className="rounded-xl shadow-2xl object-cover w-full h-auto" />
                ) : (
                  <div className="w-full h-80 bg-gray-300 rounded-xl shadow-2xl flex items-center justify-center text-gray-600 text-xl font-semibold">Image À Propos</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Skills Section (Engagements) - Optional in E-commerce but kept for modifiability */}
      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && (
        <section id="skills" className="py-12 bg-white px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12", secondaryColorTextClass)} id="skills-section-title">Nos Garanties et Engagements</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" id="skills-list">
              {skillsToDisplay.map((skill, index) => {
                const IconComponent = skill.icon ? getLucideIcon(skill.icon) : CheckCircle;
                return (
                  <div key={index} id={`skill-item-${index}`} className="bg-gray-50 rounded-lg shadow-md p-6 text-center space-y-3 border-t-4" style={{ borderColor: `var(--${siteData.primaryColor}-600)` }}>
                    <div className="flex items-center justify-center mb-4"><IconComponent className={cn("h-8 w-8", primaryColorTextClass)} /></div>
                    <h3 className="text-lg font-semibold text-gray-800" id={`skill-title-${index}`}>{skill.title}</h3>
                    <p className="text-gray-600 text-sm" id={`skill-description-${index}`}>{skill.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* 6. Testimonials Section (Témoignages) - Primordial */}
      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section id="testimonials" className="py-12 bg-gray-100 px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12", primaryColorTextClass)} id="testimonials-section-title">Ce que nos clients disent</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="testimonials-list">
              {testimonialsToDisplay.map((testimonial, index) => (
                <div key={index} id={`testimonial-card-${index}`} className="bg-white rounded-xl p-6 shadow-lg relative border-l-4" style={{ borderColor: `var(--${siteData.secondaryColor}-500)` }}>
                  <Star className={cn("h-5 w-5 fill-yellow-400 text-yellow-400 mb-2", secondaryColorTextClass)} />
                  <p className="italic text-gray-700 mb-4 text-base" id={`testimonial-quote-${index}`}>"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                        <Image src={testimonial.avatar} alt={testimonial.author} width={40} height={40} className="rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900" id={`testimonial-author-${index}`}>{testimonial.author}</p>
                      <p className="text-sm text-gray-500" id={`testimonial-location-${index}`}>{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Contact Section (Formulaire de contact primordial) */}
      {sectionsVisibility.showContact && siteData.showContactForm && (
        <section id="contact" className="py-12 bg-white px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className={cn("text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12", secondaryColorTextClass)} id="contact-section-title">Nous Contacter</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Informations de Contact */}
              <div id="contact-info-block">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Nos Coordonnées</h3>
                <div className="space-y-4 text-lg text-gray-700">
                  {siteData.businessLocation && (
                    <div className="flex items-center gap-3" id="contact-location">
                      <MapPin className={cn("h-6 w-6 flex-shrink-0", primaryColorTextClass)} />
                      <span>{siteData.businessLocation}</span>
                    </div>
                  )}
                  {siteData.secondaryPhoneNumber && (
                    <a href={`tel:${siteData.secondaryPhoneNumber}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity" id="contact-phone">
                      <Phone className={cn("h-6 w-6 flex-shrink-0", primaryColorTextClass)} />
                      <span>{siteData.secondaryPhoneNumber}</span>
                    </a>
                  )}
                  {siteData.email && (
                    <a href={`mailto:${siteData.email}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity" id="contact-email">
                      <Mail className={cn("h-6 w-6 flex-shrink-0", primaryColorTextClass)} />
                      <span>{siteData.email}</span>
                    </a>
                  )}
                  {siteData.whatsappNumber && (
                    <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity" id="contact-whatsapp">
                      <MessageSquare className={cn("h-6 w-6 flex-shrink-0", primaryColorTextClass)} />
                      <span>Contactez-nous sur WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Formulaire de Contact Modifiable */}
              <div id="contact-form-block">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Envoyez-nous un message</h3>
                <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
                  <div className="form-group" id="form-group-name">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1 text-sm">Nom complet</label>
                    <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="form-group" id="form-group-phone">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1 text-sm">Téléphone</label>
                    <input type="tel" id="phone" name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group" id="form-group-email">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                    <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.email} onChange={handleChange} />
                  </div>
                  
                  {/* Champ caché pour la commande ou un sélecteur de service */}
                  <div className="form-group" id="form-group-service-display">
                    <label htmlFor="service-display" className="block text-gray-700 font-medium mb-1 text-sm">Objet de la demande</label>
                    <input 
                        type="text" 
                        id="service-display" 
                        name="service-display" 
                        disabled 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm" 
                        value={formData.service || "Demande générale / Commande en cours"} 
                    />
                    {/* Le champ réel 'service' est pré-rempli par la validation du panier, sinon il est vide */}
                    <input type="hidden" name="service" value={formData.service} />
                  </div>

                  <div className="form-group" id="form-group-message">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1 text-sm">Message / Détail de la commande</label>
                    <textarea id="message" name="message" required className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.message} onChange={handleChange}></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={cn("w-full px-5 py-2 rounded-lg font-bold text-white text-base transition-colors duration-300", primaryColorClass, primaryColorHoverBgClass)} 
                    disabled={isSubmitting}
                    id="btn-submit-contact-form"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={cn("py-6 text-white px-4", primaryColorDarkBgClass)} id="main-footer">
        <div className="container mx-auto max-w-7xl text-center">
            <div className="flex justify-center gap-4 mb-4" id="footer-social-links">
                {siteData.facebookLink && (
                  <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300" id="footer-facebook">
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {siteData.instagramLink && (
                    <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300" id="footer-instagram">
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {siteData.whatsappNumber && (
                    <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300" id="footer-whatsapp">
                      <MessageSquare className="h-6 w-6" />
                    </a>
                  )}
            </div>
            <p className="text-xs text-gray-400" id="footer-copyright">
              © {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
            </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn("fixed bottom-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 z-40", secondaryColorClass, secondaryColorHoverBgClass, showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4')}
        id="btn-back-to-top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}

// Remarque pour l'intégration: 
// - Assurez-vous que les dépendances 'lucide-react', 'sonner', et le chemin '@/lib/utils' sont correctement configurés dans votre projet Next.js/TSX.
// - Les classes de couleurs dynamiques (e.g., bg-red-600) doivent être incluses dans le 'safelist' de votre configuration Tailwind CSS pour fonctionner correctement.
