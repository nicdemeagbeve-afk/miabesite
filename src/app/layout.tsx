import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Miabesite - Créez votre site web en 5 minutes",
    template: "%s | Miabesite",
  },
  description: "Créez votre site web professionnel gratuitement et automatiquement en moins de 5 minutes avec Miabesite. Idéal pour les petites entreprises et artisans en Afrique.",
  keywords: ["création site web", "site internet gratuit", "site web Afrique", "e-commerce Afrique", "portfolio professionnel", "site artisan", "Miabesite"],
  authors: [{ name: "Miabesite" }],
  creator: "Miabesite",
  publisher: "Miabesite",
  openGraph: {
    title: "Miabesite - Créez votre site web en 5 minutes",
    description: "Créez votre site web professionnel gratuitement et automatiquement en moins de 5 minutes avec Miabesite. Idéal pour les petites entreprises et artisans en Afrique.",
    url: "https://www.miabesite.com", // Replace with your actual domain
    siteName: "Miabesite",
    images: [
      {
        url: "/next.svg", // Replace with a more appropriate default image
        width: 1200,
        height: 630,
        alt: "Miabesite - Création de site web rapide",
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Miabesite - Créez votre site web en 5 minutes",
    description: "Créez votre site web professionnel gratuitement et automatiquement en moins de 5 minutes avec Miabesite. Idéal pour les petites entreprises et artisans en Afrique.",
    creator: '@Miabesite', // Replace with your Twitter handle
    images: ["/next.svg"], // Replace with a more appropriate default image
  },
  metadataBase: new URL('https://www.miabesite.com'), // Replace with your actual domain
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen">
          {children}
          <Toaster /> {/* Add Toaster here for global notifications */}
        </div>
      </body>
    </html>
  );
}