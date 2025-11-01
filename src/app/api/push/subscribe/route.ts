import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = subscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error for push subscription:", validationResult.error);
      return NextResponse.json({ error: 'Invalid subscription data provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const subscription = validationResult.data;

    // Check if this subscription already exists for the user
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('subscription->>endpoint', subscription.endpoint)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
      console.error("Error checking existing subscription:", fetchError);
      return NextResponse.json({ error: 'Error checking existing subscription.' }, { status: 500 });
    }

    if (existingSubscription) {
      return NextResponse.json({ message: 'Subscription already exists.' }, { status: 200 });
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id: user.id,
        subscription: subscription,
      });

    if (insertError) {
      console.error("Error inserting push subscription:", insertError);
      return NextResponse.json({ error: insertError.message || 'Error saving subscription.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription saved successfully.' }, { status: 201 });

  } catch (error: any) {
    console.error("API route error for push subscribe:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}