import React from "react";
import { createClient } from "@/lib/supabase/server"; // Use server-side Supabase client
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Globe } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mes Sites",
  description: "Gérez tous vos sites web créés avec Miabesite.",
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

export default async function DashboardSitesPage() {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    // Redirect to login if not authenticated
    redirect('/login?message=Veuillez vous connecter pour accéder à cette page.');
  }

  const { data: sites, error: fetchError } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error("Error fetching user sites:", fetchError);
    // In a server component, we can't use client-side toast directly.
    // We could pass an error message to a client component or redirect with a query param.
    // For now, we'll just display an error message.
    return (
      <div className="container mx-auto p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-8">Erreur</h1>
        <p>Erreur lors du chargement de vos sites.</p>
      </div>
    );
  }

  const userSites: SiteData[] = sites || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center lg:text-left">Mes Sites</h1>
        <Button asChild>
          <Link href="/create-site/select-template">
            <PlusCircle className="mr-2 h-5 w-5" /> Créer un nouveau site
          </Link>
        </Button>
      </div>

      {userSites.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-card text-muted-foreground">
          <p className="text-xl mb-4">Vous n'avez pas encore créé de site.</p>
          <p className="mb-6">Commencez dès maintenant à mettre votre business en ligne !</p>
          <Button asChild size="lg">
            <Link href="/create-site/select-template">
              <PlusCircle className="mr-2 h-5 w-5" /> Créer mon premier site
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userSites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {site.site_data?.publicName || site.subdomain}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Lien: <span className="font-medium text-foreground">/sites/{site.subdomain}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Statut: <span className="font-medium text-green-600">{site.status === 'published' ? 'En ligne' : 'Brouillon'}</span>
                </p>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/${site.subdomain}/overview`}>
                    Gérer le site
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}