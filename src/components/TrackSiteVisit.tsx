"use client";

import React from "react";
import { useEffect } from "react";
import { toast } from "sonner";

interface TrackSiteVisitProps {
  subdomain: string;
}

export function TrackSiteVisit({ subdomain }: TrackSiteVisitProps) {
  useEffect(() => {
    async function trackVisit() {
      try {
        const response = await fetch(`/api/site/${subdomain}/track-visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Body can be empty for a simple visit track
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to track visit:", errorData.error);
          // Optionally show a toast, but usually not for background tracking
        } else {
          // console.log("Visit tracked successfully.");
        }
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    }

    if (subdomain) {
      trackVisit();
    }
  }, [subdomain]);

  return null; // This component doesn't render anything
}