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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch"; // Import Switch

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

      {/* Le champ sous-domaine est supprimé ici */}
      {/* businessLocation a été déplacé vers EssentialDesignStep */}

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Gestion des Commandes</h4>
      <FormField
        control={control}
        name="contactButtonAction"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "contactButtonAction"> }) => (
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

      <FormField
        control={control}
        name="showContactForm"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "showContactForm"> }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Afficher un formulaire de contact ?</FormLabel>
              <p className="text-sm text-muted-foreground">
                Cochez pour inclure un formulaire de contact sur votre site.
              </p>
            </div>
          </FormItem>
        )}
      />

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Réseaux Sociaux (Optionnel)</h4>
      <FormField
        control={control}
        name="facebookLink"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "facebookLink"> }) => (
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
        render={({ field }: { field: ControllerRenderProps<FieldValues, "instagramLink"> }) => (
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
        render={({ field }: { field: ControllerRenderProps<FieldValues, "linkedinLink"> }) => (
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
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "paymentMethods"> }) => {
                    return (
                      <FormItem
                        key={method.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(method.id)}
                            onCheckedChange={(checked: boolean) => {
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
        render={({ field }: { field: ControllerRenderProps<FieldValues, "deliveryOption"> }) => (
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
        render={({ field }: { field: ControllerRenderProps<FieldValues, "depositRequired"> }) => (
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

      <Separator className="my-8" />

      <h4 className="text-xl font-semibold text-center">Visibilité des Sections</h4>
      <FormField
        control={control}
        name="sectionsVisibility.showHero"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "sectionsVisibility.showHero"> }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Afficher la Section Héro</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sectionsVisibility.showAbout"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "sectionsVisibility.showAbout"> }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Afficher la Section "À Propos"</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sectionsVisibility.showProductsServices"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "sectionsVisibility.showProductsServices"> }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Afficher la Section "Produits & Services"</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sectionsVisibility.showTestimonials"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "sectionsVisibility.showTestimonials"> }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Afficher la Section "Témoignages"</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sectionsVisibility.showSkills"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "sectionsVisibility.showSkills"> }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Afficher la Section "Compétences"</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sectionsVisibility.showContact"
        render={({ field }: { field: ControllerRenderProps<FieldValues, "sectionsVisibility.showContact"> }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Afficher la Section "Contact"</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}