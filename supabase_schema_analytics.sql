CREATE TABLE site_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE UNIQUE, -- Une seule entrée par site
  total_visits integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  total_contacts integer DEFAULT 0,
  last_updated timestamp with time zone DEFAULT now()
);

ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site analytics are viewable by site owner."
  ON site_analytics FOR SELECT
  USING (EXISTS (SELECT 1 FROM sites WHERE sites.id = site_analytics.site_id AND sites.user_id = auth.uid()));

-- Admin policy for viewing all analytics (assuming admin role check in RLS)
CREATE POLICY "Admins can view all site analytics."
  ON site_analytics FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin')));

-- INSERT/UPDATE policies are handled by API routes (e.g., track-visit)