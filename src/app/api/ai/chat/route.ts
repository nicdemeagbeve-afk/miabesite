import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'; // Import SchemaType
import { createClient } from '@/lib/supabase/server'; // Import server-side Supabase client

// Assurez-vous que votre clé API Gemini est définie dans vos variables d'environnement
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY n'est pas définie dans les variables d'environnement.");
  // En production, vous pourriez vouloir empêcher le démarrage de l'application ou désactiver la fonctionnalité IA.
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export async function POST(request: Request) {
  const supabase = createClient(); // Initialize Supabase client for server-side operations

  try {
    const { message, history } = await request.json(); // 'history' will be used for multi-turn conversations

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
      Vous pouvez utiliser les outils disponibles pour aider l'utilisateur.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      tools: [
        {
          functionDeclarations: [
            {
              name: "list_user_sites",
              description: "Liste tous les sites web créés par l'utilisateur actuel.",
              parameters: {
                type: SchemaType.OBJECT, // Correction ici
                properties: {}, // Pas de paramètres pour cette fonction
              },
            },
            {
              name: "get_site_stats",
              description: "Récupère les statistiques (ventes, visites, contacts) pour un site web spécifique de l'utilisateur.",
              parameters: {
                type: SchemaType.OBJECT, // Correction ici
                properties: {
                  subdomain: {
                    type: SchemaType.STRING, // Correction ici
                    description: "Le sous-domaine du site web pour lequel récupérer les statistiques (ex: 'monsite').",
                  },
                },
                required: ["subdomain"],
              },
            },
          ],
        },
      ],
    });

    const chat = model.startChat({
      history: history || [], // Initialize chat history
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    const functionCalls = response.functionCalls(); 
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0]; // Accéder au premier élément du tableau

      if (functionCall.name === "list_user_sites") {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          return NextResponse.json({
            response: "Je ne peux pas lister vos sites car vous n'êtes pas connecté. Veuillez vous connecter d'abord.",
            tool_code: "UNAUTHORIZED"
          }, { status: 200 });
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/sites`, {
          headers: {
            // IMPORTANT: In a real scenario, you'd need to pass authentication headers
            // or ensure your internal API route can be called securely from here.
            // For this example, we're assuming the /dashboard/sites API route
            // handles its own authentication check via Supabase server client.
          },
        });

        if (!apiResponse.ok) {
          console.error("Error fetching user sites from internal API:", apiResponse.status, await apiResponse.text());
          return NextResponse.json({
            response: "Désolé, je n'ai pas pu récupérer la liste de vos sites pour le moment. Veuillez réessayer plus tard.",
            tool_code: "API_ERROR"
          }, { status: 200 });
        }

        const sitesData = await apiResponse.json();
        
        // Send the tool result back to Gemini to generate a natural language response
        const toolResponse = await chat.sendMessage([
          {
            functionCall: functionCall,
          },
          {
            functionResponse: {
              name: "list_user_sites",
              response: sitesData, // Send the actual data back
            },
          },
        ]);
        return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
      } else if (functionCall.name === "get_site_stats") {
        const { subdomain } = functionCall.args as { subdomain: string }; 

        if (!subdomain) {
          return NextResponse.json({
            response: "Veuillez spécifier le sous-domaine du site pour lequel vous souhaitez les statistiques.",
            tool_code: "MISSING_SUBDOMAIN"
          }, { status: 200 });
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          return NextResponse.json({
            response: "Je ne peux pas récupérer les statistiques de vos sites car vous n'êtes pas connecté. Veuillez vous connecter d'abord.",
            tool_code: "UNAUTHORIZED"
          }, { status: 200 });
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/stats?subdomain=${subdomain}`, {
          headers: {
            // Same authentication considerations as above
          },
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          console.error(`Error fetching stats for ${subdomain}:`, apiResponse.status, errorData);
          return NextResponse.json({
            response: `Désolé, je n'ai pas pu récupérer les statistiques pour le site "${subdomain}". ${errorData.error || 'Veuillez vérifier le sous-domaine et réessayer.'}`,
            tool_code: "API_ERROR"
          }, { status: 200 });
        }

        const statsData = await apiResponse.json();

        const toolResponse = await chat.sendMessage([
          {
            functionCall: functionCall,
          },
          {
            functionResponse: {
              name: "get_site_stats",
              response: statsData,
            },
          },
        ]);
        return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
      }
    }

    // If no tool call, return the direct text response from Gemini
    const text = response.text();
    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("API route error for AI chat with Gemini:", error);
    // Fournir un message d'erreur plus convivial à l'utilisateur
    return NextResponse.json({ error: 'Une erreur est survenue lors de la génération de la réponse par l\'IA. Veuillez réessayer.' }, { status: 500 });
  }
}