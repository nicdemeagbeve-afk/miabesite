"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "lucide-react"; // Import Menu icon for mobile toggle
import { Button } from "@/components/ui/button"; // Import Button for mobile toggle
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile hook
import { usePathname } from "next/navigation"; // Import usePathname

interface DashboardLayoutProps {
  children: React.ReactNode;
  // subdomain?: string; // No longer needed as a prop, will be derived internally
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Extract subdomain from the pathname
  // Example: /dashboard/my-site/overview -> my-site
  const subdomainMatch = pathname.match(/^\/dashboard\/([^\/]+)/);
  const currentSubdomain = subdomainMatch ? subdomainMatch[1] : undefined;

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
            {/* Removed SupabaseStatusIndicator from here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:ml-0"> {/* Removed lg:ml-64 as the sidebar is now part of the flex container */}
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}