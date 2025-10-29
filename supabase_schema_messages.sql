-- Table: public.site_messages
CREATE TABLE public.site_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
    sender_name text,
    sender_email text,
    sender_phone text,
    service_interested text,
    message text NOT NULL,
    read_status boolean DEFAULT false NOT NULL
);

-- Enable Row Level Security (RLS) for site_messages
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can view messages for their own sites
CREATE POLICY "Users can view their own site messages" ON public.site_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()
    )
);

-- Policy for INSERT: Any user can submit a message to an existing site
CREATE POLICY "Anyone can insert a message for an existing site" ON public.site_messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_messages.site_id
    )
);

-- Policy for UPDATE: Site owners can update their messages (e.g., mark as read)
CREATE POLICY "Site owners can update their own site messages" ON public.site_messages
FOR UPDATE USING (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()
    )
) WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()
    )
);

-- Policy for DELETE: Site owners can delete their messages
CREATE POLICY "Site owners can delete their own site messages" ON public.site_messages
FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.sites
        WHERE sites.id = site_messages.site_id AND sites.user_id = auth.uid()
    )
);