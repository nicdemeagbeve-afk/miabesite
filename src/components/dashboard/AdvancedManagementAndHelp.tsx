"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Download, HelpCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface AdvancedManagementAndHelpProps {
  subdomain: string;
}

export function AdvancedManagementAndHelp({ subdomain }: AdvancedManagementAndHelpProps) {
  const [customDomain, setCustomDomain] = React.useState("");

  const handleLinkDomain = () => {
    if (customDomain.trim() === "") {
      toast.error("Veuillez entrer un nom de domaine.");
      return;
    }
    // Simulate domain linking process
    toast.info(`Tentative de liaison du domaine : ${customDomain} pour le site ${subdomain}. Cela peut prendre quelques minutes.`);
    console.log("Liaison du domaine:", customDomain, "pour le site:", subdomain);
    // In a real app, this would trigger an API call
  };

  const handleDownloadCode = () => {
    // Simulate code download
    toast.success("Le téléchargement du code source va commencer.");
    console.log("Téléchargement du code source pour le site:", subdomain);
    // In a real app, this would initiate a file download
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
            />
            <Button onClick={handleLinkDomain} className="w-full sm:w-auto">
              <Globe className="mr-2 h-5 w-5" /> Lier le domaine
            </Button>
          </div>
        </div>

        {/* Téléchargement du Code */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Téléchargement du Code</h3>
          <p className="text-muted-foreground mb-4">
            Téléchargez le code source complet de votre site.
          </p>
          <Button onClick={handleDownloadCode} variant="outline" size="lg" className="w-full">
            <Download className="mr-2 h-5 w-5" /> Télécharger le code (ZIP)
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
              <Link href="https://wa.me/votre_numero_whatsapp" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> Support WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}