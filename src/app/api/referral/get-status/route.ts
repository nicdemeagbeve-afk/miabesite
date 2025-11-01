import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_count, coin_points, referred_by')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile for referral status:", profileError);
      return NextResponse.json({ error: 'Profil non trouvé.' }, { status: 404 });
    }

    let referrerInfo = null;
    if (profile.referred_by) {
      const { data: referrerProfile, error: referrerProfileError } = await supabase
        .from('profiles')
        .select('full_name, referral_code')
        .eq('id', profile.referred_by)
        .single();
      
      if (referrerProfileError) {
        console.error("Error fetching referrer profile:", referrerProfileError);
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
    console.error("API route error for referral status:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}