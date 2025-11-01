"use client";

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface PushSubscriptionObject {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications() {
  const supabase = createClient();
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      // If user logs out, consider unsubscribing or marking as not subscribed
      if (event === 'SIGNED_OUT') {
        setIsSubscribed(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const registerServiceWorker = React.useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser.');
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      toast.error('Échec de l\'enregistrement du Service Worker.');
      return null;
    }
  }, []);

  const getSubscription = React.useCallback(async (registration: ServiceWorkerRegistration) => {
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      setIsSubscribed(true);
      return existingSubscription;
    }
    setIsSubscribed(false);
    return null;
  }, []);

  const subscribeUser = React.useCallback(async () => {
    if (!user) {
      toast.info("Veuillez vous connecter pour activer les notifications.");
      return;
    }
    setIsLoading(true);
    try {
      const registration = await registerServiceWorker();
      if (!registration) return;

      const existingSubscription = await getSubscription(registration);
      if (existingSubscription) {
        toast.info("Vous êtes déjà abonné aux notifications.");
        setIsSubscribed(true);
        setIsLoading(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.warning("Permission de notification refusée.");
        setIsLoading(false);
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set.");
        toast.error("Clé VAPID publique manquante. Impossible de s'abonner.");
        setIsLoading(false);
        return;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Send subscription to your backend
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pushSubscription),
      });

      if (response.ok) {
        toast.success("Abonné aux notifications avec succès !");
        setIsSubscribed(true);
      } else {
        const errorData = await response.json();
        toast.error(`Échec de l'abonnement: ${errorData.error || 'Erreur inconnue'}`);
        console.error("Failed to save subscription on backend:", errorData);
      }
    } catch (error: any) {
      console.error('Failed to subscribe the user:', error);
      toast.error(`Erreur lors de l'abonnement: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, registerServiceWorker, getSubscription]);

  const unsubscribeUser = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        // Optionally, send a request to your backend to delete the subscription
        // For now, we'll just rely on the backend cleaning up expired ones.
        toast.info("Désabonné des notifications.");
        setIsSubscribed(false);
      } else {
        toast.info("Vous n'êtes pas abonné aux notifications.");
      }
    } catch (error: any) {
      console.error('Failed to unsubscribe the user:', error);
      toast.error(`Erreur lors du désabonnement: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  React.useEffect(() => {
    // Check initial subscription status when component mounts and user is available
    if (user) {
      registerServiceWorker().then(registration => {
        if (registration) {
          getSubscription(registration);
        }
      });
    }
  }, [user, registerServiceWorker, getSubscription]);

  return {
    isSubscribed,
    isLoading,
    subscribeUser,
    unsubscribeUser,
  };
}