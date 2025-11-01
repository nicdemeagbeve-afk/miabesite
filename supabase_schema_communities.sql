CREATE TABLE public.communities (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  objectives text,
  template_1 text NOT NULL,
  template_2 text NOT NULL,
  category text NOT NULL
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community owners can view and manage their communities." ON public.communities
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can view all communities (optional, adjust as needed)." ON public.communities
  FOR SELECT USING (auth.role() = 'authenticated');