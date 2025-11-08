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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const addCommunityAdminSchema = z.object({
  identifier: z.string().min(1, "L'identifiant est requis."),
  identifierType: z.enum(['referralCode', 'email']),
}).refine(data => {
  if (data.identifierType === 'referralCode' && data.identifier && data.identifier.length !== 6) {
    return false;
  }
  return true;
}, {
  message: "Le code de parrainage doit contenir 6 caractères.",
  path: ["identifier"],
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
  const [isSubmittingAdd, setIsSubmittingAdd] = React.useState(false);

  const form = useForm<z.infer<typeof addCommunityAdminSchema>>({
    resolver: zodResolver(addCommunityAdminSchema),
    defaultValues: { identifier: "", identifierType: "email" },
  });

  const identifierType = form.watch("identifierType");

  const fetchAdmins = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User not authenticated for admin management:", userError);
        toast.error("Veuillez vous connecter pour gérer les administrateurs.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'super_admin') { // Only super_admin can access this page
        console.error("Admin role check failed:", profileError);
        toast.error("Accès refusé. Seuls les Super Admins peuvent gérer les administrateurs.");
        return;
      }
      setCurrentAdminRole(profile.role);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, referral_code')
        .or('role.eq.community_admin,role.eq.super_admin'); // Fetch community_admins and super_admins

      if (error) {
        console.error("Supabase Error fetching admins:", error);
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

  const onSubmitAddCommunityAdmin = async (values: z.infer<typeof addCommunityAdminSchema>) => {
    setIsSubmittingAdd(true);
    try {
      const response = await fetch('/api/admin/manage-admins/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: values.identifier, type: values.identifierType, newRole: 'community_admin' }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchAdmins(); // Refresh the list
        form.reset();
      } else {
        console.error("API Error adding community admin:", result.error);
        toast.error(result.error || "Erreur lors de l'ajout de l'administrateur de communauté.");
      }
    } catch (err) {
      console.error("Failed to add community admin:", err);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
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
        console.error("API Error removing admin:", result.error);
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

  if (currentAdminRole !== 'super_admin') {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Accès Refusé</CardTitle>
            <CardDescription>
              Seuls les Super Admins peuvent gérer les administrateurs.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Ajouter un Administrateur de Communauté */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6" /> Ajouter un Administrateur de Communauté
          </CardTitle>
          <CardDescription>
            Entrez l'identifiant d'un utilisateur pour lui attribuer le rôle d'administrateur de communauté.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAddCommunityAdmin)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifierType"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof addCommunityAdminSchema>, "identifierType"> }) => (
                  <FormItem>
                    <FormLabel>Type d'Identifiant de l'Utilisateur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="referralCode">Code de Parrainage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof addCommunityAdminSchema>, "identifier"> }) => (
                  <FormItem>
                    <FormLabel>Identifiant de l'Utilisateur</FormLabel>
                    <FormControl>
                      {identifierType === 'referralCode' ? (
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
                      ) : (
                        <Input placeholder="email@example.com" {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmittingAdd || (identifierType === 'referralCode' && form.getValues("identifier").length < 6)}>
                {isSubmittingAdd ? "Ajout en cours..." : "Ajouter comme Admin de Communauté"}
              </Button>
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
            Liste de tous les utilisateurs ayant un rôle d'administrateur de communauté ou de super-administrateur.
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
                      <p className="text-sm text-muted-foreground">Rôle: {admin.role === 'super_admin' ? 'Super Admin' : 'Admin de Communauté'}</p>
                      {admin.referral_code && <p className="text-xs text-muted-foreground">Code: {admin.referral_code}</p>}
                    </div>
                  </div>
                  {currentAdminRole === 'super_admin' && admin.role !== 'super_admin' && ( // Super admin can remove community admins
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