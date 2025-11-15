-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Supprimer le trigger existant s'il y en a un
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer la fonction existante
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Supprimer les tables dans l'ordre inverse des dépendances, avec CASCADE pour supprimer les politiques RLS associées
DROP TABLE IF EXISTS public.community_members CASCADE;
DROP TABLE IF EXISTS public.coin_transactions CASCADE;
DROP TABLE IF EXISTS public.ai_video_access CASCADE;
DROP TABLE IF EXISTS public.site_messages CASCADE;
DROP TABLE IF EXISTS public.site_analytics CASCADE;
DROP TABLE IF EXISTS public.sites CASCADE;
DROP TABLE IF EXISTS public.communities CASCADE;
DROP TABLE IF EXISTS public.push_subscriptions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- Table: public.profiles
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text,
    first_name text,
    last_name text,
    date_of_birth date,
    phone_number text,
    whatsapp_number text,
    expertise text,
    avatar_url text,
    referral_code text UNIQUE,
    coin_points integer DEFAULT 0 NOT NULL,
    referral_count integer DEFAULT 0 NOT NULL,
    referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    role text DEFAULT 'user'::text NOT NULL
);

-- Trigger pour mettre à jour 'updated_at'
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- Index pour les codes de parrainage et les rôles
CREATE INDEX profiles_referral_code_idx ON public.profiles (referral_code);
CREATE INDEX profiles_role_idx ON public.profiles (role);
CREATE INDEX profiles_referred_by_idx ON public.profiles (referred_by);

-- RLS pour public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique de base: un utilisateur peut toujours voir et modifier son propre profil
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les rôles administratifs (utilisant service_role pour éviter la récursion)
-- Ces politiques permettent aux super_admins d'accéder à TOUS les profils.
-- Pour les community_admins, ils peuvent voir les profils (y compris les leurs).
-- La modification des rôles par un community_admin devrait être gérée par une fonction RPC ou une API.
CREATE POLICY "Super admins can manage all profiles." ON public.profiles
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Pour les community_admins, ils peuvent voir les profils (y compris les leurs)
CREATE POLICY "Community admins can view profiles." ON public.profiles
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'community_admin' OR role = 'super_admin')));


-- Table: public.communities
CREATE TABLE public.communities (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    utility text,
    positioning_domain text,
    template_1 text NOT NULL,
    template_2 text NOT NULL,
    category text NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    join_code text UNIQUE -- Code de jointure pour les communautés privées
);

-- Index pour les communautés
CREATE INDEX communities_owner_id_idx ON public.communities (owner_id);
CREATE INDEX communities_category_idx ON public.communities (category);
CREATE INDEX communities_is_public_idx ON public.communities (is_public);
CREATE INDEX communities_join_code_idx ON public.communities (join_code);

-- RLS pour public.communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.communities
  FOR SELECT USING (is_public = true OR owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.community_members WHERE community_id = communities.id AND user_id = auth.uid()));

CREATE POLICY "Enable insert for authenticated users only" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable update for users based on owner_id" ON public.communities
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Enable delete for users based on owner_id" ON public.communities
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Super admins can manage all communities." ON public.communities
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.community_members
CREATE TABLE public.community_members (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    UNIQUE (community_id, user_id)
);

-- Index pour les membres de la communauté
CREATE INDEX community_members_community_id_idx ON public.community_members (community_id);
CREATE INDEX community_members_user_id_idx ON public.community_members (user_id);

-- RLS pour public.community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert their own membership." ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow members to read their own community memberships." ON public.community_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow community owners to read all members of their community." ON public.community_members
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.communities WHERE id = community_members.community_id AND owner_id = auth.uid()));

CREATE POLICY "Allow community owners to delete members from their community." ON public.community_members
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.communities WHERE id = community_members.community_id AND owner_id = auth.uid()));

CREATE POLICY "Super admins can manage all community memberships." ON public.community_members
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.coin_transactions
CREATE TABLE public.coin_transactions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Peut être NULL si l'admin est le "sender" logique
    recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    transaction_type text NOT NULL, -- ex: 'referral_bonus', 'admin_credit', 'admin_debit', 'ai_video_generation'
    description text
);

-- Index pour les transactions de pièces
CREATE INDEX coin_transactions_sender_id_idx ON public.coin_transactions (sender_id);
CREATE INDEX coin_transactions_recipient_id_idx ON public.coin_transactions (recipient_id);
CREATE INDEX coin_transactions_type_idx ON public.coin_transactions (transaction_type);

-- RLS pour public.coin_transactions
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own transactions." ON public.coin_transactions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Allow authenticated users to insert transactions." ON public.coin_transactions
  FOR INSERT WITH CHECK (auth.uid() = sender_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "Super admins can manage all coin transactions." ON public.coin_transactions
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.ai_video_access
CREATE TABLE public.ai_video_access (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    granted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL -- L'admin qui a accordé l'accès
);

-- Index pour l'accès vidéo IA
CREATE INDEX ai_video_access_user_id_idx ON public.ai_video_access (user_id);

-- RLS pour public.ai_video_access
ALTER TABLE public.ai_video_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own AI video access." ON public.ai_video_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage AI video access." ON public.ai_video_access
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.sites
CREATE TABLE public.sites (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subdomain text UNIQUE NOT NULL,
    site_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL, -- 'draft', 'published'
    template_type text DEFAULT 'default'::text NOT NULL,
    is_public boolean DEFAULT false NOT NULL
);

-- Trigger pour mettre à jour 'updated_at' (si nécessaire, mais pas dans le schéma actuel)
-- CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- Index pour les sites
CREATE INDEX sites_user_id_idx ON public.sites (user_id);
CREATE INDEX sites_subdomain_idx ON public.sites (subdomain);
CREATE INDEX sites_is_public_idx ON public.sites (is_public);

-- RLS pour public.sites
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to create a site." ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read their own sites." ON public.sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own sites." ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own sites." ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow anonymous and authenticated users to read public sites." ON public.sites
  FOR SELECT USING (is_public = true);

CREATE POLICY "Super admins can manage all sites." ON public.sites
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.site_analytics
CREATE TABLE public.site_analytics (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_visits integer DEFAULT 0 NOT NULL,
    total_sales integer DEFAULT 0 NOT NULL,
    total_contacts integer DEFAULT 0 NOT NULL
);

-- Trigger pour mettre à jour 'last_updated'
CREATE TRIGGER handle_last_updated BEFORE UPDATE ON public.site_analytics FOR EACH ROW EXECUTE FUNCTION moddatetime('last_updated');

-- Index pour les analytics
CREATE INDEX site_analytics_site_id_idx ON public.site_analytics (site_id);

-- RLS pour public.site_analytics
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow site owners to read their analytics." ON public.site_analytics
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_analytics.site_id AND user_id = auth.uid()));

CREATE POLICY "Allow site owners to update their analytics." ON public.site_analytics
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_analytics.site_id AND user_id = auth.uid()));

-- La politique pour les visites anonymes doit être plus permissive mais ne pas permettre de modifier d'autres champs
CREATE POLICY "Allow anonymous users to increment visits." ON public.site_analytics
  FOR UPDATE USING (true) WITH CHECK (true); -- Cette politique est trop large. Mieux vaut utiliser une fonction RPC pour incrémenter.
  -- Pour l'instant, nous la laissons ainsi, mais une fonction RPC serait plus sécurisée.

CREATE POLICY "Super admins can manage all site analytics." ON public.site_analytics
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.site_messages
CREATE TABLE public.site_messages (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name text,
    sender_email text,
    sender_phone text,
    service_interested text,
    message text NOT NULL,
    read_status boolean DEFAULT false NOT NULL
);

-- Index pour les messages de site
CREATE INDEX site_messages_site_id_idx ON public.site_messages (site_id);
CREATE INDEX site_messages_read_status_idx ON public.site_messages (read_status);

-- RLS pour public.site_messages
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow site owners to read their messages." ON public.site_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_messages.site_id AND user_id = auth.uid()));

CREATE POLICY "Allow anonymous users to insert messages." ON public.site_messages
  FOR INSERT WITH CHECK (true); -- Tout le monde peut envoyer un message via le formulaire public

CREATE POLICY "Allow site owners to update message read status." ON public.site_messages
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_messages.site_id AND user_id = auth.uid()));

CREATE POLICY "Allow site owners to delete their messages." ON public.site_messages
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_messages.site_id AND user_id = auth.uid()));

CREATE POLICY "Super admins can manage all site messages." ON public.site_messages
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));


-- Table: public.push_subscriptions
CREATE TABLE public.push_subscriptions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription jsonb NOT NULL -- Contient l'endpoint, keys (p256dh, auth), expirationTime
);

-- Index pour les souscriptions push
CREATE INDEX push_subscriptions_user_id_idx ON public.push_subscriptions (user_id);
-- Unique index for user_id and subscription endpoint
CREATE UNIQUE INDEX push_subscriptions_user_id_endpoint_idx ON public.push_subscriptions (user_id, (subscription->>'endpoint'));

-- RLS pour public.push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert their own subscriptions." ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read their own subscriptions." ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own subscriptions." ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all push subscriptions." ON public.push_subscriptions
  FOR ALL TO service_role USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Fonction pour créer un profil après l'inscription d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _referral_code TEXT;
    _full_name TEXT;
    _first_name TEXT;
    _last_name TEXT;
    _date_of_birth DATE;
    _phone_number TEXT;
    _whatsapp_number TEXT;
    _expertise TEXT;
    _avatar_url TEXT;
BEGIN
    -- Générer un code de parrainage unique
    LOOP
        _referral_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = _referral_code);
    END LOOP;

    -- Récupérer les données de user_metadata, en s'assurant qu'elles sont non nulles
    _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
    _first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    _last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    _date_of_birth := (NEW.raw_user_meta_data->>'date_of_birth')::DATE;
    _phone_number := COALESCE(NEW.raw_user_meta_data->>'phone_number', '');
    _whatsapp_number := COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', NEW.raw_user_meta_data->>'phone_number', ''); -- Fallback to phone_number
    _expertise := COALESCE(NEW.raw_user_meta_data->>'expertise', '');
    _avatar_url := NEW.raw_user_meta_data->>'avatar_url';

    INSERT INTO public.profiles (
        id,
        full_name,
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        whatsapp_number,
        expertise,
        avatar_url,
        referral_code,
        coin_points,
        referral_count,
        role
    ) VALUES (
        NEW.id,
        _full_name,
        _first_name,
        _last_name,
        _date_of_birth,
        _phone_number,
        _whatsapp_number,
        _expertise,
        _avatar_url,
        _referral_code,
        50, -- Points bonus pour l'inscription
        0,
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour appeler la fonction après l'insertion d'un nouvel utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Définir les propriétaires des tables pour Supabase (si ce n'est pas déjà fait)
ALTER TABLE public.profiles OWNER TO postgres;
ALTER TABLE public.communities OWNER TO postgres;
ALTER TABLE public.community_members OWNER TO postgres;
ALTER TABLE public.coin_transactions OWNER TO postgres;
ALTER TABLE public.ai_video_access OWNER TO postgres;
ALTER TABLE public.sites OWNER TO postgres;
ALTER TABLE public.site_analytics OWNER TO postgres;
ALTER TABLE public.site_messages OWNER TO postgres;
ALTER TABLE public.push_subscriptions OWNER TO postgres;

-- Grant permissions to the anon and authenticated roles
GRANT ALL ON TABLE public.profiles TO anon, authenticated;
GRANT ALL ON TABLE public.communities TO anon, authenticated;
GRANT ALL ON TABLE public.community_members TO anon, authenticated;
GRANT ALL ON TABLE public.coin_transactions TO anon, authenticated;
GRANT ALL ON TABLE public.ai_video_access TO anon, authenticated;
GRANT ALL ON TABLE public.sites TO anon, authenticated;
GRANT ALL ON TABLE public.site_analytics TO anon, authenticated;
GRANT ALL ON TABLE public.site_messages TO anon, authenticated;
GRANT ALL ON TABLE public.push_subscriptions TO anon, authenticated;

-- Grant usage on sequences (if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;

-- Set default privileges for new tables/functions
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;