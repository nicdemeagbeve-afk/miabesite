import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
  }

  // Simulate code packaging and download
  console.log(`User ${user.id} requesting code download for site ${subdomain}`);

  // In a real application, this would involve:
  // 1. Fetching the site's data and assets
  // 2. Generating the site's code based on the template and data
  // 3. Compressing the code into a ZIP file
  // 4. Serving the ZIP file to the user

  // For now, simulate a file download by returning a dummy file or a success message
  // A real download would set appropriate headers (Content-Disposition, Content-Type)
  return NextResponse.json({ message: `Code download initiated for site ${subdomain}. This is a simulation. A ZIP file would typically be served here.` }, { status: 200 });
}