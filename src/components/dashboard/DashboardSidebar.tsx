"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Pencil, Settings, PlusCircle, Home, User, MessageSquare, Edit, Mail as MailIcon, BookOpen, Gift, Users as UsersIcon, ListFilter } from "lucide-react"; // Import ListFilter icon for communities listing
import { UserProfileButton } from "./UserProfileButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  subdomain?: string;
  onLinkClick?: () => void;
}

export function DashboardSidebar({ subdomain, onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const supportWhatsAppNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER || "+22870832482";

  const alwaysVisibleNavItems = [
    {
      href: "/dashboard/sites",
      icon: <Home className="h-5 w-5" />,
      label: "Mes Sites",
    },
    {
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
      label: "Profil & Paramètres",
    },
    {
      href: "/dashboard/referral",
      icon: <Gift className="h-5 w-5" />,
      label: "Parrainage",
    },
    {
      href: "/dashboard/communities", // New link for communities listing
      icon: <ListFilter className="h-5 w-5" />,
      label: "Toutes les Communautés",
    },
    {
      href: "/dashboard/community/create",
      icon: <UsersIcon className="h-5 w-5" />,
      label: "Créer une Communauté",
    },
    {
      href: "/dashboard/documentation",
      icon: <BookOpen className="h-5 w-5" />,
      label: "Documentation",
    },
    {
      href: `https://wa.me/${supportWhatsAppNumber}`,
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Support WhatsApp",
      external: true,
    },
  ];

  const siteSpecificNavItems = [
    {
      href: `/dashboard/${subdomain}/overview`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Vue d'Ensemble",
    },
    {
      href: `/dashboard/${subdomain}/messages`,
      icon: <MailIcon className="h-5 w-5" />,
      label: "Messages",
    },
    {
      href: `/dashboard/${subdomain}/edit-content`,
      icon: <Edit className="h-5 w-5" />,
      label: "Éditeur Avancé",
    },
    {
      href: `/dashboard/${subdomain}/advanced`,
      icon: <Settings className="h-5 w-5" />,
      label: "Gestion Avancée",
    },
  ];

  const renderNavLink = (item: typeof alwaysVisibleNavItems[number] | typeof siteSpecificNavItems[number], isDisabled: boolean) => {
    const isActive = !isDisabled && (pathname === item.href || (subdomain && pathname.startsWith(`/dashboard/${subdomain}/`) && pathname.includes(item.label.toLowerCase().replace(/\s/g, ''))));

    const linkClasses = cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isDisabled
        ? "text-muted-foreground cursor-not-allowed opacity-60"
        : isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground"
    );

    const linkContent = (
      <div className={linkClasses} onClick={isDisabled ? undefined : onLinkClick}>
        {item.icon}
        {item.label}
      </div>
    );

    if (isDisabled) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>Veuillez sélectionner un site pour accéder à cette section.</p>
          </TooltipContent>
        </Tooltip>
      );
    } else if ('external' in item && item.external) {
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClasses} onClick={onLinkClick}>
          {item.icon}
          {item.label}
        </a>
      );
    } else {
      return (
        <Link href={item.href} passHref>
          {linkContent}
        </Link>
      );
    }
  };

  return (
    <aside className="sticky top-0 h-screen w-full bg-card text-card-foreground border-r border-border p-4 flex flex-col">
      <div className="mb-4">
        <UserProfileButton onLinkClick={onLinkClick} />
      </div>

      <nav className="space-y-2 flex-1">
        <TooltipProvider>
          {alwaysVisibleNavItems.map((item) => (
            <React.Fragment key={item.href}>
              {renderNavLink(item, false)}
            </React.Fragment>
          ))}

          {subdomain && (
            <>
              <div className="my-4 border-t border-border pt-4 text-xs font-semibold uppercase text-muted-foreground">
                Gestion du site
              </div>
              {siteSpecificNavItems.map((item) => (
                <React.Fragment key={item.href}>
                  {renderNavLink(item, false)}
                </React.Fragment>
              ))}
            </>
          )}

          {!subdomain && (
            <>
              <div className="my-4 border-t border-border pt-4 text-xs font-semibold uppercase text-muted-foreground">
                Gestion du site
              </div>
              {siteSpecificNavItems.map((item) => (
                <React.Fragment key={item.href}>
                  {renderNavLink(item, true)} {/* Render disabled with tooltip */}
                </React.Fragment>
              ))}
            </>
          )}
        </TooltipProvider>
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