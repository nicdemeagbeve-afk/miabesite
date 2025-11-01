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
import { Loader2, Coins, Send, History, User, Mail, Gift } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const transferCoinsSchema = z.object({
  recipientIdentifier: z.string().min(1, "L'identifiant du destinataire est requis."),
  identifierType: z.enum(['referralCode', 'email']),
  amount: z.coerce.number().int().min(1, "Le montant doit être au moins de 1 pièce."),
  description: z.string().max(200, "La description ne peut pas dépasser 200 caractères.").optional().or(z.literal('')),
});

interface CoinTransaction {
  id: string;
  created_at: string;
  sender_id: string | null;
  recipient_id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  sender_profile?: { full_name: string | null; email: string | null };
  recipient_profile?: { full_name: string | null; email: string | null };
}

export function CoinManagement() {
  const supabase = createClient();
  const [loading, setLoading] = React.useState(true);
  const [transactions, setTransactions] = React.useState<CoinTransaction[]>([]);
  const [isSubmittingTransfer, setIsSubmittingTransfer] = React.useState(false);
  const [currentAdminRole, setCurrentAdminRole] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof transferCoinsSchema>>({
    resolver: zodResolver(transferCoinsSchema),
    defaultValues: {
      recipientIdentifier: "",
      identifierType: "referralCode",
      amount: 0,
      description: "",
    },
  });

  const fetchAdminRole = React.useCallback(async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Veuillez vous connecter pour accéder à cette page.");
      return null;
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      toast.error("Accès refusé. Vous n'avez pas les permissions d'administrateur.");
      return null;
    }
    setCurrentAdminRole(profile.role);
    return profile.role;
  }, [supabase]);

  const fetchTransactions = React.useCallback(async () => {
    setLoading(true);
    try {
      const adminRole = await fetchAdminRole();
      if (!adminRole) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/coin-management/transactions');
      const result = await response.json();

      if (response.ok) {
        setTransactions(result.transactions);
      } else {
        toast.error(result.error || "Erreur lors du chargement des transactions.");
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      toast.error("Impossible de charger l'historique des transactions.");
    } finally {
      setLoading(false);
    }
  }, [fetchAdminRole]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onSubmitTransfer = async (values: z.infer<typeof transferCoinsSchema>) => {
    setIsSubmittingTransfer(true);
    try {
      const response = await fetch('/api/admin/coin-management/transfer-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchTransactions(); // Refresh transactions
        form.reset({
          recipientIdentifier: "",
          identifierType: "referralCode",
          amount: 0,
          description: "",
        });
      } else {
        toast.error(result.error || "Erreur lors du transfert des pièces.");
      }
    } catch (err) {
      console.error("Failed to transfer coins:", err);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const recipientIdentifierType = form.watch("identifierType");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Chargement de la gestion des pièces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Transfert de Pièces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-6 w-6" /> Transférer des Pièces
          </CardTitle>
          <CardDescription>
            Envoyez des pièces à n'importe quel utilisateur. Les administrateurs ont un solde illimité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitTransfer)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifierType"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof transferCoinsSchema>, "identifierType"> }) => (
                  <FormItem>
                    <FormLabel>Type d'Identifiant du Destinataire</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="referralCode">Code de Parrainage</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientIdentifier"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof transferCoinsSchema>, "recipientIdentifier"> }) => (
                  <FormItem>
                    <FormLabel>Identifiant du Destinataire</FormLabel>
                    <FormControl>
                      {recipientIdentifierType === 'referralCode' ? (
                        <InputOTP maxLength={5} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                        </InputOTP>
                      ) : (
                        <Input placeholder="email@example.com" {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof transferCoinsSchema>, "amount"> }) => (
                  <FormItem>
                    <FormLabel>Montant des Pièces</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof transferCoinsSchema>, "description"> }) => (
                  <FormItem>
                    <FormLabel>Description (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Raison du transfert" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmittingTransfer || (recipientIdentifierType === 'referralCode' && form.getValues("recipientIdentifier").length < 5)}>
                {isSubmittingTransfer ? "Transfert en cours..." : "Transférer les Pièces"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Historique des Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-6 w-6" /> Historique des Transactions
          </CardTitle>
          <CardDescription>
            Toutes les transactions de pièces sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Aucune transaction trouvée.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md bg-muted">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold">
                        {tx.transaction_type === 'admin_credit' ? 'Crédit Admin' :
                         tx.transaction_type === 'admin_debit' ? 'Débit Admin' :
                         tx.transaction_type === 'referral_bonus' ? 'Bonus Parrainage' :
                         'Transfert'} : <span className="text-primary">{tx.amount} pièces</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        De: {tx.sender_id ? (tx.sender_profile?.full_name || tx.sender_profile?.email || tx.sender_id) : "Admin"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        À: {tx.recipient_profile?.full_name || tx.recipient_profile?.email || tx.recipient_id}
                      </p>
                      {tx.description && <p className="text-xs text-muted-foreground italic">"{tx.description}"</p>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(tx.created_at), "dd MMM yyyy HH:mm", { locale: fr })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}