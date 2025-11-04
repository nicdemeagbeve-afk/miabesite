import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Pour l'instant, une réponse simple.
    // Plus tard, nous intégrerons un LLM (comme Gemini) et des outils ici.
    const aiResponse = `J'ai reçu votre message : "${message}". Je suis en cours de développement pour vous aider avec la gestion de votre compte et de vos sites.`;

    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error: any) {
    console.error("API route error for AI chat:", error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}