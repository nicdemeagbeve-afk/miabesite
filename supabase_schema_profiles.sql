CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  first_name text,
  last_name text,
  date_of_birth date,
  phone_number text,
  whatsapp_number text,
  expertise text,
  avatar_url text,
  referral_code text UNIQUE,
  referral_count integer DEFAULT 0,
  coin_points integer DEFAULT 0,
  referred_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at timestamp with time zone DEFAULT now(),

  PRIMARY KEY (id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);