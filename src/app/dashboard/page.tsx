"use client";

import React from "react";
import { OverviewAndQuickActions } from "@/components/dashboard/OverviewAndQuickActions";

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Tableau de Bord</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <OverviewAndQuickActions />
      </div>
    </div>
  );
}