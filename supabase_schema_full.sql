-- Activer l'extension uuid-ossp pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
-- Stocke les informations de profil étendues des utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
    role text DEFAULT 'user' NOT NULL, -- 'user', 'community_admin', 'super_admin'
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS pour la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('community_admin', 'super_admin'))
  );

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Referral codes are public for lookup" ON public.profiles
  FOR SELECT USING (true); -- Allow anyone to read referral codes for lookup


-- Table: sites
-- Stocke les informations des sites web créés par les utilisateurs
CREATE TABLE IF NOT EXISTS public.sites (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subdomain text UNIQUE NOT NULL,
    site_data jsonb, -- Contient toutes les données du formulaire de l'éditeur
    status text DEFAULT 'draft' NOT NULL, -- 'draft', 'published'
    template_type text DEFAULT 'default' NOT NULL,
    is_public boolean DEFAULT TRUE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS pour la table sites
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sites" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public sites are viewable by everyone" ON public.sites
  FOR SELECT USING (is_public = TRUE);


-- Table: site_analytics
-- Stocke les statistiques de visite et d'interaction pour chaque site
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    total_sales numeric DEFAULT 0 NOT NULL,
    total_contacts integer DEFAULT 0 NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS pour la table site_analytics
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners can view their analytics" ON public.site_analytics
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));

CREATE POLICY "Anyone can increment visits" ON public.site_analytics
  FOR UPDATE USING (true) WITH CHECK (true); -- Allow anonymous updates for visit tracking


-- Table: site_messages
-- Stocke les messages envoyés via les formulaires de contact des sites
CREATE TABLE IF NOT EXISTS public.site_messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name text,
    sender_email text,
    sender_phone text,
    service_interested text,
    message text NOT NULL,
    read_status boolean DEFAULT FALSE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS pour la table site_messages
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners can view their messages" ON public.site_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));

CREATE POLICY "Anyone can insert messages" ON public.site_messages
  FOR INSERT WITH CHECK (true); -- Allow anonymous inserts

CREATE POLICY "Site owners can update their messages" ON public.site_messages
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));

CREATE POLICY "Site owners can delete their messages" ON public.site_messages
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));


-- Table: communities
-- Stocke les informations sur les communautés créées
CREATE TABLE IF NOT EXISTS public.communities (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text UNIQUE NOT NULL,
    description text,
    utility text,
    positioning_domain text,
    template_1 text NOT NULL,
    template_2 text NOT NULL,
    category text NOT NULL,
    is_public boolean DEFAULT TRUE NOT NULL,
    join_code text UNIQUE, -- Code de 6 chiffres pour les communautés privées
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS pour la table communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view public communities" ON public.communities
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Community owners can view their own communities" ON public.communities
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Community owners can create communities" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Community owners can update their own communities" ON public.communities
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Community owners can delete their own communities" ON public.communities
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Super admins can view all communities" ON public.communities
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins can manage all communities" ON public.communities
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );


-- Table: community_members
-- Gère les adhésions des utilisateurs aux communautés
CREATE TABLE IF NOT EXISTS public.community_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (community_id, user_id)
);

-- RLS pour la table community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view community members" ON public.community_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND is_public = TRUE) OR
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_members.community_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND owner_id = auth.uid())
  );

CREATE POLICY "Authenticated users can join communities" ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Community owners can remove members" ON public.community_members
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND owner_id = auth.uid()));

CREATE POLICY "Users can leave communities" ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);


-- Table: coin_transactions
-- Enregistre toutes les transactions de pièces
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Peut être NULL si l'admin est l'expéditeur (système)
    recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    transaction_type text NOT NULL, -- 'referral_bonus', 'admin_credit', 'admin_debit', 'transfer', 'ai_video_generation'
    description text
);

-- RLS pour la table coin_transactions
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Super admins can view all transactions" ON public.coin_transactions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins can insert transactions" ON public.coin_transactions
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Users can insert self-deduction transactions" ON public.coin_transactions
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND auth.uid() = recipient_id AND amount < 0 AND transaction_type = 'ai_video_generation'
  );


-- Table: push_subscriptions
-- Stocke les abonnements aux notifications push des utilisateurs
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription jsonb NOT NULL, -- Contient l'endpoint, les clés, etc.
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, (subscription->>'endpoint')) -- Empêche les doublons pour le même utilisateur et endpoint
);

-- RLS pour la table push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can view all subscriptions" ON public.push_subscriptions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );


-- Table: ai_video_access
-- Gère l'accès des utilisateurs à la génération de vidéos IA
CREATE TABLE IF NOT EXISTS public.ai_video_access (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- L'admin qui a accordé l'accès
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS pour la table ai_video_access
ALTER TABLE public.ai_video_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage AI video access" ON public.ai_video_access
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Users can view their own AI video access" ON public.ai_video_access
  FOR SELECT USING (auth.uid() = user_id);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles (referral_code);
CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON public.sites (subdomain);
CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON public.site_analytics (site_id);
CREATE INDEX IF NOT EXISTS idx_site_messages_site_id ON public.site_messages (site_id);
CREATE INDEX IF NOT EXISTS idx_communities_owner_id ON public.communities (owner_id);
CREATE INDEX IF NOT EXISTS idx_communities_join_code ON public.communities (join_code);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members (community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members (user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_sender_id ON public.coin_transactions (sender_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_recipient_id ON public.coin_transactions (recipient_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_video_access_user_id ON public.ai_video_access (user_id);