import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { DefaultTemplate } from '@/components/site-templates/DefaultTemplate'; // Import the DefaultTemplate

// Define a basic type for the site data, matching what's stored in Supabase
// This interface is now also defined in DefaultTemplate.tsx, but kept here for clarity
// of what is fetched from the DB.
interface SiteData {
  publicName: string;
  whatsappNumber: string;
  secondaryPhoneNumber?: string;
  email?: string;
  heroSlogan: string;
  aboutStory: string;
  primaryColor: string;
  secondaryColor: string;
  productsAndServices: Array<{
    title: string;
    price?: number;
    currency: string;
    description: string;
    actionButton: string;
  }>;
  subdomain: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
}

export default async function DynamicSitePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params;
  const supabase = createClient();

  // Fetch site data and template_type from Supabase based on the subdomain
  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data, template_type') // Select both site_data and template_type
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    console.error('Error fetching site data:', error);
    notFound(); // Show a 404 page if site not found or error
  }

  const siteData: SiteData = site.site_data as SiteData;
  const templateType: string = site.template_type || 'default'; // Get template_type, default to 'default'

  // For now, we'll always render the DefaultTemplate.
  // In the future, you can add a switch statement or a map to render different templates
  // based on the `templateType` variable.
  return <DefaultTemplate siteData={siteData} />;
}