-- This script defines the schema for your Supabase database.

-- Table for storing user-generated site data
CREATE TABLE public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase Auth users
    subdomain TEXT UNIQUE NOT NULL, -- The unique subdomain for the site (e.g., 'monentreprise')
    site_data JSONB NOT NULL, -- All the data collected from the site creation wizard
    template_type TEXT DEFAULT 'default', -- e.g., 'default', 'ecommerce', 'service'
    status TEXT DEFAULT 'draft' -- e.g., 'draft', 'published', 'offline'
);

-- Enable Row Level Security (RLS) for the sites table
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to create their own sites
CREATE POLICY "Authenticated users can create sites." ON public.sites
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow site owners to update their own sites
CREATE POLICY "Site owners can update their own sites." ON public.sites
FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow site owners to delete their own sites
CREATE POLICY "Site owners can delete their own sites." ON public.sites
FOR DELETE USING (auth.uid() = user_id);

-- Policy to allow public read access to published sites
-- This policy assumes a 'published' status. Adjust as needed.
CREATE POLICY "Public can view published sites." ON public.sites
FOR SELECT USING (status = 'published');

-- Optionally, allow authenticated users to view all their sites (even if not published)
CREATE POLICY "Authenticated users can view their own sites." ON public.sites
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Index for faster subdomain lookups
CREATE INDEX ON public.sites (subdomain);