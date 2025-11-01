"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Import Link

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setIsVisible(false);
    // Optionally, implement logic to disable non-essential cookies here
    // For this example, we'll just hide the banner.
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[999] p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg",
      "flex flex-col md:flex-row items-center justify-between gap-4"
    )}>
      <Card className="w-full md:w-auto flex-1 border-none shadow-none bg-transparent">
        <CardContent className="p-0 text-sm text-muted-foreground">
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre{" "}
            <Link href="/legal" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Politique de Confidentialité
            </Link>
            .
          </p>
        </CardContent>
      </Card>
      <div className="flex gap-2 w-full md:w-auto">
        <Button onClick={handleAccept} className="flex-1 md:flex-none">Accepter</Button>
        <Button onClick={handleDecline} variant="outline" className="flex-1 md:flex-none">Refuser</Button>
        <Button onClick={() => setIsVisible(false)} variant="ghost" size="icon" className="md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}