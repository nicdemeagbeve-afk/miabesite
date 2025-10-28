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

export function PersonalInfoStep() {
  const { control } = useFormContext();

  const businessDomains = [
    { value: "restauration", label: "Restauration" },
    { value: "commerce", label: "Commerce / Boutique" },
    { value: "services", label: "Services (Conseil, Coaching, etc.)" },
    { value: "artisanat", label: "Artisanat" },
    { value: "education", label: "Éducation / Formation" },
    { value: "sante", label: "Santé / Bien-être" },
    { value: "technologie", label: "Technologie / IT" },
    { value: "immobilier", label: "Immobilier" },
    { value: "tourisme", label: "Tourisme / Hôtellerie" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Informations Personnelles et Professionnelles</h3>
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom</FormLabel>
            <FormControl>
              <Input placeholder="Votre prénom" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input placeholder="Votre nom" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Âge</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Votre âge" {...field} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : '')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="businessDomain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Domaine d'activité</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre domaine d'activité" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {businessDomains.map((domain) => (
                  <SelectItem key={domain.value} value={domain.value}>
                    {domain.label}
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
        name="profilePicture"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Photo de profil (optionnel)</FormLabel>
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
        name="logo"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Logo de l'entreprise (optionnel)</FormLabel>
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
    </div>
  );
}