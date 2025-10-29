"use client";

import React from "react";
import { useFormContext, ControllerRenderProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon } from "lucide-react"; // Import ImageIcon
import { toast } from "sonner";

export function ContentStep() {
  const { control } = useFormContext();
  const maxHeroImageSizeMB = 2; // Max 2MB for hero image

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">🎯 Contenu (Les Pages Clés)</h3>
      <p className="text-center text-muted-foreground">
        Le cœur de votre site web : ce que vous offrez et votre histoire.
      </p>

      <FormField
        control={control}
        name="heroSlogan"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "heroSlogan"> }) => (
          <FormItem>
            <FormLabel>Slogan Accrocheur (Bannière d'Accueil)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Votre partenaire pour une maison impeccable." {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Le message principal visible sur la page d'accueil (max 100 caractères).
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="aboutStory"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "aboutStory"> }) => (
          <FormItem>
            <FormLabel>Mon Histoire / Ma Mission (Page "À Propos")</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Racontez votre parcours, vos valeurs, votre engagement local (max 500 caractères)."
                className="resize-y min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Aide à construire la confiance avec vos visiteurs.
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="heroBackgroundImage"
        render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<FieldValues, "heroBackgroundImage"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-muted-foreground" /> Image de Fond du Héro (Optionnel)</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files && event.target.files[0];
                  if (file && file.size > maxHeroImageSizeMB * 1024 * 1024) {
                    toast.error(`Le fichier est trop grand. La taille maximale est de ${maxHeroImageSizeMB}MB.`);
                    onChange(undefined); // Clear the field
                  } else {
                    onChange(file);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Téléchargez une image pour la bannière principale de votre site (max {maxHeroImageSizeMB}MB).
            </p>
          </FormItem>
        )}
      />

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Preuves / Témoignages (Optionnel)</h4>
      <p className="text-center text-muted-foreground">
        Ces champs sont des options rapides. Pour une gestion complète des témoignages et compétences, utilisez l'éditeur avancé.
      </p>
      {/* Removed portfolioProofLink and portfolioProofDescription fields */}
      <p className="text-sm text-muted-foreground">
        Pour ajouter des liens vers vos réalisations ou des descriptions de projets, veuillez utiliser l'éditeur avancé.
      </p>
    </div>
  );
}