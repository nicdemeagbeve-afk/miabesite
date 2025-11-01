-- Table: public.profiles
-- Description: Stores user profiles and extends auth.users table.

-- Drop table if exists to recreate with new column (only for development, be careful in production)
-- DROP TABLE IF EXISTS public.profiles;

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
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
    -- New: Role column for access control
    role text DEFAULT 'user'::text NOT NULL, -- 'user', 'admin', 'super_admin'
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));

-- Optional: Add a function to generate a unique referral code on new profile insert
-- This is handled in application logic for now, but could be a DB trigger.

-- Optional: Add a function to create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _referral_code text;
    _full_name text;
    _first_name text;
    _last_name text;
    _date_of_birth date;
    _phone_number text;
    _expertise text;
BEGIN
    -- Generate a unique 5-digit referral code
    LOOP
        _referral_code := LPAD(FLOOR(RANDOM() * 100000)::text, 5, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = _referral_code);
    END LOOP;

    -- Extract user_metadata if available, otherwise default
    _full_name := NEW.raw_user_meta_data->>'full_name';
    _first_name := NEW.raw_user_meta_data->>'first_name';
    _last_name := NEW.raw_user_meta_data->>'last_name';
    _date_of_birth := (NEW.raw_user_meta_data->>'date_of_birth')::date;
    _phone_number := NEW.raw_user_meta_data->>'phone_number';
    _expertise := NEW.raw_user_meta_data->>'expertise';

    INSERT INTO public.profiles (
        id,
        full_name,
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        whatsapp_number, -- Assuming whatsapp_number is same as phone_number on signup
        expertise,
        avatar_url,
        referral_code,
        coin_points,
        referral_count,
        role
    ) VALUES (
        NEW.id,
        COALESCE(_full_name, NEW.email),
        COALESCE(_first_name, ''),
        COALESCE(_last_name, ''),
        _date_of_birth,
        COALESCE(_phone_number, ''),
        COALESCE(_phone_number, ''),
        COALESCE(_expertise, ''),
        NEW.raw_user_meta_data->>'avatar_url',
        _referral_code,
        0,
        0,
        'user' -- Default role for new users
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists to replace it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Storage for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for profile-pictures bucket
CREATE POLICY "Avatar images are publicly readable." ON storage.objects FOR SELECT USING (bucket_id = 'profile-pictures');
CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid() = owner);
CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (bucket_id = 'profile-pictures' AND auth.uid() = owner);