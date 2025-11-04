CREATE TABLE push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  subscription jsonb NOT NULL, -- Contient l'objet PushSubscription
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE (user_id, (subscription->>'endpoint')) -- Un utilisateur ne peut avoir qu'un seul abonnement par endpoint
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own push subscriptions."
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push subscriptions."
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push subscriptions."
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);