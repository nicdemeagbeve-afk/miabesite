-- Create the whatsapp_users table
CREATE TABLE whatsapp_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE, -- Link to auth.users table
  whatsapp_number TEXT UNIQUE, -- The user's WhatsApp number
  link_code TEXT UNIQUE, -- Temporary code for initial linking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE whatsapp_users ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view/update their own whatsapp_users entry
CREATE POLICY "Authenticated users can manage their own whatsapp_users entry"
ON whatsapp_users FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for admins to view/update all whatsapp_users entries (optional, based on your admin roles)
-- You would need a 'profiles' table with a 'role' column for this.
-- Example (assuming 'profiles' table with 'role' column exists):
-- CREATE POLICY "Admins can manage all whatsapp_users entries"
-- ON whatsapp_users FOR ALL
-- TO authenticated
-- USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin')))
-- WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin')));

-- Set up automatic updated_at timestamp
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_users_updated_at
BEFORE UPDATE ON whatsapp_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();