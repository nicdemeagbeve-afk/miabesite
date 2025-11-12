-- Table pour gérer l'accès à la génération de vidéos IA
CREATE TABLE IF NOT EXISTS ai_video_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE, -- Un seul accès par utilisateur
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- L'admin qui a accordé l'accès
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);