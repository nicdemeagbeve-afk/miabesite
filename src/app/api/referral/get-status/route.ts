import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueReferralCode } from '@/lib/utils'; // Import the utility function

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("API /referral/get-status: Unauthorized - No user or userError:", userError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code, referral_count, coin_points, referred_by, full_name, email') // Added full_name, email for profile creation fallback
      .eq('id', user.id)
      .single();

    // If profile not found, create it
    if (profileError && profileError.code === 'PGRST116') { // PGRST116 means "no rows found"
      console.warn(`API /referral/get-status: No profile found for user ${user.id}, attempting to create one.`);
      
      let referralCode: string | null = null;
      try {
        referralCode = await generateUniqueReferralCode(supabase);
      } catch (codeError: any) {
        console.error("API /referral/get-status: Failed to generate referral code for new user:", codeError);
        // If code generation fails, we should probably stop here or create profile without code
        return NextResponse.json({ error: `Erreur lors de la génération du code de parrainage: ${codeError.message}` }, { status: 500 });
      }

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          date_of_birth: user.user_metadata?.date_of_birth || null,
          phone_number: user.user_metadata?.phone_number || '',
          whatsapp_number: user.user_metadata?.phone_number || '', // Default to phone_number
          expertise: user.user_metadata?.expertise || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          referral_code: referralCode,
          coin_points: 0,
          referral_count: 0,
        })
        .select('referral_code, referral_count, coin_points, referred_by, full_name, email') // Select the same fields again
        .single();

      if (insertError) {
        console.error("API /referral/get-status: Error creating new profile:", insertError);
        return NextResponse.json({ error: insertError.message || 'Erreur lors de la création du profil.' }, { status: 500 });
      }
      profile = newProfile; // Use the newly created profile
    } else if (profileError) {
      console.error("API /referral/get-status: Error fetching existing profile:", profileError);
      return NextResponse.json({ error: profileError.message || 'Erreur lors du chargement du profil.' }, { status: 500 });
    }

    // If profile is still null after attempted creation (shouldn't happen with above logic)
    if (!profile) {
        console.error("API /referral/get-status: Profile is null after fetch and attempted creation.");
        return NextResponse.json({ error: 'Profil non trouvé après tentative de création.' }, { status: 404 });
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
        // This is a non-critical error for the main referral status, so we log but don't fail the request.
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