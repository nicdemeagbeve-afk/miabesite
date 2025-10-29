"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteEditorForm } from "@/components/dashboard/SiteEditorForm";
import { SiteEditorFormData } from "@/lib/schemas/site-editor-form-schema"; // Import the new schema type

interface SiteDataFromDB {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: SiteEditorFormData; // Use the new comprehensive type
  status: string;
  template_type: string;
  created_at: string;
}

interface PageProps {
  params: { subdomain: string };
}

export default function DashboardEditContentPage({ params }: PageProps) {
  const { subdomain } = params;
  const supabase = createClient();
  const router = useRouter();
  const [site, setSite] = React.useState<SiteDataFromDB | null>(null);
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

      if (!subdomain) {
        setError("Sous-domaine non trouvé dans l'URL.");
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
        console.error("Error fetching site data for editor:", error);
        setError("Erreur lors du chargement des données du site.");
        toast.error("Erreur lors du chargement des données du site.");
      } else if (data) {
        setSite(data as SiteDataFromDB);
      } else {
        setError("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        toast.error("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        router.push('/dashboard/sites');
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [supabase, router, subdomain]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Chargement de l'éditeur de site...</h1>
        <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
          <Skeleton className="h-[600px] w-full" />
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
        <h1 className="text-3xl font-bold mb-8">Aucun site trouvé</h1>
        <p>Impossible de charger les données du site.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Éditeur de Contenu Avancé</h1>
      <div className="max-w-4xl mx-auto lg:mx-0 space-y-8">
        <SiteEditorForm initialSiteData={site.site_data} subdomain={site.subdomain} siteId={site.id} />
      </div>
    </div>
  );
}