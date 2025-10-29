"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SupabaseStatusIndicator() {
  const [status, setStatus] = React.useState<"loading" | "connected" | "disconnected">("loading");
  const supabase = createClient();

  React.useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        // Attempt to get user to check connection
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Supabase connection error:", error);
          setStatus("disconnected");
        } else {
          setStatus("connected");
        }
      } catch (e) {
        console.error("Supabase connection check failed:", e);
        setStatus("disconnected");
      }
    }

    checkSupabaseConnection();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        checkSupabaseConnection();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  let icon;
  let message;
  let className;

  switch (status) {
    case "loading":
      icon = <Loader2 className="h-4 w-4 animate-spin" />;
      message = "Connexion Supabase...";
      className = "text-yellow-500";
      break;
    case "connected":
      icon = <CheckCircle className="h-4 w-4" />;
      message = "Supabase Connecté";
      className = "text-green-500";
      break;
    case "disconnected":
      icon = <XCircle className="h-4 w-4" />;
      message = "Supabase Déconnecté";
      className = "text-red-500";
      break;
  }

  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium p-1 rounded-md", className)}>
      {icon}
      <span>{message}</span>
    </div>
  );
}