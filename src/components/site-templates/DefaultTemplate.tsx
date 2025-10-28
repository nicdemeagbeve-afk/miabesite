import React from 'react';
import Image from 'next/image'; // Import Image component

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
  logoOrPhoto?: string | null; // Add logoOrPhotoUrl
  productsAndServices: Array<{
    title: string;
    price?: number;
    currency: string;
    description: string;
    image?: string | null; // Add imageUrl for products
    actionButton: string;
  }>;
  subdomain: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
}

interface DefaultTemplateProps {
  siteData: SiteData;
}

export function DefaultTemplate({ siteData }: DefaultTemplateProps) {
  // Construct dynamic class names for Tailwind
  const primaryBgClass = `bg-${siteData.primaryColor}-600`;
  const primaryDarkBgClass = `bg-${siteData.primaryColor}-800`;
  const secondaryBgClass = `bg-${siteData.secondaryColor}-500`;
  const secondaryHoverBgClass = `hover:bg-${siteData.secondaryColor}-600`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className={`py-12 px-4 md:px-8 ${primaryBgClass} text-white text-center`}>
        <div className="container mx-auto max-w-4xl">
          {siteData.logoOrPhoto && (
            <Image
              src={siteData.logoOrPhoto}
              alt={`${siteData.publicName} Logo`}
              width={120}
              height={120}
              className="mx-auto mb-4 rounded-full object-cover"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{siteData.publicName}</h1>
          <p className="text-xl md:text-2xl font-light">{siteData.heroSlogan}</p>
        </div>
      </header>

      {/* About Section */}
      <section className="py-12 px-4 md:px-8 bg-card text-card-foreground">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center">À Propos de Nous</h2>
          <p className="text-lg leading-relaxed mb-4">{siteData.aboutStory}</p>
          <div className="text-center text-muted-foreground">
            {siteData.email && (
              <p className="mt-2">Email: <a href={`mailto:${siteData.email}`} className="underline hover:text-primary">{siteData.email}</a></p>
            )}
            <p className="mt-2">WhatsApp: <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{siteData.whatsappNumber}</a></p>
            {siteData.secondaryPhoneNumber && (
              <p className="mt-2">Téléphone: <a href={`tel:${siteData.secondaryPhoneNumber}`} className="underline hover:text-primary">{siteData.secondaryPhoneNumber}</a></p>
            )}
          </div>
        </div>
      </section>

      {/* Products and Services Section */}
      {siteData.productsAndServices && siteData.productsAndServices.length > 0 && (
        <section className="py-12 px-4 md:px-8 bg-muted text-muted-foreground">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center">Nos Offres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteData.productsAndServices.map((product, index) => (
                <div key={index} className="bg-card text-card-foreground border border-border p-6 rounded-lg shadow-md flex flex-col">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1 mb-4">{product.description}</p>
                  {product.price !== undefined && (
                    <p className="text-2xl font-semibold text-primary mb-4">
                      {product.price} {product.currency}
                    </p>
                  )}
                  <button className={`mt-auto w-full ${secondaryBgClass} ${secondaryHoverBgClass} text-white py-3 rounded-md transition-colors`}>
                    {product.actionButton === 'buy' && 'Acheter'}
                    {product.actionButton === 'quote' && 'Demander un devis'}
                    {product.actionButton === 'book' && 'Réserver'}
                    {product.actionButton === 'contact' && 'Contacter'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Section */}
      <footer className={`py-8 px-4 md:px-8 ${primaryDarkBgClass} text-white text-center`}>
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm">&copy; {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.</p>
          {/* Social media links could go here */}
          <div className="flex justify-center gap-4 mt-4">
            {siteData.facebookLink && (
              <a href={siteData.facebookLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">Facebook</a>
            )}
            {siteData.instagramLink && (
              <a href={siteData.instagramLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">Instagram</a>
            )}
            {siteData.linkedinLink && (
              <a href={siteData.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">LinkedIn</a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}