import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";
import type { Metadata } from 'next';
import { AIChatBubble } from "@/components/AIChatBubble"; // Import AIChatBubble

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
  return (
    <DashboardLayout>
      {children}
      <AIChatBubble /> {/* Add the AI chat bubble here */}
    </DashboardLayout>
  );
}