-- Table pour l'historique des transactions de pièces
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Peut être NULL si l'admin est l'expéditeur (système)
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INT NOT NULL,
    transaction_type TEXT NOT NULL, -- 'referral_bonus', 'admin_credit', 'admin_debit', 'community_creation_cost', 'ai_video_generation', etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);