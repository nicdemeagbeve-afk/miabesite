"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Link as LinkIcon, Eye, Copy, Globe } from "lucide-react"; // Import Globe icon
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Import useRouter

interface SiteData {
  id: string;
  user_id: string;
  subdomain: string;
  site_data: any; // This will contain the full wizard form data
  status: string;
  template_type: string;
  created_at: string;
  is_public: boolean; // Ensure this is included
}

interface OverviewAndQuickActionsProps {
  siteData: SiteData;
}

export function OverviewAndQuickActions({ siteData }: OverviewAndQuickActionsProps) {
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  const siteStatus = siteData.status;
  const isPublic = siteData.is_public;

  // Construct dynamic URL using the new path-based routing
  const siteUrl = `${window.location.origin}/sites/${siteData.subdomain}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    toast.success("Lien du site copié !");
  };

  const handleViewSite = () => {
    window.open(siteUrl, "_blank");
  };

  const handleTogglePublish = async (publish: boolean) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/sites/${siteData.subdomain}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_public: publish }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(publish ? "Site publié avec succès !" : "Site dépublié avec succès !");
        router.refresh(); // Refresh the page to show updated status
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour du statut du site.");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">🌐 Vue d'Ensemble et Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut du Site */}
        <div className="flex items-center gap-4">
          {siteStatus === "published" ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <div>
            <p className="text-lg font-semibold">Statut du Site :</p>
            <Badge variant={siteStatus === "published" ? "default" : "destructive"} className="text-base px-3 py-1">
              {siteStatus === "published" ? "En ligne" : "Hors ligne"}
            </Badge>
          </div>
        </div>

        {/* Visibilité Publique */}
        <div className="flex items-center gap-4">
          <Globe className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-lg font-semibold">Visibilité Publique :</p>
            <Badge variant={isPublic ? "default" : "secondary"} className="text-base px-3 py-1">
              {isPublic ? "Visible par tous" : "Privé (visible par vous seul)"}
            </Badge>
          </div>
        </div>

        {/* Boutons Publier/Dépublier */}
        <div className="flex flex-col sm:flex-row gap-2">
          {isPublic ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleTogglePublish(false)}
              disabled={isUpdatingStatus}
            >
              Dépublier le site
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => handleTogglePublish(true)}
              disabled={isUpdatingStatus}
            >
              Publier le site
            </Button>
          )}
        </div>

        {/* Lien du Site */}
        <div>
          <p className="text-lg font-semibold mb-2">Lien du Site :</p>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={siteUrl}
              readOnly
              className="flex-1 bg-muted text-muted-foreground"
            />
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bouton d'Action Primaire */}
        <Button size="lg" className="w-full" onClick={handleViewSite}>
          <Eye className="mr-2 h-5 w-5" /> Voir le Site
        </Button>
      </CardContent>
    </Card>
  );
}