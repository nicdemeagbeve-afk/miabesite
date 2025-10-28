"use client";

import React from "react";
import { ContentModification } from "@/components/dashboard/ContentModification";
import { createClient } from "@/lib/supabase/client"; // Client-side Supabase client
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

// Define a basic type for the site data, matching what's stored in Supabase
interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: any; // This will contain the full wizard form data
  status: string;
  template_type: string;
  created_at: string;
}

export default function DashboardContentPage() {
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

      // In a real application, a user might have multiple sites.
      // For simplicity, we'll fetch the first site associated with the user.
      // You might want to add a site selection mechanism if multiple sites are supported.
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching site data:", error);
        setError("Erreur lors du chargement des données du site.");
        toast.error("Erreur lors du chargement des données du site.");
      } else if (data) {
        setSite(data as SiteData);
      } else {
        setError("Aucun site trouvé pour cet utilisateur.");
        toast.info("Aucun site trouvé. Veuillez créer un site d'abord.");
        router.push('/create-site'); // Redirect to create site if none exists
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Modifier le Contenu</h1>
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
        <p>Veuillez créer un site pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Modifier le Contenu</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <ContentModification
          subdomain={site.subdomain}
          initialTemplateType={site.template_type}
          initialPrimaryColor={site.site_data.primaryColor}
          initialSecondaryColor={site.site_data.secondaryColor}
          initialShowTestimonials={true} // Assuming testimonials are shown by default
        />
      </div>
    </div>
  );
}