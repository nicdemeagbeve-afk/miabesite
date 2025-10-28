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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SiteInfoStep() {
  const { control } = useFormContext();

  const siteTypes = [
    { value: "restaurant", label: "Restaurant" },
    { value: "boutique", label: "Boutique en ligne" },
    { value: "salon_coiffure", label: "Salon de coiffure" },
    { value: "startup", label: "Startup / Tech" },
    { value: "association", label: "Association / ONG" },
    { value: "artisanat", label: "Artisanat" },
    { value: "services", label: "Services professionnels" },
    { value: "blog", label: "Blog personnel" },
    { value: "portfolio", label: "Portfolio" },
    { value: "autre", label: "Autre" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Informations de base du site</h3>
      <FormField
        control={control}
        name="siteName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de votre site</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Mon Super Restaurant" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="siteType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de votre activité</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de votre site" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {siteTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
        name="siteDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Décrivez votre activité</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez en quelques phrases votre entreprise, vos services ou vos produits."
                className="resize-y min-h-[100px]"
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