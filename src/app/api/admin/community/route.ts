import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CommunityCreationSchema } from '@/lib/schemas/community-schema';
import { generateUniqueCommunityJoinCode } from '@/lib/utils';

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Vérifier le rôle de l'utilisateur - seul un super_admin peut créer des communautés via ce panneau
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'super_admin') {
    console.error("API: Accès refusé pour la création de communauté. Rôle:", profile?.role, "Erreur:", profileError);
    return NextResponse.json({ message: 'Forbidden: Super Admin access required' }, { status: 403 });
  }

  const body = await request.json();
  const validation = CommunityCreationSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ message: 'Invalid data', errors: validation.error.flatten() }, { status: 400 });
  }

  const { name, description, utility, positioningDomain, template_1, template_2, category, is_public } = validation.data;

  try {
    let joinCode: string | null = null;
    if (!is_public) {
      joinCode = await generateUniqueCommunityJoinCode(supabase);
    }

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name,
        description,
        utility,
        positioning_domain: positioningDomain,
        template_1,
        template_2,
        category,
        is_public,
        join_code: joinCode,
        owner_id: user.id, // L'administrateur qui crée la communauté en est le propriétaire initial
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase lors de l'insertion de la communauté:", error);
      return NextResponse.json({ message: `Failed to create community: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Community created successfully', community: data }, { status: 201 });

  } catch (error: any) {
    console.error("Erreur inattendue lors de la création de la communauté:", error);
    return NextResponse.json({ message: `An unexpected error occurred: ${error.message}` }, { status: 500 });
  }
}