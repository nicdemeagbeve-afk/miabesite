import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { DefaultTemplate } from '@/components/site-templates/DefaultTemplate';
import { EcommerceTemplate } from '@/components/site-templates/EcommerceTemplate';
import { ServicePortfolioTemplate } from '@/components/site-templates/ServicePortfolioTemplate';
import { ProfessionalPortfolioTemplate } from '@/components/site-templates/ProfessionalPortfolioTemplate';
import { ArtisanEcommerceTemplate } from '@/components/site-templates/ArtisanEcommerceTemplate';

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
    image?: string | null; // Added image to productsAndServices
  }>;
  subdomain: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  paymentMethods?: string[];
  portfolioProofLink?: string;
  portfolioProofDescription?: string;
  logoOrPhoto?: string | null; // Added logoOrPhoto
  showTestimonials?: boolean; // Added showTestimonials
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
  }

  const siteData: SiteData = site.site_data as SiteData;
  const templateType: string = site.template_type || 'default';

  // Dynamically render the correct template based on templateType
  switch (templateType) {
    case 'ecommerce':
      return <EcommerceTemplate siteData={siteData} />;
    case 'service-portfolio':
      return <ServicePortfolioTemplate siteData={siteData} />;
    case 'professional-portfolio':
      return <ProfessionalPortfolioTemplate siteData={siteData} />;
    case 'artisan-ecommerce':
      return <ArtisanEcommerceTemplate siteData={siteData} />;
    case 'default':
    default:
      return <DefaultTemplate siteData={siteData} />;
  }
}