import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const joinCommunitySchema = z.object({
  communityId: z.string().uuid("ID de communauté invalide."),
  isPublic: z.boolean(),
  joinCode: z.string().length(6, "Le code de jointure doit contenir 6 chiffres.").optional().nullable(),
});

const MAX_COMMUNITY_MEMBERS = 100;

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = joinCommunitySchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid join data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { communityId, isPublic, joinCode } = validationResult.data;

    // 1. Check if user is already a member
    const { count: existingMembershipCount, error: existingMembershipError } = await supabase
      .from('community_members')
      .select('id', { count: 'exact' })
      .eq('community_id', communityId)
      .eq('user_id', user.id);

    if (existingMembershipError) {
      console.error("Error checking existing membership:", existingMembershipError);
      return NextResponse.json({ error: 'Erreur lors de la vérification de l\'adhésion.' }, { status: 500 });
    }

    if ((existingMembershipCount || 0) > 0) {
      return NextResponse.json({ error: 'Vous êtes déjà membre de cette communauté.' }, { status: 400 });
    }

    // 2. Fetch community details to verify public/private status and join code
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('is_public, join_code')
      .eq('id', communityId)
      .single();

    if (communityError || !community) {
      console.error("Error fetching community details:", communityError);
      return NextResponse.json({ error: 'Communauté non trouvée.' }, { status: 404 });
    }

    // Verify join conditions
    if (!community.is_public) {
      // Private community, check join code
      if (!joinCode || community.join_code !== joinCode) {
        return NextResponse.json({ error: 'Code de jointure invalide pour cette communauté privée.' }, { status: 403 });
      }
    } else {
      // Public community, ensure no join code was provided (or it's ignored)
      // For now, we'll just proceed, but could add a check if joinCode is unexpectedly present for public
    }

    // 3. Check community member limit
    const { count: currentMemberCount, error: countError } = await supabase
      .from('community_members')
      .select('id', { count: 'exact' })
      .eq('community_id', communityId);

    if (countError) {
      console.error("Error counting current members:", countError);
      return NextResponse.json({ error: 'Erreur lors de la vérification de la limite de membres.' }, { status: 500 });
    }

    if ((currentMemberCount || 0) >= MAX_COMMUNITY_MEMBERS) {
      return NextResponse.json({ error: `Cette communauté a atteint sa limite de ${MAX_COMMUNITY_MEMBERS} membres.` }, { status: 400 });
    }

    // 4. Add user to community_members
    const { error: insertMemberError } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: user.id,
      });

    if (insertMemberError) {
      console.error("Error inserting community member:", insertMemberError);
      return NextResponse.json({ error: insertMemberError.message || 'Erreur lors de l\'ajout à la communauté.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vous avez rejoint la communauté avec succès !' }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for joining community:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}