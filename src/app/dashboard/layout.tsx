import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";

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