"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import Link from "next/link";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <MailCheck className="h-16 w-16 text-primary mx-auto mb-4" />
        <CardTitle className="text-2xl">Vérifiez votre boîte de réception</CardTitle>
        <CardDescription>
          Nous avons envoyé un lien de confirmation à <strong>{email || "votre adresse e-mail"}</strong>.
          Veuillez cliquer sur le lien pour activer votre compte et être redirigé vers le tableau de bord.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Si vous ne recevez pas l'e-mail dans quelques minutes, vérifiez votre dossier de spam.
        </p>
        <Link href="/login" passHref>
          <Button className="w-full" variant="outline">Retour à la connexion</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Suspense fallback={<div>Chargement...</div>}>
        <CheckEmailContent />
      </Suspense>
    </div>
  );
}