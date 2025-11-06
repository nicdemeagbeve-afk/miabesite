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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Palette, User, Phone, Mail, Image as ImageIcon } from "lucide-react"; // Importation des icônes

import { PhoneInputWithCountryCode } from "@/components/PhoneInputWithCountryCode"; // Import new component

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
      <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Palette className="h-6 w-6 text-primary" /> Infos Essentielles & Design
      </h3>
      <p className="text-center text-muted-foreground">
        L'identité numérique de votre entreprise.
      </p>

      <FormField
        control={control}
        name="firstName"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "firstName"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-muted-foreground" /> Prénom</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Jean" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "lastName"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-muted-foreground" /> Nom</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Dupont" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="expertise"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "expertise"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-muted-foreground" /> Domaine d'expertise / Travail</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Développeur Web, Artisan Plombier" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="publicName"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "publicName"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-muted-foreground" /> Nom Public & Activité</FormLabel>
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
        render={({ field }: { field: ControllerRenderProps<FieldValues, "whatsappNumber"> }) => (
          <PhoneInputWithCountryCode
            name={field.name}
            label="Numéro WhatsApp (Obligatoire)"
            placeholder="Ex: 07 00 00 00 00"
            required
          />
        )}
      />

      <FormField
        control={control}
        name="secondaryPhoneNumber"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "secondaryPhoneNumber"> }) => (
          <PhoneInputWithCountryCode
            name={field.name}
            label="Numéro de Téléphone Secondaire (Optionnel)"
            placeholder="Ex: 01 00 00 00 00"
          />
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "email"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-muted-foreground" /> E-mail (Optionnel)</FormLabel>
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
          render={({ field }: { field: ControllerRenderProps<FieldValues, "primaryColor"> }) => (
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
          render={({ field }: { field: ControllerRenderProps<FieldValues, "secondaryColor"> }) => (
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
        render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<FieldValues, "logoOrPhoto"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-muted-foreground" /> Logo ou Photo de Profil (Optionnel)</FormLabel>
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

      <FormField
        control={control}
        name="businessLocation"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "businessLocation"> }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-muted-foreground" /> Localisation de l'Entreprise</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Dakar, Sénégal" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              L'adresse principale ou la zone de service de votre entreprise.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}