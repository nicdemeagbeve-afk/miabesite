"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner"; // Pour notifier l'utilisateur
import { DashboardSidebar } from "./DashboardSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "lucide-react"; // Import Menu icon for mobile toggle
import { Button } from "@/components/ui/button"; // Import Button for mobile toggle
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { usePathname } from "next/navigation"; // Import usePathname
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle
import { PWAInstallButton } from "@/components/PWAInstallButton"; // Import PWAInstallButton
import { LogoutButton } from "@/components/LogoutButton"; // Import LogoutButton

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createClient();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Extract subdomain from the pathname
  // Example: /dashboard/my-site/overview -> my-site
  const subdomainMatch = pathname.match(/^\/dashboard\/([^\/]+)/);
  const currentSubdomain = subdomainMatch ? subdomainMatch[1] : undefined;

  useEffect(() => {
    const checkProfileExistence = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("Utilisateur connecté:", user.id);

        // Tenter de récupérer le profil. Le trigger SQL devrait l'avoir créé.
        const { data: profile, error: fetchProfileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        console.log("Résultat de la récupération du profil:", { profile, fetchProfileError });

        if (fetchProfileError && fetchProfileError.code === 'PGRST116') {
          // Si le profil n'est pas trouvé (PGRST116), cela signifie que le trigger n'a pas encore eu le temps de s'exécuter
          // ou qu'il y a un problème. Nous affichons un message et rafraîchissons.
          console.warn("Profil manquant pour l'utilisateur. Le trigger devrait le créer. Rafraîchissement...");
          toast.info("Mise à jour de votre compte en cours. Veuillez patienter...");
          // Un rechargement complet peut aider à s'assurer que le trigger s'exécute et que les données sont disponibles.
          window.location.reload();
        } else if (fetchProfileError) {
          // C'est une erreur réelle de base de données lors de la récupération
          console.error("Erreur réelle lors de la récupération du profil:", fetchProfileError);
          toast.error(`Erreur lors de la vérification du profil: ${fetchProfileError.message || 'Erreur inconnue'}`);
        } else {
          console.log("Profil existant trouvé pour l'utilisateur.");
        }
      } else {
        console.log("Aucun utilisateur connecté.");
      }
      setIsCheckingProfile(false);
    };

    checkProfileExistence();
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois

  if (isCheckingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <p className="text-lg text-muted-foreground">Vérification de votre compte...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop sidebar: hidden on small screens, flex from md breakpoint up */}
      <div className="hidden md:flex md:w-64">
        <DashboardSidebar subdomain={currentSubdomain} />
      </div>
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger: visible on small screens, hidden from md breakpoint up */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <DashboardSidebar subdomain={currentSubdomain} onLinkClick={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="text-xl font-semibold">Tableau de Bord</h2> {/* Always show title */}
          </div>
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <ThemeToggle />
            <LogoutButton /> {/* Added LogoutButton here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}