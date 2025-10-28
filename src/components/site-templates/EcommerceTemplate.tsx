import React from 'react';

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
}

interface EcommerceTemplateProps {
  siteData: SiteData;
}

export function EcommerceTemplate({ siteData }: EcommerceTemplateProps) {
  // Construct dynamic class names for Tailwind
  const primaryBgClass = `bg-${siteData.primaryColor}-700`; // Slightly different shade for e-commerce feel
  const primaryTextClass = `text-${siteData.primaryColor}-100`;
  const secondaryBgClass = `bg-${siteData.secondaryColor}-600`;
  const secondaryHoverBgClass = `hover:bg-${siteData.secondaryColor}-700`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
      {/* Header Section */}
      <header className={`py-6 px-4 md:px-8 ${primaryBgClass} ${primaryTextClass} text-center shadow-md`}>
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-2 sm:mb-0">{siteData.publicName}</h1>
          <nav className="flex gap-4 text-lg">
            <a href="#products" className="hover:underline">Produits</a>
            <a href="#about" className="hover:underline">À Propos</a>
            <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 text-center bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-50">{siteData.heroSlogan}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Découvrez nos offres exclusives !</p>
          <button className={`px-8 py-4 rounded-full text-lg font-semibold text-white ${secondaryBgClass} ${secondaryHoverBgClass} transition-colors`}>
            Voir les produits
          </button>
        </div>
      </section>

      {/* Products Section */}
      {siteData.productsAndServices && siteData.productsAndServices.length > 0 && (
        <section id="products" className="py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-850">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-gray-50">Nos Produits & Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteData.productsAndServices.map((product, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
                  {/* Placeholder for product image */}
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                    Image du produit
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-50">{product.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base flex-1 mb-4">{product.description}</p>
                    {product.price !== undefined && (
                      <p className="text-3xl font-semibold text-primary mb-4">
                        {product.price} {product.currency}
                      </p>
                    )}
                    <button className={`mt-auto w-full py-3 rounded-md text-white font-semibold ${secondaryBgClass} ${secondaryHoverBgClass} transition-colors`}>
                      {product.actionButton === 'buy' && 'Acheter maintenant'}
                      {product.actionButton === 'quote' && 'Demander un devis'}
                      {product.actionButton === 'book' && 'Réserver'}
                      {product.actionButton === 'contact' && 'Contacter'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-16 px-4 md:px-8 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-50">Notre Histoire</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">{siteData.aboutStory}</p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400">
            {siteData.email && (
              <p>Email: <a href={`mailto:${siteData.email}`} className="underline hover:text-primary">{siteData.email}</a></p>
            )}
            <p>WhatsApp: <a href={`https://wa.me/${siteData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{siteData.whatsappNumber}</a></p>
            {siteData.secondaryPhoneNumber && (
              <p>Téléphone: <a href={`tel:${siteData.secondaryPhoneNumber}`} className="underline hover:text-primary">{siteData.secondaryPhoneNumber}</a></p>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className={`py-8 px-4 md:px-8 ${primaryBgClass} ${primaryTextClass} text-center`}>
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm">&copy; {new Date().getFullYear()} {siteData.publicName}. Tous droits réservés.</p>
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