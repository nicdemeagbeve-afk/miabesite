import React from "react";
import { AdminOverview } from "@/components/admin/AdminOverview";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Vue d'Ensemble",
  description: "Aperçu général des statistiques et activités de la plateforme Miabesite.",
};

export default function AdminOverviewPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Vue d'Ensemble Administrateur</h1>
      <div className="max-w-5xl mx-auto lg:mx-0 space-y-8">
        <AdminOverview />
      </div>
    </div>
  );
}