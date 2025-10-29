import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation'; // Import redirect
import React from 'react';
import { DefaultTemplate } from '@/components/site-templates/DefaultTemplate';
import { EcommerceTemplate } from '@/components/site-templates/EcommerceTemplate';
import { ServicePortfolioTemplate } from '@/components/site-templates/ServicePortfolioTemplate';
import { ProfessionalPortfolioTemplate } from '@/components/site-templates/ProfessionalPortfolioTemplate';
import { ArtisanEcommerceTemplate } from '@/components/site-templates/ArtisanEcommerceTemplate';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema'; // Import the new comprehensive schema type

// @ts-ignore: Next.js génère parfois des types incorrects pour les params de page dynamique (Promise<any> au lieu de l'objet direct).
export default async function DynamicSitePage(props: any) {
  const { subdomain } = props.params;
  const supabase = createClient();

  // Fetch site data and template_type from Supabase based on the subdomain
  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data, template_type, user_id') // Also select user_id for access control
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    console.error('Error fetching site data:', error);
    notFound();
    return; // Explicitly return after notFound() to satisfy TypeScript
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Implement access control:
  // If the site has a user_id and the current user is not the owner,
  // redirect to landing page with an unauthorized message.
  if (site.user_id && (!user || user.id !== site.user_id)) {
    // Do not send any site-specific information in the redirect.
    redirect('/?message=unauthorized');
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