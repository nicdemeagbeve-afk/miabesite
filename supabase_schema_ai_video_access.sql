-- Table: ai_video_access
CREATE TABLE IF NOT EXISTS public.ai_video_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Admin who granted access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id) -- Each user can only have one entry
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_video_access ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own access status
CREATE POLICY "Users can view their own AI video access" ON public.ai_video_access
FOR SELECT USING (auth.uid() = user_id);

-- Policy for admins/super_admins to manage access
CREATE POLICY "Admins and Super Admins can manage AI video access" ON public.ai_video_access
FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
) WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);