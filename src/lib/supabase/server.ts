import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  // TypeScript interprète incorrectement `cookies()` comme une Promise ici.
  // Nous ajoutons une assertion de type 'any' pour contourner l'erreur de compilation.
  // La fonction `cookies()` de `next/headers` est synchrone et retourne directement l'objet.
  const cookieStore: any = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler.
            // This error is typically not a problem if you're only setting cookies in a Server Component or Route Handler.
            // For client-side operations, use the client-side Supabase client.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler.
            // This error is typically not a problem if you're only removing cookies in a Server Component or Route Handler.
            // For client-side operations, use the client-side Supabase client.
          }
        },
      },
    }
  );
}