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
import { IdentityContactStep } from "./steps/IdentityContactStep";
import { SkillsServicesStep } from "./steps/SkillsServicesStep";
import { ProductsStep } from "./steps/ProductsStep";
import { TermsConditionsStep } from "./steps/TermsConditionsStep";
import { SubdomainStep } from "./steps/SubdomainStep";

// Define the schema for the entire wizard form
const wizardFormSchema = z.object({
  publicName: z.string().min(3, { message: "Le nom public est requis et doit contenir au moins 3 caractères." }),
  profilePicture: z.any().optional(), // File object
  location: z.string().min(3, { message: "La localisation est requise." }),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro de téléphone valide (ex: +225 07 00 00 00 00)." }),
  socialMediaLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),

  activityTitle: z.string().min(3, { message: "Le titre principal de l'activité est requis." }).max(30, { message: "Le titre principal ne peut pas dépasser 30 caractères." }),
  mainDomain: z.string().min(1, { message: "Veuillez sélectionner un domaine principal." }),
  expertiseDomains: z.array(z.string()).max(3, "Vous ne pouvez sélectionner que 3 mots-clés maximum.").optional().transform(val => val ?? []),
  shortDescription: z.string().min(50, { message: "La description courte doit contenir au moins 50 caractères." }).max(1000, { message: "La description courte ne peut pas dépasser 1000 caractères." }),
  portfolioLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),
  portfolioImages: z.array(z.any()).max(3, "Vous ne pouvez télécharger que 3 images maximum.").optional().transform(val => val ?? []),

  productCategory: z.string().min(1, { message: "Veuillez sélectionner une catégorie de produit." }),
  products: z.array(z.object({
    name: z.string().optional(), // Make name optional here, will be refined below
    image: z.any().optional(), // File object
    price: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.number().min(0, "Le prix ne peut pas être négatif.").optional()
    ),
    currency: z.string().optional(), // Make currency optional here, will be refined below
    description: z.string().max(200, "La description ne peut pas dépasser 200 caractères.").optional(),
  })).superRefine((products, ctx) => {
    const activeProducts = products.filter(p => p.name || p.image || p.price !== undefined || p.currency || p.description);
    if (activeProducts.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // Corrected ZodIssueCode
        message: "Vous ne pouvez ajouter que 3 produits maximum.",
        path: ["products"],
      });
    }
    activeProducts.forEach((product, index) => {
      if (!product.name || product.name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le nom du produit est requis si d'autres informations sont fournies.",
          path: ["products", index, "name"],
        });
      }
      if (!product.currency || product.currency.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La devise est requise si d'autres informations sont fournies.",
          path: ["products", index, "currency"],
        });
      }
    });
  }).optional().transform(val => val ?? []), // Default to empty array

  paymentMethods: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un mode de paiement." }),
  deliveryOption: z.string().min(1, { message: "Veuillez sélectionner une option de livraison/déplacement." }),
  typicalLeadTime: z.string().min(3, { message: "Veuillez indiquer un délai typique." }),

  subdomain: z.string()
    .min(3, { message: "Le sous-domaine doit contenir au moins 3 caractères." })
    .regex(/^[a-z0-9-]+$/, { message: "Le sous-domaine ne peut contenir que des lettres minuscules, des chiffres et des tirets." })
    .transform(s => s.toLowerCase()) // Ensure lowercase
    .refine(s => !s.startsWith('-') && !s.endsWith('-'), { message: "Le sous-domaine ne peut pas commencer ou se terminer par un tiret." }),
});

// Infer the type for the entire wizard form data from the schema
type WizardFormData = z.infer<typeof wizardFormSchema>;

const steps: {
  id: string;
  component: React.ComponentType<any>;
  schema: z.ZodSchema<any>;
}[] = [
  {
    id: "identityContact",
    component: IdentityContactStep,
    schema: wizardFormSchema.pick({ publicName: true, profilePicture: true, location: true, whatsappNumber: true, socialMediaLink: true }),
  },
  {
    id: "skillsServices",
    component: SkillsServicesStep,
    schema: wizardFormSchema.pick({ activityTitle: true, mainDomain: true, expertiseDomains: true, shortDescription: true, portfolioLink: true, portfolioImages: true }),
  },
  {
    id: "products",
    component: ProductsStep,
    schema: wizardFormSchema.pick({ productCategory: true, products: true }),
  },
  {
    id: "termsConditions",
    component: TermsConditionsStep,
    schema: wizardFormSchema.pick({ paymentMethods: true, deliveryOption: true, typicalLeadTime: true }),
  },
  {
    id: "subdomain",
    component: SubdomainStep,
    schema: wizardFormSchema.pick({ subdomain: true }),
  },
];

export function SiteCreationWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Define defaultValues based on the WizardFormData type
  const defaultValues: WizardFormData = {
    publicName: "",
    profilePicture: undefined,
    location: "",
    whatsappNumber: "",
    socialMediaLink: "",
    activityTitle: "",
    mainDomain: "",
    expertiseDomains: [], // Default to empty array
    shortDescription: "",
    portfolioLink: "",
    portfolioImages: [],
    productCategory: "",
    products: [], // Default to empty array
    paymentMethods: [],
    deliveryOption: "",
    typicalLeadTime: "",
    subdomain: "",
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Site creation data:", data);
    toast.success("Votre site est en cours de création ! Vous serez redirigé sous peu.");
    // In a real app, you would redirect the user or show a success page
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