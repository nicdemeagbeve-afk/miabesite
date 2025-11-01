import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client"; // Import client-side Supabase for utility

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Génère une URL pour un asset stocké dans le bucket 'static-assets' de Supabase.
 * Assurez-vous que NEXT_PUBLIC_SUPABASE_URL est défini dans vos variables d'environnement.
 * @param path Le chemin du fichier dans le bucket (ex: 'miabesite-logo.png').
 * @returns L'URL publique complète de l'asset.
 */
export const getSupabaseStorageUrl = (path: string) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL n'est pas défini. Les assets Supabase ne seront pas chargés.");
    // Fallback à un chemin local ou un placeholder si l'URL Supabase n'est pas configurée
    return `/public/${path}`; 
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supprime le slash final si présent
  const baseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
  // Assurez-vous que le chemin du bucket est correct.
  // Si votre bucket est 'static-assets', le chemin est 'storage/v1/object/public/static-assets/'
  // Si votre bucket est 'profile-pictures', le chemin est 'storage/v1/object/public/profile-pictures/'
  // Pour les assets statiques globaux, on suppose 'static-assets'
  return `${baseUrl}/storage/v1/object/public/static-assets/${path}`;
};

/**
 * Génère un code de parrainage unique à 5 chiffres.
 * @param supabase L'instance du client Supabase.
 * @returns Une promesse qui se résout avec un code de parrainage unique.
 */
export async function generateUniqueReferralCode(supabase: ReturnType<typeof createClient>): Promise<string> {
  let code: string = ''; // Initialized to prevent TS2454 error
  let isUnique = false;
  while (!isUnique) {
    code = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit number
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('referral_code', code)
      .single();

    if (error && error.code === 'PGRST116') { // No rows found, code is unique
      isUnique = true;
    } else if (data) {
      // Code exists, regenerate
    } else if (error) {
      console.error("Error checking referral code uniqueness:", error);
      throw new Error("Failed to generate unique referral code.");
    }
  }
  return code;
}