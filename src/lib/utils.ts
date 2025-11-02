import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SupabaseClient } from '@supabase/supabase-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour générer une chaîne aléatoire d'une longueur donnée
function generateRandomCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Fonction pour générer un code de jointure de communauté unique
export async function generateUniqueCommunityJoinCode(supabase: SupabaseClient): Promise<string> {
  let code: string = ''; // Initialiser 'code'
  let isUnique = false;
  while (!isUnique) {
    code = generateRandomCode(8); // Longueur exemple pour le code de jointure
    const { data, error } = await supabase
      .from('communities') // Supposant une table 'communities'
      .select('join_code')
      .eq('join_code', code)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 signifie "aucune ligne trouvée"
      throw error; // Les autres erreurs doivent être gérées
    }
    isUnique = !data; // Si data est null, le code est unique
  }
  return code;
}

// Fonction pour générer un code de parrainage unique
export async function generateUniqueReferralCode(supabase: SupabaseClient): Promise<string> {
  let code: string = ''; // Initialiser 'code'
  let isUnique = false;
  while (!isUnique) {
    code = generateRandomCode(6); // Longueur exemple pour le code de parrainage
    const { data, error } = await supabase
      .from('profiles') // CORRECTION: Query 'profiles' table
      .select('referral_code')
      .eq('referral_code', code)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 signifie "aucune ligne trouvée"
      throw error; // Les autres erreurs doivent être gérées
    }
    isUnique = !data; // Si data est null, le code est unique
  }
  return code;
}

// AJOUTEZ CETTE NOUVELLE FONCTION
/**
 * Construit l'URL publique pour un objet dans Supabase Storage.
 * @param bucket Le nom du bucket de stockage (ex: 'profile-pictures').
 * @param path Le chemin du fichier dans le bucket.
 * @returns L'URL publique complète de l'objet.
 */
export function getSupabaseStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !path) {
    return ""; // Retourne une chaîne vide si l'URL ou le chemin n'est pas défini
  }
  // Assure que le chemin n'a pas de slash au début
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
}