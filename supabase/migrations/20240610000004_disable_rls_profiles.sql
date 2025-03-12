-- Całkowicie wyłącza RLS dla tabeli profiles, aby rozwiązać problem z nieskończoną rekurencją

-- Usuń wszystkie istniejące polityki dla tabeli profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

-- Wyłącz RLS całkowicie dla tabeli profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
