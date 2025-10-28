import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as z from 'zod';

// Define the schema for the incoming site data, matching your WizardFormData
// This should be kept in sync with the client-side schema in SiteCreationWizard.tsx
const siteCreationSchema = z.object({
  publicName: z.string().min(3).max(50),
  whatsappNumber: z.string().regex(/^\+?\d{8,15}$/),
  secondaryPhoneNumber: z.string().regex(/^\+?\d{8,15}$/).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  primaryColor: z.string().min(1),
  secondaryColor: z.string().min(1),
  logoOrPhoto: z.string().url().nullable().optional(), // Expect a URL string or null

  heroSlogan: z.string().min(10).max(60),
  aboutStory: z.string().min(50).max(300),
  portfolioProofLink: z.string().url().optional().or(z.literal('')),
  portfolioProofDescription: z.string().max(200).optional().or(z.literal('')),

  productsAndServices: z.array(z.object({
    title: z.string().min(3).max(50),
    price: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.number().min(0).optional()
    ),
    currency: z.string().min(1),
    description: z.string().min(10).max(200),
    image: z.string().url().nullable().optional(), // Expect a URL string or null
    actionButton: z.string().min(1),
  })).min(1).max(3),

  subdomain: z.string()
    .min(3)
    .regex(/^[a-z0-9-]+$/)
    .transform(s => s.toLowerCase())
    .refine(s => !s.startsWith('-') && !s.endsWith('-')),
  contactButtonAction: z.string().min(1),
  facebookLink: z.string().url().optional().or(z.literal('')),
  instagramLink: z.string().url().optional().or(z.literal('')),
  linkedinLink: z.string().url().optional().or(z.literal('')),
  paymentMethods: z.array(z.string()).min(1),
  deliveryOption: z.string().min(1),
  depositRequired: z.boolean(),
  templateType: z.string().min(1),
});

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate the incoming data against the schema
    const validatedData = siteCreationSchema.parse(body);

    // Check if subdomain already exists
    const { data: existingSite, error: fetchError } = await supabase
      .from('sites')
      .select('id')
      .eq('subdomain', validatedData.subdomain)
      .single();

    if (existingSite) {
      return NextResponse.json({ error: 'Ce sous-domaine est déjà pris.' }, { status: 409 });
    }
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
        console.error('Error checking subdomain:', fetchError);
        return NextResponse.json({ error: 'Erreur lors de la vérification du sous-domaine.' }, { status: 500 });
    }


    // Insert the validated data into the 'sites' table
    const { data, error } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        subdomain: validatedData.subdomain,
        site_data: validatedData, // Store the entire validated object
        status: 'published', // Default to published for now
        template_type: validatedData.templateType,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting site data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Site créé avec succès !', site: data }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données de formulaire invalides', details: error.errors }, { status: 400 });
    }
    console.error('Unexpected error during site creation:', error);
    return NextResponse.json({ error: 'Une erreur inattendue est survenue.' }, { status: 500 });
  }
}