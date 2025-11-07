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
import { useRouter } from "next/navigation"; // Import useRouter
import { Loader2, Video, User, PlusCircle, Trash2, Mail, Gift } from "lucide-react";
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

const manageAccessSchema = z.object({
  identifier: z.string().min(1, "L'identifiant est requis."),
  identifierType: z.enum(['referralCode', 'email']),
});

interface UserAccess {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  granted_by_name: string | null;
  created_at: string;
}

export default function AIVideoAccessManagementPage() {
  const supabase = createClient();
  const router = useRouter(); // Initialize useRouter
  const [loading, setLoading] = React.useState(true);
  const [accessList, setAccessList] = React.useState<UserAccess[]>([]);
  const [currentAdminRole, setCurrentAdminRole] = React.useState<string | null>(null);
  const [deletingAccessId, setDeletingAccessId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof manageAccessSchema>>({
    resolver: zodResolver(manageAccessSchema),
    defaultValues: {
      identifier: "",
      identifierType: "email",
    },
  });

  const identifierType = form.watch("identifierType");

  const fetchAccessList = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Veuillez vous connecter pour gérer les accès.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'super_admin') {
        toast.error("Accès refusé. Seuls les Super Admins peuvent gérer l'accès aux vidéos IA.");
        router.push("/admin/overview"); // Redirect if not super admin
        setLoading(false);
        return;
      }
      setCurrentAdminRole(profile.role);

      const { data, error } = await supabase
        .from('ai_video_access')
        .select(`
          id,
          user_id,
          created_at,
          profiles!ai_video_access_user_id_fkey(full_name, email),
          granted_by_profile:granted_by(full_name, email)
        `);

      if (error) {
        console.error("Supabase Error fetching AI video access:", error);
        toast.error("Erreur lors du chargement de la liste d'accès.");
      } else {
        const formattedData: UserAccess[] = data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          full_name: item.profiles?.full_name || null,
          email: item.profiles?.email || null,
          granted_by_name: item.granted_by_profile?.full_name || item.granted_by_profile?.email || null,
          created_at: item.created_at,
        }));
        setAccessList(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch AI video access list:", err);
      toast.error("Impossible de charger la liste d'accès aux vidéos IA.");
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  React.useEffect(() => {
    fetchAccessList();
  }, [fetchAccessList]);

  const handleGrantAccess = async (values: z.infer<typeof manageAccessSchema>) => {
    setIsSubmitting(true);
    try {
      const { data: { user }, error: currentUserError } = await supabase.auth.getUser();
      if (currentUserError || !user) {
        toast.error("Utilisateur non authentifié.");
        setIsSubmitting(false);
        return;
      }

      let targetUserId: string | null = null;

      if (values.identifierType === 'referralCode') {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', values.identifier)
          .single();
        if (error || !profile) {
          toast.error("Utilisateur non trouvé avec ce code de parrainage.");
          setIsSubmitting(false);
          return;
        }
        targetUserId = profile.id;
      } else { // email
        const { data: usersList, error: listUsersError } = await supabase.auth.admin.listUsers({
          perPage: 100,
        });
        if (listUsersError) {
          console.error("Error listing users by admin:", listUsersError);
          toast.error("Erreur lors de la recherche de l'utilisateur par email.");
          setIsSubmitting(false);
          return;
        }
        const targetUser = usersList.users.find(u => u.email === values.identifier);
        if (!targetUser) {
          toast.error("Utilisateur non trouvé avec cet email.");
          setIsSubmitting(false);
          return;
        }
        targetUserId = targetUser.id;
      }

      if (!targetUserId) {
        toast.error("Impossible de déterminer l'utilisateur cible.");
        setIsSubmitting(false);
        return;
      }

      // Check if access already exists
      const { data: existingAccess, error: checkAccessError } = await supabase
        .from('ai_video_access')
        .select('id')
        .eq('user_id', targetUserId)
        .single();

      if (existingAccess) {
        toast.info("Cet utilisateur a déjà accès à la génération de vidéos IA.");
        setIsSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('ai_video_access')
        .insert({ user_id: targetUserId, granted_by: user.id });

      if (insertError) {
        console.error("Supabase Error granting access:", insertError);
        toast.error(insertError.message || "Erreur lors de l'octroi de l'accès.");
      } else {
        toast.success("Accès à la génération vidéo IA accordé avec succès !");
        form.reset();
        fetchAccessList();
      }
    } catch (err) {
      console.error("Failed to grant access:", err);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeAccess = async (accessId: string) => {
    setDeletingAccessId(accessId);
    try {
      const { error } = await supabase
        .from('ai_video_access')
        .delete()
        .eq('id', accessId);

      if (error) {
        console.error("Supabase Error revoking access:", error);
        toast.error(error.message || "Erreur lors de la révocation de l'accès.");
      } else {
        toast.success("Accès à la génération vidéo IA révoqué avec succès !");
        fetchAccessList();
      }
    } catch (err) {
      console.error("Failed to revoke access:", err);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setDeletingAccessId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Chargement de la gestion des accès IA...</p>
      </div>
    );
  }

  if (currentAdminRole !== 'super_admin') {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <Video className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Accès Refusé</CardTitle>
            <CardDescription>
              Seuls les Super Admins peuvent gérer l'accès à la génération de vidéos IA.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Gestion des Accès Vidéos IA</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accorder l'accès */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-6 w-6" /> Accorder l'accès
            </CardTitle>
            <CardDescription>
              Donnez à un utilisateur la permission de générer des vidéos IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGrantAccess)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifierType"
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof manageAccessSchema>, "identifierType"> }) => (
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
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof manageAccessSchema>, "identifier"> }) => (
                    <FormItem>
                      <FormLabel>Identifiant de l'Utilisateur</FormLabel>
                      <FormControl>
                        {identifierType === 'referralCode' ? (
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
                <Button type="submit" className="w-full" disabled={isSubmitting || (identifierType === 'referralCode' && form.getValues("identifier").length < 5)}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                  {isSubmitting ? "Octroi en cours..." : "Accorder l'accès"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Liste des accès actuels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" /> Utilisateurs avec accès
            </CardTitle>
            <CardDescription>
              Liste des utilisateurs autorisés à générer des vidéos IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessList.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Aucun utilisateur n'a d'accès pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {accessList.map((access) => (
                  <div key={access.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md bg-muted">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">{access.full_name || access.email || access.user_id}</p>
                        <p className="text-sm text-muted-foreground">Accordé par: {access.granted_by_name || 'Admin inconnu'}</p>
                        <p className="text-xs text-muted-foreground">Le: {new Date(access.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={deletingAccessId === access.id}>
                          {deletingAccessId === access.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action révoquera l'accès de cet utilisateur à la génération de vidéos IA.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRevokeAccess(access.id)}>
                            Révoquer l'accès
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}