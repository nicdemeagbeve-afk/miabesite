CREATE TABLE communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  utility text,
  positioning_domain text,
  template_1 text,
  template_2 text,
  category text,
  is_public boolean DEFAULT TRUE,
  join_code text UNIQUE, -- Code pour rejoindre les communautés privées
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public communities are viewable by everyone."
  ON communities FOR SELECT
  USING (is_public = TRUE OR auth.uid() = owner_id);

CREATE POLICY "Users can insert communities."
  ON communities FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Community owners can update their communities."
  ON communities FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Community owners can delete their communities."
  ON communities FOR DELETE
  USING (auth.uid() = owner_id);