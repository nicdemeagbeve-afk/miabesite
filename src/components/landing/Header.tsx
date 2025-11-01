"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react"; // Import Menu and X icons for mobile toggle
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import Image from "next/image"; // Import Image component
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle
import { getSupabaseStorageUrl } from "@/lib/utils"; // Import getSupabaseStorageUrl
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase
import { UserProfileButton } from "@/components/dashboard/UserProfileButton"; // Import UserProfileButton

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null); // State to hold user data
  const supabase = createClient();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };

    fetchUser(); // Fetch user on component mount

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null); // Update user state on auth changes
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src={getSupabaseStorageUrl("miabesite-logo.png")} alt="Miabesite Logo" width={32} height={32} className="h-8 w-8" />
          <span className="font-bold text-lg">Miabesite</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            À propos
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Services
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Tarifs
          </Link>
          {user ? (
            <UserProfileButton />
          ) : (
            <>
              <Link href="/login" passHref>
                <Button asChild variant="ghost" className="text-sm font-medium">
                  <div>
                    Connexion
                  </div>
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button asChild className="text-sm font-medium">
                  <div>
                    Inscription
                  </div>
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] p-4">
              <div className="flex flex-col gap-4 pt-6">
                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  À propos
                </Link>
                <Link
                  href="#services"
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#pricing"
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                {user ? (
                  <UserProfileButton onLinkClick={() => setIsMobileMenuOpen(false)} />
                ) : (
                  <>
                    <Link href="/login" passHref>
                      <Button asChild variant="ghost" className="text-lg font-medium justify-start px-0" onClick={() => setIsMobileMenuOpen(false)}>
                        <div>
                          Connexion
                        </div>
                      </Button>
                    </Link>
                    <Link href="/signup" passHref>
                      <Button asChild className="text-lg font-medium justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                        <div>
                          Inscription
                        </div>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}