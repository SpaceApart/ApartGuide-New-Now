-- Naprawia problem z usuwaniem użytkowników
-- Usuwa istniejące polityki, które mogą powodować rekurencję
DROP POLICY IF EXISTS "Users can delete their own data." ON team_members;

-- Tworzy nową politykę dla usuwania członków zespołu
CREATE POLICY "Allow delete team members" 
ON team_members FOR DELETE 
TO authenticated 
USING (true);

-- Upewnia się, że RLS jest włączone dla tabeli team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
