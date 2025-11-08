-- Table: public.profiles
-- Assurez-vous que cette table existe avec toutes les colonnes nécessaires, y compris 'role'.
-- Si la table existe déjà, vous pouvez exécuter les ALTER TABLE pour ajouter les colonnes manquantes.
CREATE TABLE
  public.profiles (
    id uuid NOT NULL,
    updated_at timestamp with time zone NULL DEFAULT now(),
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
    role text NOT NULL DEFAULT 'user'::text, -- Assurez-vous que cette colonne existe
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT profiles_referral_code_key UNIQUE (referral_code),
    CONSTRAINT profiles_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES profiles (id) ON DELETE SET NULL
  );

-- Ajouter la colonne 'role' si elle est manquante
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user'::text;
    END IF;
END $$;

-- Ajouter la colonne 'secondary_phone_number' si elle est manquante
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='secondary_phone_number') THEN
        ALTER TABLE public.profiles ADD COLUMN secondary_phone_number TEXT NULL;
    END IF;
END $$;

-- Table: public.coin_transactions
-- Assurez-vous que cette table existe avec les clés étrangères vers 'profiles'.
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

-- Table: public.ai_video_access
-- Assurez-vous que cette table existe avec les clés étrangères vers 'profiles'.
CREATE TABLE
  public.ai_video_access (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL,
    granted_by uuid NULL,
    CONSTRAINT ai_video_access_pkey PRIMARY KEY (id),
    CONSTRAINT ai_video_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE,
    CONSTRAINT ai_video_access_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES profiles (id) ON DELETE SET NULL,
    CONSTRAINT ai_video_access_user_id_key UNIQUE (user_id)
  );

-- Table: public.communities
-- Assurez-vous que la colonne 'positioning_domain' existe dans la table 'communities'.
-- Si la table 'communities' n'existe pas du tout, vous devrez la créer entièrement.
-- Si la colonne 'positioning_domain' est manquante dans une table 'communities' existante, exécutez ceci :
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='communities' AND column_name='positioning_domain') THEN
        ALTER TABLE public.communities ADD COLUMN positioning_domain TEXT NULL;
    END IF;
END $$;