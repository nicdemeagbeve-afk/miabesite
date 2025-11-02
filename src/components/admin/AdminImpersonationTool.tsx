"use client";

import React from "react";
import { useForm, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Loader2, KeyRound, Mail, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const impersonationSchema = z.object({
  identifier: z.string().min(1, "L'identifiant est requis."),
  identifierType: z.enum(['email', 'userId']),
});

export function AdminImpersonationTool() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [magicLink, setMagicLink] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof impersonationSchema>>({
    resolver: zodResolver(impersonationSchema),
    defaultValues: {
      identifier: "",
      identifierType: "email",
    },
  });

  const identifierType = form.watch("identifierType");

  const onSubmit = async (values: z.infer<typeof impersonationSchema>) => {
    setIsSubmitting(true);
    setMagicLink(null); // Clear previous link

    try {
      const response = await fetch('/api/admin/manage-admins/generate-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setMagicLink(result.actionLink);
      } else {
        toast.error(result.error || "Erreur lors de la génération du lien magique.");
      }
    } catch (err) {
      console.error("Failed to generate magic link:", err);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMagicLink = () => {
    if (magicLink) {
      window.open(magicLink, '_blank');
      toast.info("Ouverture du lien magique dans un nouvel onglet. Vous serez connecté en tant que cet administrateur.");
      form.reset(); // Reset form after opening link
      setMagicLink(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-6 w-6" /> Accès Rapide Admin
        </CardTitle>
        <CardDescription>
          Générez un lien magique pour vous connecter rapidement en tant qu'un autre administrateur (Super Admin uniquement).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifierType"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof impersonationSchema>, "identifierType"> }) => (
                <FormItem>
                  <FormLabel>Type d'Identifiant</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="userId">ID Utilisateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }: { field: ControllerRenderProps<z.infer<typeof impersonationSchema>, "identifier"> }) => (
                <FormItem>
                  <FormLabel>Identifiant de l'Administrateur Cible</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={identifierType === 'email' ? "admin@example.com" : "UUID de l'utilisateur"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Génération..." : "Générer le lien magique"}
            </Button>
          </form>
        </Form>

        {magicLink && (
          <div className="mt-6 p-4 border rounded-md bg-muted space-y-3">
            <p className="text-sm font-medium">Lien magique généré :</p>
            <Input type="text" value={magicLink} readOnly className="font-mono text-xs" />
            <Button onClick={handleOpenMagicLink} className="w-full">
              Ouvrir le lien magique
            </Button>
            <p className="text-xs text-muted-foreground">
              Cliquez sur ce bouton pour ouvrir le lien dans un nouvel onglet et vous connecter en tant que cet administrateur.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}