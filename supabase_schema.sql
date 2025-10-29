-- Supprimer les politiques RLS existantes pour un nettoyage propre
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sites;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.sites;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.sites;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.sites;

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS public.sites CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Supprimer les buckets de stockage existants si ils existent
SELECT supabase_storage.drop_bucket('profile-pictures');
SELECT supabase_storage.drop_bucket('site-assets');

-- Créer la table 'profiles' pour les métadonnées utilisateur
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone DEFAULT now(),
  full_name text,
  whatsapp_number text,
  secondary_phone_number text,
  avatar_url text
);

-- Activer RLS sur la table 'profiles'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table 'profiles'
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Créer la table 'sites' pour les données des sites web
CREATE TABLE public.sites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subdomain text UNIQUE NOT NULL, -- Identifiant unique pour l'URL du site
  site_data jsonb NOT NULL, -- Toutes les données du wizard
  status text DEFAULT 'draft' NOT NULL, -- 'draft', 'published', etc.
  template_type text DEFAULT 'default' NOT NULL, -- 'default', 'ecommerce', 'service-portfolio', etc.
  created_at timestamp with time zone DEFAULT now()
);

-- Activer RLS sur la table 'sites'
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table 'sites'
-- Les utilisateurs peuvent voir tous les sites publiés et leurs propres sites (brouillons ou publiés)
CREATE POLICY "Enable read access for all users" ON public.sites
  FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

-- Les utilisateurs authentifiés peuvent insérer leurs propres sites
CREATE POLICY "Enable insert for authenticated users only" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres sites
CREATE POLICY "Enable update for users based on user_id" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres sites
CREATE POLICY "Enable delete for users based on user_id" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Créer des buckets de stockage pour les fichiers
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour le bucket 'profile-pictures'
CREATE POLICY "Allow authenticated users to upload their own avatar" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to update their own avatar" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow public read access to profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

-- Politiques RLS pour le bucket 'site-assets'
CREATE POLICY "Allow authenticated users to upload site assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to update site assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow public read access to site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

-- Activer la réplication pour les tables (nécessaire pour les fonctions Edge, etc.)
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.sites REPLICA IDENTITY FULL;