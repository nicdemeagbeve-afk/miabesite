import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This is the webhook endpoint that Green-API will send messages to.
// It should be configured in your Green-API instance settings.
export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    console.log("Received WhatsApp webhook event:", JSON.stringify(body, null, 2));

    // --- Basic validation and message extraction (adjust based on Green-API's exact payload structure) ---
    // Green-API's payload can vary. This is a common structure for incoming messages.
    // You might need to inspect the actual payload from Green-API to refine this.
    const messageData = body.messages?.[0] || body.messageData; // Example: check for 'messages' array or direct 'messageData'
    const senderNumber = messageData?.senderData?.sender || messageData?.sender; // Example: sender number
    const messageContent = messageData?.textMessage || messageData?.message; // Example: text message content

    if (!senderNumber || !messageContent) {
      console.warn("Webhook: Missing sender number or message content in payload.");
      return NextResponse.json({ message: 'Missing sender or message content' }, { status: 400 });
    }

    // --- Placeholder for Phase 2: Linking Logic ---
    // In Phase 2, you will check if this message is a link code.
    // If it is, you'll link the user's WhatsApp number to their profile in Supabase.
    // For now, we'll just log it.
    console.log(`Message from ${senderNumber}: ${messageContent}`);

    // --- Placeholder for Phase 3: Gemini AI Integration ---
    // After linking, or if the user is already linked, you'll pass the message
    // to your Gemini AI function to generate a response.
    // const aiResponse = await callGemini(messageContent, senderNumber);

    // --- Placeholder for Phase 4: Sending Response via Green-API ---
    // Once Gemini generates a response, you'll send it back to the user via Green-API.
    // await sendMessageToWhatsApp(senderNumber, aiResponse);

    // For now, just acknowledge receipt
    return NextResponse.json({ message: 'Webhook received successfully', sender: senderNumber, content: messageContent }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing WhatsApp webhook:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}

// Note: For security, you might want to implement a secret token verification
// to ensure the request truly comes from Green-API.
// Example: Check for a custom header or a token in the request body.