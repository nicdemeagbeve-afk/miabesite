import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { SiteEditorFormData, ProductAndService, Testimonial, Skill } from '@/lib/schemas/site-editor-form-schema'; // Import SiteEditorFormData type
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
      Utilisez des sauts de ligne pour séparer les informations importantes et les listes.
      Soyez bref et rapide dans vos réponses, ne donnez que les informations essentielles sans paragraphes longs.
      Si l'utilisateur demande des statistiques pour 'chaque' site ou pour 'tous' ses sites après avoir listé ses sites,
      vous devez appeler l'outil 'get_site_stats' pour chaque sous-domaine listé et compiler les résultats dans une réponse unique et bien formatée.
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
            {
              name: "add_product_or_service",
              description: "Ajoute un nouveau produit ou service à un site web.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  title: { type: SchemaType.STRING, description: "Le titre du produit/service." },
                  price: { type: SchemaType.NUMBER, description: "Le prix du produit/service." },
                  currency: { type: SchemaType.STRING, description: "La devise (ex: 'XOF', 'USD')." },
                  description: { type: SchemaType.STRING, description: "La description du produit/service." },
                  imageUrl: { type: SchemaType.STRING, description: "L'URL publique de l'image du produit/service." },
                  actionButton: { type: SchemaType.STRING, description: "L'action du bouton (ex: 'buy', 'quote', 'contact')." },
                },
                required: ["subdomain", "title", "currency", "description", "actionButton"],
              },
            },
            {
              name: "update_product_or_service",
              description: "Met à jour un produit ou service existant sur un site web, identifié par son ancien titre.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  oldTitle: { type: SchemaType.STRING, description: "L'ancien titre du produit/service à modifier." },
                  newTitle: { type: SchemaType.STRING, description: "Le nouveau titre du produit/service." },
                  newPrice: { type: SchemaType.NUMBER, description: "Le nouveau prix du produit/service." },
                  newCurrency: { type: SchemaType.STRING, description: "La nouvelle devise." },
                  newDescription: { type: SchemaType.STRING, description: "La nouvelle description." },
                  newImageUrl: { type: SchemaType.STRING, description: "La nouvelle URL publique de l'image." },
                  newActionButton: { type: SchemaType.STRING, description: "La nouvelle action du bouton." },
                },
                required: ["subdomain", "oldTitle"],
              },
            },
            {
              name: "remove_product_or_service",
              description: "Supprime un produit ou service d'un site web, identifié par son titre.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  title: { type: SchemaType.STRING, description: "Le titre du produit/service à supprimer." },
                },
                required: ["subdomain", "title"],
              },
            },
            {
              name: "add_testimonial",
              description: "Ajoute un nouveau témoignage à un site web.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  author: { type: SchemaType.STRING, description: "Le nom de l'auteur du témoignage." },
                  quote: { type: SchemaType.STRING, description: "Le contenu du témoignage." },
                  location: { type: SchemaType.STRING, description: "La localisation de l'auteur." },
                  avatarUrl: { type: SchemaType.STRING, description: "L'URL publique de l'avatar de l'auteur." },
                },
                required: ["subdomain", "author", "quote", "location"],
              },
            },
            {
              name: "update_testimonial",
              description: "Met à jour un témoignage existant sur un site web, identifié par son ancien auteur.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  oldAuthor: { type: SchemaType.STRING, description: "L'ancien nom de l'auteur du témoignage à modifier." },
                  newAuthor: { type: SchemaType.STRING, description: "Le nouveau nom de l'auteur." },
                  newQuote: { type: SchemaType.STRING, description: "Le nouveau contenu du témoignage." },
                  newLocation: { type: SchemaType.STRING, description: "La nouvelle localisation de l'auteur." },
                  newAvatarUrl: { type: SchemaType.STRING, description: "La nouvelle URL publique de l'avatar." },
                },
                required: ["subdomain", "oldAuthor"],
              },
            },
            {
              name: "remove_testimonial",
              description: "Supprime un témoignage d'un site web, identifié par son auteur.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  author: { type: SchemaType.STRING, description: "Le nom de l'auteur du témoignage à supprimer." },
                },
                required: ["subdomain", "author"],
              },
            },
            {
              name: "add_skill",
              description: "Ajoute une nouvelle compétence à un site web.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  title: { type: SchemaType.STRING, description: "Le titre de la compétence." },
                  description: { type: SchemaType.STRING, description: "La description de la compétence." },
                  icon: { type: SchemaType.STRING, description: "Le nom de l'icône Lucide React (ex: 'Wrench', 'Hammer')." },
                },
                required: ["subdomain", "title", "description"],
              },
            },
            {
              name: "update_skill",
              description: "Met à jour une compétence existante sur un site web, identifiée par son ancien titre.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  oldTitle: { type: SchemaType.STRING, description: "L'ancien titre de la compétence à modifier." },
                  newTitle: { type: SchemaType.STRING, description: "Le nouveau titre de la compétence." },
                  newDescription: { type: SchemaType.STRING, description: "La nouvelle description de la compétence." },
                  newIcon: { type: SchemaType.STRING, description: "Le nouveau nom de l'icône Lucide React." },
                },
                required: ["subdomain", "oldTitle"],
              },
            },
            {
              name: "remove_skill",
              description: "Supprime une compétence d'un site web, identifiée par son titre.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web." },
                  title: { type: SchemaType.STRING, description: "Le titre de la compétence à supprimer." },
                },
                required: ["subdomain", "title"],
              },
            },
            {
              name: "update_site_basic_info",
              description: "Met à jour les informations de base d'un site web, y compris le nom public, les numéros de téléphone, l'e-mail et la localisation de l'entreprise.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web à modifier." },
                  publicName: { type: SchemaType.STRING, description: "Le nouveau nom public de l'entreprise." },
                  whatsappNumber: { type: SchemaType.STRING, description: "Le nouveau numéro WhatsApp (ex: '+2250700000000')." },
                  secondaryPhoneNumber: { type: SchemaType.STRING, description: "Le nouveau numéro de téléphone secondaire (ex: '+2250100000000')." },
                  email: { type: SchemaType.STRING, description: "La nouvelle adresse e-mail de contact." },
                  businessLocation: { type: SchemaType.STRING, description: "La nouvelle localisation de l'entreprise." },
                },
                required: ["subdomain"],
              },
            },
            {
              name: "update_site_contact_settings",
              description: "Met à jour les paramètres de contact et les liens de réseaux sociaux d'un site web.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  subdomain: { type: SchemaType.STRING, description: "Le sous-domaine du site web à modifier." },
                  contactButtonAction: { type: SchemaType.STRING, description: "La nouvelle action du bouton de contact (ex: 'whatsapp', 'emailForm', 'phoneNumber')." },
                  showContactForm: { type: SchemaType.BOOLEAN, description: "Indique si le formulaire de contact doit être affiché (true/false)." },
                  facebookLink: { type: SchemaType.STRING, description: "Le nouveau lien URL de la page Facebook." },
                  instagramLink: { type: SchemaType.STRING, description: "Le nouveau lien URL du profil Instagram." },
                  linkedinLink: { type: SchemaType.STRING, description: "Le nouveau lien URL du profil LinkedIn." },
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
            responseText += `**${site.subdomain}** \n`;
            responseText += `Nom public: ${site.publicName || 'Non défini'} \n`;
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
        const formattedStats = `Voici les statistiques pour le site **${subdomain}** : \n` +
                               `- Ventes totales : ${statsData.totalSales} \n` +
                               `- Visites totales : ${statsData.totalVisits} \n` +
                               `- Contacts totaux : ${statsData.totalContacts} \n\n`;
        
        return NextResponse.json({ response: formattedStats }, { status: 200 });

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
            { functionResponse: { name: "update_site_hero_content", response: { success: true, message: `Contenu du site "${subdomain}" mis à jour avec succès.` } } },
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
            { functionResponse: { name: "update_site_design", response: { success: true, message: `Design du site "${subdomain}" mis à jour avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating site design:", error);
          return NextResponse.json({
            response: `Désolé, je n'ai pas pu mettre à jour le design du site "${subdomain}". ${error.message}`,
            tool_code: "UPDATE_ERROR"
          }, { status: 200 });
        }
      } else if (functionCall.name === "add_product_or_service") {
        // Destructure imageUrl from functionCall.args, which is what the tool provides
        const { subdomain, title, price, currency, description, imageUrl, actionButton } = functionCall.args as { subdomain: string; title: string; price?: number; currency: string; description: string; imageUrl?: string; actionButton: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          const currentProducts = (site.site_data as SiteEditorFormData).productsAndServices || [];
          if (currentProducts.length >= 5) {
            return NextResponse.json({ response: "Vous avez atteint la limite de 5 produits/services pour ce site." }, { status: 200 });
          }
          if (currentProducts.some(p => p.title === title)) {
            return NextResponse.json({ response: `Un produit/service avec le titre "${title}" existe déjà.` }, { status: 200 });
          }

          // Map imageUrl to image property for ProductAndService type
          const newProduct: ProductAndService = { title, price, currency, description, image: imageUrl, actionButton };
          const updatedProducts = [...currentProducts, newProduct];

          await updateSiteData(supabase, user.id, subdomain, { productsAndServices: updatedProducts });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "add_product_or_service", response: { success: true, message: `Produit/service "${title}" ajouté avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error adding product/service:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu ajouter le produit/service. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "update_product_or_service") {
        const { subdomain, oldTitle, newTitle, newPrice, newCurrency, newDescription, newImageUrl, newActionButton } = functionCall.args as { subdomain: string; oldTitle: string; newTitle?: string; newPrice?: number; newCurrency?: string; newDescription?: string; newImageUrl?: string; newActionButton?: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          let currentProducts = (site.site_data as SiteEditorFormData).productsAndServices || [];
          const productIndex = currentProducts.findIndex(p => p.title === oldTitle);

          if (productIndex === -1) {
            return NextResponse.json({ response: `Produit/service "${oldTitle}" non trouvé.` }, { status: 200 });
          }

          const updatedProduct = { ...currentProducts[productIndex] };
          if (newTitle !== undefined) updatedProduct.title = newTitle;
          if (newPrice !== undefined) updatedProduct.price = newPrice;
          if (newCurrency !== undefined) updatedProduct.currency = newCurrency;
          if (newDescription !== undefined) updatedProduct.description = newDescription;
          if (newImageUrl !== undefined) updatedProduct.image = newImageUrl;
          if (newActionButton !== undefined) updatedProduct.actionButton = newActionButton;

          currentProducts[productIndex] = updatedProduct;

          await updateSiteData(supabase, user.id, subdomain, { productsAndServices: currentProducts });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "update_product_or_service", response: { success: true, message: `Produit/service "${oldTitle}" mis à jour avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating product/service:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu mettre à jour le produit/service. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "remove_product_or_service") {
        const { subdomain, title } = functionCall.args as { subdomain: string; title: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          let currentProducts = (site.site_data as SiteEditorFormData).productsAndServices || [];
          const initialLength = currentProducts.length;
          const updatedProducts = currentProducts.filter(p => p.title !== title);

          if (updatedProducts.length === initialLength) {
            return NextResponse.json({ response: `Produit/service "${title}" non trouvé.` }, { status: 200 });
          }

          await updateSiteData(supabase, user.id, subdomain, { productsAndServices: updatedProducts });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "remove_product_or_service", response: { success: true, message: `Produit/service "${title}" supprimé avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error removing product/service:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu supprimer le produit/service. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "add_testimonial") {
        // Destructure avatarUrl from functionCall.args, which is what the tool provides
        const { subdomain, author, quote, location, avatarUrl } = functionCall.args as { subdomain: string; author: string; quote: string; location: string; avatarUrl?: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          const currentTestimonials = (site.site_data as SiteEditorFormData).testimonials || [];
          if (currentTestimonials.length >= 5) {
            return NextResponse.json({ response: "Vous avez atteint la limite de 5 témoignages pour ce site." }, { status: 200 });
          }
          if (currentTestimonials.some(t => t.author === author)) {
            return NextResponse.json({ response: `Un témoignage de "${author}" existe déjà.` }, { status: 200 });
          }

          // Map avatarUrl to avatar property for Testimonial type
          const newTestimonial: Testimonial = { author, quote, location, avatar: avatarUrl };
          const updatedTestimonials = [...currentTestimonials, newTestimonial];

          await updateSiteData(supabase, user.id, subdomain, { testimonials: updatedTestimonials });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "add_testimonial", response: { success: true, message: `Témoignage de "${author}" ajouté avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error adding testimonial:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu ajouter le témoignage. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "update_testimonial") {
        const { subdomain, oldAuthor, newAuthor, newQuote, newLocation, newAvatarUrl } = functionCall.args as { subdomain: string; oldAuthor: string; newAuthor?: string; newQuote?: string; newLocation?: string; newAvatarUrl?: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          let currentTestimonials = (site.site_data as SiteEditorFormData).testimonials || [];
          const testimonialIndex = currentTestimonials.findIndex(t => t.author === oldAuthor);

          if (testimonialIndex === -1) {
            return NextResponse.json({ response: `Témoignage de "${oldAuthor}" non trouvé.` }, { status: 200 });
          }

          const updatedTestimonial = { ...currentTestimonials[testimonialIndex] };
          if (newAuthor !== undefined) updatedTestimonial.author = newAuthor;
          if (newQuote !== undefined) updatedTestimonial.quote = newQuote;
          if (newLocation !== undefined) updatedTestimonial.location = newLocation;
          if (newAvatarUrl !== undefined) updatedTestimonial.avatar = newAvatarUrl;

          currentTestimonials[testimonialIndex] = updatedTestimonial;

          await updateSiteData(supabase, user.id, subdomain, { testimonials: currentTestimonials });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "update_testimonial", response: { success: true, message: `Témoignage de "${oldAuthor}" mis à jour avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating testimonial:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu mettre à jour le témoignage. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "remove_testimonial") {
        const { subdomain, author } = functionCall.args as { subdomain: string; author: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          let currentTestimonials = (site.site_data as SiteEditorFormData).testimonials || [];
          const initialLength = currentTestimonials.length;
          const updatedTestimonials = currentTestimonials.filter(t => t.author !== author);

          if (updatedTestimonials.length === initialLength) {
            return NextResponse.json({ response: `Témoignage de "${author}" non trouvé.` }, { status: 200 });
          }

          await updateSiteData(supabase, user.id, subdomain, { testimonials: updatedTestimonials });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "remove_testimonial", response: { success: true, message: `Témoignage de "${author}" supprimé avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error removing testimonial:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu supprimer le témoignage. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "add_skill") {
        const { subdomain, title, description, icon } = functionCall.args as Skill & { subdomain: string };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          const currentSkills = (site.site_data as SiteEditorFormData).skills || [];
          if (currentSkills.length >= 10) {
            return NextResponse.json({ response: "Vous avez atteint la limite de 10 compétences pour ce site." }, { status: 200 });
          }
          if (currentSkills.some(s => s.title === title)) {
            return NextResponse.json({ response: `Une compétence avec le titre "${title}" existe déjà.` }, { status: 200 });
          }

          const newSkill: Skill = { title, description, icon };
          const updatedSkills = [...currentSkills, newSkill];

          await updateSiteData(supabase, user.id, subdomain, { skills: updatedSkills });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "add_skill", response: { success: true, message: `Compétence "${title}" ajoutée avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error adding skill:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu ajouter la compétence. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "update_skill") {
        const { subdomain, oldTitle, newTitle, newDescription, newIcon } = functionCall.args as { subdomain: string; oldTitle: string; newTitle?: string; newDescription?: string; newIcon?: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          let currentSkills = (site.site_data as SiteEditorFormData).skills || [];
          const skillIndex = currentSkills.findIndex(s => s.title === oldTitle);

          if (skillIndex === -1) {
            return NextResponse.json({ response: `Compétence "${oldTitle}" non trouvée.` }, { status: 200 });
          }

          const updatedSkill = { ...currentSkills[skillIndex] };
          if (newTitle !== undefined) updatedSkill.title = newTitle;
          if (newDescription !== undefined) updatedSkill.description = newDescription;
          if (newIcon !== undefined) updatedSkill.icon = newIcon;

          currentSkills[skillIndex] = updatedSkill;

          await updateSiteData(supabase, user.id, subdomain, { skills: currentSkills });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "update_skill", response: { success: true, message: `Compétence "${oldTitle}" mise à jour avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating skill:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu mettre à jour la compétence. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "remove_skill") {
        const { subdomain, title } = functionCall.args as { subdomain: string; title: string; };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        try {
          const { data: site, error: fetchError } = await supabase
            .from('sites')
            .select('site_data')
            .eq('user_id', user.id)
            .eq('subdomain', subdomain)
            .single();

          if (fetchError || !site) {
            throw new Error('Site non trouvé ou non autorisé.');
          }

          let currentSkills = (site.site_data as SiteEditorFormData).skills || [];
          const initialLength = currentSkills.length;
          const updatedSkills = currentSkills.filter(s => s.title !== title);

          if (updatedSkills.length === initialLength) {
            return NextResponse.json({ response: `Compétence "${title}" non trouvée.` }, { status: 200 });
          }

          await updateSiteData(supabase, user.id, subdomain, { skills: updatedSkills });
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "remove_skill", response: { success: true, message: `Compétence "${title}" supprimée avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error removing skill:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu supprimer la compétence. ${error.message}` }, { status: 200 });
        }
      } else if (functionCall.name === "update_site_basic_info") {
        const { subdomain, publicName, whatsappNumber, secondaryPhoneNumber, email, businessLocation } = functionCall.args as {
          subdomain: string;
          publicName?: string;
          whatsappNumber?: string;
          secondaryPhoneNumber?: string;
          email?: string;
          businessLocation?: string;
        };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        const updates: Partial<SiteEditorFormData> = {};
        if (publicName !== undefined) updates.publicName = publicName;
        if (whatsappNumber !== undefined) updates.whatsappNumber = whatsappNumber;
        if (secondaryPhoneNumber !== undefined) updates.secondaryPhoneNumber = secondaryPhoneNumber;
        if (email !== undefined) updates.email = email;
        if (businessLocation !== undefined) updates.businessLocation = businessLocation;

        if (Object.keys(updates).length === 0) {
          return NextResponse.json({ response: "Aucune information de base à mettre à jour n'a été fournie." }, { status: 200 });
        }

        try {
          await updateSiteData(supabase, user.id, subdomain, updates);
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "update_site_basic_info", response: { success: true, message: `Informations de base du site "${subdomain}" mises à jour avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating site basic info:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu mettre à jour les informations de base du site "${subdomain}". ${error.message}`, tool_code: "UPDATE_ERROR" }, { status: 200 });
        }
      } else if (functionCall.name === "update_site_contact_settings") {
        const { subdomain, contactButtonAction, showContactForm, facebookLink, instagramLink, linkedinLink } = functionCall.args as {
          subdomain: string;
          contactButtonAction?: string;
          showContactForm?: boolean;
          facebookLink?: string;
          instagramLink?: string;
          linkedinLink?: string;
        };

        if (!subdomain) {
          return NextResponse.json({ response: "Veuillez spécifier le sous-domaine du site." }, { status: 200 });
        }

        const updates: Partial<SiteEditorFormData> = {};
        if (contactButtonAction !== undefined) updates.contactButtonAction = contactButtonAction;
        if (showContactForm !== undefined) updates.showContactForm = showContactForm;
        if (facebookLink !== undefined) updates.facebookLink = facebookLink;
        if (instagramLink !== undefined) updates.instagramLink = instagramLink;
        if (linkedinLink !== undefined) updates.linkedinLink = linkedinLink;

        if (Object.keys(updates).length === 0) {
          return NextResponse.json({ response: "Aucun paramètre de contact ou de réseau social à mettre à jour n'a été fourni." }, { status: 200 });
        }

        try {
          await updateSiteData(supabase, user.id, subdomain, updates);
          const toolResponse = await chat.sendMessage([
            { functionResponse: { name: "update_site_contact_settings", response: { success: true, message: `Paramètres de contact et réseaux sociaux du site "${subdomain}" mis à jour avec succès.` } } },
          ]);
          return NextResponse.json({ response: toolResponse.response.text() }, { status: 200 });
        } catch (error: any) {
          console.error("Error updating site contact settings:", error);
          return NextResponse.json({ response: `Désolé, je n'ai pas pu mettre à jour les paramètres de contact du site "${subdomain}". ${error.message}`, tool_code: "UPDATE_ERROR" }, { status: 200 });
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