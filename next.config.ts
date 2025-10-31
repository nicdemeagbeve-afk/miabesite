import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Domaine de stockage Supabase générique
      },
      {
        protocol: 'https',
        hostname: '*.supabase.miabesite.site', // ✅ Ajout du wildcard pour le sous-domaine personnalisé Supabase
      },
      {
        protocol: 'https',
        hostname: 'supabase.miabesite.site', // ✅ Ajout du domaine racine pour Supabase
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Utilisé pour les exemples
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me', // Utilisé pour les avatars de témoignages
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Utilisé pour les images de portfolio/services
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ Réactivé pour réactiver la vérification des types
  },
  output: 'standalone', // ✅ Activé pour optimiser le déploiement Docker
};

export default nextConfig;