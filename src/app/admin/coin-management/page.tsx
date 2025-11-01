import React from "react";
import { CoinManagement } from "@/components/admin/CoinManagement";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gestion des Pièces",
  description: "Gérez les pièces des utilisateurs et consultez l'historique des transactions.",
};

export default function CoinManagementPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Gestion des Pièces</h1>
      <div className="max-w-5xl mx-auto lg:mx-0 space-y-8">
        <CoinManagement />
      </div>
    </div>
  );
}