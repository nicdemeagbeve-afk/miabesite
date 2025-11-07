import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if the user is a super_admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden: Seuls les Super Admins peuvent accéder aux statistiques.' }, { status: 403 });
  }

  try {
    // Fetch total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
    if (usersError) throw usersError;

    // Fetch total communities
    const { count: totalCommunities, error: communitiesError } = await supabase
      .from('communities')
      .select('id', { count: 'exact', head: true });
    if (communitiesError) throw communitiesError;

    // Fetch public communities
    const { count: totalPublicCommunities, error: publicCommunitiesError } = await supabase
      .from('communities')
      .select('id', { count: 'exact', head: true })
      .eq('is_public', true);
    if (publicCommunitiesError) throw publicCommunitiesError;

    // Fetch private communities
    const { count: totalPrivateCommunities, error: privateCommunitiesError } = await supabase
      .from('communities')
      .select('id', { count: 'exact', head: true })
      .eq('is_public', false);
    if (privateCommunitiesError) throw privateCommunitiesError;

    // Fetch super admins (no more 'admin' system role)
    const { count: totalSuperAdmins, error: superAdminsError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'super_admin');
    if (superAdminsError) throw superAdminsError;

    // Fetch community admins
    const { count: totalCommunityAdmins, error: communityAdminsError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'community_admin');
    if (communityAdminsError) throw communityAdminsError;


    // Fetch templates usage
    const { data: communitiesData, error: templatesError } = await supabase
      .from('communities')
      .select('template_1, template_2');
    if (templatesError) throw templatesError;

    const templatesUsed: { [key: string]: number } = {};
    communitiesData?.forEach(comm => {
      templatesUsed[comm.template_1] = (templatesUsed[comm.template_1] || 0) + 1;
      templatesUsed[comm.template_2] = (templatesUsed[comm.template_2] || 0) + 1;
    });

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalCommunities: totalCommunities || 0,
      totalPublicCommunities: totalPublicCommunities || 0,
      totalPrivateCommunities: totalPrivateCommunities || 0,
      totalAdmins: totalCommunityAdmins || 0, // Renamed to reflect community admins
      totalSuperAdmins: totalSuperAdmins || 0,
      templatesUsed,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for admin stats:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}