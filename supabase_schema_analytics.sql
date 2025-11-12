-- Table pour les statistiques de site
CREATE TABLE IF NOT EXISTS site_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    total_visits BIGINT DEFAULT 0 NOT NULL,
    total_sales BIGINT DEFAULT 0 NOT NULL,
    total_contacts BIGINT DEFAULT 0 NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (site_id) -- Chaque site n'a qu'une seule entrée d'analyse
);

-- Fonction pour mettre à jour 'last_updated'
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour la table 'site_analytics'
DROP TRIGGER IF EXISTS update_site_analytics_last_updated ON site_analytics;
CREATE TRIGGER update_site_analytics_last_updated
BEFORE UPDATE ON site_analytics
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();