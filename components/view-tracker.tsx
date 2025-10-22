"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  destinationId: string;
}

export function ViewTracker({ destinationId }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/destinations/${destinationId}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    // Track view after a short delay to ensure page is loaded
    const timer = setTimeout(trackView, 1000);

    return () => clearTimeout(timer);
  }, [destinationId]);

  return null; // This component doesn't render anything
}
