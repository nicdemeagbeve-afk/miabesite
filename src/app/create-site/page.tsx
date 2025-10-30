import React from "react";
import { SiteCreationWizard } from "@/components/site-creation/SiteCreationWizard";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server"; // Use server-side Supabase client
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteEditorFormData } from "@/lib/schemas/site-editor-form-schema";

// Interface for the data fetched directly from the 'sites' table
interface FetchedSiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: SiteEditorFormData;
  status: string;
  template_type: string;
  created_at: string;
}

interface CreateSitePageProps {
  searchParams: {
    subdomain?: string;
    templateType?: string;
  };
}

export default async function CreateSitePage({ searchParams }: CreateSitePageProps) {
  const subdomain = searchParams.subdomain;
  const templateTypeFromUrl = searchParams.templateType;
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/signup?message=Veuillez vous connecter ou créer un compte pour créer un site.");
  }

  let initialSiteData: (SiteEditorFormData & { id?: string }) | undefined = undefined;
  let error: string | null = null;

  if (subdomain) {
    const { data, error: fetchError } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', user.id)
      .eq('subdomain', subdomain)
      .single();

    if (fetchError) {
      console.error("Error fetching site data for wizard:", fetchError);
      error = "Erreur lors du chargement des données du site pour modification.";
      redirect('/dashboard/sites?message=Site non trouvé ou non autorisé.');
    } else if (data) {
      const fetchedData = data as FetchedSiteData;
      initialSiteData = { ...fetchedData.site_data, id: fetchedData.id };
    } else {
      error = "Site non trouvé ou vous n'êtes pas autorisé à y accéder.";
      redirect('/dashboard/sites?message=Site non trouvé ou non autorisé.');
    }
  } else if (templateTypeFromUrl) {
    // If no subdomain, but templateType is provided, initialize with templateType
    initialSiteData = {
      templateType: templateTypeFromUrl,
      // Set default values for new fields if not provided by initialSiteData
      publicName: "", whatsappNumber: "", secondaryPhoneNumber: "", email: "",
      primaryColor: "blue", secondaryColor: "red", logoOrPhoto: undefined, businessLocation: "",
      firstName: "", lastName: "", expertise: "", heroSlogan: "", aboutStory: "", heroBackgroundImage: undefined,
      productsAndServices: [],
      testimonials: [],
      skills: [],
      contactButtonAction: "whatsapp", showContactForm: true,
      facebookLink: "", instagramLink: "", linkedinLink: "",
      paymentMethods: [], deliveryOption: "", depositRequired: false,
      sectionsVisibility: {
        showHero: true, showAbout: true, showProductsServices: true,
        showTestimonials: true, showSkills: true, showContact: true,
      },
    };
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