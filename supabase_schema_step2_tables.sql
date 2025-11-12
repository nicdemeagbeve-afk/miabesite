-- Table: profiles
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

-- Table: sites
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

-- Table: site_analytics
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    total_sales numeric DEFAULT 0 NOT NULL,
    total_contacts integer DEFAULT 0 NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Table: site_messages
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

-- Table: communities
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

-- Table: community_members
CREATE TABLE IF NOT EXISTS public.community_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (community_id, user_id)
);

-- Table: coin_transactions
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Peut être NULL si l'admin est l'expéditeur (système)
    recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    transaction_type text NOT NULL, -- 'referral_bonus', 'admin_credit', 'admin_debit', 'transfer', 'ai_video_generation'
    description text
);

-- Table: push_subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription jsonb NOT NULL, -- Contient l'endpoint, les clés, etc.
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, (subscription->>'endpoint')) -- Empêche les doublons pour le même utilisateur et endpoint
);

-- Table: ai_video_access
CREATE TABLE IF NOT EXISTS public.ai_video_access (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- L'admin qui a accordé l'accès
    created_at timestamp with time zone DEFAULT now() NOT NULL
);