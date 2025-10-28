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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

export function EssentialDesignStep() {
  const { control } = useFormContext();
  const maxLogoSizeMB = 2; // Max 2MB for logo/photo

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">🏷️ Infos Essentielles & Design</h3>
      <p className="text-center text-muted-foreground">
        L'identité numérique de votre entreprise.
      </p>

      <FormField
        control={control}
        name="publicName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom Public & Activité</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Mamadou Couture, Aïsha Délices" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Nom de votre entreprise/personne et votre rôle principal.
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="whatsappNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro WhatsApp (Obligatoire)</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Ex: +225 07 00 00 00 00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="secondaryPhoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de Téléphone Secondaire (Optionnel)</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="Ex: +225 01 00 00 00 00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail (Optionnel)</FormLabel>
            <FormControl>
              <Input type="email" placeholder="votre@email.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couleur Principale du Site</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une couleur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {predefinedColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couleur Secondaire du Site</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une couleur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {predefinedColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="logoOrPhoto"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Logo ou Photo de Profil (Optionnel)</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files && event.target.files[0];
                  if (file && file.size > maxLogoSizeMB * 1024 * 1024) {
                    toast.error(`Le fichier est trop grand. La taille maximale est de ${maxLogoSizeMB}MB.`);
                    onChange(undefined); // Clear the field
                  } else {
                    onChange(file);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Téléchargez votre logo ou une photo de profil (max {maxLogoSizeMB}MB).
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}