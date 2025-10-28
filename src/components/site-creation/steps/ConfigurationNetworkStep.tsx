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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function ConfigurationNetworkStep() {
  const { control } = useFormContext();

  const contactButtonOptions = [
    { value: "whatsapp", label: "WhatsApp (Recommandé)" },
    { value: "emailForm", label: "Formulaire d'e-mail" },
    { value: "phoneNumber", label: "Numéro de Téléphone" },
  ];

  const paymentMethods = [
    { id: "cash", label: "Cash à la livraison" },
    { id: "mobileMoney", label: "Mobile Money (Orange Money, MoMo, etc.)" },
    { id: "bankTransfer", label: "Virement bancaire" },
    { id: "appPayment", label: "Paiement par l'application (si disponible)" },
  ];

  const deliveryOptions = [
    { value: "local", label: "Local (dans la ville seulement)" },
    { value: "national", label: "National" },
    { value: "international", label: "International" },
    { value: "providerTravel", label: "Déplacement du prestataire (tarif en sus)" },
    { value: "none", label: "Pas de livraison/déplacement" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">🌐 Configuration et Réseaux</h3>
      <p className="text-center text-muted-foreground">
        Paramétrez les interactions et la visibilité de votre site.
      </p>

      <FormField
        control={control}
        name="subdomain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ton adresse web (Sous-domaine)</FormLabel>
            <div className="flex items-center">
              <FormControl>
                <Input placeholder="monentreprise" {...field} className="rounded-r-none" />
              </FormControl>
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-muted text-muted-foreground text-sm h-10">
                .miabesite.site
              </span>
            </div>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Crée une adresse unique pour ton site.
            </p>
          </FormItem>
        )}
      />

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Gestion des Commandes</h4>
      <FormField
        control={control}
        name="contactButtonAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Action du Bouton "Contact/Commander"</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Diriger vers..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {contactButtonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Où souhaitez-vous que vos clients soient dirigés pour vous contacter ou commander ?
            </p>
          </FormItem>
        )}
      />

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Réseaux Sociaux (Optionnel)</h4>
      <FormField
        control={control}
        name="facebookLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lien Facebook</FormLabel>
            <FormControl>
              <Input placeholder="https://facebook.com/votrepage" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="instagramLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lien Instagram</FormLabel>
            <FormControl>
              <Input placeholder="https://instagram.com/votreprofil" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="linkedinLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lien LinkedIn</FormLabel>
            <FormControl>
              <Input placeholder="https://linkedin.com/in/votreprofil" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Conditions de Paiement & Livraison</h4>
      <FormField
        control={control}
        name="paymentMethods"
        render={() => (
          <FormItem>
            <FormLabel>Modes de Paiement Acceptés</FormLabel>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <FormField
                  key={method.id}
                  control={control}
                  name="paymentMethods"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={method.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(method.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), method.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== method.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {method.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="deliveryOption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Livraison / Déplacement</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {deliveryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
        name="depositRequired"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Acompte requis ?</FormLabel>
              <p className="text-sm text-muted-foreground">
                Cochez si un acompte est nécessaire pour les commandes/services.
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}