import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const applyCodeSchema = z.object({
  referrerCode: z.string().length(6, "Le code de parrainage doit contenir 6 caractères."),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = applyCodeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid referrer code provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { referrerCode } = validationResult.data;

    // 1. Check if the current user has already been referred
    const { data: currentUserProfile, error: currentUserProfileError } = await supabase
      .from('profiles')
      .select('referred_by')
      .eq('id', user.id)
      .single();

    if (currentUserProfileError || !currentUserProfile) {
      console.error("Error fetching current user profile:", currentUserProfileError);
      return NextResponse.json({ error: 'Profil utilisateur non trouvé.' }, { status: 404 });
    }

    if (currentUserProfile.referred_by) {
      return NextResponse.json({ error: 'Vous avez déjà été parrainé.' }, { status: 400 });
    }

    // 2. Find the referrer by their code
    const { data: referrerProfile, error: referrerError } = await supabase
      .from('profiles')
      .select('id, referral_count, coin_points')
      .eq('referral_code', referrerCode)
      .single();

    if (referrerError || !referrerProfile) {
      return NextResponse.json({ error: 'Code de parrainage invalide ou non trouvé.' }, { status: 404 });
    }

    if (referrerProfile.id === user.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous parrainer vous-même.' }, { status: 400 });
    }

    // 3. Update the current user's profile to link to the referrer
    const { error: updateUserError } = await supabase
      .from('profiles')
      .update({ referred_by: referrerProfile.id })
      .eq('id', user.id);

    if (updateUserError) {
      console.error("Error updating referred_by for current user:", updateUserError);
      return NextResponse.json({ error: 'Erreur lors de la liaison du parrainage.' }, { status: 500 });
    }

    // 4. Update the referrer's profile: increment count and award points
    const newReferralCount = referrerProfile.referral_count + 1;
    let newCoinPoints = referrerProfile.coin_points;
    let awardedPoints = 0;

    if (newReferralCount % 2 === 0) { // Award 10 points for every 2 referrals
      newCoinPoints += 10;
      awardedPoints = 10;
    }

    const { error: updateReferrerError } = await supabase
      .from('profiles')
      .update({
        referral_count: newReferralCount,
        coin_points: newCoinPoints,
      })
      .eq('id', referrerProfile.id);

    if (updateReferrerError) {
      console.error("Error updating referrer profile:", updateReferrerError);
      // This is a non-critical error for the referred user, but log it.
    }

    return NextResponse.json({
      message: 'Parrainage appliqué avec succès !',
      awardedPoints: awardedPoints,
      newReferralCount: newReferralCount,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for apply-code:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}