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

export function ProductsStep() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const products = watch("products");
  const maxProducts = 3;

  // Ensure there's always at least one empty field if the list is empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ name: "", image: undefined, price: "", currency: "XOF", description: "" });
    }
  }, [fields.length, append]);

  // Add an empty product field if the last one is being typed into and it's not the max
  React.useEffect(() => {
    if (products && products.length > 0 && products[products.length - 1]?.name !== "" && fields.length < maxProducts) {
      append({ name: "", image: undefined, price: "", currency: "XOF", description: "" });
    }
  }, [products, fields.length, append]);

  const productCategories = [
    { value: "mode", label: "Mode" },
    { value: "alimentaire", label: "Alimentaire" },
    { value: "artisanat", label: "Artisanat" },
    { value: "electronique", label: "Électronique" },
    { value: "services", label: "Services" },
    { value: "beaute", label: "Beauté" },
    { value: "maison", label: "Maison & Déco" },
    { value: "autres", label: "Autres" },
  ];

  const currencies = ["XOF", "USD", "EUR", "GBP", "GH"]; // Example currencies

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">📦 Produits</h3>
      <p className="text-center text-muted-foreground">
        Listez vos produits phares (2-3 maximum).
      </p>

      <FormField
        control={control}
        name="productCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catégorie de Produit</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-8">
        <FormLabel>Vos Produits (3 max)</FormLabel>
        {fields.map((item, index) => (
          <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
            {fields.length > 1 && (index < fields.length -1 || (index === fields.length -1 && products[index]?.name === "")) && (
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
            <h4 className="text-lg font-semibold">Produit {index + 1}</h4>
            <FormField
              control={control}
              name={`products.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Produit</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Robe Africaine, Pain au Chocolat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`products.${index}.image`}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image du Produit (optionnel)</FormLabel>
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`products.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`products.${index}.currency`}
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
              name={`products.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brève Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez ce produit en 1-2 phrases."
                      className="resize-y min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        {fields.length < maxProducts && products && products[products.length -1]?.name !== "" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", image: undefined, price: "", currency: "XOF", description: "" })}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        )}
      </div>
    </div>
  );
}