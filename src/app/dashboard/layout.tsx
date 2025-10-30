import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Tableau de Bord",
    template: "%s | Tableau de Bord Miabesite",
  },
  description: "Gérez vos sites web, messages et paramètres sur le tableau de bord Miabesite.",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardRootLayout({ children }: LayoutProps) {
  // This layout is for /dashboard, /dashboard/sites, /dashboard/profile
  // It does not have a subdomain param directly.
  // DashboardLayout will be rendered without a specific subdomain,
  // and the sidebar will only show general links.
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}