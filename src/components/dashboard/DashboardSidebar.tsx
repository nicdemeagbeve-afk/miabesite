"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Pencil, Settings, PlusCircle, Home, User, MessageSquare, Edit, Mail as MailIcon, BookOpen } from "lucide-react"; // Added BookOpen icon
import { UserProfileButton } from "./UserProfileButton"; // Import UserProfileButton
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

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
    // Removed "Modifier le Contenu (Wizard)" link as requested
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
        <TooltipProvider>
          {navItems.map((item) => {
            const isDisabled = item.requiresSubdomain && !subdomain;
            const isActive = !isDisabled && (pathname === item.href || (item.requiresSubdomain && pathname.startsWith(`/dashboard/${subdomain}/`) && pathname.includes(item.label.toLowerCase().replace(/\s/g, ''))));

            const linkContent = (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isDisabled
                    ? "text-muted-foreground cursor-not-allowed opacity-60"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={isDisabled ? undefined : onLinkClick}
              >
                {item.icon}
                {item.label}
              </div>
            );

            return (
              <React.Fragment key={item.href}>
                {isDisabled ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      {linkContent}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Veuillez sélectionner un site pour accéder à cette section.</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link href={item.href} passHref>
                    {linkContent}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </TooltipProvider>
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
        {/* New Documentation link */}
        <Link
          href="/dashboard/documentation"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/dashboard/documentation"
              ? "bg-primary text-primary-foreground"
              : "text-foreground"
          )}
          onClick={onLinkClick}
        >
          <BookOpen className="h-5 w-5" />
          Documentation
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
        <Link href="/create-site/select-template" passHref>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onLinkClick}>
            <div>
              <PlusCircle className="mr-2 h-5 w-5" /> Créer un site
            </div>
          </Button>
        </Link>
      </div>
    </aside>
  );
}