-- Table pour les messages de contact des sites
CREATE TABLE IF NOT EXISTS site_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT,
    sender_email TEXT,
    sender_phone TEXT,
    service_interested TEXT,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);