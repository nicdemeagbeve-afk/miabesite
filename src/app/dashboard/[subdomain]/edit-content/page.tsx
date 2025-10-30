import React from "react";
import { createClient } from "@/lib/supabase/server"; // Use server-side Supabase client
import { redirect } from "next/navigation";
import { SiteEditorForm } from "@/components/dashboard/SiteEditorForm";
import { SiteEditorFormData } from "@/lib/schemas/site-editor-form-schema";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Éditeur Avancé",
  description: "Personnalisez en détail toutes les sections de votre site web.",
};

interface SiteDataFromDB {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: SiteEditorFormData;
  status: string;
  template_type: string;
  created_at: string;
}

interface PageProps {
  params: { subdomain: string };
}

export default async function DashboardEditContentPage({ params }: PageProps) {
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
    console.error("Error fetching site data for editor:", fetchError);
    redirect('/dashboard/sites?message=Site non trouvé ou non autorisé.');
  }

  const currentSite: SiteDataFromDB = site;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Éditeur de Contenu Avancé</h1>
      <div className="max-w-4xl mx-auto lg:mx-0 space-y-8">
        <SiteEditorForm initialSiteData={currentSite.site_data} subdomain={currentSite.subdomain} siteId={currentSite.id} />
      </div>
    </div>
  );
}