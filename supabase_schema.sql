-- Création de la table 'profiles' pour stocker les informations supplémentaires des utilisateurs
-- Cette table est liée à la table d'authentification de Supabase (auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL -- Correction: virgule supprimée ici
  -- Ajoutez d'autres champs de profil si nécessaire, par exemple:
  -- username TEXT UNIQUE,
  -- avatar_url TEXT
  -- Pour l'instant, nous gardons simple.
);

-- Activez RLS pour la table 'profiles'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir et modifier leur propre profil
CREATE POLICY "Users can view and update their own profile." ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Création de la table 'sites' pour stocker les informations de chaque site web créé
CREATE TABLE public.sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  public_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  secondary_phone_number TEXT,
  email TEXT,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  logo_or_photo_url TEXT, -- URL vers le stockage Supabase

  hero_slogan TEXT NOT NULL,
  about_story TEXT NOT NULL,
  portfolio_proof_link TEXT,
  portfolio_proof_description TEXT,

  subdomain TEXT UNIQUE NOT NULL,
  contact_button_action TEXT NOT NULL,
  facebook_link TEXT,
  instagram_link TEXT,
  linkedin_link TEXT,
  payment_methods TEXT[] NOT NULL DEFAULT '{}', -- Tableau de chaînes de caractères
  delivery_option TEXT NOT NULL,
  deposit_required BOOLEAN DEFAULT FALSE NOT NULL,

  site_status TEXT DEFAULT 'offline' NOT NULL, -- 'online', 'offline', 'building'
  custom_domain TEXT, -- Pour les domaines personnalisés
  selected_template TEXT DEFAULT 'default' NOT NULL,
  font_family TEXT DEFAULT 'sans' NOT NULL,
  show_testimonials BOOLEAN DEFAULT TRUE NOT NULL
);

-- Activez RLS pour la table 'sites'
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de créer leurs propres sites
CREATE POLICY "Users can create their own sites." ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de voir leurs propres sites
CREATE POLICY "Users can view their own sites." ON public.sites
  FOR SELECT USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de modifier leurs propres sites
CREATE POLICY "Users can update their own sites." ON public.sites
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres sites
CREATE POLICY "Users can delete their own sites." ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Création de la table 'products_and_services' pour stocker les offres de chaque site
CREATE TABLE public.products_and_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  title TEXT NOT NULL,
  price NUMERIC,
  currency TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT, -- URL vers le stockage Supabase
  action_button TEXT NOT NULL
);

-- Activez RLS pour la table 'products_and_services'
ALTER TABLE public.products_and_services ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de créer des produits/services pour leurs sites
CREATE POLICY "Users can create products/services for their sites." ON public.products_and_services
  FOR INSERT WITH CHECK ((SELECT user_id FROM public.sites WHERE id = site_id) = auth.uid());

-- Politique pour permettre aux utilisateurs de voir les produits/services de leurs sites
CREATE POLICY "Users can view products/services for their sites." ON public.products_and_services
  FOR SELECT USING ((SELECT user_id FROM public.sites WHERE id = site_id) = auth.uid());

-- Politique pour permettre aux utilisateurs de modifier les produits/services de leurs sites
CREATE POLICY "Users can update products/services for their sites." ON public.products_and_services
  FOR UPDATE USING ((SELECT user_id FROM public.sites WHERE id = site_id) = auth.uid()) WITH CHECK ((SELECT user_id FROM public.sites WHERE id = site_id) = auth.uid());

-- Politique pour permettre aux utilisateurs de supprimer les produits/services de leurs sites
CREATE POLICY "Users can delete products/services from their sites." ON public.products_and_services
  FOR DELETE USING ((SELECT user_id FROM public.sites WHERE id = site_id) = auth.uid());

-- Fonction pour mettre à jour le champ 'updated_at' automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table 'profiles'
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour la table 'sites'
CREATE TRIGGER update_sites_updated_at
BEFORE UPDATE ON public.sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Configuration du stockage (Storage)
-- Vous devrez créer ces buckets manuellement dans la section 'Storage' de Supabase
-- et configurer leurs politiques RLS.

-- Bucket 'logos': Pour les logos ou photos de profil des sites
-- Politiques RLS suggérées pour le bucket 'logos':
-- - SELECT: Tout le monde peut voir les images (public)
-- - INSERT: Seuls les utilisateurs authentifiés peuvent uploader (avec vérification de la taille/type)
-- - UPDATE/DELETE: Seul le propriétaire du site peut modifier/supprimer son logo

-- Bucket 'product_images': Pour les images des produits/services
-- Politiques RLS suggérées pour le bucket 'product_images':
-- - SELECT: Tout le monde peut voir les images (public)
-- - INSERT: Seuls les utilisateurs authentifiés peuvent uploader (avec vérification de la taille/type)
-- - UPDATE/DELETE: Seul le propriétaire du site peut modifier/supprimer les images de ses produits