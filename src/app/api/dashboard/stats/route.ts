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

  // Simulate fetching real-time stats for the given subdomain
  // In a real application, this would query your analytics database
  const dummyStats = {
    totalSales: `${Math.floor(Math.random() * 1000000).toLocaleString()} F CFA`,
    totalVisits: Math.floor(Math.random() * 5000) + 100,
    totalContacts: Math.floor(Math.random() * 200) + 10,
  };

  return NextResponse.json(dummyStats, { status: 200 });
}