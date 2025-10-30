import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;
  const supabase = createClient();

  try {
    // 1. Get site_id from subdomain
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (siteError || !siteData) {
      console.error("Error fetching site ID for visit tracking:", siteError);
      return NextResponse.json({ error: 'Site non trouvé.' }, { status: 404 });
    }

    const site_id = siteData.id;

    // 2. Check if analytics entry exists, if not, create it
    const { data: existingAnalytics, error: fetchAnalyticsError } = await supabase
      .from('site_analytics')
      .select('id, total_visits')
      .eq('site_id', site_id)
      .single();

    if (fetchAnalyticsError && fetchAnalyticsError.code !== 'PGRST116') { // PGRST116 means "no rows found"
      console.error("Error fetching existing analytics:", fetchAnalyticsError);
      return NextResponse.json({ error: 'Erreur lors de la récupération des statistiques existantes.' }, { status: 500 });
    }

    if (existingAnalytics) {
      // Increment total_visits
      const { error: updateError } = await supabase
        .from('site_analytics')
        .update({ total_visits: existingAnalytics.total_visits + 1, last_updated: new Date().toISOString() })
        .eq('id', existingAnalytics.id);

      if (updateError) {
        console.error("Error updating visit count:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      // Create new analytics entry and set initial visit to 1
      const { error: insertError } = await supabase
        .from('site_analytics')
        .insert({ site_id, total_visits: 1, total_sales: 0, total_contacts: 0 });

      if (insertError) {
        console.error("Error inserting new analytics entry:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Visite du site enregistrée avec succès.' }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for visit tracking:", error);
    return NextResponse.json({ error: error.message || 'Une erreur inattendue est survenue' }, { status: 500 });
  }
}