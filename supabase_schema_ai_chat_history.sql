-- Table: ai_chat_history
-- Stocke l'historique des conversations entre les utilisateurs et l'assistant IA (Maître Control).

CREATE TABLE IF NOT EXISTS public.ai_chat_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    -- Le champ 'history' stocke l'historique complet de la conversation au format JSONB.
    -- Chaque entrée doit contenir le rôle ('user' ou 'model') et le contenu (texte).
    history jsonb NOT NULL,
    -- Optionnel: stocker le contexte du site si la conversation concerne un site spécifique
    site_subdomain text,
    -- Optionnel: stocker le type de modèle utilisé (ex: 'gemini-2.5-flash')
    model_used text
);

-- Index pour accélérer la recherche par utilisateur
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON public.ai_chat_history (user_id);

-- Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Politique RLS: Les utilisateurs peuvent insérer de nouvelles conversations
CREATE POLICY "Users can insert their own chat history"
ON public.ai_chat_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politique RLS: Les utilisateurs peuvent sélectionner leur propre historique de chat
CREATE POLICY "Users can select their own chat history"
ON public.ai_chat_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Politique RLS: Les utilisateurs peuvent mettre à jour leur propre historique de chat (pour ajouter de nouveaux messages)
CREATE POLICY "Users can update their own chat history"
ON public.ai_chat_history FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique RLS: Les administrateurs peuvent voir tout l'historique (si nécessaire, mais non implémenté ici pour la simplicité)
-- Si vous avez besoin que les super_admins voient tout, vous devrez ajouter une vérification de rôle ici.