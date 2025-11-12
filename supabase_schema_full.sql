-- supabase_schema_full.sql

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tables
-- Table pour les profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    whatsapp_number TEXT,
    secondary_phone_number TEXT,
    expertise TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' NOT NULL, -- 'user', 'community_admin', 'super_admin'
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    coin_points INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table pour les sites web
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    site_data JSONB DEFAULT '{}'::JSONB NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'published', 'archived'
    template_type TEXT DEFAULT 'default' NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table pour les messages de contact des sites
CREATE TABLE IF NOT EXISTS site_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT,
    sender_email TEXT,
    sender_phone TEXT,
    service_interested TEXT,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table pour les statistiques de site
CREATE TABLE IF NOT EXISTS site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    total_visits BIGINT DEFAULT 0 NOT NULL,
    total_sales BIGINT DEFAULT 0 NOT NULL,
    total_contacts BIGINT DEFAULT 0 NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (site_id)
);

-- Table pour les communautés
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    utility TEXT,
    positioning_domain TEXT,
    template_1 TEXT NOT NULL,
    template_2 TEXT NOT NULL,
    category TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    join_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table pour les membres de communauté
CREATE TABLE IF NOT EXISTS community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (community_id, user_id)
);

-- Table pour les invitations de communauté
CREATE TABLE IF NOT EXISTS community_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invited_email TEXT NOT NULL,
    invitation_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (community_id, invited_email)
);

-- Table pour l'historique des transactions de pièces
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INT NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table pour gérer l'accès à la génération de vidéos IA
CREATE TABLE IF NOT EXISTS ai_video_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table pour stocker les abonnements aux notifications push
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, (subscription->>'endpoint'))
);

-- Table pour lier les utilisateurs WhatsApp à leurs profils Miabesite
CREATE TABLE IF NOT EXISTS whatsapp_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    whatsapp_number TEXT UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_code TEXT,
    code_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Fonctions et Triggers pour 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON communities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_analytics_last_updated ON site_analytics;
CREATE TRIGGER update_site_analytics_last_updated
BEFORE UPDATE ON site_analytics
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

DROP TRIGGER IF EXISTS update_whatsapp_users_updated_at ON whatsapp_users;
CREATE TRIGGER update_whatsapp_users_updated_at
BEFORE UPDATE ON whatsapp_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Activer le Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_video_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_users ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS
-- Policies for public.profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for public.sites
DROP POLICY IF EXISTS "Sites are viewable by owner, members, or if public." ON public.sites;
CREATE POLICY "Sites are viewable by owner, members, or if public." ON public.sites
  FOR SELECT USING (
    is_public = TRUE OR
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can create sites." ON public.sites;
CREATE POLICY "Users can create sites." ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can update their sites." ON public.sites;
CREATE POLICY "Owners can update their sites." ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can delete their sites." ON public.sites;
CREATE POLICY "Owners can delete their sites." ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.site_messages
DROP POLICY IF EXISTS "Site messages are viewable by site owner." ON public.site_messages;
CREATE POLICY "Site messages are viewable by site owner." ON public.site_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can insert site messages." ON public.site_messages;
CREATE POLICY "Anyone can insert site messages." ON public.site_messages
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Site owner can update site messages." ON public.site_messages;
CREATE POLICY "Site owner can update site messages." ON public.site_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Site owner can delete site messages." ON public.site_messages;
CREATE POLICY "Site owner can delete site messages." ON public.site_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

-- Policies for public.site_analytics
DROP POLICY IF EXISTS "Site analytics are viewable by site owner." ON public.site_analytics;
CREATE POLICY "Site analytics are viewable by site owner." ON public.site_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Site analytics can be inserted by site owner." ON public.site_analytics;
CREATE POLICY "Site analytics can be inserted by site owner." ON public.site_analytics
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Site analytics can be updated by site owner." ON public.site_analytics;
CREATE POLICY "Site analytics can be updated by site analytics." ON public.site_analytics
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

-- Policies for public.communities
DROP POLICY IF EXISTS "Communities are viewable by members or if public." ON public.communities;
CREATE POLICY "Communities are viewable by members or if public." ON public.communities
  FOR SELECT USING (
    is_public = TRUE OR
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.community_members WHERE community_members.community_id = communities.id AND community_members.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create communities." ON public.communities;
CREATE POLICY "Users can create communities." ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update their communities." ON public.communities;
CREATE POLICY "Owners can update their communities." ON public.communities
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete their communities." ON public.communities;
CREATE POLICY "Owners can delete their communities." ON public.communities
  FOR DELETE USING (auth.uid() = owner_id);

-- Policies for public.community_members
DROP POLICY IF EXISTS "Community members are viewable by members or owner." ON public.community_members;
CREATE POLICY "Community members are viewable by members or owner." ON public.community_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.communities WHERE communities.id = community_id AND (communities.owner_id = auth.uid() OR communities.is_public = TRUE OR community_members.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Users can join communities." ON public.community_members;
CREATE POLICY "Users can join communities." ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can leave communities." ON public.community_members;
CREATE POLICY "Members can leave communities." ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.community_invitations
DROP POLICY IF EXISTS "Community invitations are viewable by invited user or inviter." ON public.community_invitations;
CREATE POLICY "Community invitations are viewable by invited user or inviter." ON public.community_invitations
  FOR SELECT USING (
    auth.uid() = invited_by OR
    auth.email() = invited_email
  );

DROP POLICY IF EXISTS "Users can create invitations." ON public.community_invitations;
CREATE POLICY "Users can create invitations." ON public.community_invitations
  FOR INSERT WITH CHECK (auth.uid() = invited_by);

DROP POLICY IF EXISTS "Invited user can update their invitation status." ON public.community_invitations;
CREATE POLICY "Invited user can update their invitation status." ON public.community_invitations
  FOR UPDATE USING (auth.email() = invited_email);

DROP POLICY IF EXISTS "Inviter can delete their invitations." ON public.community_invitations;
CREATE POLICY "Inviter can delete their invitations." ON public.community_invitations
  FOR DELETE USING (auth.uid() = invited_by);

-- Policies for public.coin_transactions
DROP POLICY IF EXISTS "Coin transactions are viewable by sender or recipient." ON public.coin_transactions;
CREATE POLICY "Coin transactions are viewable by sender or recipient." ON public.coin_transactions
  FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Super admins can insert coin transactions." ON public.coin_transactions;
CREATE POLICY "Super admins can insert coin transactions." ON public.coin_transactions
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR
    auth.uid() = sender_id
  );

-- Policies for public.ai_video_access
DROP POLICY IF EXISTS "AI video access is viewable by owner or super_admin." ON public.ai_video_access;
CREATE POLICY "AI video access is viewable by owner or super_admin." ON public.ai_video_access
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Super admins can insert AI video access." ON public.ai_video_access;
CREATE POLICY "Super admins can insert AI video access." ON public.ai_video_access
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Super admins can delete AI video access." ON public.ai_video_access;
CREATE POLICY "Super admins can delete AI video access." ON public.ai_video_access
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Policies for public.push_subscriptions
DROP POLICY IF EXISTS "Push subscriptions are viewable by owner." ON public.push_subscriptions;
CREATE POLICY "Push subscriptions are viewable by owner." ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own push subscriptions." ON public.push_subscriptions;
CREATE POLICY "Users can insert their own push subscriptions." ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own push subscriptions." ON public.push_subscriptions;
CREATE POLICY "Users can delete their own push subscriptions." ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.whatsapp_users
DROP POLICY IF EXISTS "Whatsapp users are viewable by owner or super_admin." ON public.whatsapp_users;
CREATE POLICY "Whatsapp users are viewable by owner or super_admin." ON public.whatsapp_users
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Users can insert their own whatsapp user entry." ON public.whatsapp_users;
CREATE POLICY "Users can insert their own whatsapp user entry." ON public.whatsapp_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own whatsapp user entry." ON public.whatsapp_users;
CREATE POLICY "Users can update their own whatsapp user entry." ON public.whatsapp_users
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own whatsapp user entry." ON public.whatsapp_users;
CREATE POLICY "Users can delete their own whatsapp user entry." ON public.whatsapp_users
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON public.sites (user_id);
CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON public.sites (subdomain);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles (referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles (referred_by);
CREATE INDEX IF NOT EXISTS idx_site_messages_site_id ON public.site_messages (site_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON public.site_analytics (site_id);
CREATE INDEX IF NOT EXISTS idx_communities_owner_id ON public.communities (owner_id);
CREATE INDEX IF NOT EXISTS idx_communities_join_code ON public.communities (join_code);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members (community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members (user_id);
CREATE INDEX IF NOT EXISTS idx_community_invitations_community_id ON public.community_invitations (community_id);
CREATE INDEX IF NOT EXISTS idx_community_invitations_invited_email ON public.community_invitations (invited_email);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_sender_id ON public.coin_transactions (sender_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_recipient_id ON public.coin_transactions (recipient_id);
CREATE INDEX IF NOT EXISTS idx_ai_video_access_user_id ON public.ai_video_access (user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_users_user_id ON public.whatsapp_users (user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_users_whatsapp_number ON public.whatsapp_users (whatsapp_number);