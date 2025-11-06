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
import { Loader2, ShieldCheck, User, PlusCircle, Trash2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

const addAdminSchema = z.object({
  referralCode: z.string().length(5, "Le code de parrainage doit contenir 5 chiffres."),
});

interface AdminProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  referral_code: string | null;
}

export function ManageAdmins() {
  const supabase = createClient();
  const [loading, setLoading] = React.useState(true);
  const [admins, setAdmins] = React.useState<AdminProfile[]>([]);
  const [currentAdminRole, setCurrentAdminRole] = React.useState<string | null>(null);
  const [deletingAdminId, setDeletingAdminId] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof addAdminSchema>>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { referralCode: "" },
  });

  const fetchAdmins = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User not authenticated for admin management:", userError); // Added log
        toast.error("Veuillez vous connecter pour gérer les administrateurs.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
        console.error("Admin role check failed:", profileError); // Added log
        toast.error("Accès refusé. Vous n'avez pas les permissions d'administrateur.");
        return;
      }
      setCurrentAdminRole(profile.role);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, referral_code')
        .or('role.eq.admin,role.eq.super_admin');

      if (error) {
        console.error("Supabase Error fetching admins:", error); // Added log
        toast.error("Erreur lors du chargement des administrateurs.");
      } else {
        setAdmins(data as AdminProfile[]);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      toast.error("Impossible de charger la liste des administrateurs.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const onSubmitAddAdmin = async (values: z.infer<typeof addAdminSchema>) => {
    if (currentAdminRole !== 'super_admin') {
      toast.error("Seuls les Super Admins peuvent ajouter de nouveaux administrateurs.");
      return;
    }

    const { referralCode } = values;
    try {
      const response = await fetch('/api/admin/manage-admins/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: referralCode, type: 'referralCode', newRole: 'admin' }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchAdmins(); // Refresh the list
        form.reset();
      } else {
        console.error("API Error adding admin:", result.error); // Added log
        toast.error(result.error || "Erreur lors de l'ajout de l'administrateur.");
      }
    } catch (err) {
      console.error("Failed to add admin:", err);
      toast.error("Une erreur inattendue est survenue.");
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (currentAdminRole !== 'super_admin') {
      toast.error("Seuls les Super Admins peuvent supprimer des administrateurs.");
      return;
    }
    setDeletingAdminId(adminId);
    try {
      const response = await fetch('/api/admin/manage-admins/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: adminId, type: 'userId', newRole: 'user' }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchAdmins(); // Refresh the list
      } else {
        console.error("API Error removing admin:", result.error); // Added log
        toast.error(result.error || "Erreur lors de la suppression de l'administrateur.");
      }
    } catch (err) {
      console.error("Failed to remove admin:", err);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setDeletingAdminId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Chargement des administrateurs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Ajouter un Administrateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6" /> Ajouter un Administrateur
          </CardTitle>
          <CardDescription>
            Entrez le code de parrainage d'un utilisateur pour lui attribuer le rôle d'administrateur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAddAdmin)} className="space-y-4">
              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof addAdminSchema>, "referralCode"> }) => (
                  <FormItem>
                    <FormLabel>Code de Parrainage de l'Utilisateur</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={5} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || form.getValues("referralCode").length < 5 || currentAdminRole !== 'super_admin'}>
                {form.formState.isSubmitting ? "Ajout en cours..." : "Ajouter comme Admin"}
              </Button>
              {currentAdminRole !== 'super_admin' && (
                <p className="text-sm text-red-500 mt-2">Seuls les Super Admins peuvent ajouter de nouveaux administrateurs.</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Liste des Administrateurs Actuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" /> Administrateurs Actuels
          </CardTitle>
          <CardDescription>
            Liste de tous les utilisateurs ayant un rôle d'administrateur ou de super-administrateur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Aucun administrateur trouvé.</p>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md bg-muted">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{admin.full_name || admin.email}</p>
                      <p className="text-sm text-muted-foreground">Rôle: {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
                      {admin.referral_code && <p className="text-xs text-muted-foreground">Code: {admin.referral_code}</p>}
                    </div>
                  </div>
                  {currentAdminRole === 'super_admin' && admin.role !== 'super_admin' && ( // Super admin can remove regular admins
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={deletingAdminId === admin.id}>
                          {deletingAdminId === admin.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action rétrogradera {admin.full_name || admin.email} au rôle d'utilisateur standard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveAdmin(admin.id)}>
                            Confirmer la suppression
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {currentAdminRole === 'super_admin' && admin.role === 'super_admin' && (
                    <span className="text-sm text-muted-foreground">Super Admin</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}