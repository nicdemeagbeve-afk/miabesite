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
import { TrackSiteVisit } from '@/components/TrackSiteVisit'; // Import the new component
import { getSupabaseStorageUrl } from '@/lib/utils'; // Import getSupabaseStorageUrl

// Function to generate dynamic metadata
export async function generateMetadata({ params }: { params: { subdomain: string } }): Promise<Metadata> {
  const { subdomain } = params;
  const supabase = createClient();

  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data, template_type, is_public') // Ajoutez 'is_public' ici
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    // If site not found, return generic metadata or indicate not found
    return {
      title: "Site non trouvé",
      description: "Le site que vous recherchez n'existe pas ou n'est pas accessible.",
      icons: {
        icon: getSupabaseStorageUrl("static-assets" , "favicon.ico"), // Fallback to SaaS favicon from Supabase
      },
    };
  }

  const siteData: SiteEditorFormData = site.site_data as SiteEditorFormData;

  const title = siteData.publicName ? `${siteData.publicName} | ${siteData.heroSlogan || "Votre site professionnel"}` : `Site ${subdomain}`;
  const description = siteData.aboutStory || `Découvrez le site de ${siteData.publicName || subdomain}.`;
  const siteLogoUrl = siteData.logoOrPhoto || getSupabaseStorageUrl("static-assets" , "favicon.ico"); // Use site logo or fallback to SaaS favicon from Supabase

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
          url: siteData.logoOrPhoto || getSupabaseStorageUrl("static-assets" , "miabesite-logo.png"), // Fallback image for OG from Supabase
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
      images: [siteData.logoOrPhoto || getSupabaseStorageUrl("static-assets" , "miabesite-logo.png")], // Fallback image for Twitter from Supabase
    },
    icons: {
      icon: siteLogoUrl, // Dynamic favicon for user's site
    },
  };
}

export default async function DynamicSitePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params;
  const supabase = createClient();

  // Fetch site data and template_type from Supabase based on the subdomain
  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data, template_type, user_id, is_public') // Ajoutez 'is_public' ici
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    console.error('Error fetching site data:', error);
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Implement access control:
  // If the site is NOT public AND the site has a user_id AND the current user is not the owner,
  // then redirect to landing page with an unauthorized message.
  // Otherwise, allow access.
  if (!site.is_public && site.user_id && (!user || user.id !== site.user_id)) {
    redirect('/?message=unauthorized');
  }

  const siteData: SiteEditorFormData = site.site_data as SiteEditorFormData; // Cast to the new comprehensive type
  const templateType: string = site.template_type || 'default';

  // Dynamically render the correct template based on templateType
  const TemplateComponent = (() => {
    switch (templateType) {
      case 'ecommerce':
        return EcommerceTemplate;
      case 'service-portfolio':
        return ServicePortfolioTemplate;
      case 'professional-portfolio':
        return ProfessionalPortfolioTemplate;
      case 'artisan-ecommerce':
        return ArtisanEcommerceTemplate;
      case 'default':
      default:
        return DefaultTemplate;
    }
  })();

  return (
    <>
      <TemplateComponent siteData={siteData} subdomain={subdomain} />
      <TrackSiteVisit subdomain={subdomain} /> {/* Track visit on page load */}
    </>
  );
}