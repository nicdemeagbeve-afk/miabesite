"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateUniqueReferralCode } from "@/lib/utils"; // Importez la fonction
import { toast } from "sonner"; // Pour notifier l'utilisateur
import { DashboardSidebar } from "./DashboardSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "lucide-react"; // Import Menu icon for mobile toggle
import { Button } from "@/components/ui/button"; // Import Button for mobile toggle
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile hook
import { usePathname } from "next/navigation"; // Import usePathname
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle
import { PWAInstallButton } from "@/components/PWAInstallButton"; // Import PWAInstallButton

interface DashboardLayoutProps {
  children: React.ReactNode;
  // subdomain?: string; // No longer needed as a prop, will be derived internally
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createClient();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Extract subdomain from the pathname
  // Example: /dashboard/my-site/overview -> my-site
  const subdomainMatch = pathname.match(/^\/dashboard\/([^\/]+)/);
  const currentSubdomain = subdomainMatch ? subdomainMatch[1] : undefined;

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 1. Vérifier si un profil existe déjà
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        // Si une erreur réelle (pas juste "pas de ligne trouvée") survient lors de la récupération, la journaliser et arrêter.
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 est souvent le code pour "aucune ligne trouvée"
          console.error("Erreur lors de la récupération du profil:", profileError);
          toast.error("Une erreur est survenue lors de la vérification de votre profil.");
          setIsCheckingProfile(false);
          return;
        }

        // 2. Si aucun profil n'est trouvé (data est null), en créer un
        if (!profile) { // Condition simplifiée: si profile est null, on le crée
          console.log("Profil manquant pour l'utilisateur, création en cours...");
          toast.info("Mise à jour de votre compte en cours...");

          const newReferralCode = await generateUniqueReferralCode(supabase);
          const initialCoinPoints = 50; // Donnez des pièces en bonus aux anciens utilisateurs !

          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email,
            first_name: user.user_metadata?.first_name,
            last_name: user.user_metadata?.last_name,
            avatar_url: user.user_metadata?.avatar_url,
            role: "user",
            referral_code: newReferralCode,
            coin_points: initialCoinPoints,
            referral_count: 0,
            // IMPORTANT: Assurez-vous d'inclure des valeurs pour TOUTES les colonnes NOT NULL de votre table 'profiles'.
            // Si d'autres colonnes NOT NULL existent et ne sont pas listées ici, l'insertion échouera.
            // Par exemple, si vous avez une colonne 'created_at' NOT NULL, elle doit être gérée (par défaut dans la DB ou ici).
          });

          if (insertError) {
            console.error("Erreur détaillée lors de la création du profil manquant:", insertError);
            toast.error(`Échec de la mise à jour du profil: ${insertError.message || 'Erreur inconnue'}`);
          } else {
            console.log("Profil créé avec succès pour l'utilisateur.");
            toast.success("Bienvenue ! Votre compte a été mis à jour avec un code de parrainage et des pièces bonus.");
            // Optionnel : rafraîchir la page pour que les nouvelles données du profil soient utilisées partout
            window.location.reload();
          }
        }
      }
      setIsCheckingProfile(false);
    };

    checkAndCreateProfile();
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois

  if (isCheckingProfile) {
    return <div>Vérification de votre compte...</div>; // Ou un spinner de chargement
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {isMobile ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <DashboardSidebar subdomain={currentSubdomain} onLinkClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden lg:flex lg:w-64">
          <DashboardSidebar subdomain={currentSubdomain} />
        </div>
      )}
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* You can add a dashboard title or logo here */}
          </div>
          <div className="flex items-center gap-2">
            <PWAInstallButton /> {/* Ajoutez le bouton d'installation ici */}
            <ThemeToggle /> {/* Add ThemeToggle here */}
            {/* Removed SupabaseStatusIndicator from here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:ml-0">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}