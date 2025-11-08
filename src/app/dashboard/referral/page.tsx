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
import { useRouter } from "next/navigation";
import { Gift, Users, Coins, Copy, Loader2, CheckCircle2, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link"; // Import Link

// Schemas for forms
const applyCodeSchema = z.object({
  referrerCode: z.string().length(6, "Le code doit contenir 6 caractères."),
});

const transferCoinsSchema = z.object({
  recipientCode: z.string().length(6, "Le code du destinataire doit contenir 6 caractères."),
  amount: z.coerce.number().int().min(1, "Le montant doit être au moins de 1 point."),
});

const COMMUNITY_UNLOCK_POINTS = 1000; // Define the unlock threshold

export default function ReferralPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [referralStatus, setReferralStatus] = React.useState<{
    referralCode: string | null;
    referralCount: number;
    coinPoints: number;
    referredBy: { fullName: string | null; referralCode: string | null } | null;
  } | null>(null);

  const applyCodeForm = useForm<z.infer<typeof applyCodeSchema>>({
    resolver: zodResolver(applyCodeSchema),
    defaultValues: { referrerCode: "" },
  });

  const transferCoinsForm = useForm<z.infer<typeof transferCoinsSchema>>({
    resolver: zodResolver(transferCoinsSchema),
    defaultValues: { recipientCode: "", amount: 0 },
  });

  const fetchReferralStatus = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      toast.error("Veuillez vous connecter pour accéder à cette page.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch('/api/referral/get-status');
      const result = await response.json();

      if (response.ok) {
        setReferralStatus(result);
      } else {
        toast.error(result.error || "Erreur lors du chargement du statut de parrainage.");
      }
    } catch (err) {
      console.error("Failed to fetch referral status:", err);
      toast.error("Impossible de charger le statut de parrainage.");
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  React.useEffect(() => {
    fetchReferralStatus();
  }, [fetchReferralStatus]);

  const handleCopyCode = () => {
    if (referralStatus?.referralCode) {
      navigator.clipboard.writeText(referralStatus.referralCode);
      toast.success("Code de parrainage copié !");
    }
  };

  const onSubmitApplyCode = async (values: z.infer<typeof applyCodeSchema>) => {
    const { referrerCode } = values;
    try {
      const response = await fetch('/api/referral/apply-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrerCode }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        if (result.awardedPoints > 0) {
          toast.info(`Félicitations ! Votre parrain a reçu ${result.awardedPoints} points.`);
        }
        fetchReferralStatus(); // Refresh status
        applyCodeForm.reset();
      } else {
        toast.error(result.error || "Erreur lors de l'application du code.");
      }
    } catch (err) {
      console.error("Failed to apply referral code:", err);
      toast.error("Une erreur inattendue est survenue.");
    }
  };

  const onSubmitTransferCoins = async (values: z.infer<typeof transferCoinsSchema>) => {
    const { recipientCode, amount } = values;
    try {
      const response = await fetch('/api/referral/transfer-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientCode, amount }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchReferralStatus(); // Refresh status
        transferCoinsForm.reset();
      } else {
        toast.error(result.error || "Erreur lors du transfert des points.");
      }
    } catch (err) {
      console.error("Failed to transfer coins:", err);
      toast.error("Une erreur inattendue est survenue.");
    }
  };

  const hasEnoughPointsForCommunity = (referralStatus?.coinPoints || 0) >= COMMUNITY_UNLOCK_POINTS;

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Chargement du programme de parrainage...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Programme de Parrainage</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Mon Statut de Parrainage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-6 w-6" /> Mon Statut de Parrainage
            </CardTitle>
            <CardDescription>
              Gérez votre code de parrainage et suivez vos récompenses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-2">Votre Code de Parrainage :</p>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={referralStatus?.referralCode || "Chargement..."}
                  readOnly
                  className="flex-1 bg-muted text-muted-foreground font-mono text-lg tracking-widest"
                />
                <Button variant="outline" size="icon" onClick={handleCopyCode} disabled={!referralStatus?.referralCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Partagez ce code avec vos amis pour qu'ils vous parrainent !
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-lg font-semibold">Amis Parrainés :</p>
                  <p className="text-2xl font-bold">{referralStatus?.referralCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Coins className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-lg font-semibold">Vos Pièces :</p>
                  <p className="text-2xl font-bold">{referralStatus?.coinPoints}</p>
                </div>
              </div>
            </div>

            {referralStatus?.referredBy && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-md">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold">Vous avez été parrainé par :</p>
                  <p className="text-sm text-muted-foreground">
                    {referralStatus.referredBy.fullName || "Un utilisateur"} (Code: {referralStatus.referredBy.referralCode})
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Community Creation Section */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Créer votre Communauté</h3>
              {hasEnoughPointsForCommunity ? (
                <>
                  <p className="text-muted-foreground mb-4">
                    Félicitations ! Vous avez {referralStatus?.coinPoints} pièces. Vous pouvez maintenant créer votre propre communauté.
                  </p>
                  <Link href="/dashboard/community/create" passHref>
                    <Button asChild className="w-full">
                      <div>
                        <PlusCircle className="mr-2 h-5 w-5" /> Créer ma communauté
                      </div>
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Accumulez {COMMUNITY_UNLOCK_POINTS} pièces pour débloquer la création de votre communauté. Vous avez actuellement {referralStatus?.coinPoints} pièces.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appliquer un Code de Parrainage / Transférer des Pièces */}
        <div className="space-y-8">
          {/* Appliquer un Code de Parrainage */}
          {!referralStatus?.referredBy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6" /> Appliquer un Code de Parrainage
                </CardTitle>
                <CardDescription>
                  Entrez le code de parrainage d'un ami pour le lier à votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...applyCodeForm}>
                  <form onSubmit={applyCodeForm.handleSubmit(onSubmitApplyCode)} className="space-y-4">
                    <FormField
                      control={applyCodeForm.control}
                      name="referrerCode"
                      render={({ field }: { field: ControllerRenderProps<z.infer<typeof applyCodeSchema>, "referrerCode"> }) => (
                        <FormItem>
                          <FormLabel>Code de Parrainage</FormLabel>
                          <FormControl>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={applyCodeForm.formState.isSubmitting || applyCodeForm.getValues("referrerCode").length < 6}>
                      {applyCodeForm.formState.isSubmitting ? "Application..." : "Appliquer le code"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Transférer des Pièces */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-6 w-6" /> Transférer des Pièces
              </CardTitle>
              <CardDescription>
                Envoyez vos pièces à un autre utilisateur via son code de parrainage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...transferCoinsForm}>
                <form onSubmit={transferCoinsForm.handleSubmit(onSubmitTransferCoins)} className="space-y-4">
                  <FormField
                    control={transferCoinsForm.control}
                    name="recipientCode"
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof transferCoinsSchema>, "recipientCode"> }) => (
                      <FormItem>
                        <FormLabel>Code de Parrainage du Destinataire</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={transferCoinsForm.control}
                    name="amount"
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof transferCoinsSchema>, "amount"> }) => (
                      <FormItem>
                        <FormLabel>Montant des Pièces à Transférer</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={transferCoinsForm.formState.isSubmitting || transferCoinsForm.getValues("recipientCode").length < 6 || transferCoinsForm.getValues("amount") <= 0 || transferCoinsForm.getValues("amount") > (referralStatus?.coinPoints || 0)}>
                    {transferCoinsForm.formState.isSubmitting ? "Transfert en cours..." : "Transférer les pièces"}
                  </Button>
                </form>
              </Form>
              <p className="text-sm text-muted-foreground mt-4">
                Vous avez actuellement <span className="font-semibold">{referralStatus?.coinPoints}</span> pièces.
              </p>
              <p className="text-sm text-red-500 mt-2">
                Le retrait des pièces contre de l'argent sera disponible dans 6 mois.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}