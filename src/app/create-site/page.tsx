"use client";

import React from "react";
import { SiteCreationWizard } from "@/components/site-creation/SiteCreationWizard";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for notifications
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteEditorFormData } from "@/lib/schemas/site-editor-form-schema"; // Import the new comprehensive type
import { useRouter } from "next/navigation"; // Ensure useRouter is imported

// Interface for the data fetched directly from the 'sites' table
interface FetchedSiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: SiteEditorFormData; // Use the new comprehensive type
  status: string;
  template_type: string;
  created_at: string;
}

export default function CreateSitePage() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');
  const templateTypeFromUrl = searchParams.get('templateType'); // Get templateType from URL
  const supabase = createClient();
  const router = useRouter(); // Initialize useRouter

  // The state for initialSiteData should match what SiteCreationWizard expects
  const [initialSiteData, setInitialSiteData] = React.useState<(SiteEditorFormData & { id?: string }) | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSiteData() {
      if (!subdomain) {
        // If no subdomain, but templateType is provided, initialize with templateType
        if (templateTypeFromUrl) {
          setInitialSiteData(prev => ({
            ...prev,
            templateType: templateTypeFromUrl,
            // Set default values for new fields if not provided by initialSiteData
            productsAndServices: [], // Ensure it's an array
            testimonials: [], // Ensure it's an array
            skills: [], // Ensure it's an array
            paymentMethods: [], // Ensure it's an array
            sectionsVisibility: {
              showHero: true,
              showAbout: true,
              showProductsServices: true,
              showTestimonials: true,
              showSkills: true,
              showContact: true,
            },
          } as SiteEditorFormData & { id?: string }));
        }
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
        const fetchedData = data as FetchedSiteData;
        setInitialSiteData({ ...fetchedData.site_data, id: fetchedData.id });
      } else {
        setError("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        toast.error("Site non trouvé ou vous n'êtes pas autorisé à y accéder.");
        router.push('/dashboard/sites');
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [subdomain, templateTypeFromUrl, supabase, router]); // Added router to dependencies

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