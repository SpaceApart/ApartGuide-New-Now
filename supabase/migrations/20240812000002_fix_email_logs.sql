-- Drop the table if it exists with issues
DROP TABLE IF EXISTS public.email_logs;

-- Create email_logs table
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE email_logs;
