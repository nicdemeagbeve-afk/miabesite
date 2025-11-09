"use client";

import React from "react";
import { useFormContext, useFieldArray, ControllerRenderProps, FieldValues } from "react-hook-form";
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
import { PlusCircle, XCircle, Wrench, Hammer, PaintRoller, Briefcase, Star, CheckCircle, Palette, PencilRuler, StarHalf } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AIRewriteButton } from "@/components/AIRewriteButton"; // Import the new component

const skillIcons = [
  { value: "Wrench", label: "Clé à molette" },
  { value: "Hammer", label: "Marteau" },
  { value: "PaintRoller", label: "Rouleau de peinture" },
  { value: "Briefcase", label: "Mallette" },
  { value: "Star", label: "Étoile" },
  { value: "CheckCircle", label: "Coche" },
  { value: "Palette", label: "Palette (Art)" },
  { value: "PencilRuler", label: "Règle et Crayon" },
  { value: "StarHalf", label: "Demi-étoile" },
  // Add more icons as needed
];

// Helper to get Lucide icon component by name
const getLucideIcon = (iconName: string) => {
  const icons: { [key: string]: React.ElementType } = {
    Wrench, Hammer, PaintRoller, Briefcase, Star, CheckCircle, Palette, PencilRuler, StarHalf
  };
  return icons[iconName] || Wrench; // Default to Wrench if not found
};

export function SkillsStep() {
  const { control, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const templateType = watch('templateType'); // Watch the templateType
  const maxSkills = 10;

  // Add an empty skill field if the list is empty
  React.useEffect(() => {
    if (fields.length === 0) {
      append({ title: "", description: "", icon: undefined });
    }
  }, [fields.length, append]);

  // Add an empty skill field if the last one is being typed into and it's not the max
  React.useEffect(() => {
    const lastSkill = watch(`skills.${fields.length - 1}`);
    if (fields.length > 0 && fields.length < maxSkills && lastSkill?.title !== "") {
      append({ title: "", description: "", icon: undefined });
    }
  }, [fields, watch, append, maxSkills]);

  const isEcommerceTemplate = templateType === 'ecommerce' || templateType === 'artisan-ecommerce';
  const isPortfolioTemplate = templateType === 'service-portfolio' || templateType === 'professional-portfolio';

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Wrench className="h-6 w-6 text-primary" /> Compétences / Expertise
      </h3>
      <p className="text-center text-muted-foreground">
        {isPortfolioTemplate
          ? "Mettez en avant vos domaines d'expertise et votre savoir-faire (10 maximum)."
          : isEcommerceTemplate
            ? "Listez vos compétences secondaires ou les services associés à vos produits (optionnel, 10 maximum)."
            : "Mettez en avant vos domaines d'expertise (10 maximum)."}
      </p>

      <div className="space-y-8">
        {fields.map((item: Record<string, any>, index: number) => (
          <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
            {fields.length > 1 && (index < fields.length -1 || (index === fields.length -1 && watch(`skills.${index}.title`) === "")) && (
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
            <h5 className="text-lg font-semibold">Compétence {index + 1}</h5>
            <FormField
              control={control}
              name={`skills.${index}.title`}
              render={({ field }: { field: ControllerRenderProps<FieldValues, `skills.${number}.title`> }) => (
                <FormItem>
                  <FormLabel>Titre de la Compétence</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Plomberie, Développement Web" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`skills.${index}.description`}
              render={({ field }: { field: ControllerRenderProps<FieldValues, `skills.${number}.description`> }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        placeholder="Expliquez brièvement ce que cette compétence implique."
                        className="resize-y min-h-[60px]"
                        {...field}
                      />
                      <AIRewriteButton
                        fieldName={`skillDescription-${index}`} // Unique field name for AI context
                        currentText={field.value}
                        onRewrite={(newText) => setValue(`skills.${index}.description`, newText, { shouldValidate: true })}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`skills.${index}.icon`}
              render={({ field }: { field: ControllerRenderProps<FieldValues, `skills.${number}.icon`> }) => (
                <FormItem>
                  <FormLabel>Icône (Nom Lucide React)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une icône" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillIcons.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <span className="flex items-center gap-2">
                            {React.createElement(getLucideIcon(icon.value), { className: "h-4 w-4" })}
                            {icon.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Choisissez une icône pour illustrer cette compétence.
                  </p>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}