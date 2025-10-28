"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isSubmitting,
  isValid,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
      >
        Précédent
      </Button>
      {isLastStep ? (
        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Création..." : "Créer mon site"}
        </Button>
      ) : (
        <Button type="button" onClick={onNext} disabled={isSubmitting || !isValid}>
          Suivant
        </Button>
      )}
    </div>
  );
}