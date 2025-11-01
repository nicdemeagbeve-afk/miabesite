"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LayoutTemplate, MessageSquare, Loader2, ShieldCheck, Globe } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase

interface AdminStats {
  totalUsers: number;
  totalCommunities: number;
  totalPublicCommunities: number;
  totalPrivateCommunities: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  templatesUsed: { [key: string]: number };
}

export function AdminOverview() {
  const supabase = createClient();
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAdminStats = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      if (usersError) throw usersError;

      // Fetch total communities
      const { count: totalCommunities, error: communitiesError } = await supabase
        .from('communities')
        .select('id', { count: 'exact', head: true });
      if (communitiesError) throw communitiesError;

      // Fetch public communities
      const { count: totalPublicCommunities, error: publicCommunitiesError } = await supabase
        .from('communities')
        .select('id', { count: 'exact', head: true })
        .eq('is_public', true);
      if (publicCommunitiesError) throw publicCommunitiesError;

      // Fetch private communities
      const { count: totalPrivateCommunities, error: privateCommunitiesError } = await supabase
        .from('communities')
        .select('id', { count: 'exact', head: true })
        .eq('is_public', false);
      if (privateCommunitiesError) throw privateCommunitiesError;

      // Fetch admins and super admins
      const { count: totalAdmins, error: adminsError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin');
      if (adminsError) throw adminsError;

      const { count: totalSuperAdmins, error: superAdminsError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'super_admin');
      if (superAdminsError) throw superAdminsError;

      // Fetch templates usage
      const { data: communitiesData, error: templatesError } = await supabase
        .from('communities')
        .select('template_1, template_2');
      if (templatesError) throw templatesError;

      const templatesUsed: { [key: string]: number } = {};
      communitiesData?.forEach(comm => {
        templatesUsed[comm.template_1] = (templatesUsed[comm.template_1] || 0) + 1;
        templatesUsed[comm.template_2] = (templatesUsed[comm.template_2] || 0) + 1;
      });

      setStats({
        totalUsers: totalUsers || 0,
        totalCommunities: totalCommunities || 0,
        totalPublicCommunities: totalPublicCommunities || 0,
        totalPrivateCommunities: totalPrivateCommunities || 0,
        totalAdmins: totalAdmins || 0,
        totalSuperAdmins: totalSuperAdmins || 0,
        templatesUsed,
      });

    } catch (err: any) {
      console.error("Failed to fetch admin stats:", err);
      setError(err.message || "Erreur lors du chargement des statistiques administrateur.");
      toast.error(err.message || "Erreur lors du chargement des statistiques administrateur.");
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
        <Card><CardHeader><CardTitle>Utilisateurs</CardTitle></CardHeader><CardContent><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Communautés</CardTitle></CardHeader><CardContent><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Admins</CardTitle></CardHeader><CardContent><Loader2 className="h-6 w-6 animate-spin text-primary" /></CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Utilisateurs enregistrés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Communautés</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCommunities}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.totalPublicCommunities} publiques, {stats?.totalPrivateCommunities} privées
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins Système</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalAdmins}</div>
          <p className="text-xs text-muted-foreground">
            Dont {stats?.totalSuperAdmins} Super Admins
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Templates Utilisés</CardTitle>
          <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats?.templatesUsed && Object.keys(stats.templatesUsed).length > 0 ? (
            <ul className="text-sm space-y-1">
              {Object.entries(stats.templatesUsed).map(([template, count]) => (
                <li key={template} className="flex justify-between">
                  <span>{template.charAt(0).toUpperCase() + template.slice(1)}:</span>
                  <span className="font-bold">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">Aucun template utilisé.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}