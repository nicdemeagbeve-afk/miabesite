"use client";

import React from "react";
import { useForm, FormProvider, SubmitHandler, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form"; // Import Form component
import { WizardProgress } from "./WizardProgress";
import { WizardNavigation } from "./WizardNavigation";
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { useRouter } from "next/navigation"; // Import useRouter

// Import new step components
import { EssentialDesignStep } from "./steps/EssentialDesignStep";
import { ContentStep } from "./steps/ContentStep";
import { ProductsServicesStep } from "./steps/ProductsServicesStep"; // New step import
import { ConfigurationNetworkStep } from "./steps/ConfigurationNetworkStep";

// Define the base schema as a ZodObject
const baseWizardFormSchema = z.object({
  // Étape 1: Infos Essentielles & Design
  publicName: z.string().min(3, { message: "Le nom public est requis et doit contenir au moins 3 caractères." }).max(50, { message: "Le nom public ne peut pas dépasser 50 caractères." }),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro WhatsApp valide (ex: +225 07 00 00 00 00)." }),
  secondaryPhoneNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro de téléphone valide." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }).optional().or(z.literal('')),
  primaryColor: z.string().min(1, { message: "Veuillez sélectionner une couleur principale." }),
  secondaryColor: z.string().min(1, { message: "Veuillez sélectionner une couleur secondaire." }),
  logoOrPhoto: z.any().optional(), // File object

  // Étape 2: Contenu (Les Pages Clés)
  heroSlogan: z.string().min(10, { message: "Le slogan est requis et doit contenir au moins 10 caractères." }).max(60, { message: "Le slogan ne peut pas dépasser 60 caractères." }),
  aboutStory: z.string().min(50, { message: "Votre histoire/mission est requise et doit contenir au moins 50 caractères." }).max(300, { message: "Votre histoire/mission ne peut pas dépasser 300 caractères." }),
  portfolioProofLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  portfolioProofDescription: z.string().max(200, { message: "La description ne peut pas dépasser 200 caractères." }).optional().or(z.literal('')),

  // Nouvelle Étape: Produits & Services
  productsAndServices: z.array(z.object({
    title: z.string().min(3, "Le titre du produit/service est requis.").max(50, "Le titre ne peut pas dépasser 50 caractères."),
    price: z.preprocess(
      (val: unknown) => (val === '' ? undefined : val), // Explicitly type 'val'
      z.number().min(0, "Le prix ne peut pas être négatif.").optional()
    ),
    currency: z.string().min(1, "La devise est requise."),
    description: z.string().min(10, "La description est requise et doit contenir au moins 10 caractères.").max(200, "La description ne peut pas dépasser 200 caractères."),
    image: z.any().optional(), // File object
    actionButton: z.string().min(1, "L'action du bouton est requise."),
  })).min(1, { message: "Veuillez ajouter au moins un produit ou service." }).max(3, "Vous ne pouvez ajouter que 3 produits/services maximum."),

  // Étape 3 (maintenant Étape 4): Configuration et Réseaux
  subdomain: z.string()
    .min(3, { message: "Le sous-domaine doit contenir au moins 3 caractères." })
    .regex(/^[a-z0-9-]+$/, { message: "Le sous-domaine ne peut contenir que des lettres minuscules, des chiffres et des tirets." })
    .transform((s: string) => s.toLowerCase()) // Explicitly type 's'
    .refine((s: string) => !s.startsWith('-') && !s.endsWith('-'), { message: "Le sous-domaine ne peut pas commencer ou se terminer par un tiret." }), // Explicitly type 's'
  contactButtonAction: z.string().min(1, { message: "Veuillez sélectionner une action pour le bouton de contact." }),
  facebookLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  instagramLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  linkedinLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  paymentMethods: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un mode de paiement." }),
  deliveryOption: z.string().min(1, { message: "Veuillez sélectionner une option de livraison/déplacement." }),
  depositRequired: z.boolean(),
  businessLocation: z.string().min(3, { message: "La localisation de l'entreprise est requise." }).max(100, { message: "La localisation ne peut pas dépasser 100 caractères." }),
  showContactForm: z.boolean(),
  templateType: z.string().min(1, { message: "Veuillez sélectionner un type de template." }), // Add templateType to the schema
});

// The final wizardFormSchema is the base schema (no superRefine needed here as validations are direct)
const wizardFormSchema = baseWizardFormSchema;

// Infer the type for the entire wizard form data from the schema
type WizardFormData = z.infer<typeof wizardFormSchema>;

interface SiteCreationWizardProps {
  initialSiteData?: WizardFormData & { id?: string }; // Add id for existing sites
}

const steps: {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  schema: z.ZodSchema<any>;
}[] = [
  {
    id: "essentialDesign",
    title: "Infos Essentielles & Design",
    component: EssentialDesignStep,
    schema: baseWizardFormSchema.pick({
      publicName: true,
      whatsappNumber: true,
      secondaryPhoneNumber: true,
      email: true,
      primaryColor: true,
      secondaryColor: true,
      logoOrPhoto: true,
      templateType: true, // Include templateType in this step's schema
    }),
  },
  {
    id: "content",
    title: "Contenu (Pages Clés)",
    component: ContentStep,
    schema: baseWizardFormSchema.pick({
      heroSlogan: true,
      aboutStory: true,
      portfolioProofLink: true,
      portfolioProofDescription: true,
    }),
  },
  {
    id: "productsServices", // New step ID
    title: "Produits & Services",
    component: ProductsServicesStep,
    schema: baseWizardFormSchema.pick({
      productsAndServices: true,
    }),
  },
  {
    id: "configurationNetwork",
    title: "Configuration et Réseaux",
    component: ConfigurationNetworkStep,
    schema: baseWizardFormSchema.pick({
      subdomain: true,
      contactButtonAction: true,
      facebookLink: true,
      instagramLink: true,
      linkedinLink: true,
      paymentMethods: true,
      deliveryOption: true,
      depositRequired: true,
      businessLocation: true,
      showContactForm: true,
    }),
  },
];

// Utility function to sanitize file names for storage keys
const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return '';
  // Replace special characters (including spaces, accents) with hyphens
  // Keep alphanumeric characters, hyphens, and dots
  let sanitized = fileName
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9-.]/g, '-') // Replace non-alphanumeric (except dot and hyphen) with hyphen
    .replace(/--+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .toLowerCase();

  // Ensure file extension is preserved if present
  const parts = sanitized.split('.');
  if (parts.length > 1) {
    const extension = parts.pop();
    sanitized = parts.join('-') + '.' + extension;
  }

  return sanitized;
};


export function SiteCreationWizard({ initialSiteData }: SiteCreationWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const supabase = createClient();
  const router = useRouter();

  // Define defaultValues based on the WizardFormData type
  const defaultValues: WizardFormData = {
    publicName: initialSiteData?.publicName || "",
    whatsappNumber: initialSiteData?.whatsappNumber || "",
    secondaryPhoneNumber: initialSiteData?.secondaryPhoneNumber || "",
    email: initialSiteData?.email || "",
    primaryColor: initialSiteData?.primaryColor || "blue", // Default color
    secondaryColor: initialSiteData?.secondaryColor || "red", // Default color
    logoOrPhoto: initialSiteData?.logoOrPhoto || undefined, // This will be a URL if existing, not a File

    heroSlogan: initialSiteData?.heroSlogan || "",
    aboutStory: initialSiteData?.aboutStory || "",
    portfolioProofLink: initialSiteData?.portfolioProofLink || "",
    portfolioProofDescription: initialSiteData?.portfolioProofDescription || "",

    productsAndServices: initialSiteData?.productsAndServices || [], // Initialize with an empty array, ProductsServicesStep will add one if needed

    subdomain: initialSiteData?.subdomain || "",
    contactButtonAction: initialSiteData?.contactButtonAction || "whatsapp", // Default to WhatsApp
    facebookLink: initialSiteData?.facebookLink || "",
    instagramLink: initialSiteData?.instagramLink || "",
    linkedinLink: initialSiteData?.linkedinLink || "",
    paymentMethods: initialSiteData?.paymentMethods || [],
    deliveryOption: initialSiteData?.deliveryOption || "",
    depositRequired: initialSiteData?.depositRequired || false,
    businessLocation: initialSiteData?.businessLocation || "",
    showContactForm: initialSiteData?.showContactForm !== undefined ? initialSiteData.showContactForm : true, // Default to true
    templateType: initialSiteData?.templateType || "default", // Default template
  };

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema as z.ZodSchema<WizardFormData>),
    defaultValues: defaultValues,
    mode: "onChange", // Validate on change to enable/disable next button
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors }, // Get errors from formState
  } = methods;

  // Determine if the current step is valid based on its schema and current errors
  const currentStepSchema = steps[currentStep].schema as z.ZodObject<any>;
  const currentStepFieldNames = Object.keys(currentStepSchema.shape) as (keyof WizardFormData)[];

  // Check if any field in the current step has an error
  const isCurrentStepValid = !currentStepFieldNames.some(fieldName => errors[fieldName]);

  const handleNext = async () => {
    if (currentStep >= steps.length - 1) return;

    // Trigger validation for only the current step's fields
    const result = await trigger(currentStepFieldNames);

    if (result) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Veuillez corriger les erreurs avant de passer à l'étape suivante.");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit: SubmitHandler<WizardFormData> = async (data: WizardFormData) => { // Explicitly type 'data'
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Vous devez être connecté pour créer un site.");
      router.push("/login");
      return;
    }

    // Handle file uploads (logo and product images)
    let logoUrl: string | null = null;
    const productImages: { [key: number]: string | null } = {};

    try {
      // Upload logo/photo if present and it's a new File (not an existing URL)
      if (data.logoOrPhoto instanceof File) {
        const sanitizedLogoFileName = sanitizeFileName(data.logoOrPhoto.name);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(`${user.id}/${data.subdomain}/logo/${sanitizedLogoFileName}`, data.logoOrPhoto, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${uploadData.path}`;
      } else if (typeof data.logoOrPhoto === 'string') {
        // If it's already a string, it's an existing URL, so keep it
        logoUrl = data.logoOrPhoto;
      }

      // Upload product images if present and they are new Files
      for (const [index, product] of data.productsAndServices.entries()) {
        if (product.image instanceof File) {
          const sanitizedProductFileName = sanitizeFileName(product.image.name);
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(`${user.id}/${data.subdomain}/products/${index}-${sanitizedProductFileName}`, product.image, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;
          productImages[index] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${uploadData.path}`;
        } else if (typeof product.image === 'string') {
          // If it's already a string, it's an existing URL, so keep it
          productImages[index] = product.image;
        }
      }

      // Prepare site_data for Supabase, replacing File objects with URLs
      const siteDataToSave = {
        ...data,
        logoOrPhoto: logoUrl,
        productsAndServices: data.productsAndServices.map((product: typeof data.productsAndServices[number], index: number) => ({ // Explicitly type 'product' and 'index'
          ...product,
          image: productImages[index] !== undefined ? productImages[index] : product.image, // Use uploaded URL or original if not uploaded
        })),
      };

      if (initialSiteData?.id) {
        // Update existing site
        const { error: updateError } = await supabase
          .from('sites')
          .update({
            subdomain: data.subdomain,
            site_data: siteDataToSave,
            template_type: data.templateType, // Update template type
          })
          .eq('id', initialSiteData.id)
          .eq('user_id', user.id);

        if (updateError) {
          toast.error(`Erreur lors de la mise à jour du site: ${updateError.message}`);
          return;
        }
        toast.success("Votre site a été mis à jour avec succès ! Vous serez redirigé sous peu.");
      } else {
        // Insert new site
        const { error: insertError } = await supabase
          .from('sites')
          .insert({
            user_id: user.id,
            subdomain: data.subdomain,
            site_data: siteDataToSave,
            status: 'published', // Default status
            template_type: data.templateType, // Use the templateType from form data
          });

        if (insertError) {
          // Check for unique constraint error on subdomain
          if (insertError.code === '23505') { // PostgreSQL unique violation error code
            toast.error(`Le sous-domaine "${data.subdomain}" est déjà pris. Veuillez en choisir un autre.`);
          } else {
            toast.error(`Erreur lors de la création du site: ${insertError.message}`);
          }
          return;
        }
        toast.success("Votre site est en cours de création ! Vous serez redirigé sous peu.");
      }

      router.push(`/dashboard/${data.subdomain}/overview`); // Redirect to the new site's dashboard
      router.refresh(); // Refresh to update data
    } catch (error: any) {
      console.error("Site creation/update error:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Impossible de créer/mettre à jour le site."}`);
    }
  };

  const CurrentStepComponent = steps.length > 0 ? steps[currentStep].component : () => <p className="text-center text-muted-foreground">Aucune étape définie pour le moment.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted py-12">
      <Card className="w-full max-w-2xl p-6">
        <CardContent>
          <WizardProgress currentStep={currentStep} totalSteps={steps.length} />
          <Form {...methods}> {/* Use Form component here */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <CurrentStepComponent />
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
                isValid={isCurrentStepValid} // Pass the current step's validity
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}