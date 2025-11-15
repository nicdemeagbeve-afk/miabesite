import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster
import { CookieConsentBanner } from "@/components/CookieConsentBanner"; // Import CookieConsentBanner
import { PushNotificationInitializer } from "@/components/PushNotificationInitializer"; // Import PushNotificationInitializer
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar"; // Importez le nouveau composant
import { ConditionalHeader } from "@/components/ConditionalHeader"; // Import the new client component
// import { getSupabaseStorageUrl } from "@/lib/utils"; // Removed import as we use static paths

export const metadata: Metadata = {
  title: "Miabesite | le site pour tous",
  description: "Votre site web tout en main, en seulement 15 min, et 10 reponses, pour 0Fcfa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use static paths for PWA icons
  const icon192 = "/icons/icon-192x192.png";
  const icon512 = "/icons/icon-512x512.png";
  const iconMaskable192 = "/icons/icon-maskable-192x192.png";
  const iconMaskable512 = "/icons/icon-maskable-512x512.png";

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        {/* Dynamically generated icons for PWA */}
        <link rel="apple-touch-icon" sizes="192x192" href={icon192} />
        <link rel="icon" type="image/png" sizes="192x192" href={icon192} />
        <link rel="icon" type="image/png" sizes="512x512" href={icon512} />
        <link rel="mask-icon" href={iconMaskable192} color="#2563eb" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          // Changed defaultTheme to 'light'
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalHeader />
          {children}
          <Toaster />
          <CookieConsentBanner />
          <div className="fixed bottom-6 left-6 z-50">
            <PushNotificationInitializer />
          </div>
          <ServiceWorkerRegistrar />
        </ThemeProvider>
      </body>
    </html>
  );
}