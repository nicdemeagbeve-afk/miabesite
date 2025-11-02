import React from "react";
import { ManageAdmins } from "@/components/admin/ManageAdmins";
import type { Metadata } from 'next';
import { AdminImpersonationTool } from "@/components/admin/AdminImpersonationTool"; // Import the new component
import { createClient } from "@/lib/supabase/server"; // Import server-side Supabase client

export const metadata: Metadata = {
  title: "Gérer les Admins",
  description: "Ajoutez ou supprimez des administrateurs système pour la plateforme Miabesite.",
};

export default async function ManageAdminsPage() {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  let isSuperAdmin = false;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!profileError && profile && profile.role === 'super_admin') {
      isSuperAdmin = true;
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Gérer les Administrateurs</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <ManageAdmins />
        {isSuperAdmin && (
          <>
            <div className="my-8 border-t border-border pt-8" />
            <AdminImpersonationTool />
          </>
        )}
      </div>
    </div>
  );
}