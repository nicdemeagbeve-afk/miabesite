"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Pencil, Settings, PlusCircle } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

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

  return (
    <aside className="w-full lg:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 flex flex-col">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/create-site">
            <PlusCircle className="mr-2 h-5 w-5" /> Créer un site
          </Link>
        </Button>
      </div>
    </aside>
  );
}