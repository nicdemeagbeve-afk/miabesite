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

export function TermsConditionsStep() {
  const { control } = useFormContext();

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
      <h3 className="text-2xl font-bold text-center">🤝 Termes et Conditions</h3>
      <p className="text-center text-muted-foreground">
        Définissez les modalités de vos transactions.
      </p>

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
        name="typicalLeadTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Délai Typique (pour les services)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 24-48 heures, 3-5 jours ouvrables" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Temps nécessaire pour un service standard ou une livraison.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}