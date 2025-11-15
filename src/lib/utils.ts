import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SupabaseClient } from '@supabase/supabase-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour générer une chaîne alphanumérique aléatoire d'une longueur donnée
function generateRandomAlphanumericCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Nouvelle fonction pour générer une chaîne numérique aléatoire d'une longueur donnée
function generateRandomNumericCode(length: number): string {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Fonction pour générer un code de jointure de communauté unique (6 chiffres)
export async function generateUniqueCommunityJoinCode(supabase: SupabaseClient): Promise<string> {
  let code: string = '';
  let isUnique = false;
  while (!isUnique) {
    code = generateRandomNumericCode(6); // Génère un code de 6 chiffres
    const { data, error } = await supabase
      .from('communities')
      .select('join_code')
      .eq('join_code', code)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    isUnique = !data;
  }
  return code;
}

// Fonction pour générer un code de parrainage unique (6 caractères alphanumériques)
export async function generateUniqueReferralCode(supabase: SupabaseClient): Promise<string> {
  let code: string = '';
  let isUnique = false;
  while (!isUnique) {
    code = generateRandomAlphanumericCode(6); // Génère un code de 6 caractères alphanumériques
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('referral_code', code)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    isUnique = !data;
  }
  return code;
}

/**
 * Construit l'URL publique pour un objet dans Supabase Storage.
 * @param bucket Le nom du bucket de stockage (ex: 'profile-pictures').
 * @param path Le chemin du fichier dans le bucket.
 * @returns L'URL publique complète de l'objet.
 */
export function getSupabaseStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !path) {
    // Fallback for development or missing config
    return `/public/${path}`; // Assuming a local public folder structure
  }
  // Assure que le chemin n'a pas de slash au début
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}