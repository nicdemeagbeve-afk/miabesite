import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { primaryColor, secondaryColor, showTestimonials, showSkills } = await request.json();

  if (!primaryColor && !secondaryColor && typeof showTestimonials !== 'boolean' && typeof showSkills !== 'boolean') {
    return NextResponse.json({ error: 'No design parameters provided for update.' }, { status: 400 });
  }

  try {
    // First, fetch the existing site_data
    const { data: existingSite, error: fetchError } = await supabase
      .from('sites')
      .select('site_data')
      .eq('subdomain', subdomain)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingSite) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: fetchError?.message || 'Site not found or unauthorized' }, { status: 404 });
    }

    const currentSiteData = existingSite.site_data || {};
    const updatedSiteData = { ...currentSiteData };

    if (primaryColor) updatedSiteData.primaryColor = primaryColor;
    if (secondaryColor) updatedSiteData.secondaryColor = secondaryColor;
    
    // Ensure sectionsVisibility object exists
    updatedSiteData.sectionsVisibility = updatedSiteData.sectionsVisibility || {};

    if (typeof showTestimonials === 'boolean') updatedSiteData.sectionsVisibility.showTestimonials = showTestimonials;
    if (typeof showSkills === 'boolean') updatedSiteData.sectionsVisibility.showSkills = showSkills;


    const { data, error: updateError } = await supabase
      .from('sites')
      .update({ site_data: updatedSiteData })
      .eq('subdomain', subdomain)
      .eq('user_id', user.id)
      .select();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Site not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Design updated successfully', site: data[0] });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}