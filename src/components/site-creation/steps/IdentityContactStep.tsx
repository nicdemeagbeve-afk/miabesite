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
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for social media description

export function IdentityContactStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">👤 Identité et Contact</h3>
      <p className="text-center text-muted-foreground">
        Qui êtes-vous et comment vos clients peuvent-ils vous joindre ?
      </p>

      <FormField
        control={control}
        name="publicName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom Public (Entreprise ou Vendeur)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Mamadou Couture, Aïsha Délices" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="profilePicture"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Photo de Profil (optionnel)</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                accept="image/*"
                onChange={(event) => onChange(event.target.files && event.target.files[0])}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localisation (Ville/Quartier)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Dakar, Plateau ; Abidjan, Cocody" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="whatsappNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro WhatsApp/Téléphone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Ex: +225 07 00 00 00 00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="socialMediaLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lien Réseaux Sociaux (optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: https://facebook.com/votrepage" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Lien vers votre profil Facebook ou Instagram.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}