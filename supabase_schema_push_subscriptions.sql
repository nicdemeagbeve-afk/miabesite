-- Table pour stocker les abonnements aux notifications push
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription JSONB NOT NULL, -- L'objet de souscription Web Push
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, (subscription->>'endpoint')) -- Un utilisateur ne peut avoir qu'un seul abonnement par endpoint
);