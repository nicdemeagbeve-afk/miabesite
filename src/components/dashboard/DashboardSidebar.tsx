"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Pencil, Settings, PlusCircle, UserCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Site {
  id: string;
  subdomain: string;
  site_data: {
    publicName: string;
  };
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [sites, setSites] = React.useState<Site[]>([]);
  const [selectedSubdomain, setSelectedSubdomain] = React.useState<string | undefined>(undefined);
  const [loadingSites, setLoadingSites] = React.useState(true);

  // Extract subdomain from current path
  const currentSubdomain = pathname.split('/')[2]; // e.g., /dashboard/mysite/overview -> mysite

  React.useEffect(() => {
    async function fetchUserSites() {
      setLoadingSites(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Veuillez vous connecter pour voir vos sites.");
        router.push('/login');
        setLoadingSites(false);
        return;
      }

      const { data, error } = await supabase
        .from('sites')
        .select('id, subdomain, site_data')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching user sites:", error);
        toast.error("Erreur lors du chargement de vos sites.");
      } else if (data) {
        setSites(data as Site[]);
        // Set initial selected subdomain based on URL or first available site
        if (currentSubdomain && data.some(site => site.subdomain === currentSubdomain)) {
          setSelectedSubdomain(currentSubdomain);
        } else if (data.length > 0) {
          setSelectedSubdomain(data[0].subdomain);
          // Redirect to the first site's overview if no subdomain in URL or invalid
          if (!currentSubdomain || !data.some(site => site.subdomain === currentSubdomain)) {
            router.replace(`/dashboard/${data[0].subdomain}/overview`);
          }
        }
      }
      setLoadingSites(false);
    }

    fetchUserSites();
  }, [supabase, router, currentSubdomain]);

  const handleSiteChange = (newSubdomain: string) => {
    setSelectedSubdomain(newSubdomain);
    // Redirect to the overview page of the newly selected site
    router.push(`/dashboard/${newSubdomain}/overview`);
  };

  const navItems = [
    {
      href: (subdomain: string) => `/dashboard/${subdomain}/overview`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Vue d'Ensemble",
    },
    {
      href: (subdomain: string) => `/dashboard/${subdomain}/content`,
      icon: <Pencil className="h-5 w-5" />,
      label: "Modifier le Contenu",
    },
    {
      href: (subdomain: string) => `/dashboard/${subdomain}/advanced`,
      icon: <Settings className="h-5 w-5" />,
      label: "Gestion Avancée",
    },
    {
      href: () => `/dashboard/profile`, // Profile page is not site-specific
      icon: <UserCircle2 className="h-5 w-5" />,
      label: "Mon Profil",
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-full lg:w-64 bg-card text-card-foreground border-r border-border p-4 flex flex-col">
      <div className="mb-4">
        {loadingSites ? (
          <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
        ) : sites.length > 0 ? (
          <Select value={selectedSubdomain} onValueChange={handleSiteChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.subdomain}>
                  {site.site_data.publicName} ({site.subdomain})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun site créé.</p>
        )}
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          // Only render site-specific links if a site is selected
          if (item.label !== "Mon Profil" && !selectedSubdomain) {
            return null;
          }
          const itemHref = item.label === "Mon Profil"
            ? (item.href as () => string)() // Explicitly cast for 'Mon Profil'
            : (item.href as (subdomain: string) => string)(selectedSubdomain!); // Explicitly cast for other items
          const isActive = pathname.startsWith(itemHref); // Check if path starts with itemHref

          return (
            <Link
              key={item.label}
              href={itemHref}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/create-site">
            <PlusCircle className="mr-2 h-5 w-5" /> Créer un site
          </Link>
        </Button>
      </div>
    </aside>
  );
}