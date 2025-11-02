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
        console.log("Utilisateur connecté:", user.id);

        // 1. Vérifier si un profil existe déjà
        const { data: profile, error: fetchProfileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        console.log("Résultat de la récupération du profil:", { profile, fetchProfileError });

        // Gérer les erreurs de récupération du profil
        if (fetchProfileError) {
          if (fetchProfileError.code === 'PGRST116') {
            // C'est le code pour "aucune ligne trouvée", ce qui est attendu si le profil n'existe pas encore.
            console.log("Aucun profil trouvé pour l'utilisateur (PGRST116), procéder à la création.");
          } else {
            // C'est une erreur réelle de base de données lors de la récupération
            console.error("Erreur réelle lors de la récupération du profil:", fetchProfileError);
            toast.error(`Erreur lors de la vérification du profil: ${fetchProfileError.message || 'Erreur inconnue'}`);
            setIsCheckingProfile(false);
            return;
          }
        }

        // 2. Si aucun profil n'est trouvé (data est null), en créer un
        if (!profile) { // Cette condition est vraie si profile est null (soit PGRST116, soit aucune donnée)
          console.log("Profil manquant pour l'utilisateur, tentative de création...");
          toast.info("Mise à jour de votre compte en cours...");

          const newReferralCode = await generateUniqueReferralCode(supabase);
          const initialCoinPoints = 50;

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
            console.error("Erreur détaillée lors de la CRÉATION du profil:", insertError);
            toast.error(`Échec de la création du profil: ${insertError.message || 'Erreur inconnue'}`);
          } else {
            console.log("Profil créé avec succès pour l'utilisateur.");
            toast.success("Bienvenue ! Votre compte a été mis à jour avec un code de parrainage et des pièces bonus.");
            window.location.reload();
          }
        } else {
          console.log("Profil existant trouvé pour l'utilisateur.");
        }
      } else {
        console.log("Aucun utilisateur connecté.");
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