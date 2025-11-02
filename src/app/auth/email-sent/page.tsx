"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck, Terminal } from "lucide-react";
import Link from "next/link";

// Schéma de validation pour le code OTP
const OTPSchema = z.object({
  pin: z.string().min(6, {
    message: "Votre code doit contenir 6 caractères.",
  }),
});

// Le composant principal qui utilise les hooks
function EmailSentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { pin: "" },
  });

  // Gère la soumission du formulaire
  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Adresse e-mail manquante. Veuillez réessayer de vous inscrire.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: data.pin,
      type: 'signup',
    });

    if (error) {
      setError("Code invalide ou expiré. Veuillez réessayer.");
    } else {
      router.push("/dashboard"); // Redirection en cas de succès
    }
    setIsLoading(false);
  };

  // Gère le renvoi du code
  const handleResendCode = async () => {
    if (!email) {
      setError("Adresse e-mail manquante pour renvoyer le code.");
      return;
    }
    setResendMessage(null);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      setError(error.message);
    } else {
      setResendMessage("Un nouveau code a été envoyé.");
    }
  };

  if (!email) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Erreur</CardTitle>
          <CardDescription>Aucune adresse e-mail n'a été fournie.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/signup" passHref>
            <Button className="w-full">Retour à l'inscription</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <MailCheck className="h-16 w-16 text-primary mx-auto mb-4" />
        <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
        <CardDescription>
          Nous avons envoyé un code à <strong>{email}</strong>. Saisissez-le ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code de vérification</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="w-full justify-center">
                        {[...Array(6)].map((_, index) => <InputOTPSlot key={index} index={index} />)}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Vérification..." : "Vérifier le compte"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas reçu de code ?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={handleResendCode}>
            Renvoyer
          </Button>
        </div>
        {resendMessage && <p className="mt-2 text-center text-sm text-green-600">{resendMessage}</p>}
      </CardContent>
    </Card>
  );
}

// Le composant exporté qui enveloppe le contenu dans Suspense
export default function EmailSentPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Suspense fallback={<div>Chargement...</div>}>
        <EmailSentContent />
      </Suspense>
    </div>
  );
}