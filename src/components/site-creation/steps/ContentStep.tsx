"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
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

export function ContentStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">🎯 Contenu (Les Pages Clés)</h3>
      <p className="text-center text-muted-foreground">
        Le cœur de votre site web : ce que vous offrez et votre histoire.
      </p>

      <FormField
        control={control}
        name="heroSlogan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slogan Accrocheur (Bannière d'Accueil)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Votre partenaire pour une maison impeccable." {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Le message principal visible sur la page d'accueil (max 60 caractères).
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="aboutStory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mon Histoire / Ma Mission (Page "À Propos")</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Racontez votre parcours, vos valeurs, votre engagement local (max 300 caractères)."
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

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Preuves / Témoignages</h4>
      <p className="text-center text-muted-foreground">
        Établissez votre crédibilité.
      </p>
      <FormField
        control={control}
        name="portfolioProofLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lien vers vos Réalisations (Optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: https://drive.google.com/mon-portfolio" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Lien vers un portfolio, Google Drive, ou des photos de vos projets.
            </p>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="portfolioProofDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description Courte d'un Projet (Optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez brièvement un projet phare ou un témoignage (max 200 caractères)."
                className="resize-y min-h-[60px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}