import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { siteEditorFormSchema } from '@/lib/schemas/site-editor-form-schema'; // Import the schema

// 1. Définissez le type des paramètres de route.
// Next.js injecte ces types dans le second argument.
interface RouteParams {
  subdomain: string;
}

// 2. Définissez l'interface complète du contexte de route.
// Utilisez 'Readonly' pour imiter la nature du contexte de Next.js.
interface RouteContext {
  params: RouteParams;
}

export async function PATCH(
  request: NextRequest,
  context: Readonly<RouteContext> // <-- Utilisez le type défini ici, enveloppé dans Readonly
) {
  // Déstructuration sécurisée
  const { subdomain } = context.params; 
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate the incoming data against the comprehensive schema
    const validationResult = siteEditorFormSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const validatedData = validationResult.data;

    // Update the site_data column with the new validated data
    const { data, error } = await supabase
      .from('sites')
      .update({ site_data: validatedData }) // Update the entire JSONB object
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

    return NextResponse.json({ message: 'Site content updated successfully', site: data[0] });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}