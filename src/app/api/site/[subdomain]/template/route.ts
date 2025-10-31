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
    // Fetch the current site to check its existing template_type
    const { data: currentSite, error: fetchError } = await supabase
      .from('sites')
      .select('template_type')
      .eq('subdomain', subdomain)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !currentSite) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: fetchError?.message || 'Site not found or unauthorized' }, { status: 404 });
    }

    // Rule: A site's template can only be changed once from 'default'.
    // If the current template is NOT 'default', it means it has already been changed.
    if (currentSite.template_type !== 'default') {
      return NextResponse.json({ error: 'Le template de ce site a déjà été modifié une fois et ne peut plus être changé.' }, { status: 403 });
    }

    // If the current template is 'default' and the new template is also 'default',
    // it's a redundant update, but we can allow it or give a specific message.
    // For now, let's just prevent changing to the same 'default' template if it's already default.
    if (currentSite.template_type === 'default' && templateType === 'default') {
        return NextResponse.json({ error: 'Le template est déjà par défaut. Veuillez choisir un template différent pour le modifier.' }, { status: 400 });
    }


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