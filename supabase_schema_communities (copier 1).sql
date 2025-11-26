CREATE TABLE communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  utility text,
  positioning_domain text,
  template_1 text,
  template_2 text,
  category text,
  is_public boolean DEFAULT TRUE,
  join_code text UNIQUE, -- Code pour rejoindre les communautés privées
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public communities are viewable by everyone."
  ON communities FOR SELECT
  USING (is_public = TRUE OR auth.uid() = owner_id);

CREATE POLICY "Users can insert communities."
  ON communities FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Community owners can update their communities."
  ON communities FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Community owners can delete their communities."
  ON communities FOR DELETE
  USING (auth.uid() = owner_id);
CREATE TABLE community_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),

  UNIQUE (community_id, user_id) -- Un utilisateur ne peut être membre qu'une fois par communauté
);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community members are viewable by members or community owner."
  ON community_members FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM communities WHERE communities.id = community_members.community_id AND communities.owner_id = auth.uid()));

CREATE POLICY "Users can insert their own community memberships."
  ON community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community memberships."
  ON community_members FOR DELETE
  USING (auth.uid() = user_id);
-- Table: public.community_invitations
-- Description: Manages invitations for users to join communities, especially when assigned by an admin.

CREATE TABLE IF NOT EXISTS public.community_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    invited_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    inviter_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Admin who assigned the community
    status text DEFAULT 'pending'::text NOT NULL, -- 'pending', 'accepted', 'declined'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    UNIQUE (community_id, invited_user_id) -- A user can only be invited to a specific community once
);

ALTER TABLE public.community_invitations ENABLE ROW LEVEL SECURITY;

-- Policies for community_invitations
CREATE POLICY "Invited users can view their invitations." ON public.community_invitations FOR SELECT USING (auth.uid() = invited_user_id);
CREATE POLICY "Invited users can update their invitation status." ON public.community_invitations FOR UPDATE USING (auth.uid() = invited_user_id);
CREATE POLICY "Admins can insert invitations." ON public.community_invitations FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
CREATE POLICY "Admins can delete invitations." ON public.community_invitations FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));
