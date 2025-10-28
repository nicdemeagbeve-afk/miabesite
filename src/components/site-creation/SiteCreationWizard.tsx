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
import { SubdomainStep } from "./steps/SubdomainStep"; // Import the new step

// Define the schema for the entire wizard form
const wizardFormSchema = z.object({
  publicName: z.string().min(3, { message: "Le nom public est requis et doit contenir au moins 3 caractères." }),
  profilePicture: z.any().optional(), // File object
  location: z.string().min(3, { message: "La localisation est requise." }),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro de téléphone valide (ex: +225 07 00 00 00 00)." }),
  socialMediaLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),

  activityTitle: z.string().min(3, { message: "Le titre principal de l'activité est requis." }),
  expertiseDomains: z.array(z.object({
    value: z.string().min(1, "Le domaine d'expertise ne peut pas être vide."),
  })).max(5, "Vous ne pouvez ajouter que 5 domaines d'expertise maximum.").optional().transform(val => val ?? [{ value: "" }]),
  shortDescription: z.string().min(50, { message: "La description courte doit contenir au moins 50 caractères." }).max(500, { message: "La description courte ne peut pas dépasser 500 caractères." }),
  portfolioLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')),

  productCategory: z.string().min(1, { message: "Veuillez sélectionner une catégorie de produit." }),
  products: z.array(z.object({
    name: z.string().min(1, "Le nom du produit ne peut pas être vide."),
    image: z.any().optional(), // File object
    price: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.number().min(0, "Le prix ne peut pas être négatif.").optional()
    ),
    currency: z.string().min(1, "La devise est requise."),
    description: z.string().max(200, "La description ne peut pas dépasser 200 caractères.").optional(),
  })).max(3, "Vous ne pouvez ajouter que 3 produits maximum.").optional().transform(val => val ?? [{ name: "", image: undefined, price: undefined, currency: "XOF", description: "" }]),

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
    schema: wizardFormSchema.pick({ activityTitle: true, expertiseDomains: true, shortDescription: true, portfolioLink: true }),
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
    expertiseDomains: [{ value: "" }],
    shortDescription: "",
    portfolioLink: "",
    productCategory: "",
    products: [{ name: "", image: undefined, price: undefined, currency: "XOF", description: "" }],
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
    formState: { isSubmitting, isValid },
  } = methods;

  const handleNext = async () => {
    if (currentStep >= steps.length - 1) return; // Prevent going past the last step if no steps are defined

    const currentStepSchema = steps[currentStep].schema as z.ZodObject<any>; // Explicitly cast to ZodObject
    const result = await trigger(Object.keys(currentStepSchema.shape) as (keyof WizardFormData)[]);

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
                  isValid={isValid}
                />
              </form>
            </Form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}