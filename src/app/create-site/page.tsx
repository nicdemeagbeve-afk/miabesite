"use client";

import React from "react";
import { SiteCreationWizard } from "@/components/site-creation/SiteCreationWizard";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster for notifications
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod"; // Import z for WizardFormData inference

// Define the schema for the wizard form data (copied from SiteCreationWizard for type inference)
const wizardFormSchema = z.object({
  publicName: z.string(),
  whatsappNumber: z.string(),
  secondaryPhoneNumber: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal('')),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  logoOrPhoto: z.any().optional(),
  heroSlogan: z.string(),
  aboutStory: z.string(),
  portfolioProofLink: z.string().optional().or(z.literal('')),
  portfolioProofDescription: z.string().optional().or(z.literal('')),
  productsAndServices: z.array(z.object({
    title: z.string(),
    price: z.preprocess((val: unknown) => (val === '' ? undefined : val), z.number().optional()),
    currency: z.string(),
    description: z.string(),
    image: z.any().optional(),
    actionButton: z.string(),
  })),
  subdomain: z.string(), // This is also in WizardFormData
  contactButtonAction: z.string(),
  facebookLink: z.string().optional().or(z.literal('')),
  instagramLink: z.string().optional().or(z.literal('')),
  linkedinLink: z.string().optional().or(z.literal('')),
  paymentMethods: z.array(z.string()),
  deliveryOption: z.string(),
  depositRequired: z.boolean(),
  businessLocation: z.string(),
  showContactForm: z.boolean(),
  templateType: z.string(), // ADDED: Ensure templateType is part of the schema
});

type WizardFormData = z.infer<typeof wizardFormSchema>;

// Interface for the data fetched directly from the 'sites' table
interface FetchedSiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: WizardFormData; // This is the key change
  status: string;
  template_type: string;
  created_at: string;
}

export default function CreateSitePage() {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');
  const templateTypeFromUrl = searchParams.get('templateType'); // Get templateType from URL
  const supabase = createClient();

  // The state for initialSiteData should match what SiteCreationWizard expects
  const [initialSiteData, setInitialSiteData] = React.useState<(WizardFormData & { id?: string }) | undefined>(undefined);
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
          } as WizardFormData & { id?: string }));
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
      }
      setLoading(false);
    }

    fetchSiteData();
  }, [subdomain, templateTypeFromUrl, supabase]); // Add templateTypeFromUrl to dependencies

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