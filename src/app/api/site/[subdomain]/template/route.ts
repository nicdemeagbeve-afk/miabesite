import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const templateUpdateSchema = z.object({
  templateType: z.string().min(1, { message: "Le type de template est requis." }),
});

export async function PATCH(request: Request, { params }: { params: { subdomain: string } }) {
  const supabase = createClient();
  const { subdomain } = params;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { templateType } = templateUpdateSchema.parse(body);

    // First, verify that the user owns the site
    const { data: site, error: fetchError } = await supabase
      .from('sites')
      .select('id')
      .eq('subdomain', subdomain)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !site) {
      console.error('Error fetching site or user does not own it:', fetchError);
      return NextResponse.json({ error: 'Site non trouvé ou vous n\'êtes pas autorisé à le modifier.' }, { status: 404 });
    }

    // Update the template_type for the site
    const { data, error: updateError } = await supabase
      .from('sites')
      .update({ template_type: templateType })
      .eq('id', site.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating site template:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Template mis à jour avec succès !', site: data }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données de formulaire invalides', details: error.errors }, { status: 400 });
    }
    console.error('Unexpected error during template update:', error);
    return NextResponse.json({ error: 'Une erreur inattendue est survenue.' }, { status: 500 });
  }
}