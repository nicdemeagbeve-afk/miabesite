import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: { subdomain: string }; // Explicitly type params here
}

export default function Layout({
  children,
  params,
}: LayoutProps) {
  const { subdomain } = params; // subdomain is now directly available

  return (
    <DashboardLayout subdomain={subdomain}>
      {children}
    </DashboardLayout>
  );
}