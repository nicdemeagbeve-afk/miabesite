"use client";

import React from "react";
import { useForm, ControllerRenderProps, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Users, LayoutTemplate, Tag, Lock, Globe } from "lucide-react"; // Added Lock and Globe icons
import Link from "next/link";
import { Switch } from "@/components/ui/switch"; // Import Switch component
import { generateUniqueCommunityJoinCode } from "@/lib/utils"; // Import new utility
import { communityCategories, premiumTemplates } from '@/lib/constants'; // Import centralized constants

const COMMUNITY_UNLOCK_POINTS = 1000;

// Define the schema for community creation form
const communityFormSchema = z.object({
  name: z.string().min(3, "Le nom de la communauté est requis et doit contenir au moins 3 caractères.").max(100, "Le nom ne peut pas dépasser 100 caractères."),
  objectives: z.string().min(20, "Les objectifs sont requis et doivent contenir au moins 20 caractères.").max(500, "Les objectifs ne peuvent pas dépasser 500 caractères."),
  template_1: z.string().min(1, "Veuillez choisir le premier template premium."),
  template_2: z.string().min(1, "Veuillez choisir le deuxième template premium."),
  category: z.string().min(1, "Veuillez choisir une catégorie pour votre communauté."),
  is_public: z.boolean().default(true), // Default to public
}).refine(data => data.template_1 !== data.template_2, {
  message: "Les deux templates choisis doivent être différents.",
  path: ["template_2"],
});

type CommunityFormData = z.infer<typeof communityFormSchema>;

// Filter out the 'all' category for community creation
const creatableCommunityCategories = communityCategories.filter(cat => cat.value !== 'all');

export default function CreateCommunityPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [hasEnoughPoints, setHasEnoughPoints] = React.useState(false);
  const [userCoinPoints, setUserCoinPoints] = React.useState(0);
  const [generatedJoinCode, setGeneratedJoinCode] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null); // New state for user role

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      objectives: "",
      template_1: "",
      template_2: "",
      category: "",
      is_public: true, // Default to public
    },
  });

  const isPublic = form.watch("is_public");

  const fetchUserPointsAndRole = React.useCallback(async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Veuillez vous connecter pour créer une communauté.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch('/api/referral/get-status');
      const result = await response.json();

      if (response.ok) {
        const points = result.coinPoints || 0;
        setUserCoinPoints(points);
        setHasEnoughPoints(points >= COMMUNITY_UNLOCK_POINTS);

        // Fetch user role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error("Error fetching user profile role:", profileError);
          setUserRole(null);
        } else {
          setUserRole(profile.role);
        }

      } else {
        toast.error(result.error || "Erreur lors du chargement de vos points de parrainage.");
      }
    } catch (err) {
      console.error("Failed to fetch referral status:", err);
      toast.error("Impossible de charger vos points de parrainage.");
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  React.useEffect(() => {
    fetchUserPointsAndRole();
  }, [fetchUserPointsAndRole]);

  const onSubmit: SubmitHandler<CommunityFormData> = async (values) => {
    if (!hasEnoughPoints && userRole !== 'super_admin') { // Super admins can bypass point requirement
      toast.error("Vous n'avez pas assez de pièces pour créer une communauté.");
      return;
    }

    let finalJoinCode: string | null = null;
    if (!values.is_public) {
      // Generate join code only if community is private
      try {
        finalJoinCode = await generateUniqueCommunityJoinCode(supabase);
        setGeneratedJoinCode(finalJoinCode); // Store for display after creation
      } catch (codeError: any) {
        console.error("Failed to generate community join code:", codeError);
        toast.error(`Erreur lors de la génération du code de jointure: ${codeError.message}`);
        return;
      }
    }

    try {
      const response = await fetch('/api/community/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, join_code: finalJoinCode }), // Pass join_code to API
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push(`/dashboard/my-communities`); // Redirect to user's communities page
      } else {
        toast.error(result.error || "Erreur lors de la création de la communauté.");
      }
    } catch (err) {
      console.error("Failed to create community:", err);
      toast.error("Une erreur inattendue est survenue lors de la création de la communauté.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Vérification de vos pièces et rôle...</p>
      </div>
    );
  }

  if (!hasEnoughPoints && userRole !== 'super_admin') { // Super admins can bypass point requirement
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Accès Refusé</CardTitle>
            <CardDescription>
              Vous avez besoin de {COMMUNITY_UNLOCK_POINTS} pièces pour créer une communauté.
              Vous avez actuellement {userCoinPoints} pièces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Continuez à parrainer des amis pour gagner plus de pièces !
            </p>
            <Link href="/dashboard/referral" passHref>
              <Button asChild className="w-full">
                <div>Retour au programme de parrainage</div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Créer votre Communauté</h1>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" /> Détails de la Communauté
          </CardTitle>
          <CardDescription>
            Remplissez les informations pour lancer votre nouvelle communauté.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: ControllerRenderProps<CommunityFormData, "name"> }) => (
                  <FormItem>
                    <FormLabel>Nom de la Communauté</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Les Artisans du Web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objectives"
                render={({ field }: { field: ControllerRenderProps<CommunityFormData, "objectives"> }) => (
                  <FormItem>
                    <FormLabel>Objectifs de la Communauté</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez ce que votre communauté vise à accomplir (ex: Partager des connaissances, vendre des produits, etc.)."
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="template_1"
                  render={({ field }: { field: ControllerRenderProps<CommunityFormData, "template_1"> }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><LayoutTemplate className="h-4 w-4" /> Premier Template Premium</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {premiumTemplates.map((template) => (
                            <SelectItem key={template.value} value={template.value}>
                              {template.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="template_2"
                  render={({ field }: { field: ControllerRenderProps<CommunityFormData, "template_2"> }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><LayoutTemplate className="h-4 w-4" /> Deuxième Template Premium</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {premiumTemplates.map((template) => (
                            <SelectItem key={template.value} value={template.value}>
                              {template.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }: { field: ControllerRenderProps<CommunityFormData, "category"> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Tag className="h-4 w-4" /> Catégorie de la Communauté</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {creatableCommunityCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_public"
                render={({ field }: { field: ControllerRenderProps<CommunityFormData, "is_public"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-1">
                        {field.value ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        Communauté Publique
                      </FormLabel>
                      <CardDescription>
                        Si activé, tout le monde peut la voir et la rejoindre. Sinon, un code de jointure sera requis.
                      </CardDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Création en cours..." : "Créer ma Communauté"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}