"use client";

import React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
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
      (val) => (val === '' ? undefined : val),
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
    .transform(s => s.toLowerCase()) // Ensure lowercase
    .refine(s => !s.startsWith('-') && !s.endsWith('-'), { message: "Le sous-domaine ne peut pas commencer ou se terminer par un tiret." }),
  contactButtonAction: z.string().min(1, { message: "Veuillez sélectionner une action pour le bouton de contact." }),
  facebookLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  instagramLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  linkedinLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  paymentMethods: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un mode de paiement." }),
  deliveryOption: z.string().min(1, { message: "Veuillez sélectionner une option de livraison/déplacement." }),
  depositRequired: z.boolean(),
});

// The final wizardFormSchema is the base schema (no superRefine needed here as validations are direct)
const wizardFormSchema = baseWizardFormSchema;

// Infer the type for the entire wizard form data from the schema
type WizardFormData = z.infer<typeof wizardFormSchema>;

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
    }),
  },
];

export function SiteCreationWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const supabase = createClient();
  const router = useRouter();

  // Define defaultValues based on the WizardFormData type
  const defaultValues: WizardFormData = {
    publicName: "",
    whatsappNumber: "",
    secondaryPhoneNumber: "",
    email: "",
    primaryColor: "blue", // Default color
    secondaryColor: "red", // Default color
    logoOrPhoto: undefined,

    heroSlogan: "",
    aboutStory: "",
    portfolioProofLink: "",
    portfolioProofDescription: "",

    productsAndServices: [], // Initialize with an empty array, ProductsServicesStep will add one if needed

    subdomain: "",
    contactButtonAction: "whatsapp", // Default to WhatsApp
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
    paymentMethods: [],
    deliveryOption: "",
    depositRequired: false,
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

  const onSubmit: SubmitHandler<WizardFormData> = async (data) => {
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
      // Upload logo/photo if present
      if (data.logoOrPhoto instanceof File) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(`${user.id}/${data.subdomain}/logo/${data.logoOrPhoto.name}`, data.logoOrPhoto, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${uploadData.path}`;
      }

      // Upload product images if present
      for (const [index, product] of data.productsAndServices.entries()) {
        if (product.image instanceof File) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(`${user.id}/${data.subdomain}/products/${index}-${product.image.name}`, product.image, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;
          productImages[index] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/${uploadData.path}`;
        }
      }

      // Prepare site_data for Supabase, replacing File objects with URLs
      const siteDataToSave = {
        ...data,
        logoOrPhoto: logoUrl,
        productsAndServices: data.productsAndServices.map((product, index) => ({
          ...product,
          image: productImages[index] || product.image, // Use uploaded URL or original if not uploaded
        })),
      };

      // Insert site data into Supabase
      const { error: insertError } = await supabase
        .from('sites')
        .insert({
          user_id: user.id,
          subdomain: data.subdomain,
          site_data: siteDataToSave,
          status: 'published', // Default status
          template_type: 'default', // Default template, can be chosen later
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
      router.push(`/dashboard/${data.subdomain}/overview`); // Redirect to the new site's dashboard
      router.refresh(); // Refresh to update data
    } catch (error: any) {
      console.error("Site creation error:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Impossible de créer le site."}`);
    }
  };

  const CurrentStepComponent = steps.length > 0 ? steps[currentStep].component : () => <p className="text-center text-muted-foreground">Aucune étape définie pour le moment.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted py-12">
      <Card className="w-full max-w-2xl p-6">
        <CardContent>
          <WizardProgress currentStep={currentStep} totalSteps={steps.length} />
          <FormProvider {...methods}>
            <Form {...methods}>
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
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}