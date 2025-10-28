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

export function SubdomainStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">🌐 Choisis ton adresse web</h3>
      <p className="text-center text-muted-foreground">
        Crée une adresse unique pour ton site. Elle se terminera par <span className="font-semibold">.miabesite.site</span>.
      </p>

      <FormField
        control={control}
        name="subdomain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ton sous-domaine</FormLabel>
            <div className="flex items-center">
              <FormControl>
                <Input placeholder="monentreprise" {...field} className="rounded-r-none" />
              </FormControl>
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-muted text-muted-foreground text-sm h-10">
                .miabesite.site
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}