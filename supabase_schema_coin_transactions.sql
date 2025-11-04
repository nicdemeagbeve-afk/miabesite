CREATE TABLE coin_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Peut être NULL si l'admin crédite
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  transaction_type text NOT NULL CHECK (transaction_type IN ('referral_bonus', 'transfer', 'admin_credit', 'admin_debit')),
  description text
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coin transactions."
  ON coin_transactions FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Admin policy for viewing all transactions (assuming admin role check in RLS)
CREATE POLICY "Admins can view all coin transactions."
  ON coin_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin')));

-- No INSERT/UPDATE/DELETE policies for users, transactions are created by system/admin APIs