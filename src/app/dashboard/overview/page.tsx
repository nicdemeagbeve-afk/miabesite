"use client";

import React from "react";
import { OverviewAndQuickActions } from "@/components/dashboard/OverviewAndQuickActions";
import { DashboardStats } from "@/components/dashboard/DashboardStats"; // Import the new component

export default function DashboardOverviewPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Tableau de Bord</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <OverviewAndQuickActions />
        <DashboardStats /> {/* Add the new component here */}
      </div>
    </div>
  );
}