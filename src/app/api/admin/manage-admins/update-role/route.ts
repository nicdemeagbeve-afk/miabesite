import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const updateRoleSchema = z.object({
  identifier: z.string().optional(), // referralCode or email
  type: z.enum(['referralCode', 'email', 'userId']), // How to identify the user
  newRole: z.enum(['user', 'community_admin', 'super_admin']), // Added community_admin
  userId: z.string().uuid().optional(), // For direct user ID updates
}).refine(data => {
  // Ensure either identifier or userId is provided based on type
  if (data.type === 'userId') {
    return !!data.userId;
  }
  return !!data.identifier;
}, {
  message: "Un identifiant (code de parrainage, email ou ID utilisateur) est requis.",
  path: ["identifier"],
}).refine(data => {
  if (data.type === 'referralCode' && data.identifier && data.identifier.length !== 6) {
    return false;
  }
  return true;
}, {
  message: "Le code de parrainage doit contenir 6 caractères.",
  path: ["identifier"],
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
    return NextResponse.json({ error: 'Forbidden: Seuls les Super Admins peuvent modifier les rôles.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validationResult = updateRoleSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { identifier, type, newRole, userId } = validationResult.data;

    let targetUserId: string | null = null;

    // 2. Find the target user's ID based on the provided identifier and type
    if (type === 'referralCode' && identifier) {
      const { data: targetProfile, error: targetProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', identifier)
        .single();

      if (targetProfileError || !targetProfile) {
        return NextResponse.json({ error: 'Utilisateur non trouvé avec ce code de parrainage.' }, { status: 404 });
      }
      targetUserId = targetProfile.id;
    } else if (type === 'email' && identifier) {
      // Use listUsers and filter by email for admin operations
      const { data: usersList, error: listUsersError } = await supabase.auth.admin.listUsers({
        perPage: 100, // Adjust as needed, or implement pagination for very large user bases
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
    } else if (type === 'userId' && userId) {
      targetUserId = userId;
    } else {
      return NextResponse.json({ error: 'Type d\'identifiant ou identifiant manquant.' }, { status: 400 });
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Impossible de déterminer l\'utilisateur cible.' }, { status: 500 });
    }

    // Prevent a super_admin from changing their own role or another super_admin's role to something lower
    if (targetUserId === user.id && newRole !== 'super_admin') {
        return NextResponse.json({ error: 'Un Super Admin ne peut pas changer son propre rôle.' }, { status: 403 });
    }
    
    const { data: currentTargetProfile, error: currentTargetProfileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', targetUserId)
        .single();

    if (currentTargetProfileError || !currentTargetProfile) {
        return NextResponse.json({ error: 'Impossible de récupérer le rôle actuel de l\'utilisateur cible.' }, { status: 500 });
    }

    if (currentTargetProfile.role === 'super_admin' && newRole !== 'super_admin') {
        return NextResponse.json({ error: 'Un Super Admin ne peut pas rétrograder un autre Super Admin.' }, { status: 403 });
    }


    // 3. Update the target user's role in the 'profiles' table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUserId);

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return NextResponse.json({ error: updateError.message || 'Erreur lors de la mise à jour du rôle de l\'utilisateur.' }, { status: 500 });
    }

    return NextResponse.json({ message: `Rôle de l'utilisateur mis à jour à '${newRole}' avec succès !` }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for update-role:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}