import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("API /referral/get-status: Unauthorized - No user or userError:", userError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Le trigger SQL handle_new_user() est maintenant responsable de la création du profil.
    // Ici, nous nous contentons de le récupérer.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_count, coin_points, referred_by, full_name')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Si le profil n'est pas trouvé, cela indique un problème avec le trigger ou la propagation.
      // Le frontend devrait gérer cela en demandant un rechargement ou une reconnexion.
      console.error(`API /referral/get-status: No profile found for user ${user.id}. Trigger might be delayed or failed.`);
      return NextResponse.json({ error: 'Profil utilisateur non trouvé. Veuillez réessayer de vous connecter.' }, { status: 404 });
    } else if (profileError) {
      console.error("API /referral/get-status: Error fetching existing profile:", profileError);
      return NextResponse.json({ error: profileError.message || 'Erreur lors du chargement du profil.' }, { status: 500 });
    }

    if (!profile) {
        console.error("API /referral/get-status: Profile is null after fetch.");
        return NextResponse.json({ error: 'Profil non trouvé après tentative de récupération.' }, { status: 404 });
    }

    let referrerInfo = null;
    if (profile.referred_by) {
      const { data: referrerProfile, error: referrerProfileError } = await supabase
        .from('profiles')
        .select('full_name, referral_code')
        .eq('id', profile.referred_by)
        .single();
      
      if (referrerProfileError) {
        console.error("API /referral/get-status: Error fetching referrer profile:", referrerProfileError);
      } else {
        referrerInfo = {
          fullName: referrerProfile?.full_name,
          referralCode: referrerProfile?.referral_code,
        };
      }
    }

    return NextResponse.json({
      referralCode: profile.referral_code,
      referralCount: profile.referral_count,
      coinPoints: profile.coin_points,
      referredBy: referrerInfo,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API /referral/get-status: Unexpected API route error:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}