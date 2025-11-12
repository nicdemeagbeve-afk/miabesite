-- Table pour les sites web
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    site_data JSONB DEFAULT '{}'::JSONB NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'published', 'archived'
    template_type TEXT DEFAULT 'default' NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL, -- Nouveau champ pour la visibilité du site
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Fonction pour mettre à jour 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour la table 'sites'
DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();