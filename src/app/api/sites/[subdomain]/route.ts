import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Vérifier d'abord que l'utilisateur est le propriétaire du site
  const { data: site, error: fetchError } = await supabase
    .from('sites')
    .select('id, user_id')
    .eq('subdomain', subdomain)
    .single();

  if (fetchError || !site) {
    console.error('Error fetching site for ownership check:', fetchError);
    return NextResponse.json({ message: 'Site non trouvé ou accès refusé' }, { status: 404 });
  }

  if (site.user_id !== user.id) {
    return NextResponse.json({ message: 'Forbidden: Vous n\'êtes pas le propriétaire de ce site' }, { status: 403 });
  }

  // Supprimer le site
  const { error: deleteError } = await supabase
    .from('sites')
    .delete()
    .eq('id', site.id);

  if (deleteError) {
    console.error('Error deleting site:', deleteError);
    return NextResponse.json({ message: 'Échec de la suppression du site' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Site supprimé avec succès' });
}