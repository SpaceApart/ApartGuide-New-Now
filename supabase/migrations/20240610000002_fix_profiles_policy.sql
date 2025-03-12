-- Naprawia problem z nieskończoną rekurencją w politykach dla tabeli profiles

-- Usuń wszystkie istniejące polityki dla tabeli profiles
DROP POLICY IF EXISTS "Users can view their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

-- Utwórz prostsze polityki bez rekurencji
CREATE POLICY "Enable read access for all users" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable update for users based on id" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Upewnij się, że RLS jest włączone
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Dodaj brakujący trigger do automatycznego tworzenia profili
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'role', 'guest')::public.user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sprawdź czy trigger już istnieje, jeśli nie, utwórz go
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
