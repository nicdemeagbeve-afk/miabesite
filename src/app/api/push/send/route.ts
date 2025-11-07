import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import webpush from 'web-push';
import * as z from 'zod';

// Ensure VAPID keys are set in environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT; // e.g., mailto:contact@miabesite.com

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
  console.error("VAPID keys or subject are not set in environment variables. Push notifications will not work.");
  // In a real app, you might want to throw an error or handle this more gracefully.
} else {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

const notificationPayloadSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  body: z.string().min(1, "Le corps du message est requis."),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  image: z.string().url().optional(),
  data: z.record(z.any()).optional(), // Arbitrary data
  url: z.string().url().optional(), // URL to open on click
});

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Only allow super_admins to send notifications
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden: Seuls les Super Admins peuvent envoyer des notifications push.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validationResult = notificationPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error for notification payload:", validationResult.error);
      return NextResponse.json({ error: 'Invalid notification payload provided', details: validationResult.error.flatten() }, { status: 400 });
    }

    const payload = validationResult.data;

    // Fetch all push subscriptions from Supabase
    const { data: subscriptions, error: fetchSubscriptionsError } = await supabase
      .from('push_subscriptions')
      .select('id, subscription');

    if (fetchSubscriptionsError) {
      console.error("Error fetching push subscriptions:", fetchSubscriptionsError);
      return NextResponse.json({ error: 'Error fetching subscriptions.' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No active subscriptions found.' }, { status: 200 });
    }

    const notificationPromises = subscriptions.map(async (sub) => {
      try {
        // The subscription object from Supabase is already in the correct format for web-push
        await webpush.sendNotification(
          sub.subscription as webpush.PushSubscription, // Cast to correct type
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon,
            badge: payload.badge,
            image: payload.image,
            data: {
              url: payload.url || '/', // Default URL to open on click
              ...payload.data,
            },
          })
        );
        return { status: 'fulfilled', id: sub.id };
      } catch (error: any) {
        console.error(`Failed to send notification to ${sub.id}:`, error);
        // If subscription is no longer valid, delete it from the database
        if (error.statusCode === 410 || error.statusCode === 404) { // GONE or Not Found
          console.log(`Deleting expired subscription ${sub.id}`);
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        return { status: 'rejected', id: sub.id, error: error.message };
      }
    });

    const results = await Promise.allSettled(notificationPromises);
    const fulfilled = results.filter(r => r.status === 'fulfilled').length;
    const rejected = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      message: `Notifications sent. Fulfilled: ${fulfilled}, Rejected: ${rejected}.`,
      results,
    }, { status: 200 });

  } catch (error: any) {
    console.error("API route error for push send:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}