"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";

export function SupabaseStatusIndicator() {
  const supabase = createClient();

  React.useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Supabase: Erreur de connexion", error);
          console.log("Supabase: Déconnecté");
        } else {
          console.log("Supabase: Connecté");
        }
      } catch (e) {
        console.error("Supabase: Échec de la vérification de connexion", e);
        console.log("Supabase: Déconnecté");
      }
    }

    checkSupabaseConnection();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        checkSupabaseConnection();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // Ce composant ne rend rien visuellement
  return null;
}