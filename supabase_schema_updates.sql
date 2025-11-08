-- 1. Ajouter la colonne 'positioning_domain' à la table 'communities'
ALTER TABLE public.communities
ADD COLUMN positioning_domain TEXT NULL;

-- 2. Assurez-vous que la table 'profiles' existe et a la colonne 'role'
-- Si la table 'profiles' n'existe pas du tout, exécutez ceci :
CREATE TABLE
  public.profiles (
    id uuid NOT NULL,
    updated_at timestamp with time zone NULL,
    full_name text NULL,
    avatar_url text NULL,
    first_name text NULL,
    last_name text NULL,
    date_of_birth date NULL,
    phone_number text NULL,
    whatsapp_number text NULL,
    expertise text NULL,
    referral_code text NULL,
    coin_points bigint NOT NULL DEFAULT 0,
    referral_count bigint NOT NULL DEFAULT 0,
    referred_by uuid NULL,
    role text NOT NULL DEFAULT 'user'::text,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT profiles_referral_code_key UNIQUE (referral_code),
    CONSTRAINT profiles_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES profiles (id) ON DELETE SET NULL
  );

-- Si la colonne 'role' est manquante dans une table 'profiles' existante, exécutez ceci :
ALTER TABLE public.profiles
ADD COLUMN role TEXT NOT NULL DEFAULT 'user'::text;

-- 3. Assurez-vous que la table 'coin_transactions' existe
-- Si la table 'coin_transactions' n'existe pas du tout, exécutez ceci :
CREATE TABLE
  public.coin_transactions (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    sender_id uuid NULL,
    recipient_id uuid NOT NULL,
    amount bigint NOT NULL,
    transaction_type text NOT NULL,
    description text NULL,
    CONSTRAINT coin_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT coin_transactions_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT coin_transactions_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles (id) ON DELETE SET NULL
  );