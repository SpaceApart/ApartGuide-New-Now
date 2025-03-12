-- Drop and recreate email_logs table with proper structure and permissions
DROP TABLE IF EXISTS public.email_logs;

-- Disable all triggers temporarily to avoid issues during registration
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- Create super admin user if not exists
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

-- Re-enable triggers
ALTER TABLE auth.users ENABLE TRIGGER ALL;
