-- Create tables and policies for user roles

-- Create properties table if not exists
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_team table for team members assigned to properties
CREATE TABLE IF NOT EXISTS property_team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  team_role TEXT NOT NULL, -- 'cleaning', 'maintenance', 'reception', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_team ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
CREATE POLICY "Super admins can view all profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS "Admins can view profiles of their team members" ON profiles;
CREATE POLICY "Admins can view profiles of their team members"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles admin 
      WHERE admin.id = auth.uid() AND admin.role = 'admin' AND 
      EXISTS (
        SELECT 1 FROM property_team pt 
        WHERE pt.user_id = profiles.id AND 
        EXISTS (SELECT 1 FROM properties p WHERE p.id = pt.property_id AND p.owner_id = admin.id)
      )
    )
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
CREATE POLICY "Super admins can update any profile"
  ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Properties policies
DROP POLICY IF EXISTS "Super admins can view all properties" ON properties;
CREATE POLICY "Super admins can view all properties"
  ON properties FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS "Admins can view their own properties" ON properties;
CREATE POLICY "Admins can view their own properties"
  ON properties FOR SELECT
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Team members can view properties they are assigned to" ON properties;
CREATE POLICY "Team members can view properties they are assigned to"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM property_team pt 
      WHERE pt.property_id = properties.id AND pt.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can insert their own properties" ON properties;
CREATE POLICY "Admins can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (owner_id = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Super admins can insert any property" ON properties;
CREATE POLICY "Super admins can insert any property"
  ON properties FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS "Admins can update their own properties" ON properties;
CREATE POLICY "Admins can update their own properties"
  ON properties FOR UPDATE
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Super admins can update any property" ON properties;
CREATE POLICY "Super admins can update any property"
  ON properties FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS "Admins can delete their own properties" ON properties;
CREATE POLICY "Admins can delete their own properties"
  ON properties FOR DELETE
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Super admins can delete any property" ON properties;
CREATE POLICY "Super admins can delete any property"
  ON properties FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Property team policies
DROP POLICY IF EXISTS "Super admins can view all property teams" ON property_team;
CREATE POLICY "Super admins can view all property teams"
  ON property_team FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS "Admins can view teams for their properties" ON property_team;
CREATE POLICY "Admins can view teams for their properties"
  ON property_team FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p 
      WHERE p.id = property_team.property_id AND p.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members can view their own assignments" ON property_team;
CREATE POLICY "Team members can view their own assignments"
  ON property_team FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage teams for their properties" ON property_team;
CREATE POLICY "Admins can manage teams for their properties"
  ON property_team FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties p 
      WHERE p.id = property_team.property_id AND p.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Super admins can manage all property teams" ON property_team;
CREATE POLICY "Super admins can manage all property teams"
  ON property_team FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Create trigger to update profiles on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table properties;
alter publication supabase_realtime add table property_team;
