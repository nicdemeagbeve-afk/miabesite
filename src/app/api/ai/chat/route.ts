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
    const { message, history, current_site_subdomain, tool_code, tool_args } = await request.json(); // Added tool_code and tool_args

    if (!message && !tool_code) { // Allow direct tool calls without a message
      return NextResponse.json({ error: 'Message or tool_code is required' }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'L\'API Gemini n\'est pas configurée. Veuillez vérifier la clé API.' }, { status: 500 });
    }

    const systemInstruction = `
      Vous êtes Maître Control (MC), un assistant IA expert pour Miabesite, une plateforme de création et de gestion de sites web.
      Votre objectif principal est d'aider les utilisateurs à créer des sites web avec des accroches percutantes, des textes marketing et des designs attrayants.
      Vous devez guider les utilisateurs dans la conception de leur site, que ce soit à travers le wizard de création ou en répondant à leurs questions spécifiques.
      Vos réponses doivent être cohérentes, concises, basées sur les données disponibles (y compris la documentation de Miabesite) et orientées marketing.
      Ne vous engagez pas dans des conversations hors sujet.
      Lorsque vous fournissez des informations, assurez-vous qu'elles sont claires, concises et bien formatées pour une lisibilité parfaite.
      - Utilisez des paragraphes pour organiser les idées.
      - Utilisez des sauts de ligne pour séparer les informations importantes.
      Soyez extrêmement bref et rapide dans vos réponses, ne donnez que les informations essentielles sans paragraphes longs, listes à puces ou caractères spéciaux comme les tirets ou les astérisques.
      Pour les tâches complexes comme la création de nouveaux sites, la modification de votre profil (y compris les téléchargements d'images et les mots de passe),
      ou les paramètres avancés comme la liaison de domaines personnalisés ou l'exportation de code, vous devez informer l'utilisateur que ces tâches
      nécessitent une interaction directe avec l'interface utilisateur ou des processus spécifiques.
      Redirigez-le vers la page appropriée ou expliquez-lui comment procéder manuellement.
      Par exemple, pour créer un site, dites : "Je ne peux pas créer un site directement pour vous, mais vous pouvez le faire facilement en allant sur la page 'Créer un site' de votre tableau de bord."
      Pour modifier le profil, dites : "Je ne peux pas modifier votre profil directement, mais vous pouvez le faire sur la page 'Profil & Paramètres' de votre tableau de bord."
      Pour les fonctionnalités avancées comme la liaison de domaine ou l'exportation de code, dites : "Ces fonctionnalités avancées sont prévues pour la version 2 de Miabesite et ne sont pas encore disponibles. Vous pouvez consulter la page 'Gestion Avancée' de votre site pour plus d'informations."
      La génération de vidéos IA coûte 60 pièces. Actuellement, 2000 pièces équivalent à 4300 XOF, 7.5 USD et 6.5 GBP. Un moyen de paiement sera intégré prochainement.

      ${current_site_subdomain ? `
      L'utilisateur est actuellement sur le site avec le sous-domaine '${current_site_subdomain}'.
      Toutes les questions ou demandes concernant un site doivent être interprétées comme se référant à ce sous-domaine,
      SAUF si l'utilisateur mentionne explicitement un autre sous-domaine dans sa requête.
      Si une fonction d'outil nécessite un 'subdomain' et que l'utilisateur n'en fournit pas explicitement un dans sa requête,
      vous devez utiliser la valeur de '${current_site_subdomain}' pour cet appel de fonction.
      ` : ''}
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
              name: "generate_rewritten_text", // New tool for text rewriting
              description: "Génère une version plus accrocheuse, vendeuse ou marketing d'un texte donné pour un champ spécifique du site. Le texte généré sera retourné à l'utilisateur pour qu'il puisse l'utiliser.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  current_text: {
                    type: SchemaType.STRING,
                    description: "Le texte actuel du champ à réécrire.",
                  },
                  field_name: {
                    type: SchemaType.STRING,
                    description: "Le nom du champ de texte à réécrire (ex: 'heroSlogan', 'aboutStory', 'productDescription', 'testimonialQuote', 'skillDescription').",
                  },
                  subdomain: { // Optional, for context if AI needs to know which site
                    type: SchemaType.STRING,
                    description: "Le sous-domaine du site web auquel le champ appartient (ex: 'monsite').",
                    optional: true,
                  },
                },
                required: ["current_text", "field_name"],
              },
            },
          ],
        },
      ],
    });

    const chat = model.startChat({
      history: history || [],
    });

    let response;
    if (tool_code === "generate_rewritten_text" && tool_args) {
      // If it's a direct tool call from the frontend for rewriting text
      const { current_text, field_name, subdomain } = tool_args;
      const rewritePrompt = `Réécris le texte suivant pour le champ "${field_name}" du site "${subdomain || 'non spécifié'}" afin de le rendre plus accrocheur, vendeur et marketing. Le texte original est : "${current_text}". Ne réponds qu'avec le nouveau texte réécrit, sans préambule ni fioritures.`;
      response = await chat.sendMessage(rewritePrompt);
    } else {
      // Normal chat message
      response = await chat.sendMessage(message);
    }

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
        
        return NextResponse.json({ response: responseText }, { status: 200 });

      } else if (functionCall.name === "get_site_stats") {
        const subdomain = (functionCall.args as { subdomain?: string }).subdomain || current_site_subdomain;

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

        const formattedStats = `Voici les statistiques pour le site ${subdomain} : \n` +
                               `Ventes totales : ${statsData.totalSales} \n` +
                               `Visites totales : ${statsData.totalVisits} \n` +
                               `Contacts totaux : ${statsData.totalContacts} \n\n`;
        
        return NextResponse.json({ response: formattedStats }, { status: 200 });

      } else if (functionCall.name === "generate_rewritten_text") {
        const { current_text, field_name, subdomain } = functionCall.args as { current_text: string; field_name: string; subdomain?: string; };
        const rewritePrompt = `Réécris le texte suivant pour le champ "${field_name}" du site "${subdomain || 'non spécifié'}" afin de le rendre plus accrocheur, vendeur et marketing. Le texte original est : "${current_text}". Ne réponds qu'avec le nouveau texte réécrit, sans préambule ni fioritures.`;
        const rewriteResponse = await chat.sendMessage(rewritePrompt);
        return NextResponse.json({ response: rewriteResponse.response.text() }, { status: 200 });
      }
    }

    const text = response.text();
    return NextResponse.json({ response: text }, { status: 200 });
  } catch (error: any) {
    console.error("API route error for AI chat with Gemini:", error);
    return NextResponse.json({ error: 'Une erreur est survenue lors de la génération de la réponse par l\'IA. Veuillez réessayer.' }, { status: 500 });
  }
}