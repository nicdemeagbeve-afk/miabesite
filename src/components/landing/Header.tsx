"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase client
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Import toast

export function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe(); // Corrected unsubscribe call
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Déconnexion réussie !");
      router.push("/");
      router.refresh(); // Refresh to update session
    }
  };

  let authButtons;
  if (loading) {
    authButtons = <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />;
  } else if (user) {
    authButtons = (
      <>
        <Button asChild variant="ghost" className="text-sm font-medium hidden sm:inline-flex">
          <Link href="/dashboard/overview">Tableau de bord</Link>
        </Button>
        <Button onClick={handleLogout} className="text-sm font-medium">
          Déconnexion
        </Button>
      </>
    );
  } else {
    authButtons = (
      <>
        <Button asChild variant="ghost" className="text-sm font-medium hidden sm:inline-flex">
          <Link href="/login">Connexion</Link>
        </Button>
        <Button asChild className="text-sm font-medium">
          <Link href="/signup">Inscription</Link>
        </Button>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">Miabesite</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="#about"
            className="text-sm font-medium transition-colors hover:text-primary hidden sm:inline-block"
          >
            À propos
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium transition-colors hover:text-primary hidden sm:inline-block"
          >
            Services
          </Link>
          {authButtons}
        </nav>
      </div>
    </header>
  );
}