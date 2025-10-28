"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Étape {currentStep + 1} sur {totalSteps}</span>
        <span>{Math.round(progressValue)}%</span>
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
}