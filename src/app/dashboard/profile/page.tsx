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
import { User as UserIcon, Upload, Lock, Mail, Phone, Globe, MessageSquare, CalendarIcon, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { PhoneInputWithCountryCode } from "@/components/PhoneInputWithCountryCode"; // Import new component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis.").optional().or(z.literal('')),
  email: z.string().email("Veuillez entrer une adresse email valide.").optional().or(z.literal('')),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, "Veuillez entrer un numéro WhatsApp valide.").optional().or(z.literal('')),
  secondaryPhoneNumber: z.string().regex(/^\+?\d{8,15}$/, "Veuillez entrer un numéro de téléphone valide.").optional().or(z.literal('')),
  dateOfBirth: z.date().optional().nullable(), // Allow null for optional
  newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères.").optional().or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
  profilePicture: z.any().optional(), // File object
  expertise: z.string().min(3, "Le domaine d'expertise est requis.").max(100, "Le domaine d'expertise ne peut pas dépasser 100 caractères.").optional().or(z.literal('')),
}).refine((data) => {
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
  dateOfBirth: null,
  newPassword: "",
  confirmNewPassword: "",
  profilePicture: undefined,
  expertise: "",
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const supportWhatsAppNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER || "+22870832482";

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: emptyDefaultValues,
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
        const userMetadata = currentUser.user_metadata;
        form.reset({
          fullName: userMetadata?.full_name || "",
          email: currentUser.email || "",
          whatsappNumber: userMetadata?.whatsapp_number || "",
          secondaryPhoneNumber: userMetadata?.secondary_phone_number || "",
          dateOfBirth: userMetadata?.date_of_birth ? new Date(userMetadata.date_of_birth) : null,
          newPassword: "",
          confirmNewPassword: "",
          profilePicture: undefined,
          expertise: userMetadata?.expertise || "",
        });
        setAvatarPreview(userMetadata?.avatar_url || null);
      }
      setLoading(false);
    }
    fetchUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user || null);
        const userMetadata = session?.user?.user_metadata;
        form.reset({
          fullName: userMetadata?.full_name || "",
          email: session?.user?.email || "",
          whatsappNumber: userMetadata?.whatsapp_number || "",
          secondaryPhoneNumber: userMetadata?.secondary_phone_number || "",
          dateOfBirth: userMetadata?.date_of_birth ? new Date(userMetadata.date_of_birth) : null,
          newPassword: "",
          confirmNewPassword: "",
          profilePicture: undefined,
          expertise: userMetadata?.expertise || "",
        });
        setAvatarPreview(userMetadata?.avatar_url || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        form.reset(emptyDefaultValues);
        setAvatarPreview(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router, form]);

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
    if (values.expertise !== user.user_metadata?.expertise) updates.expertise = values.expertise;
    if (values.dateOfBirth && values.dateOfBirth.toISOString().split('T')[0] !== user.user_metadata?.date_of_birth) {
      updates.date_of_birth = values.dateOfBirth.toISOString().split('T')[0];
    } else if (values.dateOfBirth === null && user.user_metadata?.date_of_birth) {
      updates.date_of_birth = null; // Clear date of birth if set to null
    }


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
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Chargement du Profil...</p>
      </div>
    );
  }

  const getInitials = (nameOrEmail: string | null) => {
    if (!nameOrEmail) return "U";
    return nameOrEmail.charAt(0).toUpperCase();
  };

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
                    render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<FieldValues, "profilePicture"> }) => (
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
                  name="expertise"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "expertise"> }) => (
                    <FormItem>
                      <FormLabel>Domaine d'expertise / Travail</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Développeur Web, Artisan Plombier" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "dateOfBirth"> }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de naissance</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionnez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
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
                    <PhoneInputWithCountryCode
                      name={field.name}
                      label="Numéro WhatsApp"
                      placeholder="Ex: 07 00 00 00 00"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryPhoneNumber"
                  render={({ field }: { field: ControllerRenderProps<FieldValues, "secondaryPhoneNumber"> }) => (
                    <PhoneInputWithCountryCode
                      name={field.name}
                      label="Numéro Secondaire (Optionnel)"
                      placeholder="Ex: 01 00 00 00 00"
                    />
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
              <Globe className="h-6 w-6" /> Options Avancées
            </CardTitle>
            <CardDescription>Gérez les options avancées de votre compte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Gestion des Sites</h3>
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
            </div>
            <Separator />
            <h3 className="text-xl font-semibold mb-4">Support</h3>
            <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white">
              <a href={`https://wa.me/${supportWhatsAppNumber}`} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-5 w-5" /> Support WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}