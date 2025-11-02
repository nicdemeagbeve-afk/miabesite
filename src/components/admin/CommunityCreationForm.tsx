"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CommunityCreationSchema, CommunityCreationFormData } from '@/lib/schemas/community-schema';

export function CommunityCreationForm() {
  const form = useForm<CommunityCreationFormData>({
    resolver: zodResolver(CommunityCreationSchema),
    defaultValues: {
      name: '',
      description: '',
      utility: '',
      positioningDomain: '',
    },
  });

  const onSubmit = async (data: CommunityCreationFormData) => {
    toast.info("Création de la communauté en cours...");
    try {
      const response = await fetch('/api/admin/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création de la communauté.');
      }

      const result = await response.json();
      toast.success(result.message || "Communauté créée avec succès !");
      form.reset(); // Réinitialiser le formulaire après succès
    } catch (error: any) {
      console.error("Erreur lors de la création de la communauté:", error);
      toast.error(error.message || "Une erreur est survenue lors de la création de la communauté.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la Communauté</FormLabel>
              <FormControl>
                <Input placeholder="Nom unique de la communauté" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Décrivez l'objectif de la communauté" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="utility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Utilité</FormLabel>
              <FormControl>
                <Input placeholder="À quoi sert cette communauté ?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="positioningDomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domaine de Positionnement</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Développement Web, Bien-être, Marketing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Création..." : "Créer la Communauté"}
        </Button>
      </form>
    </Form>
  );
}
