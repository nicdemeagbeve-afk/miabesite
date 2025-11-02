"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Vérifier si l'application est déjà installée (pour masquer le bouton si c'est le cas)
      // Note: 'getInstalledRelatedApps' est une API expérimentale et peut ne pas être supportée partout.
      if (navigator.getInstalledRelatedApps) {
        navigator.getInstalledRelatedApps().then((relatedApps) => {
          if (relatedApps.length > 0) {
            setIsAppInstalled(true);
          }
        });
      }
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null); // L'application est installée, plus besoin de l'invite
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Vérifier si l'application est déjà en mode standalone (installée) au chargement
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('L\'utilisateur a accepté l\'installation de la PWA.');
        setIsAppInstalled(true);
      } else {
        console.log('L\'utilisateur a refusé l\'installation de la PWA.');
      }
      setDeferredPrompt(null); // Réinitialiser l'invite après utilisation
    }
  };

  if (!deferredPrompt || isAppInstalled) {
    return null; // Ne rien afficher si l'installation n'est pas possible ou si l'app est déjà installée
  }

  return (
    <Button onClick={handleInstallClick} variant="outline" size="sm" className="gap-1">
      <Download className="h-4 w-4" />
      Installer l'App
    </Button>
  );
}
