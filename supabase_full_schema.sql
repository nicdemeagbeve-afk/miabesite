-- This script consolidates the entire Supabase schema for the Miabesite application.

-- Ensure the uuid-ossp extension is enabled for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  full_name text,
  first_name text,
  last_name text,
  email text UNIQUE, -- Redundant but useful for RLS/queries
  date_of_birth date,
  phone_number text,
  whatsapp_number text,
  secondary_phone_number text,
  expertise text,
  avatar_url text,
  role text DEFAULT 'user'::text NOT NULL, -- user, community_admin, super_admin
  referral_code text UNIQUE,
  referred_by uuid REFERENCES profiles(id),
  referral_count integer DEFAULT 0 NOT NULL,
  coin_points integer DEFAULT 0 NOT NULL
);

-- 2. Sites Table
CREATE TABLE sites (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  subdomain text UNIQUE NOT NULL,
  site_data jsonb, -- Stores SiteEditorFormData
  status text DEFAULT 'draft'::text NOT NULL, -- draft, published
  template_type text DEFAULT 'default'::text NOT NULL,
  is_public boolean DEFAULT false NOT NULL -- Controls public access
);

-- 3. Site Messages Table
CREATE TABLE site_messages (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  site_id uuid REFERENCES sites(id) NOT NULL,
  sender_name text,
  sender_email text,
  sender_phone text,
  service_interested text,
  message text NOT NULL,
  read_status boolean DEFAULT false NOT NULL,
  product_name text,
  product_price numeric,
  product_currency text,
  quantity integer
);

-- 4. Site Analytics Table
CREATE TABLE site_analytics (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  site_id uuid REFERENCES sites(id) UNIQUE NOT NULL,
  total_visits integer DEFAULT 0 NOT NULL,
  total_sales numeric DEFAULT 0 NOT NULL,
  total_contacts integer DEFAULT 0 NOT NULL,
  last_updated timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Coin Transactions Table
CREATE TABLE coin_transactions (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  sender_id uuid REFERENCES auth.users, -- Nullable if system/admin is sender
  recipient_id uuid REFERENCES auth.users NOT NULL,
  amount integer NOT NULL,
  transaction_type text NOT NULL, -- e.g., referral_bonus, admin_credit, transfer, ai_video_generation
  description text
);

-- 6. Communities Table
CREATE TABLE communities (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  owner_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  utility text,
  positioning_domain text,
  template_1 text NOT NULL,
  template_2 text NOT NULL,
  category text NOT NULL,
  is_public boolean DEFAULT true NOT NULL,
  join_code text UNIQUE -- 6 digit code for private communities
);

-- 7. Community Members Table
CREATE TABLE community_members (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  community_id uuid REFERENCES communities(id) NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (community_id, user_id)
);

-- 8. AI Video Access Table
CREATE TABLE ai_video_access (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users UNIQUE NOT NULL, -- User who has access
  granted_by uuid REFERENCES auth.users -- Admin who granted access
);

-- 9. AI Chat History Table
CREATE TABLE ai_chat_history (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  site_subdomain text, -- Contextual subdomain
  history jsonb NOT NULL, -- Array of chat messages
  model_used text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, site_subdomain) -- Only one history per user/subdomain context
);

-- 10. Push Subscriptions Table
CREATE TABLE push_subscriptions (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription jsonb NOT NULL, -- Web Push Subscription object
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, subscription)
);

-- 11. WhatsApp Users Table (Placeholder for future linking)
CREATE TABLE whatsapp_users (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users UNIQUE NOT NULL,
  whatsapp_number text UNIQUE NOT NULL,
  is_verified boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 12. Trigger to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to profiles table
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. RLS Setup

-- Function to check if user is super_admin (used in RLS for admin tables)
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super Admins can view all profiles." ON profiles
  FOR SELECT USING (is_super_admin());
CREATE POLICY "Super Admins can update any profile (for role changes)." ON profiles
  FOR UPDATE USING (is_super_admin());

-- RLS for sites
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sites are viewable by owner or if public." ON sites
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Owners can insert their own sites." ON sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their own sites." ON sites
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their own sites." ON sites
  FOR DELETE USING (auth.uid() = user_id);

-- RLS for site_messages
ALTER TABLE site_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site owners can view and manage messages." ON site_messages
  FOR ALL USING (
    (SELECT user_id FROM sites WHERE id = site_id) = auth.uid()
  );
CREATE POLICY "Anyone can insert messages (public form)." ON site_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Super Admins can view all site messages." ON site_messages
  FOR SELECT USING (is_super_admin());

-- RLS for site_analytics
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site owners can view analytics." ON site_analytics
  FOR SELECT USING (
    (SELECT user_id FROM sites WHERE id = site_id) = auth.uid()
  );
CREATE POLICY "Anon can update total_visits via API." ON site_analytics
  FOR UPDATE USING (true);
CREATE POLICY "Super Admins can view all site analytics." ON site_analytics
  FOR SELECT USING (is_super_admin());

-- RLS for coin_transactions
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions." ON coin_transactions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Super Admins can view all coin transactions." ON coin_transactions
  FOR SELECT USING (is_super_admin());
CREATE POLICY "Super Admins can insert coin transactions (admin credit/debit)." ON coin_transactions
  FOR INSERT WITH CHECK (is_super_admin());

-- RLS for communities
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public communities are viewable by all authenticated users." ON communities
  FOR SELECT USING (is_public = true);
CREATE POLICY "Owners can view their own communities." ON communities
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated users can insert communities." ON communities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Super Admins can view all communities." ON communities
  FOR SELECT USING (is_super_admin());

-- RLS for community_members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view their own membership." ON community_members
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert membership (join)." ON community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS for ai_video_access
ALTER TABLE ai_video_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own access." ON ai_video_access
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super Admins can delete AI video access." ON ai_video_access
  FOR DELETE USING (is_super_admin());
CREATE POLICY "Super Admins can insert AI video access." ON ai_video_access
  FOR INSERT WITH CHECK (is_super_admin());

-- RLS for ai_chat_history
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own chat history." ON ai_chat_history
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Super Admins can view all chat history." ON ai_chat_history
  FOR SELECT USING (is_super_admin());

-- RLS for push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own subscriptions." ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Super Admins can view all push subscriptions." ON push_subscriptions
  FOR SELECT USING (is_super_admin());

-- RLS for whatsapp_users
ALTER TABLE whatsapp_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and manage their own whatsapp link." ON whatsapp_users
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Super Admins can view all whatsapp users." ON whatsapp_users
  FOR SELECT USING (is_super_admin());