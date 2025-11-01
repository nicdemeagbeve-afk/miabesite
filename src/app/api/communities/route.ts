import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';

  try {
    let query = supabase
      .from('communities')
      .select('*, community_members(count)') // Select communities and count members
      .or(`is_public.eq.true,owner_id.eq.${user.id}`); // User can see public communities or their own

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: communities, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching communities:", fetchError);
      return NextResponse.json({ error: 'Erreur lors du chargement des communautés.' }, { status: 500 });
    }

    // Process communities to include member count and check if user is a member
    const communitiesWithDetails = await Promise.all(communities.map(async (comm: any) => {
      // Count members for each community
      const { count: memberCount, error: countError } = await supabase
        .from('community_members')
        .select('id', { count: 'exact' })
        .eq('community_id', comm.id);

      if (countError) {
        console.error(`Error counting members for community ${comm.id}:`, countError);
      }

      // Check if current user is a member
      const { count: isMemberCount, error: isMemberError } = await supabase
        .from('community_members')
        .select('id', { count: 'exact' })
        .eq('community_id', comm.id)
        .eq('user_id', user.id);

      if (isMemberError) {
        console.error(`Error checking membership for community ${comm.id}:`, isMemberError);
      }

      return {
        ...comm,
        member_count: memberCount || 0,
        is_member: (isMemberCount || 0) > 0,
      };
    }));

    return NextResponse.json({ communities: communitiesWithDetails }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for communities:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}