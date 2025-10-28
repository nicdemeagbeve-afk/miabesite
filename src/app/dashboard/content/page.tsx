"use client";

import React from "react";
import { ContentModification } from "@/components/dashboard/ContentModification";

export default function DashboardContentPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Modifier le Contenu</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <ContentModification />
      </div>
    </div>
  );
}