-- Dodaj politykę dostępu do tabeli profiles dla zaproszeń

-- Usuń istniejącą politykę, jeśli istnieje
DROP POLICY IF EXISTS "Allow public read access" ON profiles;

-- Dodaj nową politykę umożliwiającą odczyt dla wszystkich
CREATE POLICY "Allow public read access"
ON profiles FOR SELECT
USING (true);

-- Dodaj politykę umożliwiającą tworzenie zaproszeń przez administratorów
CREATE POLICY "Allow admin invites"
ON profiles FOR INSERT
WITH CHECK (auth.role() = 'service_role');
