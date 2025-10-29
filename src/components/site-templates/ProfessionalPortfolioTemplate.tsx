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
  Hammer,
  Wrench,
  PaintRoller,
  Star,
  User,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';
import { toast } from 'sonner'; // Import toast for notifications

interface ProfessionalPortfolioTemplateProps {
  siteData: SiteEditorFormData;
  subdomain: string;
}

export function ProfessionalPortfolioTemplate({ siteData, subdomain }: ProfessionalPortfolioTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const primaryColorClass = `bg-${siteData.primaryColor}-700`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-700`;
  const primaryColorBorderClass = `border-${siteData.primaryColor}-700`;
  const primaryColorHoverBgClass = `hover:bg-${siteData.primaryColor}-800`;
  const primaryColorDarkBgClass = `bg-${siteData.primaryColor}-900`;

  const secondaryColorClass = `bg-${siteData.secondaryColor}-600`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-600`;
  const secondaryColorHoverBgClass = `hover:bg-${siteData.secondaryColor}-700`;

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, setSelectedIndex]);

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

  // Use siteData.skills if available, otherwise fallback to hardcoded
  const skillsToDisplay = siteData.skills && siteData.skills.length > 0
    ? siteData.skills
    : [
        {
          icon: "Wrench",
          title: "Rénovation",
          description: "Expertise en rénovation complète et aménagement intérieur.",
        },
        {
          icon: "Hammer",
          title: "Réparation",
          description: "Interventions rapides et durables en plomberie, électricité, etc.",
        },
        {
          icon: "PaintRoller",
          title: "Finitions",
          description: "Maîtrise des finitions : peinture, carrelage, parquet.",
        },
      ];

  // Use siteData.productsAndServices as portfolio items if available, otherwise fallback to hardcoded
  const portfolioItemsToDisplay = siteData.productsAndServices.length > 0
    ? siteData.productsAndServices.map(p => ({
        image: p.image || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', // Fallback placeholder
        title: p.title,
        description: p.description,
        category: "Rénovation", // Placeholder, could be dynamic
        tags: ["Rénovation", "Aménagement"], // Placeholder, could be dynamic
      }))
    : [
        { image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80', title: "Rénovation Complète d'Appartement", description: "Transformation d'un appartement ancien en espace moderne et fonctionnel", category: "renovation", tags: ["Rénovation", "Aménagement", "3 mois"] },
        { image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', title: "Réparation Salle de Bain", description: "Résolution de problèmes d'humidité et remplacement des équipements", category: "reparation", tags: ["Plomberie", "Carrelage", "2 semaines"] },
        { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80', title: "Finitions Cuisine Sur Mesure", description: "Réalisation d'une cuisine entièrement personnalisée avec finitions haut de gamme", category: "finition", tags: ["Cuisine", "Sur mesure", "1 mois"] },
      ];

  const testimonialsToDisplay = siteData.testimonials && siteData.testimonials.length > 0
    ? siteData.testimonials
    : [
        { quote: "J'ai confié la rénovation complète de mon appartement à cet artisan et je suis absolument ravi du résultat. Le travail a été réalisé dans les délais, avec un professionnalisme remarquable. Je recommande vivement !", author: "Thomas Martin", location: siteData.businessLocation || "Dakar", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { quote: "Une intervention rapide et efficace pour réparer une fuite d'eau qui menaçait de causer des dégâts importants. L'artisan a su identifier le problème rapidement et proposer une solution durable. Prix très correct pour la qualité du travail.", author: "Sophie Diallo", location: siteData.businessLocation || "Pikine", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        { quote: "La rénovation de ma cuisine a été un véritable succès grâce au professionnalisme et à l'expertise de cet artisan. Il a su comprendre mes besoins et proposer des solutions à la fois esthétiques et fonctionnelles. Un travail de qualité !", author: "Robert Ndiaye", location: siteData.businessLocation || "Mermoz", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
      ];

  const paymentMethods = siteData.paymentMethods && siteData.paymentMethods.length > 0
    ? siteData.paymentMethods
    : ["Mobile Money", "Cash", "Virement", "Wave"];

  // Helper to get Lucide icon component by name
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Wrench, Hammer, PaintRoller, Briefcase, Star, CheckCircle,
      // Add other Lucide icons as needed
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
                <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={40} height={40} className="rounded-full object-cover" /> {/* Adjusted size for mobile */}
              ) : (
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xl", primaryColorClass)}> {/* Adjusted size for mobile */}
                  {siteData.publicName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h1 className={cn("text-lg font-bold", primaryColorTextClass)}>{siteData.publicName}</h1> {/* Adjusted text size for mobile */}
                <p className={cn("text-xs font-medium", accentColorTextClass)}>Réalisations & Compétences</p> {/* Adjusted text size for mobile */}
              </div>
            </div>
            <div className={cn("hidden md:flex items-center gap-6")}> {/* Adjusted gap for mobile */}
              {sectionsVisibility.showHero && <a href="#accueil" onClick={(e) => handleSmoothScroll(e, '#accueil')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm">Accueil</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#competences" onClick={(e) => handleSmoothScroll(e, '#competences')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm">Compétences</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && portfolioItemsToDisplay.length > 0 && <a href="#realisations" onClick={(e) => handleSmoothScroll(e, '#realisations')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm">Réalisations</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm">Témoignages</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-semibold relative after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:rounded-full after:bg-red-500 hover:text-red-500 hover:after:w-full transition-all duration-300 text-sm">Contact</a>} {/* Adjusted text size for mobile */}
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
              {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && <a href="#competences" onClick={(e) => handleSmoothScroll(e, '#competences')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Compétences</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showProductsServices && portfolioItemsToDisplay.length > 0 && <a href="#realisations" onClick={(e) => handleSmoothScroll(e, '#realisations')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Réalisations</a>} {/* Adjusted text size for mobile */}
              {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
                <a href="#temoignages" onClick={(e) => handleSmoothScroll(e, '#temoignages')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Témoignages</a>
              )}
              {sectionsVisibility.showContact && <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-gray-700 font-medium hover:text-blue-600 transition-colors w-full text-center py-2 text-base">Contact</a>} {/* Adjusted text size for mobile */}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      {sectionsVisibility.showHero && (
        <section id="accueil" className={cn("relative py-24 text-white text-center bg-cover bg-center px-4", primaryColorClass)} style={{ backgroundImage: siteData.heroBackgroundImage ? `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(52, 152, 219, 0.8) 100%), url('${siteData.heroBackgroundImage}')` : `linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(52, 152, 219, 0.8) 100%), var(--${siteData.primaryColor}-700)` }}> {/* Adjusted padding for mobile */}
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
            <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-base transition-all duration-300 ease-in-out transform", whatsappBgClass, whatsappHoverBgClass, "shadow-lg hover:shadow-xl w-full sm:w-auto")}> {/* Adjusted padding, text size, and width for mobile */}
              <MessageSquare className="h-5 w-5" /> Discuter de mon projet
            </a>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {sectionsVisibility.showSkills && skillsToDisplay.length > 0 && (
        <section id="competences" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
              <h2 className={cn("text-2xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}> {/* Adjusted text size for mobile */}
                Mes Domaines d'Expertise
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", secondaryColorClass)}></span> {/* Adjusted width for mobile */}
              </h2>
              <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">Un savoir-faire diversifié pour répondre à tous vos besoins</p> {/* Adjusted mt and text size for mobile */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap and grid for mobile */}
              {skillsToDisplay.map((skill: any, index: number) => {
                const IconComponent = getLucideIcon(skill.icon);
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 border-t-4" style={{ borderColor: `var(--${siteData.secondaryColor}-500)` }}> {/* Adjusted padding for mobile */}
                    <div className="flex items-center gap-4 mb-4"> {/* Adjusted mb for mobile */}
                      <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white text-xl", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-700), var(--${siteData.secondaryColor}-500))` }}> {/* Adjusted size for mobile */}
                        <IconComponent className="h-5 w-5" /> {/* Adjusted size for mobile */}
                      </div>
                      <h3 className={cn("text-xl font-semibold", primaryColorTextClass)}>{skill.title}</h3> {/* Adjusted text size for mobile */}
                    </div>
                    <p className="text-gray-600 text-sm">{skill.description}</p> {/* Ensured text-sm for smaller screens */}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section (Hardcoded for now, could be dynamic) */}
      <section className={cn("py-16 text-white text-center px-4", primaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.primaryColor}-700) 0%, var(--${siteData.secondaryColor}-500) 100%)` }}> {/* Adjusted padding for mobile */}
        <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Adjusted grid for mobile */}
            <div className="p-2"> {/* Adjusted padding for mobile */}
              <span className="block text-4xl font-bold mb-1">150+</span> {/* Adjusted text size for mobile */}
              <span className="text-base opacity-90">Projets Réalisés</span> {/* Adjusted text size for mobile */}
            </div>
            <div className="p-2"> {/* Adjusted padding for mobile */}
              <span className="block text-4xl font-bold mb-1">10+</span> {/* Adjusted text size for mobile */}
              <span className="text-base opacity-90">Années d'Expérience</span> {/* Adjusted text size for mobile */}
            </div>
            <div className="p-2"> {/* Adjusted padding for mobile */}
              <span className="block text-4xl font-bold mb-1">98%</span> {/* Adjusted text size for mobile */}
              <span className="text-base opacity-90">Clients Satisfaits</span> {/* Adjusted text size for mobile */}
            </div>
            <div className="p-2"> {/* Adjusted padding for mobile */}
              <span className="block text-4xl font-bold mb-1">24h</span> {/* Adjusted text size for mobile */}
              <span className="text-base opacity-90">Délai d'Intervention</span> {/* Adjusted text size for mobile */}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      {sectionsVisibility.showProductsServices && portfolioItemsToDisplay.length > 0 && (
        <section id="realisations" className="py-12 bg-white px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
              <h2 className={cn("text-2xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}> {/* Adjusted text size for mobile */}
                Mes Réalisations
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", secondaryColorClass)}></span> {/* Adjusted width for mobile */}
              </h2>
              <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">Découvrez une sélection de mes projets les plus représentatifs</p> {/* Adjusted mt and text size for mobile */}
            </div>
            {/* Filters (simplified for now, can be made dynamic later) */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap"> {/* Adjusted gap and flex-wrap for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Tous</button> {/* Adjusted padding and text size for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Rénovation</button> {/* Adjusted padding and text size for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Réparation</button> {/* Adjusted padding and text size for mobile */}
              <button className={cn("px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border text-sm", primaryColorBorderClass, primaryColorTextClass, primaryColorHoverBgClass, "hover:text-white")}>Finitions</button> {/* Adjusted padding and text size for mobile */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap and grid for mobile */}
              {portfolioItemsToDisplay.map((item: any, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                  <div className="h-56 overflow-hidden"> {/* Adjusted height for mobile */}
                    <Image src={item.image} alt={item.title} width={300} height={224} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" /> {/* Adjusted width/height for mobile */}
                  </div>
                  <div className="p-4 bg-white"> {/* Adjusted padding for mobile */}
                    <h3 className={cn("text-lg font-semibold mb-2", primaryColorTextClass)}>{item.title}</h3> {/* Adjusted text size for mobile */}
                    <p className="text-gray-600 mb-4 text-xs">{item.description}</p> {/* Ensured text-xs for smaller screens */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium"> {/* Adjusted padding and text size for mobile */}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section id="temoignages" className="py-12 bg-gray-100 px-4"> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-4xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <div className="text-center mb-8 md:mb-12"> {/* Adjusted mb for mobile */}
              <h2 className={cn("text-2xl md:text-4xl font-bold mb-4 relative inline-block", primaryColorTextClass)}> {/* Adjusted text size for mobile */}
                Ils m'ont fait confiance
                <span className={cn("absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-20 h-1 rounded-full", secondaryColorClass)}></span> {/* Adjusted width for mobile */}
              </h2>
              <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">Retours d'expérience de clients satisfaits</p> {/* Adjusted mt and text size for mobile */}
            </div>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4 sm:-ml-8"> {/* Adjusted margin for mobile */}
                  {testimonialsToDisplay.map((testimonial: any, index: number) => (
                    <div key={index} className="flex-none w-full pl-4 sm:pl-8"> {/* Adjusted padding for mobile */}
                      <div className="bg-white rounded-xl p-8 shadow-lg text-center relative"> {/* Adjusted padding for mobile */}
                        <span className={cn("absolute top-4 left-4 text-6xl font-serif opacity-10", accentColorTextClass)}>&ldquo;</span> {/* Adjusted text size for mobile */}
                        <p className="text-base italic mb-6 relative z-10 leading-relaxed">{testimonial.quote}</p> {/* Adjusted text size for mobile */}
                        <div className="flex flex-col items-center justify-center gap-4">
                          {testimonial.avatar ? (
                            <Image src={testimonial.avatar} alt="Client" width={60} height={60} className={cn("rounded-full object-cover border-4", accentColorBorderClass)} /> {/* Adjusted size for mobile */}
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"> {/* Adjusted size for mobile */}
                              <User className="h-7 w-7" /> {/* Adjusted size for mobile */}
                            </div>
                          )}
                          <div>
                            <h4 className={cn("text-lg font-semibold mb-1", primaryColorTextClass)}>{testimonial.author}</h4> {/* Adjusted text size for mobile */}
                            <p className="text-sm text-gray-600">{testimonial.location}</p> {/* Adjusted text size for mobile */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-6"> {/* Adjusted mt for mobile */}
                {testimonialsToDisplay.map((_, index) => (
                  <button
                    key={index}
                    className={cn("h-2.5 w-2.5 rounded-full bg-gray-300 cursor-pointer transition-all duration-300", selectedIndex === index && cn("bg-red-500 scale-125", secondaryColorClass))} {/* Adjusted size for mobile */}
                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showContact && (
        <section className={cn("py-16 text-white text-center px-4", secondaryColorClass)} style={{ background: `linear-gradient(135deg, var(--${siteData.secondaryColor}-600) 0%, var(--${siteData.primaryColor}-800) 100%)` }}> {/* Adjusted padding for mobile */}
          <div className="container mx-auto max-w-4xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className="text-3xl font-bold mb-4">Prêt à concrétiser votre projet ?</h2> {/* Adjusted text size for mobile */}
            <p className="text-base md:text-xl mb-8 opacity-90">N'hésitez pas à me contacter pour discuter de vos besoins et obtenir un devis personnalisé</p> {/* Adjusted text size for mobile */}
            {siteData.showContactForm ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-gray-800"> {/* Adjusted padding for mobile */}
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
                  {siteData.productsAndServices.length > 0 && (
                    <div>
                      <label htmlFor="service" className="block text-gray-700 font-medium mb-1 text-sm">Service intéressé</label> {/* Adjusted text size for mobile */}
                      <select id="service" name="service" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.service} onChange={handleChange}> {/* Adjusted padding and text size for mobile */}
                        <option value="">Sélectionnez un service</option>
                        {siteData.productsAndServices.map((product: any, idx: number) => (
                          <option key={idx} value={product.title}>{product.title}</option>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center"> {/* Adjusted gap for mobile */}
                <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-base transition-all duration-300 ease-in-out transform", whatsappBgClass, whatsappHoverBgClass, "shadow-lg hover:shadow-xl w-full sm:w-auto")}> {/* Adjusted padding, text size, and width for mobile */}
                  <MessageSquare className="h-5 w-5" /> Discuter de mon projet
                </a>
                {siteData.secondaryPhoneNumber && (
                  <a href={`tel:${siteData.secondaryPhoneNumber}`} className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-base bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg w-full sm:w-auto"> {/* Adjusted padding, text size, and width for mobile */}
                    <Phone className="h-5 w-5" /> Appeler maintenant
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className={cn("py-12 text-white px-4", primaryColorDarkBgClass)}> {/* Adjusted padding for mobile */}
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"> {/* Removed px-4 md:px-6, using container mx-auto */}
          <div className="text-center sm:text-left">
            <Link href="/" className="font-bold text-lg"> {/* Adjusted text size for mobile */}
              {siteData.publicName}
            </Link>
            <p className="text-xs text-gray-300 mt-2"> {/* Ensured text-xs for smaller screens */}
              {siteData.heroSlogan}
            </p>
          </div>
          <div className="flex gap-4">
            {siteData.facebookLink && (
              <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <Facebook className="h-5 w-5" /> {/* Adjusted size for mobile */}
              </a>
            )}
            {siteData.instagramLink && (
              <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                <Instagram className="h-5 w-5" /> {/* Adjusted size for mobile */}
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
        className={cn("fixed bottom-6 right-6 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300", secondaryColorClass, secondaryColorHoverBgClass, showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4')} {/* Adjusted size and position for mobile */}
      >
        <ChevronUp className="h-5 w-5" /> {/* Adjusted size for mobile */}
      </button>
    </div>
  );
}