"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Palette, LayoutTemplate, Type, EyeOff, Settings } from "lucide-react"; // Added Settings icon for advanced editor
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
import { Separator } from "@/components/ui/separator"; // ADDED IMPORT
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase client
import { useRouter } from "next/navigation";

interface ContentModificationProps {
  subdomain: string;
  initialTemplateType: string;
  initialPrimaryColor: string;
  initialSecondaryColor: string;
  initialShowTestimonials: boolean;
}

export function ContentModification({
  subdomain,
  initialTemplateType,
  initialPrimaryColor,
  initialSecondaryColor,
  initialShowTestimonials,
}: ContentModificationProps) {
  const supabase = createClient();
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = React.useState(initialTemplateType);
  const [primaryColor, setPrimaryColor] = React.useState(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = React.useState(initialSecondaryColor);
  const [fontFamily, setFontFamily] = React.useState("sans"); // This is a placeholder, not yet connected to backend
  const [showTestimonials, setShowTestimonials] = React.useState(initialShowTestimonials);
  const [isUpdating, setIsUpdating] = React.useState(false);

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

  const handleApplyDesignChanges = async () => {
    setIsUpdating(true);
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
        setIsUpdating(false);
        return;
      }
      toast.success("Template mis à jour avec succès !");

      // Update other design settings (colors, showTestimonials)
      const designResponse = await fetch(`/api/site/${subdomain}/design`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          showTestimonials: showTestimonials,
          // fontFamily: fontFamily, // Placeholder, not implemented in backend yet
        }),
      });

      const designResult = await designResponse.json();

      if (!designResponse.ok) {
        toast.error(designResult.error || "Erreur lors de la mise à jour des couleurs/sections.");
        setIsUpdating(false);
        return;
      }
      toast.success("Couleurs et sections mises à jour avec succès !");

      router.refresh(); // Refresh the page to show all updated changes
    } catch (error) {
      console.error("Failed to update design:", error);
      toast.error("Une erreur inattendue est survenue lors de la mise à jour du design.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">📝 Modifier le Contenu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Simple */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Modification Rapide (Wizard)</h3>
          <p className="text-muted-foreground mb-4">
            Mettez à jour rapidement les informations clés de votre site via l'assistant.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href={`/create-site?subdomain=${subdomain}`}> {/* Pass subdomain for editing */}
              <Pencil className="mr-2 h-5 w-5" /> Modifier le Contenu (Wizard)
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Note: Ce bouton vous permet de créer un nouveau site ou de re-parcourir l'assistant. Pour modifier un site existant avec ses données pré-remplies, cette fonctionnalité est en cours de développement.
          </p>
        </div>

        <Separator />

        {/* Mode Avancé - Éditeur de Contenu */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Éditeur de Contenu Avancé</h3>
          <p className="text-muted-foreground mb-4">
            Personnalisez en détail toutes les sections de votre site (textes, images, témoignages, compétences, etc.).
          </p>
          <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/dashboard/${subdomain}/edit-content`}>
              <Settings className="mr-2 h-5 w-5" /> Accéder à l'Éditeur Avancé
            </Link>
          </Button>
        </div>

        <Separator />

        {/* Mode Avancé - Design (Existing Drawer) */}
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
                </div>
                <DrawerFooter>
                  <Button onClick={handleApplyDesignChanges} disabled={isUpdating}>
                    {isUpdating ? "Application..." : "Appliquer les Modifications"}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Annuler</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  );
}