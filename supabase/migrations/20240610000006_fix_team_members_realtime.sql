-- Naprawia problem z publikacją realtime dla tabeli team_members

-- Usuń tabelę z publikacji realtime
ALTER PUBLICATION supabase_realtime DROP TABLE team_members;

-- Dodaj tabelę do publikacji realtime
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
