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
    // 1. Fetch all communities that are public OR where the current user is the owner.
    // RLS should handle filtering based on membership for private communities.
    let query = supabase
      .from('communities')
      .select(`
        id,
        name,
        objectives,
        category,
        is_public,
        join_code,
        owner_id,
        community_members(user_id)
      `);

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

    // 2. Process communities to calculate member count and check if user is a member
    const communitiesWithDetails = communities
      .filter((comm: any) => comm.is_public || comm.owner_id === user.id || (comm.community_members && comm.community_members.some((member: { user_id: string }) => member.user_id === user.id)))
      .map((comm: any) => {
        const members = comm.community_members || [];
        const memberCount = members.length;
        const isMember = members.some((member: { user_id: string }) => member.user_id === user.id);

        return {
          id: comm.id,
          name: comm.name,
          objectives: comm.objectives,
          category: comm.category,
          is_public: comm.is_public,
          join_code: comm.join_code,
          owner_id: comm.owner_id,
          member_count: memberCount,
          is_member: isMember,
        };
      });

    return NextResponse.json({ communities: communitiesWithDetails }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for communities:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}