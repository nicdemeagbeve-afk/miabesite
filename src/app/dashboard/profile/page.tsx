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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Upload, Lock, Mail, Phone, Globe, DollarSign, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis.").optional().or(z.literal('')),
  email: z.string().email("Veuillez entrer une adresse email valide.").optional().or(z.literal('')),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, "Veuillez entrer un numéro WhatsApp valide.").optional().or(z.literal('')),
  secondaryPhoneNumber: z.string().regex(/^\+?\d{8,15}$/, "Veuillez entrer un numéro de téléphone valide.").optional().or(z.literal('')),
  newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères.").optional().or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
  profilePicture: z.any().optional(), // File object
}).refine((data) => { // Removed explicit type annotation here to break circular reference
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: "Les nouveaux mots de passe ne correspondent pas.",
  path: ["confirmNewPassword"],
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

// Define empty default values once, outside the component
const emptyDefaultValues: ProfileFormData = {
  fullName: "",
  email: "",
  whatsappNumber: "",
  secondaryPhoneNumber: "",
  newPassword: "",
  confirmNewPassword: "",
  profilePicture: undefined,
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: emptyDefaultValues, // Use emptyDefaultValues here
  });

  React.useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        toast.error("Erreur lors du chargement du profil.");
        router.push("/login");
        return;
      }
      if (currentUser) {
        setUser(currentUser);
        form.reset({
          fullName: currentUser.user_metadata?.full_name || "",
          email: currentUser.email || "",
          whatsappNumber: currentUser.user_metadata?.whatsapp_number || "",
          secondaryPhoneNumber: currentUser.user_metadata?.secondary_phone_number || "",
          newPassword: "",
          confirmNewPassword: "",
          profilePicture: undefined,
        });
        setAvatarPreview(currentUser.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    }
    fetchUserProfile();

    // Listen for auth state changes to update profile info
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user || null); // Update user state
        form.reset({ // Reset form with new data
          fullName: session?.user?.user_metadata?.full_name || "",
          email: session?.user?.email || "",
          whatsappNumber: session?.user?.user_metadata?.whatsapp_number || "",
          secondaryPhoneNumber: session?.user?.user_metadata?.secondary_phone_number || "",
          newPassword: "",
          confirmNewPassword: "",
          profilePicture: undefined,
        });
        setAvatarPreview(session?.user?.user_metadata?.avatar_url || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        form.reset(emptyDefaultValues); // Use emptyDefaultValues here
        setAvatarPreview(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router, form]); // Added form to dependency array

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast.error("La photo de profil est trop grande (max 2MB).");
        form.setValue("profilePicture", undefined);
        setAvatarPreview(user?.user_metadata?.avatar_url || null);
        return;
      }
      form.setValue("profilePicture", file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      form.setValue("profilePicture", undefined);
      setAvatarPreview(user?.user_metadata?.avatar_url || null);
    }
  };

  const onSubmit = async (values: ProfileFormData) => {
    if (!user) {
      toast.error("Utilisateur non authentifié.");
      return;
    }

    let avatarUrl = user.user_metadata?.avatar_url || null;

    // 1. Handle profile picture upload
    if (values.profilePicture instanceof File) {
      const file = values.profilePicture;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        toast.error(`Erreur lors du téléchargement de la photo de profil: ${uploadError.message}`);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
      avatarUrl = publicUrlData.publicUrl;
    }

    // 2. Update user metadata
    const updates: { [key: string]: any } = {};
    if (values.fullName !== user.user_metadata?.full_name) updates.full_name = values.fullName;
    if (values.whatsappNumber !== user.user_metadata?.whatsapp_number) updates.whatsapp_number = values.whatsappNumber;
    if (values.secondaryPhoneNumber !== user.user_metadata?.secondary_phone_number) updates.secondary_phone_number = values.secondaryPhoneNumber;
    if (avatarUrl !== user.user_metadata?.avatar_url) updates.avatar_url = avatarUrl;

    if (Object.keys(updates).length > 0) {
      const { error: updateMetadataError } = await supabase.auth.updateUser({
        data: updates,
      });
      if (updateMetadataError) {
        toast.error(`Erreur lors de la mise à jour du profil: ${updateMetadataError.message}`);
        return;
      }
    }

    // 3. Update email
    if (values.email && values.email !== user.email) {
      const { error: updateEmailError } = await supabase.auth.updateUser({
        email: values.email,
      });
      if (updateEmailError) {
        toast.error(`Erreur lors de la mise à jour de l'email: ${updateEmailError.message}`);
        return;
      }
      toast.info("Un email de confirmation a été envoyé à votre nouvelle adresse.");
    }

    // 4. Update password
    if (values.newPassword) {
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      if (updatePasswordError) {
        toast.error(`Erreur lors de la mise à jour du mot de passe: ${updatePasswordError.message}`);
        return;
      }
      toast.success("Mot de passe mis à jour avec succès !");
      form.setValue("newPassword", "");
      form.setValue("confirmNewPassword", "");
    }

    toast.success("Profil mis à jour avec succès !");
    router.refresh(); // Refresh to update any displayed user info
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Chargement du Profil...</h1>
        <p className="text-muted-foreground text-center">Veuillez patienter.</p>
      </div>
    );
  }

  const getInitials = (nameOrEmail: string | null) => {
    if (!nameOrEmail) return "U";
    return nameOrEmail.charAt(0).toUpperCase();
  };

  const plans = [
    {
      name: "Freemium",
      price: "Gratuit",
      features: [
        "2 sites web basiques",
        "Pas de paiement mobile",
        "Assistance WhatsApp",
      ],
      icon: <UserIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Standard",
      price: "1500 F CFA/mois",
      features: [
        "5 sites web (3 premium)",
        "Paiement mobile uniquement",
        "Assistance WhatsApp et Bot",
      ],
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
    {
      name: "Premium",
      price: "2500 F CFA/mois",
      features: [
        "10 sites web (5 premium)",
        "Paiement mobile et international",
        "Assistance 24h/24",
        "Exportation de code (ZIP)",
        "Changement de nom de domaine",
      ],
      icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Mon Profil & Paramètres</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-6 w-6" /> Informations Personnelles
            </CardTitle>
            <CardDescription>Mettez à jour vos informations de compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Avatar className="h-24 w-24">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Profile Picture" />
                    ) : (
                      <AvatarFallback className="text-4xl">
                        {getInitials(user?.user_metadata?.full_name || user?.email)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }: { field: ControllerRenderProps<FieldValues, "profilePicture"> }) => (
                      <FormItem>
                        <FormLabel className="cursor-pointer flex items-center gap-2 text-primary hover:underline">
                          <Upload className="h-4 w-4" /> Changer la photo
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "fullName"> }) => (
                    <FormItem>
                      <FormLabel>Nom Complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "email"> }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" /> Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "whatsappNumber"> }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" /> Numéro WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+225 07 00 00 00 00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryPhoneNumber"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "secondaryPhoneNumber"> }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" /> Numéro Secondaire (Optionnel)
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+225 01 00 00 00 00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5" /> Changer le Mot de Passe
                </h3>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "newPassword"> }) => (
                    <FormItem>
                      <FormLabel>Nouveau Mot de Passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "confirmNewPassword"> }) => (
                    <FormItem>
                      <FormLabel>Confirmer le Nouveau Mot de Passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Mise à jour..." : "Mettre à jour le Profil"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Plans and Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6" /> Plans & Paramètres
            </CardTitle>
            <CardDescription>Gérez votre abonnement et les options avancées.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Vos Plans d'Abonnement</h3>
            <div className="grid gap-4">
              {plans.map((plan, index) => (
                <div key={index} className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {plan.icon}
                    <div>
                      <h4 className="font-bold text-lg">{plan.name}</h4>
                      <p className="text-muted-foreground text-sm">{plan.price}</p>
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex}>{feature}</li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm">
                    Choisir ce plan
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <h3 className="text-xl font-semibold mb-4">Options Avancées</h3>
            <div className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/${user?.user_metadata?.subdomain || 'sites'}/advanced`}>
                  <Globe className="mr-2 h-5 w-5" /> Gérer les domaines personnalisés
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/${user?.user_metadata?.subdomain || 'sites'}/advanced`}>
                  <Upload className="mr-2 h-5 w-5" /> Exporter le code source (ZIP)
                </Link>
              </Button>
              {/* Placeholder for age/domain modification, as these are not directly user profile fields in Supabase auth */}
              <p className="text-sm text-muted-foreground">
                Pour modifier l'âge ou les domaines d'activité, veuillez contacter le support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}