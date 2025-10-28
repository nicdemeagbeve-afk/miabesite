"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Link as LinkIcon, Eye, Copy } from "lucide-react";
import { toast } from "sonner";

export function OverviewAndQuickActions() {
  // Placeholder for site status and URL. In a real app, these would come from an API.
  const siteStatus = "online"; // Can be "online" or "offline"
  const siteUrl = "https://monentreprise.miabesite.site";
  const recentViews = 37; // Placeholder for recent views

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    toast.success("Lien du site copié !");
  };

  const handleViewSite = () => {
    window.open(siteUrl, "_blank");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">🌐 Vue d'Ensemble et Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut du Site */}
        <div className="flex items-center gap-4">
          {siteStatus === "online" ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <div>
            <p className="text-lg font-semibold">Statut du Site :</p>
            <Badge variant={siteStatus === "online" ? "default" : "destructive"} className="text-base px-3 py-1">
              {siteStatus === "online" ? "En ligne" : "Hors ligne"}
            </Badge>
          </div>
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

        {/* Vues Récentes (Optionnel) */}
        <div>
          <p className="text-lg font-semibold">Vues Récentes (7 derniers jours) :</p>
          <p className="text-2xl font-bold text-primary">{recentViews} visites</p>
        </div>

        {/* Bouton d'Action Primaire */}
        <Button size="lg" className="w-full" onClick={handleViewSite}>
          <Eye className="mr-2 h-5 w-5" /> Voir le Site
        </Button>
      </CardContent>
    </Card>
  );
}