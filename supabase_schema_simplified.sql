-- Activer l'extension pgcrypto pour gen_random_uuid() si elle n'est pas déjà activée.
-- Cette extension est souvent activée par défaut sur Supabase.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: sites
CREATE TABLE IF NOT EXISTS public.sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subdomain text UNIQUE NOT NULL,
    site_data jsonb, -- Contient toutes les données du formulaire de l'éditeur
    status text DEFAULT 'draft' NOT NULL, -- 'draft', 'published'
    template_type text DEFAULT 'default' NOT NULL,
    is_public boolean DEFAULT TRUE NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: site_analytics
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    total_sales numeric DEFAULT 0 NOT NULL,
    total_contacts integer DEFAULT 0 NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: site_messages
CREATE TABLE IF NOT EXISTS public.site_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name text,
    sender_email text,
    sender_phone text,
    service_interested text,
    message text NOT NULL,
    read_status boolean DEFAULT FALSE NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: communities
CREATE TABLE IF NOT EXISTS public.communities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: community_members
CREATE TABLE IF NOT EXISTS public.community_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (community_id, user_id)
);

-- Table: coin_transactions
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Peut être NULL si l'admin est l'expéditeur (système)
    recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    transaction_type text NOT NULL, -- 'referral_bonus', 'admin_credit', 'admin_debit', 'transfer', 'ai_video_generation'
    description text,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: push_subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription jsonb NOT NULL, -- Contient l'endpoint, les clés, etc.
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, (subscription->>'endpoint'))
);

-- Table: ai_video_access
CREATE TABLE IF NOT EXISTS public.ai_video_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- L'admin qui a accordé l'accès
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

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