import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
  }

  try {
    // 1. Get site_id from subdomain
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('subdomain', subdomain)
      .eq('user_id', user.id) // Ensure user owns the site
      .single();

    if (siteError || !siteData) {
      console.error("Error fetching site ID for stats:", siteError);
      return NextResponse.json({ error: 'Site non trouvé ou non autorisé.' }, { status: 404 });
    }

    const site_id = siteData.id;

    // 2. Fetch real stats from site_analytics table
    const { data: analytics, error: analyticsError } = await supabase
      .from('site_analytics')
      .select('total_visits, total_sales, total_contacts')
      .eq('site_id', site_id)
      .single();

    if (analyticsError && analyticsError.code !== 'PGRST116') { // PGRST116 means "no rows found"
      console.error("Error fetching analytics data:", analyticsError);
      return NextResponse.json({ error: 'Erreur lors du chargement des statistiques.' }, { status: 500 });
    }

    // If no analytics data found, return zeros
    const stats = analytics || { total_visits: 0, total_sales: 0, total_contacts: 0 };

    return NextResponse.json({
      totalSales: `${stats.total_sales.toLocaleString()} F CFA`,
      totalVisits: stats.total_visits,
      totalContacts: stats.total_contacts,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for stats:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}