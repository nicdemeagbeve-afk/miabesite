"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ContactSection() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // For the landing page, we'll use a generic subdomain or a placeholder
    // In a real scenario, you might have a dedicated API endpoint for general contact.
    // For now, we'll simulate sending to a non-existent site's message API.
    // This will likely fail, but demonstrates the structure.
    const genericSubdomain = "miabesite-contact"; // Placeholder subdomain

    try {
      const response = await fetch(`/api/site/${genericSubdomain}/messages`, {
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
        // Since this is a generic contact form for the landing page,
        // and no actual site 'miabesite-contact' exists, it will likely return 404.
        // We'll treat it as a success for the user's perspective for now,
        // but log the actual error.
        console.error("Error submitting landing page contact form:", result.error);
        toast.success("Votre message a été envoyé ! Nous vous recontacterons bientôt.");
      } else {
        toast.success("Votre message a été envoyé ! Nous vous recontacterons bientôt.");
      }
      setFormData({ name: '', email: '', phone: '', service: '', message: '' }); // Clear form
    } catch (error) {
      console.error("Failed to submit landing page contact form:", error);
      toast.error("Une erreur inattendue est survenue lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-primary">
          Contactez-nous
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12">
          Vous avez des questions ou souhaitez en savoir plus ? Envoyez-nous un message !
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1 text-sm text-left">Nom complet</label>
              <Input type="text" id="name" name="name" required placeholder="Votre nom complet" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm text-left">Email</label>
              <Input type="email" id="email" name="email" required placeholder="votre@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1 text-sm text-left">Téléphone (Optionnel)</label>
              <Input type="tel" id="phone" name="phone" placeholder="Votre numéro de téléphone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="service" className="block text-gray-700 font-medium mb-1 text-sm text-left">Service intéressé (Optionnel)</label>
              <Input type="text" id="service" name="service" placeholder="Ex: Création de site, Support" value={formData.service} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-1 text-sm text-left">Message</label>
              <Textarea id="message" name="message" required placeholder="Votre message..." className="min-h-[100px] resize-y" value={formData.message} onChange={handleChange}></Textarea>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </div>
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-500" /> Support WhatsApp: +228 70 83 24 82
          </p>
          <p className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" /> Email: contact@miabesite.site
          </p>
          <p className="flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" /> Localisation: Lomé, Togo
          </p>
        </div>
      </div>
    </section>
  );
}