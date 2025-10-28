import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  // The `cookies()` function must be called inside the `get`, `set`, and `remove` methods
  // to ensure it's executed in the correct server context.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookies().set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler.
            // This error is typically not a problem if you're only setting cookies in a Server Component or Route Handler.
            // For client-side operations, use the client-side Supabase client.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookies().set({ name, value: "", ...options });
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