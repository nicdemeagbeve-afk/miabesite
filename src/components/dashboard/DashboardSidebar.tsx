"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Pencil, Settings, PlusCircle, Home, User, MessageSquare, Edit, Mail as MailIcon } from "lucide-react"; // Added MailIcon
import { UserProfileButton } from "./UserProfileButton"; // Import UserProfileButton

interface DashboardSidebarProps {
  subdomain?: string; // Make subdomain optional
  onLinkClick?: () => void; // Callback for mobile menu closure
}

export function DashboardSidebar({ subdomain, onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const supportWhatsAppNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER || "+22870832482"; // Use env var or default

  const navItems = [
    {
      href: "/dashboard/sites",
      icon: <Home className="h-5 w-5" />,
      label: "Mes Sites",
      alwaysVisible: true,
    },
    {
      href: `/dashboard/${subdomain}/overview`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Vue d'Ensemble",
      requiresSubdomain: true,
    },
    {
      href: `/dashboard/${subdomain}/messages`, // New link for messages
      icon: <MailIcon className="h-5 w-5" />,
      label: "Messages",
      requiresSubdomain: true,
    },
    {
      href: `/dashboard/${subdomain}/content`,
      icon: <Pencil className="h-5 w-5" />,
      label: "Modifier le Contenu (Wizard)",
      requiresSubdomain: true,
    },
    {
      href: `/dashboard/${subdomain}/edit-content`, // New link for advanced editor
      icon: <Edit className="h-5 w-5" />,
      label: "Éditeur Avancé",
      requiresSubdomain: true,
    },
    {
      href: `/dashboard/${subdomain}/advanced`,
      icon: <Settings className="h-5 w-5" />,
      label: "Gestion Avancée",
      requiresSubdomain: true,
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-full bg-card text-card-foreground border-r border-border p-4 flex flex-col">
      {/* User Profile Button at the top */}
      <div className="mb-4">
        <UserProfileButton onLinkClick={onLinkClick} />
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          // Only render items that don't require a subdomain if no subdomain is selected,
          // or items that do require a subdomain if one is selected.
          if (item.requiresSubdomain && !subdomain) {
            return null;
          }
          const isActive = pathname === item.href || (item.requiresSubdomain && pathname.startsWith(`/dashboard/${subdomain}/`) && pathname.includes(item.label.toLowerCase().replace(/\s/g, '').replace('(wizard)', '')));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
              onClick={onLinkClick}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        {/* Always visible Profile & Settings link */}
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/profile"
              ? "bg-primary text-primary-foreground"
              : "text-foreground"
          )}
          onClick={onLinkClick}
        >
          <User className="h-5 w-5" />
          Profil & Paramètres
        </Link>
        {/* Always visible Support WhatsApp link */}
        <a
          href={`https://wa.me/${supportWhatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-green-700 text-green-600"
          onClick={onLinkClick}
        >
          <MessageSquare className="h-5 w-5" />
          Support WhatsApp
        </a>
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/create-site/select-template" onClick={onLinkClick}>
            <PlusCircle className="mr-2 h-5 w-5" /> Créer un site
          </Link>
        </Button>
      </div>
    </aside>
  );
}