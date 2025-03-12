-- Add has_account column to team_members table
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS has_account BOOLEAN DEFAULT false;

-- Update the has_account column for existing team members
UPDATE team_members
SET has_account = EXISTS (
  SELECT 1 FROM auth.users WHERE email = team_members.email
);

-- Add a trigger to update has_account when a user is created
CREATE OR REPLACE FUNCTION update_team_member_has_account()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE team_members
  SET has_account = true
  WHERE email = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_team_member_has_account_trigger ON auth.users;

-- Create the trigger
CREATE TRIGGER update_team_member_has_account_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION update_team_member_has_account();
