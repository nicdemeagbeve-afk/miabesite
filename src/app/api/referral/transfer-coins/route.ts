import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const transferCoinsSchema = z.object({
  recipientCode: z.string().length(5, "Le code du destinataire doit contenir 5 chiffres."),
  amount: z.number().int().min(1, "Le montant doit être au moins de 1 point."),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = transferCoinsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid transfer data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { recipientCode, amount } = validationResult.data;

    // 1. Get sender's profile and check balance
    const { data: senderProfile, error: senderError } = await supabase
      .from('profiles')
      .select('id, coin_points, full_name')
      .eq('id', user.id)
      .single();

    if (senderError || !senderProfile) {
      console.error("Error fetching sender profile:", senderError);
      return NextResponse.json({ error: 'Profil de l\'expéditeur non trouvé.' }, { status: 404 });
    }

    if (senderProfile.coin_points < amount) {
      return NextResponse.json({ error: 'Fonds insuffisants pour le transfert.' }, { status: 400 });
    }

    // 2. Find recipient by referral code
    const { data: recipientProfile, error: recipientError } = await supabase
      .from('profiles')
      .select('id, coin_points, full_name')
      .eq('referral_code', recipientCode)
      .single();

    if (recipientError || !recipientProfile) {
      return NextResponse.json({ error: 'Code de destinataire invalide ou non trouvé.' }, { status: 404 });
    }

    if (senderProfile.id === recipientProfile.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous transférer des points à vous-même.' }, { status: 400 });
    }

    // 3. Perform the transfer (decrement sender, increment recipient)
    const { error: updateSenderError } = await supabase
      .from('profiles')
      .update({ coin_points: senderProfile.coin_points - amount })
      .eq('id', senderProfile.id);

    if (updateSenderError) {
      console.error("Error updating sender's coin points:", updateSenderError);
      return NextResponse.json({ error: 'Erreur lors du débit des points de l\'expéditeur.' }, { status: 500 });
    }

    const { error: updateRecipientError } = await supabase
      .from('profiles')
      .update({ coin_points: recipientProfile.coin_points + amount })
      .eq('id', recipientProfile.id);

    if (updateRecipientError) {
      console.error("Error updating recipient's coin points:", updateRecipientError);
      // If recipient update fails, consider rolling back sender's points
      return NextResponse.json({ error: 'Erreur lors du crédit des points du destinataire.' }, { status: 500 });
    }

    return NextResponse.json({
      message: `Transfert de ${amount} points vers ${recipientProfile.full_name || recipientCode} réussi !`,
      senderNewBalance: senderProfile.coin_points - amount,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for transfer-coins:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}