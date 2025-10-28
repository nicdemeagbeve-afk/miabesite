import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";

export default function Layout({
  children,
  params, // Add params to get the subdomain
}: {
  children: React.ReactNode;
  params: { subdomain?: string | string[] }; // Allow string | string[] for dynamic segments
}) {
  // Handle potential string[] for subdomain, though for [subdomain] it's usually string
  const subdomain = Array.isArray(params.subdomain) ? params.subdomain[0] : params.subdomain;

  return (
    <DashboardLayout subdomain={subdomain}>
      {children}
    </DashboardLayout>
  );
}