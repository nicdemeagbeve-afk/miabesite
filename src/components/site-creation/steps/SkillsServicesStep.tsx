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

export function SkillsServicesStep() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expertiseDomains",
  });

  const expertiseDomains = watch("expertiseDomains");
  const maxExpertiseDomains = 5;

  // Ensure there's always at least one empty field if the list is empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [fields.length, append]);

  // Add an empty expertise field if the last one is being typed into and it's not the max
  React.useEffect(() => {
    if (expertiseDomains && expertiseDomains.length > 0 && expertiseDomains[expertiseDomains.length - 1]?.value !== "" && fields.length < maxExpertiseDomains) {
      append({ value: "" });
    }
  }, [expertiseDomains, fields.length, append]);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">💼 Compétences et Services</h3>
      <p className="text-center text-muted-foreground">
        Décrivez ce que vous faites et ce que vous offrez.
      </p>

      <FormField
        control={control}
        name="activityTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre Principal de l'Activité</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Développeur Web, Cuisinier Traiteur" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Domaines d'Expertise (5 max)</FormLabel>
        <p className="text-sm text-muted-foreground">
          Ajoutez jusqu'à 5 mots-clés décrivant vos spécialités (ex: #Plomberie, #MarketingDigital).
        </p>
        {fields.map((item, index) => (
          <FormField
            key={item.id}
            control={control}
            name={`expertiseDomains.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder={`Domaine d'expertise ${index + 1}`} {...field} />
                </FormControl>
                {fields.length > 1 && (index < fields.length -1 || (index === fields.length -1 && expertiseDomains[index]?.value === "")) && (
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
        {fields.length < maxExpertiseDomains && expertiseDomains && expertiseDomains[expertiseDomains.length -1]?.value !== "" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ value: "" })}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un domaine
          </Button>
        )}
      </div>

      <FormField
        control={control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description Courte de l'Activité</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez ce que vous faites et la valeur que vous apportez (max 500 caractères)."
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
        name="portfolioLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lien vers vos Réalisations (optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: https://drive.google.com/mon-portfolio" {...field} />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Lien vers un portfolio, Google Drive, ou des photos de vos projets.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}