"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, Loader2 } from "lucide-react";
import { useForm, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

const verifyCodeSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide."),
  code: z.string().min(6, "Le code doit contenir 6 chiffres.").max(6, "Le code doit contenir 6 chiffres."),
});

export default function VerifyEmailPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = React.useState(30);
  const [isResending, setIsResending] = React.useState(false);
  const [emailFromParams, setEmailFromParams] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  React.useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setEmailFromParams(email);
      form.setValue('email', email);
    }
  }, [searchParams, form]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !isResending) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResending(false); // Allow resend
    }
    return () => clearTimeout(timer);
  }, [countdown, isResending]);

  const handleResendCode = async () => {
    if (!emailFromParams) {
      toast.error("Email non trouvé pour renvoyer le code.");
      return;
    }
    setIsResending(true);
    setCountdown(30); // Reset countdown

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailFromParams,
    });

    if (error) {
      toast.error(`Erreur lors du renvoi du code: ${error.message}`);
      setIsResending(false); // Allow immediate retry if error
    } else {
      toast.success("Un nouveau code a été envoyé à votre adresse email.");
    }
  };

  const onSubmit = async (values: z.infer<typeof verifyCodeSchema>) => {
    const { error } = await supabase.auth.verifyOtp({
      email: values.email,
      token: values.code,
      type: 'email',
    });

    if (error) {
      toast.error(`Code incorrect: ${error.message}`);
      form.setError('code', { message: 'Code incorrect.' });
    } else {
      toast.success("Compte confirmé avec succès ! Redirection vers le tableau de bord...");
      router.push("/dashboard/sites");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <MailCheck className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Confirmez votre email</CardTitle>
          <CardDescription>
            Un code de vérification a été envoyé à <span className="font-semibold text-primary">{emailFromParams || "votre adresse email"}</span>. Veuillez l'entrer ci-dessous.
            Le code expire dans 12 heures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof verifyCodeSchema>, "email"> }) => (
                  <FormItem className="hidden"> {/* Hidden as it's pre-filled from params */}
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof verifyCodeSchema>, "code"> }) => (
                  <FormItem>
                    <FormLabel>Code de vérification</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="XXXXXX"
                        maxLength={6}
                        {...field}
                        className={form.formState.errors.code ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Vérification..." : "Vérifier le code"}
              </Button>
            </form>
          </Form>

          <div className="text-sm text-muted-foreground">
            Vous n'avez pas reçu le code ?{" "}
            <Button
              variant="link"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="p-0 h-auto text-primary"
            >
              {isResending || countdown > 0 ? `Renvoyer dans ${countdown}s` : "Renvoyer le code"}
            </Button>
          </div>
          <Link href="/login" passHref>
            <Button asChild variant="outline" className="w-full mt-4">
              <div>Retour à la connexion</div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}