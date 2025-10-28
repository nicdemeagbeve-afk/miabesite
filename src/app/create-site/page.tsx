"use client";

import React from "react";
import { SiteCreationWizard } from "@/components/site-creation/SiteCreationWizard";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for notifications

export default function CreateSitePage() {
  return (
    <>
      <SiteCreationWizard />
      <Toaster />
    </>
  );
}