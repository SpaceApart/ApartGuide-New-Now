-- Drop and recreate email_logs table with proper structure and permissions
DROP TABLE IF EXISTS public.email_logs;

CREATE TABLE public.email_logs (
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
CREATE POLICY "Super admins can see all email logs" 
ON public.email_logs FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
));

-- Users can see their own logs
CREATE POLICY "Users can see their own email logs" 
ON public.email_logs FOR SELECT 
TO authenticated
USING (recipient = (SELECT email FROM public.profiles WHERE profiles.id = auth.uid()));

-- Everyone can insert logs
CREATE POLICY "Everyone can insert email logs" 
ON public.email_logs FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE email_logs;

-- Create super admin user
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'kontakt@apartguide.pl',
  '{"role": "super_admin", "firstName": "Super", "lastName": "Admin"}',
  now(),
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- Create profile for super admin
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'firstName', 
  raw_user_meta_data->>'lastName', 
  'super_admin', 
  created_at, 
  updated_at
FROM auth.users 
WHERE email = 'kontakt@apartguide.pl'
ON CONFLICT (id) DO NOTHING;
