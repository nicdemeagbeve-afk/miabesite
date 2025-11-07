import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CommunityCreationForm } from '@/components/admin/CommunityCreationForm';
import React from 'react';

export default async function CommunityManagementPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?message=unauthorized');
  }

  // Vérifier le rôle de l'utilisateur - seul un super_admin peut gérer les communautés via ce panneau
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'super_admin') {
    console.error("Accès refusé: L'utilisateur n'est pas un super_admin ou profil introuvable.", profileError);
    redirect('/dashboard?message=super_admin_required'); // Rediriger vers le tableau de bord avec un message
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Communautés</h1>
      <p className="text-lg mb-8">Créez de nouvelles communautés pour votre plateforme.</p>
      <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Créer une nouvelle Communauté</h2>
        <CommunityCreationForm />
      </div>
    </div>
  );
}