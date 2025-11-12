-- Table pour les communautés
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    utility TEXT,
    positioning_domain TEXT,
    template_1 TEXT NOT NULL,
    template_2 TEXT NOT NULL,
    category TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    join_code TEXT UNIQUE, -- Code pour rejoindre les communautés privées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trigger pour la table 'communities'
DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON communities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Ajout de colonnes si elles n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='utility') THEN
        ALTER TABLE communities ADD COLUMN utility TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='positioning_domain') THEN
        ALTER TABLE communities ADD COLUMN positioning_domain TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='template_1') THEN
        ALTER TABLE communities ADD COLUMN template_1 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='template_2') THEN
        ALTER TABLE communities ADD COLUMN template_2 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='category') THEN
        ALTER TABLE communities ADD COLUMN category TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='is_public') THEN
        ALTER TABLE communities ADD COLUMN is_public BOOLEAN DEFAULT TRUE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='communities' AND column_name='join_code') THEN
        ALTER TABLE communities ADD COLUMN join_code TEXT UNIQUE;
    END IF;
END $$;