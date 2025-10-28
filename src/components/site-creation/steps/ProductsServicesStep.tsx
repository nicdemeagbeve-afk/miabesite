"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const currencies = ["XOF", "USD", "EUR", "GBP", "GHS"];
const actionButtons = [
  { value: "buy", label: "Acheter" },
  { value: "quote", label: "Demander un devis" },
  { value: "book", label: "Réserver" },
  { value: "contact", label: "Contacter" },
];

export function ProductsServicesStep() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productsAndServices",
  });

  const maxProducts = 3;
  const maxProductImageSizeMB = 1; // Max 1MB for product image

  // Add an empty product field if the list is empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ title: "", price: "", currency: "XOF", description: "", image: undefined, actionButton: "contact" });
    }
  }, [fields.length, append]);

  // Add an empty product field if the last one is being typed into and it's not the max
  React.useEffect(() => {
    const lastProduct = watch(`productsAndServices.${fields.length - 1}`);
    if (fields.length > 0 && fields.length < maxProducts && lastProduct?.title !== "") {
      append({ title: "", price: "", currency: "XOF", description: "", image: undefined, actionButton: "contact" });
    }
  }, [fields, watch, append, maxProducts]);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">🛍️ Produits & Services</h3>
      <p className="text-center text-muted-foreground">
        Présentez vos offres phares (3 maximum).
      </p>

      <div className="space-y-8">
        {fields.map((item, index) => (
          <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
            {fields.length > 1 && (index < fields.length -1 || (index === fields.length -1 && watch(`productsAndServices.${index}.title`) === "")) && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            )}
            <h5 className="text-lg font-semibold">Offre {index + 1}</h5>
            <FormField
              control={control}
              name={`productsAndServices.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du Produit/Service</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Formation Digitale Débutant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`productsAndServices.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix/Tarif</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`productsAndServices.${index}.currency`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
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
              name={`productsAndServices.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description Détaillée</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ce qui est inclus, la durée, les garanties (max 200 caractères)."
                      className="resize-y min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`productsAndServices.${index}.image`}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image du Produit/Service (Optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file && file.size > maxProductImageSizeMB * 1024 * 1024) {
                          toast.error(`Le fichier est trop grand. La taille maximale est de ${maxProductImageSizeMB}MB.`);
                          onChange(undefined); // Clear the field
                        } else {
                          onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Téléchargez la meilleure photo pour cette offre (max {maxProductImageSizeMB}MB).
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`productsAndServices.${index}.actionButton`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bouton d'Action</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actionButtons.map((button) => (
                        <SelectItem key={button.value} value={button.value}>
                          {button.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}