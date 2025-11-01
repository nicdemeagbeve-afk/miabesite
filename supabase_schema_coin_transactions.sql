-- Table: public.coin_transactions
-- Description: Logs all coin transfers between users or admin actions.

CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Null if admin/system initiated
    recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL CHECK (amount > 0),
    transaction_type text NOT NULL, -- 'transfer', 'admin_credit', 'referral_bonus', 'admin_debit'
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for coin_transactions
CREATE POLICY "Users can view their own transactions." ON public.coin_transactions FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Admins can insert any transaction." ON public.coin_transactions FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
-- Users cannot update or delete transactions