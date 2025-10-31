"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Download, HelpCircle, MessageCircle, Palette, LayoutTemplate, Type, EyeOff } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase client
import { useRouter } from "next/navigation";

interface AdvancedManagementAndHelpProps {
  subdomain: string;
  initialTemplateType: string;
  initialPrimaryColor: string;
  initialSecondaryColor: string;
  initialShowTestimonials: boolean;
  initialShowSkills: boolean;
}

export function AdvancedManagementAndHelp({
  subdomain,
  initialTemplateType,
  initialPrimaryColor,
  initialSecondaryColor,
  initialShowTestimonials,
  initialShowSkills,
}: AdvancedManagementAndHelpProps) {
  const supabase = createClient();
  const router = useRouter();

  const [customDomain, setCustomDomain] = React.useState("");
  const [isLinkingDomain, setIsLinkingDomain] = React.useState(false);
  const [isDownloadingCode, setIsDownloadingCode] = React.useState(false);

  // Design states
  const [selectedTemplate, setSelectedTemplate] = React.useState(initialTemplateType);
  const [primaryColor, setPrimaryColor] = React.useState(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = React.useState(initialSecondaryColor);
  const [fontFamily, setFontFamily] = React.useState("sans"); // Placeholder for future font options
  const [showTestimonials, setShowTestimonials] = React.useState(initialShowTestimonials);
  const [showSkills, setShowSkills] = React.useState(initialShowSkills);
  const [isUpdatingDesign, setIsUpdatingDesign] = React.useState(false);


  const supportWhatsAppNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER || "+22870832482"; // Use env var or default

  const predefinedColors = [
    { value: "red", label: "Rouge" },
    { value: "blue", label: "Bleu" },
    { value: "green", label: "Vert" },
    { value: "yellow", label: "Jaune" },
    { value: "black", label: "Noir" },
    { value: "purple", label: "Violet" },
    { value: "orange", label: "Orange" },
    { value: "gray", label: "Gris" },
  ];

  const fontOptions = [
    { value: "sans", label: "Sans-serif (Moderne)" },
    { value: "serif", label: "Serif (Classique)" },
    { value: "mono", label: "Monospace (Technique)" },
  ];

  const templateOptions = [
    { value: "default", label: "Template par défaut" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "service-portfolio", label: "Service & Portfolio" },
    { value: "professional-portfolio", label: "Portfolio Professionnel" },
    { value: "artisan-ecommerce", label: "E-commerce Artisanal" },
  ];

  const handleLinkDomain = async () => {
    toast.info("La liaison de domaine personnalisé n'est pas disponible pour le moment. Elle sera implémentée dans une version 2.");
    // if (customDomain.trim() === "") {
    //   toast.error("Veuillez entrer un nom de domaine.");
    //   return;
    // }
    // setIsLinkingDomain(true);
    // try {
    //   const response = await fetch(`/api/dashboard/domain-linking`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ subdomain, customDomain }),
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     toast.success(result.message);
    //   } else {
    //     toast.error(result.error || "Erreur lors de la liaison du domaine.");
    //   }
    // } catch (error) {
    //   console.error("Error linking domain:", error);
    //   toast.error("Une erreur inattendue est survenue lors de la liaison du domaine.");
    // } finally {
    //   setIsLinkingDomain(false);
    // }
  };

  const handleDownloadCode = async () => {
    toast.info("Le téléchargement du code source n'est pas disponible pour le moment. Il sera implémenté dans une version 2.");
    // setIsDownloadingCode(true);
    // try {
    //   const response = await fetch(`/api/dashboard/download-code?subdomain=${subdomain}`, {
    //     method: 'GET',
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     toast.success(result.message);
    //     // In a real scenario, the API would return a file, and you'd handle the download here.
    //     // For simulation, we just show a toast.
    //   } else {
    //     toast.error(result.error || "Erreur lors du téléchargement du code.");
    //   }
    // } catch (error) {
    //   console.error("Error downloading code:", error);
    //   toast.error("Une erreur inattendue est survenue lors du téléchargement du code.");
    // } finally {
    //   setIsDownloadingCode(false);
    // }
  };

  const handleApplyDesignChanges = async () => {
    setIsUpdatingDesign(true);
    try {
      // Update template type
      const templateResponse = await fetch(`/api/site/${subdomain}/template`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateType: selectedTemplate }),
      });

      const templateResult = await templateResponse.json();

      if (!templateResponse.ok) {
        toast.error(templateResult.error || "Erreur lors de la mise à jour du template.");
        setIsUpdatingDesign(false);
        return;
      }
      toast.success("Template mis à jour avec succès !");

      // Update other design settings (colors, showTestimonials, showSkills)
      const designResponse = await fetch(`/api/site/${subdomain}/design`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          showTestimonials: showTestimonials,
          showSkills: showSkills,
          // fontFamily: fontFamily, // Placeholder, not implemented in backend yet
        }),
      });

      const designResult = await designResponse.json();

      if (!designResponse.ok) {
        toast.error(designResult.error || "Erreur lors de la mise à jour des couleurs/sections.");
        setIsUpdatingDesign(false);
        return;
      }
      toast.success("Couleurs et sections mises à jour avec succès !");

      router.refresh(); // Refresh the page to show all updated changes
    } catch (error) {
      console.error("Failed to update design:", error);
      toast.error("Une erreur inattendue est survenue lors de la mise à jour du design.");
    } finally {
      setIsUpdatingDesign(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">⚙️ Gestion Avancée et Aide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domaine et Hébergement */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Domaine et Hébergement</h3>
          <p className="text-muted-foreground mb-4">
            Liez votre propre nom de domaine (ex: monaffaire.com) pour une présence plus professionnelle.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="monaffaire.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="flex-1"
              disabled={true} // Disable input as feature is not available
            />
            <Button onClick={handleLinkDomain} className="w-full sm:w-auto" disabled={true}>
              <Globe className="mr-2 h-5 w-5" /> Lier le domaine
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-red-500">
            Non disponible pour le moment, sera implémenté pour une version 2.
          </p>
        </div>

        {/* Téléchargement du Code */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Téléchargement du Code</h3>
          <p className="text-muted-foreground mb-4">
            Téléchargez le code source complet de votre site.
          </p>
          <Button onClick={handleDownloadCode} variant="outline" size="lg" className="w-full" disabled={true}>
            <Download className="mr-2 h-5 w-5" /> Télécharger le code (ZIP)
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-red-500">
            Non disponible pour le moment, sera implémenté pour une version 2.
          </p>
        </div>

        <Separator />

        {/* Modifier l'Apparence (Design) */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Modifier l'Apparence (Design)</h3>
          <p className="text-muted-foreground mb-4">
            Personnalisez le design de votre site (templates, couleurs, polices, sections).
          </p>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="lg" className="w-full">
                <Palette className="mr-2 h-5 w-5" /> Modifier l'Apparence (Design)
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Options de Design Avancées</DrawerTitle>
                  <DrawerDescription>Personnalisez l'aspect visuel de votre site.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0 space-y-6">
                  {/* Changer de Template */}
                  <div className="space-y-2">
                    <Label htmlFor="template">Changer de Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Sélectionnez un template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templateOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choisissez un nouveau modèle pour votre site.
                    </p>
                  </div>

                  {/* Options de Couleurs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Couleur Principale</Label>
                      <Select value={primaryColor} onValueChange={setPrimaryColor}>
                        <SelectTrigger id="primary-color">
                          <SelectValue placeholder="Couleur principale" />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              {color.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Couleur Secondaire</Label>
                      <Select value={secondaryColor} onValueChange={setSecondaryColor}>
                        <SelectTrigger id="secondary-color">
                          <SelectValue placeholder="Couleur secondaire" />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              {color.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Changer la Police */}
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Police de Caractères</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Sélectionnez une police" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      (Fonctionnalité en cours de développement)
                    </p>
                  </div>

                  {/* Masquer/Afficher Sections */}
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-testimonials">Afficher la section Témoignages</Label>
                      <p className="text-sm text-muted-foreground">
                        Contrôlez la visibilité de la section des témoignages.
                      </p>
                    </div>
                    <Switch
                      id="show-testimonials"
                      checked={showTestimonials}
                      onCheckedChange={setShowTestimonials}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-skills">Afficher la section Compétences</Label>
                      <p className="text-sm text-muted-foreground">
                        Contrôlez la visibilité de la section des compétences.
                      </p>
                    </div>
                    <Switch
                      id="show-skills"
                      checked={showSkills}
                      onCheckedChange={setShowSkills}
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button onClick={handleApplyDesignChanges} disabled={isUpdatingDesign}>
                    {isUpdatingDesign ? "Application..." : "Appliquer les Modifications"}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Annuler</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <Separator />

        {/* Aide et Support */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Aide et Support</h3>
          <p className="text-muted-foreground mb-4">
            Besoin d'aide ? Nous sommes là pour vous.
          </p>
          <Link href="#faq" passHref>
            <Button asChild variant="secondary" className="flex-1">
              <div>
                <HelpCircle className="mr-2 h-5 w-5" /> FAQ
              </div>
            </Button>
          </Link>
          <Button asChild className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <Link href={`https://wa.me/${supportWhatsAppNumber}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" /> Support WhatsApp
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}