-- Create email_logs table after registration is fixed
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) DEFAULT NULL,
  property_id UUID REFERENCES public.properties(id) DEFAULT NULL
);

-- Add RLS policies for email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Super admins can see all logs
DROP POLICY IF EXISTS "Super admins can see all email logs" ON public.email_logs;
CREATE POLICY "Super admins can see all email logs" 
ON public.email_logs FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
));

-- Users can see their own logs
DROP POLICY IF EXISTS "Users can see their own email logs" ON public.email_logs;
CREATE POLICY "Users can see their own email logs" 
ON public.email_logs FOR SELECT 
TO authenticated
USING (recipient = (SELECT email FROM public.profiles WHERE profiles.id = auth.uid()));

-- Everyone can insert logs
DROP POLICY IF EXISTS "Everyone can insert email logs" ON public.email_logs;
CREATE POLICY "Everyone can insert email logs" 
ON public.email_logs FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE email_logs;
