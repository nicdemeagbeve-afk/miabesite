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
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";

export function SkillsStep() {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const skills = watch("skills");
  const maxSkills = 25;

  // Add an empty skill field if the last one is being typed into and it's not the max
  React.useEffect(() => {
    if (skills && skills.length > 0 && skills[skills.length - 1] !== "" && fields.length < maxSkills) {
      append({ value: "" });
    }
  }, [skills, fields.length, append]);

  // Ensure there's always at least one empty field if the list is empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [fields.length, append]);


  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Vos Compétences Clés</h3>
      <p className="text-center text-muted-foreground">
        Ajoutez jusqu'à {maxSkills} compétences qui décrivent le mieux votre activité.
      </p>
      {fields.map((item, index) => (
        <FormField
          key={item.id}
          control={control}
          name={`skills.${index}.value`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="sr-only">Compétence {index + 1}</FormLabel>
              <FormControl>
                <Input placeholder={`Compétence ${index + 1}`} {...field} />
              </FormControl>
              {fields.length > 1 && (index < fields.length -1 || (index === fields.length -1 && skills[index] === "")) && (
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
      {fields.length < maxSkills && skills && skills[skills.length -1] !== "" && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ value: "" })}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une compétence
        </Button>
      )}
    </div>
  );
}