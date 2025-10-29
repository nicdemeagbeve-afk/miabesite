"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
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

export default function DashboardSitesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [sites, setSites] = React.useState<SiteData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUserSites() {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        toast.error("Veuillez vous connecter pour accéder à cette page.");
        return;
      }

      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user sites:", error);
        setError("Erreur lors du chargement de vos sites.");
        toast.error("Erreur lors du chargement de vos sites.");
      } else if (data) {
        setSites(data as SiteData[]);
      }
      setLoading(false);
    }

    fetchUserSites();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Mes Sites</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-8">Erreur</h1>
        <p>{error}</p>
      </div>
    );
  }

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

      {sites.length === 0 ? (
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
          {sites.map((site) => (
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