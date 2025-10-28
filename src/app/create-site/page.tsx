"use client";

import React from "react";
import { SiteCreationWizard } from "@/components/site-creation/SiteCreationWizard";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for notifications
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: any; // This will contain the full wizard form data
  status: string;
  template_type: string;
  created_at: string;
}

export default function CreateSitePage() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');
  const supabase = createClient();

  const [initialSiteData, setInitialSiteData] = React.useState<SiteData | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSiteData() {
      if (!subdomain) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // User not logged in, wizard will handle redirection
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .eq('subdomain', subdomain)
        .single();

      if (error) {
        console.error("Error fetching site data for wizard:", error);
        setError("Erreur lors du chargement des données du site pour modification.");
        toast.error("Erreur lors du chargement des données du site.");
      } else if (data) {
        // Merge site_data with top-level site properties for wizard
        setInitialSiteData({ ...data.site_data, id: data.id, subdomain: data.subdomain });
      } else {
        setError("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        toast.error("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [subdomain, supabase]);

  if (loading && subdomain) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted py-12">
        <Skeleton className="w-full max-w-2xl h-[600px] p-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <SiteCreationWizard initialSiteData={initialSiteData} />
      <Toaster />
    </>
  );
}