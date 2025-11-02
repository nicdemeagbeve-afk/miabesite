"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client'; // Assure-toi que ce chemin est correct

interface LogoutButtonProps {
  onLogoutSuccess?: () => void; // Fonction optionnelle à appeler après une déconnexion réussie
}

export function LogoutButton({ onLogoutSuccess }: LogoutButtonProps) {
  const handleLogoutClick = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    } else {
      console.log("Déconnexion de l'utilisateur réussie.");
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
      // Rediriger l'utilisateur vers la page de connexion ou la page d'accueil
      window.location.href = '/login'; // Ou '/'
    }
  };

  return (
    <Button onClick={handleLogoutClick} variant="ghost" size="sm" className="gap-1">
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  );
}