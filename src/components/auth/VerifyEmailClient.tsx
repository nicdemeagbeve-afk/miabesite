"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || code.length < 6) return;

    setIsSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Vérification réussie ! Vous allez être redirigé.");
      router.push('/dashboard');
    }
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    setCanResend(false);
    setResendCooldown(30);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Un nouveau code a été envoyé.");
    }
  };

  if (!email) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aucune adresse e-mail fournie. Veuillez retourner à la page d'inscription.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Vérifiez votre compte</CardTitle>
        <CardDescription>
          Un e-mail de vérification a été envoyé à <strong>{email}</strong>.
          Veuillez entrer le code à 6 chiffres ci-dessous pour activer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={(value: string) => setCode(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || code.length < 6}>
            {isSubmitting ? "Vérification..." : "Vérifier"}
          </Button>
        </form>
        <div className="text-center mt-4">
            <Button onClick={handleResend} disabled={!canResend} variant="link" className="text-sm">
            {canResend ? 'Renvoyer le code' : `Renvoyer dans ${resendCooldown}s`}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}