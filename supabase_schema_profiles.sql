CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  full_name text,
  first_name text,
  last_name text,
  date_of_birth date,
  phone_number text,
  whatsapp_number text,
  secondary_phone_number text,
  expertise text,
  avatar_url text,
  referral_code character varying(5) UNIQUE,
  referred_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  coin_points integer DEFAULT 0 NOT NULL,
  referral_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Optional: Create a function to generate a unique 5-digit referral code
-- This can also be handled in the application logic, but a DB function ensures uniqueness at the DB level.
-- For simplicity, we'll handle it in the application logic for now.

-- Optional: Create a function to handle referral logic (increment points, count)
-- This can also be handled in the application logic.