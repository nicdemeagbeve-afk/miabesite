import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { messageSchema } from '@/lib/schemas/message-schema'; // Import the new schema

export async function POST(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;
  const supabase = createClient();

  try {
    const body = await request.json();
    const validationResult = messageSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return NextResponse.json({ error: 'Invalid message data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { sender_name, sender_email, sender_phone, service_interested, message, product_name, product_price, product_currency, quantity } = validationResult.data;

    // 1. Get site_id from subdomain
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (siteError || !siteData) {
      console.error("Error fetching site ID:", siteError);
      return NextResponse.json({ error: 'Site non trouvé.' }, { status: 404 });
    }

    const site_id = siteData.id;

    // 2. Check message limit (30 messages per site)
    const { count, error: countError } = await supabase
      .from('site_messages')
      .select('id', { count: 'exact' })
      .eq('site_id', site_id);

    if (countError) {
      console.error("Error counting messages:", countError);
      return NextResponse.json({ error: 'Erreur lors de la vérification de la limite de messages.' }, { status: 500 });
    }

    if (count && count >= 30) {
      return NextResponse.json({ error: 'Ce site a atteint sa limite de 30 messages de contact. Veuillez contacter l\'administrateur du site.' }, { status: 429 });
    }

    // 3. Insert the new message
    const { data, error } = await supabase
      .from('site_messages')
      .insert({
        site_id,
        sender_name: sender_name || null,
        sender_email: sender_email || null,
        sender_phone: sender_phone || null,
        service_interested: service_interested || null,
        message,
        // Insert new fields
        product_name: product_name || null,
        product_price: product_price || null,
        product_currency: product_currency || null,
        quantity: quantity || null,
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message envoyé avec succès !', data: data[0] }, { status: 201 });

  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message || 'Une erreur inattendue est survenue' }, { status: 500 });
  }
}