"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function AdminRootPage() {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to the admin overview page
    router.replace("/admin/overview");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <p className="text-lg text-muted-foreground">Redirection vers le tableau de bord administrateur...</p>
    </div>
  );
}