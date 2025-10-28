import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { DefaultTemplate } from '@/components/site-templates/DefaultTemplate';
import { EcommerceTemplate } from '@/components/site-templates/EcommerceTemplate';
import { ServicePortfolioTemplate } from '@/components/site-templates/ServicePortfolioTemplate';
import { ProfessionalPortfolioTemplate } from '@/components/site-templates/ProfessionalPortfolioTemplate';
import { ArtisanEcommerceTemplate } from '@/components/site-templates/ArtisanEcommerceTemplate'; // Import the new template

// Define a basic type for the site data, matching what's stored in Supabase
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
  // Add other fields as needed from your wizard form
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

  // Dynamically render the correct template based on templateType
  switch (templateType) {
    case 'ecommerce':
      return <EcommerceTemplate siteData={siteData} />;
    case 'service-portfolio':
      return <ServicePortfolioTemplate siteData={siteData} />;
    case 'professional-portfolio':
      return <ProfessionalPortfolioTemplate siteData={siteData} />;
    case 'artisan-ecommerce': // New case for the artisan-ecommerce template
      return <ArtisanEcommerceTemplate siteData={siteData} />;
    case 'default':
    default: // Fallback to DefaultTemplate if type is unknown or not set
      return <DefaultTemplate siteData={siteData} />;
  }
}