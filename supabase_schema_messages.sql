CREATE TABLE site_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  sender_name text,
  sender_email text,
  sender_phone text,
  service_interested text,
  message text NOT NULL,
  read_status boolean DEFAULT FALSE,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site messages are viewable by site owner."
  ON site_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM sites WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()));

CREATE POLICY "Anyone can insert site messages."
  ON site_messages FOR INSERT
  WITH CHECK (true); -- Publicly accessible for contact forms

CREATE POLICY "Site messages can be updated by site owner."
  ON site_messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM sites WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()));

CREATE POLICY "Site messages can be deleted by site owner."
  ON site_messages FOR DELETE
  USING (EXISTS (SELECT 1 FROM sites WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()));