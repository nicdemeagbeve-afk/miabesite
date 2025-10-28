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
import { IdentityContactStep } from "./steps/IdentityContactStep"; // Import the new step

// Define the schema for the entire wizard form
const wizardFormSchema = z.object({
  publicName: z.string().min(3, { message: "Le nom public est requis et doit contenir au moins 3 caractères." }),
  profilePicture: z.any().optional(), // File object
  location: z.string().min(3, { message: "La localisation est requise." }),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/, { message: "Veuillez entrer un numéro de téléphone valide (ex: +225 07 00 00 00 00)." }),
  socialMediaLink: z.string().url({ message: "Veuillez entrer un lien URL valide." }).optional().or(z.literal('')), // Optional URL or empty string
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
  // New steps will be added here.
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