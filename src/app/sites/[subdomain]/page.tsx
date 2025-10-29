import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { DefaultTemplate } from '@/components/site-templates/DefaultTemplate';
import { EcommerceTemplate } from '@/components/site-templates/EcommerceTemplate';
import { ServicePortfolioTemplate } from '@/components/site-templates/ServicePortfolioTemplate';
import { ProfessionalPortfolioTemplate } from '@/components/site-templates/ProfessionalPortfolioTemplate';
import { ArtisanEcommerceTemplate } from '@/components/site-templates/ArtisanEcommerceTemplate';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the new comprehensive schema type

// Define the PageProps interface explicitly for this dynamic route
interface PageProps {
  params: {
    subdomain: string;
  };
  // searchParams is optional for this component, but good practice to include if it might be used
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DynamicSitePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params;
  const supabase = createClient();

  // Fetch site data and template_type from Supabase based on the subdomain
  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data, template_type')
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    console.error('Error fetching site data:', error);
    notFound();
    return; // Explicitly return after notFound() to satisfy TypeScript
  }

  const siteData: SiteEditorFormData = site.site_data as SiteEditorFormData; // Cast to the new comprehensive type
  const templateType: string = site.template_type || 'default';

  // Dynamically render the correct template based on templateType
  switch (templateType) {
    case 'ecommerce':
      return <EcommerceTemplate siteData={siteData} subdomain={subdomain} />;
    case 'service-portfolio':
      return <ServicePortfolioTemplate siteData={siteData} subdomain={subdomain} />;
    case 'professional-portfolio':
      return <ProfessionalPortfolioTemplate siteData={siteData} subdomain={subdomain} />;
    case 'artisan-ecommerce':
      // Assuming ArtisanEcommerceTemplate also uses SiteEditorFormData
      return <ArtisanEcommerceTemplate siteData={siteData} subdomain={subdomain} />;
    case 'default':
    default:
      return <DefaultTemplate siteData={siteData} subdomain={subdomain} />;
  }
}