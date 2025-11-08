"use client";

import React from "react";
import { useForm, FormProvider, SubmitHandler, ControllerRenderProps, FieldValues, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, XCircle, Image as ImageIcon, User, Quote, Briefcase, Globe, DollarSign, CheckCircle, LayoutTemplate, EyeOff, Phone, Mail, Facebook, Instagram, Linkedin, MapPin, Wrench, Star, Hammer, PaintRoller, Palette, PencilRuler, StarHalf } from "lucide-react"; // Added all Lucide icons
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { SiteEditorFormData, siteEditorFormSchema, ProductAndService, Testimonial, Skill } from "@/lib/schemas/site-editor-form-schema"; // Import schema and type, and new types
import Image from "next/image"; // Import Next.js Image component
import { AIRewriteButton } from "@/components/AIRewriteButton"; // Import the new component

interface SiteEditorFormProps {
  initialSiteData: SiteEditorFormData;
  subdomain: string;
  siteId: string;
}

// Utility function to sanitize file names for storage keys
const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return '';
  let sanitized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-.]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  const parts = sanitized.split('.');
  if (parts.length > 1) {
    const extension = parts.pop();
    sanitized = parts.join('-') + '.' + extension;
  }
  return sanitized;
};

const predefinedColors = [
  { value: "red", label: "Rouge" },
  { value: "blue", label: "Bleu" },
  { value: "green", label: "Vert" },
  { value: "yellow", label: "Jaune" },
  { value: "black", label: "Noir" },
  { value: "purple", label: "Violet" },
  { value: "orange", label: "Orange" },
  { value: "gray", label: "Gris" },
];

const currencies = ["XOF", "USD", "EUR", "GBP", "GHS"];
const actionButtons = [
  { value: "buy", label: "Acheter" },
  { value: "quote", label: "Demander un devis" },
  { value: "book", label: "Réserver" },
  { value: "contact", label: "Contacter" },
];

const contactButtonOptions = [
  { value: "whatsapp", label: "WhatsApp (Recommandé)" },
  { value: "emailForm", label: "Formulaire d'e-mail" },
  { value: "phoneNumber", label: "Numéro de Téléphone" },
];

const paymentMethodsOptions = [
  { id: "cash", label: "Cash à la livraison" },
  { id: "mobileMoney", label: "Mobile Money (Orange Money, MoMo, etc.)" },
  { id: "bankTransfer", label: "Virement bancaire" },
  { id: "appPayment", label: "Paiement par l'application (si disponible)" },
];

const deliveryOptions = [
  { value: "local", label: "Local (dans la ville seulement)" },
  { value: "national", label: "National" },
  { value: "international", label: "International" },
  { value: "providerTravel", label: "Déplacement du prestataire (tarif en sus)" },
  { value: "none", label: "Pas de livraison/déplacement" },
];

const skillIcons = [ // Example icons, can be expanded
  { value: "Wrench", label: "Clé à molette" },
  { value: "Hammer", label: "Marteau" },
  { value: "PaintRoller", label: "Rouleau de peinture" },
  { value: "Briefcase", label: "Mallette" },
  { value: "Star", label: "Étoile" },
  { value: "CheckCircle", label: "Coche" },
  { value: "Palette", label: "Palette (Art)" },
  { value: "PencilRuler", label: "Règle et Crayon" },
  { value: "StarHalf", label: "Demi-étoile" },
];

// Helper to get Lucide icon component by name
const getLucideIcon = (iconName: string) => {
  const icons: { [key: string]: React.ElementType } = {
    Wrench, Hammer, PaintRoller, Briefcase, Star, CheckCircle, Palette, PencilRuler, StarHalf
  };
  return icons[iconName] || Wrench; // Default to Wrench if not found
};

export function SiteEditorForm({ initialSiteData, subdomain, siteId }: SiteEditorFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const defaultValues: SiteEditorFormData = {
    ...initialSiteData,
    productsAndServices: initialSiteData.productsAndServices || [],
    testimonials: initialSiteData.testimonials || [],
    skills: initialSiteData.skills || [],
    paymentMethods: initialSiteData.paymentMethods || [],
    sectionsVisibility: initialSiteData.sectionsVisibility || {
      showHero: true,
      showAbout: true,
      showProductsServices: true,
      showTestimonials: true,
      showSkills: true,
      showContact: true,
    },
  };

  const form = useForm<SiteEditorFormData>({
    resolver: zodResolver(siteEditorFormSchema) as any, // CAST TO ANY TO BYPASS TS2719
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = form;

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: control as any,
    name: "skills",
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: control as any,
    name: "productsAndServices",
  });

  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control: control as any,
    name: "testimonials",
  });

  const maxFileSizeMB = 2; // Max 2MB for images

  const handleFileUpload = async (file: File, path: string): Promise<string | null> => {
    if (!file) return null;

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`Le fichier "${file.name}" est trop grand. La taille maximale est de ${maxFileSizeMB}MB.`);
      return null;
    }

    const sanitizedFileName = sanitizeFileName(file.name);
    const filePath = `${subdomain}/${path}/${Date.now()}-${sanitizedFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting if file name is the same
      });

    if (uploadError) {
      toast.error(`Erreur lors du téléchargement de l'image: ${uploadError.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('site-assets').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const onSubmit: SubmitHandler<SiteEditorFormData> = async (data) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Vous devez être connecté pour modifier un site.");
      router.push("/login");
      return;
    }

    let updatedLogoOrPhotoUrl: string | null = initialSiteData.logoOrPhoto || null;
    let updatedHeroBackgroundImageUrl: string | null = initialSiteData.heroBackgroundImage || null;
    const updatedProductImages: { [key: number]: string | null } = {};
    const updatedTestimonialAvatars: { [key: number]: string | null } = {};

    try {
      // Handle logo/photo upload
      if (data.logoOrPhoto instanceof File) {
        updatedLogoOrPhotoUrl = await handleFileUpload(data.logoOrPhoto, 'logo');
        if (updatedLogoOrPhotoUrl === null) throw new Error("Logo upload failed.");
      } else if (typeof data.logoOrPhoto === 'string') {
        updatedLogoOrPhotoUrl = data.logoOrPhoto;
      } else {
        updatedLogoOrPhotoUrl = null; // Clear if no file and not a string
      }

      // Handle hero background image upload
      if (data.heroBackgroundImage instanceof File) {
        updatedHeroBackgroundImageUrl = await handleFileUpload(data.heroBackgroundImage, 'hero');
        if (updatedHeroBackgroundImageUrl === null) throw new Error("Hero background image upload failed.");
      } else if (typeof data.heroBackgroundImage === 'string') {
        updatedHeroBackgroundImageUrl = data.heroBackgroundImage;
      } else {
        updatedHeroBackgroundImageUrl = null; // Clear if no file and not a string
      }

      // Handle product images upload
      for (const [index, product] of data.productsAndServices.entries()) {
        if (product.image instanceof File) {
          updatedProductImages[index] = await handleFileUpload(product.image, `products/${index}`);
          if (updatedProductImages[index] === null) throw new Error(`Product image ${index} upload failed.`);
        } else if (typeof product.image === 'string') {
          updatedProductImages[index] = product.image;
        } else {
          updatedProductImages[index] = null;
        }
      }

      // Handle testimonial avatars upload
      for (const [index, testimonial] of data.testimonials.entries()) {
        if (testimonial.avatar instanceof File) {
          updatedTestimonialAvatars[index] = await handleFileUpload(testimonial.avatar, `testimonials/${index}`);
          if (updatedTestimonialAvatars[index] === null) throw new Error(`Testimonial avatar ${index} upload failed.`);
        } else if (typeof testimonial.avatar === 'string') {
          updatedTestimonialAvatars[index] = testimonial.avatar;
        } else {
          updatedTestimonialAvatars[index] = null;
        }
      }

      // Prepare site_data for Supabase, replacing File objects with URLs
      const siteDataToSave = {
        ...data,
        logoOrPhoto: updatedLogoOrPhotoUrl,
        heroBackgroundImage: updatedHeroBackgroundImageUrl,
        productsAndServices: data.productsAndServices.map((product, index) => ({ // Removed explicit type here
          ...product,
          image: updatedProductImages[index] !== undefined ? updatedProductImages[index] : product.image,
        })),
        testimonials: data.testimonials.map((testimonial, index) => ({ // Removed explicit type here
          ...testimonial,
          avatar: updatedTestimonialAvatars[index] !== undefined ? updatedTestimonialAvatars[index] : testimonial.avatar,
        })),
      };

      // Send data to the new API route
      const response = await fetch(`/api/site/${subdomain}/content-editor`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteDataToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erreur lors de la mise à jour du site.");
        return;
      }

      toast.success("Votre site a été mis à jour avec succès !");
      router.refresh(); // Refresh to show updated data
    } catch (error: any) {
      console.error("Site update error:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Impossible de mettre à jour le site."}`);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Informations de Base & Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Informations Personnelles</CardTitle>
              <CardDescription>Mettez à jour les informations essentielles de votre entreprise et son identité visuelle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="firstName"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "firstName"> }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl><Input placeholder="Ex: Jean" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="lastName"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "lastName"> }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl><Input placeholder="Ex: Dupont" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="expertise"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "expertise"> }) => (
                  <FormItem>
                    <FormLabel>Domaine d'expertise / Travail</FormLabel>
                    <FormControl><Input placeholder="Ex: Développeur Web, Artisan Plombier" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="publicName"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "publicName"> }) => (
                  <FormItem>
                    <FormLabel>Nom Public & Activité</FormLabel>
                    <FormControl><Input placeholder="Ex: Mamadou Couture" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="whatsappNumber"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "whatsappNumber"> }) => (
                  <FormItem>
                    <FormLabel>Numéro WhatsApp</FormLabel>
                    <FormControl><Input type="tel" placeholder="Ex: +225 07 00 00 00 00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="secondaryPhoneNumber"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "secondaryPhoneNumber"> }) => (
                  <FormItem>
                    <FormLabel>Numéro de Téléphone Secondaire (Optionnel)</FormLabel>
                    <FormControl><Input type="tel" placeholder="Ex: +225 01 00 00 00 00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "email"> }) => (
                  <FormItem>
                    <FormLabel>E-mail (Optionnel)</FormLabel>
                    <FormControl><Input type="email" placeholder="votre@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="primaryColor"
                  render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "primaryColor"> }) => (
                    <FormItem>
                      <FormLabel>Couleur Principale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une couleur" /></SelectTrigger></FormControl>
                        <SelectContent>{predefinedColors.map((color) => (<SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="secondaryColor"
                  render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "secondaryColor"> }) => (
                    <FormItem>
                      <FormLabel>Couleur Secondaire</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une couleur" /></SelectTrigger></FormControl>
                        <SelectContent>{predefinedColors.map((color) => (<SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="logoOrPhoto"
                render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<SiteEditorFormData, "logoOrPhoto"> }) => (
                  <FormItem>
                    <FormLabel>Logo ou Photo de Profil (Max {maxFileSizeMB}MB)</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files && event.target.files[0];
                          onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {value && typeof value === 'string' && (
                      <div className="mt-2">
                        <Image src={value} alt="Logo actuel" width={100} height={100} className="rounded-full object-cover" />
                        <p className="text-sm text-muted-foreground">Logo actuel</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="businessLocation"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "businessLocation"> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><MapPin className="h-4 w-4 text-muted-foreground" /> Localisation de l'Entreprise</FormLabel>
                    <FormControl><Input placeholder="Ex: Dakar, Sénégal" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Section Héro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Section Héro</CardTitle>
              <CardDescription>Personnalisez le message d'accueil et l'image de fond de votre site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="heroSlogan"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "heroSlogan"> }) => (
                  <FormItem>
                    <FormLabel>Slogan Accrocheur</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="Ex: Votre partenaire pour une maison impeccable." {...field} />
                        <AIRewriteButton
                          fieldName="heroSlogan"
                          currentText={field.value}
                          onRewrite={(newText) => field.onChange(newText)}
                          subdomain={subdomain}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="aboutStory"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "aboutStory"> }) => (
                  <FormItem>
                    <FormLabel>Mon Histoire / Ma Mission</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Textarea placeholder="Racontez votre parcours, vos valeurs, votre engagement local." className="resize-y min-h-[100px]" {...field} />
                        <AIRewriteButton
                          fieldName="aboutStory"
                          currentText={field.value}
                          onRewrite={(newText) => field.onChange(newText)}
                          subdomain={subdomain}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="heroBackgroundImage"
                render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<SiteEditorFormData, "heroBackgroundImage"> }) => (
                  <FormItem>
                    <FormLabel>Image de Fond du Héro (Max {maxFileSizeMB}MB)</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files && event.target.files[0];
                          onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {value && typeof value === 'string' && (
                      <div className="mt-2">
                        <Image src={value} alt="Image de fond actuelle" width={200} height={100} className="object-cover" />
                        <p className="text-sm text-muted-foreground">Image de fond actuelle</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Compétences / Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Compétences / Expertise</CardTitle>
              <CardDescription>Listez vos compétences ou domaines d'expertise (max 10).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillFields.map((item, index: number) => (
                <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                  <h4 className="text-lg font-semibold">Compétence {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <FormField
                    control={control}
                    name={`skills.${index}.title`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `skills.${number}.title`> }) => (
                      <FormItem>
                        <FormLabel>Titre de la Compétence</FormLabel>
                        <FormControl><Input placeholder="Ex: Plomberie, Développement Web" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`skills.${index}.description`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `skills.${number}.description`> }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Textarea placeholder="Détaillez cette compétence." className="resize-y min-h-[60px]" {...field} />
                            <AIRewriteButton
                              fieldName={`skillDescription-${index}`} // Unique field name for AI context
                              currentText={field.value}
                              onRewrite={(newText) => field.onChange(newText)}
                              subdomain={subdomain}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`skills.${index}.icon`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `skills.${number}.icon`> }) => (
                      <FormItem>
                        <FormLabel>Icône (Nom Lucide React)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une icône" /></SelectTrigger></FormControl>
                          <SelectContent>{skillIcons.map((icon) => (<SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          Ex: Wrench, Hammer, PaintRoller. (Les icônes seront affichées si le template les supporte)
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {skillFields.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendSkill({ title: "", description: "", icon: undefined })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Ajouter une compétence
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Section: Produits & Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Produits & Services</CardTitle>
              <CardDescription>Gérez les produits ou services que vous proposez (max 5).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {productFields.map((item, index: number) => (
                <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                  <h4 className="text-lg font-semibold">Offre {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduct(index)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <FormField
                    control={control}
                    name={`productsAndServices.${index}.title`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `productsAndServices.${number}.title`> }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl><Input placeholder="Ex: Formation Digitale" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`productsAndServices.${index}.price`}
                      render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `productsAndServices.${number}.price`> }) => (
                        <FormItem>
                          <FormLabel>Prix/Tarif</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any" // Allow decimal numbers
                              placeholder="Ex: 5000"
                              {...field}
                              value={field.value === null ? undefined : field.value} // Ensure null becomes undefined
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`productsAndServices.${index}.currency`}
                      render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `productsAndServices.${number}.currency`> }) => (
                        <FormItem>
                          <FormLabel>Devise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une devise" /></SelectTrigger></FormControl>
                            <SelectContent>{currencies.map((currency) => (<SelectItem key={currency} value={currency}>{currency}</SelectItem>))}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name={`productsAndServices.${index}.description`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `productsAndServices.${number}.description`> }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Textarea placeholder="Ce qui est inclus, la durée, les garanties." className="resize-y min-h-[60px]" {...field} />
                            <AIRewriteButton
                              fieldName={`productDescription-${index}`} // Unique field name for AI context
                              currentText={field.value}
                              onRewrite={(newText) => field.onChange(newText)}
                              subdomain={subdomain}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`productsAndServices.${index}.image`}
                    render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<SiteEditorFormData, `productsAndServices.${number}.image`> }) => (
                      <FormItem>
                        <FormLabel>Image (Max {maxFileSizeMB}MB)</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files && event.target.files[0];
                              onChange(file);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {value && typeof value === 'string' && (
                          <div className="mt-2">
                            <Image src={value} alt={`Produit ${index + 1}`} width={100} height={100} className="object-cover" />
                            <p className="text-sm text-muted-foreground">Image actuelle</p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`productsAndServices.${index}.actionButton`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `productsAndServices.${number}.actionButton`> }) => (
                      <FormItem>
                        <FormLabel>Bouton d'Action</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une action" /></SelectTrigger></FormControl>
                          <SelectContent>{actionButtons.map((button) => (<SelectItem key={button.value} value={button.value}>{button.label}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {productFields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendProduct({ title: "", price: undefined, currency: "XOF", description: "", image: undefined, actionButton: "contact" })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Ajouter un produit/service
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Section: Témoignages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Quote className="h-5 w-5" /> Témoignages</CardTitle>
              <CardDescription>Ajoutez les témoignages de vos clients (max 5).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testimonialFields.map((item, index: number) => (
                <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                  <h4 className="text-lg font-semibold">Témoignage {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTestimonial(index)}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <FormField
                    control={control}
                    name={`testimonials.${index}.author`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `testimonials.${number}.author`> }) => (
                      <FormItem>
                        <FormLabel>Auteur</FormLabel>
                        <FormControl><Input placeholder="Ex: Marie Dupont" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`testimonials.${index}.location`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `testimonials.${number}.location`> }) => (
                      <FormItem>
                        <FormLabel>Localisation</FormLabel>
                        <FormControl><Input placeholder="Ex: Abidjan" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`testimonials.${index}.quote`}
                    render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, `testimonials.${number}.quote`> }) => (
                      <FormItem>
                        <FormLabel>Témoignage</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Textarea placeholder="Ce client a dit..." className="resize-y min-h-[80px]" {...field} />
                            <AIRewriteButton
                              fieldName={`testimonialQuote-${index}`} // Unique field name for AI context
                              currentText={field.value}
                              onRewrite={(newText) => field.onChange(newText)}
                              subdomain={subdomain}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`testimonials.${index}.avatar`}
                    render={({ field: { value, onChange, ...fieldProps } }: { field: ControllerRenderProps<SiteEditorFormData, `testimonials.${number}.avatar`> }) => (
                      <FormItem>
                        <FormLabel>Avatar de l'auteur (Max {maxFileSizeMB}MB)</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files && event.target.files[0];
                              onChange(file);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {value && typeof value === 'string' && (
                          <div className="mt-2">
                            <Image src={value} alt={`Avatar ${index + 1}`} width={50} height={50} className="rounded-full object-cover" />
                            <p className="text-sm text-muted-foreground">Avatar actuel</p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {testimonialFields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendTestimonial({ author: "", quote: "", location: "", avatar: undefined })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Ajouter un témoignage
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Section: Réseaux Sociaux & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Réseaux Sociaux & Contact</CardTitle>
              <CardDescription>Configurez vos liens sociaux et les options de contact.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="contactButtonAction"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "contactButtonAction"> }) => (
                  <FormItem>
                    <FormLabel>Action du Bouton "Contact/Commander"</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Diriger vers..." /></SelectTrigger></FormControl>
                      <SelectContent>{contactButtonOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="showContactForm"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "showContactForm"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Afficher un formulaire de contact ?</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Cochez pour inclure un formulaire de contact sur votre site.
                      </p>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="facebookLink"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "facebookLink"> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Facebook className="h-4 w-4 text-muted-foreground" /> Lien Facebook</FormLabel>
                    <FormControl><Input placeholder="https://facebook.com/votrepage" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="instagramLink"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "instagramLink"> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Instagram className="h-4 w-4 text-muted-foreground" /> Lien Instagram</FormLabel>
                    <FormControl><Input placeholder="https://instagram.com/votreprofil" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="linkedinLink"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "linkedinLink"> }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Linkedin className="h-4 w-4 text-muted-foreground" /> Lien LinkedIn</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/votreprofil" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Conditions de Paiement & Livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Conditions de Paiement & Livraison</CardTitle>
              <CardDescription>Définissez vos options de paiement et de livraison.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="paymentMethods"
                render={() => (
                  <FormItem>
                    <FormLabel>Modes de Paiement Acceptés (max 5)</FormLabel>
                    <div className="space-y-2">
                      {paymentMethodsOptions.map((method) => (
                        <FormField
                          key={method.id}
                          control={control}
                          name="paymentMethods"
                          render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "paymentMethods"> }) => {
                            return (
                              <FormItem key={method.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Switch
                                    checked={field.value?.includes(method.id)}
                                    onCheckedChange={(checked: boolean) => {
                                      const currentMethods = field.value || [];
                                      if (checked && currentMethods.length >= 5) {
                                        toast.error("Vous ne pouvez sélectionner que 5 modes de paiement maximum.");
                                        return;
                                      }
                                      return checked
                                        ? field.onChange([...currentMethods, method.id])
                                        : field.onChange(currentMethods.filter((value: string) => value !== method.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{method.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="deliveryOption"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "deliveryOption"> }) => (
                  <FormItem>
                    <FormLabel>Livraison / Déplacement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une option" /></SelectTrigger></FormControl>
                      <SelectContent>{deliveryOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="depositRequired"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "depositRequired"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Acompte requis ?</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Cochez si un acompte est nécessaire pour les commandes/services.
                      </p>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section: Visibilité des Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><EyeOff className="h-5 w-5" /> Visibilité des Sections</CardTitle>
              <CardDescription>Contrôlez quelles sections de votre site sont visibles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={control}
                name="sectionsVisibility.showHero"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "sectionsVisibility.showHero"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Afficher la Section Héro</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="sectionsVisibility.showAbout"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "sectionsVisibility.showAbout"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Afficher la Section "À Propos"</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="sectionsVisibility.showProductsServices"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "sectionsVisibility.showProductsServices"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Afficher la Section "Produits & Services"</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="sectionsVisibility.showTestimonials"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "sectionsVisibility.showTestimonials"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Afficher la Section "Témoignages"</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="sectionsVisibility.showSkills"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "sectionsVisibility.showSkills"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Afficher la Section "Compétences"</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="sectionsVisibility.showContact"
                render={({ field }: { field: ControllerRenderProps<SiteEditorFormData, "sectionsVisibility.showContact"> }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Afficher la Section "Contact"</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder les Modifications"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}