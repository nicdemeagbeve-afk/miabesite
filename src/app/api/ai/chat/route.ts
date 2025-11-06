import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import SiteEditorFormData type
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY n'est pas définie dans les variables d'environnement.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Helper function to fetch, update, and save site_data in Supabase.
 * Ensures user ownership and handles JSONB merging.
 */
async function updateSiteData(
  supabase: SupabaseClient,
  userId: string,
  subdomain: string,
  updates: Partial<SiteEditorFormData>
) {
  // 1. Fetch the existing site data
  const { data: site, error: fetchError } = await supabase
    .from('sites')
    .select('id, site_data')
    .eq('user_id', userId)
    .eq('subdomain', subdomain)
    .single();

  if (fetchError || !site) {
    throw new Error('Site non trouvé ou non autorisé.');
  }

  // 2. Merge existing site_data with new updates
  const currentSiteData = site.site_data as SiteEditorFormData;
  const updatedSiteData = {
    ...currentSiteData,
    ...updates,
    // Special handling for nested objects like sectionsVisibility
    sectionsVisibility: {
      ...currentSiteData.sectionsVisibility,
      ...updates.sectionsVisibility,
    },
  };

  // 3. Update the site_data column
  const { error: updateError } = await supabase
    .from('sites')
    .update({ site_data: updatedSiteData })
    .eq('id', site.id);

  if (updateError) {
    throw new Error(`Erreur lors de la mise à jour du site: ${updateError.message}`);
  }

  return updatedSiteData;
}


export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'L\'API Gemini n\'est pas configurée. Veuillez vérifier la clé API.' }, { status: 500 });
    }

    const systemInstruction = `
      Vous êtes un assistant IA utile pour Miabesite, une plateforme de création et de gestion de sites web.
      Votre objectif est d'aider les utilisateurs avec des questions et des tâches *strictement liées aux services de Miabesite,
      à la création de sites web, à la gestion de sites, aux fonctionnalités, au design, à l'édition de contenu,
      et à tout autre aspect concernant directement la plateforme*.
      Si un utilisateur pose une question qui est en dehors de ce domaine (par exemple, des connaissances générales,
      des conseils personnels, des sujets non liés), vous devez poliment refuser de répondre et le rediriger
      vers des questions concernant Miabesite. Ne vous engagez pas dans des conversations hors sujet.
      Vous pouvez utiliser les outils disponibles pour aider l'utilisateur.
      Lorsque vous fournissez des informations, assurez-vous qu'elles sont claires, concises et bien formatées pour une lisibilité parfaite.
      - Utilisez des paragraphes pour organiser les idées.
      - Utilisez des sauts de ligne pour séparer les informations importantes.
      Soyez extrêmement bref et rapide dans vos réponses, ne donnez que les informations essentielles sans paragraphes longs, listes à puces ou caractères spéciaux comme les tirets ou les astérisques.
      Si l'utilisateur demande des statistiques pour 'chaque' site ou pour 'tous' ses sites après avoir listé ses sites,
      vous devez appeler l'outil 'get_site_stats' pour chaque sous-domaine listé et compiler les résultats dans une réponse unique et bien formatée.
      Si l'utilisateur demande de réécrire un texte pour le rendre plus accrocheur, plus vendeur ou plus marketing, utilisez l'outil 'rewrite_site_text'.
      Pour les tâches complexes comme la création de nouveaux sites, la modification de votre profil (y compris les téléchargements d'images et les mots de passe),
      ou les paramètres avancés comme la liaison de domaines personnalisés ou l'exportation de code, vous devez informer l'utilisateur que ces tâches
      nécessitent une interaction directe avec l'interface utilisateur ou des processus spécifiques.
      Redirigez-le vers la page appropriée ou expliquez-lui comment procéder manuellement.
      Par exemple, pour créer un site, dites : "Je ne peux pas créer un site directement pour vous, mais vous pouvez le faire facilement en allant sur la page 'Créer un site' de votre tableau de bord."
      Pour modifier le profil, dites : "Je ne peux pas modifier votre profil directement, mais vous pouvez le faire sur la page 'Profil & Paramètres' de votre tableau de bord."
      Pour les fonctionnalités avancées comme la liaison de domaine ou l'exportation de code, dites : "Ces fonctionnalités avancées sont prévues pour la version 2 de Miabesite et ne sont pas encore disponibles. Vous pouvez consulter la page 'Gestion Avancée' de votre site pour plus d'informations."
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
                type: SchemaType.OBJECT,
                properties: {},
              },
            },
            {
              name: "get_site_stats",
              description: "Récupère les statistiques (ventes, visites, contacts) pour un site web spécifique de l'utilisateur.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: {
                    type: SchemaType.STRING,
                    description: "Le sous-domaine du site web pour lequel récupérer les statistiques (ex: 'monsite').",
                  },
                },
                required: ["subdomain"],
              },
            },
            {
              name: "rewrite_site_text",
              description: "Réécrit un champ de texte spécifique d'un site web pour le rendre plus accrocheur, plus vendeur ou plus marketing. Les champs disponibles sont : 'heroSlogan', 'aboutStory', 'productDescription' (pour un produit spécifique), 'testimonialQuote' (pour un témoignage spécifique), 'skillDescription' (pour une compétence spécifique).",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: {
                    type: SchemaType.STRING,
                    description: "Le sous-domaine du site web à modifier (ex: 'monsite').",
                  },
                  field_name: {
                    type: SchemaType.STRING,
                    description: "Le nom du champ de texte à réécrire (ex: 'heroSlogan', 'aboutStory', 'productDescription', 'testimonialQuote', 'skillDescription').",
                  },
                  current_text: {
                    type: SchemaType.STRING,
                    description: "Le texte actuel du champ à réécrire.",
                  },
                  new_text: {
                    type: SchemaType.STRING,
                    description: "Le nouveau texte réécrit par l'IA, plus accrocheur et vendeur.",
                  },
                },
                required: ["subdomain", "field_name", "current_text", "new_text"],
              },
            },
          ],
        },
      ],
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0];

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return NextResponse.json({
          response: "Je ne peux pas effectuer cette action car vous n'êtes pas connecté. Veuillez vous connecter d'abord.",
          tool_code: "UNAUTHORIZED"
        }, { status: 200 });
      }

      if (functionCall.name === "list_user_sites") {
        const { data: sitesData, error: fetchSitesError } = await supabase
          .from('sites')
          .select('subdomain, site_data->publicName, status, template_type')
          .eq('user_id', user.id);

        if (fetchSitesError) {
          console.error("Error fetching user sites from Supabase:", fetchSitesError);
          return NextResponse.json({
            response: "Désolé, je n'ai pas pu récupérer la liste de vos sites pour le moment. Veuillez réessayer plus tard.",
            tool_code: "API_ERROR"
          }, { status: 200 });
        }

        let responseText = "";
        if (!sitesData || sitesData.length === 0) {
          responseText = "Vous n'avez aucun site enregistré dans votre compte.";
        } else {
          responseText = `Vous avez ${sitesData.length} site(s) : \n\n`;
          sitesData.forEach((site: any) => {
            responseText += `Nom public: ${site.publicName || 'Non défini'} \n`;
            responseText += `Sous-domaine: ${site.subdomain} \n`;
            responseText += `Statut: ${site.status} \n`;
            responseText += `Template: ${site.template_type} \n\n`;
          });
        }
        
        // Directly return the formatted text
        return NextResponse.json({ response: responseText }, { status: 200 });

      } else if (functionCall.name === "get_site_stats") {
        const { subdomain } = functionCall.args as { subdomain: string };

        if (!subdomain) {
          return NextResponse.json({
            response: "Veuillez spécifier le sous-domaine du site pour lequel vous souhaitez les statistiques.",
            tool_code: "MISSING_SUBDOMAIN"
          }, { status: 200 });
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/stats?subdomain=${subdomain}`, {
          headers: {
            // No specific headers needed as Supabase server client handles auth
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

        // Format the stats data directly into a readable string
        const formattedStats = `Voici les statistiques pour le site ${subdomain} : \n` +
                               `Ventes totales : ${statsData.totalSales} \n` +
                               `Visites totales : ${statsData.totalVisits} \n` +
                               `Contacts totaux : ${statsData.totalContacts} \n\n`;
        
        return NextResponse.json({ response: formattedStats }, { status: 200 });

      } else if (functionCall.name === "rewrite_site_text") {
        const { subdomain, field_name, new_text } = functionCall.args as { subdomain: string; field_name: keyof SiteEditorFormData; current_text: string; new_text: string; };

        if (!subdomain || !field_name || !new_text) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine, le nom du champ et le nouveau texte." }, { status: 200 });
        }

        // Validate field_name to prevent arbitrary updates
        const allowedFields: (keyof SiteEditorFormData)[] = ['heroSlogan', 'aboutStory']; // Add other fields as needed
        if (!allowedFields.includes(field_name)) {
          return NextResponse.json({ response: `Le champ '${field_name}' ne peut pas être réécrit directement par l'IA. Veuillez choisir parmi : ${allowedFields.join(', ')}.` }, { status: 200 });
        }

        try {
          const updates: Partial<SiteEditorFormData> = { [field_name]: new_text };
          await updateSiteData(supabase, user.id, subdomain, updates);
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "rewrite_site_text", response: { success: true, message: `Le champ '${field_name}' du site "${subdomain}" a été réécrit avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error rewriting site text:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu réécrire le texte du site "${subdomain}". ${error.message}` }, { status: 200 });
        }
      }
    }

    const text = response.text();
    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("API route error for AI chat with Gemini:", error);
    return NextResponse.json({ error: 'Une erreur est survenue lors de la génération de la réponse par l\'IA. Veuillez réessayer.' }, { status: 500 });
  }
}