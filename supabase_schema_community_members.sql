CREATE TABLE public.community_members (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_community_user UNIQUE (community_id, user_id) -- Ensure a user can only join a community once
);

ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own memberships
CREATE POLICY "Users can view their own community memberships." ON public.community_members
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own membership (when joining a community)
CREATE POLICY "Users can insert their own community membership." ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own membership (when leaving a community)
CREATE POLICY "Users can delete their own community membership." ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policy for community owners to view all members of their community
CREATE POLICY "Community owners can view all members of their community." ON public.community_members
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND owner_id = auth.uid()));