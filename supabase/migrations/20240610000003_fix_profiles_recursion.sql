-- Naprawia problem z nieskończoną rekurencją w politykach dla tabeli profiles

-- Usuń wszystkie istniejące polityki dla tabeli profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

-- Wyłącz RLS tymczasowo, aby naprawić problem
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Dodaj prostą politykę dostępu
CREATE POLICY "Public profiles access" 
ON profiles FOR ALL 
USING (true) 
WITH CHECK (true);

-- Włącz RLS ponownie
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
