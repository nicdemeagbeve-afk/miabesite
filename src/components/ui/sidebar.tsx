"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pencil, Settings, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react"; // Import Menu icon

export function DashboardSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const navItems = [
    {
      href: "/dashboard/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Vue d'Ensemble",
    },
    {
      href: "/dashboard/content",
      icon: <Pencil className="h-5 w-5" />,
      label: "Modifier le Contenu",
    },
    {
      href: "/dashboard/advanced",
      icon: <Settings className="h-5 w-5" />,
      label: "Gestion Avancée",
    },
  ];

  const sidebarContent = (
    <aside className="h-full w-full bg-card text-card-foreground border-r border-border p-4 flex flex-col">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground"
            )}
            onClick={() => isMobile && setOpenMobile(false)} // Close mobile sidebar on navigation
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/create-site" onClick={() => isMobile && setOpenMobile(false)}>
            <PlusCircle className="mr-2 h-5 w-5" /> Créer un site
          </Link>
        </Button>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64" data-sidebar="sidebar" data-mobile="true">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden lg:flex lg:w-64">
      {sidebarContent}
    </div>
  );
}