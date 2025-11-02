import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AJOUTEZ CETTE FONCTION SI ELLE N'EXISTE PAS
// Elle génère un code alphanumérique simple. Vous pouvez la rendre plus complexe si nécessaire.
export function generateUniqueReferralCode(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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