import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: { subdomain?: string | string[] };
}

export default function Layout({
  children,
  params,
}: LayoutProps) {
  // Handle potential string[] for subdomain, though for [subdomain] it's usually string
  const subdomain = Array.isArray(params.subdomain) ? params.subdomain[0] : params.subdomain;

  return (
    <DashboardLayout subdomain={subdomain}>
      {children}
    </DashboardLayout>
  );
}