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
import { Check, ChevronsUpDown, PlusCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Added import for toast

const mainDomainCategories = [
  { value: "mode-habillement", label: "Mode & Habillement" },
  { value: "btp-batiment", label: "BTP & Bâtiment" },
  { value: "alimentation-traiteur", label: "Alimentation & Traiteur" },
  { value: "services-tech", label: "Services Tech (Numérique)" },
  { value: "services-domicile", label: "Services à Domicile" },
  { value: "sante-bien-etre", label: "Santé & Bien-être" },
  { value: "transport-logistique", label: "Transport & Logistique" },
  { value: "education-formation", label: "Éducation & Formation" },
  { value: "artisanat-decoration", label: "Artisanat & Décoration" },
  { value: "autre", label: "Autre" },
];

const predefinedTags = [
  { value: "plomberie", label: "#Plomberie" },
  { value: "electricite", label: "#Électricité" },
  { value: "reparation-clim", label: "#RéparationClim" },
  { value: "maconnerie", label: "#Maçonnerie" },
  { value: "peinture", label: "#Peinture" },
  { value: "community-manager", label: "#CommunityManager" },
  { value: "design-graphique", label: "#DesignGraphique" },
  { value: "coding", label: "#Coding" },
  { value: "maintenance-pc", label: "#MaintenancePC" },
  { value: "monteur-video", label: "#MonteurVidéo" },
  { value: "couture", label: "#Couture" },
  { value: "tissage", label: "#Tissage" },
  { value: "bijoux", label: "#Bijoux" },
  { value: "vetements-hommes", label: "#VêtementsHommes" },
  { value: "chaussures", label: "#Chaussures" },
  { value: "traiteur", label: "#Traiteur" },
  { value: "patisserie", label: "#Pâtisserie" },
  { value: "coiffure", label: "#Coiffure" },
  { value: "maquillage", label: "#Maquillage" },
  { value: "massage", label: "#Massage" },
];

export function SkillsServicesStep() {
  const { control, watch, setValue } = useFormContext();
  const selectedTags = watch("expertiseDomains") || [];
  const maxTags = 3;
  const maxPortfolioImages = 3;

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
              <Input placeholder="Ex: Soudure Métallique, Formatrice Excel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="mainDomain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Domaine Principal</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un domaine" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mainDomainCategories.map((category) => (
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

      <FormField
        control={control}
        name="expertiseDomains"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Vos 3 Mots-Clés/Tags (3 max)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length > 0
                      ? (
                          <div className="flex flex-wrap gap-1">
                            {field.value.map((tagValue: string) => {
                              const tag = predefinedTags.find((t) => t.value === tagValue);
                              return tag ? <Badge key={tag.value} variant="secondary">{tag.label}</Badge> : null;
                            })}
                          </div>
                        )
                      : "Sélectionnez des mots-clés..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher un mot-clé..." />
                  <CommandList>
                    <CommandEmpty>Aucun mot-clé trouvé.</CommandEmpty>
                    <CommandGroup>
                      {predefinedTags.map((tag) => (
                        <CommandItem
                          value={tag.label}
                          key={tag.value}
                          onSelect={() => {
                            const currentTags = new Set(field.value);
                            if (currentTags.has(tag.value)) {
                              currentTags.delete(tag.value);
                            } else if (currentTags.size < maxTags) {
                              currentTags.add(tag.value);
                            }
                            field.onChange(Array.from(currentTags));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(tag.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {tag.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Sélectionnez jusqu'à 3 mots-clés décrivant vos spécialités.
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description Courte de l'Activité</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez ce que vous faites et la valeur que vous apportez (max 1000 caractères)."
                className="resize-y min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Résumé concis de votre proposition de valeur.
            </p>
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

      <FormField
        control={control}
        name="portfolioImages"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Photos de Réalisations (3 max, optionnel)</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  if (files.length > maxPortfolioImages) {
                    // Optionally show a toast error here
                    toast.error(`Vous ne pouvez télécharger que ${maxPortfolioImages} images maximum.`);
                    onChange(value); // Keep current value if too many files
                  } else {
                    onChange(files);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Téléchargez jusqu'à 3 photos claires d'un produit phare ou d'un projet terminé.
            </p>
            {value && Array.isArray(value) && value.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {value.map((file: File, index: number) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {file.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-auto w-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const newFiles = value.filter((_: any, i: number) => i !== index);
                        onChange(newFiles);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}