import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const transferCoinsSchema = z.object({
  recipientIdentifier: z.string().min(1, "L'identifiant du destinataire est requis."),
  identifierType: z.enum(['referralCode', 'email']),
  amount: z.number().int().min(1, "Le montant doit être au moins de 1 pièce."),
  description: z.string().max(200, "La description ne peut pas dépasser 200 caractères.").optional().or(z.literal('')),
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
    return NextResponse.json({ error: 'Forbidden: Seuls les Super Admins peuvent effectuer cette action.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validationResult = transferCoinsSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { recipientIdentifier, identifierType, amount, description } = validationResult.data;

    let recipientUserId: string | null = null;

    // 2. Find the recipient user's ID
    if (identifierType === 'referralCode') {
      const { data: recipientProfile, error: recipientProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', recipientIdentifier)
        .single();

      if (recipientProfileError || !recipientProfile) {
        return NextResponse.json({ error: 'Destinataire non trouvé avec ce code de parrainage.' }, { status: 404 });
      }
      recipientUserId = recipientProfile.id;
    } else if (identifierType === 'email') {
      const { data: usersList, error: listUsersError } = await supabase.auth.admin.listUsers({
        perPage: 100,
      });

      if (listUsersError) {
        console.error("Error listing users by admin:", listUsersError);
        return NextResponse.json({ error: 'Erreur lors de la recherche de l\'utilisateur par email.' }, { status: 500 });
      }

      const targetUser = usersList.users.find(u => u.email === recipientIdentifier);

      if (!targetUser) {
        return NextResponse.json({ error: 'Destinataire non trouvé avec cet email.' }, { status: 404 });
      }
      recipientUserId = targetUser.id;
    }

    if (!recipientUserId) {
      return NextResponse.json({ error: 'Impossible de déterminer l\'utilisateur destinataire.' }, { status: 500 });
    }

    // 3. Update recipient's coin_points
    const { data: currentRecipientProfile, error: fetchRecipientError } = await supabase
      .from('profiles')
      .select('coin_points')
      .eq('id', recipientUserId)
      .single();

    if (fetchRecipientError || !currentRecipientProfile) {
      console.error("Error fetching recipient profile for update:", fetchRecipientError);
      return NextResponse.json({ error: 'Impossible de récupérer le profil du destinataire pour la mise à jour.' }, { status: 500 });
    }

    const newCoinPoints = currentRecipientProfile.coin_points + amount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coin_points: newCoinPoints })
      .eq('id', recipientUserId);

    if (updateError) {
      console.error("Error updating recipient's coin points:", updateError);
      return NextResponse.json({ error: updateError.message || 'Erreur lors du crédit des pièces au destinataire.' }, { status: 500 });
    }

    // 4. Record transaction in coin_transactions table
    const { error: transactionError } = await supabase
      .from('coin_transactions')
      .insert({
        sender_id: user.id, // Admin is the sender
        recipient_id: recipientUserId,
        amount: amount,
        transaction_type: 'admin_credit',
        description: description || `Crédit par l'administrateur ${user.email}`,
      });

    if (transactionError) {
      console.error("Error recording coin transaction:", transactionError);
      // This is a non-critical error for the user, but log it.
    }

    return NextResponse.json({ message: `Transfert de ${amount} pièces vers le destinataire réussi !` }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for admin transfer-coins:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}