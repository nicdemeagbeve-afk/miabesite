"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, MessageSquare } from "lucide-react";

interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: any; // This will contain the full wizard form data
  status: string;
  template_type: string;
  created_at: string;
}

interface DashboardStatsProps {
  siteData: SiteData;
}

export function DashboardStats({ siteData }: DashboardStatsProps) {
  // Placeholder data - these should be fetched from an API for the specific site
  // For now, they are initialized to zero/empty and ready for dynamic data.
  const totalSales = "0 F CFA"; // Placeholder, fetch from backend
  const totalVisits = 0; // Placeholder, fetch from backend
  const totalContacts = 0; // Placeholder, fetch from backend

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventes de produits</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSales}</div>
          <p className="text-xs text-muted-foreground">Depuis le début</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de visites</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisits}</div>
          <p className="text-xs text-muted-foreground">Total des visites</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de contacts</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalContacts}</div>
          <p className="text-xs text-muted-foreground">Interactions directes</p>
        </CardContent>
      </Card>
    </div>
  );
}