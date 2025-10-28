"use client";

import React from "react";
import { OverviewAndQuickActions } from "@/components/dashboard/OverviewAndQuickActions";
import { ContentModification } from "@/components/dashboard/ContentModification"; // Import the new component
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for notifications

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tableau de Bord</h1>
      <div className="max-w-3xl mx-auto space-y-8">
        <OverviewAndQuickActions />
        <ContentModification /> {/* Add the new component here */}
        {/* Les autres sections du tableau de bord viendront ici */}
      </div>
      <Toaster />
    </div>
  );
}