-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('community_admin', 'super_admin'))
  );
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
CREATE POLICY "Referral codes are public for lookup" ON public.profiles
  FOR SELECT USING (true);

-- Policies for sites
CREATE POLICY "Users can view their own sites" ON public.sites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sites" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sites" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public sites are viewable by everyone" ON public.sites
  FOR SELECT USING (is_public = TRUE);

-- Policies for site_analytics
CREATE POLICY "Site owners can view their analytics" ON public.site_analytics
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));
CREATE POLICY "Anyone can increment visits" ON public.site_analytics
  FOR UPDATE USING (true);

-- Policies for site_messages
CREATE POLICY "Site owners can view their messages" ON public.site_messages
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));
CREATE POLICY "Anyone can insert messages" ON public.site_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Site owners can update their messages" ON public.site_messages
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));
CREATE POLICY "Site owners can delete their messages" ON public.site_messages
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.sites WHERE id = site_id AND user_id = auth.uid()));

-- Policies for communities
CREATE POLICY "Authenticated users can view public communities" ON public.communities
  FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Community owners can view their own communities" ON public.communities
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Community owners can create communities" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Community owners can update their own communities" ON public.communities
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Community owners can delete their own communities" ON public.communities
  FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Super admins can view all communities" ON public.communities
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
CREATE POLICY "Super admins can manage all communities" ON public.communities
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Policies for community_members
CREATE POLICY "Authenticated users can view community members" ON public.community_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND is_public = TRUE) OR
    EXISTS (SELECT 1 FROM public.community_members WHERE community_id = community_members.community_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND owner_id = auth.uid())
  );
CREATE POLICY "Authenticated users can join communities" ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Community owners can remove members" ON public.community_members
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND owner_id = auth.uid()));
CREATE POLICY "Users can leave communities" ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for coin_transactions
CREATE POLICY "Users can view their own transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Super admins can view all transactions" ON public.coin_transactions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
CREATE POLICY "Super admins can insert transactions" ON public.coin_transactions
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
CREATE POLICY "Users can insert self-deduction transactions" ON public.coin_transactions
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND auth.uid() = recipient_id AND amount < 0 AND transaction_type = 'ai_video_generation'
  );

-- Policies for push_subscriptions
CREATE POLICY "Users can manage their own subscriptions" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins can view all subscriptions" ON public.push_subscriptions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Policies for ai_video_access
CREATE POLICY "Super admins can manage AI video access" ON public.ai_video_access
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
CREATE POLICY "Users can view their own AI video access" ON public.ai_video_access
  FOR SELECT USING (auth.uid() = user_id);