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
import { SiteInfoStep } from "./steps/SiteInfoStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { SkillsStep } from "./steps/SkillsStep";
import { BrandingStep } from "./steps/BrandingStep"; // Import the new step

// Define the schema for the entire wizard form
const wizardFormSchema = z.object({
  siteName: z.string().min(3, { message: "Le nom du site est requis et doit contenir au moins 3 caractères." }),
  siteType: z.string().min(1, { message: "Veuillez sélectionner un type d'activité." }),
  siteDescription: z.string().min(20, { message: "Veuillez décrire votre activité en au moins 20 caractères." }),
  firstName: z.string().min(2, { message: "Le prénom est requis." }),
  lastName: z.string().min(2, { message: "Le nom est requis." }),
  age: z.preprocess(
    (val) => (val === '' ? undefined : val), // Convert empty string to undefined
    z.number().min(18, { message: "Vous devez avoir au moins 18 ans." }).max(120, { message: "L'âge semble irréaliste." }).optional()
  ),
  businessDomain: z.string().min(1, { message: "Veuillez sélectionner un domaine d'activité." }),
  profilePicture: z.any().optional(), // For file input, validation will be more complex if actual upload is needed
  logo: z.any().optional(), // For file input
  skills: z.array(z.object({
    value: z.string().min(1, "La compétence ne peut pas être vide."),
  })).max(25, "Vous ne pouvez ajouter que 25 compétences maximum.").optional().transform(val => val ?? [{ value: "" }]),
  slogan: z.string().max(100, "Le slogan ne peut pas dépasser 100 caractères.").optional(),
  brandingDescription: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional(),
  autobiography: z.string().max(1000, "L'autobiographie ne peut pas dépasser 1000 caractères.").optional(),
  brandingImages: z.array(z.object({
    file: z.any().optional(), // File object, validation for actual file type/size would be here
  })).max(5, "Vous ne pouvez ajouter que 5 images de branding maximum.").optional().transform(val => val ?? [{ file: undefined }]),
});

// Infer the type for the entire wizard form data from the schema
type WizardFormData = z.infer<typeof wizardFormSchema>;

const steps = [
  {
    id: "siteInfo",
    component: SiteInfoStep,
    schema: wizardFormSchema.pick({ siteName: true, siteType: true, siteDescription: true }),
  },
  {
    id: "personalInfo",
    component: PersonalInfoStep,
    schema: wizardFormSchema.pick({ firstName: true, lastName: true, age: true, businessDomain: true, profilePicture: true, logo: true }),
  },
  {
    id: "skills",
    component: SkillsStep,
    schema: wizardFormSchema.pick({ skills: true }),
  },
  {
    id: "branding",
    component: BrandingStep,
    schema: wizardFormSchema.pick({ slogan: true, brandingDescription: true, autobiography: true, brandingImages: true }),
  },
  // Add more steps here
];

export function SiteCreationWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Explicitly define defaultValues to match WizardFormData type
  const defaultValues: WizardFormData = {
    siteName: "",
    siteType: "",
    siteDescription: "",
    firstName: "",
    lastName: "",
    age: undefined,
    businessDomain: "",
    profilePicture: undefined,
    logo: undefined,
    skills: [{ value: "" }], // This is the transformed default
    slogan: undefined,
    brandingDescription: undefined,
    autobiography: undefined,
    brandingImages: [{ file: undefined }], // This is the transformed default
  };

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: defaultValues, // Use the explicitly typed defaultValues
    mode: "onChange", // Validate on change to enable/disable next button
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting, isValid },
  } = methods;

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;
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

  const CurrentStepComponent = steps[currentStep].component;

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
                  isValid={isValid} // Pass isValid to enable/disable next/submit
                />
              </form>
            </Form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}