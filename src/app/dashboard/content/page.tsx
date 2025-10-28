"use client";

import React from "react";
import { ContentModification } from "@/components/dashboard/ContentModification";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
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

export default function DashboardContentPage() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
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

      const subdomainMatch = pathname.match(/\/dashboard\/([^\/]+)\/content/);
      const subdomain = subdomainMatch ? subdomainMatch[1] : null;

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
        console.error("Error fetching site data:", error);
        setError("Erreur lors du chargement des données du site.");
        toast.error("Erreur lors du chargement des données du site.");
      } else if (data) {
        setSite(data as SiteData);
      } else {
        setError("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        toast.error("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        router.push('/dashboard/overview');
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [supabase, router, pathname]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Chargement du Contenu...</h1>
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
        <h1 className="text-3xl font-bold mb-8">Aucun site trouvé</h1>
        <p>Impossible de charger les données du site.</p>
      </div>
    );
  }

  const initialSiteData = site.site_data;
  const initialTemplateType = site.template_type;
  const initialPrimaryColor = initialSiteData.primaryColor;
  const initialSecondaryColor = initialSiteData.secondaryColor;
  const initialShowTestimonials = typeof initialSiteData.showTestimonials === 'boolean' ? initialSiteData.showTestimonials : true;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Modifier le Contenu</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <ContentModification
          subdomain={site.subdomain}
          initialTemplateType={initialTemplateType}
          initialPrimaryColor={initialPrimaryColor}
          initialSecondaryColor={initialSecondaryColor}
          initialShowTestimonials={initialShowTestimonials}
        />
      </div>
    </div>
  );
}