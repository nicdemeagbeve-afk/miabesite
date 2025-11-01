"use client";

import React from 'react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function PushNotificationInitializer() {
  const { isSubscribed, isLoading, subscribeUser, unsubscribeUser } = usePushNotifications();

  // You can add a UI element here to allow users to subscribe/unsubscribe
  // For now, we'll just initialize the logic.
  // A button could be placed in the user profile settings, for example.

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={isSubscribed ? unsubscribeUser : subscribeUser}
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isSubscribed ? (
              <Bell className="h-5 w-5 text-green-500" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="sr-only">{isSubscribed ? "Désactiver les notifications" : "Activer les notifications"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isLoading ? "Chargement..." : isSubscribed ? "Notifications activées" : "Notifications désactivées"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}