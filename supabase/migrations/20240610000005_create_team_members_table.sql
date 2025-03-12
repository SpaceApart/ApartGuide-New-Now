-- Tworzy tabelę team_members do zarządzania członkami zespołu

-- Sprawdź czy tabela już istnieje
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  team_type TEXT NOT NULL,
  avatar_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dodaj indeks na email dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS team_members_email_idx ON team_members(email);

-- Dodaj indeks na team_type dla filtrowania
CREATE INDEX IF NOT EXISTS team_members_team_type_idx ON team_members(team_type);

-- Włącz realtime dla tabeli
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;

-- Wyłącz RLS dla tabeli team_members
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
