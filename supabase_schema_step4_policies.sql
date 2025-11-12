-- Policies for public.profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for public.sites
DROP POLICY IF EXISTS "Sites are viewable by owner, members, or if public." ON public.sites;
CREATE POLICY "Sites are viewable by owner, members, or if public." ON public.sites
  FOR SELECT USING (
    is_public = TRUE OR
    auth.uid() = user_id
    -- Add logic for community members if sites are linked to communities
  );

DROP POLICY IF EXISTS "Users can create sites." ON public.sites;
CREATE POLICY "Users can create sites." ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can update their sites." ON public.sites;
CREATE POLICY "Owners can update their sites." ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can delete their sites." ON public.sites;
CREATE POLICY "Owners can delete their sites." ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.site_messages
DROP POLICY IF EXISTS "Site messages are viewable by site owner." ON public.site_messages;
CREATE POLICY "Site messages are viewable by site owner." ON public.site_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can insert site messages." ON public.site_messages;
CREATE POLICY "Anyone can insert site messages." ON public.site_messages
  FOR INSERT WITH CHECK (TRUE); -- Allow anonymous messages

DROP POLICY IF EXISTS "Site owner can update site messages." ON public.site_messages;
CREATE POLICY "Site owner can update site messages." ON public.site_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Site owner can delete site messages." ON public.site_messages;
CREATE POLICY "Site owner can delete site messages." ON public.site_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

-- Policies for public.site_analytics
DROP POLICY IF EXISTS "Site analytics are viewable by site owner." ON public.site_analytics;
CREATE POLICY "Site analytics are viewable by site owner." ON public.site_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Site analytics can be inserted by site owner." ON public.site_analytics;
CREATE POLICY "Site analytics can be inserted by site owner." ON public.site_analytics
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Site analytics can be updated by site owner." ON public.site_analytics;
CREATE POLICY "Site analytics can be updated by site analytics." ON public.site_analytics
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sites WHERE sites.id = site_id AND sites.user_id = auth.uid())
  );

-- Policies for public.communities
DROP POLICY IF EXISTS "Communities are viewable by members or if public." ON public.communities;
CREATE POLICY "Communities are viewable by members or if public." ON public.communities
  FOR SELECT USING (
    is_public = TRUE OR
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.community_members WHERE community_members.community_id = communities.id AND community_members.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create communities." ON public.communities;
CREATE POLICY "Users can create communities." ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update their communities." ON public.communities;
CREATE POLICY "Owners can update their communities." ON public.communities
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete their communities." ON public.communities;
CREATE POLICY "Owners can delete their communities." ON public.communities
  FOR DELETE USING (auth.uid() = owner_id);

-- Policies for public.community_members
DROP POLICY IF EXISTS "Community members are viewable by members or owner." ON public.community_members;
CREATE POLICY "Community members are viewable by members or owner." ON public.community_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.communities WHERE communities.id = community_id AND (communities.owner_id = auth.uid() OR communities.is_public = TRUE OR community_members.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Users can join communities." ON public.community_members;
CREATE POLICY "Users can join communities." ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can leave communities." ON public.community_members;
CREATE POLICY "Members can leave communities." ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.community_invitations
DROP POLICY IF EXISTS "Community invitations are viewable by invited user or inviter." ON public.community_invitations;
CREATE POLICY "Community invitations are viewable by invited user or inviter." ON public.community_invitations
  FOR SELECT USING (
    auth.uid() = invited_by OR
    auth.email() = invited_email
  );

DROP POLICY IF EXISTS "Users can create invitations." ON public.community_invitations;
CREATE POLICY "Users can create invitations." ON public.community_invitations
  FOR INSERT WITH CHECK (auth.uid() = invited_by);

DROP POLICY IF EXISTS "Invited user can update their invitation status." ON public.community_invitations;
CREATE POLICY "Invited user can update their invitation status." ON public.community_invitations
  FOR UPDATE USING (auth.email() = invited_email);

DROP POLICY IF EXISTS "Inviter can delete their invitations." ON public.community_invitations;
CREATE POLICY "Inviter can delete their invitations." ON public.community_invitations
  FOR DELETE USING (auth.uid() = invited_by);

-- Policies for public.coin_transactions
DROP POLICY IF EXISTS "Coin transactions are viewable by sender or recipient." ON public.coin_transactions;
CREATE POLICY "Coin transactions are viewable by sender or recipient." ON public.coin_transactions
  FOR SELECT USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Super admins can insert coin transactions." ON public.coin_transactions;
CREATE POLICY "Super admins can insert coin transactions." ON public.coin_transactions
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR
    auth.uid() = sender_id -- Allow users to record their own deductions (e.g., for AI video generation)
  );

-- Policies for public.ai_video_access
DROP POLICY IF EXISTS "AI video access is viewable by owner or super_admin." ON public.ai_video_access;
CREATE POLICY "AI video access is viewable by owner or super_admin." ON public.ai_video_access
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Super admins can insert AI video access." ON public.ai_video_access;
CREATE POLICY "Super admins can insert AI video access." ON public.ai_video_access
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Super admins can delete AI video access." ON public.ai_video_access;
CREATE POLICY "Super admins can delete AI video access." ON public.ai_video_access
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Policies for public.push_subscriptions
DROP POLICY IF EXISTS "Push subscriptions are viewable by owner." ON public.push_subscriptions;
CREATE POLICY "Push subscriptions are viewable by owner." ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own push subscriptions." ON public.push_subscriptions;
CREATE POLICY "Users can insert their own push subscriptions." ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own push subscriptions." ON public.push_subscriptions;
CREATE POLICY "Users can delete their own push subscriptions." ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.whatsapp_users
DROP POLICY IF EXISTS "Whatsapp users are viewable by owner or super_admin." ON public.whatsapp_users;
CREATE POLICY "Whatsapp users are viewable by owner or super_admin." ON public.whatsapp_users
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Users can insert their own whatsapp user entry." ON public.whatsapp_users;
CREATE POLICY "Users can insert their own whatsapp user entry." ON public.whatsapp_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own whatsapp user entry." ON public.whatsapp_users;
CREATE POLICY "Users can update their own whatsapp user entry." ON public.whatsapp_users
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own whatsapp user entry." ON public.whatsapp_users;
CREATE POLICY "Users can delete their own whatsapp user entry." ON public.whatsapp_users
  FOR DELETE USING (auth.uid() = user_id);