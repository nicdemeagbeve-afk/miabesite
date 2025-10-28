import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";

export default function Layout({
  children,
  params, // Add params to get the subdomain
}: {
  children: React.ReactNode;
  params: { subdomain?: string }; // Define subdomain as optional
}) {
  const subdomain = params.subdomain; // Extract subdomain from params

  return (
    <DashboardLayout subdomain={subdomain}>
      {children}
    </DashboardLayout>
  );
}