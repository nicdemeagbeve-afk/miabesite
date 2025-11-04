import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Assurez-vous que votre clé API Gemini est définie dans vos variables d'environnement
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY n'est pas définie dans les variables d'environnement.");
  // En production, vous pourriez vouloir empêcher le démarrage de l'application ou désactiver la fonctionnalité IA.
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'L\'API Gemini n\'est pas configurée. Veuillez vérifier la clé API.' }, { status: 500 });
    }

    // Instruction système pour guider le comportement de l'IA
    const systemInstruction = `
      Vous êtes un assistant IA utile pour Miabesite, une plateforme de création et de gestion de sites web.
      Votre objectif est d'aider les utilisateurs avec des questions et des tâches *strictement liées aux services de Miabesite,
      à la création de sites web, à la gestion de sites, aux fonctionnalités, au design, à l'édition de contenu,
      et à tout autre aspect concernant directement la plateforme*.
      Si un utilisateur pose une question qui est en dehors de ce domaine (par exemple, des connaissances générales,
      des conseils personnels, des sujets non liés), vous devez poliment refuser de répondre et le rediriger
      vers des questions concernant Miabesite. Ne vous engagez pas dans des conversations hors sujet.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction, // Ajout de l'instruction système ici
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("API route error for AI chat with Gemini:", error);
    // Fournir un message d'erreur plus convivial à l'utilisateur
    return NextResponse.json({ error: 'Une erreur est survenue lors de la génération de la réponse par l\'IA. Veuillez réessayer.' }, { status: 500 });
  }
}