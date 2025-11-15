"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

// Clé de stockage local pour s'assurer que le message n'est envoyé qu'une seule fois
const AI_WELCOME_MESSAGE_SENT_KEY = 'ai_welcome_message_sent';
const AI_WELCOME_MESSAGE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

interface AIWelcomeMessage {
  id: string;
  sender: 'ai';
  text: string;
}

/**
 * Hook pour gérer la logique de temporisation et déclencher le message de bienvenue de l'IA.
 * @returns {AIWelcomeMessage | null} Le message de bienvenue à afficher, ou null.
 */
export function useAIChatTrigger() {
  const pathname = usePathname();
  const [welcomeMessage, setWelcomeMessage] = useState<AIWelcomeMessage | null>(null);

  useEffect(() => {
    // 1. Vérifier si nous sommes sur une page du tableau de bord
    const isDashboard = pathname.startsWith('/dashboard');
    
    // 2. Vérifier si le message a déjà été envoyé
    const messageSent = localStorage.getItem(AI_WELCOME_MESSAGE_SENT_KEY);

    if (isDashboard && !messageSent) {
      const timer = setTimeout(() => {
        // Définir le message de bienvenue
        const message: AIWelcomeMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          text: `Bonjour ! Je suis Maître Control, votre assistant IA personnel pour Miabesite. Je suis là pour vous aider à gérer et optimiser vos sites.

Vous pouvez me demander :
- "Liste mes sites"
- "Quelles sont les statistiques de monsite ?"
- "Réécris ce slogan pour le rendre plus vendeur." (Utilisez le bouton IA dans l'éditeur)

N'hésitez pas à me poser vos questions !`,
        };
        
        setWelcomeMessage(message);
        localStorage.setItem(AI_WELCOME_MESSAGE_SENT_KEY, 'true');
        toast.info("Maître Control a un message pour vous ! Ouvrez la bulle de chat en bas à droite.");

      }, AI_WELCOME_MESSAGE_TIMEOUT_MS);

      // Nettoyage du timer si l'utilisateur quitte le tableau de bord ou le composant
      return () => clearTimeout(timer);
    }
    
    // Si l'utilisateur n'est pas sur le dashboard, on ne fait rien.
    // Si le message a déjà été envoyé, on ne fait rien.

  }, [pathname]);

  return welcomeMessage;
}