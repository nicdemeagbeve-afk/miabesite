import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // Utiliser le paramètre 'next' pour définir la destination finale après l'échange de code
  const next = requestUrl.searchParams.get('next') || '/dashboard/sites'; // Default redirect to dashboard/sites

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Si successful, redirect to the 'next' path
      return NextResponse.redirect(requestUrl.origin + next);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(requestUrl.origin + '/login?message=Impossible de se connecter. Veuillez réessayer.');
}