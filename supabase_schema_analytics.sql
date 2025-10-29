-- Drop table if it exists for a clean re-installation
DROP TABLE IF EXISTS public.site_analytics;

-- Table: public.site_analytics
CREATE TABLE public.site_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    event_type text NOT NULL, -- e.g., 'page_view', 'contact_form_submit'
    event_data jsonb -- Optional: store additional data about the event
);

-- Enable Row Level Security (RLS) for site_analytics
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Site owners can view analytics for their own sites
CREATE POLICY "Site owners can view their own site analytics" ON public.site_analytics
FOR SELECT USING (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_analytics.site_id AND sites.user_id = auth.uid()
    )
);

-- Policy for INSERT: Anyone can insert an event for an existing site (e.g., page view)
CREATE POLICY "Anyone can insert an event for an existing site" ON public.site_analytics
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_analytics.site_id
    )
);

-- Policy for DELETE: Only site owners can delete analytics data for their sites
CREATE POLICY "Site owners can delete their own site analytics" ON public.site_analytics
FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_analytics.site_id AND sites.user_id = auth.uid()
    )
);