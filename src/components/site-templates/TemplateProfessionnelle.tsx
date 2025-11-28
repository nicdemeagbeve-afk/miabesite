"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronUp, 
  Star, 
  Calendar, 
  Clock,
  ShieldCheck,
  Award,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Wrench // Fallback icon
} from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';

interface ServiceTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

export function ServiceTemplate({ siteData, subdomain }: ServiceTemplateProps) {
  // --- États Locaux ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [activeAccordion, setActiveAccordion] = React.useState<number | null>(null); // Pour FAQ ou détails services si besoin

  // État du formulaire avec pré-sélection du service
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service_subject: '', // Le sujet pré-rempli
    message: '',
    date_preference: '' // Champ optionnel pour prise de RDV
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- Gestion des Couleurs Dynamiques ---
  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-600`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-700`;
  const primaryColorLightBgClass = `bg-${siteData.primaryColor}-50`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-600`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-600`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-700`;

  const sectionsVisibility = siteData.sectionsVisibility || {
    showHero: true,
    showAbout: true,
    showProductsServices: true,
    showTestimonials: true,
    showSkills: true,
    showContact: true,
  };

  const services = siteData.productsAndServices || []; // On traite tout comme des services ici

  // --- Initialisation & Effets ---
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Helpers ---
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offset = 100; // Header height compensation
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Briefcase, Users, Calendar, Clock, ShieldCheck, Award, CheckCircle, Star, Wrench, MessageSquare, Phone, Mail
    };
    return icons[iconName] || Briefcase; 
  };

  // --- Logique "Demander un devis" / "Réserver" ---
  const handleServiceSelect = (serviceTitle: string) => {
    setFormData(prev => ({
      ...prev,
      service_subject: `Intérêt pour : ${serviceTitle}`,
      message: prev.message || `Bonjour, je souhaiterais obtenir plus d'informations concernant le service "${serviceTitle}".`
    }));

    // Scroll vers le formulaire
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const offset = 100;
      window.scrollTo({
        top: contactSection.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
      toast.info(`Le sujet a été pré-sélectionné : ${serviceTitle}`);
    }
  };

  // --- Soumission du Formulaire ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/site/${subdomain}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formData.name,
          sender_email: formData.email,
          sender_phone: formData.phone,
          service_interested: formData.service_subject || "Contact Général",
          message: `${formData.message} ${formData.date_preference ? `\n(Préférence de date: ${formData.date_preference})` : ''}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erreur lors de l'envoi.");
      } else {
        toast.success("Votre demande a bien été reçue. Nous vous répondrons sous 24h.");
        setFormData({ name: '', phone: '', email: '', service_subject: '', message: '', date_preference: '' });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur technique lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen flex flex-col" id="service-template-root">
      
      {/* 1. Navbar Professionnelle */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100" id="main-header">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} id="logo-container">
               {siteData.logoOrPhoto ? (
                <Image src={siteData.logoOrPhoto} alt="Logo" width={48} height={48} className="rounded-md object-cover" />
              ) : (
                <div className={cn("h-10 w-10 rounded-md flex items-center justify-center text-white font-bold text-xl", primaryColorClass)}>
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-slate-900" id="site-name">{siteData.publicName}</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
              {sectionsVisibility.showHero && <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="text-sm font-medium hover:text-blue-600 transition-colors">Accueil</a>}
              {sectionsVisibility.showAbout && <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-sm font-medium hover:text-blue-600 transition-colors">À Propos</a>}
              {sectionsVisibility.showProductsServices && <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="text-sm font-medium hover:text-blue-600 transition-colors">Services</a>}
              {sectionsVisibility.showTestimonials && <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className="text-sm font-medium hover:text-blue-600 transition-colors">Témoignages</a>}
            </nav>

            {/* CTA Button Header */}
            <div className="hidden md:flex items-center">
                {sectionsVisibility.showContact && (
                  <a 
                    href="#contact" 
                    onClick={(e) => handleSmoothScroll(e, '#contact')}
                    className={cn("px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5", primaryColorClass, primaryColorHoverBgClass)}
                    id="header-cta-btn"
                  >
                    Nous Contacter
                  </a>
                )}
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-4 z-40" id="mobile-menu">
            <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="block py-2 text-base font-medium border-b border-gray-50">Accueil</a>
            <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="block py-2 text-base font-medium border-b border-gray-50">À Propos</a>
            <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="block py-2 text-base font-medium border-b border-gray-50">Nos Services</a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className={cn("block w-full text-center py-3 rounded-md text-white font-bold mt-2", primaryColorClass)}>Prendre Rendez-vous</a>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Corporate/Clean Style) */}
      {sectionsVisibility.showHero && (
        <section id="home" className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
          {/* Background Shape/Pattern */}
          <div className={cn("absolute top-0 right-0 w-1/2 h-full opacity-10 skew-x-12 transform translate-x-20", primaryColorClass)}></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white shadow-sm border", primaryColorBorderClass, primaryColorTextClass)} id="hero-badge">
                  Expertise Professionnelle
                </span>
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight" id="hero-title">
                  {siteData.heroSlogan || "Des solutions sur mesure pour votre réussite."}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0" id="hero-desc">
                  {siteData.aboutStory ? siteData.aboutStory.substring(0, 150) + "..." : "Nous accompagnons nos clients avec passion et rigueur. Découvrez comment nous pouvons transformer vos projets en réalité."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <a 
                    href="#contact" 
                    onClick={(e) => handleSmoothScroll(e, '#contact')}
                    className={cn("px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1", primaryColorClass, primaryColorHoverBgClass)}
                    id="hero-main-cta"
                  >
                    Demander un devis gratuit
                  </a>
                  <a 
                    href="#services" 
                    onClick={(e) => handleSmoothScroll(e, '#services')}
                    className="px-8 py-4 rounded-lg bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    id="hero-secondary-cta"
                  >
                    Voir nos services
                  </a>
                </div>
              </div>
              <div className="lg:w-1/2 relative" id="hero-image-wrapper">
                 {siteData.heroBackgroundImage ? (
                     <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                         <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500", primaryColorClass)}></div>
                         <Image 
                            src={siteData.heroBackgroundImage} 
                            alt="Hero Image" 
                            width={800} 
                            height={600} 
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" 
                         />
                     </div>
                 ) : (
                     <div className={cn("w-full aspect-[4/3] rounded-2xl flex items-center justify-center text-white text-9xl shadow-2xl opacity-90", primaryColorClass)}>
                        <Briefcase className="h-32 w-32" />
                     </div>
                 )}
                 {/* Floating Card for Trust */}
                 <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl hidden md:flex items-center gap-4 border-l-4" style={{borderColor: `var(--${siteData.secondaryColor}-600)`}}>
                    <div className={cn("p-3 rounded-full bg-green-100 text-green-600")}>
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">100% Satisfaction</p>
                        <p className="text-xs text-slate-500">Service client dédié</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. About / Value Proposition */}
      {sectionsVisibility.showAbout && (
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className={cn("text-base font-bold uppercase tracking-widest mb-2", secondaryColorTextClass)} id="about-subtitle">Pourquoi nous choisir</h2>
              <h3 className="text-3xl font-bold text-slate-900 mb-6" id="about-title">Une approche centrée sur vos besoins</h3>
              <p className="text-slate-600" id="about-full-text">{siteData.aboutStory}</p>
            </div>
            
            {/* Skills Grid */}
            {siteData.skills && siteData.skills.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="skills-grid">
                {siteData.skills.map((skill, index) => {
                    const Icon = skill.icon ? getLucideIcon(skill.icon) : Star;
                    return (
                    <div key={index} id={`skill-card-${index}`} className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", primaryColorLightBgClass, primaryColorTextClass)}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">{skill.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{skill.description}</p>
                    </div>
                    );
                })}
                </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Services Section (Core Content) */}
      {sectionsVisibility.showProductsServices && services.length > 0 && (
        <section id="services" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className={cn("text-base font-bold uppercase tracking-widest mb-2", secondaryColorTextClass)}>Nos Expertises</h2>
                    <h3 className="text-3xl lg:text-4xl font-bold text-slate-900">Nos Solutions pour vous</h3>
                </div>
                <a href="#contact" className={cn("hidden md:inline-flex items-center gap-2 font-bold hover:underline", primaryColorTextClass)}>
                    Parler à un expert <ArrowRight className="h-4 w-4" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="services-grid">
              {services.map((service, index) => (
                <div key={index} id={`service-card-${index}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                  <div className="h-56 relative overflow-hidden">
                    {service.image ? (
                        <Image src={service.image} alt={service.title} width={400} height={250} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className={cn("w-full h-full flex items-center justify-center text-white", primaryColorClass)}>
                            <Briefcase className="h-16 w-16 opacity-50" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                        Service
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors" id={`service-title-${index}`}>{service.title}</h4>
                    <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3" id={`service-desc-${index}`}>{service.description}</p>
                    
                    {service.price !== undefined && (
                        <div className="mb-4 pb-4 border-b border-gray-100">
                             <span className="text-xs text-gray-400 uppercase font-semibold">Tarif indicatif</span>
                             <p className={cn("text-xl font-bold", secondaryColorTextClass)}>{service.price} {service.currency || siteData.currency}</p>
                        </div>
                    )}

                    <button 
                        onClick={() => handleServiceSelect(service.title)}
                        className={cn("w-full py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 border-2", 
                            "bg-transparent hover:text-white", 
                            primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass
                        )}
                        id={`btn-select-service-${index}`}
                    >
                        {service.actionButton === 'book' ? 'Réserver maintenant' : 'Demander un devis'} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
                <a href="#contact" className={cn("inline-flex items-center gap-2 font-bold", primaryColorTextClass)}>
                    Parler à un expert <ArrowRight className="h-4 w-4" />
                </a>
            </div>
          </div>
        </section>
      )}

      {/* 5. Testimonials (Social Proof) */}
      {sectionsVisibility.showTestimonials && siteData.testimonials && siteData.testimonials.length > 0 && (
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-16" id="testimonial-title">La satisfaction de nos clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteData.testimonials.map((t, index) => (
                <div key={index} id={`testimonial-card-${index}`} className="bg-slate-50 p-8 rounded-2xl relative">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-slate-700 italic mb-6 relative z-10 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    {t.avatar ? (
                        <Image src={t.avatar} alt={t.author} width={48} height={48} className="rounded-full object-cover ring-2 ring-white" />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold">{t.author.charAt(0)}</div>
                    )}
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{t.author}</h5>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">{t.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Contact Section (Split Layout - Primordial) */}
      {sectionsVisibility.showContact && (
        <section id="contact" className={cn("py-20 text-white", primaryColorClass)}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
              
              {/* Left: Info & Context */}
              <div className={cn("lg:w-5/12 p-10 lg:p-12 relative flex flex-col justify-between", primaryColorDarkBgClass || "bg-slate-900")}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 rounded-full bg-white opacity-5"></div>
                
                <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-6 text-white">Discutons de votre projet</h3>
                    <p className="text-blue-100 mb-10 text-lg">
                        Remplissez le formulaire et notre équipe vous recontactera sous 24h ouvrées.
                    </p>

                    <div className="space-y-6">
                        {siteData.businessLocation && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg"><MapPin className="h-6 w-6 text-white" /></div>
                                <div>
                                    <p className="text-xs text-blue-200 uppercase font-bold mb-1">Notre Adresse</p>
                                    <p className="text-white font-medium">{siteData.businessLocation}</p>
                                </div>
                            </div>
                        )}
                         {siteData.email && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg"><Mail className="h-6 w-6 text-white" /></div>
                                <div>
                                    <p className="text-xs text-blue-200 uppercase font-bold mb-1">Email</p>
                                    <p className="text-white font-medium">{siteData.email}</p>
                                </div>
                            </div>
                        )}
                        {(siteData.secondaryPhoneNumber || siteData.whatsappNumber) && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-lg"><Phone className="h-6 w-6 text-white" /></div>
                                <div>
                                    <p className="text-xs text-blue-200 uppercase font-bold mb-1">Téléphone</p>
                                    <p className="text-white font-medium">{siteData.secondaryPhoneNumber || siteData.whatsappNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 relative z-10">
                    <p className="text-sm text-blue-200 mb-4">Suivez-nous :</p>
                    <div className="flex gap-4">
                        {siteData.facebookLink && <a href={siteData.facebookLink} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Facebook className="h-5 w-5 text-white" /></a>}
                        {siteData.instagramLink && <a href={siteData.instagramLink} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Instagram className="h-5 w-5 text-white" /></a>}
                        {siteData.linkedinLink && <a href={siteData.linkedinLink} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Linkedin className="h-5 w-5 text-white" /></a>}
                    </div>
                </div>
              </div>

              {/* Right: The Form */}
              <div className="lg:w-7/12 p-10 lg:p-16 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6" id="professional-contact-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-bold text-slate-700">Nom complet <span className="text-red-500">*</span></label>
                            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white text-slate-800" placeholder="Jean Dupont" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-bold text-slate-700">Téléphone <span className="text-red-500">*</span></label>
                            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white text-slate-800" placeholder="+221 ..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-slate-700">Email professionnel</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white text-slate-800" placeholder="jean@entreprise.com" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="service_subject" className="text-sm font-bold text-slate-700">Sujet de la demande</label>
                        <select 
                            id="service_subject" 
                            name="service_subject" 
                            value={formData.service_subject} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white text-slate-800 appearance-none"
                        >
                            <option value="">Sélectionnez un sujet...</option>
                            <option value="Demande générale">Renseignement Général</option>
                            <option value="Partenariat">Partenariat</option>
                            {services.map((s, i) => (
                                <option key={i} value={`Intérêt pour : ${s.title}`}>Service : {s.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-bold text-slate-700">Message <span className="text-red-500">*</span></label>
                        <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white text-slate-800" placeholder="Décrivez votre besoin..."></textarea>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={cn("w-full py-4 rounded-lg font-bold text-white text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1", primaryColorClass, primaryColorHoverBgClass, isSubmitting && "opacity-70 cursor-wait")}
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">Vos données restent confidentielles.</p>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h5 className="text-white font-bold text-xl mb-2">{siteData.publicName}</h5>
                    <p className="text-sm max-w-sm">{siteData.aboutStory ? siteData.aboutStory.substring(0, 80) + '...' : 'Votre partenaire de confiance.'}</p>
                </div>
                <div className="flex gap-6 text-sm font-medium">
                    {sectionsVisibility.showHero && <a href="#home" className="hover:text-white transition-colors">Accueil</a>}
                    {sectionsVisibility.showServices && <a href="#services" className="hover:text-white transition-colors">Services</a>}
                    {sectionsVisibility.showContact && <a href="#contact" className="hover:text-white transition-colors">Contact</a>}
                </div>
            </div>
            <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
                &copy; {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
            </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn("fixed bottom-6 right-6 p-3 rounded-full text-white shadow-xl transition-all duration-300 z-50", secondaryColorClass, secondaryColorHoverBgClass, showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none')}
      >
        <ChevronUp className="h-6 w-6" />
      </button>

    </div>
  );
}
