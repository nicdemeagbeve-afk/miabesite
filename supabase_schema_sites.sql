CREATE TABLE sites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  subdomain text UNIQUE NOT NULL,
  site_data jsonb, -- Contient toutes les données du formulaire de l'éditeur
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template_type text DEFAULT 'default', -- Ex: 'default', 'ecommerce', 'portfolio'
  is_public boolean DEFAULT FALSE, -- Nouveau champ pour la visibilité publique
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sites are viewable by owner or if public."
  ON sites FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own sites."
  ON sites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sites."
  ON sites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sites."
  ON sites FOR DELETE
  USING (auth.uid() = user_id);