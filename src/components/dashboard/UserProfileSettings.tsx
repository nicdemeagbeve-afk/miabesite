"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }).optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

interface UserProfileSettingsProps {
  initialEmail: string;
}

export function UserProfileSettings({ initialEmail }: UserProfileSettingsProps) {
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const { email, password } = values;
    let hasChanges = false;

    // Check if email has changed
    if (email !== initialEmail) {
      hasChanges = true;
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) {
        toast.error(`Erreur lors de la mise à jour de l'email: ${emailError.message}`);
        return;
      }
      toast.success("Email mis à jour avec succès ! Veuillez vérifier votre nouvelle adresse email pour confirmer.");
    }

    // Check if password has changed
    if (password) {
      hasChanges = true;
      const { error: passwordError } = await supabase.auth.updateUser({ password });
      if (passwordError) {
        toast.error(`Erreur lors de la mise à jour du mot de passe: ${passwordError.message}`);
        return;
      }
      toast.success("Mot de passe mis à jour avec succès !");
    }

    if (!hasChanges) {
      toast.info("Aucune modification à enregistrer.");
    } else {
      router.refresh(); // Refresh session and UI
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Mes Informations de Compte</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe (laisser vide si inchangé)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}