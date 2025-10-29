"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare, MapPin, Star, Wrench, Phone, Mail, User, Check } from 'lucide-react'; // Added User icon
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';
import { toast } from 'sonner'; // Import toast for notifications

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

  const primaryColorClass = `bg-${siteData.primaryColor}-600`;
  const primaryColorTextClass = `text-${siteData.primaryColor}-600`;
  const secondaryColorClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryColorTextClass = `text-${siteData.secondaryColor}-500`;

  const sectionsVisibility = siteData.sectionsVisibility || {
    showHero: true,
    showAbout: true,
    showProductsServices: true,
    showTestimonials: true,
    showSkills: true,
    showContact: true,
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

  // Helper to get Lucide icon component by name (simplified for DefaultTemplate)
  const getLucideIcon = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Wrench, Star, Check, User, Phone, Mail, MapPin, MessageSquare
    };
    return icons[iconName] || Wrench; // Default to Wrench if not found
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
      {sectionsVisibility.showHero && (
        <section className="py-12 md:py-24 lg:py-32 w-full bg-cover bg-center text-white flex flex-col items-center justify-center px-4"
          style={{
            backgroundImage: siteData.heroBackgroundImage
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${siteData.heroBackgroundImage}')`
              : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), var(--${siteData.primaryColor}-600)`
          }}
        >
          {siteData.logoOrPhoto && (
            <Image src={siteData.logoOrPhoto} alt={`${siteData.publicName} Logo`} width={80} height={80} className={cn("rounded-full object-cover mb-4", siteData.heroBackgroundImage ? "mx-auto" : "mx-auto")} /> /* Smaller if background image, larger if not */
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-4"> {/* Adjusted text size for mobile */}
            Bienvenue sur {siteData.publicName}!
          </h1>
          <p className="text-base md:text-xl mb-8 max-w-prose"> {/* Adjusted text size for mobile */}
            {siteData.heroSlogan || "Votre site est en ligne."}
          </p>
          <Link
            href={`https://wa.me/${siteData.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-base text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg bg-[#25D366] hover:bg-[#128C7E] w-full sm:w-auto")} /* Adjusted padding, text size, and width for mobile */
          >
            <MessageSquare className="h-5 w-5" /> Contactez-nous sur WhatsApp
          </Link>
        </section>
      )}

      {sectionsVisibility.showAbout && siteData.aboutStory && (
        <section className="py-12 md:py-24 w-full bg-white text-center px-4"> {/* Added px-4 */}
          <div className="container mx-auto max-w-3xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-6", primaryColorTextClass)}>À Propos de Nous</h2> {/* Adjusted text size for mobile */}
            <p className="text-base text-gray-700 leading-relaxed"> {/* Adjusted text size for mobile */}
              {siteData.aboutStory}
            </p>
          </div>
        </section>
      )}

      {sectionsVisibility.showProductsServices && productsAndServicesToDisplay.length > 0 && (
        <section className="py-12 md:py-24 w-full bg-gray-50 text-center px-4"> {/* Added px-4 */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-12", primaryColorTextClass)}>Nos Offres</h2> {/* Adjusted text size for mobile */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap and grid for mobile */}
              {productsAndServicesToDisplay.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-3"> {/* Adjusted padding for mobile */}
                  {product.image && (
                    <Image src={product.image} alt={product.title} width={120} height={80} className="mx-auto mb-4 object-cover rounded-md" /> /* Adjusted image size for mobile */
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3> {/* Adjusted text size for mobile */}
                  <p className="text-muted-foreground text-xs">{product.description}</p> {/* Ensured text-xs for smaller screens */}
                  {product.price && (
                    <p className={cn("text-xl font-bold", secondaryColorTextClass)}> {/* Adjusted text size for mobile */}
                      {product.price} {product.currency}
                    </p>
                  )}
                  <Link
                    href={`https://wa.me/${siteData.whatsappNumber}?text=Je%20suis%20intéressé%20par%20${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm text-white transition-colors duration-300 bg-[#25D366] hover:bg-[#128C7E] w-full")} /* Adjusted padding, text size, and width for mobile */
                  >
                    <MessageSquare className="h-4 w-4" /> {product.actionButton === 'buy' ? 'Acheter' : product.actionButton === 'quote' ? 'Demander un devis' : product.actionButton === 'book' ? 'Réserver' : 'Contacter'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showTestimonials && testimonialsToDisplay.length > 0 && (
        <section className="py-12 md:py-24 w-full bg-white text-center px-4"> {/* Added px-4 */}
          <div className="container mx-auto max-w-4xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-12", primaryColorTextClass)}>Ce que nos clients disent</h2> {/* Adjusted text size for mobile */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap and grid for mobile */}
              {testimonialsToDisplay.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-4 text-left"> {/* Adjusted padding for mobile */}
                  <p className="text-base italic text-gray-700 mb-4">"{testimonial.quote}"</p> {/* Adjusted text size for mobile */}
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <Image src={testimonial.avatar} alt={testimonial.author} width={40} height={40} className="rounded-full object-cover" /> /* Adjusted image size for mobile */
                    )}
                    <div>
                      <p className="font-semibold text-primary text-sm"> {/* Adjusted text size for mobile */}
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
        <section className="py-12 md:py-24 w-full bg-gray-50 text-center px-4"> {/* Added px-4 */}
          <div className="container mx-auto max-w-5xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-12", primaryColorTextClass)}>Nos Compétences</h2> {/* Adjusted text size for mobile */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap and grid for mobile */}
              {skillsToDisplay.map((skill, index) => {
                const IconComponent = skill.icon ? getLucideIcon(skill.icon) : Wrench;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-3"> {/* Adjusted padding for mobile */}
                    <div className="flex items-center justify-center mb-4"><IconComponent className={cn("h-6 w-6", primaryColorTextClass)} /></div> {/* Adjusted icon size for mobile */}
                    <h3 className="text-lg font-semibold text-gray-800">{skill.title}</h3> {/* Adjusted text size for mobile */}
                    <p className="text-muted-foreground text-xs">{skill.description}</p> {/* Ensured text-xs for smaller screens */}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {sectionsVisibility.showContact && (
        <section className="py-12 md:py-24 w-full bg-white text-center px-4"> {/* Added px-4 */}
          <div className="container mx-auto max-w-3xl"> {/* Removed px-4 md:px-6, using container mx-auto */}
            <h2 className={cn("text-2xl md:text-3xl font-bold mb-8", primaryColorTextClass)}>Contactez-nous</h2> {/* Adjusted text size for mobile */}
            {siteData.showContactForm ? (
              <div className="bg-gray-100 p-6 rounded-lg shadow-md"> {/* Adjusted padding for mobile */}
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
                  {productsAndServicesToDisplay.length > 0 && (
                    <div>
                      <label htmlFor="service" className="block text-gray-700 font-medium mb-1 text-sm">Service intéressé</label> {/* Adjusted text size for mobile */}
                      <select id="service" name="service" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.service} onChange={handleChange}> {/* Adjusted padding and text size for mobile */}
                        <option value="">Sélectionnez un service</option>
                        {productsAndServicesToDisplay.map((product: any, idx: number) => (
                          <option key={idx} value={product.title}>{product.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1 text-sm">Message</label> {/* Adjusted text size for mobile */}
                    <textarea id="message" name="message" required className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" value={formData.message} onChange={handleChange}></textarea> {/* Adjusted padding, min-height, and text size for mobile */}
                  </div>
                  <button type="submit" className={cn("w-full px-5 py-2 rounded-lg font-bold text-white text-base transition-colors duration-300", primaryColorClass, `hover:bg-${siteData.primaryColor}-700`)} disabled={isSubmitting}> {/* Adjusted padding and text size for mobile */}
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {siteData.whatsappNumber && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2"> {/* Adjusted text size for mobile */}
                    <MessageSquare className="h-5 w-5 text-green-500" /> WhatsApp: {siteData.whatsappNumber}
                  </p>
                )}
                {siteData.secondaryPhoneNumber && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2"> {/* Adjusted text size for mobile */}
                    <Phone className="h-5 w-5 text-blue-500" /> Téléphone: {siteData.secondaryPhoneNumber}
                  </p>
                )}
                {siteData.email && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2"> {/* Adjusted text size for mobile */}
                    <Mail className="h-5 w-5 text-red-500" /> Email: {siteData.email}
                  </p>
                )}
                {siteData.businessLocation && (
                  <p className="text-base text-gray-700 flex items-center justify-center gap-2"> {/* Adjusted text size for mobile */}
                    <MapPin className="h-5 w-5 text-gray-500" /> Localisation: {siteData.businessLocation}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="w-full py-6 bg-gray-800 text-white text-center mt-auto px-4"> {/* Adjusted padding for mobile */}
        <p className="text-xs text-gray-400"> {/* Ensured text-xs for smaller screens */}
          © {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}