"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function DashboardRootPage() {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to the sites listing page
    router.replace("/dashboard/sites");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <p className="text-lg text-muted-foreground">Redirection vers vos sites...</p>
    </div>
  );
}