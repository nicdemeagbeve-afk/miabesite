"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { useIsMobile } from "@/hooks/use-mobile"; // Removed useIsMobile hook
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  // const isMobile = useIsMobile(); // Removed useIsMobile hook
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion.");
      console.error("Logout error:", error);
    } else {
      toast.success("Déconnexion réussie. Retour à la page de connexion utilisateur.");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop sidebar: hidden on small screens, flex from md breakpoint up */}
      <div className="hidden md:flex md:w-64">
        <AdminSidebar />
      </div>
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger: visible on small screens, hidden from md breakpoint up */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <AdminSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="text-xl font-semibold">Tableau de Bord Admin</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}