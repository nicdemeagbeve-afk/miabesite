"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { WizardProgress } from "./WizardProgress";
import { WizardNavigation } from "./WizardNavigation";
import { SiteInfoStep } from "./steps/SiteInfoStep";

// Define the schema for the entire wizard form
const wizardFormSchema = z.object({
  siteName: z.string().min(3, { message: "Le nom du site est requis et doit contenir au moins 3 caractères." }),
  siteType: z.string().min(1, { message: "Veuillez sélectionner un type d'activité." }),
  siteDescription: z.string().min(20, { message: "Veuillez décrire votre activité en au moins 20 caractères." }),
  // Add more fields for future steps here
});

type WizardFormData = z.infer<typeof wizardFormSchema>;

const steps = [
  {
    id: "siteInfo",
    component: SiteInfoStep,
    schema: wizardFormSchema.pick({ siteName: true, siteType: true, siteDescription: true }),
  },
  // Add more steps here
  // {
  //   id: "design",
  //   component: DesignStep,
  //   schema: wizardFormSchema.pick({ colorScheme: true, fontStyle: true }),
  // },
];

export function SiteCreationWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: {
      siteName: "",
      siteType: "",
      siteDescription: "",
    },
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

  const onSubmit = async (data: WizardFormData) => {
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