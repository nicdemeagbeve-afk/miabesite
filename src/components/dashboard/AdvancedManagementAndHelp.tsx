"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Download, HelpCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface AdvancedManagementAndHelpProps {
  subdomain: string; // Add subdomain prop
}

export function AdvancedManagementAndHelp({ subdomain }: AdvancedManagementAndHelpProps) {
  const [customDomain, setCustomDomain] = React.useState("");
  const [isLinkingDomain, setIsLinkingDomain] = React.useState(false);
  const [isDownloadingCode, setIsDownloadingCode] = React.useState(false);

  const supportWhatsAppNumber = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER || "+22870832482"; // Use env var or default

  const handleLinkDomain = async () => {
    if (customDomain.trim() === "") {
      toast.error("Veuillez entrer un nom de domaine.");
      return;
    }
    setIsLinkingDomain(true);
    try {
      const response = await fetch(`/api/dashboard/domain-linking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subdomain, customDomain }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Erreur lors de la liaison du domaine.");
      }
    } catch (error) {
      console.error("Error linking domain:", error);
      toast.error("Une erreur inattendue est survenue lors de la liaison du domaine.");
    } finally {
      setIsLinkingDomain(false);
    }
  };

  const handleDownloadCode = async () => {
    setIsDownloadingCode(true);
    try {
      const response = await fetch(`/api/dashboard/download-code?subdomain=${subdomain}`, {
        method: 'GET',
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        // In a real scenario, the API would return a file, and you'd handle the download here.
        // For simulation, we just show a toast.
      } else {
        toast.error(result.error || "Erreur lors du téléchargement du code.");
      }
    } catch (error) {
      console.error("Error downloading code:", error);
      toast.error("Une erreur inattendue est survenue lors du téléchargement du code.");
    } finally {
      setIsDownloadingCode(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">⚙️ Gestion Avancée et Aide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domaine et Hébergement */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Domaine et Hébergement</h3>
          <p className="text-muted-foreground mb-4">
            Liez votre propre nom de domaine (ex: monaffaire.com) pour une présence plus professionnelle.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="monaffaire.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="flex-1"
              disabled={isLinkingDomain}
            />
            <Button onClick={handleLinkDomain} className="w-full sm:w-auto" disabled={isLinkingDomain}>
              <Globe className="mr-2 h-5 w-5" /> {isLinkingDomain ? "Liaison..." : "Lier le domaine"}
            </Button>
          </div>
        </div>

        {/* Téléchargement du Code */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Téléchargement du Code</h3>
          <p className="text-muted-foreground mb-4">
            Téléchargez le code source complet de votre site.
          </p>
          <Button onClick={handleDownloadCode} variant="outline" size="lg" className="w-full" disabled={isDownloadingCode}>
            <Download className="mr-2 h-5 w-5" /> {isDownloadingCode ? "Téléchargement..." : "Télécharger le code (ZIP)"}
          </Button>
        </div>

        {/* Aide et Support */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Aide et Support</h3>
          <p className="text-muted-foreground mb-4">
            Besoin d'aide ? Nous sommes là pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="secondary" className="flex-1">
              <Link href="#faq">
                <HelpCircle className="mr-2 h-5 w-5" /> FAQ
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-green-500 hover:bg-green-600 text-white">
              <Link href={`https://wa.me/${supportWhatsAppNumber}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> Support WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}