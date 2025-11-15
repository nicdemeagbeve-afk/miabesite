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
    // Fetch communities and check membership status in one go using a lateral join or similar structure
    // Since we cannot use complex joins easily in the API route without a custom function,
    // we will fetch the communities and rely on the RLS to filter what the user can see.
    // We will fetch the member count separately for simplicity and robustness against RLS issues.
    
    let query = supabase
      .from('communities')
      .select('*, community_members(user_id)') // Select all community fields and the list of member user_ids
      .or(`is_public.eq.true,owner_id.eq.${user.id},community_members.user_id.eq.${user.id}`); // RLS should handle this filtering

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

    // Process communities to calculate member count and check if user is a member
    const communitiesWithDetails = communities.map((comm: any) => {
      const members = comm.community_members || [];
      const memberCount = members.length;
      const isMember = members.some((member: { user_id: string }) => member.user_id === user.id);

      return {
        ...comm,
        member_count: memberCount,
        is_member: isMember,
        community_members: undefined, // Remove the raw list of members
      };
    });

    return NextResponse.json({ communities: communitiesWithDetails }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for communities:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}