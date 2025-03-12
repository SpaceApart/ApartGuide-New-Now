-- Create a function to send invitation emails when a new invitation is created
CREATE OR REPLACE FUNCTION send_invitation_email()
RETURNS TRIGGER AS $$
BEGIN
  -- This function would typically call an external service to send emails
  -- For now, we'll just log that an email would be sent
  INSERT INTO email_logs (template_name, recipient, subject, status, provider_response)
  VALUES (
    'invitation',
    NEW.email,
    'Zaproszenie do ApartGuide',
    'pending',
    jsonb_build_object('message', 'Email would be sent via Edge Function')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to send invitation emails
DROP TRIGGER IF EXISTS send_invitation_email_trigger ON invitations;
CREATE TRIGGER send_invitation_email_trigger
AFTER INSERT ON invitations
FOR EACH ROW
EXECUTE FUNCTION send_invitation_email();

-- Create a function to send welcome emails when a user is created
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- This function would typically call an external service to send emails
  -- For now, we'll just log that an email would be sent
  INSERT INTO email_logs (template_name, recipient, subject, status, provider_response)
  VALUES (
    'welcome',
    NEW.email,
    'Witaj w ApartGuide',
    'pending',
    jsonb_build_object('message', 'Email would be sent via Edge Function')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to send welcome emails
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON profiles;
CREATE TRIGGER send_welcome_email_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION send_welcome_email();
