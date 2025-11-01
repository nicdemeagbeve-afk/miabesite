import React from "react";
import type { Metadata } from 'next';
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster

export const metadata: Metadata = {
  title: {
    default: "Tableau de Bord Admin",
    template: "%s | Admin Miabesite",
  },
  description: "Gérez les utilisateurs, les communautés et les paramètres système de Miabesite.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminRootLayout({ children }: AdminLayoutProps) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login/admin?message=Veuillez vous connecter pour accéder au tableau de bord administrateur.');
  }

  // Check user role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    redirect('/login/admin?message=Accès refusé. Vous n\'avez pas les permissions d\'administrateur.');
  }

  return (
    <>
      <AdminDashboardLayout>
        {children}
      </AdminDashboardLayout>
      <Toaster />
    </>
  );
}