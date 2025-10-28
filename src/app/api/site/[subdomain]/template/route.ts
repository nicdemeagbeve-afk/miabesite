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

  const { templateType } = await request.json();

  if (!templateType) {
    return NextResponse.json({ error: 'Template type is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('sites')
      .update({ template_type: templateType })
      .eq('subdomain', subdomain)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Site not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Template updated successfully', site: data[0] });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}