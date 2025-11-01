CREATE TABLE public.communities (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  objectives text,
  template_1 text NOT NULL,
  template_2 text NOT NULL,
  category text NOT NULL,
  is_public boolean DEFAULT TRUE NOT NULL, -- New: true for public, false for private
  join_code character varying(6) UNIQUE -- New: 6-digit code for private communities
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Policy for community owners to manage their communities
CREATE POLICY "Community owners can view and manage their communities." ON public.communities
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Policy for authenticated users to view public communities
CREATE POLICY "Authenticated users can view public communities." ON public.communities
  FOR SELECT USING (is_public = TRUE);

-- Policy for authenticated users to view communities they are members of (will be handled by community_members table)
-- This policy will be refined once community_members is in place.