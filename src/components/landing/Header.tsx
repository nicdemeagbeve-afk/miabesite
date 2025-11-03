"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { LogoutButton } from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react"; // Import Menu and X icons
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { usePathname, useRouter } from "next/navigation"; // Import useRouter

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // Redirect logged-in users from landing page to dashboard
  useEffect(() => {
    if (isLoggedIn && pathname === '/') {
      router.replace('/dashboard/sites');
    }
  }, [isLoggedIn, pathname, router]);

  const navLinks = (
    <>
      <Link href="/#features" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsMobileMenuOpen(false)}>
        Fonctionnalités
      </Link>
      <Link href="/#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsMobileMenuOpen(false)}>
        Tarifs
      </Link>
      <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsMobileMenuOpen(false)}>
        À propos
      </Link>
      {isLoggedIn && (
        <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => setIsMobileMenuOpen(false)}>
          Tableau de bord
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full py-4">
                <div className="px-6 mb-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="font-bold text-xl">MiabeSite</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 px-6 text-base font-medium flex-1">
                  {navLinks}
                </nav>
                <div className="mt-auto px-6 py-4 border-t flex flex-col gap-2">
                  <PWAInstallButton />
                  <ThemeToggle />
                  {isLoggedIn ? (
                    <LogoutButton onLogoutSuccess={() => setIsMobileMenuOpen(false)} />
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-start bg-accent text-accent-foreground hover:bg-accent/90">
                        Connexion
                      </Button>
                    </Link>
                  )}
                </div>
            </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">MiabeSite</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <div className="hidden md:block"> {/* Hide PWA button on mobile when menu is open */}
              <PWAInstallButton />
            </div>
            <ThemeToggle />
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
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