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
              name: "update_site_hero_content",
              description: "Met à jour le slogan de la section héro et/ou l'histoire/mission 'À Propos' d'un site web.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: {
                    type: SchemaType.STRING,
                    description: "Le sous-domaine du site web à modifier (ex: 'monsite').",
                  },
                  heroSlogan: {
                    type: SchemaType.STRING,
                    description: "Le nouveau slogan accrocheur pour la section héro (max 100 caractères).",
                  },
                  aboutStory: {
                    type: SchemaType.STRING,
                    description: "La nouvelle histoire ou mission pour la section 'À Propos' (max 500 caractères).",
                  },
                },
                required: ["subdomain"],
              },
            },
            {
              name: "update_site_design",
              description: "Met à jour les couleurs principales/secondaires, l'URL du logo ou l'URL de l'image de fond de la section héro d'un site web.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: {
                    type: SchemaType.STRING,
                    description: "Le sous-domaine du site web à modifier (ex: 'monsite').",
                  },
                  primaryColor: {
                    type: SchemaType.STRING,
                    description: "La nouvelle couleur principale du site (ex: 'blue', 'red', 'green').",
                  },
                  secondaryColor: {
                    type: SchemaType.STRING,
                    description: "La nouvelle couleur secondaire du site (ex: 'yellow', 'purple', 'orange').",
                  },
                  logoOrPhotoUrl: {
                    type: SchemaType.STRING,
                    description: "La nouvelle URL publique du logo ou de la photo de profil du site.",
                  },
                  heroBackgroundImageUrl: {
                    type: SchemaType.STRING,
                    description: "La nouvelle URL publique de l'image de fond de la section héro du site.",
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
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/sites`, {
          headers: {
            // No specific headers needed as Supabase server client handles auth
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

        const toolResponse = await chat.sendMessage([
          {
            functionCall: functionCall,
          },
          {
            functionResponse: {
              name: "list_user_sites",
              response: sitesData,
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

      } else if (functionCall.name === "update_site_hero_content") {
        const { subdomain, heroSlogan, aboutStory } = functionCall.args as { subdomain: string; heroSlogan?: string; aboutStory?: string };

        if (!subdomain) {
          return NextResponse.json({
            response: "Veuillez spécifier le sous-domaine du site à modifier.",
            tool_code: "MISSING_SUBDOMAIN"
          }, { status: 200 });
        }

        const updates: Partial<SiteEditorFormData> = {};
        if (heroSlogan !== undefined) updates.heroSlogan = heroSlogan;
        if (aboutStory !== undefined) updates.aboutStory = aboutStory;

        if (Object.keys(updates).length === 0) {
          return NextResponse.json({
            response: "Aucun contenu à mettre à jour n'a été fourni pour le slogan ou l'histoire 'À Propos'.",
            tool_code: "NO_UPDATES_PROVIDED"
          }, { status: 200 });
        }

        try {
          await updateSiteData(supabase, user.id, subdomain, updates);
          const toolResponse = await chat.sendMessage([
            {
              functionCall: functionCall,
            },
            {
              functionResponse: {
                name: "update_site_hero_content",
                response: { success: true, message: `Contenu du site "${subdomain}" mis à jour avec succès.` },
              },
            },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating site hero content:", error);
          return NextResponse.json({
            response: `Désolé, je n'ai pas pu mettre à jour le contenu du site "${subdomain}". ${error.message}`,
            tool_code: "UPDATE_ERROR"
          }, { status: 200 });
        }

      } else if (functionCall.name === "update_site_design") {
        const { subdomain, primaryColor, secondaryColor, logoOrPhotoUrl, heroBackgroundImageUrl } = functionCall.args as {
          subdomain: string;
          primaryColor?: string;
          secondaryColor?: string;
          logoOrPhotoUrl?: string;
          heroBackgroundImageUrl?: string;
        };

        if (!subdomain) {
          return NextResponse.json({
            response: "Veuillez spécifier le sous-domaine du site à modifier.",
            tool_code: "MISSING_SUBDOMAIN"
          }, { status: 200 });
        }

        const updates: Partial<SiteEditorFormData> = {};
        if (primaryColor !== undefined) updates.primaryColor = primaryColor;
        if (secondaryColor !== undefined) updates.secondaryColor = secondaryColor;
        if (logoOrPhotoUrl !== undefined) updates.logoOrPhoto = logoOrPhotoUrl;
        if (heroBackgroundImageUrl !== undefined) updates.heroBackgroundImage = heroBackgroundImageUrl;

        if (Object.keys(updates).length === 0) {
          return NextResponse.json({
            response: "Aucun paramètre de design à mettre à jour n'a été fourni.",
            tool_code: "NO_UPDATES_PROVIDED"
          }, { status: 200 });
        }

        try {
          await updateSiteData(supabase, user.id, subdomain, updates);
          const toolResponse = await chat.sendMessage([
            {
              functionCall: functionCall,
            },
            {
              functionResponse: {
                name: "update_site_design",
                response: { success: true, message: `Design du site "${subdomain}" mis à jour avec succès.` },
              },
            },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating site design:", error);
          return NextResponse.json({
            response: `Désolé, je n'ai pas pu mettre à jour le design du site "${subdomain}". ${error.message}`,
            tool_code: "UPDATE_ERROR"
          }, { status: 200 });
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