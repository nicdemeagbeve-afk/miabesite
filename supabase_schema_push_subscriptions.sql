-- Table: public.push_subscriptions
CREATE TABLE public.push_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, (subscription->>'endpoint')) -- Ensure unique subscription per user and endpoint
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Users can view their own subscriptions
CREATE POLICY "Users can view their own push subscriptions" ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own push subscriptions" ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete their own push subscriptions" ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- No update policy needed as subscriptions are usually re-created if changed