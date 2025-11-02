import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { is_public } = await request.json();

  if (typeof is_public !== 'boolean') {
    return NextResponse.json({ message: 'Invalid is_public value' }, { status: 400 });
  }

  // Vérifier d'abord que l'utilisateur est le propriétaire du site
  const { data: site, error: fetchError } = await supabase
    .from('sites')
    .select('user_id')
    .eq('subdomain', subdomain)
    .single();

  if (fetchError || !site) {
    console.error('Error fetching site for ownership check:', fetchError);
    return NextResponse.json({ message: 'Site not found or access denied' }, { status: 404 });
  }

  if (site.user_id !== user.id) {
    return NextResponse.json({ message: 'Forbidden: You do not own this site' }, { status: 403 });
  }

  // Mettre à jour le statut is_public
  const { error: updateError } = await supabase
    .from('sites')
    .update({ is_public: is_public })
    .eq('subdomain', subdomain)
    .eq('user_id', user.id); // S'assurer que seul le propriétaire peut mettre à jour

  if (updateError) {
    console.error('Error updating site public status:', updateError);
    return NextResponse.json({ message: 'Failed to update site status' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Site status updated successfully', is_public: is_public });
}