import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const COMMUNITY_UNLOCK_POINTS = 1000;

// Define the schema for community creation form (server-side validation)
const communityFormSchema = z.object({
  name: z.string().min(3, "Le nom de la communauté est requis et doit contenir au moins 3 caractères.").max(100, "Le nom ne peut pas dépasser 100 caractères."),
  objectives: z.string().min(20, "Les objectifs sont requis et doivent contenir au moins 20 caractères.").max(500, "Les objectifs ne peuvent pas dépasser 500 caractères."),
  template_1: z.string().min(1, "Veuillez choisir le premier template premium."),
  template_2: z.string().min(1, "Veuillez choisir le deuxième template premium."),
  category: z.string().min(1, "Veuillez choisir une catégorie pour votre communauté."),
  is_public: z.boolean().default(true), // New: Public/Private toggle
  join_code: z.string().length(6, "Le code de jointure doit contenir 6 chiffres.").optional().nullable(), // New: Optional join code
}).refine(data => data.template_1 !== data.template_2, {
  message: "Les deux templates choisis doivent être différents.",
  path: ["template_2"],
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = communityFormSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid community data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const communityData = validationResult.data;

    // 1. Check user's coin points for authorization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('coin_points')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching user profile for community creation:", profileError);
      return NextResponse.json({ error: 'Profil utilisateur non trouvé.' }, { status: 404 });
    }

    if (profile.coin_points < COMMUNITY_UNLOCK_POINTS) {
      return NextResponse.json({ error: `Vous avez besoin de ${COMMUNITY_UNLOCK_POINTS} pièces pour créer une communauté. Vous avez actuellement ${profile.coin_points} pièces.` }, { status: 403 });
    }

    // 2. Insert the new community into the 'communities' table
    const { data: newCommunity, error: insertError } = await supabase
      .from('communities')
      .insert({
        owner_id: user.id,
        name: communityData.name,
        objectives: communityData.objectives,
        template_1: communityData.template_1,
        template_2: communityData.template_2,
        category: communityData.category,
        is_public: communityData.is_public,
        join_code: communityData.join_code, // Insert the generated join code
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting new community:", insertError);
      return NextResponse.json({ error: insertError.message || 'Erreur lors de la création de la communauté.' }, { status: 500 });
    }

    // 3. Add the owner as the first member of the community
    const { error: memberInsertError } = await supabase
      .from('community_members')
      .insert({
        community_id: newCommunity.id,
        user_id: user.id,
      });

    if (memberInsertError) {
      console.error("Error adding owner as community member:", memberInsertError);
      // This is a critical error, consider rolling back community creation or logging for manual fix
      return NextResponse.json({ error: memberInsertError.message || 'Erreur lors de l\'ajout du propriétaire comme membre de la communauté.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Communauté créée avec succès !', communityId: newCommunity.id }, { status: 201 });

  } catch (error: any) {
    console.error("API route error for community creation:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}