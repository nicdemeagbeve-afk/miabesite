"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShieldCheck, Coins, PlusCircle, Home, Settings, MessageSquare, BookOpen, ListFilter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

export function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const navItems = [
    {
      href: "/admin/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Vue d'Ensemble",
    },
    {
      href: "/admin/manage-admins",
      icon: <ShieldCheck className="h-5 w-5" />,
      label: "Gérer les Admins",
    },
    {
      href: "/admin/coin-management",
      icon: <Coins className="h-5 w-5" />,
      label: "Gestion des Pièces",
    },
    {
      href: "/admin/community-management",
      icon: <Users className="h-5 w-5" />,
      label: "Gestion des Communautés",
    },
    {
      href: "/dashboard/documentation", // Link to general documentation
      icon: <BookOpen className="h-5 w-5" />,
      label: "Documentation",
    },
  ];

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

  const renderNavLink = (item: typeof navItems[number]) => {
    const isActive = pathname === item.href;

    const linkClasses = cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-accent hover:text-accent-foreground"
    );

    return (
      <Link href={item.href} passHref>
        <div className={linkClasses} onClick={onLinkClick}>
          {item.icon}
          {item.label}
        </div>
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 h-screen w-full bg-card text-card-foreground border-r border-border p-4 flex flex-col">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-primary">Miabesite Admin</h3>
      </div>

      <nav className="space-y-2 flex-1">
        <TooltipProvider>
          {navItems.map((item) => (
            <React.Fragment key={item.href}>
              {renderNavLink(item)}
            </React.Fragment>
          ))}
        </TooltipProvider>
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors text-destructive hover:bg-destructive/10"
        >
          <Home className="h-5 w-5" /> Retour au mode utilisateur
        </button>
      </div>
    </aside>
  );
}