"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link"; // Import Link
import { getSupabaseStorageUrl } from "@/lib/utils"; // Import getSupabaseStorageUrl
import { createClient } from "@/lib/supabase/client"; // Import client-side Supabase

export function HeroSection() {
  const [user, setUser] = React.useState<any>(null);
  const supabase = createClient();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };

    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 text-primary-foreground px-4 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={getSupabaseStorageUrl("hero-video.mp4")} // Using Supabase storage URL
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80 z-10"></div>

      <div className="container mx-auto text-center relative z-20"> {/* Ensure text is above the overlay */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            Ton site web en 5 minutes.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light">
            Ton business en ligne démarre aujourd’hui — <span className="font-semibold">Gratuitement</span> !
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/create-site/select-template" passHref>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto">
                <div>
                  Je crée mon site maintenant
                </div>
              </Button>
            </Link>
            {!user && (
              <>
                <Link href="/login" passHref>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto">
                    <div>
                      Connexion
                    </div>
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto">
                    <div>
                      Inscription
                    </div>
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 text-base md:text-lg">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Sécurisé</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Garantie satisfaction</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Support 24h/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}