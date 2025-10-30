-- Table: public.site_analytics

-- Drop table if exists
DROP TABLE IF EXISTS public.site_analytics;

-- Create table
CREATE TABLE public.site_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE,
    total_visits bigint DEFAULT 0,
    total_sales numeric DEFAULT 0, -- Assuming sales can be decimal
    total_contacts bigint DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now(),
    UNIQUE (site_id) -- Ensure one analytics entry per site
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy for authenticated users to view their own site analytics
CREATE POLICY "Authenticated users can view their own site analytics" ON public.site_analytics
FOR SELECT USING (
    (EXISTS ( SELECT 1
           FROM public.sites
          WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid())))
);

-- Policy for authenticated users to update their own site analytics
CREATE POLICY "Authenticated users can update their own site analytics" ON public.site_analytics
FOR UPDATE USING (
    (EXISTS ( SELECT 1
           FROM public.sites
          WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid())))
);

-- Policy for authenticated users to insert site analytics (e.g., when a site is created)
CREATE POLICY "Authenticated users can insert site analytics for their own sites" ON public.site_analytics
FOR INSERT WITH CHECK (
    (EXISTS ( SELECT 1
           FROM public.sites
          WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid())))
);

-- Policy for authenticated users to delete their own site analytics
CREATE POLICY "Authenticated users can delete their own site analytics" ON public.site_analytics
FOR DELETE USING (
    (EXISTS ( SELECT 1
           FROM public.sites
          WHERE (sites.id = site_analytics.site_id) AND (sites.user_id = auth.uid())))
);

-- Optional: Add an index for faster lookups by site_id
CREATE INDEX IF NOT EXISTS idx_site_analytics_site_id ON public.site_analytics (site_id);