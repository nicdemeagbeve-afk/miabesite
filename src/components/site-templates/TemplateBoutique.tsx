"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Heart, 
  User, 
  Trash2, 
  Plus, 
  Minus,
  ArrowRight,
  Store
} from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';

// --- Types ---
type ProductType = SiteEditorFormData['productsAndServices'][number];
interface CartItem extends ProductType {
  quantity: number;
  cartId: string; // Unique ID for cart management
}

interface BoutiqueTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

export function BoutiqueTemplate({ siteData, subdomain }: BoutiqueTemplateProps) {
  // --- États ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [activeImageIndex, setActiveImageIndex] = React.useState<number | null>(null); // Pour effet hover sur produits

  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    delivery_method: 'retrait' // 'retrait' ou 'livraison'
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- Styles Dynamiques ---
  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryLightBgClass = `bg-${siteData.primaryColor}-50`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;
  
  // Filtrage des produits uniquement (Boutique = Vente physique/produits)
  const products = siteData.productsAndServices ? siteData.productsAndServices.filter(item => item.actionButton === 'buy') : [];
  
  const sectionsVisibility = siteData.sectionsVisibility || {
    showHero: true,
    showAbout: true,
    showProductsServices: true,
    showTestimonials: true,
    showContact: true,
  };

  // --- Gestion du Panier ---
  const cartTotal = cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: ProductType) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.title === product.title);
      if (existing) {
        return prev.map(item => item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, cartId: `${product.title}-${Date.now()}` }];
    });
    toast.success("Ajouté au panier", { position: 'bottom-right' });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    // Préparer le formulaire
    const orderSummary = cartItems.map(i => `- ${i.title} x${i.quantity} (${(i.price || 0) * i.quantity} ${siteData.currency})`).join('\n');
    const totalLine = `\nTOTAL ESTIMÉ: ${cartTotal} ${siteData.currency}`;
    
    setFormData(prev => ({
      ...prev,
      subject: "Nouvelle Commande Boutique",
      message: `Bonjour, je souhaite commander les articles suivants :\n${orderSummary}\n${totalLine}\n\nMerci de me confirmer la disponibilité.`
    }));

    // Scroll vers contact
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      toast.info("Veuillez finaliser vos coordonnées pour valider la commande.");
    }
  };

  // --- Formulaire ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        await fetch(`/api/site/${subdomain}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender_name: formData.name,
                sender_email: formData.email,
                sender_phone: formData.phone,
                service_interested: formData.subject,
                message: `${formData.message}\n\nMode préféré: ${formData.delivery_method}`
            })
        });
        toast.success("Commande envoyée à la boutique !");
        setCartItems([]); // Vider le panier
        setFormData({ name: '', phone: '', email: '', subject: '', message: '', delivery_method: 'retrait' });
    } catch (err) {
        toast.error("Erreur lors de l'envoi.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="font-serif text-gray-800 bg-[#fcfbf9] min-h-screen selection:bg-gray-200" id="boutique-root">
      
      {/* --- Header "Chic" --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 transition-all" id="boutique-header">
        {/* Top Bar (Info flash) */}
        <div className={cn("text-white text-xs py-1.5 text-center tracking-widest uppercase hidden md:block", primaryColorClass)}>
            Bienvenue chez {siteData.publicName} • {siteData.businessLocation ? `Situé à ${siteData.businessLocation}` : "Boutique en ligne"}
        </div>

        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo Textuel Élégant */}
            <div className="flex items-center gap-2 z-50">
                <Link href="#" className={cn("text-2xl md:text-3xl font-serif tracking-tighter hover:opacity-80 transition-opacity", primaryColorTextClass)} id="boutique-logo">
                    {siteData.publicName}
                </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide text-gray-600">
                <a href="#home" className="hover:text-black transition-colors uppercase text-xs font-bold">Accueil</a>
                <a href="#manager" className="hover:text-black transition-colors uppercase text-xs font-bold">L'Atelier</a>
                <a href="#catalogue" className="hover:text-black transition-colors uppercase text-xs font-bold">Collection</a>
                <a href="#location" className="hover:text-black transition-colors uppercase text-xs font-bold">Visitez-nous</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button onClick={() => setIsCartOpen(true)} className="relative group p-2" aria-label="Panier">
                    <ShoppingBag className="h-6 w-6 text-gray-700 group-hover:text-black transition-colors" strokeWidth={1.5} />
                    {cartCount > 0 && (
                        <span className={cn("absolute top-0 right-0 h-4 w-4 text-[10px] text-white flex items-center justify-center rounded-full", secondaryColorClass)}>
                            {cartCount}
                        </span>
                    )}
                </button>
                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-lg md:hidden animate-in slide-in-from-top-5">
                <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif italic text-gray-800">Accueil</a>
                <a href="#catalogue" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif italic text-gray-800">Nos Produits</a>
                <a href="#manager" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif italic text-gray-800">Notre Histoire</a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={cn("text-lg font-bold", primaryColorTextClass)}>Commander</a>
            </div>
        )}
      </header>

      {/* --- Cart Drawer (Tiroir Panier) --- */}
      <div className={cn("fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity", isCartOpen ? "opacity-100 visible" : "opacity-0 invisible")} onClick={() => setIsCartOpen(false)}></div>
      <div className={cn("fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-out flex flex-col", isCartOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfbf9]">
            <h2 className="font-serif text-2xl italic text-gray-800">Votre Sélection</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Votre panier est vide.</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-sm underline hover:text-black">Retourner à la boutique</button>
                </div>
            ) : (
                cartItems.map((item) => (
                    <div key={item.cartId} className="flex gap-4 group">
                        <div className="h-24 w-20 relative bg-gray-100 overflow-hidden rounded-sm flex-shrink-0">
                             {item.image ? (
                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                             ) : <Store className="h-8 w-8 m-auto text-gray-300" />}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="font-mono text-sm">{item.price} {siteData.currency}</p>
                                <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 gap-2">
                                    <button onClick={() => updateQuantity(item.cartId, -1)} className="hover:text-red-500"><Minus className="h-3 w-3" /></button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.cartId, 1)} className="hover:text-green-500"><Plus className="h-3 w-3" /></button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="self-start text-gray-300 hover:text-red-500 p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>
                ))
            )}
        </div>

        {cartItems.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6 font-bold text-lg">
                    <span>Total</span>
                    <span>{cartTotal.toFixed(2)} {siteData.currency}</span>
                </div>
                <button 
                    onClick={handleCheckout}
                    className={cn("w-full py-4 text-white font-bold tracking-widest uppercase text-xs transition-all hover:opacity-90", primaryColorClass)}
                >
                    Valider la commande
                </button>
            </div>
        )}
      </div>

      {/* --- 1. Hero "Ambiance" --- */}
      {sectionsVisibility.showHero && (
        <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {siteData.heroBackgroundImage ? (
                <>
                    <Image 
                        src={siteData.heroBackgroundImage} 
                        alt="Hero Boutique" 
                        fill 
                        className="object-cover object-center"
                        priority 
                    />
                    <div className="absolute inset-0 bg-black/20" /> 
                </>
            ) : (
                <div className={cn("absolute inset-0", primaryLightBgClass)} />
            )}
            
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <span className="inline-block py-1 px-3 border border-white/50 text-white text-[10px] uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                    Nouvelle Collection
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-lg leading-tight">
                    {siteData.heroSlogan || "L'Élégance Naturelle"}
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <a href="#catalogue" className="px-8 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors shadow-xl">
                        Voir la boutique
                    </a>
                </div>
            </div>
        </section>
      )}

      {/* --- 2. Section Gérant & Histoire (Storytelling) --- */}
      {sectionsVisibility.showAbout && (
        <section id="manager" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Image Artistique */}
                    <div className="lg:w-1/2 relative group">
                        <div className={cn("absolute top-[-20px] left-[-20px] w-full h-full border-2 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4", primaryColorBorderClass)}></div>
                        <div className="relative z-10 h-[500px] w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                            {siteData.businessPhoto || siteData.logoOrPhoto ? (
                                <Image src={(siteData.businessPhoto || siteData.logoOrPhoto)!} alt="Le Gérant" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-serif italic text-2xl">Portrait Gérant</div>
                            )}
                        </div>
                        {/* Signature Effect */}
                        <div className="absolute bottom-10 right-[-30px] bg-white p-4 shadow-xl text-center min-w-[150px]">
                            <p className="font-serif italic text-xl text-gray-800">"Fait avec amour"</p>
                        </div>
                    </div>

                    {/* Texte Narratif */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <h2 className={cn("text-sm font-bold uppercase tracking-widest mb-3", primaryColorTextClass)}>L'Âme de la Maison</h2>
                            <h3 className="text-4xl font-serif text-gray-900 mb-6">Rencontrez votre artisan</h3>
                        </div>
                        <p className="text-gray-600 leading-loose text-lg font-light">
                            {siteData.aboutStory || "Bienvenue dans notre univers. Ici, chaque produit raconte une histoire, celle d'une passion pour le travail bien fait et les matières nobles. Nous sélectionnons avec soin chaque pièce pour vous offrir une expérience unique."}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                             <div>
                                <h4 className="font-bold text-2xl font-serif">100%</h4>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Authentique</p>
                             </div>
                             <div>
                                <h4 className="font-bold text-2xl font-serif">24h</h4>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Réponse garantie</p>
                             </div>
                        </div>

                        <div className="pt-6">
                            <a href="#location" className="text-sm font-bold border-b border-black pb-1 hover:text-gray-600 transition-colors inline-flex items-center gap-2">
                                Venir nous rencontrer <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* --- 3. Catalogue Boutique (Varied Layout) --- */}
      {sectionsVisibility.showProductsServices && products.length > 0 && (
        <section id="catalogue" className="py-24 bg-[#fcfbf9]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-2xl font-serif italic text-gray-400 mb-2 block">Collection</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6">Nos Pièces Uniques</h2>
                    <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8">
                    {products.map((product, index) => (
                        <div key={index} className="group relative" id={`product-card-${index}`}>
                            {/* Image Container */}
                            <div className="aspect-[3/4] overflow-hidden bg-gray-200 relative mb-4">
                                {product.image ? (
                                    <Image 
                                        src={product.image} 
                                        alt={product.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingBag /></div>
                                )}
                                
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                <button 
                                    onClick={() => addToCart(product)}
                                    className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 text-xs uppercase font-bold tracking-widest translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:bg-black hover:text-white"
                                >
                                    Ajouter au panier
                                </button>
                                {product.price && (
                                    <span className="absolute top-4 right-4 bg-white/90 px-2 py-1 text-xs font-mono font-bold">
                                        {product.price} {siteData.currency}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="text-center">
                                <h3 className="font-serif text-lg text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{product.title}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wide line-clamp-1">{product.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* --- 4. Section Localisation & Visite (Spécifique Boutique) --- */}
      <section id="location" className="py-24 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl">
                  
                  {/* Fake Map / Visual Representation */}
                  <div className="bg-gray-200 h-[400px] lg:h-auto relative min-h-[400px]">
                      {/* En production, ici on mettrait une Google Map ou Mapbox. Ici, on simule une carte stylisée */}
                      <div className="absolute inset-0 bg-stone-300 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-full"></span>
                              <MapPin className={cn("h-12 w-12 drop-shadow-lg animate-bounce", primaryColorTextClass)} fill="currentColor" />
                          </div>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-white p-4 shadow-lg max-w-xs">
                          <p className="font-bold text-sm">Nous trouver</p>
                          <p className="text-xs text-gray-600 mt-1">{siteData.businessLocation || "Adresse non renseignée"}</p>
                      </div>
                  </div>

                  {/* Infos Pratiques */}
                  <div className={cn("p-12 lg:p-16 text-white flex flex-col justify-center", primaryColorClass)}>
                      <h2 className="font-serif text-3xl mb-8">Passer à la boutique</h2>
                      
                      <div className="space-y-8">
                          <div className="flex gap-4">
                              <Clock className="h-6 w-6 opacity-70 flex-shrink-0" />
                              <div>
                                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1 opacity-90">Horaires d'ouverture</h4>
                                  <p className="text-lg font-serif">Lun - Sam : 10h00 - 19h00</p>
                                  <p className="text-sm opacity-70">Fermé le Dimanche</p>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <MapPin className="h-6 w-6 opacity-70 flex-shrink-0" />
                              <div>
                                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1 opacity-90">Adresse</h4>
                                  <p className="text-lg font-serif leading-snug">{siteData.businessLocation || "Centre Ville"}</p>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <Phone className="h-6 w-6 opacity-70 flex-shrink-0" />
                              <div>
                                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1 opacity-90">Contact Direct</h4>
                                  <a href={`tel:${siteData.secondaryPhoneNumber}`} className="text-lg font-serif hover:underline">{siteData.secondaryPhoneNumber}</a>
                              </div>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* --- 5. Contact & Checkout --- */}
      {sectionsVisibility.showContact && (
        <section id="contact" className="py-24 bg-[#fcfbf9]">
            <div className="container mx-auto px-6 max-w-3xl text-center">
                <Star className={cn("h-8 w-8 mx-auto mb-6", primaryColorTextClass)} />
                <h2 className="text-4xl font-serif text-gray-900 mb-4">Finaliser votre demande</h2>
                <p className="text-gray-500 mb-12">Remplissez ce formulaire pour valider votre panier ou poser une question. Le paiement se fera à la livraison ou en boutique.</p>

                <form onSubmit={handleSubmit} className="text-left bg-white p-8 md:p-12 shadow-xl border border-gray-100 rounded-sm">
                    {/* Rappel du Panier si non vide */}
                    {cartItems.length > 0 && (
                        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
                            <strong>Panier en cours :</strong> {cartCount} articles — Total: {cartTotal} {siteData.currency}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nom</label>
                            <input type="text" required className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent" 
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                            <input type="tel" required className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent" 
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                        <input type="email" required className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors bg-transparent" 
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    {cartItems.length > 0 && (
                        <div className="mb-6">
                             <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mode de réception</label>
                             <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="delivery" value="retrait" checked={formData.delivery_method === 'retrait'} onChange={(e) => setFormData({...formData, delivery_method: e.target.value})} />
                                    <span className="text-sm">Retrait Boutique</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="delivery" value="livraison" checked={formData.delivery_method === 'livraison'} onChange={(e) => setFormData({...formData, delivery_method: e.target.value})} />
                                    <span className="text-sm">Livraison</span>
                                </label>
                             </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message / Précisions</label>
                        <textarea rows={4} className="w-full border border-gray-200 p-3 focus:border-black outline-none transition-colors bg-gray-50 text-sm" 
                            value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
                            placeholder={cartItems.length > 0 ? "Précisez ici vos disponibilités pour le retrait..." : "Votre question..."}
                        ></textarea>
                    </div>

                    <button disabled={isSubmitting} className={cn("w-full py-4 text-white font-bold uppercase tracking-widest hover:opacity-90 transition-opacity", primaryColorClass)}>
                        {isSubmitting ? 'Envoi...' : (cartItems.length > 0 ? 'Confirmer la commande' : 'Envoyer')}
                    </button>
                </form>
            </div>
        </section>
      )}

      {/* Footer Minimaliste */}
      <footer className="bg-white py-12 border-t border-gray-200 text-center">
          <div className="container mx-auto px-6">
              <h2 className={cn("text-2xl font-serif italic mb-6", primaryColorTextClass)}>{siteData.publicName}</h2>
              <div className="flex justify-center gap-6 mb-8 text-gray-400">
                  {siteData.instagramLink && <a href={siteData.instagramLink} className="hover:text-black transition-colors"><Instagram className="h-5 w-5" /></a>}
                  {siteData.facebookLink && <a href={siteData.facebookLink} className="hover:text-black transition-colors"><Facebook className="h-5 w-5" /></a>}
                  <a href={`mailto:${siteData.email}`} className="hover:text-black transition-colors"><Mail className="h-5 w-5" /></a>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} {siteData.publicName}. Fait avec passion.</p>
          </div>
      </footer>

    </div>
  );
}
