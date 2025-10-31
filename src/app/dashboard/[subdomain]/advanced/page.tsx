import React from "react";
import { AdvancedManagementAndHelp } from "@/components/dashboard/AdvancedManagementAndHelp";
import { createClient } from "@/lib/supabase/server"; // Use server-side Supabase client
import { redirect } from "next/navigation";
import type { Metadata } from 'next';
import { SiteEditorFormData } from "@/lib/schemas/site-editor-form-schema"; // Import SiteEditorFormData

export const metadata: Metadata = {
  title: "Gestion Avancée du Site",
  description: "Gérez les options avancées de votre site web et accédez au support.",
};

interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: SiteEditorFormData; // Use SiteEditorFormData type
  status: string;
  template_type: string;
  created_at: string;
}

interface PageProps {
  params: { subdomain: string };
}

export default async function DashboardAdvancedPage({ params }: PageProps) {
  const { subdomain } = params;
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?message=Veuillez vous connecter pour accéder à cette page.');
  }

  if (!subdomain) {
    return (
      <div className="container mx-auto text-center text-red-500">
        <h1 className="text-3xl font-bold mb-8">Erreur</h1>
        <p>Sous-domaine non trouvé dans l'URL.</p>
      </div>
    );
  }

  const { data: site, error: fetchError } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .eq('subdomain', subdomain)
    .single();

  if (fetchError || !site) {
    console.error("Error fetching site data:", fetchError);
    redirect('/dashboard/sites?message=Site non trouvé ou non autorisé.');
  }

  const currentSite: SiteData = site;
  const initialSiteData = currentSite.site_data;

  // Extract design-related data
  const initialTemplateType = currentSite.template_type;
  const initialPrimaryColor = initialSiteData.primaryColor;
  const initialSecondaryColor = initialSiteData.secondaryColor;
  const initialShowTestimonials = typeof initialSiteData.sectionsVisibility?.showTestimonials === 'boolean' ? initialSiteData.sectionsVisibility.showTestimonials : true;
  const initialShowSkills = typeof initialSiteData.sectionsVisibility?.showSkills === 'boolean' ? initialSiteData.sectionsVisibility.showSkills : true;


  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Gestion Avancée et Aide</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <AdvancedManagementAndHelp
          subdomain={currentSite.subdomain}
          initialTemplateType={initialTemplateType}
          initialPrimaryColor={initialPrimaryColor}
          initialSecondaryColor={initialSecondaryColor}
          initialShowTestimonials={initialShowTestimonials}
          initialShowSkills={initialShowSkills}
        />
      </div>
    </div>
  );
}