"use client";

import React from "react";
import { AdvancedManagementAndHelp } from "@/components/dashboard/AdvancedManagementAndHelp";

export default function DashboardAdvancedPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Gestion Avancée et Aide</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <AdvancedManagementAndHelp />
      </div>
    </div>
  );
}