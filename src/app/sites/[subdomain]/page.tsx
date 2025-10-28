import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import React from 'react';

// Define a basic type for the site data, matching what's stored in Supabase
interface SiteData {
  publicName: string;
  whatsappNumber: string;
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
  // Add other fields as needed from your wizard form
}

export default async function DynamicSitePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params;
  const supabase = createClient();

  // Fetch site data from Supabase based on the subdomain
  const { data: site, error } = await supabase
    .from('sites')
    .select('site_data')
    .eq('subdomain', subdomain)
    .single();

  if (error || !site) {
    console.error('Error fetching site data:', error);
    notFound(); // Show a 404 page if site not found or error
  }

  const siteData: SiteData = site.site_data as SiteData;

  // Basic rendering for demonstration.
  // In a real application, you would use a more sophisticated template component
  // that takes siteData as props and renders a full website.
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <header className={`bg-${siteData.primaryColor}-600 text-white p-6 rounded-lg shadow-md mb-8`}>
        <h1 className="text-4xl font-bold text-center">{siteData.publicName}</h1>
        <p className="text-xl text-center mt-2">{siteData.heroSlogan}</p>
      </header>

      <section className="max-w-4xl mx-auto bg-card text-card-foreground p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-semibold mb-4">À Propos de Nous</h2>
        <p className="text-lg">{siteData.aboutStory}</p>
        {siteData.email && (
          <p className="mt-4 text-muted-foreground">Contact: {siteData.email}</p>
        )}
        <p className="mt-2 text-muted-foreground">WhatsApp: {siteData.whatsappNumber}</p>
      </section>

      {siteData.productsAndServices && siteData.productsAndServices.length > 0 && (
        <section className="max-w-4xl mx-auto bg-card text-card-foreground p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">Nos Offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.productsAndServices.map((product, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-muted-foreground mb-2">{product.description}</p>
                {product.price !== undefined && (
                  <p className="text-lg font-semibold text-primary">
                    {product.price} {product.currency}
                  </p>
                )}
                <button className={`mt-4 w-full bg-${siteData.secondaryColor}-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity`}>
                  {product.actionButton === 'buy' && 'Acheter'}
                  {product.actionButton === 'quote' && 'Demander un devis'}
                  {product.actionButton === 'book' && 'Réserver'}
                  {product.actionButton === 'contact' && 'Contacter'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className={`bg-${siteData.primaryColor}-800 text-white p-4 text-center rounded-lg shadow-md mt-8`}>
        <p>&copy; 2025 {siteData.publicName}. Tous droits réservés.</p>
      </footer>
    </div>
  );
}