"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [stats, setStats] = React.useState({
    totalSales: "0 F CFA",
    totalVisits: 0,
    totalContacts: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/dashboard/stats?subdomain=${siteData.subdomain}`);
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        } else {
          setError(data.error || "Erreur lors du chargement des statistiques.");
          toast.error(data.error || "Erreur lors du chargement des statistiques.");
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Impossible de charger les statistiques.");
        toast.error("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    }

    if (siteData.subdomain) {
      fetchStats();
    }
  }, [siteData.subdomain]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes de produits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nombre de visites</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nombre de contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventes de produits</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSales}</div>
          <p className="text-xs text-muted-foreground">Depuis le début</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de visites</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVisits}</div>
          <p className="text-xs text-muted-foreground">Total des visites</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de contacts</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContacts}</div>
          <p className="text-xs text-muted-foreground">Interactions directes</p>
        </CardContent>
      </Card>
    </div>
  );
}