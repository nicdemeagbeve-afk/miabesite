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
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import { useFieldArray } from "react-hook-form";

export function BrandingStep() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "brandingImages",
  });

  const brandingImages = watch("brandingImages");
  const maxImages = 5; // Example limit for branding images

  // Ensure there's always at least one empty file input if the list is empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ file: undefined });
    }
  }, [fields.length, append]);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Valorisation Visuelle & Branding</h3>
      <p className="text-center text-muted-foreground">
        Définissez l'identité de votre marque et ajoutez des éléments visuels.
      </p>

      <FormField
        control={control}
        name="slogan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slogan (optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Votre succès, notre mission." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="brandingDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description de votre marque (optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez l'essence de votre marque, ses valeurs, son positionnement."
                className="resize-y min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="autobiography"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autobiographie / Histoire (optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Racontez votre parcours, l'histoire de votre entreprise ou de votre projet."
                className="resize-y min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Images de Branding (optionnel, max {maxImages})</FormLabel>
        {fields.map((item, index) => (
          <FormField
            key={item.id}
            control={control}
            name={`brandingImages.${index}.file`}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    onChange={(event) => onChange(event.target.files && event.target.files[0])}
                  />
                </FormControl>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {fields.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ file: undefined })}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une image
          </Button>
        )}
      </div>
    </div>
  );
}