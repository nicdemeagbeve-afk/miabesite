"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, LayoutTemplate, MessageSquare, Loader2, ShieldCheck, Globe } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface AdminStats {
  totalUsers: number;
  totalCommunities: number;
  totalPublicCommunities: number;
  totalPrivateCommunities: number;
  totalAdmins: number; // Community admins
  totalSuperAdmins: number;
  templatesUsed: { [key: string]: number };
}

export function AdminOverview() {
  const supabase = createClient();
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentAdminRole, setCurrentAdminRole] = React.useState<string | null>(null);

  const fetchAdminStats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Veuillez vous connecter pour accéder à cette page.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'super_admin') {
        toast.error("Accès refusé. Seuls les Super Admins peuvent accéder à cette page.");
        setLoading(false);
        return;
      }
      setCurrentAdminRole(profile.role);

      const response = await fetch('/api/admin/stats');
      const result = await response.json();

      if (response.ok) {
        setStats(result);
      } else {
        setError(result.error || "Erreur lors du chargement des statistiques.");
        toast.error(result.error || "Erreur lors du chargement des statistiques.");
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
      setError("Impossible de charger les statistiques administrateur.");
      toast.error("Impossible de charger les statistiques administrateur.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chargement...</CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-muted-foreground text-center py-8">
        <p>Aucune statistique disponible.</p>
      </div>
    );
  }

  const templateUsageData = Object.entries(stats.templatesUsed).map(([templateName, count]) => ({
    name: templateName,
    count: count,
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Inscrits sur la plateforme</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communautés Totales</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommunities}</div>
            <p className="text-xs text-muted-foreground">Créées sur la plateforme</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communautés Publiques</CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPublicCommunities}</div>
            <p className="text-xs text-muted-foreground">Accessibles à tous</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communautés Privées</CardTitle>
            <ShieldCheck className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrivateCommunities}</div>
            <p className="text-xs text-muted-foreground">Accès par invitation/code</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins de Communauté</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">Gèrent des communautés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSuperAdmins}</div>
            <p className="text-xs text-muted-foreground">Accès complet au système</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6" /> Utilisation des Templates
          </CardTitle>
          <CardDescription>
            Répartition des templates premium utilisés dans les communautés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {templateUsageData.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Aucune donnée d'utilisation de template.</p>
          ) : (
            <div className="space-y-2">
              {templateUsageData.map((template, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-muted-foreground">{template.count} utilisations</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}