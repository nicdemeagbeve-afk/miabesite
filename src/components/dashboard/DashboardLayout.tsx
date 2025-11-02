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

        // 2. Si aucun profil n'est trouvé, en créer un
        if (!profile && profileError) {
          console.log("Profil manquant pour l'utilisateur, création en cours...");
          toast.info("Mise à jour de votre compte en cours...");

          const newReferralCode = await generateUniqueReferralCode(supabase); // Passer l'instance supabase
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
            // Assurez-vous d'inclure des valeurs par défaut pour les autres champs NOT NULL
            referral_count: 0,
          });

          if (insertError) {
            console.error("Erreur lors de la création du profil manquant:", insertError);
            toast.error("Une erreur est survenue lors de la mise à jour de votre profil.");
          } else {
            console.log("Profil créé avec succès pour l'ancien utilisateur.");
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