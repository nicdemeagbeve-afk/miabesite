import React from "react";
import { ManageAdmins } from "@/components/admin/ManageAdmins";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gérer les Admins",
  description: "Ajoutez ou supprimez des administrateurs système pour la plateforme Miabesite.",
};

export default function ManageAdminsPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Gérer les Administrateurs</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <ManageAdmins />
      </div>
    </div>
  );
}