/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Exemple de Content Security Policy (CSP) - à adapter !
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.supabase.co *.supabase.miabesite.site picsum.photos randomuser.me images.unsplash.com;"
          // }
        ],
      },
    ]
  },
  // Ajoutez cette section pour ignorer les erreurs ESLint pendant le build
  eslint: {
    // Attention: Ceci permet de compiler en production même si votre projet a des erreurs ESLint.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; // Export nextConfig directly