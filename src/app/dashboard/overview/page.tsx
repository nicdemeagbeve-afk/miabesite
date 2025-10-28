"use client";

import React from "react";
import { OverviewAndQuickActions } from "@/components/dashboard/OverviewAndQuickActions";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: any;
  status: string;
  template_type: string;
  created_at: string;
}

export default function DashboardOverviewPage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params;
  const supabase = createClient();
  const router = useRouter();
  const [site, setSite] = React.useState<SiteData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSiteData() {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        toast.error("Veuillez vous connecter pour accéder à cette page.");
        return;
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .eq('subdomain', subdomain) // Fetch specific site by subdomain
        .single();

      if (error) {
        console.error("Error fetching site data:", error);
        setError("Erreur lors du chargement des données du site.");
        toast.error("Erreur lors du chargement des données du site.");
      } else if (data) {
        setSite(data as SiteData);
      } else {
        setError("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        toast.error("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        // Optionally redirect to a list of sites or create site page
        router.push('/dashboard/overview'); // Redirect to a generic overview or site list
      }
      setLoading(false);
    }

    if (subdomain) { // Only fetch if subdomain is available
      fetchSiteData();
    } else {
      setLoading(false); // If no subdomain, stop loading and show message
      setError("Veuillez sélectionner un site.");
    }
  }, [supabase, router, subdomain]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Tableau de Bord</h1>
        <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto text-center text-red-500">
        <h1 className="text-3xl font-bold mb-8">Erreur</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="container mx-auto text-center text-muted-foreground">
        <h1 className="text-3xl font-bold mb-8">Aucun site sélectionné</h1>
        <p>Veuillez sélectionner un site depuis la barre latérale.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Tableau de Bord</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <OverviewAndQuickActions siteData={site} /> {/* Pass siteData */}
        <DashboardStats siteData={site} /> {/* Pass siteData */}
      </div>
    </div>
  );
}