import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { DefaultTemplate } from '@/components/site-templates/DefaultTemplate';
import { EcommerceTemplate } from '@/components/site-templates/EcommerceTemplate';
import { ServicePortfolioTemplate } from '@/components/site-templates/ServicePortfolioTemplate';
import { ProfessionalPortfolioTemplate } from '@/components/site-templates/ProfessionalPortfolioTemplate';
import { ArtisanEcommerceTemplate } from '@/components/site-templates/ArtisanEcommerceTemplate';
import { SiteEditorFormData } from '@/lib/schemas/site-editor-form-schema';
import type { Metadata } from 'next';

interface PageProps {
  params: { subdomain: string };
}

// Function to generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subdomain } = params;
  const supabase = createClient();

  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data, template_type')
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    // If site not found, return generic metadata or indicate not found
    return {
      title: "Site non trouvé",
      description: "Le site que vous recherchez n'existe pas ou n'est pas accessible.",
      icons: {
        icon: "/favicon.ico", // Fallback to SaaS favicon
      },
    };
  }

  const siteData: SiteEditorFormData = site.site_data as SiteEditorFormData;

  const title = siteData.publicName ? `${siteData.publicName} | ${siteData.heroSlogan || "Votre site professionnel"}` : `Site ${subdomain}`;
  const description = siteData.aboutStory || `Découvrez le site de ${siteData.publicName || subdomain}.`;
  const siteLogoUrl = siteData.logoOrPhoto || '/favicon.ico'; // Use site logo or fallback to SaaS favicon

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://${subdomain}.ctcsite.com`, // Replace with your actual domain if applicable
      siteName: siteData.publicName || "Miabesite",
      images: [
        {
          url: siteData.logoOrPhoto || '/miabesite-logo.png', // Fallback image for OG
          width: 800,
          height: 600,
          alt: siteData.publicName || "Logo du site",
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      creator: '@Miabesite', // Replace with your Twitter handle
      images: [siteData.logoOrPhoto || '/miabesite-logo.png'], // Fallback image for Twitter
    },
    icons: {
      icon: siteLogoUrl, // Dynamic favicon for user's site
    },
  };
}

export default async function DynamicSitePage({ params }: PageProps) {
  const { subdomain } = params;
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
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Implement access control:
  // If the site has a user_id and the current user is not the owner,
  // redirect to landing page with an unauthorized message.
  if (site.user_id && (!user || user.id !== site.user_id)) {
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
    case 'artisan-ecommerce': // ArtisanEcommerceTemplate also uses ProfessionalPortfolioTemplate's structure for some parts
      return <ProfessionalPortfolioTemplate siteData={siteData} subdomain={subdomain} />;
    case 'default':
    default:
      return <DefaultTemplate siteData={siteData} subdomain={subdomain} />;
  }
}