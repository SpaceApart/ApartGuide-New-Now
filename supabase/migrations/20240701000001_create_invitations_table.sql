-- Create invitations table to store temporary credentials
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  team_type TEXT NOT NULL,
  temp_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  used BOOLEAN DEFAULT FALSE
);

-- Enable realtime for invitations
ALTER PUBLICATION supabase_realtime ADD TABLE invitations;
