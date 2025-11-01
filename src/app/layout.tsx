import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/landing/Header"; // Import Header
import { Toaster } from "@/components/ui/sonner"; // Import Toaster
import { CookieConsentBanner } from "@/components/CookieConsentBanner"; // Import CookieConsentBanner
import { PushNotificationInitializer } from "@/components/PushNotificationInitializer"; // Import PushNotificationInitializer

export const metadata: Metadata = {
  title: "Miabesite | le site pour tous",
  description: "Votre site web tout en main, en seulement 15 min, et 10 reponses, pour 0Fcfa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header /> {/* Render Header globally */}
          {children}
          <Toaster /> {/* Render Toaster globally */}
          <CookieConsentBanner /> {/* Render CookieConsentBanner globally */}
          <div className="fixed bottom-6 left-6 z-50">
            <PushNotificationInitializer /> {/* Add the initializer here */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}