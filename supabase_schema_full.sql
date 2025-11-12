-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'profiles' table
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text NULL,
    first_name text NULL,
    last_name text NULL,
    date_of_birth date NULL,
    phone_number text NULL,
    whatsapp_number text NULL,
    expertise text NULL,
    avatar_url text NULL,
    referral_code text UNIQUE NULL,
    referral_count integer DEFAULT 0 NOT NULL,
    coin_points integer DEFAULT 0 NOT NULL,
    referred_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    role text DEFAULT 'user' NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_role_check CHECK (role IN ('user', 'community_admin', 'super_admin'))
);

-- Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a function to set up new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_referral_code text;
BEGIN
    -- Generate a unique referral code
    LOOP
        new_referral_code := substr(md5(random()::text), 1, 6);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_referral_code);
    END LOOP;

    INSERT INTO public.profiles (id, full_name, first_name, last_name, avatar_url, email, referral_code, coin_points, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.email,
        new_referral_code,
        50, -- Initial coin points
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the function when a new user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Create the 'communities' table
CREATE TABLE public.communities (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name text UNIQUE NOT NULL,
    description text NOT NULL,
    utility text NOT NULL,
    positioning_domain text NOT NULL,
    template_1 text NOT NULL,
    template_2 text NOT NULL,
    category text NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    join_code text UNIQUE NULL,
    CONSTRAINT communities_pkey PRIMARY KEY (id)
);

-- Set up RLS for communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community owners can view and update their communities." ON public.communities
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Public communities are viewable by everyone." ON public.communities
  FOR SELECT USING (is_public = true);

-- Create the 'community_members' table
CREATE TABLE public.community_members (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT community_members_pkey PRIMARY KEY (id),
    CONSTRAINT unique_community_member UNIQUE (community_id, user_id)
);

-- Set up RLS for community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert their own membership." ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Community members can view their own memberships." ON public.community_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Community members can delete their own membership." ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);


-- Create the 'sites' table
CREATE TABLE public.sites (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subdomain text UNIQUE NOT NULL,
    site_data jsonb NOT NULL,
    status text DEFAULT 'draft' NOT NULL,
    template_type text DEFAULT 'default' NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    CONSTRAINT sites_pkey PRIMARY KEY (id),
    CONSTRAINT sites_status_check CHECK (status IN ('draft', 'published'))
);

-- Set up RLS for sites
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners can view, insert, update, and delete their own sites." ON public.sites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public sites are viewable by everyone." ON public.sites
  FOR SELECT USING (is_public = true);


-- Create the 'site_analytics' table
CREATE TABLE public.site_analytics (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    site_id uuid UNIQUE REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    total_sales integer DEFAULT 0 NOT NULL,
    total_contacts integer DEFAULT 0 NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT site_analytics_pkey PRIMARY KEY (id)
);

-- Set up RLS for site_analytics
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners can view their site analytics." ON public.site_analytics
  FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid()))));

CREATE POLICY "Anyone can increment total_visits for public sites." ON public.site_analytics
  FOR UPDATE USING ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_analytics.site_id) AND (sites.is_public = true))))
  WITH CHECK ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_analytics.site_id) AND (sites.is_public = true))));

CREATE POLICY "Site owners can update their site analytics." ON public.site_analytics
  FOR UPDATE USING ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid()))))
  WITH CHECK ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid()))));

CREATE POLICY "Site owners can insert analytics for their sites." ON public.site_analytics
  FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid()))));


-- Create the 'site_messages' table
CREATE TABLE public.site_messages (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name text NULL,
    sender_email text NULL,
    sender_phone text NULL,
    service_interested text NULL,
    message text NOT NULL,
    read_status boolean DEFAULT false NOT NULL,
    CONSTRAINT site_messages_pkey PRIMARY KEY (id)
);

-- Set up RLS for site_messages
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners can view, update, and delete messages for their sites." ON public.site_messages
  FOR ALL USING ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_messages.site_id) AND (sites.user_id = auth.uid()))))
  WITH CHECK ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_messages.site_id) AND (sites.user_id = auth.uid()))));

CREATE POLICY "Anyone can insert messages for public sites." ON public.site_messages
  FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM public.sites WHERE (sites.id = site_messages.site_id) AND (sites.is_public = true))));


-- Create the 'push_subscriptions' table
CREATE TABLE public.push_subscriptions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription jsonb NOT NULL,
    CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_endpoint UNIQUE (user_id, (subscription->>'endpoint'))
);

-- Set up RLS for push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own subscriptions." ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions." ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions." ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Super Admins can send push notifications (handled in API, not RLS)


-- Create the 'coin_transactions' table
CREATE TABLE public.coin_transactions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL, -- Null for admin credits
    recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    transaction_type text NOT NULL,
    description text NULL,
    CONSTRAINT coin_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT coin_transactions_type_check CHECK (transaction_type IN ('admin_credit', 'admin_debit', 'referral_bonus', 'transfer', 'ai_video_generation'))
);

-- Set up RLS for coin_transactions
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions." ON public.coin_transactions
  FOR SELECT USING ((auth.uid() = sender_id) OR (auth.uid() = recipient_id));

CREATE POLICY "Authenticated users can insert their own transactions (e.g., transfers, AI video cost)." ON public.coin_transactions
  FOR INSERT WITH CHECK ((auth.uid() = sender_id) OR (auth.uid() = recipient_id));


-- Create the 'ai_video_access' table
CREATE TABLE public.ai_video_access (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    granted_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT ai_video_access_pkey PRIMARY KEY (id)
);

-- Set up RLS for ai_video_access
ALTER TABLE public.ai_video_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view their own AI video access." ON public.ai_video_access
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies for ai_video_access (handled in API, not RLS directly for insert/delete)
-- Super Admins can manage access via API routes.