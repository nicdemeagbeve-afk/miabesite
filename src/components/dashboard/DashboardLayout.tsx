"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="hidden lg:flex lg:w-64">
        <DashboardSidebar />
      </div>
      <div className="flex flex-col flex-1">
        {/* Mobile Header for sidebar toggle if needed, not implemented for simplicity */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}