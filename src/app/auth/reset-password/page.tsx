"use client";

import React from "react";
import Link from "next/link";
import { useForm, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Loader2 } from "lucide-react"; // Added import for Loader2

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    // Check if user is already logged in or session is being set
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User is signed in, likely from the password reset link.
        // We can now allow them to update their password.
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        // If somehow signed out, redirect to login
        router.push('/login?message=Veuillez vous connecter pour réinitialiser votre mot de passe.');
      }
    });

    // Initial check if a session already exists (e.g., if user clicked link and is already authenticated)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLoading(false);
      } else {
        // If no session, it means the user needs to be authenticated via the email link first.
        // The callback route should handle the session exchange.
        // We might need a more robust check here to ensure the user came from a reset link.
        // For now, we assume if they land here, the session is being processed or will be.
        setLoading(false); // Allow form to be displayed, but rely on updatePassword to fail if not authenticated
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
    } else {
      toast.success("Votre mot de passe a été mis à jour avec succès ! Redirection vers le tableau de bord...");
      router.push("/dashboard/sites");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Définir un nouveau mot de passe</CardTitle>
          <CardDescription>
            Entrez et confirmez votre nouveau mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof resetPasswordSchema>, "password"> }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
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
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof resetPasswordSchema>, "confirmPassword"> }) => (
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
                {form.formState.isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}