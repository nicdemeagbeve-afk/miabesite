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