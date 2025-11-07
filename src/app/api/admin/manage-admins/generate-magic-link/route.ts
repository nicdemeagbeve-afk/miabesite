import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const generateMagicLinkSchema = z.object({
  identifier: z.string().min(1, "L'identifiant (email ou ID utilisateur) est requis."),
  identifierType: z.enum(['email', 'userId']),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Check if the requesting user is a super_admin
  const { data: requesterProfile, error: requesterProfileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (requesterProfileError || !requesterProfile || requesterProfile.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden: Seuls les Super Admins peuvent générer des liens magiques.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validationResult = generateMagicLinkSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { identifier, identifierType } = validationResult.data;

    let targetUserId: string | null = null;
    let targetUserEmail: string | null = null;

    // 2. Find the target user's ID and email based on the provided identifier
    if (identifierType === 'email') {
      const { data: usersList, error: listUsersError } = await supabase.auth.admin.listUsers({
        perPage: 100,
      });

      if (listUsersError) {
        console.error("Error listing users by admin:", listUsersError);
        return NextResponse.json({ error: 'Erreur lors de la recherche de l\'utilisateur par email.' }, { status: 500 });
      }

      const targetUser = usersList.users.find(u => u.email === identifier);

      if (!targetUser) {
        return NextResponse.json({ error: 'Utilisateur non trouvé avec cet email.' }, { status: 404 });
      }
      targetUserId = targetUser.id;
      targetUserEmail = targetUser.email ?? null; // Fixed: Coalesce undefined to null
    } else if (identifierType === 'userId') {
      const { data: targetUser, error: fetchUserError } = await supabase.auth.admin.getUserById(identifier);
      if (fetchUserError || !targetUser) {
        return NextResponse.json({ error: 'Utilisateur non trouvé avec cet ID.' }, { status: 404 });
      }
      targetUserId = targetUser.user.id;
      targetUserEmail = targetUser.user.email ?? null; // Fixed: Coalesce undefined to null
    }

    if (!targetUserId || !targetUserEmail) {
      return NextResponse.json({ error: 'Impossible de déterminer l\'utilisateur cible.' }, { status: 500 });
    }

    // 3. Verify the target user is a super_admin (only super_admins can be impersonated for admin dashboard)
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', targetUserId)
      .single();

    if (targetProfileError || !targetProfile || targetProfile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Accès refusé: L\'utilisateur cible n\'est pas un Super Administrateur.' }, { status: 403 });
    }

    // 4. Generate the magic link
    const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUserEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/overview`, // Redirect to admin dashboard
      },
    });

    if (magicLinkError) {
      console.error("Error generating magic link:", magicLinkError);
      return NextResponse.json({ error: magicLinkError.message || 'Erreur lors de la génération du lien magique.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Lien magique généré avec succès !', actionLink: magicLinkData.properties.action_link }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for generate-magic-link:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}