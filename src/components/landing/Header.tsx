"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { LogoutButton } from "@/components/LogoutButton"; // Importe le nouveau composant
import { createClient } from "@/lib/supabase/client"; // Pour vérifier l'état de l'utilisateur
import { useEffect, useState } from "react";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();

    // Optionnel: Écouter les changements d'état d'authentification
    const { data: authListener } = createClient().auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authListener?.subscription.unsubscribe(); // Correction ici
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">MiabeSite</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Fonctionnalités
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tarifs
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              À propos
            </Link>
            {isLoggedIn && ( // Afficher le lien vers le tableau de bord si connecté
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Tableau de bord
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component or other elements */}
          </div>
          <nav className="flex items-center gap-2">
            <PWAInstallButton />
            <ThemeToggle />
            {isLoggedIn ? (
              <LogoutButton /> // Affiche le bouton de déconnexion si l'utilisateur est connecté
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}