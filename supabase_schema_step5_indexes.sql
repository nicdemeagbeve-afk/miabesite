-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles (referral_code);
CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON public.sites (subdomain);
CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON public.site_analytics (site_id);
CREATE INDEX IF NOT EXISTS idx_site_messages_site_id ON public.site_messages (site_id);
CREATE INDEX IF NOT EXISTS idx_communities_owner_id ON public.communities (owner_id);
CREATE INDEX IF NOT EXISTS idx_communities_join_code ON public.communities (join_code);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members (community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members (user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_sender_id ON public.coin_transactions (sender_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_recipient_id ON public.coin_transactions (recipient_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_video_access_user_id ON public.ai_video_access (user_id);