import React from "react";
import { OverviewAndQuickActions } from "@/components/dashboard/OverviewAndQuickActions";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { createClient } from "@/lib/supabase/server"; // Use server-side Supabase client
import { redirect } from "next/navigation";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Vue d'Ensemble du Site",
  description: "Aperçu rapide et actions pour votre site web.",
};

interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: any;
  status: string;
  template_type: string;
  created_at: string;
}

interface PageProps {
  params: { subdomain: string };
}

export default async function DashboardOverviewPage({ params }: PageProps) {
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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Tableau de Bord</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <OverviewAndQuickActions siteData={currentSite} />
        <DashboardStats siteData={currentSite} />
      </div>
    </div>
  );
}